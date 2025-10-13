import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/WalletProvider";
import ThemeToggle from "@/components/ThemeToggle";
import WalletConnectionModal from "@/components/WalletConnectionModal";
import HomePage from "@/pages/HomePage";
import CreateTokenPage from "@/pages/CreateTokenPage";
import TradePage from "@/pages/TradePage";
import NotFound from "@/pages/not-found";
import { useWallet } from "@/hooks/useWallet";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/create" component={CreateTokenPage} />
      <Route path="/trade" component={TradePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { publicKey, connected, disconnect, balance } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSelectWallet = (wallet: string) => {
    console.log("Selected wallet:", wallet);
    setWalletModalOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 border-b sticky top-0 z-50 backdrop-blur-xl bg-background/80">
          <div className="flex items-center gap-8 flex-1">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
              data-testid="link-home"
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Meme Factory
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setLocation("/")}
                className={`px-3 py-2 text-sm rounded-md hover-elevate ${
                  location === "/" ? "bg-muted" : ""
                }`}
                data-testid="nav-marketplace"
              >
                Marketplace
              </button>
              <button
                onClick={() => setLocation("/create")}
                className={`px-3 py-2 text-sm rounded-md hover-elevate ${
                  location === "/create" ? "bg-muted" : ""
                }`}
                data-testid="nav-create"
              >
                Create Token
              </button>
              <button
                onClick={() => setLocation("/trade")}
                className={`px-3 py-2 text-sm rounded-md hover-elevate ${
                  location === "/trade" ? "bg-muted" : ""
                }`}
                data-testid="nav-trade"
              >
                Trade
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {connected && publicKey ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border">
                  <span className="text-sm font-mono text-muted-foreground">
                    {balance !== null ? balance.toFixed(2) : "0.00"} SOL
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border hover-elevate"
                  data-testid="button-wallet-connected"
                >
                  <span className="font-mono text-xs">
                    {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-md bg-secondary">
                    Devnet
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-chart-2 text-white hover:opacity-90"
                data-testid="button-connect-wallet"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <Router />

        <WalletConnectionModal
          open={walletModalOpen}
          onClose={() => setWalletModalOpen(false)}
          onSelectWallet={handleSelectWallet}
        />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
