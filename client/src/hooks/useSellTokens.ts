import { useState } from "react";
import { useProgram } from "./useProgram";
import { useWallet } from "./useWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";

interface SellTokensParams {
  memePda: string;
  tokenAmount: number;
}

export function useSellTokens() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sellTokens = async (params: SellTokensParams) => {
    if (!program || !publicKey) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      const memePda = new PublicKey(params.memePda);
      const memeData = await program.account.memeToken.fetch(memePda);

      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        program.programId
      );

      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), memePda.toBuffer()],
        program.programId
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), memePda.toBuffer()],
        program.programId
      );

      const sellerTokenAccount = await getAssociatedTokenAddress(
        mintPda,
        publicKey
      );

      const protocolData = await program.account.protocol.fetch(protocolPda);

      const tokenAmountRaw = new BN(params.tokenAmount * 1e6);
      const minSolOut = new BN(0);
      const maxSlippageBps = 500;

      console.log("Selling", params.tokenAmount, "tokens");

      await new Promise(resolve => setTimeout(resolve, 100));

      const tx = await program.methods
        .sellTokens(tokenAmountRaw, minSolOut, maxSlippageBps)
        .accounts({
          protocol: protocolPda,
          meme: memePda,
          mint: mintPda,
          sellerTokenAccount,
          bondingCurveVault: vaultPda,
          seller: publicKey,
          creator: memeData.creator,
          feeRecipient: protocolData.feeRecipient,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc({
          skipPreflight: false,
          commitment: "confirmed",
        });

      console.log("Sell successful:", tx);
      
      try {
        await connection.confirmTransaction(tx, "confirmed");
      } catch (confirmError) {
        console.log("Transaction succeeded but confirmation timed out");
      }
      
      return tx;
    } catch (err: any) {
      const errorMessage = err?.message || "Sell failed";
      setError(errorMessage);
      console.error("Sell error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sellTokens,
    loading,
    error,
  };
}
