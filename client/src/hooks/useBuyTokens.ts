import { useState } from "react";
import { useProgram } from "./useProgram";
import { useWallet } from "./useWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";

interface BuyTokensParams {
  memePda: string;
  solAmount: number;
}

export function useBuyTokens() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyTokens = async (params: BuyTokensParams) => {
    if (!program || !publicKey) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      const memePda = new PublicKey(params.memePda);
      const memeData = await program.account.memeToken.fetch(memePda);

      // Derive PDAs
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

      const buyerTokenAccount = await getAssociatedTokenAddress(
        mintPda,
        publicKey
      );

      const protocolData = await program.account.protocol.fetch(protocolPda);

      // Convert SOL to lamports
      const solAmountLamports = new BN(params.solAmount * 1e9);
      const minTokensOut = new BN(0);
      const maxSlippageBps = 500;

      console.log("🔄 Buying tokens with", params.solAmount, "SOL");

      // Add small delay to ensure unique transactions
      await new Promise(resolve => setTimeout(resolve, 100));

      const signature = await program.methods
        .buyTokens(solAmountLamports, minTokensOut, maxSlippageBps)
        .accounts({
          protocol: protocolPda,
          meme: memePda,
          mint: mintPda,
          buyerTokenAccount,
          bondingCurveVault: vaultPda,
          buyer: publicKey,
          creator: memeData.creator,
          feeRecipient: protocolData.feeRecipient,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc({
          skipPreflight: false,
          commitment: "confirmed",
        });

      console.log("✅ Transaction sent:", signature);
      console.log("🔗 View on explorer:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

      // Wait for confirmation with timeout
      const confirmationTimeout = 60000; // 60 seconds
      const startTime = Date.now();
      
      console.log("⏳ Waiting for confirmation...");
      
      try {
        const confirmation = await Promise.race([
          connection.confirmTransaction(signature, "confirmed"),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Confirmation timeout")), confirmationTimeout)
          )
        ]);

        console.log("✅ Transaction confirmed!");
        return signature;
      } catch (confirmError) {
        console.warn("⚠️ Confirmation timeout, but transaction may have succeeded");
        console.log("🔗 Check transaction:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
        // Still return signature so user can check
        return signature;
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Buy failed";
      setError(errorMessage);
      console.error("❌ Buy error:", err);
      
      // Try to extract signature from error if transaction was sent
      if (err?.signature) {
        console.log("Transaction may have been sent:", err.signature);
        console.log("Check:", `https://explorer.solana.com/tx/${err.signature}?cluster=devnet`);
        return err.signature;
      }
      
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
