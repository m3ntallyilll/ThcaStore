import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { RewardsDashboard } from '@/components/rewards/rewards-dashboard';

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-darker to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-10 h-10 text-gold" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gold via-gold-400 to-cannabis bg-clip-text text-transparent">
              Rewards Program
            </h1>
            <Sparkles className="w-10 h-10 text-cannabis" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Earn points, unlock tiers, and enjoy exclusive benefits with every purchase. 
            Plus, supercharge your rewards with our premium referral program!
          </p>
        </motion.div>

        {/* Dashboard */}
        <RewardsDashboard />
      </div>
    </div>
  );
}