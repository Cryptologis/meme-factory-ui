import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from './client/src/lib/meme_chain.json' assert { type: 'json' };

const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('JDmuP2KvxCfRi1biCd3LKJAuycx5pBuHF6WYVf9sGL7M');

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
