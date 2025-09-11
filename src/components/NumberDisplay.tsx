import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NumberDisplayProps {
  currentNumber: number | null;
  calledNumbers: number[];
  onCallNumber: () => void;
  gameStatus: 'waiting' | 'playing' | 'finished';
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ 
  currentNumber, 
  calledNumbers, 
  onCallNumber, 
  gameStatus 
}) => {
  const getLetter = (number: number) => {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Called Numbers</h3>
          
          {/* Current Number Display */}
          {currentNumber && (
            <div className="bg-purple-600 text-white p-6 rounded-lg">
              <div className="text-4xl font-bold">
                {getLetter(currentNumber)}-{currentNumber}
              </div>
              <div className="text-sm mt-2">Current Number</div>
            </div>
          )}
          
          {/* Call Next Number Button */}
          {gameStatus === 'playing' && (
            <button
              onClick={onCallNumber}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            >
              Call Next Number
            </button>
          )}
          
          {/* Called Numbers List */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Called Numbers ({calledNumbers.length})</h4>
            <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
              {calledNumbers.map((number, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-sm"
                >
                  {getLetter(number)}-{number}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NumberDisplay;