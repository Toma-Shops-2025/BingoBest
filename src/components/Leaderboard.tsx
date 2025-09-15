import React from 'react';
import { Player } from '@/types/game';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const trophyIcon = "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515340373_524a8c39.webp";
  
  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <img src={trophyIcon} alt="Trophy" className="w-8 h-8 mr-2" />
        Leaderboard
      </h2>
      
      <div className="space-y-3">
        {sortedPlayers.slice(0, 10).map((player, index) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' : ''}
              ${index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200' : ''}
              ${index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200' : ''}
              ${index > 2 ? 'bg-gray-50' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${index === 0 ? 'bg-yellow-500 text-white' : ''}
                ${index === 1 ? 'bg-gray-500 text-white' : ''}
                ${index === 2 ? 'bg-orange-500 text-white' : ''}
                ${index > 2 ? 'bg-purple-500 text-white' : ''}
              `}>
                {index + 1}
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">{player.username}</div>
                <div className="text-sm text-gray-700 font-medium">
                  {player.gamesPlayed} games played
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl text-gray-900">{player.wins}</div>
              <div className="text-sm text-gray-700 font-medium">wins</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;