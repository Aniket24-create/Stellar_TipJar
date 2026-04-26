import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Copy, ExternalLink } from 'lucide-react';

type TransactionStatus = 'idle' | 'processing' | 'success' | 'error';

interface TransactionModalProps {
  status: TransactionStatus;
  hash?: string;
  errorMessage?: string;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ status, hash, errorMessage, onClose }) => {
  if (status === 'idle') return null;

  const copyHash = () => {
    if (hash) navigator.clipboard.writeText(hash);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={status === 'processing' ? undefined : onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={status === 'error' ? 
            { scale: 1, opacity: 1, y: 0, x: [-10, 10, -10, 10, 0] } : 
            { scale: 1, opacity: 1, y: 0 }
          }
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring' }}
          className="glass-card bg-white dark:bg-brand-dark p-8 w-full max-w-sm relative z-10 text-center flex flex-col items-center shadow-2xl"
        >
          {status === 'processing' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full"></div>
                <Loader2 size={64} className="text-brand-cyan animate-spin relative z-10" />
              </div>
              <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Processing Tip...</h3>
              <p className="dark:text-white/60 text-gray-500 text-sm animate-pulse">Please sign with Freighter</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                <CheckCircle2 size={64} className="text-green-500 relative z-10" />
              </div>
              <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Tip sent successfully!</h3>
              <p className="dark:text-white/60 text-gray-500 text-sm mb-6">Your transaction was confirmed on the network.</p>
              
              {hash && (
                <div className="w-full flex flex-col gap-3 mb-6">
                  <div className="bg-gray-50 dark:bg-black/30 p-3 rounded-lg border border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono dark:text-white/50 text-gray-500 truncate mr-2">
                      {hash}
                    </span>
                    <button onClick={copyHash} className="text-brand-blue hover:text-brand-purple shrink-0">
                      <Copy size={16} />
                    </button>
                  </div>
                  
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs text-brand-cyan hover:text-brand-blue transition-colors font-medium"
                  >
                    View on Stellar Explorer <ExternalLink size={14} />
                  </a>
                </div>
              )}
              
              <button onClick={onClose} className="neon-button w-full">
                Awesome!
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                <XCircle size={64} className="text-red-500 relative z-10" />
              </div>
              <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Transaction Failed</h3>
              <p className="dark:text-red-400 text-red-600 text-sm mb-6 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20 w-full">
                {errorMessage || "An unknown error occurred."}
              </p>
              
              <button onClick={onClose} className="border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 dark:text-white text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 w-full">
                Dismiss
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransactionModal;
