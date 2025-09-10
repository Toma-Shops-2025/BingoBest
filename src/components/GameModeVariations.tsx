import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Clock, Shuffle, Eye, Gift, Crown, Users } from 'lucide-react';

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  duration: string;
  maxPlayers: number;
  entryFee: number;
  specialFeatures: string[];
  unlockRequirement?: string;
}

const GameModeVariations: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string>('');

  const gameModes: GameMode[] = [
    {
      id: 'speed_bingo',
      name: 'Speed Bingo',
      description: 'Numbers called every 3 seconds - think fast!',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      difficulty: 'Medium',
      duration: '5-10 min',
      maxPlayers: 50,
      entryFee: 10,
      specialFeatures: ['Auto-daub available', 'Bonus for quick wins', 'No chat during game']
    },
    {
      id: 'pattern_master',
      name: 'Pattern Master',
      description: 'Complex patterns change every round',
      icon: <Target className="w-6 h-6 text-blue-500" />,
      difficulty: 'Hard',
      duration: '15-25 min',
      maxPlayers: 30,
      entryFee: 25,
      specialFeatures: ['Multiple patterns', 'Pattern preview', 'Bonus points for style']
    },
    {
      id: 'mystery_numbers',
      name: 'Mystery Numbers',
      description: 'Some numbers are hidden until called',
      icon: <Eye className="w-6 h-6 text-purple-500" />,
      difficulty: 'Expert',
      duration: '10-20 min',
      maxPlayers: 20,
      entryFee: 35,
      specialFeatures: ['Hidden numbers', 'Reveal power-ups', 'Memory challenge'],
      unlockRequirement: 'Win 50 regular games'
    },
    {
      id: 'progressive_jackpot',
      name: 'Progressive Jackpot',
      description: 'Jackpot grows with each game until won',
      icon: <Gift className="w-6 h-6 text-green-500" />,
      difficulty: 'Medium',
      duration: '12-18 min',
      maxPlayers: 100,
      entryFee: 20,
      specialFeatures: ['Growing jackpot', 'Multiple winners possible', 'Bonus rounds']
    },
    {
      id: 'team_relay',
      name: 'Team Relay',
      description: 'Teams of 4 take turns playing cards',
      icon: <Users className="w-6 h-6 text-orange-500" />,
      difficulty: 'Medium',
      duration: '20-30 min',
      maxPlayers: 32,
      entryFee: 15,
      specialFeatures: ['Team coordination', 'Shared cards', 'Captain bonuses']
    },
    {
      id: 'shuffle_chaos',
      name: 'Shuffle Chaos',
      description: 'Card numbers shuffle every 5 calls',
      icon: <Shuffle className="w-6 h-6 text-red-500" />,
      difficulty: 'Expert',
      duration: '8-15 min',
      maxPlayers: 25,
      entryFee: 40,
      specialFeatures: ['Dynamic shuffling', 'Adaptation required', 'Chaos multiplier'],
      unlockRequirement: 'Reach Gold rank'
    },
    {
      id: 'endurance_marathon',
      name: 'Endurance Marathon',
      description: '2-hour session with multiple game types',
      icon: <Clock className="w-6 h-6 text-indigo-500" />,
      difficulty: 'Hard',
      duration: '2 hours',
      maxPlayers: 50,
      entryFee: 50,
      specialFeatures: ['Multiple rounds', 'Stamina system', 'Mega prizes']
    },
    {
      id: 'royal_tournament',
      name: 'Royal Tournament',
      description: 'Elite players only - winner takes crown',
      icon: <Crown className="w-6 h-6 text-yellow-600" />,
      difficulty: 'Expert',
      duration: '45-60 min',
      maxPlayers: 16,
      entryFee: 100,
      specialFeatures: ['Elimination rounds', 'Crown title', 'Exclusive rewards'],
      unlockRequirement: 'Diamond rank required'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isUnlocked = (mode: GameMode) => {
    // In a real app, this would check actual player progress
    return !mode.unlockRequirement || Math.random() > 0.5;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="text-blue-500" />
          Game Mode Variations
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gameModes.map((mode) => {
          const unlocked = isUnlocked(mode);
          
          return (
            <Card 
              key={mode.id} 
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedMode === mode.id ? 'ring-2 ring-blue-500' : ''
              } ${!unlocked ? 'opacity-60' : ''}`}
              onClick={() => unlocked && setSelectedMode(mode.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {mode.icon}
                    <CardTitle className="text-lg">{mode.name}</CardTitle>
                  </div>
                  <Badge className={`${getDifficultyColor(mode.difficulty)} text-white`}>
                    {mode.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">{mode.duration}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Max Players:</span>
                    <div className="font-medium">{mode.maxPlayers}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Entry Fee:</span>
                    <div className="font-medium text-green-600">${mode.entryFee}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Difficulty:</span>
                    <div className="font-medium">{mode.difficulty}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Special Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {mode.specialFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {mode.unlockRequirement && !unlocked && (
                  <div className="bg-yellow-50 p-2 rounded text-xs">
                    <span className="text-yellow-600 font-medium">🔒 Unlock Requirement:</span>
                    <div className="text-yellow-700">{mode.unlockRequirement}</div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  disabled={!unlocked}
                  variant={selectedMode === mode.id ? 'default' : 'outline'}
                >
                  {!unlocked ? 'Locked' : selectedMode === mode.id ? 'Selected' : 'Select Mode'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMode && (
        <Card className="bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Play?</h3>
            <p className="text-gray-600 mb-4">
              You've selected {gameModes.find(m => m.id === selectedMode)?.name}
            </p>
            <div className="flex gap-3 justify-center">
              <Button size="lg">
                Create Room
              </Button>
              <Button size="lg" variant="outline">
                Quick Match
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameModeVariations;