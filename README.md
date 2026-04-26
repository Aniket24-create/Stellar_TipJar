# Stellar TipJar dApp

A premium, production-ready decentralized application built on the Stellar Testnet for sending instant, gasless micro-payments (tips). The UI is inspired by modern Web3 fintech products like Stripe and Coinbase, featuring a dark neon-glow theme, glassmorphism, and a responsive layout.

## 🚀 Live Demo & Repository
- **Live Demo URL**: [https://stellar-tipjar.vercel.app](https://stellar-tipjar.vercel.app) *(Placeholder - Update with your Vercel URL)*
- **GitHub Repository**: [https://github.com/Aniket24-create/StarSend-X](https://github.com/Aniket24-create/StarSend-X)

## 📱 Screenshots

### Mobile Responsive View
*(Insert your mobile screen recording/screenshot here)*
![Mobile View Placeholder](https://via.placeholder.com/400x800?text=Mobile+Responsive+View)

### Dashboard & Send Tip
![Dashboard UI](https://via.placeholder.com/800x400?text=Dashboard+and+Send+Tip)

## ⚙️ CI/CD Pipeline
We use GitHub Actions for automated testing and builds.
![CI/CD Status](https://img.shields.io/github/actions/workflow/status/Aniket24-create/StarSend-X/main.yml?branch=main)

## 🔗 Stellar Blockchain Details
- **Transaction Hash (Example Tip)**: `[Insert a successful transaction hash here]`
- **Contract Addresses (Soroban)**: *N/A - This dApp currently uses native Stellar operations and Fee Bump transactions.*
- **Custom Token / Pool Address**: *N/A - This dApp currently utilizes native XLM for tips.*

## ✨ Features
- **Freighter Wallet Integration**: Secure, non-custodial login.
- **Gasless Tipping**: Transaction fees are sponsored via the Stellar Fee Bump mechanism using an environment-provided sponsor key.
- **Alias Resolution**: Send tips easily using mock federation aliases like `@alice` or `@bob`.
- **Quick Tips**: Predefined buttons (1 XLM, 5 XLM, 10 XLM) for fast sending.
- **Receive QR Codes**: Instantly generate QR codes for your Stellar wallet address.

## 🛠 Technical Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion
- **Blockchain**: Stellar SDK, Freighter API v6
- **Network**: Stellar Testnet

## 📥 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Used to sign Fee Bump transactions for gasless tips (Testnet only)
   VITE_SPONSOR_SECRET_KEY=SBFFAMYOFSV6TC2BTPAMECFBPB7SH3NJUSFDGOWWKXXQTDCH5TEO6VPM
   ```
4. **Start Development Server**: `npm run dev`

## 📊 User Feedback & Onboarding
We actively collect feedback to improve the dApp.
- **Feedback Form**: [Google Form Link](#) *(Update with your form link)*
- **Exported Excel Data**: [Download Feedback Responses (Dummy Link)](#)

### Improvement Tracking
Based on feedback from our initial 5 testnet users, we implemented the following improvements:
- **Improvement 1:** Fixed Freighter API v6 compatibility issue causing "e.switch is not a function". ([Commit Placeholder](#))
- **Improvement 2:** Added Gasless Tipping to lower the barrier to entry for new users without XLM. ([Commit Placeholder](#))

## License
MIT License
