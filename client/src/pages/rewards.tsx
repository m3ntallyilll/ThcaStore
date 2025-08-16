import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Trophy, 
  Star, 
  Gift, 
  Target, 
  TrendingUp, 
  Award,
  Zap,
  Crown,
  Medal,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  Lock,
  CheckCircle2,
  Clock,
  Coins
} from 'lucide-react';

interface UserRewards {
  userId: string;
  points: number;
  level: number;
  tier: string;
  nextLevelPoints: number;
  totalEarned: number;
  totalSpent: number;
  streak: number;
  storeCredit: number;
  badges: Badge[];
  achievements: Achievement[];
  availableRewards: Reward[];
  history: PointTransaction[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: number;
  icon: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'product' | 'shipping' | 'exclusive' | 'store_credit';
  value: string;
  available: boolean;
  expiresAt?: string;
  imageUrl?: string;
}

interface PointTransaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus';
  amount: number;
  description: string;
  createdAt: string;
}

// Points earning chart configuration
const POINTS_CHART = {
  purchases: [
    { action: 'Every $1 spent', points: 10, icon: ShoppingCart },
    { action: 'First purchase', points: 500, icon: Package },
    { action: 'Purchase 5+ items', points: 200, icon: ShoppingCart },
    { action: 'Order over $100', points: 1000, icon: Trophy },
    { action: 'Order over $200', points: 2500, icon: Crown },
  ],
  engagement: [
    { action: 'Create account', points: 100, icon: Users },
    { action: 'Complete profile', points: 50, icon: CheckCircle2 },
    { action: 'Write product review', points: 75, icon: Star },
    { action: 'Share on social media', points: 25, icon: Users },
    { action: 'Refer a friend', points: 250, icon: Gift },
  ],
  streaks: [
    { action: '7-day login streak', points: 100, icon: Calendar },
    { action: '30-day login streak', points: 500, icon: Calendar },
    { action: '3 purchases in a month', points: 300, icon: TrendingUp },
    { action: 'Birthday bonus', points: 200, icon: Gift },
    { action: 'Anniversary bonus', points: 300, icon: Award },
  ],
  tiers: [
    { name: 'Bronze', minPoints: 0, multiplier: '1x', perks: ['Basic rewards', 'Birthday bonus'] },
    { name: 'Silver', minPoints: 1000, multiplier: '1.25x', perks: ['All Bronze perks', '25% more points', 'Early access'] },
    { name: 'Gold', minPoints: 5000, multiplier: '1.5x', perks: ['All Silver perks', '50% more points', 'Free shipping'] },
    { name: 'Platinum', minPoints: 10000, multiplier: '2x', perks: ['All Gold perks', 'Double points', 'VIP support', 'Exclusive products'] },
  ]
};

const getTierColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'bronze': return 'bg-orange-600';
    case 'silver': return 'bg-gray-400';
    case 'gold': return 'bg-yellow-500';
    case 'platinum': return 'bg-purple-600';
    default: return 'bg-gray-600';
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500';
    case 'rare': return 'bg-blue-500';
    case 'epic': return 'bg-purple-500';
    case 'legendary': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

export default function Rewards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [storeCreditAmount, setStoreCreditAmount] = useState(100);

  // Fetch user rewards data
  const { data: userRewards, isLoading } = useQuery<UserRewards>({
    queryKey: ['/api/rewards/user'],
    retry: false,
  });

  // Store credit balance
  const { data: storeCreditBalance } = useQuery({
    queryKey: ['/api/store-credit/balance'],
  });
  
  const currentBalance = (storeCreditBalance as any)?.balance || 0;

  // Redeem reward mutation
  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      return await apiRequest('/api/rewards/redeem', {
        method: 'POST',
        body: { rewardId }
      });
    },
    onSuccess: () => {
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been added to your account.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/user'] });
      setSelectedReward(null);
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Unable to redeem reward.",
        variant: "destructive",
      });
    }
  });

  // Store credit redemption mutation
  const storeCreditMutation = useMutation({
    mutationFn: async (pointsToRedeem: number) => {
      return await apiRequest('/api/rewards/redeem-store-credit', {
        method: 'POST',
        body: { pointsToRedeem }
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Store Credit Redeemed!",
        description: `Successfully converted ${storeCreditAmount} points to $${(storeCreditAmount / 100).toFixed(2)} store credit.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/store-credit/balance'] });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Claim achievement reward
  const claimAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      return await apiRequest('/api/rewards/achievements/claim', {
        method: 'POST',
        body: { achievementId }
      });
    },
    onSuccess: () => {
      toast({
        title: "Achievement Claimed!",
        description: "Points have been added to your account.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/user'] });
    }
  });

  const levelProgress = userRewards 
    ? ((userRewards.points % 1000) / 1000) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto" />
            <p className="text-white mt-4">Loading rewards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <Helmet>
        <title>THCA Rewards Program - Earn Points & Store Credit | Mentally-Chill</title>
        <meta name="description" content="Join our exclusive THCA rewards program. Earn points on every purchase, unlock store credit, and get access to premium member benefits & exclusive deals." />
        <meta name="keywords" content="THCA rewards program, cannabis loyalty program, earn store credit, THCA points, member benefits, exclusive deals, rewards points" />
        <meta property="og:title" content="THCA Rewards Program - Earn Points & Store Credit" />
        <meta property="og:description" content="Join our exclusive THCA rewards program. Earn points on every purchase and unlock exclusive benefits." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentally-chill.online/rewards" />

      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-12 h-12 text-gold animate-pulse" />
            Rewards Center
            <Trophy className="w-12 h-12 text-gold animate-pulse" />
          </h1>
          <p className="text-purple-200 text-lg">Earn points, unlock rewards, and level up!</p>
        </div>

        {/* User Stats Overview */}
        {userRewards && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {/* Points Balance */}
            <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Coins className="w-8 h-8" />
                  <Badge className="bg-white/20">Balance</Badge>
                </div>
                <p className="text-3xl font-bold">{userRewards.points.toLocaleString()}</p>
                <p className="text-white/80 text-sm">Available Points</p>
              </CardContent>
            </Card>

            {/* Current Level */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-700 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Medal className="w-8 h-8" />
                  <Badge className="bg-white/20">Level {userRewards.level}</Badge>
                </div>
                <p className="text-3xl font-bold">{userRewards.tier}</p>
                <Progress value={levelProgress} className="mt-2 h-2" />
                <p className="text-white/80 text-xs mt-1">
                  {userRewards.nextLevelPoints - userRewards.points} pts to next level
                </p>
              </CardContent>
            </Card>

            {/* Total Earned */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8" />
                  <Badge className="bg-white/20">Lifetime</Badge>
                </div>
                <p className="text-3xl font-bold">{userRewards.totalEarned.toLocaleString()}</p>
                <p className="text-white/80 text-sm">Points Earned</p>
              </CardContent>
            </Card>

            {/* Current Streak */}
            <Card className="bg-gradient-to-br from-orange-600 to-red-700 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8" />
                  <Badge className="bg-white/20">Active</Badge>
                </div>
                <p className="text-3xl font-bold">{userRewards.streak}</p>
                <p className="text-white/80 text-sm">Day Streak</p>
              </CardContent>
            </Card>

            {/* Store Credit Balance */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Coins className="w-8 h-8" />
                  <Badge className="bg-white/20">Available</Badge>
                </div>
                <p className="text-3xl font-bold">${currentBalance?.toFixed(2) || '0.00'}</p>
                <p className="text-white/80 text-sm">Store Credit</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="earn" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl mx-auto">
            <TabsTrigger value="earn">Earn Points</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="credit">Store Credit</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Earn Points Tab */}
          <TabsContent value="earn" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-gold" />
                  Ways to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Purchase Points */}
                <div>
                  <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Purchase Rewards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {POINTS_CHART.purchases.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{item.action}</span>
                        </div>
                        <Badge className="bg-gold text-black">+{item.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Points */}
                <div>
                  <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Engagement Rewards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {POINTS_CHART.engagement.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-blue-400" />
                          <span className="text-white">{item.action}</span>
                        </div>
                        <Badge className="bg-gold text-black">+{item.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Streak Bonuses */}
                <div>
                  <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Streak & Bonus Rewards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {POINTS_CHART.streaks.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-green-400" />
                          <span className="text-white">{item.action}</span>
                        </div>
                        <Badge className="bg-gold text-black">+{item.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier Benefits */}
                <div>
                  <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Membership Tiers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {POINTS_CHART.tiers.map((tier, index) => (
                      <div key={index} className={`rounded-lg p-4 ${getTierColor(tier.name)} bg-opacity-20 border border-white/20`}>
                        <div className="text-center mb-3">
                          <Crown className="w-8 h-8 text-white mx-auto mb-2" />
                          <h4 className="text-white font-bold text-lg">{tier.name}</h4>
                          <p className="text-white/80 text-sm">{tier.minPoints}+ points</p>
                          <Badge className="bg-white/20 text-white mt-2">{tier.multiplier} points</Badge>
                        </div>
                        <div className="space-y-1">
                          {tier.perks.map((perk, perkIndex) => (
                            <div key={perkIndex} className="flex items-center gap-2 text-white/90 text-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Gift className="w-6 h-6 text-gold" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userRewards?.availableRewards.map((reward) => (
                    <Card 
                      key={reward.id} 
                      className={`bg-white/5 border-white/10 ${reward.available ? 'hover:bg-white/10' : 'opacity-50'} transition-colors cursor-pointer`}
                      onClick={() => reward.available && setSelectedReward(reward)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={`${reward.type === 'exclusive' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                            {reward.type}
                          </Badge>
                          {!reward.available && <Lock className="w-4 h-4 text-gray-400" />}
                        </div>
                        <h3 className="text-white font-semibold mb-2">{reward.name}</h3>
                        <p className="text-white/70 text-sm mb-3">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gold font-bold">{reward.pointsCost} pts</span>
                          {reward.expiresAt && (
                            <span className="text-white/50 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expires soon
                            </span>
                          )}
                        </div>
                        {userRewards && userRewards.points >= reward.pointsCost && reward.available && (
                          <Button 
                            className="w-full mt-3 bg-gold text-black hover:bg-gold-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              redeemMutation.mutate(reward.id);
                            }}
                            disabled={redeemMutation.isPending}
                          >
                            Redeem Now
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Credit Tab */}
          <TabsContent value="credit" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Coins className="w-6 h-6 text-gold" />
                  Store Credit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Balance */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg p-6">
                  <div className="text-center">
                    <h3 className="text-white text-lg mb-2">Current Store Credit Balance</h3>
                    <div className="text-4xl font-bold text-white mb-2">
                      ${typeof currentBalance === 'number' ? currentBalance.toFixed(2) : (parseFloat(currentBalance) || 0).toFixed(2)}
                    </div>
                    <p className="text-white/80 text-sm">Available for purchases</p>
                  </div>
                </div>

                {/* Conversion Options */}
                <div>
                  <h3 className="text-gold font-semibold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Convert Points to Store Credit
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="text-white text-sm mb-3">
                      <strong>Conversion Rate:</strong> 100 points = $1.00 store credit
                    </div>
                    <div className="text-white/80 text-sm mb-4">
                      You currently have {userRewards?.points || 0} points available to convert
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Preset amounts */}
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16"
                        onClick={() => setStoreCreditAmount(100)}
                        disabled={!userRewards || userRewards.points < 100}
                      >
                        <div className="text-center">
                          <div className="font-bold">100 points</div>
                          <div className="text-sm text-white/80">= $1.00</div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16"
                        onClick={() => setStoreCreditAmount(500)}
                        disabled={!userRewards || userRewards.points < 500}
                      >
                        <div className="text-center">
                          <div className="font-bold">500 points</div>
                          <div className="text-sm text-white/80">= $5.00</div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16"
                        onClick={() => setStoreCreditAmount(1000)}
                        disabled={!userRewards || userRewards.points < 1000}
                      >
                        <div className="text-center">
                          <div className="font-bold">1000 points</div>
                          <div className="text-sm text-white/80">= $10.00</div>
                        </div>
                      </Button>
                    </div>

                    {/* Convert Button */}
                    <div className="flex items-center gap-3">
                      <Button
                        className="bg-gold text-black hover:bg-gold-600 flex-1"
                        onClick={() => storeCreditMutation.mutate(storeCreditAmount)}
                        disabled={storeCreditMutation.isPending || !userRewards || userRewards.points < storeCreditAmount}
                      >
                        {storeCreditMutation.isPending ? (
                          "Converting..."
                        ) : (
                          `Convert ${storeCreditAmount} points to $${(storeCreditAmount / 100).toFixed(2)}`
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Benefits section */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Store Credit Benefits:</h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>No expiration date - use anytime</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Can be combined with other discounts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Applied automatically at checkout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Better value than product rewards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Target className="w-6 h-6 text-gold" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRewards?.achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`bg-white/5 rounded-lg p-4 ${achievement.completed ? 'border-l-4 border-green-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${achievement.completed ? 'bg-green-500' : 'bg-gray-600'} flex items-center justify-center`}>
                            {achievement.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : (
                              <Target className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{achievement.name}</h3>
                            <p className="text-white/70 text-sm">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-gold text-black">+{achievement.reward} pts</Badge>
                          {achievement.completed ? (
                            <Button
                              size="sm"
                              className="mt-2 bg-green-500 hover:bg-green-600"
                              onClick={() => claimAchievementMutation.mutate(achievement.id)}
                              disabled={claimAchievementMutation.isPending}
                            >
                              Claim
                            </Button>
                          ) : (
                            <div className="mt-2">
                              <Progress value={(achievement.progress / achievement.target) * 100} className="w-24 h-2" />
                              <p className="text-white/50 text-xs mt-1">
                                {achievement.progress}/{achievement.target}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Award className="w-6 h-6 text-gold" />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {userRewards?.badges.map((badge) => (
                    <div key={badge.id} className="text-center">
                      <div className={`w-20 h-20 mx-auto rounded-full ${getRarityColor(badge.rarity)} flex items-center justify-center mb-2`}>
                        <Star className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-white font-semibold text-sm">{badge.name}</h4>
                      <p className="text-white/60 text-xs">{badge.description}</p>
                      <Badge className={`mt-2 ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Clock className="w-6 h-6 text-gold" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userRewards?.history.map((transaction) => (
                    <div key={transaction.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${transaction.type === 'earned' ? 'bg-green-500' : transaction.type === 'spent' ? 'bg-red-500' : 'bg-blue-500'} flex items-center justify-center`}>
                          {transaction.type === 'earned' ? '+' : transaction.type === 'spent' ? '-' : '★'}
                        </div>
                        <div>
                          <p className="text-white">{transaction.description}</p>
                          <p className="text-white/50 text-xs">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold ${transaction.type === 'earned' ? 'text-green-400' : transaction.type === 'spent' ? 'text-red-400' : 'text-blue-400'}`}>
                        {transaction.type === 'spent' ? '-' : '+'}{transaction.amount} pts
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}