import React from "react";
import DataTable from "react-data-table-component";
import etherscanLogo from "../public/etherscan-logo-circle.png";
import Image from "next/image";

const TradesTable = ({ trades, wallet }) => {
  // DEFINE COLUMNS FOR DATATABLE
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
      selector: (row) =>
        new Date(row.metadata.blockTimestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      sortable: true,
    },
    {
      name: "From / To",
      selector: (row) => row.fromTo,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.formattedValue,
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
    {
      name: "Etherscan",
      selector: (row) => (
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://etherscan.io/address/${row.rawContract?.address}`}
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
      when: (row) => row.group % 2 == 0,
      style: {
        // backgroundColor: "whitesmoke",
        backgroundColor: "lavender",

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
        backgroundColor: "lavender",
        color: "green",

        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  return trades.map((transaction, index) => {
    return (
      <div className="my-8 shadow" key={index}>
        <DataTable
          columns={columns}
          data={transaction}
          // conditionalRowStyles={conditionalRowStyles}
          fixedHeader
        />
      </div>
    );
  });
};

export default TradesTable;
