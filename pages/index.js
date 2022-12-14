import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useUserInfo } from "../hooks/useUserInfo";
import { useNFTData } from "../hooks/useNFTData";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import DataTable from "react-data-table-component";

import TransactionsTable from "../components/TransactionsTable";
import TradedNFTsTable from "../components/TradedNFTsTable";
import TradesTable from "../components/TradesTable";
import NFTFlipsTable from "../components/NFTFlipsTable";
import NFTTable from "../components/NFTTable";
import WalletInfo from "../components/WalletInfo";
import WalletInput from "../components/WalletInput";
import FlipsPNLChart from "../components/FlipsPNLChart";
import BuySellMintChart from "../components/BuySellMintChart";
import FlipAnalytics from "../components/FlipAnalytics";
import TradeAnalytics from "../components/TradeAnalytics";

import formatTransactionData from "../functions/formatTransactionData";
import createTradesArray from "../functions/createTradesArray";
import createFlipsArray from "../functions/createFlipsArray";
import createFlipsVariables from "../functions/createFlipsVariables";
import checkForNFTTrade from "../functions/checkForNFTTrade";
import checkForNFTs from "../functions/checkForNFTs";
import createTradedNFTVariables from "../functions/createTradedNFTVariables";
import loadingImage from "../public/calculating.gif";

export default function Home() {
  const [showTransactions, setShowTransactions] = useState(false);
  const [showNFTTrades, setShowNFTTrades] = useState(false);
  const [showTradedNFTs, setShowTradedNFTs] = useState(false);
  const [showNFTFlips, setShowNFTFlips] = useState(true);
  const [showNFTCollection, setShowNFTCollection] = useState(false);
  const [mode, setMode] = useState("light");
  const [wallet, setWallet] = useState("");

  const {
    transactionData,
    nftData,
    walletBalance,
    resolvedWallet,
    resolvedWalletMemo,
    loading,
    error,
  } = useUserInfo(wallet);
  // FORMAT TRANSACTIONDATA

  useMemo(() => {
    if (transactionData && wallet) {
      formatTransactionData(transactionData, resolvedWallet);
    }
  }, [transactionData, resolvedWallet]);

  //CREATE SUBSET OF NFT TRADES
  const groupedArray = useMemo(
    () =>
      transactionData &&
      transactionData.reduce((acc, obj) => {
        if (!acc[obj.group]) {
          acc[obj.group] = [];
        }
        acc[obj.group].push(obj);
        return acc;
      }, {}),
    [transactionData]
  );

  //CREATE ARRAY WITH ALL TRANSACTIONS CONTAINING NFTS, THESE INCLUDE NFTS THAT PEOPLE SENT YOU OR AIRDROPPED YOU OR YOU SENT SOMEONE
  const NFTtransactions = useMemo(
    () =>
      transactionData &&
      Object.values(groupedArray)
        .filter(checkForNFTs)
        .map((group) => {
          return group;
        }),
    [groupedArray]
  );

  //CREATE ARRAY WITH ALL TRANSACTIONS CONTAINING NFTS TRADES, THESE ONLY INLCUDE THE ONES YOU BOUGHT OR SOLD
  const nftBuysAndSells = useMemo(
    () => NFTtransactions && NFTtransactions.filter(checkForNFTTrade),
    [NFTtransactions]
  );

  const trades = useMemo(
    () => nftBuysAndSells && createTradesArray(nftBuysAndSells),
    [nftBuysAndSells]
  );

  const addInfoToNFTs = (A, B) => {
    for (const itemA of A) {
      for (const itemB of B) {
        for (const asset of itemB.assets) {
          if (itemA?.contract?.address === asset?.contract) {
            // Add the information from itemA to the asset in itemB
            asset.title = itemA.title;
            asset.description = itemA.description;
            asset.tokenUri = itemA.tokenUri;
            asset.media = itemA.media;
            asset.nftMetadata = itemA.rawMetadata;
            asset.contract = itemA.contract;
            // ... add any other information that you want to add
          }
        }
      }
    }
  };

  nftData.map((nft) => {
    return (nft.formattedAsset = `${nft.contract.address}-${nft.tokenId}`);
  });

  nftData && trades && addInfoToNFTs(nftData, trades);

  const { mergedFlips, tradedNfts } = useMemo(
    () => createFlipsArray(trades),
    [trades]
  );

  const cleanedFlips = mergedFlips.filter(
    (obj) =>
      (obj.coinEntered === "WETH" && obj.coinExited === "WETH") ||
      (obj.coinEntered === "WETH" && obj.coinExited === "ETH") ||
      (obj.coinEntered === "ETH" && obj.coinExited === "WETH") ||
      (obj.coinEntered === "ETH" && obj.coinExited === "ETH")
  );

  const flipsVariables = createFlipsVariables(cleanedFlips);
  const tradedNFTVariables = createTradedNFTVariables(tradedNfts);

  const nftDataWithBuyInfo =
    nftData &&
    tradedNfts &&
    nftData.map((item) => {
      // Find the matching object in `a` using the `Array.prototype.find()` method
      const matchingObjects = tradedNfts.filter(
        (aItem) =>
          aItem.formattedAsset === item.formattedAsset && aItem.type !== "sell"
      );

      // If a matching object was found, add the data from `a` to the current object in `b`
      if (matchingObjects.length > 0) {
        return {
          ...item,
          value: matchingObjects[0].value,
          coin: matchingObjects[0].coin,
          date: matchingObjects[0].date,
        };
      }

      // If no matching object was found, return the original object from `b`
      return item;
    });

  const getTradedNFTContracts = (flips) => {
    let contracts = [];
    flips.map((flip) => {
      contracts.push(flip.contract);
    });
    contracts = contracts.filter(
      (elem, index, arr) => arr.indexOf(elem) === index
    );
    return contracts;
  };

  // const contracts = useMemo(
  //   () => mergedFlips && getTradedNFTContracts(mergedFlips),
  //   [mergedFlips]
  // );

  // const config = {
  //   apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  //   network: Network.ETH_MAINNET,
  // };
  // const alchemy = new Alchemy(config);

  // const metaData = useMemo(() => {
  //   if (!contracts) {
  //     return;
  //   }
  //   let metaData = [];
  //   contracts.map((contract) => {
  //     alchemy.nft
  //       .getContractMetadata(contract)
  //       .then((response) => {
  //         metaData.push(response);
  //         // console.log(metaData, "response");
  //         // return response;
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         // Handle any errors here
  //       });
  //   });
  //   return metaData;
  // }, [contracts]);

  // useEffect(() => {
  //   setData(metaData);
  // }, []);

  //DETECT DARK MODE CHANGES
  useEffect(() => {
    // Add listener to update styles
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => setMode(e.matches ? "dark" : "light"));

    // Setup dark/light mode for the first time
    setMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );

    // Remove listener
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-zinc-100 to-violet-100 dark:from-zinc-900 dark:to-violet-900:">
      <div className="container mx-auto py-12 px-2">
        <div className="text-center py-4 md:mb-4">
          <h1 className="text-4xl md:text-7xl font-extrabold mt-12 mb-6">
            Explore NFT flip and trade histories
          </h1>
        </div>
        <WalletInput
          updateWallet={(wallet) => setWallet(wallet)}
          loading={loading}
        />

        {loading && (
          <div className="my-24">
            <Image
              src={loadingImage}
              alt=""
              width="560"
              height="240"
              layout="fixed"
              className="mx-auto"
            />
          </div>
        )}

        {walletBalance && !loading && resolvedWallet && (
          <WalletInfo
            walletBalance={walletBalance}
            transactionData={transactionData}
            wallet={resolvedWallet}
            flipsVariables={flipsVariables}
            tradedNFTVariables={tradedNFTVariables}
          />
        )}
        <div className="">
          {transactionData && !loading && resolvedWallet && (
            <div className="">
              <button
                className={`${
                  showTransactions
                    ? "text-white mr-3 bg-slate-800 dark:bg-slate-400 dark:text-slate-900"
                    : "border  text-slate-800 dark:text-slate-400 mr-2"
                } px-4 py-2 mx-auto rounded border border-slate-800 dark:border-slate-400 mr-3  mb-3`}
                onClick={() => {
                  setShowTransactions(!showTransactions),
                    setShowNFTTrades(false),
                    setShowTradedNFTs(false);
                  setShowNFTFlips(false);
                  setShowNFTCollection(false);
                }}
              >
                All Transactions
              </button>

              <button
                className={`${
                  showNFTTrades
                    ? "text-white mr-3 bg-slate-800 dark:bg-slate-400 dark:text-slate-900"
                    : "border  text-slate-800 dark:text-slate-400 mr-2"
                } px-4 py-2 mx-auto rounded border border-slate-800 dark:border-slate-400 mr-3  mb-3`}
                onClick={() => {
                  setShowTransactions(false),
                    setShowNFTTrades(!showNFTTrades),
                    setShowTradedNFTs(false);
                  setShowNFTFlips(false);
                  setShowNFTCollection(false);
                }}
              >
                NFT Transfers
              </button>

              <button
                className={`${
                  showNFTCollection
                    ? "text-white mr-3 bg-slate-800 dark:bg-slate-400 dark:text-slate-900"
                    : "border  text-slate-800 dark:text-slate-400 mr-2"
                } px-4 py-2 mx-auto rounded border border-slate-800 dark:border-slate-400 mr-3  mb-3`}
                onClick={() => {
                  setShowTransactions(false),
                    setShowNFTTrades(false),
                    setShowTradedNFTs(false);
                  setShowNFTFlips(false);
                  setShowNFTCollection(!showNFTCollection);
                }}
              >
                NFT collection
              </button>

              <button
                className={`${
                  showTradedNFTs
                    ? "text-white mr-3 bg-slate-800 dark:bg-slate-400 dark:text-slate-900"
                    : "border  text-slate-800 dark:text-slate-400 mr-2"
                } px-4 py-2 mx-auto rounded border border-slate-800 dark:border-slate-400 mr-3  mb-3`}
                onClick={() => {
                  setShowTransactions(false),
                    setShowNFTTrades(false),
                    setShowTradedNFTs(!showTradedNFTs);
                  setShowNFTFlips(false);
                  setShowNFTCollection(false);
                }}
              >
                Traded NFTs
              </button>
              <button
                className={`${
                  showNFTFlips
                    ? "text-white mr-3 bg-slate-800 dark:bg-slate-400 dark:text-slate-900"
                    : "border  text-slate-800 dark:text-slate-400 mr-2"
                } px-4 py-2 mx-auto rounded border border-slate-800 dark:border-slate-400 mr-3  mb-3`}
                onClick={() => {
                  setShowTransactions(false),
                    setShowNFTTrades(false),
                    setShowTradedNFTs(false);
                  setShowNFTFlips(!showNFTFlips);
                  setShowNFTCollection(false);
                }}
              >
                NFT Flips
              </button>

              {showTransactions && (
                <>
                  <TransactionsTable
                    transactions={transactionData}
                    wallet={resolvedWallet}
                  />
                </>
              )}
              {nftData && !loading && resolvedWallet && showNFTCollection && (
                <NFTTable
                  wallet={resolvedWallet}
                  nftData={nftDataWithBuyInfo}
                />
              )}

              {showNFTTrades && NFTtransactions && (
                <TradesTable trades={NFTtransactions} wallet={resolvedWallet} />
              )}

              {showTradedNFTs && tradedNfts && (
                <div className="my-12">
                  <TradeAnalytics tradeVariables={tradedNFTVariables} />

                  <div className="my-24">
                    <h1 className="mb-12 font-extrabold text-start text-6xl">
                      Trade history
                    </h1>
                    <TradedNFTsTable
                      tradedNfts={tradedNfts}
                      wallet={resolvedWallet}
                    />
                  </div>
                  <BuySellMintChart tradedNfts={tradedNfts} />
                </div>
              )}

              {showNFTFlips && cleanedFlips && (
                <div className="my-12">
                  <FlipAnalytics flipsVariables={flipsVariables} />

                  <div className="my-24">
                    <h1 className="mb-12 font-extrabold text-start text-6xl">
                      Flip history
                    </h1>
                    <NFTFlipsTable
                      flips={cleanedFlips}
                      wallet={resolvedWallet}
                    />
                  </div>
                  <FlipsPNLChart flips={cleanedFlips} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
