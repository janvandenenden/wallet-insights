export default function createTradedNFTVariables(tradedNfts) {
  let totalTradedValue = tradedNfts.reduce((acc, obj) => {
    if (obj.coin === "ETH" || obj.coin === "WETH") {
      return acc + Number(obj.value);
    } else {
      return acc;
    }
  }, 0);

  let totalSpent = tradedNfts.reduce((acc, obj) => {
    if (obj.coin === "ETH" || obj.coin === "WETH") {
      if (obj.type == "buy" || obj.type == "mint")
        return acc + Number(obj.value);
      else return acc;
    } else {
      return acc;
    }
  }, 0);

  let totalReceived = tradedNfts.reduce((acc, obj) => {
    if (obj.coin === "ETH" || obj.coin === "WETH") {
      if (obj.type == "sell") {
        return acc + Number(obj.value);
      } else return acc;
    } else {
      return acc;
    }
  }, 0);

  let lastMinted =
    tradedNfts && tradedNfts.filter((trade) => trade.type == "mint");
  let tradedNFTVariables = {
    numberOfTradedNFTs: tradedNfts.length,
    numberOfBuys: tradedNfts.filter((trade) => trade.type == "buy").length,
    numberOfSells: tradedNfts.filter((trade) => trade.type == "sell").length,
    numberOfMints: tradedNfts.filter((trade) => trade.type == "mint").length,
    totalReceived: totalReceived,
    lastMinted: lastMinted[0]?.date,
    numberOfFreeMints: tradedNfts
      .filter((trade) => trade.type == "mint")
      .filter((trade) => Number(trade.value) == 0).length,
    totalTradedValue: totalTradedValue,
    totalSpent: totalSpent,
    sellToBuyMintRatio:
      tradedNfts.filter((trade) => trade.type == "sell").length /
      (tradedNfts.filter((trade) => trade.type == "buy").length +
        tradedNfts.filter((trade) => trade.type == "mint").length),
  };
  return tradedNFTVariables;
}
