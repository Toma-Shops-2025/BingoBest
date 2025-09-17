import React, { useState } from 'react';
import { Player } from '@/types/game';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  player: Player;
  currentRoom?: string;
  prizePool: number;
  timeLeft?: number;
  onSignOut?: () => void;
  onAddFunds?: () => void;
  onViewProfile?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  player, 
  currentRoom, 
  prizePool, 
  timeLeft,
  onSignOut,
  onAddFunds,
  onViewProfile
}) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double-clicks
    
    console.log('Sign out button clicked');
    setIsSigningOut(true);
    
    try {
      if (onSignOut) {
        console.log('Calling onSignOut function');
        await onSignOut();
        console.log('Sign out completed');
      } else {
        console.log('onSignOut function not provided');
        // Force reset state if no callback provided
        setTimeout(() => {
          setIsSigningOut(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      // Reset state even if there's an error
      setIsSigningOut(false);
    } finally {
      // Ensure state is reset after a timeout
      setTimeout(() => {
        setIsSigningOut(false);
      }, 3000);
    }
  };
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">
              {(player.username || 'P').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{player.username || 'Player'}</h2>
            <div className="flex items-center gap-2">
              <p className="text-purple-200">Balance: ${(player.balance || 0).toFixed(2)}</p>
              <Button 
                onClick={onAddFunds}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
              >
                Add Funds
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">${(prizePool || 0).toFixed(2)}</div>
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
            onClick={onViewProfile}
            variant="outline"
            size="sm"
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-purple-600"
          >
            Profile
          </Button>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            disabled={isSigningOut}
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-purple-600 disabled:opacity-50"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
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