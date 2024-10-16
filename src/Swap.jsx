import { Connection, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Buffer } from "buffer";
import { Toaster, toast } from "sonner";

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/Ebs5VVFMeNeBW-6RiW7pZwFvXDlE5Evz"
);

export default function Swap() {
  const { publicKey, connected, signTransaction } = useWallet();
  const [swapStatus, setSwapStatus] = useState(null);
  const [inputToken, setInputToken] = useState("SOL");
  const [outputToken, setOutputToken] = useState("USDC");

  const [amount, setAmount] = useState("");

  async function handleSwap() {
    if (!connected || !publicKey) {
      toast.warning("connect wallet");
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.warning("Please enter a valid amount.");
      return;
    }

    const loadingToast = toast.loading("Swap in progress...");

    try {
      const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000&slippageBps=50`
      );

      const quoteRes = response.data;
      // toast.success(quoteRes);

      const res = await axios.post("https://quote-api.jup.ag/v6/swap", {
        quoteResponse: quoteRes,
        userPublicKey: publicKey.toString(),
      });
      const swapTxn = res.data.swapTransaction;
      const swapTxnBuffer = Buffer.from(swapTxn, "base64");
      var transaction = VersionedTransaction.deserialize(swapTxnBuffer);

      await signTransaction(transaction);

      const latestBlockHash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockHash.blockhash;
      transaction.feePayer = publicKey;
      const rawTxn = transaction.serialize();
      const txid = await connection.sendRawTransaction(rawTxn, {
        skipPreflight: true,
        maxRetries: 2,
      });
      await connection.confirmTransaction({
        blockhash: latestBlockHash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });
      setSwapStatus(`Transaction successful: https://solscan.io/tx/${txid}`);
      toast.dismiss(loadingToast);
      toast.success("Swap Successful;");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Error swapping:", err.message);
      setSwapStatus("Error swapping: " + err.message);
    }
  }

  return (
    <>
      <Toaster />
      <div className="max-w-xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">Token Swap</h1>
        <div className="mb-4">
          <label className="block mb-2">
            Input Token:
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Input Token Address"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Output Token:
            <input
              type="text"
              value={outputToken}
              onChange={(e) => setOutputToken(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Output Token Address"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Amount"
            />
          </label>
        </div>
        <button
          onClick={handleSwap}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition duration-300"
        >
          Swap Tokens
        </button>
        {swapStatus && <p className="mt-4 text-green-500">{swapStatus}</p>}
      </div>
    </>
  );
}
