import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, QrCode, TrendingUp, Users } from 'lucide-react';
import { shortenAddress } from '../utils/freighter';

interface DashboardProps {
  publicKey: string;
  balance: string;
  onReceiveClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ publicKey, balance, onReceiveClick }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 relative overflow-hidden group bg-white dark:bg-transparent"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-brand-blue/30 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-purple/10 dark:bg-brand-purple/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none group-hover:bg-brand-purple/30 transition-all duration-700"></div>
        
        <div className="relative z-10">
          <p className="text-gray-500 dark:text-white/50 text-sm uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
            Available Balance
          </p>
          <div className="flex items-baseline gap-2 mb-8">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/80 tracking-tight">
              {balance}
            </h2>
            <span className="text-brand-blue font-bold text-xl">XLM</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="bg-gray-50 dark:bg-black/40 rounded-xl p-3 border border-gray-100 dark:border-white/5 flex items-center gap-3 w-full sm:w-auto">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
              <span className="text-sm font-mono text-gray-600 dark:text-white/70">{shortenAddress(publicKey)}</span>
              <div className="flex gap-1 ml-auto sm:ml-4">
                <button 
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-brand-blue dark:text-white/40 dark:hover:text-white transition-colors p-1.5 bg-white dark:bg-white/5 rounded-md shadow-sm border border-gray-100 dark:border-transparent"
                  title="Copy Address"
                >
                  {copied ? <span className="text-green-500 text-xs font-bold px-1">Copied!</span> : <Copy size={16} />}
                </button>
                <button 
                  onClick={onReceiveClick}
                  className="text-gray-400 hover:text-brand-purple dark:text-white/40 dark:hover:text-white transition-colors p-1.5 bg-white dark:bg-white/5 rounded-md shadow-sm border border-gray-100 dark:border-transparent"
                  title="Show QR Code"
                >
                  <QrCode size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Mock Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 flex items-center gap-4 bg-white dark:bg-transparent"
        >
          <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-white/50 font-bold uppercase tracking-wider mb-1">Total Tips</p>
            <p className="text-2xl font-display font-bold dark:text-white text-gray-900">142</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 flex items-center gap-4 bg-white dark:bg-transparent"
        >
          <div className="p-3 bg-brand-purple/10 rounded-xl text-brand-purple">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-white/50 font-bold uppercase tracking-wider mb-1">Active Users</p>
            <p className="text-2xl font-display font-bold dark:text-white text-gray-900">2,045</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
