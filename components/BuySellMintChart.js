import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const positiveColor = "rgba(155, 99, 132, 0.5)";
const negativeColor = "rgba(255, 99, 132, 0.5)";

const BuySellMintChart = ({ tradedNfts }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Buys, Sells & Mints overview",
      },
      scales: {
        // x: {
        //   stacked: true,
        // },
      },
    },
  };

  // First, extract all of the "value" attributes from the objects in the array
  // and create a new array containing only these values
  const values = tradedNfts.map((object) => object.value);

  // Next, sort the array of values in ascending order
  values.sort((a, b) => a - b);

  // Then, calculate the quartiles Q1, Q2, and Q3
  const Q1 = values[Math.floor(values.length / 100)];
  const Q2 = values[Math.floor(values.length / 2)];
  const Q3 = values[Math.floor((95 * values.length) / 100)];

  // Next, calculate the interquartile range (IQR)
  const IQR = Q3 - Q1;

  // Finally, identify and remove any values in the original array of objects
  // that are less than Q1 - 1.5 * IQR or greater than Q3 + 1.5 * IQR
  const filteredTradedNfts = tradedNfts.filter((object) => {
    return object.value >= Q1 - 1.5 * IQR && object.value <= Q3 + 1.5 * IQR;
  });

  const labels = tradedNfts
    .filter((trade) => trade.coin === "WETH" || trade.coin === "ETH")
    .map((trade) => {
      return new Date(trade.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    })
    .reverse();

  const createCumulativeMints = (filteredTradedNfts) => {
    let counter = 0;
    let result = [];
    filteredTradedNfts
      .filter((trade) => trade.coin === "WETH" || trade.coin === "ETH")
      .map((trade) => {
        if (trade.type === "mint") {
          counter += Number(-trade.value);
          result.push(counter);
        } else {
          result.push(counter);
        }
      });
    return result;
  };
  const createCumulativeBuys = (filteredTradedNfts) => {
    let counter = 0;
    let result = [];
    filteredTradedNfts
      .filter((trade) => trade.coin === "WETH" || trade.coin === "ETH")
      .map((trade) => {
        if (trade.type === "buy" || trade.type === "mint") {
          counter += Number(-trade.value);
          result.push(counter);
        } else {
          result.push(counter);
        }
      });
    return result;
  };
  const createCumulativeSells = (filteredTradedNfts) => {
    let counter = 0;
    let result = [];
    filteredTradedNfts
      .filter((trade) => trade.coin === "WETH" || trade.coin === "ETH")
      .map((trade) => {
        if (trade.type === "sell") {
          counter += Number(trade.value);
          result.push(counter);
        } else {
          result.push(counter);
        }
      });
    return result;
  };

  const cumulativeMintValue = createCumulativeMints(tradedNfts);
  const cumulativeBuyValue = createCumulativeBuys(tradedNfts);
  const cumulativeSellValue = createCumulativeSells(tradedNfts);

  const buys = filteredTradedNfts
    .filter((trade) => trade.coin === "WETH" || trade.coin === "ETH")
    .map((trade) => {
      if (trade.type === "buy") {
        return Number(-trade.value);
      } else {
        return;
      }
    });

  const sells = filteredTradedNfts
    .filter((trade) => trade.coin === "WETH" || trade.coin === "ETH")
    .map((trade) => {
      if (trade.type === "sell") {
        return Number(trade.value);
      } else {
        return;
      }
    });

  const BuySellMintData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "mints",
        data: cumulativeMintValue,
        backgroundColor: "rgba(0, 0, 132, 0.8)",
      },
      {
        label: "sells",
        fill: true,

        data: cumulativeSellValue,
        backgroundColor: "rgba(100, 0, 132, 0.5)",
      },
      {
        label: "buys + mints",
        fill: true,

        data: cumulativeBuyValue,
        backgroundColor: "rgba(0, 0, 132, 0.5)",
      },
    ],
  };
  //   const dataPercentage = {
  //     labels,
  //     datasets: [
  //       {
  //         label: "Percentage",
  //         data: flipChartDataPercentage,
  //         backgroundColor: "rgba(0, 299, 132, 0.9)",
  //       },
  //     ],
  //   };
  return (
    <>
      <Line options={options} data={BuySellMintData} />
      {/* <Bar options={options} data={dataPercentage} /> */}
    </>
  );
};

export default BuySellMintChart;
