import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ChartJS.defaults.NegativeTransparentLine = ChartJS.helpers.clone(
//   ChartJS.defaults.line
// );
// ChartJS.controllers.NegativeTransparentLine = ChartJS.controllers.line.extend({
//   update: function () {
//     // get the min and max values
//     var min = Math.min.apply(null, this.chart.data.datasets[0].data);
//     var max = Math.max.apply(null, this.chart.data.datasets[0].data);
//     var yScale = this.getScaleForId(this.getDataset().yAxisID);

//     // figure out the pixels for these and the value 0
//     var top = yScale.getPixelForValue(max);
//     var zero = yScale.getPixelForValue(0);
//     var bottom = yScale.getPixelForValue(min);

//     // build a gradient that switches color at the 0 point
//     var ctx = this.chart.chart.ctx;
//     var gradient = ctx.createLinearGradient(0, top, 0, bottom);
//     var ratio = Math.min((zero - top) / (bottom - top), 1);
//     gradient.addColorStop(0, "rgba(75,192,192,0.4)");
//     gradient.addColorStop(ratio, "rgba(75,192,192,0.4)");
//     gradient.addColorStop(ratio, "rgba(0,0,0,0)");
//     gradient.addColorStop(1, "rgba(0,0,0,0)");
//     this.chart.data.datasets[0].backgroundColor = gradient;

//     return Chart.controllers.line.prototype.update.apply(this, arguments);
//   },
// });

const positiveColor = "rgba(155, 99, 132, 0.5)";
const negativeColor = "rgba(255, 99, 132, 0.5)";

const FlipsPNLChart = ({ flips }) => {
  const [showOutliers, setShowOutliers] = useState(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Profit / Loss overview of Flips",
      },
      scales: {
        x: {
          stacked: true,
        },
      },
    },
  };
  // First, extract all of the "value" attributes from the objects in the array
  // and create a new array containing only these values
  const values = flips.map((object) => object.difference);

  // Next, sort the array of values in ascending order
  values.sort((a, b) => a - b);

  // Then, calculate the quartiles Q1, Q2, and Q3
  const Q1 = values[Math.floor(values.length / 100)];
  const Q2 = values[Math.floor(values.length / 2)];
  const Q3 = values[Math.floor((90 * values.length) / 100)];

  // Next, calculate the interquartile range (IQR)
  const IQR = Q3 - Q1;

  // Finally, identify and remove any values in the original array of objects
  // that are less than Q1 - 1.5 * IQR or greater than Q3 + 1.5 * IQR
  const filteredFlips = flips.filter((object) => {
    return (
      object.difference >= Q1 - 1.5 * IQR && object.difference <= Q3 + 1.5 * IQR
    );
  });

  //ALL FLIPS
  const flipChartDataDifference = flips.map((flip) => {
    return flip.difference;
  });
  const flipChartDataPercentage = flips.map((flip) => {
    return flip.percentage;
  });
  const flipChartLabels = flips.map((flip) => {
    return new Date(flip.dateExited).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  //FILTERED OUTLIERS
  const filteredFlipChartDataDifference = filteredFlips.map((flip) => {
    return flip.difference;
  });
  const filteredFlipChartDataPercentage = filteredFlips.map((flip) => {
    return flip.percentage;
  });
  const filteredFlipChartLabels = filteredFlips.map((flip) => {
    return new Date(flip.dateExited).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });
  const labels = showOutliers
    ? flipChartLabels.reverse()
    : filteredFlipChartLabels.reverse();

  const dataPNLFiltered = {
    labels,
    datasets: [
      {
        label: "P/L",
        data: filteredFlipChartDataDifference,
        backgroundColor: "rgba(0, 0, 132, 0.9)",
      },
    ],
  };

  const dataPercentageFiltered = {
    filteredFlipChartLabels,
    datasets: [
      {
        label: "Percentage",
        data: filteredFlipChartDataPercentage,
        backgroundColor: "rgba(0, 299, 132, 0.9)",
      },
    ],
  };

  const dataPNL = {
    labels,
    datasets: [
      {
        label: "P/L",
        data: flipChartDataDifference,
        backgroundColor: "rgba(0, 0, 132, 0.9)",
      },
    ],
  };
  const dataPercentage = {
    flipChartLabels,
    datasets: [
      {
        label: "Percentage",
        data: flipChartDataPercentage,
        backgroundColor: "rgba(0, 299, 132, 0.9)",
      },
    ],
  };
  return (
    <>
      {filteredFlipChartDataDifference.length !==
        flipChartDataDifference.length && (
        <button
          className="bg-slate-900 text-white px-4 py-2 rounded"
          onClick={() => setShowOutliers(!showOutliers)}
        >
          {showOutliers ? "Hide outliers" : "Show outliers"}
        </button>
      )}
      <Bar options={options} data={showOutliers ? dataPNL : dataPNLFiltered} />
      {/* <Bar options={options} data={dataPercentage} /> */}
    </>
  );
};

export default FlipsPNLChart;
