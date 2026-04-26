import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { shortenAddress } from '../utils/freighter';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicKey: string;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, publicKey }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.3, type: 'spring' }}
          className="glass-card p-8 w-full max-w-sm relative z-10 text-center flex flex-col items-center bg-white dark:bg-brand-dark"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="mb-4 flex items-center justify-center gap-2 text-brand-purple">
            <QrCode size={24} />
            <h3 className="text-xl font-bold dark:text-white text-gray-900">Receive Tips</h3>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-white/60 mb-6">
            Scan this QR code to send XLM to this wallet on the Stellar network.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-gray-100 dark:border-white/10 relative group">
            <QRCode 
              value={publicKey} 
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#0a0a0a"
            />
            <div className="absolute inset-0 bg-brand-blue/5 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-black/30 w-full p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-gray-600 dark:text-white/70 truncate mr-3">
              {shortenAddress(publicKey)}
            </span>
            <button 
              onClick={copyToClipboard} 
              className="text-brand-blue hover:text-brand-purple transition-colors p-2 bg-brand-blue/10 rounded-lg shrink-0"
              title="Copy Address"
            >
              <Copy size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReceiveModal;
