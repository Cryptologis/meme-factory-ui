# Solana Wallet Adapter Integration

This document describes the Solana wallet adapter integration for the Meme Factory UI.

## Overview

The application now uses the official Solana wallet adapter libraries to connect to Solana wallets (Phantom, Solflare) and interact with Solana programs on devnet.

## Dependencies Added

- `@solana/wallet-adapter-base`: Base functionality for wallet adapters
- `@solana/wallet-adapter-react`: React hooks for wallet interaction
- `@solana/wallet-adapter-react-ui`: Pre-built UI components for wallet connection
- `@solana/wallet-adapter-wallets`: Collection of wallet adapters (Phantom, Solflare)
- `@solana/web3.js`: Solana web3 library for blockchain interaction
- `@coral-xyz/anchor`: Anchor framework for Solana program interaction

## Key Components

### WalletContextProvider (`client/src/contexts/WalletContextProvider.tsx`)
Wraps the application with necessary wallet providers:
- `ConnectionProvider`: Manages Solana RPC connection
- `WalletProvider`: Manages wallet state and connections
- `WalletModalProvider`: Provides the wallet selection modal

### Hooks

#### useWallet (`client/src/hooks/useWallet.ts`)
Custom hook that extends the Solana wallet adapter with:
- All standard wallet adapter functionality (connect, disconnect, publicKey, etc.)
- Automatic SOL balance tracking for the connected wallet

#### useProgram (`client/src/hooks/useProgram.ts`)
Hook for interacting with the Anchor program:
- Creates an Anchor provider with the connected wallet
- Returns a program instance for calling program instructions

### Configuration Files

#### solana.ts (`client/src/lib/solana.ts`)
- Network configuration (devnet)
- RPC endpoint configuration
- Commitment level settings

#### program.ts (`client/src/lib/program.ts`)
- Program ID (placeholder - needs to be updated with actual deployed program)
- Program IDL (placeholder - needs to be updated with actual program IDL)

## Usage

### Connecting a Wallet

Click the "Connect Wallet" button in the header or hero section. This will open the Solana wallet adapter modal showing available wallets (Phantom and Solflare).

### Accessing Wallet Information

```typescript
import { useWallet } from '@/hooks/useWallet';

function MyComponent() {
  const { publicKey, connected, balance, disconnect } = useWallet();
  
  return (
    <div>
      {connected && publicKey && (
        <>
          <p>Address: {publicKey.toString()}</p>
          <p>Balance: {balance} SOL</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
}
```

### Interacting with the Program

```typescript
import { useProgram } from '@/hooks/useProgram';

function MyComponent() {
  const program = useProgram();
  
  // Use program to call instructions
  // Example: await program.methods.myInstruction().accounts({...}).rpc();
}
```

## Configuration Required

### Before Full Functionality

1. **Deploy Solana Program**: Deploy your Anchor program to Solana devnet
2. **Update Program ID**: Replace the placeholder in `client/src/lib/program.ts` with your actual program ID
3. **Update IDL**: Replace the placeholder IDL in `client/src/lib/program.ts` with your actual program IDL

### Network Configuration

By default, the application connects to Solana devnet. To change this:
1. Edit `SOLANA_NETWORK` in `client/src/lib/solana.ts`
2. Options: `"devnet"`, `"testnet"`, `"mainnet-beta"`

## Testing

The wallet integration has been tested with:
- ✅ Wallet modal appears when clicking "Connect Wallet"
- ✅ Phantom and Solflare wallets are shown as options
- ✅ Wallet connection state is managed correctly
- ✅ Balance display updates when wallet is connected
- ✅ Disconnect functionality works

Note: Full end-to-end testing requires:
- A browser wallet extension (Phantom or Solflare) installed
- A funded devnet wallet for testing transactions
- The actual Solana program deployed and configured

## Styling

The wallet adapter UI components use their default styling which integrates with the application's dark/light theme through the CSS import in `main.tsx`:

```typescript
import "@solana/wallet-adapter-react-ui/styles.css";
```

## Troubleshooting

### Wallet doesn't connect
- Ensure you have a compatible wallet extension installed
- Check that the wallet is unlocked
- Verify you're on the correct network (devnet)

### Balance shows as null
- Wallet may not be funded on devnet
- Get devnet SOL from: https://faucet.solana.com/

### Program interaction fails
- Ensure PROGRAM_ID and PROGRAM_IDL are correctly configured
- Verify the program is deployed to the correct network
- Check wallet has sufficient SOL for transaction fees
