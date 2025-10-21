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

interface CreateAndBuyParams {
  name: string;
  symbol: string;
  uri: string;
  imageHash: number[];
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
        [Buffer.from("meme"), publicKey.toBuffer(), Buffer.from(params.symbol)],
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

      // Initial virtual reserves for bonding curve
      // These values set the initial price: Price = SOL_reserves / Token_reserves
      // With 30 SOL / 1073 tokens = ~0.028 SOL per token starting price
      const initialVirtualSolReserves = new BN(30_000_000_000); // 30 SOL (30 * 10^9 lamports)
      const initialVirtualTokenReserves = new BN(1_073_000_000_000); // 1,073 tokens (1073 * 10^9 base units)

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
