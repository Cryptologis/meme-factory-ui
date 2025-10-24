import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    try {
      const hashSource = `${imageFile.name}-${Date.now()}-${formData.symbol}-${Math.random()}`;
      const imageHash = simpleHash(hashSource);
      const uri = `${imageHash.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('')}-${Date.now()}`;

      console.log('Creating token with URI:', uri, 'length:', uri.length);

      const txSignature = await createAndBuy({
        name: formData.name,
        symbol: formData.symbol,
        uri,
        imageHash,
      });

      if (onSuccess && txSignature) {
        onSuccess(txSignature);
      }

      toast({
        title: "Token Created!",
        description: txSignature
          ? `Transaction: ${txSignature.slice(0, 8)}...`
          : "Token launched successfully!",
      });

      setFormData({ name: "", symbol: "" });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Token creation error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to create token",
        variant: "destructive",
      });
    }
  };

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

      <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium">Token Details</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Fixed supply: 1,000,000,000 tokens</li>
          <li>• Initial virtual reserves: 30 SOL / 800K tokens</li>
          <li>• Bonding curve pricing model</li>
        </ul>
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