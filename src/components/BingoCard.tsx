import React from 'react';
import { BingoCard as BingoCardType } from '@/types/game';

interface BingoCardProps {
  card: BingoCardType;
  onNumberClick: (row: number, col: number) => void;
  disabled?: boolean;
}

const BingoCard: React.FC<BingoCardProps> = ({ card, onNumberClick, disabled = false }) => {
  const headers = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200">
      <div className="grid grid-cols-5 gap-1 mb-2">
        {headers.map((header, index) => (
          <div key={index} className="bg-purple-600 text-white font-bold text-center py-2 rounded">
            {header}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {card.numbers.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isCenter = rowIndex === 2 && colIndex === 2;
            const isMarked = card.marked[rowIndex][colIndex];
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => !disabled && onNumberClick(rowIndex, colIndex)}
                disabled={disabled}
                className={`
                  h-12 w-12 rounded-lg font-semibold text-sm transition-all duration-200
                  ${isCenter ? 'bg-yellow-400 text-black' : ''}
                  ${isMarked && !isCenter ? 'bg-green-500 text-white' : ''}
                  ${!isMarked && !isCenter ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              >
                {isCenter ? 'FREE' : number}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BingoCard;