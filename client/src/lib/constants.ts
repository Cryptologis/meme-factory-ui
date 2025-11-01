import { PublicKey } from '@solana/web3.js';

// Program ID from deployed Rust program
export const PROGRAM_ID = new PublicKey('3HNNR5wUZxPpFUDfmHA9UEfDagN1i8bxMjtm8Hea5yPf');

// Using the Triton One RPC for devnet
export const DEVNET_ENDPOINT = 'https://pit129.nodes.rpcpool.com';
export const COMMITMENT = 'confirmed';

// ===== TOKEN DECIMALS =====
export const TOKEN_DECIMALS = 6;
export const TOKEN_MULTIPLIER = Math.pow(10, TOKEN_DECIMALS); // 1,000,000

// ===== BONDING CURVE CONSTANTS (Pump.fun style - 1 BILLION supply) =====
export const TOTAL_SUPPLY = 1_000_000_000n; // 1 billion tokens (raw value with 6 decimals)
export const VIRTUAL_SOL_RESERVES = 30_000_000_000n; // 30 SOL in lamports (9 decimals)
export const VIRTUAL_TOKEN_RESERVES = 1_073_000_000n; // ~1.073 billion tokens (raw value with 6 decimals)
export const REAL_TOKEN_RESERVES_INITIAL = 800_000_000n; // 800M tokens for bonding curve
export const GRADUATION_THRESHOLD = 85_000_000_000n; // 85 SOL for graduation

// Helper functions
export const toTokenAmount = (tokens: number): bigint => {
  return BigInt(Math.floor(tokens * TOKEN_MULTIPLIER));
};

export const fromTokenAmount = (amount: bigint): number => {
  return Number(amount) / TOKEN_MULTIPLIER;
};

export const toSolAmount = (sol: number): bigint => {
  return BigInt(Math.floor(sol * 1_000_000_000)); // SOL has 9 decimals
};

export const fromSolAmount = (lamports: bigint): number => {
  return Number(lamports) / 1_000_000_000;
};
