import React, { useCallback, useRef } from "react";
import { ethers } from "ethers";

const WalletInput = (props) => {
  const walletInput = useRef();

  // SUBMIT NEW WALLET ADDRESS
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { value } = walletInput.current;
    if (
      ethers.utils.isAddress(value) ||
      value.substring(value.length - 4, value.length)?.toLowerCase() === ".eth"
    ) {
      props.updateWallet(value);
    }
  }, []);

  return (
    <form className="flex flex-col justify-center md:mb-24">
      <p className="text-center font-thin text-xl mt-4">
        Enter a Ethereum wallet address
      </p>
      <input
        ref={walletInput}
        className="border border-slate-800 px-4 py-2 md:w-1/2 my-5 shadow-lg mx-2 md:mx-auto rounded"
      ></input>
      {}
      <input
        type="submit"
        onClick={(e) => handleSubmit(e)}
        value={props.loading ? `Loading` : "Get Data"}
        disabled={props.loading}
        className={`py-3 px-5 bg-slate-800 text-white dark:text-slate-900 dark:bg-slate-300 rounded shadow-md mx-auto uppercase font-bold w-1/2 cursor-pointer ${
          props.loading && "animate-pulse"
        }`}
        placeholder="0x37e8530068f25C56cb4193a64735a28622654A23"
      />
    </form>
  );
};

export default WalletInput;
