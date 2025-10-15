import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from './client/src/lib/meme_chain.json' assert { type: 'json' };

const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('5mE8RwFEnMJ1Rs4bLM2VSrzMN8RSEJkf1vXb9VpAybvi');

// Get protocol PDA
const [protocolPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('protocol')],
  programId
);

console.log('Fetching protocol account:', protocolPda.toString());

// We need to fetch and decode the account
connection.getAccountInfo(protocolPda).then(info => {
  console.log('Account data:', info);
});
