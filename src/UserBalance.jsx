import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function UserBalance() {
  const [balance, setBalance] = useState(0);
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    async function getWallet() {
      if (wallet.publicKey) {
        try {
          const bal = await connection.getBalance(wallet.publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (err) {
          console.log(err);
        }
      }
    }
    getWallet();
  }, [wallet.publicKey, connection]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
        User Balance
      </h2>
      <p className="text-3xl font-bold mb-4 text-gray-200">
        {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
      </p>
      <div className="text-sm text-gray-300 break-all">
        {wallet.publicKey ? (
          <>Address: {wallet.publicKey.toBase58()}</>
        ) : (
          <span className="text-red-400">Wallet not connected</span>
        )}
      </div>
    </div>
  );
}
