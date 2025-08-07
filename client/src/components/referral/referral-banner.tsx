import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Users, Copy, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useReferral } from '@/hooks/use-referral';
import { formatReferralCode } from '@/lib/referral-utils';

interface ReferralBannerProps {
  className?: string;
  onDismiss?: () => void;
  compact?: boolean;
}

export function ReferralBanner({ className = "", onDismiss, compact = false }: ReferralBannerProps) {
  const { pendingReferralCode, hasActiveReferral } = useReferral();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !hasActiveReferral || !pendingReferralCode) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (compact) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`relative ${className}`}
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  Referral Active: {formatReferralCode(pendingReferralCode)}
                </span>
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">
                  Bonus Points Ready
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-6 w-6 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative ${className}`}
      >
        <Card className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-500/30 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Referral Detected! 🎉</h3>
                    <p className="text-sm text-gray-300">
                      You're invited by referral code <span className="font-mono text-green-400">{formatReferralCode(pendingReferralCode)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Users className="w-3 h-3 mr-1" />
                    Welcome Bonus
                  </Badge>
                  <span className="text-2xl font-bold text-green-400">+250 Points</span>
                  <span className="text-gray-400">when you sign up</span>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Bonus will be automatically applied</strong> when you create your account. 
                    No code entry required!
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function ShareReferralCard() {
  const { userReferralCode, generateUserReferralLink, copyReferralLink, totalReferrals, totalEarned } = useReferral();

  if (!userReferralCode) return null;

  const referralLink = generateUserReferralLink();

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Share & Earn</h3>
            <p className="text-sm text-gray-300">Invite friends and earn rewards together</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Referral Code</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-900/50 text-green-400 px-3 py-2 rounded font-mono text-lg">
                {formatReferralCode(userReferralCode)}
              </code>
              <Button
                size="sm"
                onClick={() => navigator.clipboard.writeText(userReferralCode)}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
            <label className="block text-sm font-medium text-gray-300 mb-2">Shareable Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-gray-900/50 text-gray-300 px-3 py-2 rounded text-sm border border-gray-600/30"
              />
              <Button
                size="sm"
                onClick={copyReferralLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{totalReferrals}</div>
              <div className="text-sm text-gray-400">Friends Referred</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{totalEarned}</div>
              <div className="text-sm text-gray-400">Points Earned</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}