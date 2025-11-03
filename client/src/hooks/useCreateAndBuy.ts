import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { useState } from "react";
import idl from "../lib/meme_chain.json";
import { PROGRAM_ID } from "../lib/constants";
import {
  VIRTUAL_SOL_RESERVES,
  VIRTUAL_TOKEN_RESERVES,
} from "../lib/constants";

export interface CreateAndBuyParams {
  name: string;
  symbol: string;
  uri: string;
  imageHash: number[];
  buyAmount: number;
}

export function useCreateAndBuy() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAndBuy = async (params: CreateAndBuyParams) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    setIsCreating(true);
    setError(null);

    try {
      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
      });

      const program = new Program(idl as any, provider);

      // Derive PDAs - FIXED to use symbol instead of memeId
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        PROGRAM_ID
      );

      // ✅ FIXED: Use symbol.as_bytes() to match Rust program
      const [memePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("meme"), Buffer.from(params.symbol)],
        PROGRAM_ID
      );

      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), memePda.toBuffer()],
        PROGRAM_ID
      );

      const creatorTokenAccount = await getAssociatedTokenAddress(
        mintPda,
        wallet.publicKey
      );

      const imageHashArray = params.imageHash.length === 32 
        ? params.imageHash 
        : [...params.imageHash, ...Array(32 - params.imageHash.length).fill(0)];

      const initialVirtualSolReserves = new BN(VIRTUAL_SOL_RESERVES.toString());
      const initialVirtualTokenReserves = new BN(VIRTUAL_TOKEN_RESERVES.toString());

      console.log("Creating token with params:", {
        name: params.name,
        symbol: params.symbol,
        uri: params.uri,
        memePda: memePda.toString(),
        mintPda: mintPda.toString(),
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
          creator: wallet.publicKey,
          creatorTokenAccount: creatorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
        })
        .rpc({ skipPreflight: false });

      console.log("Token created successfully:", tx);
      
      return {
        mint: mintPda.toString(),
        meme: memePda.toString(),
        signature: tx,
      };
    } catch (err: any) {
      console.error("Create token error:", err);
      
      // Handle specific cooldown error
      if (err.message && err.message.includes("LaunchCooldownActive")) {
        const cooldownMessage = "⏱️ ANTI-BOT PROTECTION ACTIVE!\n\n" +
          "Your token was created successfully! 🎉\n\n" +
          "However, you must wait 60 seconds after token creation before making your first purchase. " +
          "This cooldown prevents bot sniping and ensures fair launches.\n\n" +
          "Please wait 60 seconds and try buying again.";
        setError(cooldownMessage);
        throw new Error(cooldownMessage);
      }
      
      // Ignore "already processed" errors since the token was created
      if (err.message && err.message.includes("already been processed")) {
        console.log("Transaction already processed - token created successfully");
        // Don't throw, just return success
        return {
          mint: "created",
          meme: "created",
          signature: "already_processed",
        };
      }
      
      setError(err.message || "Failed to create token");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAndBuy,
    isCreating,
    error,
  };
}
