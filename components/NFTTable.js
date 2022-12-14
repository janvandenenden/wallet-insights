import React from "react";
import DataTable from "react-data-table-component";
import Image from "next/image";
import etherscanLogo from "../public/etherscan-logo-circle.png";

const NFTTable = ({ nftData, wallet }) => {
  const dateSort = (rowA, rowB) => {
    const a = new Date(rowA.date).getTime();
    const b = new Date(rowB.date).getTime();

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
      name: "Asset",
      selector: (row) =>
        row.contract?.name
          ? `${row.contract.name} #${parseInt(row.tokenId)}`
          : row.rawMetadata?.name
          ? `${row.rawMetadata.name}  #${parseInt(row.tokenId)}`
          : row.asset !== null
          ? `${row.asset} | ${parseInt(row.tokenId)}`
          : row.formattedAsset,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) =>
        row.date
          ? new Date(row.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
      sortable: true,
      compact: true,
      wrap: true,
      sortFunction: dateSort,
    },
    {
      name: "Entered",
      selector: (row) =>
        row.value ? `${row.value && row.value} ${row.coin && row.coin}` : "-",
      sortable: true,
      compact: true,
      wrap: true,
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
    {
      name: "Contract",
      selector: (row) => row.contract.address,
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
      data={nftData}
      conditionalRowStyles={conditionalRowStyles}
      fixedHeader
      expandableRows
      dense
      pagination
      expandableRowsComponent={ExpandedComponent}
    />
  );
};

export default NFTTable;
