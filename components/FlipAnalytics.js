import React from "react";

const FlipAnalytics = ({ flipsVariables }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-4">
      <h1 className="col-span-1 md:col-span-3 font-extrabold text-start text-6xl">
        Flip stats
      </h1>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin"># flips</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.allFlips}
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin"># flips w / profit</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.positiveFlips}
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin"># flips w / loss</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.negativeFlips}
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin">Profitable flip ratio</span>
        <span className="text-4xl mt-8 font-extrabold">
          {(
            (flipsVariables.positiveFlips / flipsVariables.allFlips) *
            100
          ).toFixed(0)}
          %
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin">Avg flip duration</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.averageDurationInDays} days
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin">Flip balance</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.totalPNL.toFixed(1)} ETH
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin">Avg flip % change</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.averageChange.toFixed(0)}%
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin">Avg positive flip % change</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.averagePositiveChange.toFixed(0)}%
        </span>
      </div>
      <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
        <span className="block mb-3 font-thin">Avg negative flip % change</span>
        <span className="text-4xl mt-8 font-extrabold">
          {flipsVariables.averageNegativeChange.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default FlipAnalytics;
