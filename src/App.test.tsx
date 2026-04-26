import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import * as freighter from './utils/freighter';

// Mock the utility functions
vi.mock('./utils/freighter', () => ({
  checkConnection: vi.fn().mockResolvedValue(true),
  connectWallet: vi.fn(),
  signStellarTransaction: vi.fn(),
  shortenAddress: vi.fn((addr) => addr.substring(0, 6) + '...'),
}));

vi.mock('./utils/stellar', () => ({
  fetchBalance: vi.fn().mockResolvedValue('100.00'),
  createPaymentTransaction: vi.fn(),
  submitTransaction: vi.fn(),
  streamPayments: vi.fn(() => () => {}), // returns a cleanup function
}));

describe('StarSend X Application', () => {
  it('renders WalletConnect initially', () => {
    render(<App />);
    expect(screen.getByText(/Connect Freighter Wallet/i)).toBeInTheDocument();
  });

  it('shows dashboard after successful wallet connection', async () => {
    vi.mocked(freighter.connectWallet).mockResolvedValueOnce('GA1234567890');
    render(<App />);
    
    const connectBtn = screen.getByRole('button', { name: /Connect Freighter Wallet/i });
    fireEvent.click(connectBtn);
    
    // Wait for the balance to appear
    const balanceText = await screen.findByText(/100.00/i);
    expect(balanceText).toBeInTheDocument();
    expect(screen.getByText(/Send XLM/i)).toBeInTheDocument();
  });

  it('handles send transaction errors correctly', async () => {
    // Setup connected state
    vi.mocked(freighter.connectWallet).mockResolvedValueOnce('GA1234567890');
    render(<App />);
    
    // Connect
    fireEvent.click(screen.getByRole('button', { name: /Connect Freighter Wallet/i }));
    
    // Click Send XLM
    const sendBtn = await screen.findByText(/Send XLM/i);
    fireEvent.click(sendBtn);
    
    // Fill out form
    const addressInput = await screen.findByPlaceholderText('G...');
    fireEvent.change(addressInput, { target: { value: 'GBINVALIDADDRESS123' } }); // Invalid address will cause validation error
    
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Send/i });
    fireEvent.click(confirmBtn);
    
    // Verify validation error
    expect(await screen.findByText(/Invalid Stellar public key/i)).toBeInTheDocument();
  });
});
