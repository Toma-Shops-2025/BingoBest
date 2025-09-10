import React from 'react';
import { Player } from '@/types/game';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  player: Player;
  currentRoom?: string;
  prizePool: number;
  timeLeft?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  player, 
  currentRoom, 
  prizePool, 
  timeLeft 
}) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">
              {player.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{player.username}</h2>
            <p className="text-purple-200">Balance: ${player.balance.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">${prizePool.toFixed(2)}</div>
          <div className="text-purple-200">Prize Pool</div>
        </div>
        
        <div className="flex items-center space-x-4">
          {timeLeft !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
              <div className="text-purple-200">Time Left</div>
            </div>
          )}
          <Button 
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-purple-600"
          >
            Sign Out
          </Button>
        </div>
      </div>
      
      {currentRoom && (
        <div className="mt-2 text-center">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            Room: {currentRoom}
          </span>
        </div>
      )}
    </div>
  );
};

export default GameHeader;