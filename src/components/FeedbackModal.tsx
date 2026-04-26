import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquareHeart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Placeholder Google Form URL - you can replace this with a real one
  // Must be the /viewform?embedded=true version
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe-dummy-form-id-replace-this/viewform?embedded=true";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
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
          className="glass-card p-0 w-full max-w-2xl h-[80vh] relative z-10 flex flex-col bg-white dark:bg-brand-dark overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
            <div className="flex items-center gap-2 text-brand-purple font-bold">
              <MessageSquareHeart size={20} />
              <span>Feedback & Onboarding</span>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                <p className="mb-2">This is a placeholder for the Google Form.</p>
                <p className="text-sm">In a real app, the iframe below will load the form.</p>
              </div>
            </div>
            
            {/* The iframe covers the placeholder text if it loads successfully */}
            <iframe 
              src={GOOGLE_FORM_URL} 
              width="100%" 
              height="100%" 
              className="border-0 relative z-10 bg-transparent"
              title="Feedback Form"
            >
              Loading…
            </iframe>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
