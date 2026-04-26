import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, Sparkles } from 'lucide-react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { resolveAlias } from '../utils/federation';

interface TipFormProps {
  onSend: (destination: string, amount: string) => void;
  balance: string;
}

const TipForm: React.FC<TipFormProps> = ({ onSend, balance }) => {
  const [addressOrAlias, setAddressOrAlias] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const predefinedAmounts = ['1', '5', '10'];

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let finalAddress = addressOrAlias.trim();
    if (!finalAddress) {
      setError('Please enter a recipient.');
      return;
    }

    // Resolve alias if needed
    if (finalAddress.startsWith('@')) {
      setIsResolving(true);
      try {
        finalAddress = await resolveAlias(finalAddress);
      } catch (err: any) {
        setIsResolving(false);
        setError(err.message || 'Failed to resolve alias.');
        return;
      }
      setIsResolving(false);
    }

    // Validate address
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(finalAddress)) {
      setError('Invalid Stellar public key or Alias.');
      return;
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (numAmount > parseFloat(balance)) {
      setError('Insufficient balance.');
      return;
    }

    onSend(finalAddress, amount);
  };

  return (
    <div className="glass-card p-6 md:p-8 relative">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-brand-purple" />
        Send Tip
      </h2>

      <form onSubmit={validateAndSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 dark:text-white/60 mb-2">
            Recipient (@alias or G...)
          </label>
          <input 
            type="text" 
            value={addressOrAlias}
            onChange={(e) => setAddressOrAlias(e.target.value)}
            placeholder="@alice or GHT5...X2K9"
            className="glass-input font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 dark:text-white/60 mb-2">
            Tip Amount (XLM)
          </label>
          
          <div className="flex gap-2 mb-4">
            {predefinedAmounts.map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`quick-tip-btn flex-1 ${amount === val ? 'active' : ''}`}
              >
                {val} XLM
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input 
              type="number" 
              step="0.0000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="glass-input pr-16 text-lg"
            />
            <button 
              type="button"
              onClick={() => setAmount(balance)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-brand-cyan hover:text-brand-blue px-2 py-1 rounded bg-black/5 dark:bg-white/5 font-bold transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 text-red-500 text-sm"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <button 
          type="submit"
          disabled={isResolving}
          className="neon-button w-full py-4 flex items-center justify-center gap-2 mt-4 text-lg"
        >
          {isResolving ? (
            <span className="animate-pulse">Resolving alias...</span>
          ) : (
            <>
              <Send size={20} />
              <span>Send Tip</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TipForm;
