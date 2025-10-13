import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function useWallet() {
  const wallet = useSolanaWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (wallet.publicKey) {
      connection.getBalance(wallet.publicKey).then((balance) => {
        setBalance(balance / LAMPORTS_PER_SOL);
      });
    } else {
      setBalance(null);
    }
  }, [wallet.publicKey, connection]);

  return {
    ...wallet,
    balance,
  };
}
