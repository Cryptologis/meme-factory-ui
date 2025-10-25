import { useState } from "react";
import { useProgram } from "./useProgram";
import { useWallet } from "./useWallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { VIRTUAL_SOL_RESERVES, VIRTUAL_TOKEN_RESERVES, TOKEN_MULTIPLIER } from "@/lib/constants"; // Added for anti-sniping precision

interface CreateAndBuyParams {
  name: string;
  symbol: string;
  uri: string;
  imageHash: number[];
  buyAmount?: number; // Added for buy logic
  buyPercentage?: number; // Added for buy percentage
}

export function useCreateAndBuy() {
  const program = useProgram();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const createAndBuy = async (params: CreateAndBuyParams) => {
    if (!program || !publicKey || !signTransaction) {
      throw new Error("Wallet not connected or program not initialized");
    }

    setLoading(true);
    setError(null);
    setSignature(null);

    try {
      // Derive PDAs
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        program.programId
      );

      const [memePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("meme"), Buffer.from(params.symbol)],
        program.programId
      );

      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), memePda.toBuffer()],
        program.programId
      );

      const [creatorTokenAccount] = PublicKey.findProgramAddressSync(
        [
          publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintPda.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const [bondingCurveVault] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), memePda.toBuffer()],
        program.programId
      );

      // Convert to proper format
      const imageHashArray = Array.isArray(params.imageHash)
        ? params.imageHash
        : Array.from(params.imageHash);

      // Initial virtual reserves for bonding curve (updated to 6 decimals)
      // Anti-Sniping: Use constants for precision with BN.js
      const initialVirtualSolReserves = new BN(VIRTUAL_SOL_RESERVES.toString()); // 30 SOL in lamports (9 decimals)
      const initialVirtualTokenReserves = new BN(VIRTUAL_TOKEN_RESERVES.toString()); // 1.073B tokens with 6 decimals

      console.log("Creating token with params:", {
        name: params.name,
        symbol: params.symbol,
        uri: params.uri,
        initialVirtualSolReserves: initialVirtualSolReserves.toString(),
        initialVirtualTokenReserves: initialVirtualTokenReserves.toString(),
      });

      // Call create_meme_token
      const tx = await program.methods
        .createMemeToken(
          params.name,
          params.symbol,
          params.uri,
          imageHashArray,
          initialVirtualSolReserves,
          initialVirtualTokenReserves
        )
        .accounts({
          protocol: protocolPda,
          meme: memePda,
          mint: mintPda,
          creatorTokenAccount: creatorTokenAccount,
          bondingCurveVault: bondingCurveVault,
          creator: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc({
          skipPreflight: false,
          commitment: "confirmed",
        });

      console.log("Token creation successful:", tx);

      // Anti-Sniping: If buy amount is specified, call buy_tokens
      if (params.buyAmount && params.buyAmount > 0) {
        const buyPercentage = params.buyPercentage || 1;
        const virtualTokens = Number(VIRTUAL_TOKEN_RESERVES) / TOKEN_MULTIPLIER;
        const finalBuyAmount = Math.min(params.buyAmount, Math.floor(virtualTokens * buyPercentage / 100));

        // Calculate cost using bonding curve
        const k = VIRTUAL_SOL_RESERVES * VIRTUAL_TOKEN_RESERVES;
        const newTokenReserve = VIRTUAL_TOKEN_RESERVES - BigInt(finalBuyAmount);
        const newSolReserve = k / newTokenReserve;
        const estimatedCost = Number(newSolReserve - VIRTUAL_SOL_RESERVES);

        // Call buy_tokens
        const buyTx = await program.methods
          .buyTokens(
            new BN(estimatedCost), // sol_amount
            new BN(finalBuyAmount * TOKEN_MULTIPLIER), // min_tokens_out
            new BN(5000) // max_slippage_bps
          )
          .accounts({
            protocol: protocolPda,
            meme: memePda,
            mint: mintPda,
            buyerTokenAccount: creatorTokenAccount, // Assuming creator buys
            bondingCurveVault: bondingCurveVault,
            buyer: publicKey,
            creator: publicKey,
            feeRecipient: publicKey, // Placeholder
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            instructionSysvar: SYSVAR_RENT_PUBKEY, // Placeholder for priority fee
          })
          .rpc({
            skipPreflight: false,
            commitment: "confirmed",
          });

        console.log("Buy successful:", buyTx);
        await connection.confirmTransaction(buyTx, "confirmed");
      }

      // Wait for confirmation
      await connection.confirmTransaction(tx, "confirmed");

      setSignature(tx);
      return tx;
    } catch (err: any) {
      const errorMessage = err?.message || "Transaction failed";
      setError(errorMessage);
      console.error("Create token error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAndBuy,
    loading,
    error,
    signature,
  };
}
// Updated for anti-sniping and 6 decimals: Fri Oct 25 00:10:55 UTC 2025
