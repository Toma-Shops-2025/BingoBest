import React from 'react';
import { Player } from '@/types/game';

interface GameStatsProps {
  player: Player;
}

const GameStats: React.FC<GameStatsProps> = ({ player }) => {
  const winRate = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{player.wins}</div>
          <div className="text-sm text-gray-600">Total Wins</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{player.gamesPlayed}</div>
          <div className="text-sm text-gray-600">Games Played</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{winRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">${player.balance.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Balance</div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Achievement Progress</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm">
              <span>Games Played</span>
              <span>{player.gamesPlayed}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(player.gamesPlayed, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span>Wins</span>
              <span>{player.wins}/50</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(player.wins * 2, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;