import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBuyTokens } from "@/hooks/useBuyTokens";
import { Loader2, TrendingUp } from "lucide-react";

interface BuyTokenFormProps {
  memeAddress: string;
  tokenSymbol: string;
  currentPrice?: number;
  onSuccess?: (signature: string) => void;
}

export default function BuyTokenForm({ 
  memeAddress, 
  tokenSymbol, 
  currentPrice,
  onSuccess 
}: BuyTokenFormProps) {
  const { toast } = useToast();
  const { buyTokens, loading } = useBuyTokens();
  const [amount, setAmount] = useState("");
  const [maxSol, setMaxSol] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert to tokens with 6 decimals
      const tokenAmount = Math.floor(parseFloat(amount) * 1_000_000);
      const maxSolCost = Math.floor(parseFloat(maxSol) * 1_000_000_000);

      const txSignature = await buyTokens({
        memeAddress,
        amount: tokenAmount,
        maxSolCost,
      });

      if (onSuccess && txSignature) {
        onSuccess(txSignature);
      }

      toast({
        title: "Success!",
        description: `Bought ${amount} ${tokenSymbol}! TX: ${txSignature.slice(0, 8)}...`,
      });

      // Reset form
      setAmount("");
    } catch (err: any) {
      console.error("Buy error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to buy tokens",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({tokenSymbol})</Label>
        <Input
          id="amount"
          type="number"
          placeholder="1000000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          step="any"
          required
        />
        <p className="text-xs text-muted-foreground">
          No purchase limit after anti-bundle period (15 min)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxSol">Max SOL to Spend</Label>
        <Input
          id="maxSol"
          type="number"
          placeholder="1.0"
          value={maxSol}
          onChange={(e) => setMaxSol(e.target.value)}
          min={0}
          step="0.1"
          required
        />
        <p className="text-xs text-muted-foreground">
          Slippage protection - transaction fails if cost exceeds this
        </p>
      </div>

      {currentPrice && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            Estimated cost: ~{(parseFloat(amount) * currentPrice).toFixed(4)} SOL
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buying...
          </>
        ) : (
          <>
            <TrendingUp className="mr-2 h-4 w-4" />
            Buy {tokenSymbol}
          </>
        )}
      </Button>
    </form>
  );
}
