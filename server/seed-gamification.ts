import { IStorage } from './database-storage';

// Get storage from global
const storage = (global as any).storage as IStorage;

export async function seedGamificationData() {
  if (!storage) {
    console.error('Storage not available for gamification seeding');
    return;
  }

  console.log('Seeding gamification data...');

  // Seed Achievements
  const achievements = [
    {
      id: 'first-purchase',
      name: 'First Purchase',
      description: 'Make your first purchase on THCA Store',
      category: 'milestones',
      icon: 'ShoppingBag',
      condition: {
        type: 'purchase_count',
        value: 1,
        comparison: 'gte'
      },
      rewardPoints: 100,
      badgeColor: '#10B981',
      isHidden: false,
      difficulty: 'easy'
    },
    {
      id: 'big-spender',
      name: 'Big Spender',
      description: 'Spend over $500 in a single order',
      category: 'spending',
      icon: 'DollarSign',
      condition: {
        type: 'order_value',
        value: 500,
        comparison: 'gte'
      },
      rewardPoints: 500,
      badgeColor: '#F59E0B',
      isHidden: false,
      difficulty: 'hard'
    },
    {
      id: 'flower-enthusiast',
      name: 'Flower Enthusiast',
      description: 'Purchase 10 different flower strains',
      category: 'products',
      icon: 'Flower',
      condition: {
        type: 'unique_products',
        value: 10,
        comparison: 'gte',
        metadata: { category: 'flower' }
      },
      rewardPoints: 300,
      badgeColor: '#8B5CF6',
      isHidden: false,
      difficulty: 'medium'
    },
    {
      id: 'loyal-customer',
      name: 'Loyal Customer',
      description: 'Make 25 purchases',
      category: 'milestones',
      icon: 'Heart',
      condition: {
        type: 'purchase_count',
        value: 25,
        comparison: 'gte'
      },
      rewardPoints: 750,
      badgeColor: '#EF4444',
      isHidden: false,
      difficulty: 'hard'
    },
    {
      id: 'referral-master',
      name: 'Referral Master',
      description: 'Successfully refer 5 friends',
      category: 'social',
      icon: 'Users',
      condition: {
        type: 'referral_count',
        value: 5,
        comparison: 'gte'
      },
      rewardPoints: 1000,
      badgeColor: '#3B82F6',
      isHidden: false,
      difficulty: 'hard'
    },
    {
      id: 'streak-champion',
      name: 'Streak Champion',
      description: 'Maintain a 30-day login streak',
      category: 'engagement',
      icon: 'Calendar',
      condition: {
        type: 'login_streak',
        value: 30,
        comparison: 'gte'
      },
      rewardPoints: 600,
      badgeColor: '#F97316',
      isHidden: false,
      difficulty: 'medium'
    }
  ];

  for (const achievement of achievements) {
    await storage.createAchievement(achievement);
  }

  // Seed Daily Challenges
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const challenges = [
    {
      id: 'daily-browse',
      title: 'Product Explorer',
      description: 'Browse 5 different product pages today',
      category: 'engagement',
      targetType: 'page_views',
      targetValue: 5,
      rewardPoints: 50,
      bonusMultiplier: '1.0',
      validFrom: today.toISOString(),
      validUntil: tomorrow.toISOString(),
      isActive: true,
      difficulty: 'easy'
    },
    {
      id: 'daily-cart',
      title: 'Cart Builder',
      description: 'Add 3 items to your cart',
      category: 'shopping',
      targetType: 'cart_additions',
      targetValue: 3,
      rewardPoints: 75,
      bonusMultiplier: '1.2',
      validFrom: today.toISOString(),
      validUntil: tomorrow.toISOString(),
      isActive: true,
      difficulty: 'easy'
    },
    {
      id: 'daily-purchase',
      title: 'Daily Shopper',
      description: 'Make a purchase today',
      category: 'shopping',
      targetType: 'purchases',
      targetValue: 1,
      rewardPoints: 200,
      bonusMultiplier: '2.0',
      validFrom: today.toISOString(),
      validUntil: tomorrow.toISOString(),
      isActive: true,
      difficulty: 'medium'
    },
    {
      id: 'daily-referral',
      title: 'Share the Love',
      description: 'Share your referral code with someone',
      category: 'social',
      targetType: 'referral_shares',
      targetValue: 1,
      rewardPoints: 100,
      bonusMultiplier: '1.5',
      validFrom: today.toISOString(),
      validUntil: tomorrow.toISOString(),
      isActive: true,
      difficulty: 'medium'
    }
  ];

  for (const challenge of challenges) {
    await storage.createDailyChallenge(challenge);
  }

  console.log(`✓ Seeded ${achievements.length} achievements and ${challenges.length} daily challenges`);
  console.log('Gamification data seeding complete!');
}

// Export as default for module import
export default seedGamificationData;