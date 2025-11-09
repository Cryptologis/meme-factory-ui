import { useEffect, useState } from "react";
import { useProgram } from "./useProgram";
import { useConnection } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";

export interface RecentToken {
  mint: string;
  pda: string;
  name: string;
  symbol: string;
  creator: string;
  virtualSolReserves: BN;
  virtualTokenReserves: BN;
  totalSupply: BN;
  isGraduated: boolean;
  createdAt?: number;
}

export function useRecentTokens(limit: number = 6) {
  const program = useProgram();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<RecentToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecentTokens = async () => {
      if (!program) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all meme tokens from the program
        const allMemes = await program.account.memeToken.all();

        // Convert to our token format
        const recentTokens: RecentToken[] = allMemes.map((meme) => ({
          mint: meme.account.mint.toString(),
          pda: meme.publicKey.toString(),
          name: meme.account.name,
          symbol: meme.account.symbol,
          creator: meme.account.creator.toString(),
          virtualSolReserves: meme.account.virtualSolReserves,
          virtualTokenReserves: meme.account.virtualTokenReserves,
          totalSupply: meme.account.totalSupply,
          isGraduated: meme.account.isGraduated,
          createdAt: meme.account.createdAt?.toNumber(),
        }));

        // Sort by creation time (most recent first)
        // If createdAt is not available, keep original order
        const sortedTokens = recentTokens.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt - a.createdAt;
        });

        // Take only the most recent tokens up to the limit
        const limitedTokens = sortedTokens.slice(0, limit);

        if (mounted) {
          setTokens(limitedTokens);
        }
      } catch (err: any) {
        console.error("Error fetching recent tokens:", err);
        if (mounted) {
          setError(err.message || "Failed to fetch tokens");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentTokens();

    return () => {
      mounted = false;
    };
  }, [program, limit]);

  return { tokens, loading, error };
}
