import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface TokenHolding {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
  uiAmount: string;
}

export default function Portfolio() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [loading, setLoading] = useState(false);
  const [solBalance, setSolBalance] = useState(0);

  const fetchHoldings = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      // Get SOL balance
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / 1e9); // Convert lamports to SOL

      // Get all token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokenHoldings: TokenHolding[] = tokenAccounts.value
        .filter(account => {
          const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
          return amount && amount > 0;
        })
        .map(account => {
          const info = account.account.data.parsed.info;
          return {
            mint: info.mint,
            symbol: info.mint.slice(0, 4) + "..." + info.mint.slice(-4), // Abbreviated
            balance: info.tokenAmount.amount,
            decimals: info.tokenAmount.decimals,
            uiAmount: info.tokenAmount.uiAmountString,
          };
        });

      setHoldings(tokenHoldings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchHoldings();
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Portfolio</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          Connect your wallet to view your holdings
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Portfolio</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchHoldings}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* SOL Balance */}
      <div className="p-4 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">SOL Balance</p>
            <p className="text-2xl font-bold font-mono">{solBalance.toFixed(4)} SOL</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Token Holdings */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
          Token Holdings ({holdings.length})
        </h4>
        
        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Loading your holdings...
          </div>
        ) : holdings.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No tokens found. Create or buy your first token!
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {holdings.map((holding, index) => (
              <div
                key={index}
                className="p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {holding.symbol[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium font-mono text-sm">
                        {holding.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {holding.mint.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-mono">{holding.uiAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
