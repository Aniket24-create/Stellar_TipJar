# TipJar Setup Guide

This guide will help you set up and deploy the complete TipJar application with both the frontend and Soroban smart contract.

## Prerequisites

### For Frontend Development
- Node.js 18+ 
- npm 9+
- [Freighter Wallet](https://www.freighter.app/) browser extension

### For Smart Contract Development
- Rust 1.70+
- Visual Studio Build Tools (Windows) or build-essential (Linux/macOS)
- Soroban CLI
- Stellar CLI

## Quick Start

### 1. Clone and Setup Frontend

```bash
git clone https://github.com/Aniket24-create/Stellar_TipJar.git
cd Stellar_TipJar
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
# Optional - for gasless transactions (testnet only)
VITE_SPONSOR_SECRET_KEY=your_testnet_sponsor_secret_here

# Will be added after contract deployment
VITE_TIPJAR_CONTRACT_ID=your_contract_id_here
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and connect your Freighter wallet (set to Testnet).

## Smart Contract Deployment

### Windows Setup

1. **Install Visual Studio Build Tools**
   - Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Install with "C++ build tools" workload

2. **Install Soroban CLI**
   ```powershell
   cargo install --locked soroban-cli
   ```

3. **Setup Stellar Network**
   ```powershell
   soroban network add testnet --global --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
   ```

4. **Create Test Identity**
   ```powershell
   soroban keys generate --global default
   soroban keys fund default --network testnet
   ```

5. **Deploy Contract**
   ```powershell
   cd contracts
   .\deploy.ps1
   ```

### Linux/macOS Setup

1. **Install Dependencies**
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install build-essential

   # macOS
   xcode-select --install
   ```

2. **Install Soroban CLI**
   ```bash
   cargo install --locked soroban-cli
   ```

3. **Setup and Deploy**
   ```bash
   soroban network add testnet --global --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
   soroban keys generate --global default
   soroban keys fund default --network testnet
   
   cd contracts
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Integration

After successful contract deployment:

1. Copy the Contract ID from the deployment output
2. Add it to your `.env` file:
   ```env
   VITE_TIPJAR_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Restart your development server

## Testing

### Frontend Tests
```bash
npm test
```

### Contract Tests
```bash
cd contracts
cargo test
```

## Deployment to Production

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Contract (Mainnet)
1. Switch to mainnet configuration:
   ```bash
   soroban network add mainnet --global --rpc-url https://horizon.stellar.org --network-passphrase "Public Global Stellar Network ; September 2015"
   ```
2. Fund your mainnet account with real XLM
3. Deploy using mainnet network parameter

## Troubleshooting

### Common Issues

**Build Tools Missing (Windows)**
- Install Visual Studio Build Tools with C++ workload
- Restart terminal after installation

**Soroban CLI Installation Fails**
- Ensure Rust is up to date: `rustup update`
- Try installing with `--force` flag

**Contract Deployment Fails**
- Check network connectivity
- Ensure account is funded: `soroban keys fund default --network testnet`
- Verify network configuration

**Frontend Connection Issues**
- Ensure Freighter is set to correct network (Testnet/Mainnet)
- Check contract ID in environment variables
- Verify RPC endpoint accessibility

### Getting Help

- [Stellar Discord](https://discord.gg/stellar)
- [Soroban Documentation](https://soroban.stellar.org/)
- [GitHub Issues](https://github.com/Aniket24-create/Stellar_TipJar/issues)

## Architecture Overview

```
TipJar Application
├── Frontend (React + TypeScript)
│   ├── Wallet Integration (Freighter)
│   ├── Stellar SDK Integration
│   └── Smart Contract Interaction
└── Smart Contract (Rust + Soroban)
    ├── Tip Management
    ├── Batch Operations
    └── Statistics Tracking
```

The application uses a hybrid approach:
- Direct Stellar payments for simple tips (current implementation)
- Smart contract escrow for advanced features (future enhancement)
- Gasless transactions via fee bumping (optional)