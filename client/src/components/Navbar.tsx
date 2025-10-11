import { Wallet, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  walletConnected?: boolean;
  walletAddress?: string;
  balance?: number;
  onConnectWallet?: () => void;
}

export default function Navbar({
  walletConnected = false,
  walletAddress = "",
  balance = 0,
  onConnectWallet = () => console.log("Connect wallet clicked"),
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Meme Factory
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" data-testid="nav-marketplace">
                Marketplace
              </Button>
              <Button variant="ghost" size="sm" data-testid="nav-create">
                Create Token
              </Button>
              <Button variant="ghost" size="sm" data-testid="nav-portfolio">
                Portfolio
              </Button>
              <Button variant="ghost" size="sm" data-testid="nav-transactions">
                Transactions
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {walletConnected ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border">
                  <span className="text-sm font-mono text-muted-foreground">
                    {balance.toFixed(2)} SOL
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-wallet-connected"
                  className="gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                  </span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    Devnet
                  </Badge>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={onConnectWallet}
                data-testid="button-connect-wallet"
                className="gap-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
