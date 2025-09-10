import React from 'react';
import { Player } from '@/types/game';

interface WinModalProps {
  isOpen: boolean;
  winner: Player;
  prizeAmount: number;
  onClose: () => void;
  onPlayAgain: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ 
  isOpen, 
  winner, 
  prizeAmount, 
  onClose, 
  onPlayAgain 
}) => {
  const trophyIcon = "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515340373_524a8c39.webp";
  const coinIcon = "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515336644_d79daee6.webp";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <img src={trophyIcon} alt="Trophy" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-yellow-600 mb-2">BINGO!</h2>
          <h3 className="text-xl font-semibold text-gray-800">
            {winner.username} Wins!
          </h3>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-2">
            <img src={coinIcon} alt="Prize" className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold text-green-800">
              ${prizeAmount.toFixed(2)}
            </span>
          </div>
          <p className="text-green-700">Prize Won!</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;