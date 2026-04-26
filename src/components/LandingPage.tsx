import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Coins, Wallet } from 'lucide-react';

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-sm font-bold tracking-wide">
          STELLAR TESTNET MVP
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          Send Tips <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
            Instantly & Gasless
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          The most elegant way to send and receive micro-payments on the Stellar network. Experience zero fees with our fee sponsorship integration.
        </p>

        <button 
          onClick={onConnect}
          className="neon-button text-lg px-8 py-4 flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
        >
          <Wallet size={24} />
          <span>Connect Freighter Wallet</span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl"
      >
        <FeatureCard 
          icon={<Zap size={28} className="text-brand-blue" />}
          title="Lightning Fast"
          description="Transactions settle in seconds on the Stellar network. No waiting."
        />
        <FeatureCard 
          icon={<ShieldCheck size={28} className="text-green-500" />}
          title="Secure & Non-Custodial"
          description="Connect your Freighter wallet. You control your private keys always."
        />
        <FeatureCard 
          icon={<Coins size={28} className="text-brand-purple" />}
          title="Gasless Tipping"
          description="We sponsor your transaction fees. Tip without worrying about gas."
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-card p-6 md:p-8 text-left bg-white dark:bg-transparent">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-900">{title}</h3>
    <p className="text-gray-500 dark:text-white/60 leading-relaxed text-sm">{description}</p>
  </div>
);

export default LandingPage;
