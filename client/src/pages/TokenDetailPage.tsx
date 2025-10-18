import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Users, Target, ExternalLink, Copy } from "lucide-react";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@/hooks/useWallet";
import { useBuyTokens } from "@/hooks/useBuyTokens";
import { useSellTokens } from "@/hooks/useSellTokens";
import { PublicKey } from "@solana/web3.js";
import { toast } from "@/hooks/use-toast";
import { createChart, ColorType } from 'lightweight-charts';

export default function TokenDetailPage() {
  const [match, params] = useRoute("/token/:mintAddress");
  const mintAddress = params?.mintAddress;
  
  const program = useProgram();
  const { publicKey } = useWallet();
  const { buyTokens, loading: buyLoading } = useBuyTokens();
  const { sellTokens, loading: sellLoading } = useSellTokens();
  
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [timeframe, setTimeframe] = useState("1H");
  
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mintAddress && program) {
      loadTokenData(mintAddress);
    }
  }, [mintAddress, program]);

  useEffect(() => {
    if (chartContainerRef.current && token) {
      const cleanup = initializeChart();
      return cleanup;
    }
  }, [token, timeframe]);

  const loadTokenData = async (address: string) => {
    setLoading(true);
    try {
      const allMemes = await program.account.memeToken.all();
      const matchingMeme = allMemes.find(m => m.account.mint.toString() === address);
      
      if (!matchingMeme) {
        throw new Error("Token not found");
      }

      const tokenData = matchingMeme.account;
      setToken({
        pda: matchingMeme.publicKey.toString(),
        mint: tokenData.mint.toString(),
        name: tokenData.name,
        symbol: tokenData.symbol,
        creator: tokenData.creator.toString(),
        virtualSolReserves: tokenData.virtualSolReserves,
        virtualTokenReserves: tokenData.virtualTokenReserves,
        totalSupply: tokenData.totalSupply,
        isGraduated: tokenData.isGraduated,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeChart = () => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: '#374151',
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    const mockData = generateMockData();
    candlestickSeries.setData(mockData);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  };

  const generateMockData = () => {
    const data = [];
    const basePrice = 0.00001;
    let currentTime = Math.floor(Date.now() / 1000) - 86400;

    for (let i = 0; i < 100; i++) {
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      const close = open * (1 + (Math.random() - 0.5) * 0.1);
      const high = Math.max(open, close) * (1 + Math.random() * 0.05);
      const low = Math.min(open, close) * (1 - Math.random() * 0.05);

      data.push({ time: currentTime, open, high, low, close });
      currentTime += 900;
    }

    return data;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Address copied to clipboard" });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Token not found</div>;
  }

  const currentSol = Number(token.virtualSolReserves) / 1e9;
  const tokensAvailable = Number(token.virtualTokenReserves) / 1e9;
  const totalTokens = Number(token.totalSupply) / 1e9;
  const marketCap = currentSol * 2;
  const pricePerToken = tokensAvailable > 0 ? currentSol / tokensAvailable : 0;
  const progressPercent = Math.min((currentSol / 85) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{token.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{token.name}</h1>
                    <p className="text-muted-foreground">{token.symbol}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{token.mint.slice(0, 8)}...</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(token.mint)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`https://solscan.io/token/${token.mint}?cluster=devnet`} target="_blank" rel="noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${(marketCap * 150).toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="text-sm text-green-500 mt-1">+12.5% 24h</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold">${(pricePerToken * 150 * 1e9).toFixed(6)}</div>
                  <div className="text-sm text-muted-foreground">Price (USD)</div>
                </div>
                <div className="flex gap-2">
                  {['1H', '4H', '1D', '1W'].map((tf) => (
                    <Button key={tf} size="sm" variant={timeframe === tf ? "default" : "outline"} onClick={() => setTimeframe(tf)}>
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
              <div ref={chartContainerRef} className="w-full" />
            </Card>

            <Card className="p-6">
              <Tabs defaultValue="trades">
                <TabsList>
                  <TabsTrigger value="trades">Recent Trades</TabsTrigger>
                  <TabsTrigger value="holders">Top Holders</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="trades" className="space-y-2 mt-4">
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No recent trades. Be the first!
                  </div>
                </TabsContent>
                <TabsContent value="holders" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Creator</span>
                      <span className="font-mono">{(100 - (tokensAvailable / totalTokens * 100)).toFixed(2)}%</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="info" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Supply</span>
                      <span className="font-semibold">{(totalTokens / 1e6).toFixed(0)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Circulating</span>
                      <span className="font-semibold">{((totalTokens - tokensAvailable) / 1e6).toFixed(2)}M</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <Tabs defaultValue="buy">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Amount (SOL)</label>
                    <Input type="number" placeholder="0.00" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} step="0.01" />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => setBuyAmount("0.1")}>0.1</Button>
                      <Button size="sm" variant="outline" onClick={() => setBuyAmount("0.5")}>0.5</Button>
                      <Button size="sm" variant="outline" onClick={() => setBuyAmount("1")}>1</Button>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={!publicKey || buyLoading}>
                    {publicKey ? (buyLoading ? "Buying..." : "Buy") : "Connect Wallet"}
                  </Button>
                </TabsContent>
                <TabsContent value="sell" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Amount (Tokens)</label>
                    <Input type="number" placeholder="0" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} step="1000" />
                  </div>
                  <Button className="w-full" variant="destructive" size="lg" disabled={!publicKey || sellLoading}>
                    {publicKey ? (sellLoading ? "Selling..." : "Sell") : "Connect Wallet"}
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Bonding Curve
                  </h3>
                  <span className="text-sm font-bold">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-gradient-to-r from-primary to-chart-2 h-3 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Current</div>
                    <div className="font-semibold">{currentSol.toFixed(2)} SOL</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Target</div>
                    <div className="font-semibold">85 SOL</div>
                  </div>
                </div>
                {progressPercent >= 100 && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600">
                    🎉 Graduated to Raydium!
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Token Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">${(pricePerToken * 150 * 1e9).toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">$28.4K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Holders</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3" /> 142
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-semibold">1,234</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
