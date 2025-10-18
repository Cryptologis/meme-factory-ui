import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Wallet, TrendingUp, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Portfolio() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Only auto-load once when wallet connects
  useEffect(() => {
    if (publicKey && program && tokens.length === 0) {
      loadPortfolio();
    }
  }, [publicKey, program]);

  const loadPortfolio = async () => {
    if (!publicKey || !program) return;

    // Rate limit: only allow fetch every 10 seconds
    const now = Date.now();
    if (now - lastFetch < 10000) {
      toast({
        title: "Please Wait",
        description: "Wait 10 seconds between refreshes",
      });
      return;
    }

    setLoading(true);
    setLastFetch(now);

    try {
      const allMemes = await program.account.memeToken.all();
      const userTokens = [];

      for (const meme of allMemes) {
        try {
          const ata = await getAssociatedTokenAddress(
            meme.account.mint,
            publicKey
          );

          // Increased delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const balance = await connection.getTokenAccountBalance(ata);
          
          if (balance.value.uiAmount && balance.value.uiAmount > 0) {
            userTokens.push({
              mint: meme.account.mint.toString(),
              name: meme.account.name,
              symbol: meme.account.symbol,
              balance: balance.value.uiAmount,
              pda: meme.publicKey.toString(),
            });
          }
        } catch (e) {
          // Silently skip tokens without balance
        }
      }

      setTokens(userTokens);
      
      if (userTokens.length > 0) {
        toast({
          title: "Portfolio Loaded",
          description: `Found ${userTokens.length} token${userTokens.length > 1 ? 's' : ''}`,
        });
      }
    } catch (error: any) {
      console.error("Error loading portfolio:", error);
      toast({
        title: "Error Loading Portfolio",
        description: "Please try again in a moment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Token address copied to clipboard",
    });
  };

  if (!publicKey) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view your token portfolio
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Your Portfolio
        </h2>
        <Button size="sm" variant="outline" onClick={loadPortfolio} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {loading && tokens.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading your tokens...
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-4">
            You don't own any tokens yet.
            <br />
            Create or buy tokens to get started!
          </p>
          <Button size="sm" onClick={loadPortfolio} disabled={loading}>
            Load Portfolio
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <div
              key={token.mint}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {token.balance.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">tokens</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-1">Token CA:</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                    {token.mint}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyAddress(token.mint)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.location.href = `/token/${token.mint}`}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => window.location.href = `/trade?token=${token.pda}`}
                >
                  Trade
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
