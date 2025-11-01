import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useState, useRef } from "react";
import idl from "@/lib/meme_chain.json";
import { PROGRAM_ID, VIRTUAL_SOL_RESERVES, VIRTUAL_TOKEN_RESERVES, TOKEN_MULTIPLIER } from "@/lib/constants";

export interface CreateTokenParams {
  name: string;
  symbol: string;
  uri: string;
  imageHash: number[];
}

export function useCreateAndBuy() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false); // Prevent double submissions

  const createAndBuy = async (params: CreateTokenParams, buyAmountSol: number) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    // Prevent double submissions
    if (isProcessingRef.current) {
      console.log("Transaction already in progress, ignoring duplicate call");
      return;
    }

    isProcessingRef.current = true;
    setIsCreating(true);
    setError(null);

    try {
      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

      const program = new Program(idl as any, provider);

      // Derive PDAs
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        PROGRAM_ID
      );

      // Generate unique meme PDA using protocol's counter
      const protocolAccount = await program.account.protocol.fetch(protocolPda);
      const memeId = new BN(protocolAccount.totalMemesCreated);

      const [memePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("meme"), memeId.toArrayLike(Buffer, "le", 8)],
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
      isProcessingRef.current = false;
    }
  };

  return {
    createAndBuy,
    isCreating,
    error,
  };
}
