import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TokenCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  liquidity: number;
  marketCap: number;
  onBuy?: () => void;
  onSell?: () => void;
}

export default function TokenCard({
  symbol,
  name,
  price,
  change24h,
  liquidity,
  marketCap,
  onBuy = () => console.log("Buy clicked"),
  onSell = () => console.log("Sell clicked"),
}: TokenCardProps) {
  const isPositive = change24h >= 0;

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-token-${symbol}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{symbol[0]}</span>
          </div>
          <div>
            <h3 className="font-semibold" data-testid={`text-token-name-${symbol}`}>
              {name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">${symbol}</p>
          </div>
        </div>

        <Badge
          variant={isPositive ? "default" : "destructive"}
          className="gap-1"
          data-testid={`badge-change-${symbol}`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? "+" : ""}
          {change24h.toFixed(2)}%
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-mono font-semibold" data-testid={`text-price-${symbol}`}>
            ${price.toFixed(6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Liquidity</span>
          <span className="font-mono text-sm" data-testid={`text-liquidity-${symbol}`}>
            ${liquidity.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Market Cap</span>
          <span className="font-mono text-sm" data-testid={`text-marketcap-${symbol}`}>
            ${marketCap.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 bg-chart-3 hover:bg-chart-3/90"
          onClick={onBuy}
          data-testid={`button-buy-${symbol}`}
        >
          Buy
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onSell}
          data-testid={`button-sell-${symbol}`}
        >
          Sell
        </Button>
      </div>
    </Card>
  );
}
