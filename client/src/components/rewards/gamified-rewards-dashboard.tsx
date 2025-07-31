import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Crown, Star, Gift, Users, Calendar, 
  TrendingUp, Zap, Target, Award, Sparkles,
  Share2, Copy, Check, ShoppingBag, DollarSign,
  Heart, Medal, Flame, Flower
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

// Types for gamification
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  condition: {
    type: string;
    value: number;
    comparison?: string;
    metadata?: any;
  };
  rewardPoints: number;
  badgeColor: string;
  isHidden: boolean;
  difficulty: string;
  createdAt: Date;
}

interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  notified: boolean;
  createdAt: Date;
  achievement?: Achievement;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  targetType: string;
  targetValue: number;
  rewardPoints: number;
  bonusMultiplier: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  difficulty: string;
  createdAt: Date;
}

interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewardClaimed: boolean;
  createdAt: Date;
  challenge?: DailyChallenge;
}

interface LoyaltyStreak {
  id: string;
  userId: string;
  streakType: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  streakMultiplier: string;
  bonusPointsEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  period: string;
  rank: number;
  points: number;
  achievementCount: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserReward {
  id: string;
  userId: string;
  currentTierId: string;
  totalPoints: number;
  lifetimeSpent: string;
  monthlyPurchases: number;
  lastPurchaseDate?: Date;
  tier?: {
    name: string;
    color: string;
    multiplier: string;
    benefits: string[];
  };
}

const IconMap: { [key: string]: any } = {
  ShoppingBag,
  DollarSign,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Crown,
  Flower,
  Trophy,
  Star,
  Target,
  Gift
};

export function GamifiedRewardsDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Existing rewards data
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['/api/rewards'],
    enabled: !!user
  });

  // Gamification data
  const { data: achievements } = useQuery({
    queryKey: ['/api/gamification/achievements'],
    enabled: !!user
  });

  const { data: userAchievements } = useQuery({
    queryKey: ['/api/gamification/user-achievements'],
    enabled: !!user
  });

  const { data: dailyChallenges } = useQuery({
    queryKey: ['/api/gamification/challenges/today'],
    enabled: !!user
  });

  const { data: userChallenges } = useQuery({
    queryKey: ['/api/gamification/user-challenges'],
    enabled: !!user
  });

  const { data: streaks } = useQuery({
    queryKey: ['/api/gamification/streaks'],
    enabled: !!user
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['/api/gamification/leaderboard'],
    enabled: !!user
  });

  const { data: referrals } = useQuery({
    queryKey: ['/api/referrals'],
    enabled: !!user
  });

  // Claim challenge reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest(`/api/gamification/challenges/${challengeId}/claim`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/user-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards'] });
      toast({
        title: "Reward Claimed!",
        description: "Your challenge reward has been added to your points.",
      });
    }
  });

  // Update streak mutation
  const updateStreakMutation = useMutation({
    mutationFn: async (streakType: string) => {
      return apiRequest('/api/gamification/streaks', {
        method: 'POST',
        body: JSON.stringify({ streakType, activityDate: new Date().toISOString() })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/streaks'] });
    }
  });

  const handleClaimReward = (challengeId: string) => {
    claimRewardMutation.mutate(challengeId);
  };

  const handleDailyLogin = () => {
    updateStreakMutation.mutate('daily_login');
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Referral code copied!",
      description: "Share this code with friends to earn rewards.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (rewardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  const reward = rewardsData?.userReward as UserReward;
  const currentTier = rewardsData?.currentTier;
  const nextTier = rewardsData?.nextTier;
  const pointsToNext = nextTier ? nextTier.minPoints - (reward?.totalPoints || 0) : 0;

  // Calculate achievement completion rate
  const completedAchievements = userAchievements?.filter((ua: UserAchievement) => ua.isCompleted) || [];
  const achievementRate = achievements?.length ? (completedAchievements.length / achievements.length) * 100 : 0;

  // Get current streak info
  const loginStreak = streaks?.find((s: LoyaltyStreak) => s.streakType === 'daily_login');
  const purchaseStreak = streaks?.find((s: LoyaltyStreak) => s.streakType === 'weekly_purchase');

  // Get today's challenges with user progress
  const todayChallengesWithProgress = dailyChallenges?.map((challenge: DailyChallenge) => {
    const userChallenge = userChallenges?.find((uc: UserChallenge) => uc.challengeId === challenge.id);
    return {
      ...challenge,
      userProgress: userChallenge?.progress || 0,
      isCompleted: userChallenge?.isCompleted || false,
      rewardClaimed: userChallenge?.rewardClaimed || false
    };
  }) || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Loyalty Rewards & Achievements
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300">
          Earn points, unlock achievements, and climb the leaderboard
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Points</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {reward?.totalPoints?.toLocaleString() || 0}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Current Tier</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {currentTier?.name || 'Bronze'}
                  </p>
                </div>
                <Crown className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Achievements</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {completedAchievements.length}/{achievements?.length || 0}
                  </p>
                </div>
                <Medal className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Login Streak</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {loginStreak?.currentStreak || 0} days
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Tier Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{currentTier?.name || 'Bronze'}</span>
                  {nextTier && (
                    <span className="text-sm text-gray-500">
                      {pointsToNext} points to {nextTier.name}
                    </span>
                  )}
                </div>
                {nextTier && (
                  <Progress 
                    value={((reward?.totalPoints || 0) / nextTier.minPoints) * 100} 
                    className="h-3"
                  />
                )}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Current Benefits:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {currentTier?.benefits?.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedAchievements.slice(0, 3).map((ua: UserAchievement) => {
                    const achievement = achievements?.find((a: Achievement) => a.id === ua.achievementId);
                    if (!achievement) return null;
                    
                    const IconComponent = IconMap[achievement.icon] || Trophy;
                    
                    return (
                      <div key={ua.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div 
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${achievement.badgeColor}20` }}
                        >
                          <IconComponent 
                            className="h-4 w-4" 
                            style={{ color: achievement.badgeColor }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.name}</p>
                          <p className="text-xs text-gray-500">{achievement.description}</p>
                        </div>
                        <Badge variant="secondary">+{achievement.rewardPoints} pts</Badge>
                      </div>
                    );
                  })}
                  {completedAchievements.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Complete your first purchase to unlock achievements!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement: Achievement) => {
              const userAchievement = userAchievements?.find((ua: UserAchievement) => ua.achievementId === achievement.id);
              const IconComponent = IconMap[achievement.icon] || Trophy;
              const progress = userAchievement?.progress || 0;
              const maxProgress = achievement.condition.value;
              const isCompleted = userAchievement?.isCompleted || false;
              
              if (achievement.isHidden && !isCompleted) return null;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`relative overflow-hidden ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
                    {isCompleted && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white">Completed</Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div 
                          className="p-3 rounded-full"
                          style={{ backgroundColor: `${achievement.badgeColor}20` }}
                        >
                          <IconComponent 
                            className="h-6 w-6" 
                            style={{ color: achievement.badgeColor }}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{achievement.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {achievement.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Progress: {progress}/{maxProgress}
                              </span>
                              <span className="text-xs font-medium text-green-600">
                                +{achievement.rewardPoints} pts
                              </span>
                            </div>
                            <Progress 
                              value={(progress / maxProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Daily Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayChallengesWithProgress.map((challenge: any) => (
              <Card key={challenge.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <Badge 
                      variant={challenge.isCompleted ? "default" : "secondary"}
                      className={challenge.isCompleted ? "bg-green-500" : ""}
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    {challenge.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Progress: {challenge.userProgress}/{challenge.targetValue}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +{challenge.rewardPoints} pts
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.userProgress / challenge.targetValue) * 100} 
                      className="h-3"
                    />
                  </div>

                  {challenge.isCompleted && !challenge.rewardClaimed && (
                    <Button 
                      onClick={() => handleClaimReward(challenge.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={claimRewardMutation.isPending}
                    >
                      {claimRewardMutation.isPending ? 'Claiming...' : 'Claim Reward'}
                    </Button>
                  )}

                  {challenge.rewardClaimed && (
                    <div className="text-center text-green-600 font-medium">
                      ✓ Reward Claimed
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {todayChallengesWithProgress.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No challenges available today. Check back tomorrow!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Streaks Tab */}
        <TabsContent value="streaks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {streaks?.map((streak: LoyaltyStreak) => (
              <Card key={streak.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    {streak.streakType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {streak.currentStreak}
                      </p>
                      <p className="text-sm text-gray-500">Current Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {streak.longestStreak}
                      </p>
                      <p className="text-sm text-gray-500">Longest Streak</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Multiplier</span>
                      <span className="font-medium text-green-600">
                        {parseFloat(streak.streakMultiplier).toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Bonus Points Earned</span>
                      <span className="font-medium text-green-600">
                        +{streak.bonusPointsEarned}
                      </span>
                    </div>
                  </div>

                  {streak.streakType === 'daily_login' && (
                    <Button 
                      onClick={handleDailyLogin}
                      className="w-full"
                      disabled={updateStreakMutation.isPending}
                      variant="outline"
                    >
                      {updateStreakMutation.isPending ? 'Updating...' : 'Check In Today'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {(!streaks || streaks.length === 0) && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Start your first streak by logging in daily!</p>
                  <Button 
                    onClick={handleDailyLogin}
                    className="mt-4"
                    disabled={updateStreakMutation.isPending}
                  >
                    {updateStreakMutation.isPending ? 'Starting...' : 'Start Daily Login Streak'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                All-Time Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard?.map((entry: LeaderboardEntry, index: number) => (
                  <div 
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      entry.userId === user?.id ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {entry.userId === user?.id ? 'You' : `User ${entry.userId.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.achievementCount} achievements • {entry.longestStreak} day streak
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {entry.points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!leaderboard || leaderboard.length === 0) && (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Leaderboard is being updated. Check back soon!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral Program */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referral Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                    Earn 500 Points per Referral!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share your referral code and earn points when friends make their first purchase.
                  </p>
                </div>
                
                {referrals?.referralCode && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Referral Code</label>
                    <div className="flex gap-2">
                      <Input 
                        value={referrals.referralCode} 
                        readOnly 
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyReferralCode(referrals.referralCode)}
                      >
                        {copiedCode === referrals.referralCode ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const text = `Join THCA Store and get premium hemp products! Use my referral code: ${referrals?.referralCode || 'SIGNUP'}`;
                      if (navigator.share) {
                        navigator.share({ text });
                      } else {
                        navigator.clipboard.writeText(text);
                        toast({
                          title: "Share text copied!",
                          description: "Paste this anywhere to share your referral.",
                        });
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {referrals?.totalReferrals || 0}
                    </p>
                    <p className="text-sm text-gray-500">Total Referrals</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {referrals?.completedReferrals || 0}
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {((referrals?.completedReferrals || 0) * 500).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">Points Earned from Referrals</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}