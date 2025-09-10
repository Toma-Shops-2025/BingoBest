import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Gift, Zap, Crown, Heart, Flame } from 'lucide-react';

interface EnhancedAchievement {
  id: string;
  name: string;
  description: string;
  category: 'wins' | 'games' | 'money' | 'special' | 'social' | 'streak' | 'milestone' | 'seasonal';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirement: number;
  progress: number;
  reward: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  chainId?: string; // For achievement chains
}

const EnhancedAchievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const achievements: EnhancedAchievement[] = [
    {
      id: '1',
      name: 'First Victory',
      description: 'Win your first bingo game',
      category: 'wins',
      tier: 'bronze',
      requirement: 1,
      progress: 1,
      reward: 50,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Century Club',
      description: 'Win 100 games',
      category: 'wins',
      tier: 'gold',
      requirement: 100,
      progress: 45,
      reward: 1000,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '3',
      name: 'Speed Demon',
      description: 'Win a game in under 30 seconds',
      category: 'special',
      tier: 'platinum',
      requirement: 1,
      progress: 0,
      reward: 500,
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: '4',
      name: 'Social Butterfly',
      description: 'Add 50 friends',
      category: 'social',
      tier: 'silver',
      requirement: 50,
      progress: 23,
      reward: 250,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: '5',
      name: 'Hot Streak',
      description: 'Win 10 games in a row',
      category: 'streak',
      tier: 'gold',
      requirement: 10,
      progress: 3,
      reward: 750,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '6',
      name: 'Millionaire',
      description: 'Earn $1,000,000 total',
      category: 'money',
      tier: 'diamond',
      requirement: 1000000,
      progress: 125000,
      reward: 5000,
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wins': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'games': return <Target className="w-5 h-5 text-blue-500" />;
      case 'money': return <Gift className="w-5 h-5 text-green-500" />;
      case 'special': return <Star className="w-5 h-5 text-purple-500" />;
      case 'social': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'streak': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'milestone': return <Crown className="w-5 h-5 text-indigo-500" />;
      default: return <Zap className="w-5 h-5 text-cyan-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-600';
      case 'silver': return 'bg-gray-400';
      case 'gold': return 'bg-yellow-500';
      case 'platinum': return 'bg-blue-400';
      case 'diamond': return 'bg-cyan-400';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-yellow-500';
      default: return 'border-gray-300';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const tierMatch = selectedTier === 'all' || achievement.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Enhanced Achievements
        </h2>
        <Badge variant="secondary">
          {unlockedCount}/{achievements.length} Unlocked
        </Badge>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'wins', 'games', 'money', 'special', 'social', 'streak', 'milestone'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Tier</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'bronze', 'silver', 'gold', 'platinum', 'diamond'].map((tier) => (
              <Button
                key={tier}
                variant={selectedTier === tier ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier(tier)}
                className="capitalize"
              >
                {tier}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`hover:shadow-lg transition-all duration-300 border-2 ${getRarityColor(achievement.rarity)} ${
              achievement.unlocked ? 'bg-green-50' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(achievement.category)}
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Badge className={`${getTierColor(achievement.tier)} text-white text-xs`}>
                    {achievement.tier}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!achievement.unlocked && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress.toLocaleString()}/{achievement.requirement.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.requirement) * 100}
                    className="h-2"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge className="bg-green-500 text-white">
                  Reward: ${achievement.reward}
                </Badge>
                {achievement.unlocked && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedAchievements;