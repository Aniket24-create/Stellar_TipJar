# TipJar Soroban Smart Contract

A Rust-based smart contract for the TipJar application built on Stellar's Soroban platform.

**Source Code:** [src/lib.rs](./src/lib.rs)

## Features

- **Send Tips**: Users can send tips with messages to other users
- **Claim Tips**: Recipients can claim their tips individually or in batches
- **Tip History**: Track all tips with timestamps and messages
- **Statistics**: Global statistics for total tips and amounts
- **Emergency Functions**: Admin controls for emergency situations

## Contract Functions

### Core Functions

- `initialize(admin: Address)` - Initialize the contract with an admin
- `send_tip(from, to, token_address, amount, message)` - Send a tip to another user
- `claim_tip(tip_id, token_address)` - Claim a specific tip
- `batch_claim_tips(tip_ids, token_address)` - Claim multiple tips at once

### Query Functions

- `get_tip(tip_id)` - Get details of a specific tip
- `get_user_tips(user)` - Get all tip IDs for a user
- `get_stats()` - Get global contract statistics

### Admin Functions

- `emergency_withdraw(token_address, amount, to)` - Emergency withdrawal (admin only)

## Data Structures

### Tip
```rust
pub struct Tip {
    pub id: u64,
    pub from: Address,
    pub to: Address,
    pub amount: i128,
    pub message: String,
    pub timestamp: u64,
    pub claimed: bool,
}
```

### TipStats
```rust
pub struct TipStats {
    pub total_tips: u64,
    pub total_amount: i128,
    pub unique_tippers: u64,
}
```

## Development

### Prerequisites

- Rust 1.70+
- Soroban CLI
- Stellar CLI

### Setup

1. Install Soroban CLI:
```bash
cargo install --locked soroban-cli
```

2. Configure Stellar testnet:
```bash
soroban network add testnet \
  --global \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

3. Create a test identity:
```bash
soroban keys generate --global default
soroban keys fund default --network testnet
```

### Build

```bash
cargo build --target wasm32-unknown-unknown --release
```

### Test

```bash
cargo test
```

### Deploy

Make the deploy script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Integration with Frontend

After deployment, update your frontend environment variables:

```env
VITE_TIPJAR_CONTRACT_ID=your_deployed_contract_id_here
```

Then use the contract in your React app:

```typescript
import { Contract, SorobanRpc } from '@stellar/stellar-sdk';

const contract = new Contract(process.env.VITE_TIPJAR_CONTRACT_ID!);

// Send a tip
const sendTipTx = contract.call(
  'send_tip',
  fromAddress,
  toAddress,
  tokenAddress,
  amount,
  message
);
```

## Security Considerations

- The contract uses Soroban's built-in authorization system
- All tip transfers go through the contract for escrow
- Admin functions are protected by address verification
- Emergency withdrawal is available for admin only

## License

MIT License - see LICENSE file for details