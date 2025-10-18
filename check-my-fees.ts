import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const feeRecipient = new PublicKey("3Jziur76cXfsNeKsdgXo4zADnynA2SDJekqJiSfLEPgU");

async function checkFees() {
  console.log("🔍 Checking fees for:", feeRecipient.toString());
  
  const balance = await connection.getBalance(feeRecipient);
  console.log("\n💰 Current Balance:", (balance / 1e9).toFixed(4), "SOL");
  
  const signatures = await connection.getSignaturesForAddress(feeRecipient, { limit: 20 });
  console.log("\n📊 Recent Transactions:", signatures.length);
  
  let totalFeesReceived = 0;
  
  for (const sig of signatures) {
    const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
    
    if (tx?.meta) {
      const accountIndex = tx.transaction.message.accountKeys.findIndex(k => k.pubkey.toString() === feeRecipient.toString());
      
      if (accountIndex !== -1) {
        const preBalance = tx.meta.preBalances[accountIndex];
        const postBalance = tx.meta.postBalances[accountIndex];
        const change = (postBalance - preBalance) / 1e9;
        
        if (change > 0) {
          console.log(`\n✅ Fee received: +${change.toFixed(6)} SOL`);
          console.log(`   TX: ${sig.signature.slice(0, 8)}...`);
          console.log(`   Time: ${new Date(sig.blockTime! * 1000).toLocaleString()}`);
          totalFeesReceived += change;
        }
      }
    }
  }
  
  console.log("\n💎 Total Fees Collected (last 20 tx):", totalFeesReceived.toFixed(6), "SOL");
}

checkFees().catch(console.error);
