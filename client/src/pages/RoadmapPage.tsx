import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Sparkles, Shield, TrendingUp, Vote, Coins } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <span>🗺️</span>
            Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our journey from beta to mainnet and beyond
          </p>
        </div>

        {/* Phase 1 - Core Features */}
        <Card className="p-6 mb-6 border-blue-500/50 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 1 - Core Features</h2>
              <Badge className="bg-blue-500 text-white hover:bg-blue-500">In Progress</Badge>
            </div>
          </div>
          <ul className="space-y-3 ml-13">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Token creation with bonding curve</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Buy/Sell functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Portfolio tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Anti-PVP & anti-bundling</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Reddit API integration</span>
            </li>
          </ul>
        </Card>

        {/* Phase 2 - Enhanced Features */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 2 - Enhanced Features</h2>
              <Badge variant="outline">Planned</Badge>
            </div>
          </div>
          <ul className="space-y-3 ml-13">
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Price calculator (estimate tokens before buying)</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Quick buy buttons (0.1, 0.5, 1 SOL presets)</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Transaction history</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Token pages with charts</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Slippage settings</span>
            </li>
          </ul>
        </Card>

        {/* Phase 3 - Social & Discovery */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 3 - Social & Discovery</h2>
              <Badge variant="outline">Planned</Badge>
            </div>
          </div>
          <ul className="space-y-3 ml-13">
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Twitter/X integration</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>YouTube trending integration</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>AI meme analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Trending tokens page</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Search & filters</span>
            </li>
          </ul>
        </Card>

        {/* Phase 4 - Governance & Decentralization */}
        <Card className="p-6 mb-6 border-primary/50 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 4 - Governance & Decentralization</h2>
              <Badge variant="outline" className="border-primary">Future</Badge>
            </div>
          </div>
          <ul className="space-y-3 ml-13">
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>$MEME Governance Token</strong> - Platform governance token</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>DAO implementation for protocol decisions</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div>Token holder voting on:</div>
                <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                  <li>• Fee structure adjustments</li>
                  <li>• New feature proposals</li>
                  <li>• Protocol parameter changes</li>
                  <li>• Treasury allocation</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Staking rewards for governance participants</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Delegation system for voting power</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Time-locked governance for security</span>
            </li>
          </ul>
        </Card>

        {/* Phase 5 - Security Audit & Testing */}
        <Card className="p-6 mb-6 border-orange-500/50 bg-orange-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 5 - Security Audit & Testing</h2>
              <Badge className="bg-orange-500 text-white hover:bg-orange-500">Critical</Badge>
            </div>
          </div>
          <ul className="space-y-3 ml-13">
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>Comprehensive security audit</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>Smart contract review</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>Extensive testing on devnet</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>Bug bounty program</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span><strong>Community feedback & fixes</strong></span>
            </li>
          </ul>
        </Card>

        {/* Phase 6 - Mainnet Launch */}
        <Card className="p-6 mb-8 border-chart-5/50 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-5/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-chart-5 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 6 - Mainnet Launch</h2>
              <Badge className="bg-gradient-to-r from-primary to-chart-5 text-white hover:from-primary hover:to-chart-5">The Goal</Badge>
            </div>
          </div>
          <ul className="space-y-3 ml-13">
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Final security audit</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Mainnet smart contract deployment</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Mainnet frontend deployment</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>$MEME governance token launch</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Marketing campaign</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Community building</span>
            </li>
          </ul>
        </Card>

        {/* Future Tokenomics */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Coins className="w-8 h-8" />
            Future Tokenomics ($MEME)
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Token Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Governance Token Distribution (Proposed)</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Community Rewards</span>
                    <span className="text-primary font-bold">40%</span>
                  </div>
                  <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                    <li>• Liquidity mining</li>
                    <li>• Airdrops to early users</li>
                    <li>• Trading incentives</li>
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Team & Development</span>
                    <span className="text-primary font-bold">25%</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-4">4-year vesting with cliff period</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Treasury & Ecosystem</span>
                    <span className="text-primary font-bold">20%</span>
                  </div>
                  <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                    <li>• Protocol development</li>
                    <li>• Grants program</li>
                    <li>• Marketing</li>
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Early Supporters & Advisors</span>
                    <span className="text-primary font-bold">10%</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-4">2-year vesting</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Initial Liquidity</span>
                    <span className="text-primary font-bold">5%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Token Utility */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">$MEME Token Utility</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span>🗳️</span>
                  <div>
                    <div className="font-medium">Governance Rights</div>
                    <div className="text-sm text-muted-foreground">Vote on protocol changes</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>💰</span>
                  <div>
                    <div className="font-medium">Fee Discounts</div>
                    <div className="text-sm text-muted-foreground">Reduced trading fees for holders</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>🎁</span>
                  <div>
                    <div className="font-medium">Revenue Sharing</div>
                    <div className="text-sm text-muted-foreground">Earn from protocol fees</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>⭐</span>
                  <div>
                    <div className="font-medium">Staking Rewards</div>
                    <div className="text-sm text-muted-foreground">Stake $MEME for yields</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>🚀</span>
                  <div>
                    <div className="font-medium">Priority Access</div>
                    <div className="text-sm text-muted-foreground">Early access to new features</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>🏆</span>
                  <div>
                    <div className="font-medium">Exclusive NFTs</div>
                    <div className="text-sm text-muted-foreground">Special perks for top holders</div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>

          {/* Why Governance */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-chart-2/5">
            <h3 className="text-xl font-bold mb-4">Why Governance?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Community Ownership</div>
                  <div className="text-sm text-muted-foreground">Users control the protocol</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Aligned Incentives</div>
                  <div className="text-sm text-muted-foreground">Token holders benefit from growth</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Decentralization</div>
                  <div className="text-sm text-muted-foreground">No single point of failure</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Active Participation</div>
                  <div className="text-sm text-muted-foreground">Engaged community building</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Value Capture</div>
                  <div className="text-sm text-muted-foreground">Token accrues value from protocol success</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Known Issues */}
        <Card className="p-6 bg-yellow-500/5 border-yellow-500/50">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            🐛 Known Issues & Testing
          </h3>
          <p className="text-muted-foreground mb-3">
            This is a <strong>BETA</strong> project on <strong>Devnet</strong>. Known issues:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span className="text-sm">Transaction confirmation timeouts (transactions succeed but may show errors)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span className="text-sm">Reddit API requires valid credentials in environment variables</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
