import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowDown } from "lucide-react";
import { useBuyTokens } from "@/hooks/useBuyTokens";
import { useSellTokens } from "@/hooks/useSellTokens";
import { useWallet } from "@/hooks/useWallet";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import TradingSettings from "@/components/TradingSettings";
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
  const { balance: tokenBalance, refetch: refetchBalance } = useTokenBalance({
    mintAddress: tokenData.mint,
    enabled: !!publicKey
  });

  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [estimatedSol, setEstimatedSol] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [buyPriceImpact, setBuyPriceImpact] = useState<number>(0);
  const [sellPriceImpact, setSellPriceImpact] = useState<number>(0);

  // Trading settings
  const [slippageTolerance, setSlippageTolerance] = useState<number>(1.0); // Default 1%
  const [priorityFee, setPriorityFee] = useState<number>(0);

  // Convert raw token balance for display
  const balanceInTokens = tokenBalance / 1e6; // Actual tokens
  const balanceInMillions = tokenBalance / 1e12; // In millions

  // Smart display: show tokens if < 1M, otherwise show millions
  const balanceDisplay = balanceInTokens < 1000000
    ? `${balanceInTokens.toFixed(2)} ${tokenData?.symbol || ''}`
    : `${balanceInMillions.toFixed(4)}M ${tokenData?.symbol || ''}`;

  // Calculate current price from bonding curve
  useEffect(() => {
    if (tokenData) {
      const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
      const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
      const price = solReserves / tokenReserves;
      setCurrentPrice(price);
    }
  }, [tokenData]);

  // Estimate tokens for buy amount and calculate price impact
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

      // Calculate price impact
      // Price before: solReserves / tokenReserves
      // Price after: newSolReserves / newTokenReserves
      const priceBefore = solReserves / tokenReserves;
      const priceAfter = newSolReserves / newTokenReserves;
      const impact = ((priceAfter - priceBefore) / priceBefore) * 100;
      setBuyPriceImpact(impact);
    } else {
      setEstimatedTokens(0);
      setBuyPriceImpact(0);
    }
  }, [buyAmount, tokenData]);

  // Estimate SOL for sell amount and calculate price impact
  useEffect(() => {
    if (sellAmount && tokenData) {
      const tokensIn = parseFloat(sellAmount); // Already in millions
      const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
      const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;

      console.log("🔢 Sell Calculation Debug:", {
        sellAmount,
        tokensIn,
        solReserves,
        tokenReserves,
      });

      const k = solReserves * tokenReserves;
      const newTokenReserves = tokenReserves + tokensIn;
      const newSolReserves = k / newTokenReserves;
      const solOut = solReserves - newSolReserves;

      console.log("💰 SOL Output:", {
        k,
        newTokenReserves,
        newSolReserves,
        solOut,
      });

      setEstimatedSol(solOut);

      // Calculate price impact (negative for sells)
      // Price before: solReserves / tokenReserves
      // Price after: newSolReserves / newTokenReserves
      const priceBefore = solReserves / tokenReserves;
      const priceAfter = newSolReserves / newTokenReserves;
      const impact = ((priceAfter - priceBefore) / priceBefore) * 100;
      setSellPriceImpact(Math.abs(impact)); // Use absolute value for display
    } else {
      setEstimatedSol(0);
      setSellPriceImpact(0);
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
      // Refetch token balance after successful purchase
      console.log("🔄 Refetching balance after buy...");
      setTimeout(() => {
        refetchBalance();
        console.log("✅ Balance refetch triggered");
      }, 3000); // Increased to 3 seconds for network confirmation
      if (onTradeComplete) onTradeComplete(signature);
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to buy tokens",
        variant: "destructive",
      });
    }
  };

  const handlePercentageSell = (percentage: number) => {
    console.log("🔘 Percentage button clicked:", percentage, {
      publicKey: publicKey?.toString(),
      tokenBalance,
      balanceInTokens,
    });

    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to see your balance",
        variant: "destructive",
      });
      return;
    }

    if (tokenBalance === 0) {
      toast({
        title: "No Tokens",
        description: `You don't have any ${tokenData.symbol} tokens to sell`,
        variant: "destructive",
      });
      return;
    }

    // Calculate percentage of balance (in millions)
    const amountToSell = balanceInMillions * (percentage / 100);
    console.log("✅ Setting sell amount:", amountToSell, "millions");
    setSellAmount(amountToSell.toString());
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
      // sellAmount is in millions, convert to actual tokens for the hook
      const tokenAmountInTokens = parseFloat(sellAmount) * 1e6;
      console.log("💸 Selling:", parseFloat(sellAmount), "M tokens =", tokenAmountInTokens, "tokens");

      const signature = await sellTokens({
        memePda: tokenData.pda,
        tokenAmount: tokenAmountInTokens,
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
      // Refetch token balance after successful sale
      console.log("🔄 Refetching balance after sell...");
      setTimeout(() => {
        refetchBalance();
        console.log("✅ Balance refetch triggered");
      }, 3000); // Increased to 3 seconds for network confirmation
      if (onTradeComplete) onTradeComplete(signature);
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to sell tokens",
        variant: "destructive",
      });
    }
  };

  const quickAmounts = [0.1, 0.5, 1.0];

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
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">You Pay</label>
              <TradingSettings
                slippageTolerance={slippageTolerance}
                onSlippageChange={setSlippageTolerance}
                priorityFee={priorityFee}
                onPriorityFeeChange={setPriorityFee}
              />
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
            <div>
              <p className="text-xs text-muted-foreground mb-2">Quick amounts or enter custom:</p>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBuyAmount(amount.toString())}
                    className="h-8"
                  >
                    {amount}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBuyAmount("");
                    document.querySelector<HTMLInputElement>('input[placeholder="0.0"]')?.focus();
                  }}
                  className="h-8 border-dashed"
                >
                  Custom
                </Button>
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
                <span className={`font-mono ${
                  buyPriceImpact > 5 ? 'text-red-500' :
                  buyPriceImpact > 1 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {buyPriceImpact > 0.01 ? `+${buyPriceImpact.toFixed(2)}%` : '<0.01%'}
                </span>
              </div>
            )}
          </div>

          {/* Price Impact Warning */}
          {buyAmount && buyPriceImpact > slippageTolerance && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                ⚠️ Price impact ({buyPriceImpact.toFixed(2)}%) exceeds your slippage tolerance ({slippageTolerance}%)
              </p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                Transaction may fail. Consider reducing amount or increasing slippage tolerance in settings.
              </p>
            </div>
          )}

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
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">You Sell</label>
              <div className="flex items-center gap-2">
                {publicKey && (
                  <span className="text-xs text-muted-foreground">
                    Balance: {balanceDisplay}
                  </span>
                )}
                <TradingSettings
                  slippageTolerance={slippageTolerance}
                  onSlippageChange={setSlippageTolerance}
                  priorityFee={priorityFee}
                  onPriorityFeeChange={setPriorityFee}
                />
              </div>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="text-2xl font-bold h-16 pr-24"
                step="0.1"
                min="0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-baseline gap-1">
                <span className="font-semibold text-muted-foreground">{tokenData.symbol}</span>
                <span className="text-xs text-muted-foreground">(Millions)</span>
              </div>
            </div>
            
            {/* Sell Percentage Buttons */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Sell percentage or enter custom:</p>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePercentageSell(25)}
                  disabled={!publicKey || tokenBalance === 0}
                  className="h-8"
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePercentageSell(50)}
                  disabled={!publicKey || tokenBalance === 0}
                  className="h-8"
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePercentageSell(75)}
                  disabled={!publicKey || tokenBalance === 0}
                  className="h-8"
                >
                  75%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePercentageSell(100)}
                  disabled={!publicKey || tokenBalance === 0}
                  className="h-8 font-semibold"
                >
                  MAX
                </Button>
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
                  {estimatedSol > 0 ? (
                    estimatedSol >= 0.0001
                      ? `~${estimatedSol.toFixed(4)}`
                      : `~${estimatedSol.toExponential(2)}`
                  ) : "0"}
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
                <span className={`font-mono ${
                  sellPriceImpact > 5 ? 'text-red-500' :
                  sellPriceImpact > 1 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {sellPriceImpact > 0.01 ? `-${sellPriceImpact.toFixed(2)}%` : '<0.01%'}
                </span>
              </div>
            )}
          </div>

          {/* Price Impact Warning */}
          {sellAmount && sellPriceImpact > slippageTolerance && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                ⚠️ Price impact ({sellPriceImpact.toFixed(2)}%) exceeds your slippage tolerance ({slippageTolerance}%)
              </p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                Transaction may fail. Consider reducing amount or increasing slippage tolerance in settings.
              </p>
            </div>
          )}

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
