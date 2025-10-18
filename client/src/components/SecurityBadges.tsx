import { Shield, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface SecurityBadgesProps {
  features?: {
    antiPVP: boolean;
    antiBundling: boolean;
    liquidityLocked: boolean;
    kycEnabled: boolean;
    maxWalletPercent?: number;
  };
}

export default function SecurityBadges({
  features = {
    antiPVP: true,
    antiBundling: true,
    liquidityLocked: true,
    kycEnabled: false,
    maxWalletPercent: 2.0,
  },
}: SecurityBadgesProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-chart-3/10 to-primary/10 border-chart-3/20">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-chart-3" />
        <h3 className="font-semibold">Security Features</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="flex items-center gap-2"
          data-testid="badge-anti-pvp"
        >
          {features.antiPVP ? (
            <CheckCircle className="w-4 h-4 text-chart-3" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-chart-5" />
          )}
          <span className="text-sm">Anti-PVP</span>
        </div>

        <div
          className="flex items-center gap-2"
          data-testid="badge-anti-bundling"
        >
          {features.antiBundling ? (
            <CheckCircle className="w-4 h-4 text-chart-3" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-chart-5" />
          )}
          <span className="text-sm">Anti-Bundling</span>
        </div>

        <div
          className="flex items-center gap-2"
          data-testid="badge-liquidity-locked"
        >
          {features.liquidityLocked ? (
            <Lock className="w-4 h-4 text-chart-3" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-chart-5" />
          )}
          <span className="text-sm">Locked Liquidity</span>
        </div>

        <div
          className="flex items-center gap-2"
          data-testid="badge-wallet-limit"
        >
          <CheckCircle className="w-4 h-4 text-chart-3" />
          <span className="text-sm">{features.maxWalletPercent}% max (15 min)</span>
        </div>
      </div>

      {features.kycEnabled && (
        <Badge className="mt-4 bg-chart-3">
          KYC Verified Launch
        </Badge>
      )}
    </Card>
  );
}
