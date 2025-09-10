import React from 'react';

interface NumberDisplayProps {
  currentNumber: number | null;
  calledNumbers: number[];
  ballImages: string[];
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ 
  currentNumber, 
  calledNumbers, 
  ballImages 
}) => {
  const getRandomBallImage = () => {
    return ballImages[Math.floor(Math.random() * ballImages.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Number</h3>
        {currentNumber ? (
          <div className="relative">
            <img 
              src={getRandomBallImage()} 
              alt="Bingo Ball" 
              className="w-24 h-24 mx-auto mb-2"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white drop-shadow-lg">
                {currentNumber}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">?</span>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Called Numbers</h4>
        <div className="max-h-32 overflow-y-auto">
          <div className="flex flex-wrap gap-1">
            {calledNumbers.map((number, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium"
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberDisplay;