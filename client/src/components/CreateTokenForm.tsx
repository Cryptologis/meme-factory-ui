import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CreateTokenFormProps {
  onSubmit?: (data: TokenFormData) => void;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
}

export default function CreateTokenForm({
  onSubmit = (data) => console.log("Token created:", data),
}: CreateTokenFormProps) {
  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    symbol: "",
    decimals: 9,
    supply: 1000000,
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onSubmit(formData);
    setIsCreating(false);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Create Your Token</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="token-name">Token Name</Label>
          <Input
            id="token-name"
            placeholder="e.g., My Awesome Token"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            data-testid="input-token-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="token-symbol">Token Symbol</Label>
          <Input
            id="token-symbol"
            placeholder="e.g., MAT"
            value={formData.symbol}
            onChange={(e) =>
              setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
            }
            maxLength={10}
            required
            data-testid="input-token-symbol"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="token-decimals">Decimals</Label>
            <Input
              id="token-decimals"
              type="number"
              min="0"
              max="18"
              value={formData.decimals}
              onChange={(e) =>
                setFormData({ ...formData, decimals: Number(e.target.value) })
              }
              required
              data-testid="input-token-decimals"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token-supply">Total Supply</Label>
            <Input
              id="token-supply"
              type="number"
              min="1"
              value={formData.supply}
              onChange={(e) =>
                setFormData({ ...formData, supply: Number(e.target.value) })
              }
              required
              data-testid="input-token-supply"
            />
          </div>
        </div>

        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span data-testid="text-preview-name">{formData.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Symbol:</span>
              <span className="font-mono" data-testid="text-preview-symbol">
                {formData.symbol || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Decimals:</span>
              <span data-testid="text-preview-decimals">{formData.decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Supply:</span>
              <span data-testid="text-preview-supply">
                {formData.supply.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
          <span className="text-sm text-muted-foreground">Estimated Fee:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">~0.001 SOL</span>
            <Badge variant="secondary">Devnet</Badge>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full gap-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
          disabled={isCreating}
          data-testid="button-create-token"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Create Token
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
