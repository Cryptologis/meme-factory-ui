import { Wallet, Sparkles, Shield, TrendingUp, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onConnectWallet?: () => void;
  onCreateToken?: () => void;
}

export default function HeroSection({
  onConnectWallet = () => console.log("Connect wallet"),
  onCreateToken = () => console.log("Create token"),
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-2/10 to-chart-5/20 animate-gradient" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          {/* Badges */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge className="bg-gradient-to-r from-chart-3 to-primary animate-pulse">
                <Shield className="w-3 h-3 mr-1" />
                Anti-PVP Protected
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-chart-2">
                <Zap className="w-3 h-3 mr-1" />
                Fair Launch
              </Badge>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              Launch Your Next{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-5 bg-clip-text text-transparent animate-gradient-x">
                Viral Meme Coin
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The fairest launchpad on Solana. No bots, no whales, no BS.
              <br />
              <span className="text-primary font-semibold">Just pure community-driven launches.</span>
            </p>

            {/* Key value props */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm sm:text-base pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-chart-3" />
                <span>Bot Protection</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-chart-2" />
                <span>Bonding Curve</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coins className="w-4 h-4 text-chart-5" />
                <span>Creator Rewards</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={onCreateToken}
              data-testid="button-hero-create"
              className="gap-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 text-lg px-8 py-6 shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Launch Your Token Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onConnectWallet}
              data-testid="button-hero-connect"
              className="gap-2 backdrop-blur-sm bg-background/50 text-lg px-8 py-6 hover:bg-background/80"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
            <div className="group p-8 rounded-xl bg-gradient-to-br from-primary/10 to-chart-3/10 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-chart-2">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                No Bots
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced anti-sniper protection ensures fair launches for everyone
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-chart-5/10 to-chart-3/10 backdrop-blur-sm border border-chart-5/20 hover:border-chart-5/40 transition-all hover:scale-105">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-chart-5 to-chart-3">
                  <Coins className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-chart-5 to-chart-3 bg-clip-text text-transparent mb-2">
                Earn Rewards
              </div>
              <p className="text-sm text-muted-foreground">
                Creators earn passive income on every trade forever
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-chart-2/10 to-primary/10 backdrop-blur-sm border border-chart-2/20 hover:border-chart-2/40 transition-all hover:scale-105">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-chart-2 to-primary">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent mb-2">
                2% Max
              </div>
              <p className="text-sm text-muted-foreground">
                First 15 minutes capped at 2% per wallet to prevent whale manipulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
