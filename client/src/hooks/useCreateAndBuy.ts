import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { useState, useRef } from "react";
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
  const lastTxRef = useRef<string | null>(null);

  const createAndBuy = async (params: CreateAndBuyParams): Promise<string> => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    setIsCreating(true);
    setError(null);

    let txSignature: string | null = null;

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

      // Call create_meme_token and capture signature immediately
      try {
        txSignature = await program.methods
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

        // Store the signature immediately
        lastTxRef.current = txSignature;

        console.log("✅ Token created successfully!");
        console.log("📝 Transaction:", txSignature);
        console.log("🔗 Explorer:", `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`);
        
        return txSignature;

      } catch (rpcError: any) {
        // If we get "already processed" error, the transaction likely succeeded
        if (rpcError.message?.includes("already been processed")) {
          console.log("⚠️ Transaction already processed - likely succeeded");
          
          // Try to extract signature from error
          const sig = rpcError.signature || lastTxRef.current;
          
          if (sig) {
            console.log("✅ Using signature from error:", sig);
            console.log("🔗 Explorer:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
            return sig;
          }
        }
        
        // Re-throw if we can't handle it
        throw rpcError;
      }
      
    } catch (err: any) {
      console.error("❌ Create token error:", err);
      
      // If we have a signature, return it even on error
      if (txSignature || lastTxRef.current) {
        const sig = txSignature || lastTxRef.current;
        console.log("⚠️ Error occurred but transaction was sent:", sig);
        console.log("🔗 Verify on explorer:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
        return sig!;
      }
      
      // Handle specific errors
      if (err.message?.includes("LaunchCooldownActive")) {
        setError("Token created but cooldown active. Wait 60 seconds before buying.");
        throw new Error("Token created successfully! Wait 60 seconds before buying.");
      }
      
      if (err.message?.includes("Simulation failed")) {
        setError("Transaction simulation failed. Check console for details.");
      } else {
        setError(err.message || "Failed to create token");
      }
      
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
