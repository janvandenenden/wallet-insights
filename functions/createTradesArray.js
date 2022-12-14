//CREATE ARRAY OF TRADES OBJECTS

export default function createTradesArray(groupedTrades) {
  let trades = [];
  groupedTrades.map((transfers) => {
    let trade = {
      type: "",
      assets: [],
    };
    let totalValue = 0;
    trade.date = transfers[0].metadata.blockTimestamp;
    trade.coin = "ETH";
    transfers.map((transfer) => {
      if (transfer.category === "erc721") {
        trade.assets.push({
          asset: transfer.asset,
          tokenId: parseInt(transfer.erc721TokenId),
          fromTo: transfer.fromTo,
          contract: transfer.rawContract.address,
          date: transfer.metadata.blockTimestamp,
          category: transfer.category,
          type:
            transfer.fromTo === "0x0000000000000000000000000000000000000000"
              ? "mint"
              : transfer.type == "Received"
              ? "buy"
              : "sell",
        });
      }
      if (transfer.category === "erc1155") {
        trade.assets.push({
          asset: transfer.asset,
          fromTo: transfer.fromTo,
          tokenId: transfer?.erc1155Metadata[0]?.tokenId,
          contract: transfer.rawContract.address,
          date: transfer.metadata.blockTimestamp,
          category: transfer.category,
          type:
            transfer.fromTo === "0x0000000000000000000000000000000000000000"
              ? "mint"
              : transfer.type == "Received"
              ? "buy"
              : "sell",
        });
      }
      if (
        transfer.category === "external" ||
        (transfer.category === "erc20" && transfer.type === "Sent")
      ) {
        trade.type = "buy";
        totalValue += transfer.value;
      }
      if (transfer.category === "erc20") {
        trade.coin = transfer.asset;
      }
      if (
        transfer.category === "internal" ||
        (transfer.category === "erc20" && transfer.type === "Received")
      ) {
        trade.type = "buy";
        totalValue = totalValue - transfer.value;
      }

      if (
        transfer.category === "erc721" ||
        (transfer.category === "erc1155" && transfer.type === "Sent")
      ) {
        trade.type = "sell";
      }
    });

    trade.value = Math.abs(totalValue);
    trade.assets.length == 1
      ? (trade.priceCertainty = "excellent")
      : trade.assets.every(
          (asset) => asset.contract === trade.assets[0].contract
        )
      ? (trade.priceCertainty = "good")
      : (trade.priceCertainty = "bad");

    trade.assets.map((asset) => {
      asset.value = (trade.value / trade.assets.length).toFixed(3);
    });

    trade.assets.map((asset) => {
      asset.priceCertainty = trade.priceCertainty;
      asset.coin = trade.coin;
      asset.formattedValue = `${asset.value} ${asset.coin}`;
      asset.fromTo === "0x0000000000000000000000000000000000000000"
        ? (asset.type = "mint")
        : "";
      asset.category === "erc721" || asset.category === "erc1155"
        ? (asset.formattedAsset = `${asset.contract}-${asset.tokenId}`)
        : (asset.formattedAsset = asset.contract);
    });
    trades.push(trade);
  });
  trades.map((trade) => {
    if (trade.priceCertainty == "excellent" || trade.priceCertainty == "good") {
      trade.assetOverview = `${trade.assets.length} ${trade.assets[0].asset} `;
    }
  });
  return trades;
}
