import React from 'react';
import { Player } from '@/types/game';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const trophyIcon = "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515340373_524a8c39.webp";
  
  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);

  return (
    <div 
      className="rounded-xl shadow-lg p-6 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/leaderboard-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center casino-text-glow">
        <img src={trophyIcon} alt="Trophy" className="w-8 h-8 mr-2" />
        Leaderboard
      </h2>
      
      <div className="space-y-3">
        {sortedPlayers.slice(0, 10).map((player, index) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-3 rounded-lg backdrop-blur-sm
              ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30' : ''}
              ${index === 1 ? 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-400/30' : ''}
              ${index === 2 ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/30' : ''}
              ${index > 2 ? 'bg-white/10 border border-white/20' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${index === 0 ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' : ''}
                ${index === 1 ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/50' : ''}
                ${index === 2 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50' : ''}
                ${index > 2 ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50' : ''}
              `}>
                {index + 1}
              </div>
              <div>
                <div className="font-bold text-lg text-white">{player.username}</div>
                <div className="text-sm text-gray-300 font-medium">
                  {player.gamesPlayed} games played
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl text-white">{player.wins}</div>
              <div className="text-sm text-gray-300 font-medium">wins</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;