import { useState, useEffect } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";

export function useNFTData(contracts) {
  // Define state variables to store the NFT data and any errors that occur
  const [nftMetaData, setNftMetaData] = useState([]);

  const [error, setError] = useState(null);
  const [loadingNFT, setLoadingNFT] = useState(false);

  //SET UP ALCHEMY
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  // GET ALL TRANSFERS FROM AND TO WALLET ADDRESS
  const fetchNFTMetaData = async (contract) => {
    const nftMetaData = await alchemy.nft
      .getContractMetadata(contract)
      .then((res) => {
        setNftMetaData((prevState) => {
          return [...prevState, res];
        });
      });
    const response = await nftMetaData;

    return nftMetaData;
  };

  useEffect(() => {
    if (!contracts) {
      return;
    }
    setLoadingNFT(true);
    async function fetchData() {
      const promises = contracts.map((contract) => {
        fetchNFTMetaData(contract).then((res) => {});
      });
      const nftMetaData = await Promise.all(promises);
      return nftMetaData;
    }
    fetchData();
    setLoadingNFT(false);
  }, []);
  // Return the NFT data and any errors
  return { nftMetaData, loadingNFT, error };
}
