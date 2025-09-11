import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface BingoNumber {
  number: number;
  called: boolean;
  letter: string;
}

interface BingoCardProps {
  numbers: BingoNumber[][];
  marked: boolean[][];
  onMark: (row: number, col: number) => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ numbers, marked, onMark }) => {
  const letters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-1 text-center">
          {/* Header row with letters */}
          {letters.map((letter, colIndex) => (
            <div key={colIndex} className="font-bold text-lg bg-purple-600 text-white p-2 rounded">
              {letter}
            </div>
          ))}
          
          {/* Number grid */}
          {numbers.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onMark(rowIndex, colIndex)}
                className={`
                  p-2 border rounded text-sm font-semibold transition-all
                  ${marked[rowIndex][colIndex] 
                    ? 'bg-green-500 text-white border-green-600' 
                    : 'bg-white hover:bg-gray-100 border-gray-300'
                  }
                  ${cell.called ? 'ring-2 ring-blue-500' : ''}
                `}
                disabled={marked[rowIndex][colIndex]}
              >
                {cell.number}
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BingoCard;