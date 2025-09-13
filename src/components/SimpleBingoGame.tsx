import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BingoNumber {
  number: number;
  called: boolean;
  letter: string;
}

interface BingoCard {
  id: string;
  numbers: BingoNumber[][];
  marked: boolean[][];
  completed: boolean;
}

interface SimpleBingoGameProps {
  onWin: (winType: string, prize: number) => void;
  onGameEnd: () => void;
}

const SimpleBingoGame: React.FC<SimpleBingoGameProps> = ({ onWin, onGameEnd }) => {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([]);
  const [gameTimer, setGameTimer] = useState(300);
  const [error, setError] = useState<string | null>(null);

  const letters = ['B', 'I', 'N', 'G', 'O'];

  // Generate a simple bingo card
  const generateBingoCard = (): BingoCard => {
    try {
      const numbers: BingoNumber[][] = [];
      
      for (let col = 0; col < 5; col++) {
        const columnNumbers: BingoNumber[] = [];
        const usedNumbers = new Set<number>();
        
        for (let row = 0; row < 5; row++) {
          let number: number;
          let attempts = 0;
          do {
            number = Math.floor(Math.random() * 15) + (col * 15) + 1;
            attempts++;
            if (attempts > 100) break; // Prevent infinite loop
          } while (usedNumbers.has(number) && attempts < 100);
          
          usedNumbers.add(number);
          columnNumbers.push({
            number,
            called: false,
            letter: letters[col]
          });
        }
        
        columnNumbers.sort((a, b) => a.number - b.number);
        numbers.push(columnNumbers);
      }
      
      // Free space in the middle
      if (numbers[2] && numbers[2][2]) {
        numbers[2][2] = { number: 0, called: true, letter: 'FREE' };
      }
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        numbers,
        marked: Array(5).fill(null).map(() => Array(5).fill(false)),
        completed: false
      };
    } catch (error) {
      console.error('Error generating bingo card:', error);
      setError('Failed to generate bingo card');
      throw error;
    }
  };

  // Call a random number
  const callNumber = () => {
    if (gameStatus !== 'playing') return;
    
    try {
      const availableNumbers = [];
      for (let i = 1; i <= 75; i++) {
        if (!calledNumbers.includes(i)) {
          availableNumbers.push(i);
        }
      }
      
      if (availableNumbers.length === 0) {
        setGameStatus('finished');
        onGameEnd();
        return;
      }
      
      const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      setCalledNumbers(prev => [...prev, randomNumber]);
      setCurrentNumber(randomNumber);
      
      // Update bingo cards
      setBingoCards(prev => prev.map(card => {
        const newNumbers = card.numbers.map(column => 
          column.map(cell => ({
            ...cell,
            called: cell.number === randomNumber ? true : cell.called
          }))
        );
        
        return { ...card, numbers: newNumbers };
      }));
    } catch (error) {
      console.error('Error calling number:', error);
      setError('Failed to call number');
    }
  };

  // Mark a number on a card
  const markNumber = (cardId: string, row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    
    try {
      setBingoCards(prev => prev.map(card => {
        if (card.id === cardId) {
          const newMarked = [...card.marked];
          if (newMarked[row] && newMarked[row][col] !== undefined) {
            newMarked[row][col] = !newMarked[row][col];
            
            // Check for win
            const winType = checkWin(newMarked, card.numbers);
            if (winType) {
              let prize = 50; // Default prize
              switch (winType) {
                case 'line':
                  prize = 50;
                  break;
                case 'diagonal':
                  prize = 75;
                  break;
                case '4-corners':
                  prize = 25;
                  break;
                case 'x-pattern':
                  prize = 150;
                  break;
                case 'full-house':
                  prize = 200;
                  break;
              }
              
              onWin(winType, prize);
              return { ...card, marked: newMarked, completed: true };
            }
            
            return { ...card, marked: newMarked };
          }
        }
        return card;
      }));
    } catch (error) {
      console.error('Error marking number:', error);
      setError('Failed to mark number');
    }
  };

  // Check for winning patterns
  const checkWin = (marked: boolean[][], numbers: BingoNumber[][]) => {
    try {
      // Check rows
      for (let row = 0; row < 5; row++) {
        if (marked[row] && marked[row].every(cell => cell)) {
          return 'line';
        }
      }
      
      // Check columns
      for (let col = 0; col < 5; col++) {
        if (marked.every(row => row && row[col])) {
          return 'line';
        }
      }
      
      // Check diagonals
      if (marked[0] && marked[1] && marked[2] && marked[3] && marked[4]) {
        if (marked[0][0] && marked[1][1] && marked[2][2] && marked[3][3] && marked[4][4]) {
          return 'diagonal';
        }
        
        if (marked[0][4] && marked[1][3] && marked[2][2] && marked[3][1] && marked[4][0]) {
          return 'diagonal';
        }
      }
      
      // Check 4 corners
      if (marked[0] && marked[4]) {
        if (marked[0][0] && marked[0][4] && marked[4][0] && marked[4][4]) {
          return '4-corners';
        }
      }
      
      // Check X pattern
      if (marked[0] && marked[1] && marked[2] && marked[3] && marked[4]) {
        if ((marked[0][0] && marked[1][1] && marked[2][2] && marked[3][3] && marked[4][4]) &&
            (marked[0][4] && marked[1][3] && marked[2][2] && marked[3][1] && marked[4][0])) {
          return 'x-pattern';
        }
      }
      
      // Check full house
      if (marked.every(row => row && row.every(cell => cell))) {
        return 'full-house';
      }
      
      return null;
    } catch (error) {
      console.error('Error checking win:', error);
      return null;
    }
  };

  // Start the game
  const startGame = () => {
    try {
      setError(null);
      setGameStatus('playing');
      setCalledNumbers([]);
      setCurrentNumber(null);
      setBingoCards([generateBingoCard()]);
      setGameTimer(300);
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game. Please try again.');
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing' && gameTimer > 0) {
      const timer = setTimeout(() => setGameTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStatus === 'playing' && gameTimer === 0) {
      setGameStatus('finished');
      onGameEnd();
    }
  }, [gameStatus, gameTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLetter = (number: number) => {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
  };

  // Show error if there is one
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Game Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => setError(null)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Speed Bingo</span>
            <div className="flex items-center gap-4">
              {gameStatus === 'playing' && (
                <Badge variant="secondary">
                  Time: {formatTime(gameTimer)}
                </Badge>
              )}
              <Badge variant={gameStatus === 'playing' ? 'default' : 'secondary'}>
                {gameStatus.toUpperCase()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameStatus === 'waiting' && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Ready to Play Speed Bingo?</h3>
              <div className="flex gap-4 justify-center">
                <Button onClick={startGame} size="lg">
                  Start Game
                </Button>
              </div>
            </div>
          )}
          
          {gameStatus === 'playing' && (
            <div className="space-y-4">
              {/* Called Numbers */}
              <div>
                <h4 className="font-semibold mb-2">Called Numbers ({calledNumbers.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {calledNumbers.map((num, index) => (
                    <Badge key={index} variant="outline">
                      {getLetter(num)}{num}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Current Number */}
              {currentNumber && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {getLetter(currentNumber)}{currentNumber}
                  </div>
                  <Button onClick={callNumber}>
                    Call Next Number
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bingo Cards */}
      {bingoCards.map((card) => (
        <Card key={card.id}>
          <CardHeader>
            <CardTitle>Your Bingo Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
              {/* Header */}
              {letters.map((letter) => (
                <div key={letter} className="text-center font-bold text-lg p-2 bg-purple-100">
                  {letter}
                </div>
              ))}
              
              {/* Numbers */}
              {card.numbers.map((column, colIndex) => 
                column.map((cell, rowIndex) => (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`
                      aspect-square border-2 rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors
                      ${cell.called ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-300'}
                      ${card.marked[rowIndex] && card.marked[rowIndex][colIndex] ? 'bg-yellow-200 border-yellow-400' : ''}
                      ${cell.number === 0 ? 'bg-purple-200 border-purple-400' : ''}
                    `}
                    onClick={() => markNumber(card.id, rowIndex, colIndex)}
                  >
                    {cell.number === 0 ? 'FREE' : cell.number}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SimpleBingoGame;
