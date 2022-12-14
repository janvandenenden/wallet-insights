export default function checkForNFTs(transactions) {
  let hasNFT = false;
  transactions.map((transaction) => {
    if (
      transaction.category === "erc721" ||
      transaction.category === "erc1155"
    ) {
      hasNFT = true;
    }
  });
  if (hasNFT) {
    return transactions;
  }
}
