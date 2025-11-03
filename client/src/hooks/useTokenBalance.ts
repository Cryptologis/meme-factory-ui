import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { useWallet } from "./useWallet";

interface UseTokenBalanceParams {
  mintAddress: string;
  enabled?: boolean;
}

export function useTokenBalance({ mintAddress, enabled = true }: UseTokenBalanceParams) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!publicKey || !mintAddress || !enabled) {
      setBalance(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const tokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      );

      try {
        const accountInfo = await getAccount(connection, tokenAccount);
        // Balance is in raw units (1e6 for 6 decimals)
        const balanceAmount = Number(accountInfo.amount);
        setBalance(balanceAmount);
      } catch (err: any) {
        // Account doesn't exist or has no balance
        if (err.name === "TokenAccountNotFoundError") {
          setBalance(0);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Error fetching token balance:", err);
      setError(err.message);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, mintAddress, connection, enabled]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  };
}
