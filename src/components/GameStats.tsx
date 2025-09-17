import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, DollarSign } from 'lucide-react';

interface Player {
  gamesPlayed: number;
  gamesWon: number;
  totalWinnings: number;
  winRate: number;
}

interface GameStatsProps {
  player: Player;
}

const GameStats: React.FC<GameStatsProps> = ({ player }) => {
  const { gamesPlayed, gamesWon, totalWinnings, winRate } = player;
  const averageGameTime = 5; // Default average game time in minutes
  return (
    <Card>
      <CardHeader className="p-6 lg:p-8">
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
          <Trophy className="w-5 h-5 lg:w-6 lg:h-6" />
          Your Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 lg:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center p-3 lg:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl lg:text-3xl font-bold text-purple-600">{gamesPlayed}</div>
            <div className="text-sm lg:text-base text-gray-600 font-medium">Games Played</div>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl lg:text-3xl font-bold text-green-600">{gamesWon}</div>
            <div className="text-sm lg:text-base text-gray-600 font-medium">Games Won</div>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl lg:text-3xl font-bold text-blue-600">{(winRate || 0).toFixed(1)}%</div>
            <div className="text-sm lg:text-base text-gray-600 font-medium">Win Rate</div>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <div className="text-2xl lg:text-3xl font-bold text-yellow-600">${(totalWinnings || 0).toFixed(2)}</div>
            <div className="text-sm lg:text-base text-gray-600 font-medium">Total Winnings</div>
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