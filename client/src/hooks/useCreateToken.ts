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
      // Upload image to IPFS or a storage service
      // For now, we'll use a placeholder
      const imageUrl = "https://via.placeholder.com/400";

      // Create metadata URI (in production, upload to IPFS)
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

      // Generate new mint keypair
      const mintKeypair = Keypair.generate();

      // Derive PDAs
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("protocol")],
        PROGRAM_ID
      );

      const [bondingCurvePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mintKeypair.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), bondingCurvePda.toBuffer()],
        PROGRAM_ID
      );

      // Get associated token accounts
      const creatorTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );

      const buyerTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );

      // Fetch protocol to get fee recipient
      const protocolAccount = await program.account.protocol.fetch(protocolPda);

      // Create and buy in one transaction
      const lamports = new BN(initialBuyAmount * web3.LAMPORTS_PER_SOL);
      const minTokensOut = new BN(0); // Set slippage tolerance in production

      const tx = await program.methods
        .createAndBuy(
          metadata.name,
          metadata.symbol,
          uri,
          lamports,
          minTokensOut
        )
        .accounts({
          protocol: protocolPda,
          mint: mintKeypair.publicKey,
          bondingCurve: bondingCurvePda,
          vault: vaultPda,
          creator: wallet.publicKey,
          creatorTokenAccount: creatorTokenAccount,
          buyer: wallet.publicKey,
          buyerTokenAccount: buyerTokenAccount,
          feeRecipient: protocolAccount.feeRecipient,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([mintKeypair])
        .rpc();

      console.log("Token created successfully:", tx);
      return {
        mint: mintKeypair.publicKey.toString(),
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
