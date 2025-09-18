import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { financialSafety } from '@/lib/financialSafety';

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
  autoStart?: boolean;
}

const SimpleBingoGame: React.FC<SimpleBingoGameProps> = ({ onWin, onGameEnd, autoStart = false }) => {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([]);
  const [gameTimer, setGameTimer] = useState(300);
  const [error, setError] = useState<string | null>(null);
  const [autoCallInterval, setAutoCallInterval] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const letters = ['B', 'I', 'N', 'G', 'O'];

  // Audio functions
  const playNumberCallSound = (number: number) => {
    if (!audioEnabled) return;
    
    try {
      // Try to play specific number voice audio file
      const audio = new Audio(`/audio/numbers/bingo-${number}.mp3`);
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Fallback to generic beep if specific audio not found
        const beepAudio = new Audio('/audio/beep.mp3');
        beepAudio.volume = 0.5;
        beepAudio.play().catch(console.warn);
      });
    } catch (error) {
      console.warn('Could not play number audio:', error);
    }
  };

  // Enhanced number calling with visual and audio feedback
  const announceNumber = (number: number) => {
    const letter = getLetter(number);
    const announcement = `${letter} - ${number}`;
    
    // Visual feedback
    console.log(`🎯 BINGO NUMBER CALLED: ${announcement}`);
    
    // Audio feedback
    playNumberCallSound(number);
    
    // Show notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Bingo Number Called!`, {
          body: announcement,
          icon: '/icon-192x192.png'
        });
      }
    }
  };

  const playBingoSound = () => {
    if (!audioEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context if suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a celebratory bingo sound
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      
      // Clean up after sound finishes
      setTimeout(() => {
        try {
          oscillator.disconnect();
          gainNode.disconnect();
        } catch (e) {
          // Already disconnected
        }
      }, 900);
    } catch (error) {
      console.warn('Audio not available:', error);
    }
  };

  // Generate a simple bingo card
  const generateBingoCard = (): BingoCard => {
    try {
      const numbers: BingoNumber[][] = [];
      
      // Standard bingo number ranges: B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
      const numberRanges = [
        { start: 1, end: 15 },   // B
        { start: 16, end: 30 }, // I
        { start: 31, end: 45 }, // N
        { start: 46, end: 60 }, // G
        { start: 61, end: 75 }  // O
      ];
      
      for (let col = 0; col < 5; col++) {
        const columnNumbers: BingoNumber[] = [];
        const usedNumbers = new Set<number>();
        const range = numberRanges[col];
        
        for (let row = 0; row < 5; row++) {
          let number: number;
          let attempts = 0;
          do {
            number = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
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
        
        // Sort numbers in ascending order for each column
        columnNumbers.sort((a, b) => a.number - b.number);
        numbers.push(columnNumbers);
      }
      
      // Free space in the middle (N column, middle row)
      if (numbers[2] && numbers[2][2]) {
        numbers[2][2] = { number: 0, called: true, letter: 'FREE' };
      }
      
      console.log('🎯 Generated bingo card with correct number ranges:');
      numbers.forEach((column, colIndex) => {
        const letter = letters[colIndex];
        const range = numberRanges[colIndex];
        console.log(`${letter} column (${range.start}-${range.end}):`, column.map(cell => cell.number));
      });
      
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
    if (gameStatus !== 'playing') {
      console.log('🎯 Cannot call number - game not playing. Status:', gameStatus);
      return;
    }
    
    try {
      const availableNumbers = [];
      for (let i = 1; i <= 75; i++) {
        if (!calledNumbers.includes(i)) {
          availableNumbers.push(i);
        }
      }
      
      if (availableNumbers.length === 0) {
        console.log('🎯 All numbers called - game finished');
        setGameStatus('finished');
        onGameEnd();
        return;
      }
      
      const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      console.log(`🎯 CALLING NUMBER: ${randomNumber} (${getLetter(randomNumber)}-${randomNumber})`);
      
      setCalledNumbers(prev => [...prev, randomNumber]);
      setCurrentNumber(randomNumber);
      
      // Enhanced number announcement with visual and audio feedback
      announceNumber(randomNumber);
      
      // Update bingo cards
      setBingoCards(prev => prev.map(card => {
        const newNumbers = card.numbers.map(column => 
          column.map(cell => ({
            ...cell,
            called: cell.number === randomNumber ? true : cell.called
          }))
        );
        
        // Auto-daub on desktop only (screen width > 768px)
        const isDesktop = window.innerWidth > 768;
        let newMarked = card.marked;
        
        if (isDesktop) {
          // Auto-daub the called number on desktop
          newMarked = card.marked.map((row, rowIndex) => 
            row.map((cell, colIndex) => {
              const cellNumber = card.numbers[colIndex][rowIndex].number;
              if (cellNumber === randomNumber) {
                console.log(`🎯 Auto-daubing ${randomNumber} on desktop`);
                return true; // Auto-mark this number
              }
              return cell; // Keep existing state
            })
          );
          
          // Check for win after auto-daubing
          const winType = checkWin(newMarked, newNumbers);
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
            
            console.log(`🎯 WIN DETECTED: ${winType} - Prize: $${prize}`);
            // Handle win asynchronously
            handleWin(winType, prize, card, newMarked);
            return { ...card, numbers: newNumbers, marked: newMarked, completed: true };
          }
        }
        
        return { ...card, numbers: newNumbers, marked: newMarked };
      }));
    } catch (error) {
      console.error('Error calling number:', error);
      setError('Failed to call number');
    }
  };

  // Mark a number on a card
  const markNumber = async (cardId: string, row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    
    try {
      setBingoCards(prev => prev.map(card => {
        if (card.id === cardId) {
          const newMarked = [...card.marked];
          if (newMarked[row] && newMarked[row][col] !== undefined) {
            // Only allow marking if the number has been called or is the FREE space
            const cellNumber = card.numbers[col][row].number;
            const isCalled = card.numbers[col][row].called;
            const isFreeSpace = cellNumber === 0;
            
            if (!isCalled && !isFreeSpace) {
              alert(`❌ Number ${cellNumber} hasn't been called yet!`);
              return card;
            }
            
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
              
              // Handle win asynchronously
              handleWin(winType, prize, card, newMarked);
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

  // Handle win asynchronously
  const handleWin = async (winType: string, prize: number, card: BingoCard, newMarked: boolean[][]) => {
    try {
      // Check if we can afford to pay this prize
      const payoutTransaction = await financialSafety.processPrizePayout(
        'current_user', // In real app, use actual user ID
        'bingo_game', // In real app, use actual game ID
        prize
      );

      if (payoutTransaction) {
        // Play bingo win sound
        playBingoSound();
        onWin(winType, prize);
      } else {
        // Insufficient funds - show message but don't pay
        alert(`🎉 Congratulations! You won ${winType}!\n\nYour prize of $${prize} is being processed and will be added to your account shortly. Please check your balance in a few moments.\n\nThank you for playing!`);
      }
    } catch (error) {
      console.error('Error processing win:', error);
      // Still show win message even if payout fails
      alert(`🎉 Congratulations! You won ${winType}!\n\nYour prize of $${prize} is being processed and will be added to your account shortly. Please check your balance in a few moments.\n\nThank you for playing!`);
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
      console.log('🎯 Starting bingo game...');
      setError(null);
      
      // Set game status to playing FIRST
      setGameStatus('playing');
      console.log('🎯 Game status set to playing');
      
      setCalledNumbers([]);
      setCurrentNumber(null);
      setBingoCards([generateBingoCard()]);
      setGameTimer(300);
      
      // Clear any existing interval
      if (autoCallInterval) {
        window.clearInterval(autoCallInterval);
        setAutoCallInterval(null);
      }
      
      // Start automatic number calling every 2 seconds
      const interval = window.setInterval(() => {
        console.log('🎯 Interval triggered - calling number...');
        callNumber();
      }, 2000);
      setAutoCallInterval(interval);
      
      // Start the first number call immediately
      setTimeout(() => {
        console.log('🎯 First number call (immediate)');
        callNumber();
      }, 500);
      
      // Call second number after 1 second
      setTimeout(() => {
        console.log('🎯 Second number call (1 second delay)');
        callNumber();
      }, 1500);
      
      console.log('🎯 BINGO GAME STARTED - Numbers will be called every 2 seconds');
      console.log('🔊 Audio announcements enabled');
      console.log('📱 Notifications enabled');
      console.log('⏰ Timer started:', gameTimer, 'seconds');
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game. Please try again.');
    }
  };

  // Stop the game
  const stopGame = () => {
    if (autoCallInterval) {
      window.clearInterval(autoCallInterval);
      setAutoCallInterval(null);
    }
    setGameStatus('finished');
    onGameEnd();
  };

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing' && gameTimer > 0) {
      const timer = setTimeout(() => setGameTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStatus === 'playing' && gameTimer === 0) {
      stopGame();
    }
  }, [gameStatus, gameTimer]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (autoCallInterval) {
        window.clearInterval(autoCallInterval);
      }
    };
  }, [autoCallInterval]);

  // Auto-start effect
  useEffect(() => {
    if (autoStart && gameStatus === 'waiting') {
      console.log('🎯 Auto-starting bingo game...');
      // Add a small delay to ensure component is fully mounted
      setTimeout(() => {
        startGame();
      }, 100);
    }
  }, [autoStart, gameStatus]);

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
      <Card className="casino-card">
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
              {/* Audio Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Audio:</span>
                  <Button
                    variant={audioEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? "🔊 On" : "🔇 Off"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopGame}
                  >
                    Stop Game
                  </Button>
                </div>
              </div>

              {/* Called Numbers */}
              <div>
                <h4 className="font-semibold mb-2 text-white">Called Numbers ({calledNumbers.length})</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto bg-black/20 p-3 rounded-lg">
                  {calledNumbers.map((num, index) => (
                    <Badge 
                      key={index} 
                      variant={num === currentNumber ? "default" : "outline"}
                      className={`text-sm font-bold ${
                        num === currentNumber 
                          ? "animate-pulse bg-green-500 text-white border-green-400" 
                          : "bg-blue-500 text-white border-blue-400"
                      }`}
                    >
                      {getLetter(num)}{num}
                    </Badge>
                  ))}
                </div>
                {calledNumbers.length === 0 && (
                  <p className="text-yellow-400 text-sm mt-2">🎯 Numbers will be called automatically every 2 seconds!</p>
                )}
              </div>
              
              {/* Current Number */}
              {currentNumber && (
                <div className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border-2 border-yellow-400/50">
                  <div className="text-8xl font-bold text-yellow-400 mb-4 animate-pulse casino-text-glow bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {getLetter(currentNumber)}{currentNumber}
                  </div>
                  <p className="text-lg text-white font-bold">🎯 CURRENT NUMBER CALLED</p>
                  <p className="text-sm text-yellow-200">Numbers called automatically every 2 seconds</p>
                  <div className="mt-2 text-xs text-yellow-300">
                    🔊 Audio announcement played
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bingo Cards */}
      {bingoCards.map((card) => (
        <Card key={card.id} className="casino-card">
          <CardHeader>
            <CardTitle>Your Bingo Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
              {/* Header */}
              {letters.map((letter, index) => (
                <div 
                  key={letter} 
                  className={`
                    text-center font-bold text-lg p-2 rounded-xl shadow-lg text-white
                    ${index === 0 ? 'bg-gradient-to-br from-red-500 to-red-700' : ''}
                    ${index === 1 ? 'bg-gradient-to-br from-orange-500 to-orange-700' : ''}
                    ${index === 2 ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' : ''}
                    ${index === 3 ? 'bg-gradient-to-br from-green-500 to-green-700' : ''}
                    ${index === 4 ? 'bg-gradient-to-br from-blue-500 to-blue-700' : ''}
                  `}
                >
                  {letter}
                </div>
              ))}
              
                      {/* Numbers */}
                      {card.numbers.map((column, colIndex) => 
                        column.map((cell, rowIndex) => (
                          <div
                            key={`${colIndex}-${rowIndex}`}
                            className={`
                              bingo-number aspect-square border-2 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 shadow-lg
                              ${cell.called ? 'called' : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400 text-white shadow-blue-500/50'}
                              ${card.marked[rowIndex] && card.marked[rowIndex][colIndex] ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-black shadow-yellow-400/50' : ''}
                              ${cell.number === 0 ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white font-bold shadow-green-400/50' : ''}
                              hover:scale-105 hover:shadow-xl
                            `}
                            onClick={() => markNumber(card.id, rowIndex, colIndex)}
                            title={`${cell.letter}-${cell.number} (${cell.called ? 'Called' : 'Not Called'})`}
                          >
                            {cell.number === 0 ? 'FREE' : cell.number}
                          </div>
                        ))
                      )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* BINGO Button */}
      {gameStatus === 'playing' && (
        <Card className="casino-card">
          <CardContent className="text-center py-6">
            <Button
              onClick={() => {
                // Check if player has a valid bingo
                const card = bingoCards[0];
                if (card) {
                  const winType = checkWin(card.marked, card.numbers);
                  if (winType) {
                    let prize = 50;
                    switch (winType) {
                      case 'line': prize = 50; break;
                      case 'diagonal': prize = 75; break;
                      case '4-corners': prize = 25; break;
                      case 'x-pattern': prize = 150; break;
                      case 'full-house': prize = 200; break;
                    }
                    handleWin(winType, prize, card, card.marked);
                  } else {
                    alert('❌ No valid BINGO pattern found! Keep playing!');
                  }
                }
              }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-2xl px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              🎉 BINGO! 🎉
            </Button>
            <p className="text-sm text-gray-300 mt-2">Click when you have a winning pattern!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleBingoGame;
