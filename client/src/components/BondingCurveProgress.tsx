import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Zap } from "lucide-react";
import { BN } from "@coral-xyz/anchor";
import { VIRTUAL_SOL_RESERVES, VIRTUAL_TOKEN_RESERVES, GRADUATION_THRESHOLD } from "@/lib/constants";

interface BondingCurveProgressProps {
  virtualSolReserves: any; // BN or BigInt
  virtualTokenReserves: any; // BN or BigInt
  totalSupply: any; // BN or BigInt
  targetSol?: number; // Target SOL for graduation (e.g., 85 SOL)
}

export default function BondingCurveProgress({
  virtualSolReserves,
  virtualTokenReserves,
  totalSupply,
  targetSol = Number(GRADUATION_THRESHOLD.toString()) / 1e9,
}: BondingCurveProgressProps) {
  // Convert to numbers with correct decimals
  const currentSol = Number(virtualSolReserves.toString()) / 1e9; // SOL has 9 decimals
  const tokensAvailable = Number(virtualTokenReserves.toString()) / 1e6; // Tokens have 6 decimals
  const totalTokens = Number(totalSupply.toString()) / 1e6; // Tokens have 6 decimals

  // DEBUG: Log the actual values
  console.log("🔍 BondingCurve Debug:", {
    virtualSolReserves: virtualSolReserves.toString(),
    virtualTokenReserves: virtualTokenReserves.toString(),
    totalSupply: totalSupply.toString(),
    currentSol,
    tokensAvailable,
    totalTokens,
  });

  // Initial reserves for calculations
  const initialSol = Number(VIRTUAL_SOL_RESERVES.toString()) / 1e9;
  const initialTokens = Number(VIRTUAL_TOKEN_RESERVES.toString()) / 1e6; // Also convert to millions
  
  // Calculate progress percentage (subtract initial reserves to start at 0%)
  const progressPercent = Math.max(0, Math.min(((currentSol - initialSol) / (targetSol - initialSol)) * 100, 100));
  
  // Calculate tokens sold
  const tokensSold = Math.max(0, initialTokens - tokensAvailable);
  const tokensSoldPercent = totalTokens > 0 ? (tokensSold / totalTokens) * 100 : 0;
  
  // Calculate current price using bonding curve formula
  // Price = (current_sol_reserves / current_token_reserves)
  const pricePerToken = tokensAvailable > 0 ? currentSol / tokensAvailable : 0;
  
  console.log("💰 Price Calculation:", {
    currentSol,
    tokensAvailable,
    pricePerToken,
    priceInSOL: pricePerToken,
    priceInUSD: pricePerToken * 150,
  });
  
  // Calculate market cap: total supply * current price
  const marketCapSOL = totalTokens * pricePerToken;
  
  // For USD conversion
  const solPriceUSD = 150;
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Bonding Curve Progress
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track progress toward Raydium graduation
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {progressPercent.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentSol.toFixed(2)} SOL collected</span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Target: {targetSol.toFixed(0)} SOL
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
            <div className="text-lg font-bold">${(marketCapSOL * solPriceUSD).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="text-xs text-muted-foreground">{marketCapSOL.toFixed(2)} SOL</div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Price</div>
            <div className="text-lg font-bold">${(pricePerToken * solPriceUSD).toFixed(8)}</div>
            <div className="text-xs text-muted-foreground">{pricePerToken.toExponential(4)} SOL</div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Tokens Sold</div>
            <div className="text-lg font-bold">{tokensSoldPercent.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">{tokensSold.toFixed(2)}M</div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Available</div>
            <div className="text-lg font-bold">{tokensAvailable.toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground">{((tokensAvailable / totalTokens) * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Graduation Alert */}
        {progressPercent >= 80 && progressPercent < 100 && (
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Zap className="w-5 h-5" />
              <div>
                <div className="font-semibold">Almost there!</div>
                <div className="text-sm">Only {(targetSol - currentSol).toFixed(2)} SOL until Raydium graduation</div>
              </div>
            </div>
          </div>
        )}

        {progressPercent >= 100 && (
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="font-semibold">🎉 Graduated!</div>
                <div className="text-sm">This token has graduated to Raydium</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
