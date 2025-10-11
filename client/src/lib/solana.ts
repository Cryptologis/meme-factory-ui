import { clusterApiUrl } from "@solana/web3.js";

export const SOLANA_NETWORK = "devnet";
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

// Commitment level for transactions
export const COMMITMENT = "confirmed";
