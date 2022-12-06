import { useState, useEffect } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";

export function useNFTInfo(walletAddress) {
  // Define state variables to store the NFT data and any errors that occur
  const [nftData, setNFTData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [error, setError] = useState(null);
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  // Use the useEffect hook to make a request to the Alchemy API for each wallet address
  const fetchTransactionHistory = async (walletAddress) => {
    const data = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      //   fromAddress: walletAddress,
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
    if (data && transfersFrom) {
      allTransfers = [...data.transfers, ...transfersFrom.transfers];
    }

    // allTransfers.map((transfer) => {
    //   transfer.metadata.blockTimestamp = new Date(
    //     transfer.metadata.blockTimestamp
    //   ).toLocaleDateString("en-US", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    //   });
    // });
    allTransfers.map((transfer) => {
      transfer.value === null
        ? (transfer.value = "No Value")
        : (transfer.value = Number(transfer.value).toFixed(4));
    });
    allTransfers.map((transfer) => {
      transfer.type = "Sent";
      switch (transfer.to) {
        case walletAddress.toLowerCase():
          transfer.type = "Received";
          return;
        case "0x83c8f28c26bf6aaca652df1dbbe0e1b56f8baba2":
          transfer.to = "Gem";
          return;
        case "0x0a267cf51ef038fc00e71801f5a524aec06e4f07":
          transfer.to = "Genie";
          return;
        case "0x00000000a50bb64b4bbeceb18715748dface08af":
          transfer.to = "Gem";
          return;
        case "0x0000000035634b55f3d99b071b5a354f48e10bef":
          transfer.to = "Gem";
          return;
        case "0x00000000006c3852cbef3e08e8df289169ede581":
          transfer.to = "Opensea";
          return;
        case "0x7f268357a8c2552623316e2562d90e642bb538e5":
          transfer.to = "Opensea";
          return;
        case "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329":
          transfer.to = "Sudoswap";
          return;
        case "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45":
          transfer.to = "Uniswap";
          return;
        case "0xc5e9ddebb09cd64dfacab4011a0d5cedaf7c9bdb":
          transfer.to = "Proof of Humanity";
          return;
        case "0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce":
          transfer.to = "LooksRare";
          return;
        case "0x974caa59e49682cda0ad2bbe82983419a2ecc400":
          transfer.to = "Kraken";
          return;
      }
    });
    setTransactionData(allTransfers);
  };

  const fetchNFTs = async (walletAddress) => {
    const data = await alchemy.nft.getNftsForOwner(walletAddress);
    setNFTData(data.ownedNfts);
  };

  const fetchWalletBalance = async (walletAddress) => {
    let EthBalance = await alchemy.core.getBalance(walletAddress, "latest");
    const formattedEthBalance = new Number(
      Utils.formatEther(EthBalance)
    ).toFixed(4);
    const totalBalance = {
      ETH: formattedEthBalance,
    };
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
      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(4);
      totalBalance[tokenName] = balance;
      //   console.log(`${metadata.name}: ${balance} ${metadata.symbol}`);

      //   console.log(ethers.utils.toNumber(EthBalance), "EthBalance");
    }
    setWalletBalance(totalBalance);
  };

  useEffect(() => {
    fetchTransactionHistory(walletAddress);
    fetchNFTs(walletAddress);
    fetchWalletBalance(walletAddress);
  }, [walletAddress]);
  // Return the NFT data and any errors
  return { transactionData, nftData, walletBalance, error };
}
