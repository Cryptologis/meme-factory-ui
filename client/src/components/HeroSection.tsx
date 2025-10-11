import { Wallet, Sparkles, Shield, TrendingUp } from "lucide-react";
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-2/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className="bg-gradient-to-r from-chart-3 to-primary">
                <Shield className="w-3 h-3 mr-1" />
                Anti-PVP Protected
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-chart-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Reddit Trending
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              Fair Launch Your{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Meme Token
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              The only launchpad with anti-PVP and anti-bundling protection. Launch tokens based on Reddit trending memes with fair distribution guaranteed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onConnectWallet}
              data-testid="button-hero-connect"
              className="gap-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onCreateToken}
              data-testid="button-hero-create"
              className="gap-2 backdrop-blur-sm bg-background/50"
            >
              <Sparkles className="w-5 h-5" />
              Launch Fair Token
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                No Bots
              </div>
              <p className="text-sm text-muted-foreground">
                Anti-sniper protection prevents front-running
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent mb-2">
                5% Max
              </div>
              <p className="text-sm text-muted-foreground">
                Per wallet limit prevents whale manipulation
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent mb-2">
                100% Fair
              </div>
              <p className="text-sm text-muted-foreground">
                Locked liquidity and vesting schedules
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
