import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Users, Clock, Star } from 'lucide-react';

interface PlayerRank {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
  division: number;
  points: number;
  nextTierPoints: number;
}

interface MatchmakingQueue {
  id: string;
  name: string;
  description: string;
  skillRange: string;
  avgWaitTime: string;
  playersInQueue: number;
  entryFee: number;
  prizeMultiplier: number;
}

const SkillBasedMatchmaking: React.FC = () => {
  const [currentRank] = useState<PlayerRank>({
    tier: 'Gold',
    division: 3,
    points: 1450,
    nextTierPoints: 1600
  });

  const [selectedQueue, setSelectedQueue] = useState<string>('');

  const queues: MatchmakingQueue[] = [
    {
      id: 'bronze',
      name: 'Bronze League',
      description: 'For new and casual players',
      skillRange: '0-800 SR',
      avgWaitTime: '30s',
      playersInQueue: 24,
      entryFee: 2,
      prizeMultiplier: 1.2
    },
    {
      id: 'silver',
      name: 'Silver League',
      description: 'Developing players with basic skills',
      skillRange: '801-1200 SR',
      avgWaitTime: '45s',
      playersInQueue: 18,
      entryFee: 5,
      prizeMultiplier: 1.5
    },
    {
      id: 'gold',
      name: 'Gold League',
      description: 'Skilled players with good game sense',
      skillRange: '1201-1600 SR',
      avgWaitTime: '1m 15s',
      playersInQueue: 12,
      entryFee: 10,
      prizeMultiplier: 2.0
    },
    {
      id: 'platinum',
      name: 'Platinum League',
      description: 'Advanced players with excellent timing',
      skillRange: '1601-2000 SR',
      avgWaitTime: '2m 30s',
      playersInQueue: 8,
      entryFee: 15,
      prizeMultiplier: 3.0
    },
    {
      id: 'diamond',
      name: 'Diamond League',
      description: 'Elite players with superior strategy',
      skillRange: '2001-2400 SR',
      avgWaitTime: '4m',
      playersInQueue: 4,
      entryFee: 25,
      prizeMultiplier: 4.5
    },
    {
      id: 'master',
      name: 'Master League',
      description: 'The best of the best',
      skillRange: '2401+ SR',
      avgWaitTime: '8m',
      playersInQueue: 2,
      entryFee: 50,
      prizeMultiplier: 6.0
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'bg-amber-600';
      case 'silver': return 'bg-gray-400';
      case 'gold': return 'bg-yellow-500';
      case 'platinum': return 'bg-blue-400';
      case 'diamond': return 'bg-cyan-400';
      case 'master': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const canJoinQueue = (queue: MatchmakingQueue) => {
    const playerPoints = currentRank.points;
    switch (queue.id) {
      case 'bronze': return playerPoints <= 800;
      case 'silver': return playerPoints >= 801 && playerPoints <= 1200;
      case 'gold': return playerPoints >= 1201 && playerPoints <= 1600;
      case 'platinum': return playerPoints >= 1601 && playerPoints <= 2000;
      case 'diamond': return playerPoints >= 2001 && playerPoints <= 2400;
      case 'master': return playerPoints >= 2401;
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="text-blue-500" />
          Skill-Based Matchmaking
        </h2>
      </div>

      {/* Current Rank Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            Your Current Rank
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getTierColor(currentRank.tier)} text-white px-3 py-1`}>
                {currentRank.tier} {currentRank.division}
              </Badge>
              <span className="text-lg font-semibold">{currentRank.points} SR</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Next Tier</div>
              <div className="font-medium">{currentRank.nextTierPoints - currentRank.points} points to go</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to {currentRank.tier === 'Gold' ? 'Platinum' : 'Next Tier'}</span>
              <span>{currentRank.points}/{currentRank.nextTierPoints}</span>
            </div>
            <Progress 
              value={(currentRank.points / currentRank.nextTierPoints) * 100}
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Queue Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Your League</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {queues.map((queue) => {
            const canJoin = canJoinQueue(queue);
            const isCurrentTier = queue.id === currentRank.tier.toLowerCase();
            
            return (
              <Card 
                key={queue.id} 
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  selectedQueue === queue.id ? 'ring-2 ring-blue-500' : ''
                } ${!canJoin ? 'opacity-60' : ''} ${isCurrentTier ? 'border-blue-500 border-2' : ''}`}
                onClick={() => canJoin && setSelectedQueue(queue.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge className={`${getTierColor(queue.name.split(' ')[0])} text-white`}>
                        {queue.name.split(' ')[0]}
                      </Badge>
                      {isCurrentTier && <Star className="w-4 h-4 text-yellow-500" />}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">{queue.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span>{queue.skillRange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{queue.avgWaitTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>{queue.playersInQueue} in queue</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${queue.entryFee}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {queue.prizeMultiplier}x Prize Multiplier
                    </Badge>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={!canJoin}
                    variant={selectedQueue === queue.id ? 'default' : 'outline'}
                  >
                    {!canJoin ? 'Rank Required' : selectedQueue === queue.id ? 'Selected' : 'Select Queue'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Join Match Button */}
      {selectedQueue && (
        <Card className="bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Play?</h3>
            <p className="text-gray-600 mb-4">
              You've selected {queues.find(q => q.id === selectedQueue)?.name}
            </p>
            <Button size="lg" className="px-8">
              Join Match Queue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillBasedMatchmaking;