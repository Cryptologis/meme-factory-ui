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
  buyAmount?: number;
  estimatedCost?: number;
  maxSolCost?: number;
  buyPercentage?: number;
}

export function useCreateAndBuy() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAndBuy = async (params: CreateAndBuyParams): Promise<string> => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    setIsCreating(true);
    setError(null);

    try {
      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
        skipPreflight: false,
      });

      const program = new Program(idl as any, provider);

      // Derive PDAs - using symbol-based seeds to match Rust program
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        PROGRAM_ID
      );

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

      console.log("🚀 Creating token:", params.symbol);
      console.log("📍 Meme PDA:", memePda.toString());
      console.log("🪙 Mint PDA:", mintPda.toString());

      // Build the transaction instruction
      const txBuilder = program.methods
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
        });

      // Send and get signature immediately
      let txSignature: string;
      
      try {
        // Use sendAndConfirm to get signature even on confirmation errors
        txSignature = await txBuilder.rpc({ 
          skipPreflight: false,
          commitment: "confirmed",
        });
        
        console.log("✅ Token created successfully!");
        console.log("📝 Transaction:", txSignature);
        console.log("🔗 Explorer:", `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`);
        
        return txSignature;

      } catch (rpcError: any) {
        console.log("⚠️ RPC Error caught:", rpcError);
        console.log("Error keys:", Object.keys(rpcError));
        
        // Try multiple ways to extract the signature
        let extractedSig = null;
        
        // Method 1: Direct signature property
        if (rpcError.signature) {
          extractedSig = rpcError.signature;
          console.log("Found signature in error.signature:", extractedSig);
        }
        
        // Method 2: Check if error has logs
        if (rpcError.logs) {
          console.log("Error has logs:", rpcError.logs);
        }

        // If transaction was already processed, it succeeded!
        if (rpcError.message?.includes("already been processed") || 
            rpcError.message?.includes("This transaction has already been processed")) {
          console.log("⚠️ Transaction already processed - token created successfully!");
          
          if (extractedSig) {
            console.log("✅ Using extracted signature:", extractedSig);
            console.log("🔗 Explorer:", `https://explorer.solana.com/tx/${extractedSig}?cluster=devnet`);
            return extractedSig;
          }
          
          // Query recent signatures from our wallet
          console.log("🔍 Attempting to find recent transaction...");
          try {
            const signatures = await connection.getSignaturesForAddress(wallet.publicKey, { limit: 5 });
            if (signatures && signatures.length > 0) {
              const latestSig = signatures[0].signature;
              console.log("✅ Found recent signature:", latestSig);
              console.log("🔗 Explorer:", `https://explorer.solana.com/tx/${latestSig}?cluster=devnet`);
              return latestSig;
            }
          } catch (queryError) {
            console.error("Failed to query recent signatures:", queryError);
          }
        }
        
        // If we get here and still no signature, throw the original error
        throw rpcError;
      }
      
    } catch (err: any) {
      console.error("❌ Create token error:", err);
      
      // Don't overwrite a successful signature extraction with an error
      const errorMessage = err.message || "Failed to create token";
      setError(errorMessage);
      throw err;
      
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAndBuy,
    isCreating,
    error,
    loading: isCreating,
  };
}
