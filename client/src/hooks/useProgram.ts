import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "./useWallet";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PROGRAM_ID, PROGRAM_IDL } from "@/lib/program";
import { useMemo } from "react";

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet.publicKey) return null;

    // Create a provider
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );

    // Create program instance
    return new Program(PROGRAM_IDL as any, PROGRAM_ID, provider);
  }, [connection, wallet, wallet.publicKey]);

  return program;
}
