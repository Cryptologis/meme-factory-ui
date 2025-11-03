import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, RefreshCw, ExternalLink } from "lucide-react";
import TradingPanel from "@/components/TradingPanel";
import BondingCurveProgress from "@/components/BondingCurveProgress";
import { useProgram } from "@/hooks/useProgram";
import { PublicKey } from "@solana/web3.js";
import { toast } from "@/hooks/use-toast";

export default function TradePage() {
  const program = useProgram();
  
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastTxSignature, setLastTxSignature] = useState<string | null>(null);
  
  const hasLoadedFromUrlRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam && program && !hasLoadedFromUrlRef.current) {
      hasLoadedFromUrlRef.current = true;
      setSearchAddress(tokenParam);
      searchTokenByAddress(tokenParam);
    }
  }, [program]);

  const searchTokenByAddress = async (address: string) => {
    if (!program || !address) return;

    setLoading(true);
    try {
      let memePda: PublicKey;
      
      try {
        memePda = new PublicKey(address);
        await program.account.memeToken.fetch(memePda);
      } catch (e) {
        console.log("Not a Meme PDA, searching by mint address...");
        const allMemes = await program.account.memeToken.all();
        const matchingMeme = allMemes.find(m => m.account.mint.toString() === address);
        
        if (!matchingMeme) {
          throw new Error("Token not found. Make sure it was created on this platform.");
        }
        
        memePda = matchingMeme.publicKey;
      }

      const tokenData = await program.account.memeToken.fetch(memePda);
      
      setSelectedToken({
        pda: memePda.toString(),
        mint: tokenData.mint.toString(),
        name: tokenData.name,
        symbol: tokenData.symbol,
        creator: tokenData.creator.toString(),
        virtualSolReserves: tokenData.virtualSolReserves,
        virtualTokenReserves: tokenData.virtualTokenReserves,
        totalSupply: tokenData.totalSupply,
        isGraduated: tokenData.isGraduated,
      });

      toast({
        title: "Token Loaded!",
        description: `${tokenData.name} (${tokenData.symbol})`,
      });
    } catch (error: any) {
      console.error("Token search error:", error);
      toast({
        title: "Token Not Found",
        description: error.message || "Invalid address or token doesn't exist on this platform",
        variant: "destructive",
      });
      setSelectedToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeComplete = (signature: string) => {
    setLastTxSignature(signature);
    // Refresh token data after trade
    if (selectedToken) {
      searchTokenByAddress(selectedToken.pda);
    }
  };

  const searchToken = () => searchTokenByAddress(searchAddress);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Trade Tokens</h1>
          <p className="text-muted-foreground text-lg">
            Search and trade meme tokens on Solana devnet
          </p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Find Token</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Token CA (Mint Address)..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchToken()}
              className="font-mono text-sm"
            />
            <Button onClick={searchToken} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "..." : "Search"}
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>💡 Paste the Token CA from your portfolio or marketplace</p>
            <p className="text-xs font-mono">Example: GKsM8pqkC5N3Hj6jT1gbPShdYreJ8jU8aFNVZXQ4U7Ld</p>
          </div>
        </Card>

        {/* Last Transaction Banner */}
        {lastTxSignature && (
          <Card className="p-4 mb-6 bg-green-500/5 border-green-500/20">
            <p className="text-sm font-semibold mb-2">Last Transaction:</p>
            <a
              href={`https://explorer.solana.com/tx/${lastTxSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-500 hover:underline break-all flex items-center gap-2"
            >
              {lastTxSignature}
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </Card>
        )}

        {selectedToken && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Trading */}
            <div className="space-y-6">
              {/* Token Info Card */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{selectedToken.name}</h2>
                    <p className="text-muted-foreground mb-2">{selectedToken.symbol}</p>
                    <div className="text-xs font-mono text-muted-foreground space-y-1">
                      <p>Token CA: {selectedToken.mint}</p>
                      <p>Meme PDA: {selectedToken.pda}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => searchTokenByAddress(selectedToken.pda)}
                    disabled={loading}
                    title="Refresh token data from blockchain"
                    className="ml-4"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground mb-1">Virtual SOL</p>
                    <p className="font-mono font-semibold">
                      {(Number(selectedToken.virtualSolReserves.toString()) / 1e9).toFixed(2)} SOL
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground mb-1">Virtual Tokens</p>
                    <p className="font-mono font-semibold">
                      {(Number(selectedToken.virtualTokenReserves.toString()) / 1e6).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </Card>

              {/* Bonding Curve Progress */}
              <BondingCurveProgress
                virtualSolReserves={selectedToken.virtualSolReserves}
                virtualTokenReserves={selectedToken.virtualTokenReserves}
                totalSupply={selectedToken.totalSupply}
                targetSol={85}
              />

              {/* Trading Panel */}
              <TradingPanel 
                tokenData={selectedToken}
                onTradeComplete={handleTradeComplete}
              />
            </div>

            {/* Right Column - Chart (Placeholder) */}
            <div className="space-y-6">
              <Card className="p-6 h-[600px] flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📈</div>
                  <h3 className="text-xl font-bold">Price Chart Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Real-time bonding curve visualization and price history
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedToken && !loading && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No Token Selected</h3>
            <p className="text-muted-foreground">
              Search for a token using its CA (Contract Address) above to start trading
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
