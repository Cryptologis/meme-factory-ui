import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import idl from "./client/src/lib/meme_chain.json";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const programId = new PublicKey("YOUR_PROGRAM_ID_HERE");

async function checkFees() {
  const provider = new AnchorProvider(connection, {} as Wallet, {});
  const program = new Program(idl as any, programId, provider);

  // Get protocol PDA
  const [protocolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("protocol")],
    programId
  );

  // Fetch protocol data
  const protocolData = await program.account.protocol.fetch(protocolPda);
  
  console.log("=== FEE CONFIGURATION ===");
  console.log("Fee Recipient:", protocolData.feeRecipient.toString());
  console.log("Platform Fee:", protocolData.platformFee, "basis points");
  console.log("Creator Fee:", protocolData.creatorFee, "basis points");
  
  // Check fee recipient balance
  const balance = await connection.getBalance(protocolData.feeRecipient);
  console.log("\n=== FEE RECIPIENT BALANCE ===");
  console.log("SOL Balance:", balance / 1e9, "SOL");
  
  // Get recent transactions
  const signatures = await connection.getSignaturesForAddress(
    protocolData.feeRecipient,
    { limit: 10 }
  );
  
  console.log("\n=== RECENT FEE TRANSACTIONS ===");
  console.log("Last 10 transactions:");
  for (const sig of signatures) {
    console.log(`- ${sig.signature.slice(0, 8)}... at ${new Date(sig.blockTime! * 1000).toLocaleString()}`);
  }
}

checkFees().catch(console.error);
