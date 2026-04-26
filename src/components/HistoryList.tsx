import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, History, ExternalLink } from 'lucide-react';
import { shortenAddress } from '../utils/freighter';

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: string;
  asset: string;
  from: string;
  to: string;
  timestamp: string;
  hash: string;
}

interface HistoryListProps {
  transactions: Transaction[];
}

const HistoryList: React.FC<HistoryListProps> = ({ transactions }) => {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col h-full bg-white dark:bg-transparent">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
        <History className="text-brand-purple" size={20} />
        <h2 className="text-xl font-bold dark:text-white text-gray-900">Transaction History</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center dark:text-white/30 text-gray-400 text-sm py-10">
            <History size={48} className="mb-4 opacity-20" />
            <p>No tips found yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  layout
                  className="bg-gray-50 hover:bg-gray-100 dark:bg-black/20 dark:hover:bg-black/40 border border-gray-100 dark:border-white/5 p-4 rounded-xl transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${tx.type === 'incoming' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple'}`}>
                      {tx.type === 'incoming' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white text-gray-900">
                        {tx.type === 'incoming' ? 'Received Tip' : 'Sent Tip'}
                      </p>
                      <p className="text-xs dark:text-white/50 text-gray-500 font-mono mt-0.5">
                        {tx.type === 'incoming' ? `From: ${shortenAddress(tx.from)}` : `To: ${shortenAddress(tx.to)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className={`font-bold ${tx.type === 'incoming' ? 'text-green-500' : 'dark:text-white text-gray-900'}`}>
                      {tx.type === 'incoming' ? '+' : '-'}{tx.amount} {tx.asset}
                    </p>
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs dark:text-brand-cyan text-brand-blue hover:underline flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Explorer <ExternalLink size={10} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
