import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import UserBalance from "./UserBalance";
import Swap from "./Swap";

export default function App() {
  const endpoint = "https://api.devnet.solana.com";

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex space-x-4 mb-6">
                <WalletMultiButton className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-blue-600 transition-colors duration-300" />
                <WalletDisconnectButton className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300" />
              </div>
              <main className="space-y-6">
                <UserBalance />
                <Swap />
              </main>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
