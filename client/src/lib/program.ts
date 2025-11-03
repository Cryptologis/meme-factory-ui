import { PublicKey } from "@solana/web3.js";
import { Idl } from "@coral-xyz/anchor";
import MemeChainIDL from "./meme_chain.json";

// Updated to match the deployed devnet program
export const PROGRAM_ID = new PublicKey(
  "JDmuP2KvxCfRi1biCd3LKJAuycx5pBuHF6WYVf9sGL7M"
);

export const PROGRAM_IDL = MemeChainIDL as Idl;
