import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useNFTInfo } from "../hooks/useNFTInfo";
import { useState, useRef, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import { BLOCKED_PAGES } from "next/dist/shared/lib/constants";

export default function Home() {
  const [showTransactions, setShowTransactions] = useState(false);
  const [wallet, setWallet] = useState(
    "0xFE789d706bB84fECFa55095B8A8380D836A6aD3a"
  );
  const walletInput = useRef();
  const { transactionData, nftData, walletBalance, error } = useNFTInfo(wallet);
  const columns = [
    {
      name: "Group",
      selector: (row) => row.group,
      sortable: true,
      wrap: true,
      omit: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.metadata.blockTimestamp,
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => row.to,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => row.from,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Asset",
      selector: (row) => row.asset,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
  ];
  // console.log(transactionData);
  const filteredTokens =
    walletBalance &&
    Object.keys(walletBalance).filter(
      (coin) =>
        (new Number(walletBalance[coin]) >= 0.001 && coin == "ETH") ||
        coin == "DAI" ||
        coin == "WETH" ||
        coin == "TETH" ||
        coin == "APE" ||
        coin == "USDC"
    );

  transactionData &&
    transactionData.sort((a, b) => {
      // Convert the blockTimestamp strings to Date objects
      const dateA = new Date(a.metadata.blockTimestamp);
      const dateB = new Date(b.metadata.blockTimestamp);

      // Compare the dates and return a value indicating the order of the elements
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });

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

  transactionData && addGroupAttribute(transactionData);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { value } = walletInput.current;
    setWallet(value);
  }, []);

  const conditionalRowStyles = [
    {
      when: (row) => row.to == wallet.toLowerCase(),
      style: {
        color: "green",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    {
      when: (row) => row.group % 2 == 0,
      style: {
        // backgroundColor: "whitesmoke",
        backgroundColor: "lightcyan",

        "&:hover": {
          cursor: "pointer",
        },
      },
      classNames: ["text-extrabold dark"],
    },
    {
      when: (row) => row.group % 2 == 0 && row.to == wallet.toLowerCase(),
      style: {
        // backgroundColor: "whitesmoke",
        backgroundColor: "lightcyan",
        color: "green",

        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];
  console.log(transactionData);

  const [mode, setMode] = useState("light");

  useEffect(() => {
    // Add listener to update styles
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => setMode(e.matches ? "dark" : "light"));

    // Setup dark/light mode for the first time
    setMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );

    // Remove listener
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);
  return (
    <>
      <div className="container mx-auto px-2">
        <div className="text-center py-4">
          <h1 className="text-5xl font-extrabold mt-12">Wallet Insights</h1>
          <p className="text-center font-thin text-xl mt-4">
            Enter your Ethereum Wallet Address our ENS name
          </p>
        </div>
        <form className="flex flex-col justify-center">
          <input
            ref={walletInput}
            className="border border-slate-800 px-4 py-2 w-1/2 my-5 shadow-lg mx-auto rounded"
          ></input>
          <button
            className="py-3 px-5 bg-slate-800 text-white rounded shadow-md mx-auto uppercase font-bold w-1/2"
            onClick={(e) => handleSubmit(e)}
          >
            Get data
          </button>
        </form>
        {walletBalance && (
          <div className="my-12 bg-gray-300 p-4 py-8 rounded-xl grid lg:grid-cols-2">
            <div>
              <h1 className="text-5xl mb-8 font-extrabold border border-transparent border-b-black border-b-4 py-2">
                Wallet balance
              </h1>
              <ul>
                {filteredTokens.map((key) => (
                  <li className="text-xl my-3" key={key}>
                    {key}: {walletBalance[key]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-2">
              <p>
                Last transaction: {transactionData[0].metadata.blockTimestamp}
              </p>
              <p>
                First transaction:{" "}
                {
                  transactionData[`${transactionData.length - 1}`].metadata
                    .blockTimestamp
                }
              </p>
            </div>
          </div>
        )}
        <div>
          {transactionData && (
            <>
              {showTransactions ? (
                <button
                  className="px-4 py-2 text-xl mx-auto rounded text-white bg-slate-800 mb-3"
                  onClick={() => setShowTransactions(!showTransactions)}
                >
                  hide transactions
                </button>
              ) : (
                <button
                  className="px-4 py-2 text-xl mx-auto rounded text-white bg-slate-800 mb-3"
                  onClick={() => setShowTransactions(!showTransactions)}
                >
                  Show transactions
                </button>
              )}

              {showTransactions ? (
                <DataTable
                  columns={columns}
                  data={transactionData}
                  pagination
                  conditionalRowStyles={conditionalRowStyles}
                  fixedHeader
                />
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
