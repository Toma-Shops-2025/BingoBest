import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, DollarSign } from 'lucide-react';

interface GameStatsProps {
  gamesPlayed: number;
  gamesWon: number;
  totalWinnings: number;
  winRate: number;
  averageGameTime: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  gamesPlayed,
  gamesWon,
  totalWinnings,
  winRate,
  averageGameTime
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{gamesPlayed}</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{gamesWon}</div>
            <div className="text-sm text-gray-600">Games Won</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">${totalWinnings.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Winnings</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Average Game Time
            </span>
            <Badge variant="outline">{averageGameTime} min</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;