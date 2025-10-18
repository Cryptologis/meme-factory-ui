import CreateTokenForm from "@/components/CreateTokenForm";
import SecurityBadges from "@/components/SecurityBadges";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Users } from "lucide-react";

export default function CreateTokenPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Launch Your Fair Token</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create a token with built-in anti-PVP and anti-bundling protection on Solana devnet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-3 to-primary flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Anti-PVP Protection</h3>
                <p className="text-sm text-muted-foreground">
                  No sniper bots or front-running allowed
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Anti-Bundling</h3>
                <p className="text-sm text-muted-foreground">
                  2% max per wallet for first 15 minutes
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-2 to-chart-3 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Fair Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Locked liquidity and vesting schedules
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CreateTokenForm
              onSubmit={(data) => {
                console.log("Token created:", data);
                alert(`Fair launch token ${data.symbol} created successfully!`);
              }}
            />
          </div>

          <div className="space-y-6">
            <SecurityBadges />

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-lg">🚀</span>
                Launch Features
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Bot protection for first 5 blocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Max 2% per wallet for 15 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>No cooldown between purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Automatic liquidity lock (30 days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Creator rewards on every trade</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Solana devnet deployment</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}