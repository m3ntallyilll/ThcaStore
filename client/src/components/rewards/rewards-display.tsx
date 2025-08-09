import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Coins } from 'lucide-react';
import { Link } from 'wouter';

export function RewardsDisplay({ compact = false }: { compact?: boolean }) {
  const { data: userRewards, isLoading } = useQuery({
    queryKey: ['/api/rewards/user'],
    retry: false,
  });

  if (isLoading || !userRewards) return null;

  if (compact) {
    return (
      <Link href="/rewards">
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer">
          <Coins className="w-4 h-4" />
          <span className="font-semibold">{userRewards.points.toLocaleString()}</span>
          <span className="text-xs">pts</span>
        </div>
      </Link>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-white">Your Rewards</h3>
        </div>
        <Link href="/rewards">
          <span className="text-sm text-purple-300 hover:text-purple-200 cursor-pointer">View All →</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Coins className="w-4 h-4 text-green-400" />
            <span className="text-lg font-bold text-white">{userRewards.points.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">Points</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-lg font-bold text-white">{userRewards.level}</span>
          </div>
          <p className="text-xs text-gray-400">Level</p>
        </div>
        
        <div className="text-center">
          <Badge className={`${getTierColor(userRewards.tier)} text-white`}>
            {userRewards.tier}
          </Badge>
          <p className="text-xs text-gray-400 mt-1">Tier</p>
        </div>
      </div>
      
      {userRewards.tier !== 'Bronze' && (
        <div className="mt-3 pt-3 border-t border-purple-500/20">
          <p className="text-xs text-purple-300">
            {userRewards.tier === 'Silver' && '🥈 You earn 25% more points!'}
            {userRewards.tier === 'Gold' && '🥇 You earn 50% more points!'}
            {userRewards.tier === 'Platinum' && '💎 You earn DOUBLE points!'}
          </p>
        </div>
      )}
    </Card>
  );
}

function getTierColor(tier: string) {
  switch (tier?.toLowerCase()) {
    case 'bronze': return 'bg-orange-600';
    case 'silver': return 'bg-gray-400';
    case 'gold': return 'bg-yellow-500';
    case 'platinum': return 'bg-purple-600';
    default: return 'bg-gray-600';
  }
}