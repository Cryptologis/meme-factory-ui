/**
 * client/scripts/create_test_token.js
 *
 * Usage:
 *   node client/scripts/create_test_token.js <RPC_URL> <KEYPAIR_JSON_PATH> "<TOKEN_NAME>" "<SYMBOL>"
 *
 * Example:
 *   node client/scripts/create_test_token.js https://api.devnet.solana.com /Users/samuelgonzalez/.config/solana/id.json "Test Token" "TST"
 */
const anchor = require("@project-serum/anchor");
const fs = require("fs");
const { PublicKey } = require("@solana/web3.js");

async function main() {
  const [, , rpcUrl, keypairPath, name, symbol] = process.argv;
  if (!rpcUrl || !keypairPath || !name || !symbol) {
    console.error("Usage: node client/scripts/create_test_token.js <RPC_URL> <KEYPAIR_JSON_PATH> \"<TOKEN_NAME>\" \"<SYMBOL>\"");
    process.exit(1);
  }

  // Load wallet keypair
  const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
  const walletKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(secret));
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(rpcUrl, "confirmed"),
    new anchor.Wallet(walletKeypair),
    anchor.AnchorProvider.defaultOptions()
  );
  anchor.setProvider(provider);

  // Load IDL (JSON) shipped with the UI (ensure file exists client/src/lib/meme_chain.json)
  const idl = require("../src/lib/meme_chain.json");

  // Program ID used by the UI
  const PROGRAM_ID = new PublicKey("FgKLBQuE6Ksctz4gjFk1BjiBCcUqmnYFy7986ecuNqLS");
  const program = new anchor.Program(idl, PROGRAM_ID, provider);

  // PDAs used by the program
  const [protocolPda] = PublicKey.findProgramAddressSync([Buffer.from("protocol")], program.programId);
  const creatorPubkey = provider.wallet.publicKey;
  const [memePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("meme"), creatorPubkey.toBuffer(), Buffer.from(symbol)],
    program.programId
  );
  const [mintPda] = PublicKey.findProgramAddressSync([Buffer.from("mint"), memePda.toBuffer()], program.programId);
  const [bondingCurveVault] = PublicKey.findProgramAddressSync([Buffer.from("vault"), memePda.toBuffer()], program.programId);

  // Standard program IDs
  const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
  const [creatorTokenAccount] = PublicKey.findProgramAddressSync(
    [creatorPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPda.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Fetch protocol to get feeRecipient
  const protocolAccount = await program.account.protocol.fetch(protocolPda);
  const feeRecipient = protocolAccount.feeRecipient;

  // Placeholder imageHash (32 bytes)
  const imageHashArray = new Array(32).fill(0);

  // Reserve values
  const LAMPORTS_PER_SOL = 1_000_000_000;
  const DECIMALS = 9;
  const HUMAN_SUPPLY = BigInt(1_000_000_000);
  const TOKEN_MULTIPLIER = BigInt(10) ** BigInt(DECIMALS);
  const initialVirtualTokenRaw = HUMAN_SUPPLY * TOKEN_MULTIPLIER;
  const initialVirtualSolLamports = BigInt(30) * BigInt(LAMPORTS_PER_SOL);

  console.log("Creating token with:");
  console.log("  name:", name);
  console.log("  symbol:", symbol);
  console.log("  protocolPda:", protocolPda.toString());
  console.log("  memePda:", memePda.toString());
  console.log("  mintPda:", mintPda.toString());
  console.log("  creatorTokenAccount (PDA):", creatorTokenAccount.toString());
  console.log("  initialVirtualSolLamports:", initialVirtualSolLamports.toString());
  console.log("  initialVirtualTokenRaw:", initialVirtualTokenRaw.toString());

  try {
    const tx = await program.methods
      .createMemeToken(
        name,
        symbol,
        `https://example.com/${symbol.toLowerCase()}`,
        imageHashArray,
        new anchor.BN(initialVirtualSolLamports.toString()),
        new anchor.BN(initialVirtualTokenRaw.toString())
      )
      .accounts({
        protocol: protocolPda,
        meme: memePda,
        mint: mintPda,
        creatorTokenAccount: creatorTokenAccount,
        bondingCurveVault: bondingCurveVault,
        creator: creatorPubkey,
        feeRecipient: feeRecipient,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("Create tx signature:", tx);
    console.log(`Open in explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  } catch (err) {
    console.error("Error creating token:", err);
  }
}

main();
