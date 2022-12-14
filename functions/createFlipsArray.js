export default function createFlipsArray(trades) {
  //CREATE ARRAY OF TRADED NFT FROM ALL TRADES
  const tradedNfts = [];
  trades &&
    trades.map((trade) => {
      trade.assets.map((asset) => {
        tradedNfts.push(asset);
      });
    });

  //GROUP TRADED NFTS BY ASSET TO CREATE FLIPS
  const groupedTradedNfts =
    tradedNfts &&
    tradedNfts.reduce((acc, obj) => {
      if (!acc[obj.formattedAsset]) {
        acc[obj.formattedAsset] = [];
      }
      acc[obj.formattedAsset].push(obj);
      return acc;
    }, {});

  //CREATE FLIPS ARRAY WHEN THERE ARE MORE THAN 1 TX FOR AN ASSET
  const NFTFlips = Object.values(groupedTradedNfts).filter(
    (group) => group.length > 1
  );

  function pairObjects(array) {
    // Use the reduce() method to create an object with two properties for the "sell" and "buy" arrays
    const obj = array.reduce(
      (acc, obj) => {
        if (obj.type === "sell") {
          // If the object is a "sell" type, add it to the "sell" array
          acc.sell.push(obj);
        } else if (obj.type === "buy") {
          // If the object is a "buy" type, add it to the "buy" array
          acc.buy.push(obj);
        }

        // Return the object
        return acc;
      },
      { sell: [], buy: [] }
    );

    // Use the map() method to create an array of arrays from the "sell" array
    const paired = obj.sell.map((sellObj) => {
      // Find the first "buy" object that matches the current "sell" object
      const buyObj = obj.buy.find(
        (buyObj) => buyObj.formattedAsset === sellObj.formattedAsset
      );

      // If a matching "buy" object was found, return the "sell" and "buy" objects as an array
      if (buyObj) {
        return [sellObj, buyObj];
      } else {
        return null;
      }
    });

    // Return the paired array
    return paired;
  }

  let buySellPairs = NFTFlips.map((trades) => {
    if (trades.length > 2) {
      return pairObjects(trades);
    }
  });

  buySellPairs = buySellPairs
    .filter((x) => x !== undefined)
    .map((pair) => {
      NFTFlips.push(pair[0]);
    });

  const cleanedFlips = NFTFlips && NFTFlips.filter((arr) => arr?.length == 2);

  const mergedFlips = cleanedFlips.map((trades) => {
    let flip = {};
    if (trades.length == 2) {
      let timeDifference =
        new Date(trades[0].date).getTime() - new Date(trades[1].date).getTime();
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      flip.duration = `${days} days`;
      flip.entered = Number(trades[1].value);
      flip.exited = Number(trades[0].value);
      flip.enteredFormatted = trades[1].formattedValue;
      flip.exitedFormatted = trades[0].formattedValue;
      flip.coinEntered = trades[1].coin;
      flip.coinExited = trades[0].coin;
      flip.dateEntered = trades[1].date;
      flip.dateExited = trades[0].date;
      flip.difference = flip.exited - flip.entered;
      flip.percentage = `${(
        ((flip.exited - flip.entered) / flip.entered) *
        100
      ).toFixed(0)}`;
      flip.category = trades[0].category;
      flip.contract = trades[0].contract;
      flip.tokenId = trades[0].tokenId;
      flip.asset = trades[0].asset;
      flip.priceCertainty = `${trades[0].priceCertainty} | ${trades[1].priceCertainty}`;
      flip.nftMetadata = trades[0].nftMetadata;
      flip.media = trades[0].media;
      flip.tokenUri = trades[0].tokenUri;
      flip.description = trades[0].description;
    } else {
      flip.contract = trades[0].contract;
    }
    return flip;
  });

  const formatPriceCertainty = (priceCertainty) => {
    switch (priceCertainty) {
      case "excellent | excellent":
        return (priceCertainty = "excellent");
      case "good | good":
        return (priceCertainty = "good");
      case "bad | bad":
        return (priceCertainty = "very bad");
      case "excellent | good":
      case "good | excellent":
        return (priceCertainty = "good");
      case "bad | good":
      case "good | bad":
        return (priceCertainty = "bad");
      case "bad | excellent":
      case "excellent | bad":
        return (priceCertainty = "bad");
    }
  };

  mergedFlips &&
    mergedFlips.map((flip) => {
      flip.percentageFormatted =
        flip.percentage == "Infinity"
          ? "Infinity"
          : flip.percentage == "NaN"
          ? "-"
          : `${flip.percentage}%`;
      flip.priceCertainty = formatPriceCertainty(flip.priceCertainty);
    });
  return { mergedFlips, tradedNfts };
}
