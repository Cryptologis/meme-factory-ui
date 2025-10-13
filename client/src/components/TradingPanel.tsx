import { useState } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useBuyTokens } from "@/hooks/useBuyTokens";

interface TradingPanelProps {
  memeAddress?: string;
  tokenSymbol?: string;
  tokenName?: string;
  currentPrice?: number;
  userBalance?: number;
  createdAt?: string;
}

export default function TradingPanel({
  memeAddress,
  tokenSymbol = "DOGE",
  tokenName = "Doge Coin",
  currentPrice = 0.000123,
  userBalance = 0,
  createdAt,
}: TradingPanelProps) {
  const { toast } = useToast();
  const { buyTokens, loading: buyLoading } = useBuyTokens();
  const [amount, setAmount] = useState("");
  const [maxSol, setMaxSol] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const isAntiBundlePeriod = createdAt 
    ? Date.now() - new Date(createdAt).getTime() < 15 * 60 * 1000 
    : false;

  const total = Number(amount) * currentPrice;
  const estimatedSol = total || (Number(amount) * 0.000001);

  const handleBuy = async () => {
    if (!memeAddress) {
      toast({
        title: "Error",
        description: "Please select a token first",
        variant: "destructive",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const tokenAmount = Math.floor(Number(amount) * 1_000_000);
      const maxSolCost = Math.floor((Number(maxSol) || estimatedSol * 1.1) * 1_000_000_000);

      const txSignature = await buyTokens({
        memeAddress,
        amount: tokenAmount,
        maxSolCost,
      });

      toast({
        title: "Success!",
        description: `Bought ${amount} ${tokenSymbol}! TX: ${txSignature.slice(0, 8)}...`,
      });

      setAmount("");
      setMaxSol("");
    } catch (err: any) {
      console.error("Buy error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to buy tokens",
        variant: "destructive",
      });
    }
  };

  const handleSell = () => {
    toast({
      title: "Coming Soon",
      description: "Sell functionality will be available soon!",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <span className="text-white font-bold">{tokenSymbol[0]}</span>
          </div>
          <div>
            <h3 className="font-semibold" data-testid="text-trading-token-name">
              {tokenName}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">${tokenSymbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono" data-testid="text-trading-price">
            ${currentPrice.toFixed(6)}
          </p>
          <p className="text-sm text-muted-foreground">Current Price</p>
        </div>
      </div>

      {isAntiBundlePeriod && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-600">
              <p className="font-semibold">Anti-Bundle Period Active</p>
              <p className="text-xs mt-1">
                Purchases limited to 2.5% of supply for the first 15 minutes after launch.
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "buy" | "sell")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="buy" data-testid="tab-buy" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" data-testid="tab-sell" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4 mt-0">
          <div className="space-y-2">
            <Label htmlFor="buy-amount">
              Amount ({tokenSymbol})
              {!isAntiBundlePeriod && (
                <span className="ml-2 text-xs text-green-600">No limit</span>
              )}
            </Label>
            <Input
              id="buy-amount"
              type="number"
              placeholder="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-buy-amount"
              step="any"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-sol">Max SOL (Slippage Protection)</Label>
            <Input
              id="max-sol"
              type="number"
              placeholder={`Auto: ${(estimatedSol * 1.1).toFixed(4)}`}
              value={maxSol}
              onChange={(e) => setMaxSol(e.target.value)}
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for 10% slippage tolerance
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-mono font-semibold" data-testid="text-total-cost">
                ~{estimatedSol.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-mono">~0.00001 SOL</span>
            </div>
          </div>

          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90"
            onClick={handleBuy}
            disabled={!amount || Number(amount) <= 0 || !memeAddress || buyLoading}
            data-testid="button-confirm-buy"
          >
            {buyLoading ? "Buying..." : `Buy ${tokenSymbol}`}
          </Button>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4 mt-0">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="sell-amount">Amount</Label>
              <span className="text-sm text-muted-foreground">
                Balance: {userBalance} {tokenSymbol}
              </span>
            </div>
            <Input
              id="sell-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={userBalance}
              data-testid="input-sell-amount"
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You'll Receive</span>
              <span className="font-mono font-semibold" data-testid="text-receive-amount">
                ~{total.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-mono">~0.00001 SOL</span>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSell}
            disabled={!amount || Number(amount) <= 0 || Number(amount) > userBalance}
            data-testid="button-confirm-sell"
          >
            Sell {tokenSymbol}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
