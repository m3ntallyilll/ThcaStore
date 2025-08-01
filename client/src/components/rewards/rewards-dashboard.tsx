import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Crown, Star, Gift, Users, Calendar, 
  TrendingUp, Zap, Target, Award, Sparkles,
  Share2, Copy, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UserReward {
  id: string;
  userId: string;
  currentTierId: string;
  totalPoints: number;
  lifetimeSpent: string;
  monthlyPurchases: number;
  lastPurchaseDate?: Date;
}

interface RewardTier {
  id: string;
  name: string;
  minPoints: number;
  multiplier: string;
  benefits: string[];
  color: string;
}

interface PointTransaction {
  id: string;
  userId: string;
  orderId?: string;
  points: number;
  type: 'earned' | 'redeemed' | 'bonus' | 'referral';
  description: string;
  multiplier: string;
  createdAt: Date;
}

interface ReferralProgram {
  id: string;
  referrerId: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'rewarded';
  referrerReward: number;
  refereeReward: number;
  createdAt: Date;
}

export function RewardsDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ['/api/rewards'],
    enabled: !!user
  });

  const { data: referrals } = useQuery({
    queryKey: ['/api/referrals'],
    enabled: !!user
  });

  const { data: offers } = useQuery({
    queryKey: ['/api/offers']
  });

  const createReferralMutation = useMutation({
    mutationFn: () => apiRequest('/api/referrals', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrals'] });
      toast({
        title: "Referral Code Created!",
        description: "Share your code with friends to earn rewards.",
      });
    }
  });

  const redeemPointsMutation = useMutation({
    mutationFn: (data: { points: number; description: string }) =>
      apiRequest('/api/rewards/redeem', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rewards'] });
      toast({
        title: "Points Redeemed!",
        description: "Your reward has been processed.",
      });
    }
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <Crown className="w-16 h-16 text-gold mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Join Our Rewards Program</h2>
        <p className="text-gray-400">Sign in to start earning points and unlock exclusive benefits!</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-dark animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  const userRewards: UserReward | undefined = (rewardsData as any)?.userRewards;
  const tiers: RewardTier[] = (rewardsData as any)?.tiers || [];
  const transactions: PointTransaction[] = (rewardsData as any)?.recentTransactions || [];
  const currentTier = tiers.find(t => t.id === userRewards?.currentTierId);
  const nextTier = tiers.find(t => t.minPoints > (userRewards?.totalPoints || 0));

  const progressToNextTier = nextTier 
    ? ((userRewards?.totalPoints || 0) - (currentTier?.minPoints || 0)) / (nextTier.minPoints - (currentTier?.minPoints || 0)) * 100
    : 100;

  const getTierIcon = (tierName: string) => {
    switch (tierName?.toLowerCase()) {
      case 'bronze': return <Award className="w-5 h-5" />;
      case 'silver': return <Star className="w-5 h-5" />;
      case 'gold': return <Crown className="w-5 h-5" />;
      case 'platinum': return <Trophy className="w-5 h-5" />;
      case 'diamond': return <Sparkles className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Code Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-dark border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Points</p>
                  <p className="text-3xl font-bold text-gold">{userRewards?.totalPoints || 0}</p>
                </div>
                <div className="p-3 bg-gold/20 rounded-full">
                  <Star className="w-6 h-6 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-dark border-hemp/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Tier</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{currentTier?.name || 'Bronze'}</span>
                    {currentTier && getTierIcon(currentTier.name)}
                  </div>
                </div>
                <div className="p-3 bg-hemp/20 rounded-full">
                  <Crown className="w-6 h-6 text-hemp" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-dark border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Lifetime Spent</p>
                  <p className="text-2xl font-bold text-white">${userRewards?.lifetimeSpent || '0.00'}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-dark border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Orders</p>
                  <p className="text-2xl font-bold text-white">{userRewards?.monthlyPurchases || 0}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-dark">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress to Next Tier */}
          {nextTier && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-dark border-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gold">
                    <Target className="w-5 h-5" />
                    Progress to {nextTier.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {userRewards?.totalPoints || 0} / {nextTier.minPoints} points
                      </span>
                      <span className="text-gold">
                        {nextTier.minPoints - (userRewards?.totalPoints || 0)} points to go
                      </span>
                    </div>
                    <Progress value={progressToNextTier} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-gold/10 rounded-lg">
                        <p className="text-gold font-semibold">{parseFloat(nextTier.multiplier).toFixed(1)}x</p>
                        <p className="text-xs text-gray-400">Points Multiplier</p>
                      </div>
                      <div className="text-center p-3 bg-hemp/10 rounded-lg">
                        <p className="text-hemp font-semibold">{nextTier.benefits.length}</p>
                        <p className="text-xs text-gray-400">New Benefits</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recent Transactions */}
          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'earned' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'redeemed' ? 'bg-red-500/20 text-red-400' :
                          transaction.type === 'bonus' ? 'bg-gold/20 text-gold' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {transaction.type === 'earned' ? <TrendingUp className="w-4 h-4" /> :
                           transaction.type === 'redeemed' ? <Gift className="w-4 h-4" /> :
                           transaction.type === 'bonus' ? <Sparkles className="w-4 h-4" /> :
                           <Users className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start shopping to earn points!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const isCurrentTier = tier.id === userRewards?.currentTierId;
              const isUnlocked = (userRewards?.totalPoints || 0) >= tier.minPoints;
              
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass-dark transition-all duration-300 ${
                    isCurrentTier ? 'border-gold/50 shadow-gold/25' : 
                    isUnlocked ? 'border-hemp/30' : 'border-white/10'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2" style={{ color: tier.color }}>
                          {getTierIcon(tier.name)}
                          {tier.name}
                        </CardTitle>
                        {isCurrentTier && (
                          <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          {tier.minPoints} points required
                        </p>
                        <p className="text-lg font-bold" style={{ color: tier.color }}>
                          {parseFloat(tier.multiplier).toFixed(1)}x Points
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white mb-3">Benefits:</p>
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5" />
                            <p className="text-sm text-gray-300">{benefit}</p>
                          </div>
                        ))}
                      </div>
                      {!isUnlocked && (
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-400">
                            {tier.minPoints - (userRewards?.totalPoints || 0)} more points needed
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          {/* Create Referral */}
          <Card className="glass-dark border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Share2 className="w-5 h-5" />
                King Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gold/10 rounded-lg">
                    <p className="text-2xl font-bold text-gold">500</p>
                    <p className="text-sm text-gray-400">Points for you</p>
                  </div>
                  <div className="text-center p-4 bg-hemp/10 rounded-lg">
                    <p className="text-2xl font-bold text-hemp">250</p>
                    <p className="text-sm text-gray-400">Points for friend</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => createReferralMutation.mutate()}
                  disabled={createReferralMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {createReferralMutation.isPending ? 'Creating...' : 'Generate New Referral Code'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Referrals */}
          {referrals && Array.isArray(referrals) && referrals.length > 0 && (
            <Card className="glass-dark">
              <CardHeader>
                <CardTitle>Your Referral Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(referrals as any[]).map((referral: ReferralProgram) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-mono text-lg text-gold">{referral.referralCode}</p>
                        <p className="text-sm text-gray-400">
                          Status: <span className={`capitalize ${
                            referral.status === 'completed' ? 'text-green-400' :
                            referral.status === 'rewarded' ? 'text-gold' : 'text-blue-400'
                          }`}>
                            {referral.status}
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyReferralCode(referral.referralCode)}
                        className="border-gold/30 hover:bg-gold/10"
                      >
                        {copiedCode === referral.referralCode ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers && Array.isArray(offers) && offers.length > 0 ? (
              (offers as any[]).map((offer: any, index: number) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-dark border-gold/20 hover:border-gold/40 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-gold">{offer.name}</CardTitle>
                        <Badge variant="secondary" className="bg-gold/20 text-gold">
                          {offer.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{offer.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Value:</span>
                          <span className="font-bold text-gold">{offer.value}%</span>
                        </div>
                        {offer.minPurchase && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Min Purchase:</span>
                            <span className="text-white">${offer.minPurchase}</span>
                          </div>
                        )}
                        {offer.maxUses && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Uses Left:</span>
                            <span className="text-white">{offer.maxUses - offer.currentUses}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Valid Until:</span>
                          <span className="text-white">
                            {new Date(offer.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Gift className="w-16 h-16 text-gold mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Offers</h3>
                <p className="text-gray-400">Check back soon for amazing deals!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}