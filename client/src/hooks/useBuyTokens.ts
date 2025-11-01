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
      console.log("=== BUY TOKENS DEBUG ===");
      console.log("1. Input params:", params);
      console.log("2. Wallet:", publicKey.toString());
      
      const memePda = new PublicKey(params.memePda);
      console.log("3. Meme PDA:", memePda.toString());
      
      const memeData = await program.account.memeToken.fetch(memePda);
      console.log("4. Meme Data:", {
        name: memeData.name,
        symbol: memeData.symbol,
        virtualSol: memeData.virtualSolReserves.toString(),
        virtualTokens: memeData.virtualTokenReserves.toString(),
        totalSupply: memeData.totalSupply.toString(),
      });

      // Derive PDAs
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        program.programId
      );
      console.log("5. Protocol PDA:", protocolPda.toString());

      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), memePda.toBuffer()],
        program.programId
      );
      console.log("6. Mint PDA:", mintPda.toString());

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), memePda.toBuffer()],
        program.programId
      );
      console.log("7. Vault PDA:", vaultPda.toString());

      const buyerTokenAccount = await getAssociatedTokenAddress(
        mintPda,
        publicKey
      );
      console.log("8. Buyer Token Account:", buyerTokenAccount.toString());

      const protocolData = await program.account.protocol.fetch(protocolPda);
      console.log("9. Protocol Data:", {
        feeRecipient: protocolData.feeRecipient.toString(),
      });

      // Convert SOL to lamports - BE VERY CAREFUL HERE
      const solAmountLamports = new BN(Math.floor(params.solAmount * 1e9));
      console.log("10. SOL amount in lamports:", solAmountLamports.toString());
      
      const minTokensOut = new BN(0);
      const maxSlippageBps = 500;
      
      console.log("11. Min tokens out:", minTokensOut.toString());
      console.log("12. Max slippage BPS:", maxSlippageBps);

      // Check if values are reasonable
      if (solAmountLamports.isNeg() || solAmountLamports.isZero()) {
        throw new Error("Invalid SOL amount");
      }

      if (solAmountLamports.gt(new BN(1e12))) { // More than 1000 SOL
        throw new Error("SOL amount too large");
      }

      console.log("13. Building transaction...");

      const accounts = {
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
      };

      console.log("14. Accounts:", accounts);

      console.log("15. Sending transaction...");

      const signature = await program.methods
        .buyTokens(solAmountLamports, minTokensOut, maxSlippageBps)
        .accounts(accounts)
        .rpc({
          skipPreflight: false,
          commitment: "confirmed",
        });

      console.log("✅ Transaction sent:", signature);
      console.log("🔗 View on explorer:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

      // Wait for confirmation
      console.log("⏳ Waiting for confirmation...");
      
      try {
        const confirmationTimeout = 60000;
        await Promise.race([
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
        return signature;
      }
    } catch (err: any) {
      console.error("❌ BUY ERROR:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);
      console.error("Full error:", JSON.stringify(err, null, 2));
      
      // Check for specific error types
      if (err.message?.includes("overflow")) {
        console.error("🚨 OVERFLOW ERROR DETECTED");
        console.error("This usually means a calculation in the smart contract exceeded limits");
      }
      
      if (err.logs) {
        console.error("Program logs:", err.logs);
      }
      
      const errorMessage = err?.message || "Buy failed";
      setError(errorMessage);
      
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
