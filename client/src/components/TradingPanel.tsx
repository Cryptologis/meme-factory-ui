import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowDown, Settings } from "lucide-react";
import { useBuyTokens } from "@/hooks/useBuyTokens";
import { useSellTokens } from "@/hooks/useSellTokens";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

interface TradingPanelProps {
  tokenData: {
    pda: string;
    mint: string;
    name: string;
    symbol: string;
    virtualSolReserves: any;
    virtualTokenReserves: any;
    totalSupply: any;
  };
  onTradeComplete?: (signature: string) => void;
}

export default function TradingPanel({ tokenData, onTradeComplete }: TradingPanelProps) {
  const { publicKey } = useWallet();
  const { buyTokens, loading: buyLoading } = useBuyTokens();
  const { sellTokens, loading: sellLoading } = useSellTokens();
  
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [estimatedSol, setEstimatedSol] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Calculate current price from bonding curve
  useEffect(() => {
    if (tokenData) {
      const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
      const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
      const price = solReserves / tokenReserves;
      setCurrentPrice(price);
    }
  }, [tokenData]);

  // Estimate tokens for buy amount
  useEffect(() => {
    if (buyAmount && tokenData) {
      const solIn = parseFloat(buyAmount);
      const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
      const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
      
      // Constant product formula: x * y = k
      const k = solReserves * tokenReserves;
      const newSolReserves = solReserves + solIn;
      const newTokenReserves = k / newSolReserves;
      const tokensOut = tokenReserves - newTokenReserves;
      
      setEstimatedTokens(tokensOut);
    } else {
      setEstimatedTokens(0);
    }
  }, [buyAmount, tokenData]);

  // Estimate SOL for sell amount
  useEffect(() => {
    if (sellAmount && tokenData) {
      const tokensIn = parseFloat(sellAmount) / 1e6; // Convert to millions
      const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
      const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
      
      const k = solReserves * tokenReserves;
      const newTokenReserves = tokenReserves + tokensIn;
      const newSolReserves = k / newTokenReserves;
      const solOut = solReserves - newSolReserves;
      
      setEstimatedSol(solOut);
    } else {
      setEstimatedSol(0);
    }
  }, [sellAmount, tokenData]);

  const handleBuy = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to trade",
        variant: "destructive",
      });
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid SOL amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const signature = await buyTokens({
        memePda: tokenData.pda,
        solAmount: parseFloat(buyAmount),
      });

      toast({
        title: "✅ Tokens Purchased!",
        duration: 10000,
        description: (
          <div className="space-y-2">
            <p>Successfully bought {estimatedTokens.toFixed(2)}M {tokenData.symbol}!</p>
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline block break-all"
            >
              View Transaction: {signature.slice(0, 8)}...{signature.slice(-8)}
            </a>
          </div>
        ),
      });

      setBuyAmount("");
      if (onTradeComplete) onTradeComplete(signature);
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to buy tokens",
        variant: "destructive",
      });
    }
  };

  const handleSell = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to trade",
        variant: "destructive",
      });
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid token amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const signature = await sellTokens({
        memePda: tokenData.pda,
        tokenAmount: parseFloat(sellAmount),
      });

      toast({
        title: "✅ Tokens Sold!",
        duration: 10000,
        description: (
          <div className="space-y-2">
            <p>Successfully sold {parseFloat(sellAmount).toFixed(2)} {tokenData.symbol}!</p>
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline block break-all"
            >
              View Transaction: {signature.slice(0, 8)}...{signature.slice(-8)}
            </a>
          </div>
        ),
      });

      setSellAmount("");
      if (onTradeComplete) onTradeComplete(signature);
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to sell tokens",
        variant: "destructive",
      });
    }
  };

  const quickAmounts = [0.1, 0.5, 1.0, 5.0];

  return (
    <Card className="p-6">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/10">
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/10">
            <TrendingDown className="w-4 h-4 mr-2" />
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          {/* You Pay */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">You Pay</label>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Settings className="w-3 h-3" />
              </Button>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="text-2xl font-bold h-16 pr-20"
                step="0.01"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
                SOL
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBuyAmount(amount.toString())}
                  className="flex-1"
                >
                  {amount} SOL
                </Button>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* You Receive */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">You Receive (estimated)</label>
            <div className="relative">
              <div className="bg-muted/50 border rounded-lg h-16 px-4 flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {estimatedTokens > 0 ? `~${estimatedTokens.toFixed(2)}M` : "0"}
                </span>
                <span className="font-semibold text-muted-foreground">
                  {tokenData.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-mono">{currentPrice.toFixed(9)} SOL</span>
            </div>
            {buyAmount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Impact</span>
                <span className="font-mono text-yellow-500">~0.5%</span>
              </div>
            )}
          </div>

          {/* Buy Button */}
          <Button
            onClick={handleBuy}
            disabled={buyLoading || !publicKey || !buyAmount}
            className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
          >
            {!publicKey ? "Connect Wallet" : buyLoading ? "Buying..." : `Buy ${tokenData.symbol}`}
          </Button>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          {/* You Sell */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">You Sell</label>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Settings className="w-3 h-3" />
              </Button>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="text-2xl font-bold h-16 pr-24"
                step="100000"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
                {tokenData.symbol}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* You Receive */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">You Receive (estimated)</label>
            <div className="relative">
              <div className="bg-muted/50 border rounded-lg h-16 px-4 flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {estimatedSol > 0 ? `~${estimatedSol.toFixed(4)}` : "0"}
                </span>
                <span className="font-semibold text-muted-foreground">SOL</span>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-mono">{currentPrice.toFixed(9)} SOL</span>
            </div>
            {sellAmount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Impact</span>
                <span className="font-mono text-yellow-500">~0.5%</span>
              </div>
            )}
          </div>

          {/* Sell Button */}
          <Button
            onClick={handleSell}
            disabled={sellLoading || !publicKey || !sellAmount}
            variant="destructive"
            className="w-full h-12 text-lg font-semibold"
          >
            {!publicKey ? "Connect Wallet" : sellLoading ? "Selling..." : `Sell ${tokenData.symbol}`}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
