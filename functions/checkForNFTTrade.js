export default function checkForNFTTrade(transactions) {
  let hasExternalOrInternal = false;
  transactions.map((transaction) => {
    if (
      transaction.category === "external" ||
      transaction.category === "internal" ||
      transaction.category === "erc20"
    ) {
      if (transaction.category === "erc20") {
        if (transaction.asset === "WETH" && !hasExternalOrInternal) {
          hasExternalOrInternal = true;
        }
      }

      hasExternalOrInternal = true;
    } else if (
      transaction.category === "erc721" ||
      transaction.category === "erc1155"
    ) {
      if (
        transaction.type === "Received" &&
        transaction.fromTo === "0x0000000000000000000000000000000000000000"
      ) {
        hasExternalOrInternal = true;
      }
    }
  });
  if (hasExternalOrInternal) {
    return transactions;
  }
}
