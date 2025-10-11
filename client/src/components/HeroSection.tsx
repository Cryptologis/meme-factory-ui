import { Wallet, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              Create & Trade{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Meme Tokens
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Launch your own Solana tokens in seconds. Trade, buy, and sell on the ultimate meme token marketplace.
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
              Create Token
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="p-6 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Create Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Launch your own SPL tokens on Solana in just a few clicks
              </p>
            </Card>

            <Card className="p-6 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-3 to-chart-2 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Trade Instantly</h3>
              <p className="text-sm text-muted-foreground">
                Buy and sell tokens with instant settlement on Solana devnet
              </p>
            </Card>

            <Card className="p-6 hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-2 to-primary flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Manage Portfolio</h3>
              <p className="text-sm text-muted-foreground">
                Track your holdings and transaction history in one place
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
