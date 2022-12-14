export default function formatTransactionData(transactionData, wallet) {
  if (wallet === null) {
    return;
  } else {
    // GROUP TRANSACTIONS THAT HAPPENED IN 1 BLOCK
    function addGroupAttribute(objects) {
      // Create a map that maps attribute values to group indices
      const valueMap = new Map();
      let nextGroupIndex = 1;
      for (const object of transactionData) {
        const value = object.blockNum;
        if (!valueMap.has(value)) {
          valueMap.set(value, nextGroupIndex);
          nextGroupIndex++;
        }
      }
      // Add the "group" attribute to each object with the same attribute value
      for (const object of transactionData) {
        const value = object.blockNum;
        const groupIndex = valueMap.get(value);
        object.group = groupIndex;
      }
      return objects;
    }

    transactionData.sort((a, b) => {
      // Convert the blockTimestamp strings to Date objects
      const dateA = new Date(a.metadata.blockTimestamp);
      const dateB = new Date(b.metadata.blockTimestamp);
      // Compare the dates and return a value indicating the order of the elements
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });

    //ADD CONTRACT NAMES
    transactionData.map((transfer) => {
      transfer.type = "Sent";
      switch (transfer.to) {
        case wallet.toLowerCase():
          transfer.type = "Received";
          return;
        case "0x83c8f28c26bf6aaca652df1dbbe0e1b56f8baba2":
          transfer.to = "Gem";
        case "0x0a267cf51ef038fc00e71801f5a524aec06e4f07":
          transfer.to = "Genie";
          return;
        case "0x00000000a50bb64b4bbeceb18715748dface08af":
          transfer.to = "Gem";
          return;
        case "0x0000000035634b55f3d99b071b5a354f48e10bef":
          transfer.to = "Gem";
          return;
        case "0x00000000006c3852cbef3e08e8df289169ede581":
          transfer.to = "Opensea";
          return;
        case "0x7f268357a8c2552623316e2562d90e642bb538e5":
          transfer.to = "Opensea";
          return;
        case "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329":
          transfer.to = "Sudoswap";
          return;
        case "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45":
          transfer.to = "Uniswap";
          return;
        case "0xc5e9ddebb09cd64dfacab4011a0d5cedaf7c9bdb":
          transfer.to = "Proof of Humanity";
          return;
        case "0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce":
          transfer.to = "LooksRare";
          return;
        case "0x974caa59e49682cda0ad2bbe82983419a2ecc400":
          transfer.to = "Kraken";
          return;
      }
    });
    let groupedAttributes = addGroupAttribute(transactionData);
    // ADD FROM FROMTO ATTRIBUTE THAT MERGEs FROM AND TO ADDRESS AS 1 OF THEM IS ALWAYS WALLET ADDRESS
    transactionData.map((transfer) => {
      if (transfer.from.toLowerCase() == wallet.toLowerCase()) {
        transfer.fromTo = transfer.to;
      }
      if (transfer.to.toLowerCase() == wallet.toLowerCase()) {
        transfer.fromTo = transfer.from;
      }
    });

    //ADD ATTRUBUTE WITH FORMATTED VALUE
    transactionData.map((transfer) => {
      switch (transfer.category) {
        case "erc721":
          if (
            transfer.rawContract.address.toLowerCase() ===
            "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
          ) {
            transfer.formattedValue = "ENS name";
          } else
            transfer.formattedValue = `${
              transfer.asset == null ? "Unknown" : transfer.asset
            } | ${parseInt(transfer.tokenId)}`;
          break;
        case "erc1155":
          transfer.formattedValue = `${
            transfer.asset == null ? "Unknown" : transfer.asset
          } | ${transfer.category}`;
          break;
        case "external":
        case "internal":
        case "erc20":
          if (typeof transfer.value === "number") {
            transfer.formattedValue = `${Number(transfer.value).toFixed(4)} ${
              transfer.asset
            }`;
          }
          break;
      }
    });
  }
}
