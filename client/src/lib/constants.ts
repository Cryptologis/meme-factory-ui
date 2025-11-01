import { PublicKey } from '@solana/web3.js';

// ===== UPDATED: Program ID from your redeployed Rust program =====
export const PROGRAM_ID = new PublicKey('CRJDPpTp3aayKYZCaLEYntnpP3xvwbeTDYMdu18RtHwh');

// Using the Triton One RPC for devnet
export const DEVNET_ENDPOINT = 'https://pit129.nodes.rpcpool.com';
export const COMMITMENT = 'confirmed';

// ===== TOKEN DECIMALS - UPDATED FROM 9 TO 6 =====
export const TOKEN_DECIMALS = 6;
export const TOKEN_MULTIPLIER = Math.pow(10, TOKEN_DECIMALS); // 1,000,000

// ===== BONDING CURVE CONSTANTS (6 DECIMALS) =====
export const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1B tokens with 6 decimals
export const VIRTUAL_SOL_RESERVES = 30_000_000_000n; // 30 SOL in lamports
