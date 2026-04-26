import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareHeart, Moon, Sun, Github } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TipForm from './components/TipForm';
import TransactionModal from './components/TransactionModal';
import HistoryList, { Transaction } from './components/HistoryList';
import ReceiveModal from './components/ReceiveModal';
import FeedbackModal from './components/FeedbackModal';
import { connectWallet, checkConnection, signStellarTransaction } from './utils/freighter';
import { fetchBalance, createPaymentTransaction, submitTransaction, streamPayments } from './utils/stellar';

function App() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState('0.00');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [txStatus, setTxStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Theme effect
  useEffect(() => {
    document.body.className = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check connection on load
  useEffect(() => {
    const init = async () => {
      const isConn = await checkConnection();
      if (isConn) {
        // Optional auto-connect could go here
      }
    };
    init();
  }, []);

  // Handle balance fetching and streaming
  useEffect(() => {
    let cleanupStream: () => void;

    if (publicKey) {
      fetchBalance(publicKey).then(setBalance);

      cleanupStream = streamPayments(
        publicKey,
        (msg: any) => {
          fetchBalance(publicKey).then(setBalance);
          
          const isIncoming = msg.to === publicKey;
          const newTx: Transaction = {
            id: msg.id,
            type: isIncoming ? 'incoming' : 'outgoing',
            amount: msg.amount || '0',
            asset: msg.asset_type === 'native' ? 'XLM' : msg.asset_code || 'Unknown',
            from: msg.from,
            to: msg.to,
            timestamp: msg.created_at,
            hash: msg.transaction_hash,
          };
          
          setTransactions(prev => [newTx, ...prev].slice(0, 50));
        },
        (error: any) => {
          console.error("Stream error:", error);
        }
      );
    }

    return () => {
      if (cleanupStream) cleanupStream();
    };
  }, [publicKey]);

  const handleConnect = async () => {
    const key = await connectWallet();
    if (key) {
      setPublicKey(key);
    }
  };

  const handleSendXLM = async (destination: string, amount: string) => {
    if (!publicKey) return;
    
    setTxStatus('processing');
    setTxHash(undefined);
    setTxError(undefined);

    try {
      const xdr = await createPaymentTransaction(publicKey, destination, amount);
      const signedXdr = await signStellarTransaction(xdr, 'Test SDF Network ; September 2015');
      
      if (typeof signedXdr !== 'string') {
        throw new Error("Received invalid signature format from wallet.");
      }
      
      const response = await submitTransaction(signedXdr);
      
      setTxHash(response.hash);
      setTxStatus('success');
      
      const newBalance = await fetchBalance(publicKey);
      setBalance(newBalance);
      
    } catch (error: any) {
      console.error(error);
      setTxStatus('error');
      setTxError(error.message || 'Transaction failed');
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen relative font-sans">
      {/* Modals */}
      <TransactionModal 
        status={txStatus}
        hash={txHash}
        errorMessage={txError}
        onClose={() => setTxStatus('idle')}
      />
      {publicKey && (
        <ReceiveModal 
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          publicKey={publicKey}
        />
      )}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Top Navigation */}
      <nav className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold font-display shadow-lg">
            TJ
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block dark:text-white text-gray-900">
            TipJar
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors dark:text-white text-gray-600"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {publicKey ? (
            <button 
              onClick={() => setIsFeedbackModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium dark:text-brand-cyan text-brand-blue bg-brand-blue/10 px-4 py-2 rounded-full hover:bg-brand-blue/20 transition-colors border border-brand-blue/20"
            >
              <MessageSquareHeart size={16} />
              <span className="hidden sm:inline">Give Feedback</span>
            </button>
          ) : (
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors dark:text-white text-gray-600">
              <Github size={20} />
            </a>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto h-full min-h-screen flex flex-col justify-center">
        {!publicKey ? (
          <LandingPage onConnect={handleConnect} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full"
            >
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 md:gap-8">
                <Dashboard 
                  publicKey={publicKey}
                  balance={balance}
                  onReceiveClick={() => setIsReceiveModalOpen(true)}
                />
                
                <div className="h-[400px]">
                  <HistoryList transactions={transactions} />
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                <div className="sticky top-24">
                  <TipForm 
                    balance={balance}
                    onSend={handleSendXLM}
                  />
                  
                  <div className="mt-6 p-4 glass-card bg-brand-blue/5 border-brand-blue/10 rounded-xl text-sm text-center dark:text-white/70 text-gray-600">
                    <p>✨ Tips sent from this app are <strong className="text-brand-purple">Gasless</strong>!</p>
                    <p className="text-xs opacity-70 mt-1">Transaction fees are sponsored by the TipJar relayer network.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

export default App;
