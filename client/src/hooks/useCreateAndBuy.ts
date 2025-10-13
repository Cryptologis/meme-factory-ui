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
  imageHash: number[]; // Array of 32 bytes
  initialSupply: number;
  buyAmount: number;
  maxSolCost: number;
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
      // Derive PDAs according to your program's seeds
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

      // Fetch protocol account to get fee recipient
      const protocolAccount = await program.account.protocol.fetch(protocolPda);
      const feeRecipient = protocolAccount.feeRecipient;

      // Convert image hash to proper format (array of 32 numbers)
      const imageHashArray = Array.isArray(params.imageHash)
        ? params.imageHash
        : Array.from(params.imageHash);

      // Call the create_and_buy instruction
      const tx = await program.methods
        .createAndBuy(
          params.name,
          params.symbol,
          params.uri,
          imageHashArray,
          new BN(params.initialSupply),
          new BN(params.buyAmount),
          new BN(params.maxSolCost)
        )
        .accounts({
          protocol: protocolPda,
          meme: memePda,
          mint: mintPda,
          creatorTokenAccount: creatorTokenAccount,
          bondingCurveVault: bondingCurveVault,
          creator: publicKey,
          feeRecipient: feeRecipient,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      setSignature(tx);
      return tx;
    } catch (err: any) {
      const errorMessage = err?.message || "Transaction failed";
      setError(errorMessage);
      console.error("Create and buy error:", err);
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