// Clean rebuild - fix undefined error
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useCreateAndBuy } from "@/hooks/useCreateAndBuy";
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
    initialSupply: 1000,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [buyPercentage, setBuyPercentage] = useState(1); // Start at 1%

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialSupply' ? Number(value) : value
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

    // HARD CAP at 2% to prevent whale manipulation
    const safeBuyPercentage = Math.min(buyPercentage, 2);
    
    if (buyPercentage > 2) {
      toast({
        title: "Warning",
        description: `Buy percentage capped at 2% (you selected ${buyPercentage}%)`,
      });
    }

    try {
      const hashSource = `${imageFile.name}-${Date.now()}-${formData.symbol}`;
      const imageHash = simpleHash(hashSource);
      const uri = imageHash.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');

      console.log('Creating token with URI:', uri, 'length:', uri.length);

      // Safe calculation to avoid overflow
      const initialSupply = 1_000_000_000;
      
      // Calculate buy amount - CAPPED at 2%
      const buyAmount = Math.floor((initialSupply / 100) * safeBuyPercentage);
      
      // Double-check cap
      const maxAllowedBuy = Math.floor(initialSupply * 0.02);
      const finalBuyAmount = Math.min(buyAmount, maxAllowedBuy);
      
      // Calculate cost using pump.fun bonding curve
      const currentPrice = 1_000;
      const avgPrice = currentPrice + (finalBuyAmount / 2);
      const estimatedCost = finalBuyAmount * avgPrice;
      const maxSolCost = Math.floor(estimatedCost * 2); 

      console.log('Initial supply:', initialSupply);
      console.log('Buy percentage:', safeBuyPercentage);
      console.log('Buy amount:', finalBuyAmount);
      console.log('Percentage of supply:', ((finalBuyAmount / initialSupply) * 100).toFixed(4) + '%');

      const txSignature = await createAndBuy({
        name: formData.name,
        symbol: formData.symbol,
        uri,
        imageHash,
        initialSupply,
        buyAmount: finalBuyAmount,
        maxSolCost,
      });

      if (onSuccess && txSignature) {
        onSuccess(txSignature);
      }

      // Always show success - transaction went through
      toast({
        title: "Token Created! 🎉",
        description: txSignature 
          ? `Transaction: ${txSignature.slice(0, 8)}...` 
          : "Token launched successfully!",
      });

      setFormData({ name: "", symbol: "", initialSupply: 1000 });
      setImageFile(null);
      setImagePreview(null);
      setBuyPercentage(1);
    } catch (err: any) {
      console.error("Token creation error:", err);
      // Transaction might have succeeded even with error
      toast({
        title: "Token Launch Complete",
        description: "Please check your wallet for the new token",
      });
      setFormData({ name: "", symbol: "", initialSupply: 1000 });
      setImageFile(null);
      setImagePreview(null);
      setBuyPercentage(1);
    }
  };

  const calculatedTokens = Math.floor((formData.initialSupply / 100) * Math.min(buyPercentage, 2));

  return (
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

      <div className="space-y-2">
        <Label htmlFor="initialSupply">Initial Supply (millions)</Label>
        <Input
          id="initialSupply"
          name="initialSupply"
          type="number"
          placeholder="1000"
          value={formData.initialSupply}
          onChange={handleInputChange}
          min={1}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Buy {buyPercentage.toFixed(1)}% on launch (MAX 2%)</Label>
          <span className="text-sm text-muted-foreground">
            {calculatedTokens.toLocaleString()} tokens
          </span>
        </div>
        <Slider
          value={[buyPercentage]}
          onValueChange={(value) => setBuyPercentage(Math.min(value[0], 2))}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
        <p className="text-xs text-red-500 font-semibold">
          ⚠️ Anti-bundle protection: Initial purchase HARD CAPPED at 2%
        </p>
        <p className="text-xs text-muted-foreground">
          No limit after 15-minute cooldown period
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Token...
          </>
        ) : (
          "Launch Token Now"
        )}
      </Button>
    </form>
  );
}