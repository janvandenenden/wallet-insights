import { useState, useEffect, useMemo } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";

export function useUserInfo(walletAddress) {
  // Define state variables to store the NFT data and any errors that occur
  const [nftData, setNFTData] = useState([]);
  const [transactionData, setTransactionData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolvedWallet, setResolvedWallet] = useState(null);

  //SET UP ALCHEMY
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const fetchAddressFromENSName = async (walletAddress) => {
    let resolvedAddress = "";
    if (walletAddress === null) {
      return;
    } else {
      if (ethers.utils.isAddress(walletAddress)) {
        resolvedAddress = walletAddress;
      } else {
        try {
          const _resolvedAddress = await alchemy.core.resolveName(
            walletAddress
          );
          resolvedAddress = _resolvedAddress;
        } catch (err) {
          resolvedAddress = null;
          setError(err);
        }
      }
      setResolvedWallet(resolvedAddress);
    }
    return resolvedAddress;
  };

  useEffect(() => {
    if (!walletAddress) {
      return;
    }
    setLoading(true);
    Promise.all([fetchAddressFromENSName(walletAddress)]).then((res) => {
      console.log(typeof res[0]);
      console.log(res[0]);
      !res[0] && setLoading(false);
    });
  }, [walletAddress]);

  const resolvedWalletMemo = useMemo(() => {
    return resolvedWallet;
  }, [resolvedWallet]);

  // GET ALL TRANSFERS FROM AND TO WALLET ADDRESS
  const fetchTransactionHistory = async (walletAddress) => {
    const transfersTo = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: walletAddress,
      category: [
        "external",
        "internal",
        "specialnft",
        "erc20",
        "erc721",
        "erc1155",
      ],
      withMetadata: true,
      excludeZeroValue: true,
      order: "desc",
    });

    const transfersFrom = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: walletAddress,
      category: [
        "external",
        "internal",
        "specialnft",
        "erc20",
        "erc721",
        "erc1155",
      ],
      withMetadata: true,
      excludeZeroValue: true,
      order: "desc",
    });

    let allTransfers = [];
    if (transfersTo && transfersFrom) {
      allTransfers = [...transfersTo.transfers, ...transfersFrom.transfers];
    }
    setTransactionData(allTransfers);
  };

  // GET ALL NFTS FROM WALLET ADDRESS
  const fetchNFTs = async (walletAddress, pageKey) => {
    if (!walletAddress) {
      return;
    }
    const options = {
      filters: ["SPAM", "AIRDROPS"],
      tokenUriTimeoutInMs: 500,
    };
    // if (pageKey) {
    //   options.pageKey = pageKey;
    // }
    // const data = await alchemy.nft.getNftsForOwner(walletAddress, options);
    // let nftData = data.ownedNfts;
    // if (data.pageKey) {
    //   // Fetch more data using the pageKey
    //   const moreData = await fetchNFTs(walletAddress, data.pageKey);
    //   nftData = nftData.concat(moreData);
    // }

    // setNFTData(nftData);
    // return nftData;
    // // setNFTData(nftData);
    if (pageKey) {
      options.pageKey = pageKey;
    }
    let nftData = [];
    let moreData = true;

    // Loop until all data has been fetched
    while (moreData) {
      const data = await alchemy.nft.getNftsForOwner(walletAddress, options);
      nftData = nftData.concat(data.ownedNfts);

      // Update the pageKey and moreData flag
      if (data.pageKey) {
        options.pageKey = data.pageKey;
        moreData = true;
      } else {
        moreData = false;
      }
    }

    setNFTData(nftData);
    return nftData;
  };

  // GET ETH & ERC20 TOKENS BALANCE
  const fetchWalletBalance = async (walletAddress) => {
    //ETH BALANCE
    let EthBalance = await alchemy.core.getBalance(walletAddress, "latest");
    const formattedEthBalance = new Number(
      Utils.formatEther(EthBalance)
    ).toFixed(4);

    const totalBalance = {
      ETH: formattedEthBalance,
    };

    //ERC20 TOKENS
    const tokenBalances = await alchemy.core.getTokenBalances(walletAddress);

    // Remove tokens with zero balance
    const nonZeroBalances = tokenBalances.tokenBalances.filter((token) => {
      return token.tokenBalance >= "0";
    });

    // Loop through all tokens with non-zero balance
    for (let token of nonZeroBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );

      const tokenName = metadata.symbol;
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(4);
      totalBalance[tokenName] = balance;
    }
    setWalletBalance(totalBalance);
  };

  useEffect(() => {
    if (!resolvedWalletMemo) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchTransactionHistory(resolvedWalletMemo),
      fetchNFTs(resolvedWalletMemo),
      fetchWalletBalance(resolvedWalletMemo),
    ]).then(() => {
      setLoading(false);
    });
  }, [resolvedWalletMemo]);

  return {
    transactionData,
    nftData,
    walletBalance,
    resolvedWallet,
    resolvedWalletMemo,
    loading,
    error,
  };
}
