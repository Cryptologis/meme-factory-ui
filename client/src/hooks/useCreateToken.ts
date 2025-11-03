import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useState } from "react";
import idl from "../lib/meme_chain.json";
import { PROGRAM_ID } from "../lib/program";

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: File;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export function useCreateToken() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createToken = async (metadata: TokenMetadata, initialBuyAmount: number) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    setIsCreating(true);
    setError(null);

    try {
      console.log("=== CREATE TOKEN DEBUG ===");
      console.log("1. Metadata:", metadata);
      console.log("2. Initial buy:", initialBuyAmount);

      // Upload image to IPFS or a storage service
      const imageUrl = "https://via.placeholder.com/400";

      // Create metadata URI
      const uri = JSON.stringify({
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image: imageUrl,
        external_url: metadata.website || "",
        twitter: metadata.twitter || "",
        telegram: metadata.telegram || "",
      });

      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
      });

      const program = new Program(idl as any, provider);

      // Derive PDAs - FIXED to match Rust program
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        PROGRAM_ID
      );
      console.log("3. Protocol PDA:", protocolPda.toString());

      // Meme PDA uses [b"meme", symbol.as_bytes()] - NOT creator key!
      const [memePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("meme"), Buffer.from(metadata.symbol)],
        PROGRAM_ID
      );
      console.log("4. Meme PDA:", memePda.toString());

      // Mint PDA
      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), memePda.toBuffer()],
        PROGRAM_ID
      );
      console.log("5. Mint PDA:", mintPda.toString());

      // Vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), memePda.toBuffer()],
        PROGRAM_ID
      );
      console.log("6. Vault PDA:", vaultPda.toString());

      // Get associated token accounts
      const creatorTokenAccount = await getAssociatedTokenAddress(
        mintPda,
        wallet.publicKey
      );
      console.log("7. Creator token account:", creatorTokenAccount.toString());

      // Fetch protocol to get fee recipient
      const protocolAccount = await program.account.protocol.fetch(protocolPda);
      console.log("8. Fee recipient:", protocolAccount.feeRecipient.toString());

      // STEP 1: Create the meme token
      console.log("9. Creating meme token...");
      const createTx = await program.methods
        .createMemeToken(
          metadata.name,
          metadata.symbol,
          uri
        )
        .accounts({
          protocol: protocolPda,
          meme: memePda,
          mint: mintPda,
          vault: vaultPda,
          creator: wallet.publicKey,
          creatorTokenAccount: creatorTokenAccount,
          feeRecipient: protocolAccount.feeRecipient,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      console.log("✅ Token created:", createTx);
      console.log("🔗 View:", `https://explorer.solana.com/tx/${createTx}?cluster=devnet`);

      // Wait for confirmation
      await connection.confirmTransaction(createTx, "confirmed");

      // STEP 2: Buy tokens if initial buy amount > 0
      if (initialBuyAmount > 0) {
        console.log("10. Buying tokens...");
        console.log("⏱️ Waiting 5 seconds for cooldown...");
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        const buyerTokenAccount = await getAssociatedTokenAddress(
          mintPda,
          wallet.publicKey
        );

        const lamports = new BN(initialBuyAmount * web3.LAMPORTS_PER_SOL);
        const minTokensOut = new BN(0);
        const maxSlippageBps = 500;

        const buyTx = await program.methods
          .buyTokens(lamports, minTokensOut, maxSlippageBps)
          .accounts({
            protocol: protocolPda,
            meme: memePda,
            mint: mintPda,
            buyerTokenAccount: buyerTokenAccount,
            bondingCurveVault: vaultPda,
            buyer: wallet.publicKey,
            creator: wallet.publicKey,
            feeRecipient: protocolAccount.feeRecipient,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        console.log("✅ Buy complete:", buyTx);
        console.log("🔗 View:", `https://explorer.solana.com/tx/${buyTx}?cluster=devnet`);
      }

      return {
        mint: mintPda.toString(),
        signature: createTx,
      };
    } catch (err: any) {
      console.error("❌ Create token error:", err);
      
      if (err.message && err.message.includes("LaunchCooldownActive")) {
        const cooldownMessage = "⏱️ Token created! Wait 60 seconds before buying.";
        setError(cooldownMessage);
        throw new Error(cooldownMessage);
      }
      
      setError(err.message || "Failed to create token");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createToken,
    isCreating,
    error,
  };
}
