# TipJar Soroban Contract Deployment Script for Windows

Write-Host "🚀 Building and deploying TipJar Soroban contract..." -ForegroundColor Green

# Check if Soroban CLI is installed
if (!(Get-Command "soroban" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Soroban CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install Soroban CLI first:" -ForegroundColor Yellow
    Write-Host "cargo install --locked soroban-cli" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Note: You may need Visual Studio Build Tools for Windows" -ForegroundColor Yellow
    Write-Host "Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/" -ForegroundColor Cyan
    exit 1
}

# Build the contract
Write-Host "📦 Building contract..." -ForegroundColor Blue
cargo build --target wasm32-unknown-unknown --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please ensure you have Visual Studio Build Tools installed." -ForegroundColor Red
    exit 1
}

# Optimize the WASM
Write-Host "⚡ Optimizing WASM..." -ForegroundColor Blue
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/tipjar_contract.wasm

# Deploy to testnet
Write-Host "🌐 Deploying to Stellar testnet..." -ForegroundColor Blue
$CONTRACT_ID = soroban contract deploy `
  --wasm target/wasm32-unknown-unknown/release/tipjar_contract.optimized.wasm `
  --source-account default `
  --network testnet

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Contract deployed successfully!" -ForegroundColor Green
Write-Host "📋 Contract ID: $CONTRACT_ID" -ForegroundColor Cyan

# Initialize the contract
Write-Host "🔧 Initializing contract..." -ForegroundColor Blue
$ADMIN_ADDRESS = soroban keys address default

soroban contract invoke `
  --id $CONTRACT_ID `
  --source-account default `
  --network testnet `
  -- `
  initialize `
  --admin $ADMIN_ADDRESS

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Initialization failed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Contract initialized with admin: $ADMIN_ADDRESS" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "Contract ID: $CONTRACT_ID" -ForegroundColor Cyan
Write-Host "Network: Stellar Testnet" -ForegroundColor Cyan
Write-Host "Admin: $ADMIN_ADDRESS" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Save this Contract ID for your frontend integration!" -ForegroundColor Yellow

# Save contract ID to file
$CONTRACT_ID | Out-File -FilePath "contract-id.txt" -Encoding UTF8
Write-Host "💾 Contract ID saved to contract-id.txt" -ForegroundColor Blue