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

  useEffect(() => {
    if (publicKey && program) {
      loadPortfolio();
    }
  }, [publicKey, program]);

  const loadPortfolio = async () => {
    if (!publicKey || !program) return;

    setLoading(true);
    try {
      const allMemes = await program.account.memeToken.all();
      const userTokens = [];

      for (const meme of allMemes) {
        try {
          const ata = await getAssociatedTokenAddress(
            meme.account.mint,
            publicKey
          );

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
          console.log("No balance for token:", meme.account.symbol);
        }
      }

      setTokens(userTokens);
    } catch (error) {
      console.error("Error loading portfolio:", error);
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
          <p className="text-sm text-muted-foreground">
            You don't own any tokens yet.
            <br />
            Create or buy tokens to get started!
          </p>
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
