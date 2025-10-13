import { useState } from "react";
import { useProgram } from "./useProgram";
import { useWallet } from "./useWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";

interface BuyTokensParams {
  memeAddress: string;
  amount: number;
  maxSolCost: number;
}

export function useBuyTokens() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyTokens = async (params: BuyTokensParams) => {
    if (!program || !publicKey) {
      throw new Error("Wallet not connected or program not initialized");
    }

    setLoading(true);
    setError(null);

    try {
      const memePda = new PublicKey(params.memeAddress);

      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), memePda.toBuffer()],
        program.programId
      );

      const [buyerTokenAccount] = PublicKey.findProgramAddressSync(
        [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPda.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const [bondingCurveVault] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), memePda.toBuffer()],
        program.programId
      );

      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        program.programId
      );

      const protocolAccount = await program.account.protocol.fetch(protocolPda);
      const feeRecipient = protocolAccount.feeRecipient;

      // No wallet limit check here - this is for post-launch buys
      const tx = await program.methods
        .buyTokens(new BN(params.amount), new BN(params.maxSolCost))
        .accounts({
          protocol: protocolPda,
          meme: memePda,
          mint: mintPda,
          buyerTokenAccount: buyerTokenAccount,
          bondingCurveVault: bondingCurveVault,
          buyer: publicKey,
          feeRecipient: feeRecipient,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err: any) {
      const errorMessage = err?.message || "Buy transaction failed";
      setError(errorMessage);
      console.error("Buy tokens error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    buyTokens,
    loading,
    error,
  };
}
