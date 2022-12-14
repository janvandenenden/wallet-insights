import React from "react";

const TradeAnalytics = ({ tradeVariables }) => {
  return (
    <>
      <h1 className="col-span-1 md:col-span-3 mb-12 font-extrabold text-start text-6xl">
        Trade stats
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-4">
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin"># Trades</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.numberOfTradedNFTs}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin"># Buys</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.numberOfBuys}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin"># Sells</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.numberOfSells}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin">Sell ratio</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.sellToBuyMintRatio.toFixed(2)}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin"># Mints</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.numberOfMints}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin"># Free mints</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.numberOfFreeMints}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin">Last minted on</span>
          <span className="text-4xl mt-8 font-extrabold">
            {new Date(tradeVariables.lastMinted).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin">Total traded value</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.totalTradedValue.toFixed(1)} ETH
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin">Total Received</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.totalReceived.toFixed(1)} ETH
          </span>
        </div>
        <div className="rounded bg-gradient-to-t from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 shadowpx-3 py-6 ">
          <span className="block mb-3 font-thin">Total Spent</span>
          <span className="text-4xl mt-8 font-extrabold">
            {tradeVariables.totalSpent.toFixed(1)} ETH
          </span>
        </div>
      </div>
    </>
  );
};

export default TradeAnalytics;
