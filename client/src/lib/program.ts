import { PublicKey } from "@solana/web3.js";
import { Idl } from "@coral-xyz/anchor";
import MemeChainIDL from "./meme_chain.json";

// Updated to match the deployed devnet program
export const PROGRAM_ID = new PublicKey(
  "CRJDPpTp3aayKYZCaLEYntnpP3xvwbeTDYMdu18RtHwh"
);

export const PROGRAM_IDL = MemeChainIDL as Idl;
