import { Shield, Lock, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeatureHighlight() {
  const features = [
    {
      icon: Shield,
      title: "Anti-PVP Protection",
      description: "No sniper bots, no front-running. Fair launch for everyone.",
      badge: "Protected",
      color: "from-chart-3 to-primary",
    },
    {
      icon: Lock,
      title: "Anti-Bundling",
      description: "Prevent whale manipulation with wallet limits and KYC.",
      badge: "Secure",
      color: "from-primary to-chart-2",
    },
    {
      icon: TrendingUp,
      title: "Reddit Trending",
      description: "Launch tokens based on viral memes from Reddit.",
      badge: "AI Powered",
      color: "from-chart-2 to-chart-3",
    },
    {
      icon: Users,
      title: "Fair Distribution",
      description: "5% max per wallet, locked liquidity, vesting schedules.",
      badge: "Fair Launch",
      color: "from-chart-5 to-chart-4",
    },
  ];

  return (
    <div className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4">Why Choose Meme Factory</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Fair, Secure, & Community-Driven
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The only launchpad that prioritizes fairness and community protection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 hover-elevate">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="mb-3">
                {feature.badge}
              </Badge>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
