import React from "react";
import DataTable from "react-data-table-component";
import etherscanLogo from "../public/etherscan-logo-circle.png";
import Image from "next/image";

const NFTFlipsTable = ({ flips, wallet }) => {
  const dateSort = (rowA, rowB) => {
    const a = new Date(rowA.dateExited);
    const b = new Date(rowB.dateExited);

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };
  // DEFINE COLUMNS FOR DATATABLE
  const columns = [
    {
      name: "Date sold",
      selector: (row) =>
        new Date(row.dateExited).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      sortable: true,
      wrap: true,
      sortFunction: dateSort,
    },
    {
      name: "Asset",
      selector: (row) =>
        row.contract.name
          ? `${row.contract.name} | ${parseInt(row.tokenId)}`
          : row.asset !== null || row.asset !== undefined
          ? `${row.asset} | ${parseInt(row.tokenId)}`
          : row.contract,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
      wrap: true,
    },
    {
      name: "Entered",
      selector: (row) => row.enteredFormatted,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Exited",
      selector: (row) => row.exitedFormatted,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "PNL",
      selector: (row) => `${row.difference.toFixed(3)} ${row.coinEntered}`,
      sortable: true,
    },
    {
      name: "Change",
      selector: (row) => `${row.percentageFormatted}`,
      sortable: true,
    },

    // {
    //   name: "Coin",
    //   selector: (row) => row.coin,
    //   sortable: true,
    // },

    {
      name: "Price certainty",
      selector: (row) => row.priceCertainty,
      sortable: true,
    },
    {
      name: "Etherscan",
      selector: (row) => (
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://etherscan.io/address/${row.contract}`}
        >
          <Image
            alt="etherscan logo"
            src={etherscanLogo}
            width="16"
            height="16"
          />
        </a>
      ),
      sortable: true,
      compact: true,
      wrap: true,
    },
  ];
  // ROW STYLES FOR DATATABLE
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
      when: (row) => row.difference > 0,
      style: {
        // backgroundColor: "whitesmoke",
        backgroundColor: "PaleGreen",

        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];
  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  return (
    <DataTable
      columns={columns}
      data={flips}
      conditionalRowStyles={conditionalRowStyles}
      fixedHeader
      expandableRows
      dense
      pagination
      expandableRowsComponent={ExpandedComponent}
    />
  );
};

export default NFTFlipsTable;
