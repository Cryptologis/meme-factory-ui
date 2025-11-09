import { useState } from "react";
import { useLocation } from "wouter";
import HeroSection from "@/components/HeroSection";
import FeatureHighlight from "@/components/FeatureHighlight";
import TrendingMemes from "@/components/TrendingMemes";
import TokenCard from "@/components/TokenCard";
import WalletConnectionModal from "@/components/WalletConnectionModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  TrendingUp,
  Coins,
  Zap,
  Users,
  Lock,
  CheckCircle2,
  ArrowRight,
  Clock,
  Percent,
  Sparkles,
  Info,
  ExternalLink,
  Twitter
} from "lucide-react";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

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
      {/* Devnet Notice Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                      Devnet
                    </Badge>
                    Protocol Currently Live on Solana Devnet
                  </h3>
                  <p className="text-blue-800 mb-4">
                    We're currently running on Solana's Devnet for testing. Follow these steps to get started:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Connect to Devnet</h4>
                        <p className="text-sm text-blue-700">
                          Open your Solana wallet (Phantom, Solflare, etc.) and switch to the <strong>Devnet</strong> network in your wallet settings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Get Devnet SOL (Free)</h4>
                        <p className="text-sm text-blue-700 mb-2">
                          Request free test SOL from the Solana faucet to start trading. You'll need some SOL to create tokens and make trades.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => window.open('https://faucet.solana.com', '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Solana Faucet
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open('https://solfaucet.com', '_blank')}
                            className="border-blue-600 text-blue-700 hover:bg-blue-50 gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Alternative Faucet
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Start Creating & Trading</h4>
                        <p className="text-sm text-blue-700">
                          Once you have Devnet SOL, you can create tokens, trade, and test all features risk-free!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      <span>Devnet tokens have no real value. This is a test environment for development purposes.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <HeroSection
        onConnectWallet={() => setWalletModalOpen(true)}
        onCreateToken={() => setLocation('/create')}
      />

      {/* How It Works Section */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Simple & Fair
            </Badge>
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Launch your token in 3 simple steps. No coding required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="p-8 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Coins className="w-6 h-6 text-primary" />
                  Create Token
                </h3>
                <p className="text-muted-foreground mb-4">
                  Upload your meme, set a name and ticker. We handle all the technical stuff - token creation, bonding curve, and smart contract deployment.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>1 billion token supply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Automatic bonding curve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>No coding needed</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-8 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-2/20 to-transparent rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-chart-2">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-chart-2" />
                  Community Trades
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your community buys and sells on the bonding curve. Price increases as more SOL is added. Fair launch with anti-bot protection.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>60-second anti-snipe cooldown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>2% max wallet for 15 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>No front-running possible</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-8 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-5/20 to-transparent rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-chart-5/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-chart-5">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-chart-5" />
                  Graduate to Raydium
                </h3>
                <p className="text-muted-foreground mb-4">
                  When 85 SOL is raised, your token automatically graduates to Raydium DEX with deep liquidity. The bonding curve LP is burned forever.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Auto-migration at 85 SOL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>LP tokens burned (rug-proof)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Listed on major DEXs</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Anti-Bot Protection Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
              <Shield className="w-3 h-3 mr-1" />
              Protected Launch
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Built-In Anti-Bot Protection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built multiple layers of protection to ensure fair launches for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">60s Launch Cooldown</h3>
              <p className="text-sm text-muted-foreground">
                Can't buy for 60 seconds after token creation. Prevents sniping bots.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
                <Percent className="w-8 h-8 text-chart-2" />
              </div>
              <h3 className="font-bold mb-2">2% Wallet Cap</h3>
              <p className="text-sm text-muted-foreground">
                Max 2% of supply per wallet for first 15 minutes. Stops whale manipulation.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-chart-5/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-chart-5" />
              </div>
              <h3 className="font-bold mb-2">Trade Cooldown</h3>
              <p className="text-sm text-muted-foreground">
                1 second cooldown between trades. Prevents rapid-fire bot trading.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">No Rug Pulls</h3>
              <p className="text-sm text-muted-foreground">
                LP tokens burned at graduation. Creator can't pull liquidity.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Creator Benefits Section */}
      <div className="bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-5/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                For Creators
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Earn Passive Income Forever</h2>
              <p className="text-xl text-muted-foreground mb-8">
                As the creator, you earn 0.5% of every trade volume - forever. No work required after launch.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Perpetual Revenue</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn 0.5% of every buy and sell transaction, deposited directly to your wallet
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Zero Maintenance</h4>
                    <p className="text-sm text-muted-foreground">
                      Set it and forget it. Fees automatically accumulate as your community trades
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-chart-5/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-chart-5" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Aligned Incentives</h4>
                    <p className="text-sm text-muted-foreground">
                      The more your token succeeds, the more you earn. Your success = community success
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={() => setLocation('/create')}
                className="gap-2"
              >
                Start Earning Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <Card className="p-8 bg-gradient-to-br from-background to-muted/50 border-2">
              <h3 className="text-2xl font-bold mb-6">Example Earnings</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Daily Volume</span>
                    <span className="font-bold">100 SOL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your Daily Earnings (0.5%)</span>
                    <span className="font-bold text-primary">0.5 SOL (~$75)</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Daily Volume</span>
                    <span className="font-bold">1,000 SOL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your Daily Earnings (0.5%)</span>
                    <span className="font-bold text-primary">5 SOL (~$750)</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Daily Volume</span>
                    <span className="font-bold">10,000 SOL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your Daily Earnings (0.5%)</span>
                    <span className="font-bold text-primary">50 SOL (~$7,500)</span>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 mt-6">
                  <p className="text-sm text-center text-muted-foreground">
                    💡 <strong>Pro tip:</strong> Build a strong community and keep them engaged. Higher trading volume = higher earnings!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FeatureHighlight />

      <TrendingMemes
        memes={mockMemes}
        onCreateFromMeme={(meme) => {
          console.log("Creating token from meme:", meme);
          setLocation('/create');
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
          <Button variant="outline" onClick={() => setLocation('/trade')}>
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTokens.map((token) => (
            <TokenCard key={token.symbol} {...token} />
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-primary via-chart-2 to-chart-5 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Launch Your Token?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of creators earning passive income from their communities
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => setLocation('/create')}
              className="gap-2 text-lg px-8"
            >
              <Sparkles className="w-5 h-5" />
              Launch Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setLocation('/trade')}
              className="gap-2 text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Explore Tokens
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Legal Disclaimer */}
          <Card className="p-6 mb-6 bg-muted/30">
            <h3 className="text-lg font-bold mb-3">⚠️ Legal Disclaimer</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>No Financial Advice:</strong> The information provided on this platform is for educational and informational purposes only. It does not constitute financial, investment, or legal advice.
              </p>
              <p>
                <strong>No Expectation of Gains:</strong> Participation in this platform does not guarantee any financial returns or profits. All cryptocurrency investments carry significant risk, including the potential loss of principal.
              </p>
              <p>
                <strong>Use at Your Own Risk:</strong> This platform is currently in beta testing on Solana Devnet. Users acknowledge that they use this platform at their own risk. The platform has not been audited and may contain bugs or vulnerabilities.
              </p>
              <p>
                <strong>Educational Purposes:</strong> This platform is designed for educational purposes to demonstrate decentralized token launch mechanisms. It is not intended for mainnet use without proper security audits and testing.
              </p>
              <p>
                <strong>No Guarantees:</strong> We make no guarantees about the availability, functionality, or security of this platform. Users should conduct their own research before participating.
              </p>
            </div>
          </Card>

          {/* Social & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 Meme-Factory. All Rights Reserved.
            </div>
            <a
              href="https://x.com/memefactor79760"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Follow us on X
            </a>
          </div>
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
