import React from "react";
import { FaEthereum } from "react-icons/fa";
import ActivityIndicator from "./ActivityIndicator";
const WalletInfo = ({
  walletBalance,
  transactionData,
  wallet,
  flipsVariables,
  tradedNFTVariables,
}) => {
  //CALCULATE DAYS SINCE LAST TRANSACTED
  //CALCULATE WALLET AGE
  const walletAge = (transactions) => {
    const timeDifference =
      new Date().getTime() -
      new Date(
        transactions[transactions.length - 1]?.metadata.blockTimestamp
      ).getTime();
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return (
      <p className="text-sm font-thin mt-12">{`Wallet created ${days} days ago`}</p>
    );
  };

  // FILTER ERC20 TOKENS
  const filterTokens = () => {
    const result = [];
    const allowedTokens = [
      "ETH",
      "DAI",
      "WETH",
      "TETH",
      "APE",
      "LOOKS",
      "X2Y2",
      "USDC",
    ];
    for (const key in walletBalance) {
      if (walletBalance[key] > 0.01 && allowedTokens.includes(key)) {
        result.push(key);
      }
    }
    return result;
  };

  const filteredTokens = filterTokens(walletBalance);

  return (
    <div className="my-12 bg-gradient-to-r from-gray-200 to-slate-200 dark:from-slate-800 dark:to-neutral-800 p-4 py-8 rounded-xl grid lg:grid-cols-2">
      <div className="col-span-2 flex flex-col md:flex-row md:items-center">
        <h1 className="text-xl md:text-5xl font-extrabold py-2 inline">
          {`${wallet.substring(0, 4)}...${wallet.substring(
            wallet.length - 2,
            wallet.length
          )} `}
        </h1>
        <div className="md:ml-auto inline">
          <ActivityIndicator transactions={transactionData} wallet={wallet} />
        </div>
      </div>
      {filterTokens && (
        <div>
          <ul>
            {filteredTokens?.map((key) => (
              <li
                className="text-xl my-3 bg-slate-300 dark:bg-slate-900 rounded px-2 py-3 md:w-1/2"
                key={key}
              >
                {key}: {Number(walletBalance[key]).toFixed(3)}
              </li>
            ))}
          </ul>
          <>
            {wallet ? (transactionData ? walletAge(transactionData) : "") : ""}
          </>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
