import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeatureHighlight from "@/components/FeatureHighlight";
import TrendingMemes from "@/components/TrendingMemes";
import TokenCard from "@/components/TokenCard";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function HomePage() {
  const { setVisible } = useWalletModal();

  const mockMemes = [
    {
      id: "1",
      title: "Dogwifhat takes over the internet again",
      subreddit: "CryptoCurrency",
      upvotes: 12500,
      comments: 342,
      trend_score: 95,
      url: "https://reddit.com/r/cryptocurrency",
    },
    {
      id: "2",
      title: "When you finally understand blockchain",
      subreddit: "memes",
      upvotes: 8900,
      comments: 156,
      trend_score: 87,
      url: "https://reddit.com/r/memes",
    },
    {
      id: "3",
      title: "Pepe vs Wojak: The eternal battle",
      subreddit: "dankmemes",
      upvotes: 15200,
      comments: 428,
      trend_score: 92,
      url: "https://reddit.com/r/dankmemes",
    },
    {
      id: "4",
      title: "Solana developers right now",
      subreddit: "solana",
      upvotes: 6700,
      comments: 89,
      trend_score: 78,
      url: "https://reddit.com/r/solana",
    },
    {
      id: "5",
      title: "The ultimate meme coin strategy",
      subreddit: "SatoshiStreetBets",
      upvotes: 9300,
      comments: 234,
      trend_score: 83,
      url: "https://reddit.com/r/satoshistreetbets",
    },
    {
      id: "6",
      title: "Ape together strong",
      subreddit: "wallstreetbets",
      upvotes: 18900,
      comments: 567,
      trend_score: 98,
      url: "https://reddit.com/r/wallstreetbets",
    },
  ];

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
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        onConnectWallet={() => setVisible(true)}
        onCreateToken={() => window.location.hash = "#/create"}
      />

      <FeatureHighlight />

      <TrendingMemes
        memes={mockMemes}
        onCreateFromMeme={(meme) => {
          console.log("Creating token from meme:", meme);
          window.location.hash = "#/create";
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Recent Launches</h2>
            <p className="text-muted-foreground mt-1">
              Fair-launched tokens with creator rewards & anti-PVP protection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTokens.map((token) => (
            <TokenCard key={token.symbol} {...token} />
          ))}
        </div>
      </div>
    </div>
  );
}
