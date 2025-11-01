import { PublicKey } from "@solana/web3.js";
import { Idl } from "@coral-xyz/anchor";
import MemeChainIDL from "./meme_chain.json";

// ===== UPDATED: Program ID from Solana repo (sync with CRJDPp...) =====
// This should match the declare_id! in your lib.rs file
export const PROGRAM_ID = new PublicKey(
  "CRJDPpTp3aayKYZCaLEYntnpP3xvwbeTDYMdu18RtHwh"
);

// Import the actual IDL from meme_chain.json with proper typing
export const PROGRAM_IDL = MemeChainIDL as Idl;