import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface PriceChartProps {
  tokenData: {
    virtualSolReserves: any;
    virtualTokenReserves: any;
    totalSupply: any;
    name: string;
    symbol: string;
  };
}

export default function PriceChart({ tokenData }: PriceChartProps) {
  const calculatePrice = () => {
    const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
    const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
    return solReserves / tokenReserves;
  };

  const currentPrice = calculatePrice();
  const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
  const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Token Stats</h3>
            <p className="text-sm text-muted-foreground">
              {tokenData.name} ({tokenData.symbol})
            </p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-2">Current Price per Token</p>
        <p className="text-4xl font-bold font-mono">
          {currentPrice.toFixed(9)} <span className="text-2xl text-muted-foreground">SOL</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">SOL Reserves</p>
          <p className="text-xl font-bold font-mono">
            {solReserves.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">SOL</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Token Reserves</p>
          <p className="text-xl font-bold font-mono">
            {tokenReserves.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Million</p>
        </div>
      </div>

      {/* Bonding Curve Info */}
      <div className="mt-6 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📊</div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Bonding Curve Active</h4>
            <p className="text-sm text-muted-foreground">
              This token uses a constant product bonding curve (x × y = k) for automated market making.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
