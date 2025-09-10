import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Eye, Clock, Target, Shuffle, Gift, Star } from 'lucide-react';

interface AdvancedPowerUp {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: 'Offensive' | 'Defensive' | 'Utility' | 'Special';
  cooldown: number;
  duration?: number;
  owned: number;
  maxStack: number;
  effects: string[];
}

const AdvancedPowerUps: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playerCoins] = useState(1250);

  const powerUps: AdvancedPowerUp[] = [
    {
      id: 'time_freeze',
      name: 'Time Freeze',
      description: 'Pause number calling for 30 seconds',
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      cost: 150,
      rarity: 'Epic',
      category: 'Utility',
      cooldown: 300,
      duration: 30,
      owned: 2,
      maxStack: 3,
      effects: ['Stops number calling', 'Gives strategic time', 'Affects all players']
    },
    {
      id: 'double_vision',
      name: 'Double Vision',
      description: 'See the next 5 numbers to be called',
      icon: <Eye className="w-6 h-6 text-purple-500" />,
      cost: 200,
      rarity: 'Legendary',
      category: 'Utility',
      cooldown: 600,
      owned: 0,
      maxStack: 2,
      effects: ['Preview upcoming numbers', 'Strategic advantage', 'Limited uses per game']
    },
    {
      id: 'shield_wall',
      name: 'Shield Wall',
      description: 'Immune to opponent power-ups for 60 seconds',
      icon: <Shield className="w-6 h-6 text-green-500" />,
      cost: 100,
      rarity: 'Rare',
      category: 'Defensive',
      cooldown: 240,
      duration: 60,
      owned: 5,
      maxStack: 5,
      effects: ['Blocks negative effects', 'Protects from interference', 'Defensive stance']
    },
    {
      id: 'number_magnet',
      name: 'Number Magnet',
      description: 'Increases chance of your needed numbers being called',
      icon: <Target className="w-6 h-6 text-red-500" />,
      cost: 300,
      rarity: 'Legendary',
      category: 'Offensive',
      cooldown: 900,
      duration: 120,
      owned: 1,
      maxStack: 1,
      effects: ['Influences RNG', 'Boosts win probability', 'Rare and powerful']
    },
    {
      id: 'card_shuffle',
      name: 'Card Shuffle',
      description: 'Randomly rearrange your card numbers',
      icon: <Shuffle className="w-6 h-6 text-orange-500" />,
      cost: 75,
      rarity: 'Common',
      category: 'Utility',
      cooldown: 180,
      owned: 8,
      maxStack: 10,
      effects: ['Rearranges numbers', 'Fresh strategy', 'Risk vs reward']
    },
    {
      id: 'bonus_multiplier',
      name: 'Bonus Multiplier',
      description: 'Double your winnings for the next win',
      icon: <Gift className="w-6 h-6 text-yellow-500" />,
      cost: 250,
      rarity: 'Epic',
      category: 'Special',
      cooldown: 0,
      owned: 3,
      maxStack: 5,
      effects: ['2x prize money', 'Single use', 'High value reward']
    },
    {
      id: 'lightning_daub',
      name: 'Lightning Daub',
      description: 'Auto-mark numbers for 45 seconds',
      icon: <Zap className="w-6 h-6 text-cyan-500" />,
      cost: 125,
      rarity: 'Rare',
      category: 'Utility',
      cooldown: 300,
      duration: 45,
      owned: 4,
      maxStack: 4,
      effects: ['Automatic marking', 'Speed advantage', 'Precision guaranteed']
    },
    {
      id: 'lucky_star',
      name: 'Lucky Star',
      description: 'Guarantees at least one needed number in next 10 calls',
      icon: <Star className="w-6 h-6 text-pink-500" />,
      cost: 400,
      rarity: 'Legendary',
      category: 'Special',
      cooldown: 1200,
      owned: 0,
      maxStack: 1,
      effects: ['Guaranteed progress', 'Ultimate luck boost', 'Game changer']
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500';
      case 'Rare': return 'bg-blue-500';
      case 'Epic': return 'bg-purple-500';
      case 'Legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Offensive': return 'bg-red-100 text-red-800';
      case 'Defensive': return 'bg-green-100 text-green-800';
      case 'Utility': return 'bg-blue-100 text-blue-800';
      case 'Special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canAfford = (cost: number) => playerCoins >= cost;
  const canBuy = (powerUp: AdvancedPowerUp) => 
    canAfford(powerUp.cost) && powerUp.owned < powerUp.maxStack;

  const filteredPowerUps = selectedCategory === 'all' 
    ? powerUps 
    : powerUps.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="text-yellow-500" />
          Advanced Power-Ups
        </h2>
        <Badge className="bg-yellow-500 text-white px-3 py-1">
          {playerCoins} Coins
        </Badge>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Offensive', 'Defensive', 'Utility', 'Special'].map((category) => (
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

      {/* Power-Up Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPowerUps.map((powerUp) => (
          <Card 
            key={powerUp.id} 
            className="hover:shadow-lg transition-all duration-300 border-2"
            style={{
              borderColor: powerUp.rarity === 'Legendary' ? '#fbbf24' : 
                          powerUp.rarity === 'Epic' ? '#a855f7' :
                          powerUp.rarity === 'Rare' ? '#3b82f6' : '#6b7280'
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {powerUp.icon}
                  <CardTitle className="text-lg">{powerUp.name}</CardTitle>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={`${getRarityColor(powerUp.rarity)} text-white text-xs`}>
                    {powerUp.rarity}
                  </Badge>
                  <Badge className={getCategoryColor(powerUp.category)} variant="secondary">
                    {powerUp.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">{powerUp.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Cost:</span>
                  <div className={`font-medium ${canAfford(powerUp.cost) ? 'text-green-600' : 'text-red-600'}`}>
                    {powerUp.cost} coins
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Owned:</span>
                  <div className="font-medium">{powerUp.owned}/{powerUp.maxStack}</div>
                </div>
                <div>
                  <span className="text-gray-500">Cooldown:</span>
                  <div className="font-medium">{powerUp.cooldown}s</div>
                </div>
                {powerUp.duration && (
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">{powerUp.duration}s</div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Effects:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {powerUp.effects.map((effect, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                disabled={!canBuy(powerUp)}
                variant={canBuy(powerUp) ? 'default' : 'outline'}
              >
                {!canAfford(powerUp.cost) ? 'Not Enough Coins' :
                 powerUp.owned >= powerUp.maxStack ? 'Max Owned' : 
                 `Buy for ${powerUp.cost} coins`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Power-Up Combos */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            Power-Up Combos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-white p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">Time Master</h4>
              <p className="text-xs text-gray-600 mb-2">Time Freeze + Lightning Daub</p>
              <Badge variant="outline" className="text-xs">+50% effectiveness</Badge>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">Fortune's Favor</h4>
              <p className="text-xs text-gray-600 mb-2">Lucky Star + Bonus Multiplier</p>
              <Badge variant="outline" className="text-xs">+100% prize bonus</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPowerUps;