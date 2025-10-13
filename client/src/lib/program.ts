import { PublicKey } from "@solana/web3.js";
import { Idl } from "@coral-xyz/anchor";
import MemeChainIDL from "./meme_chain.json";

// Actual deployed Program ID on devnet
export const PROGRAM_ID = new PublicKey(
  "5mE8RwFEnMJ1Rs4bLM2VSrzMN8RSEJkf1vXb9VpAybvi"
);

// Import the actual IDL from meme_chain.json with proper typing
export const PROGRAM_IDL = MemeChainIDL as Idl;
