import { useState } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradingPanelProps {
  tokenSymbol?: string;
  tokenName?: string;
  currentPrice?: number;
  userBalance?: number;
  onTrade?: (type: "buy" | "sell", amount: number) => void;
}

export default function TradingPanel({
  tokenSymbol = "DOGE",
  tokenName = "Doge Coin",
  currentPrice = 0.000123,
  userBalance = 0,
  onTrade = (type, amount) => console.log(`${type} ${amount}`),
}: TradingPanelProps) {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const total = Number(amount) * currentPrice;

  const handleTrade = () => {
    if (amount && Number(amount) > 0) {
      onTrade(activeTab, Number(amount));
      setAmount("");
    }
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
            <Label htmlFor="buy-amount">Amount</Label>
            <Input
              id="buy-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-buy-amount"
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Cost</span>
              <span className="font-mono font-semibold" data-testid="text-total-cost">
                {total.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-mono">~0.00001 SOL</span>
            </div>
          </div>

          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90"
            onClick={handleTrade}
            disabled={!amount || Number(amount) <= 0}
            data-testid="button-confirm-buy"
          >
            Buy {tokenSymbol}
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
                {total.toFixed(6)} SOL
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
            onClick={handleTrade}
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
