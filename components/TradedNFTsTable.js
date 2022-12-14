import React from "react";
import DataTable from "react-data-table-component";
import etherscanLogo from "../public/etherscan-logo-circle.png";
import Image from "next/image";

const TradesTable = ({ tradedNfts, wallet }) => {
  // DEFINE COLUMNS FOR DATATABLE

  const dateSort = (rowA, rowB) => {
    const a = new Date(rowA.date);
    const b = new Date(rowB.date);

    if (a > b) {
      return 1;
    }
    if (b > a) {
      return -1;
    }
    return 0;
  };
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
      compact: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      sortable: true,
      compact: true,
      wrap: true,
      sortFunction: dateSort,
    },
    {
      name: "Asset",
      selector: (row) =>
        row.contract.name
          ? `${row.contract.name} | ${parseInt(row.tokenId)}`
          : row.asset !== null
          ? `${row.asset} | ${parseInt(row.tokenId)}`
          : row.formattedAsset,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.formattedValue,
      sortable: true,
    },

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
          href={`https://etherscan.io/address/${row.contract?.address}`}
        >
          <Image
            src={etherscanLogo}
            alt="etherscan logo"
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
      when: (row) => row.type == "sell",
      style: {
        // backgroundColor: "whitesmoke",
        backgroundColor: "PaleGreen",
        "&:hover": {
          cursor: "pointer",
        },
      },
      classNames: ["text-extrabold dark"],
    },
    {
      when: (row) => row.type == "mint",
      style: {
        // backgroundColor: "whitesmoke",
        backgroundColor: "lavender",
        "&:hover": {
          cursor: "pointer",
        },
      },
      classNames: ["text-extrabold dark"],
    },
  ];
  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  return (
    <DataTable
      columns={columns}
      data={tradedNfts}
      conditionalRowStyles={conditionalRowStyles}
      fixedHeader
      expandableRows
      dense
      pagination
      expandableRowsComponent={ExpandedComponent}
    />
  );
};

export default TradesTable;
