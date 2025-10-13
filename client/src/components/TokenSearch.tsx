import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublicKey } from "@solana/web3.js";

interface TokenSearchProps {
  onTokenSelect: (tokenAddress: string) => void;
}

export default function TokenSearch({ onTokenSelect }: TokenSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    
    if (!searchInput.trim()) {
      setError("Please enter a token address");
      return;
    }

    try {
      setIsSearching(true);
      
      // Validate it's a valid Solana address
      new PublicKey(searchInput.trim());
      
      // If valid, call the callback
      onTokenSelect(searchInput.trim());
      
    } catch (err) {
      setError("Invalid Solana address. Please check and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Search Token</h3>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Enter token mint address..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setError(null);
          }}
          onKeyPress={handleKeyPress}
          className="flex-1 font-mono text-sm"
          disabled={isSearching}
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !searchInput.trim()}
          className="gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground mt-3">
        Enter a Solana token mint address to trade. Example: 5mE8RwFEnMJ1Rs4bLM2VSrzMN8RSEJkf1vXb9VpAybvi
      </p>
    </Card>
  );
}
