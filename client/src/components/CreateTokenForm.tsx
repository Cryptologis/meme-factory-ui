import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useCreateAndBuy } from "@/hooks/useCreateAndBuy";
import { VIRTUAL_SOL_RESERVES, VIRTUAL_TOKEN_RESERVES, TOKEN_MULTIPLIER } from "@/lib/constants";
import { Loader2, Upload, X } from "lucide-react";

interface CreateTokenFormProps {
  onSuccess?: (signature: string) => void;
}

export default function CreateTokenForm({ onSuccess }: CreateTokenFormProps) {
  const { toast } = useToast();
  const { createAndBuy, loading } = useCreateAndBuy();

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [buyPercentage, setBuyPercentage] = useState(1); // Start at 1% NOT 5%

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const simpleHash = (str: string): number[] => {
    const hash = new Uint8Array(32);
    for (let i = 0; i < str.length && i < 32; i++) {
      hash[i] = str.charCodeAt(i) % 256;
    }
    for (let i = str.length; i < 32; i++) {
      hash[i] = (hash[i % str.length] * (i + 1)) % 256;
    }
    return Array.from(hash);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.symbol || !imageFile) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload an image",
        variant: "destructive",
      });
      return;
    }

    // HARD CAP at 2.4% to stay under 2.5% limit
    const safeBuyPercentage = Math.min(buyPercentage, 2.4);
    
    if (buyPercentage > 2.4) {
      toast({
        title: "Warning",
        description: `Buy percentage capped at 2.4% (you selected ${buyPercentage}%)`,
      });
    }

    try {
      const hashSource = `${imageFile.name}-${Date.now()}-${formData.symbol}`;
      const imageHash = simpleHash(hashSource);
      const uri = imageHash.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');

      console.log('Creating token with URI:', uri, 'length:', uri.length);

      // Calculate buy amount based on virtual token reserves
      const virtualTokens = Number(VIRTUAL_TOKEN_RESERVES) / TOKEN_MULTIPLIER;
      const buyAmount = Math.floor((virtualTokens / 100) * safeBuyPercentage);
      
      // Double-check cap
      const maxAllowedBuy = Math.floor(virtualTokens * 0.024);
      const finalBuyAmount = Math.min(buyAmount, maxAllowedBuy);
      
      // Calculate cost using pump.fun bonding curve with 6 DECIMALS
      const VIRTUAL_SOL_RESERVES_BI = VIRTUAL_SOL_RESERVES; // 30 SOL in lamports
      const VIRTUAL_TOKEN_RESERVES_BI = VIRTUAL_TOKEN_RESERVES; // 1.073B tokens with 6 decimals
      const k = VIRTUAL_SOL_RESERVES_BI * VIRTUAL_TOKEN_RESERVES_BI;
      const currentTokenReserve = VIRTUAL_TOKEN_RESERVES_BI;
      const newTokenReserve = currentTokenReserve - BigInt(finalBuyAmount);
      const newSolReserve = k / newTokenReserve;
      const currentSolReserve = k / currentTokenReserve;
      const estimatedCost = Number(newSolReserve - currentSolReserve);
      const maxSolCost = Math.floor(estimatedCost * 1.5);

      console.log('Virtual tokens:', virtualTokens);
      console.log('Buy percentage:', safeBuyPercentage);
      console.log('Buy amount:', finalBuyAmount);
      console.log('Percentage of virtual supply:', ((finalBuyAmount / virtualTokens) * 100).toFixed(4) + '%');

      const txSignature = await createAndBuy({
        name: formData.name,
        symbol: formData.symbol,
        uri,
        imageHash,
        buyAmount: finalBuyAmount,
        estimatedCost,
        maxSolCost,
        buyPercentage: safeBuyPercentage,
      });

      if (onSuccess && txSignature) {
        onSuccess(txSignature);
      }

      toast({
        title: "Success!",
        description: `Token created! TX: ${txSignature.slice(0, 8)}...`,
      });

      setFormData({ name: "", symbol: "" });
      setImageFile(null);
      setImagePreview(null);
      setBuyPercentage(1);
    } catch (err: any) {
      console.error("Token creation error:", err);
      // Handle specific errors
      if (err.message.includes('LargeBuyDetected')) {
        toast({
          title: "Error",
          description: "Large buy detected. Wallet may be frozen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: err?.message || "Failed to create token",
          variant: "destructive",
        });
      }
    }
  };

  const virtualTokens = Number(VIRTUAL_TOKEN_RESERVES) / TOKEN_MULTIPLIER;
  const calculatedTokens = Math.floor((virtualTokens / 100) * Math.min(buyPercentage, 2.4));

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Token Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Doge Killer"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="DGKILLER"
            value={formData.symbol}
            onChange={handleInputChange}
            maxLength={10}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Token Image</Label>
          {!imagePreview ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload image (max 5MB)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF supported
                </p>
              </label>
            </div>
          ) : (
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Token preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full"
              >
                <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <Label>Initial Buy Percentage</Label>
          <span className="text-sm font-semibold">
            {Math.min(buyPercentage, 2.4).toFixed(1)}%
          </span>
        </div>
        <Slider
          value={[buyPercentage]}
          onValueChange={(value) => setBuyPercentage(value[0])}
          min={0.5}
          max={5}
          step={0.1}
          className="w-full"
        />
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>• You'll receive: ~{calculatedTokens.toLocaleString()} tokens</p>
          <p>• Maximum allowed: 2.4% during launch period</p>
          <p>• Any amount above 2.4% will be automatically capped</p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !formData.name || !formData.symbol || !imageFile}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Token...
          </>
        ) : (
          "Create Token"
        )}
      </Button>
    </form>
    </div>
  );
}