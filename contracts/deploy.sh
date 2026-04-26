#!/bin/bash

# TipJar Soroban Contract Deployment Script

set -e

echo "🚀 Building and deploying TipJar Soroban contract..."

# Build the contract
echo "📦 Building contract..."
cargo build --target wasm32-unknown-unknown --release

# Optimize the WASM
echo "⚡ Optimizing WASM..."
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/tipjar_contract.wasm

# Deploy to testnet
echo "🌐 Deploying to Stellar testnet..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tipjar_contract.optimized.wasm \
  --source-account default \
  --network testnet)

echo "✅ Contract deployed successfully!"
echo "📋 Contract ID: $CONTRACT_ID"

# Initialize the contract
echo "🔧 Initializing contract..."
ADMIN_ADDRESS=$(soroban keys address default)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source-account default \
  --network testnet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS

echo "✅ Contract initialized with admin: $ADMIN_ADDRESS"
echo ""
echo "🎉 Deployment complete!"
echo "Contract ID: $CONTRACT_ID"
echo "Network: Stellar Testnet"
echo "Admin: $ADMIN_ADDRESS"
echo ""
echo "📝 Save this Contract ID for your frontend integration!"