import React from "react";

const ActivityIndicator = ({ transactions, wallet }) => {
  const days = Math.floor(
    (new Date().getTime() -
      new Date(
        transactions.filter(
          (transaction) => transaction.from === wallet.toLowerCase()
        )[0]?.metadata.blockTimestamp
      ).getTime()) /
      (1000 * 3600 * 24)
  );

  if (days === 0) {
    return (
      <div className="bg-gray-400 rounded-3xl py-2 px-3 inline-block text-center text-white">
        Active today
      </div>
    );
  } else if (days === 1) {
    return (
      <div className="bg-gray-400 rounded-3xl py-2 px-3 inline-block text-center text-white">
        Active 1 day ago
      </div>
    );
  } else {
    return (
      <div className="bg-gray-400 rounded-3xl py-2 px-3 inline-block text-center text-white">
        {`Active ${days} days ago`}
      </div>
    );
  }
};

export default ActivityIndicator;
