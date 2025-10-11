import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import TokenCard from "@/components/TokenCard";
import WalletConnectionModal from "@/components/WalletConnectionModal";

export default function HomePage() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const mockTokens = [
    {
      symbol: "DOGE",
      name: "Doge Coin",
      price: 0.000123,
      change24h: 15.42,
      liquidity: 125000,
      marketCap: 580000,
    },
    {
      symbol: "PEPE",
      name: "Pepe Token",
      price: 0.000089,
      change24h: -8.23,
      liquidity: 98000,
      marketCap: 420000,
    },
    {
      symbol: "MOON",
      name: "Moon Rocket",
      price: 0.000456,
      change24h: 42.15,
      liquidity: 210000,
      marketCap: 890000,
    },
    {
      symbol: "SHIB",
      name: "Shiba Token",
      price: 0.000034,
      change24h: 5.67,
      liquidity: 156000,
      marketCap: 650000,
    },
    {
      symbol: "WOJAK",
      name: "Wojak Finance",
      price: 0.000201,
      change24h: -12.34,
      liquidity: 87000,
      marketCap: 340000,
    },
    {
      symbol: "APE",
      name: "Ape Together",
      price: 0.000678,
      change24h: 28.91,
      liquidity: 198000,
      marketCap: 720000,
    },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        onConnectWallet={() => setWalletModalOpen(true)}
        onCreateToken={() => window.location.hash = "#/create"}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Trending Tokens</h2>
            <p className="text-muted-foreground mt-1">
              Discover the hottest meme tokens on Solana
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTokens.map((token) => (
            <TokenCard key={token.symbol} {...token} />
          ))}
        </div>
      </div>

      <WalletConnectionModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSelectWallet={(wallet) => console.log("Connected to", wallet)}
      />
    </div>
  );
}
