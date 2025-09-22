import React, { useState, useEffect, useRef } from 'react';
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
  onPatternCompleted?: (pattern: string, score: number) => void;
  onNumberCalled?: (number: number) => void;
  onScoreUpdate?: (score: number) => void;
  autoStart?: boolean;
  gameName?: string;
  gameId?: string;
  gameType?: 'bingo' | 'tournament';
}

const SimpleBingoGame: React.FC<SimpleBingoGameProps> = ({ onWin, onGameEnd, onPatternCompleted, onNumberCalled, onScoreUpdate, autoStart = false, gameName = 'Speed Bingo', gameId, gameType = 'bingo' }) => {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([]);
  const [gameTimer, setGameTimer] = useState(120); // 2 minutes
  const [error, setError] = useState<string | null>(null);
  const [autoCallInterval, setAutoCallInterval] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [powerUps, setPowerUps] = useState<{[key: string]: number}>({
    'wildcard': 0,
    'multiplier': 0,
    'timefreeze': 0,
    'lucky': 0
  });
  const [activePowerUps, setActivePowerUps] = useState<{[key: string]: boolean}>({});
  const [successfulDaubs, setSuccessfulDaubs] = useState(0);
  const [successfulMarks, setSuccessfulMarks] = useState(0);
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [powerUpMeter, setPowerUpMeter] = useState(0); // 0-3, fills 1/3 per daub
  
  // Use ref to track game status for immediate access
  const gameStatusRef = useRef<'waiting' | 'playing' | 'finished'>('waiting');

  const letters = ['B', 'I', 'N', 'G', 'O'];

  // Get background image based on game type and ID
  const getBackgroundImage = () => {
    if (gameType === 'tournament' && gameId) {
      // Tournament backgrounds
      const tournamentBackgrounds: Record<string, string> = {
        'hourly-blast': '/tournament-hourly-blast.png',
        'quick-strike': '/tournament-quick-strike.jpg',
        'daily-championship': '/tournament-daily-championship.jpg',
        'mega-jackpot': '/tournament-mega-jackpot.jpg'
      };
      return tournamentBackgrounds[gameId] || '/bingocard-background.jpg';
    } else if (gameType === 'bingo' && gameId) {
      // Game room backgrounds
      const gameRoomBackgrounds: Record<string, string> = {
        'speed-bingo': '/game-speed-bingo.jpg',
        'classic-bingo': '/game-classic-bingo.png',
        'high-stakes-arena': '/game-high-stakes-arena.jpg',
        'daily-tournament': '/game-daily-tournament.jpg',
        'weekly-championship': '/game-weekly-championship.jpg'
      };
      return gameRoomBackgrounds[gameId] || '/bingocard-background.jpg';
    }
    // Default background
    return '/bingocard-background.jpg';
  };

  // Power-up functions
  const usePowerUp = (type: string) => {
    if (powerUps[type] <= 0) return;
    
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    setActivePowerUps(prev => ({ ...prev, [type]: true }));
    
    switch (type) {
      case 'wildcard':
        // Allow player to mark any number as called
        console.log('🎯 Wildcard activated! Click any number to mark it as called!');
        break;
      case 'multiplier':
        // Double points for next pattern
        console.log('🎯 2x Multiplier activated! Next pattern gives double points!');
        break;
      case 'timefreeze':
        // Add 10 seconds to timer
        setGameTimer(prev => prev + 10);
        console.log('🎯 Time Freeze! +10 seconds added to timer!');
        break;
      case 'lucky':
        // Next number called will be a lucky number (guaranteed to be on card)
        console.log('🎯 Lucky Number activated! Next number will definitely be on your card!');
        break;
    }
    
    // Deactivate power-up after duration
    setTimeout(() => {
      setActivePowerUps(prev => ({ ...prev, [type]: false }));
    }, 10000); // 10 seconds duration
  };

  // Award power-ups automatically
  const awardRandomPowerUp = () => {
    const powerUpTypes = Object.keys(powerUps);
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    setPowerUps(prev => ({ ...prev, [randomType]: prev[randomType] + 1 }));
    console.log(`🎁 Power-up earned: ${randomType.toUpperCase()}!`);
  };

  // Audio functions
  const playNumberCallSound = (number: number) => {
    if (!audioEnabled) return;
    
    try {
      // Try to play specific number voice audio file
      const audio = new Audio(`/audio/numbers/bingo-${number}.mp3`);
      audio.volume = 0.88; // Increased by 10% (was 0.8)
      audio.play().catch((error) => {
        console.warn('Number audio failed, using fallback:', error);
        // Fallback to generic beep if specific audio not found
        const beepAudio = new Audio('/audio/beep.mp3');
        beepAudio.volume = 0.88; // Increased by 10% (was 0.8)
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
    
    // Show notification (with error handling)
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`Bingo Number Called!`, {
            body: announcement,
            icon: '/icon-192x192.png'
          });
        }
      }
    } catch (error) {
      console.warn('Notification failed:', error);
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
    if (gameStatusRef.current !== 'playing') {
      console.log('🎯 Cannot call number - game not playing. Status:', gameStatusRef.current);
      return;
    }
    
    // Additional safety checks
    if (typeof window === 'undefined') {
      console.warn('🎯 Window not available, skipping number call');
      return;
    }

    
    // Use a callback to get the most current calledNumbers state
    setCalledNumbers(prevCalledNumbers => {
      const availableNumbers = [];
      for (let i = 1; i <= 75; i++) {
        if (!prevCalledNumbers.includes(i)) {
          availableNumbers.push(i);
        }
      }
      
      if (availableNumbers.length === 0) {
        console.log('🎯 All numbers called - game finished');
        setGameStatus('finished');
        onGameEnd();
        return prevCalledNumbers;
      }
      
      const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      console.log(`🎯 CALLING NUMBER: ${randomNumber} (${getLetter(randomNumber)}-${randomNumber})`);
      
      setCurrentNumber(randomNumber);
      
      // Notify parent component of number called
      if (onNumberCalled) {
        onNumberCalled(randomNumber);
      }
      
      // Enhanced number announcement with visual and audio feedback
      announceNumber(randomNumber);
      
      // Update bingo cards with the called number
      setBingoCards(prev => prev.map(card => {
        const newNumbers = card.numbers.map(column => 
          column.map(cell => ({
            ...cell,
            called: cell.number === randomNumber ? true : cell.called
          }))
        );
        
        // Manual marking required for all platforms - no auto-daubing
        let newMarked = card.marked;
        console.log(`🎯 Manual marking required for ${randomNumber}`);
        
        // Check for win patterns (manual marking only)
        const winType = checkWin(newMarked, newNumbers);
        if (winType) {
          let points = 0;
          switch (winType) {
            case 'line':
              points = 125000; // 25,000 * 5 (reduced by half)
              break;
            case 'diagonal':
              points = 250000; // 50,000 * 5 (reduced by half)
              break;
            case '4-corners':
              points = 50000; // 10,000 * 5 (reduced by half)
              break;
            case 'x-pattern':
              points = 500000; // 100,000 * 5 (reduced by half)
              break;
            case 'full-house':
              points = 2500000; // 500,000 * 5 (reduced by half)
              break;
          }
          
          console.log(`🎯 WIN DETECTED: ${winType} - Points: ${points}`);
          
          // Apply multiplier if active
          let finalPoints = points;
          if (activePowerUps.multiplier) {
            finalPoints = points * 2;
            console.log(`🎯 Multiplier active! ${points} x 2 = ${finalPoints} points!`);
            // Deactivate multiplier after use
            setActivePowerUps(prev => ({ ...prev, multiplier: false }));
          }
          
          // Add points to score
          setPlayerScore(prev => {
            const newScore = prev + finalPoints;
            console.log(`🎯 Pattern detected: ${winType} - +${finalPoints} points!`);
            
            // Notify parent component of score update
            if (onScoreUpdate) {
              onScoreUpdate(newScore);
            }
            
            return newScore;
          });
          
          // Track successful daub
          setSuccessfulDaubs(prev => prev + 1);
          
          // Notify parent component of pattern completion
          if (onPatternCompleted) {
            onPatternCompleted(winType, finalPoints);
          }
          
          // Pattern completion notification removed to prevent spam
          
          return { ...card, numbers: newNumbers, marked: newMarked, completed: true };
        }
        
        return { ...card, numbers: newNumbers, marked: newMarked };
      }));
      
      return [...prevCalledNumbers, randomNumber];
    });
  };

  // Mark a number on a card
  const markNumber = async (cardId: string, row: number, col: number) => {
    if (gameStatusRef.current !== 'playing') return;
    
            // Check if wildcard is active - allow marking any number
            if (activePowerUps.wildcard) {
              console.log('🎯 Wildcard active - marking number as called');
              // Mark the number as called regardless of whether it was actually called
              setBingoCards(prev => prev.map(card => {
                if (card.id === cardId) {
                  const newMarked = [...card.marked];
                  newMarked[row][col] = !newMarked[row][col];
                  return { ...card, marked: newMarked };
                }
                return card;
              }));
              
              // Track successful mark for power-up meter
              setPowerUpMeter(prev => {
                const newMeter = prev + 1;
                if (newMeter >= 3) {
                  awardRandomPowerUp();
                  return 0; // Reset meter
                }
                return newMeter;
              });
              return;
            }
    
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
              console.log(`❌ Number ${cellNumber} hasn't been called yet!`);
              return card;
            }
            
            newMarked[row][col] = !newMarked[row][col];
            
            // Award points for successful mark (automatic scoring)
            const markPoints = 500; // Base points for marking a number
            setPlayerScore(prev => {
              const newScore = prev + markPoints;
              console.log(`🎯 Number marked: +${markPoints} points! New score: ${newScore}`);
              
              // Notify parent component of score update
              if (onScoreUpdate) {
                onScoreUpdate(newScore);
              }
              
              return newScore;
            });
            
            // Check for win
            const winType = checkWin(newMarked, card.numbers);
            if (winType) {
              let points = 0;
              switch (winType) {
                case 'line':
                  points = 125000; // 25,000 * 5 (reduced by half)
                  break;
                case 'diagonal':
                  points = 250000; // 50,000 * 5 (reduced by half)
                  break;
                case '4-corners':
                  points = 50000; // 10,000 * 5 (reduced by half)
                  break;
                case 'x-pattern':
                  points = 500000; // 100,000 * 5 (reduced by half)
                  break;
                case 'full-house':
                  points = 2500000; // 500,000 * 5 (reduced by half)
                  break;
              }
              
              // Apply multiplier if active
              let finalPoints = points;
              if (activePowerUps.multiplier) {
                finalPoints = points * 2;
                console.log(`🎯 Multiplier active! ${points} x 2 = ${finalPoints} points!`);
                // Deactivate multiplier after use
                setActivePowerUps(prev => ({ ...prev, multiplier: false }));
              }
              
              // Add points to score
              setPlayerScore(prev => {
                const newScore = prev + finalPoints;
                console.log(`🎯 Pattern detected: ${winType} - +${finalPoints} points!`);
                
                // Notify parent component of score update
                if (onScoreUpdate) {
                  onScoreUpdate(newScore);
                }
                
                return newScore;
              });
              
              // Track successful daub
              setSuccessfulDaubs(prev => prev + 1);
              
              // Notify parent component of pattern completion
              if (onPatternCompleted) {
                onPatternCompleted(winType, finalPoints);
              }
              
              // Pattern completion notification removed to prevent spam
              
              return { ...card, marked: newMarked, completed: true };
            }
            
            return { ...card, marked: newMarked };
          }
        }
        return card;
      }));
      
      // Track successful mark for power-up meter
      setPowerUpMeter(prev => {
        const newMeter = prev + 1;
        if (newMeter >= 3) {
          awardRandomPowerUp();
          return 0; // Reset meter
        }
        return newMeter;
      });
    } catch (error) {
      console.error('Error marking number:', error);
      setError('Failed to mark number');
    }
  };

  // Handle win asynchronously
  const handleWin = async (winType: string, prize: number, card: BingoCard, newMarked: boolean[][]) => {
    try {
      // Always pay out legitimate wins - bypass financial safety for now
      // TODO: Implement proper financial safety checks in production
      console.log(`🎉 Congratulations! You won ${winType} and earned $${prize}!`);
      
      // Play bingo win sound
      playBingoSound();
      onWin(winType, prize);
      
      // End the game after a win
      setTimeout(() => {
        onGameEnd();
      }, 2000); // Show win message for 2 seconds then end game
    } catch (error) {
      console.error('Error processing win:', error);
      // Still show win message even if payout fails
      console.log(`🎉 Congratulations! You won ${winType}!\n\nYour prize of $${prize} is being processed and will be added to your account shortly. Please check your balance in a few moments.\n\nThank you for playing!`);
      // Still end the game even if there's an error
      setTimeout(() => {
        onGameEnd();
      }, 2000);
    }
  };

  // Check for winning patterns
  const checkWin = (marked: boolean[][], numbers: BingoNumber[][]) => {
    try {
      console.log('🎯 Checking win patterns...');
      console.log('🎯 Marked array:', marked);
      
      // Debug: Print the marked array structure
      for (let i = 0; i < marked.length; i++) {
        console.log(`🎯 Row ${i}:`, marked[i]);
      }
      
      // Check rows
      for (let row = 0; row < 5; row++) {
        if (marked[row] && marked[row].every(cell => cell)) {
          console.log(`🎯 Row ${row} is complete!`);
          return 'line';
        }
      }
      
      // Check columns
      for (let col = 0; col < 5; col++) {
        let columnComplete = true;
        for (let row = 0; row < 5; row++) {
          if (!marked[row] || !marked[row][col]) {
            columnComplete = false;
            break;
          }
        }
        if (columnComplete) {
          console.log(`🎯 Column ${col} is complete!`);
          return 'line';
        }
      }
      
      // Check diagonals
      // Main diagonal (top-left to bottom-right)
      let mainDiagonalComplete = true;
      for (let i = 0; i < 5; i++) {
        if (!marked[i] || !marked[i][i]) {
          mainDiagonalComplete = false;
          break;
        }
      }
      if (mainDiagonalComplete) {
        console.log('🎯 Main diagonal is complete!');
        return 'diagonal';
      }
      
      // Anti-diagonal (top-right to bottom-left)
      let antiDiagonalComplete = true;
      for (let i = 0; i < 5; i++) {
        if (!marked[i] || !marked[i][4-i]) {
          antiDiagonalComplete = false;
          break;
        }
      }
      if (antiDiagonalComplete) {
        console.log('🎯 Anti-diagonal is complete!');
        return 'diagonal';
      }
      
      // Check 4 corners
      if (marked[0] && marked[4]) {
        if (marked[0][0] && marked[0][4] && marked[4][0] && marked[4][4]) {
          console.log('🎯 4 corners are complete!');
          return '4-corners';
        }
      }
      
      // Check X pattern (both diagonals)
      if (mainDiagonalComplete && antiDiagonalComplete) {
        console.log('🎯 X pattern is complete!');
          return 'x-pattern';
      }
      
      // Check full house
      let fullHouseComplete = true;
      for (let row = 0; row < 5; row++) {
        if (!marked[row] || !marked[row].every(cell => cell)) {
          fullHouseComplete = false;
          break;
        }
      }
      if (fullHouseComplete) {
        console.log('🎯 Full house is complete!');
        return 'full-house';
      }
      
      console.log('🎯 No winning pattern found');
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
      
      // Set game status to playing FIRST (both state and ref)
      setGameStatus('playing');
      gameStatusRef.current = 'playing';
      console.log('🎯 Game status set to playing');
      
      setCalledNumbers([]);
      setCurrentNumber(null);
      setBingoCards([generateBingoCard()]);
      setGameTimer(120);
      
      // Start with no power-ups
      setPowerUps({
        'wildcard': 0,
        'multiplier': 0,
        'timefreeze': 0,
        'lucky': 0
      });
      setPowerUpMeter(0); // Reset power-up meter
      
      // Reset successful daubs counter
      setSuccessfulDaubs(0);
      setSuccessfulMarks(0);
      setPowerUpTimer(0);
      
      // Clear any existing interval
      if (autoCallInterval) {
        window.clearInterval(autoCallInterval);
        setAutoCallInterval(null);
      }
      
      // Start automatic number calling every 3 seconds (slower pace)
      const interval = window.setInterval(() => {
        console.log('🎯 Interval triggered - calling number...');
        callNumber();
      }, 3000);
      setAutoCallInterval(interval);
      
      // Start the first number call after 2 seconds
      setTimeout(() => {
        console.log('🎯 First number call (2 second delay)');
        callNumber();
      }, 2000);
      
      console.log('🎯 BINGO GAME STARTED - Numbers will be called every 3 seconds');
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
    gameStatusRef.current = 'finished';
    console.log(`🎯 Game ended with final score: ${playerScore}`);
    
    // Show final score in console
    console.log(`🎯 GAME OVER!\n\nFinal Score: ${playerScore.toLocaleString()} points!\n\nGreat job!`);
    
    // Call onGameEnd to show results screen
    setTimeout(() => {
    onGameEnd();
    }, 2000); // Wait 2 seconds to show the alert
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

  // Power-up meter is now handled in markNumber function

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
    <div 
      className="space-y-6 min-h-screen p-4"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Semi-transparent overlay for better content readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      
      {/* Game content with relative positioning */}
      <div className="relative z-10">
      {/* Game Header */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{gameName}</span>
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
              <h3 className="text-xl font-semibold mb-4">Ready to Play {gameName}?</h3>
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
                      {Array.from({ length: 5 }, (_, rowIndex) => 
                        Array.from({ length: 5 }, (_, colIndex) => {
                          const cell = card.numbers[colIndex][rowIndex];
                          return (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                            className={`
                              bingo-number aspect-square border-2 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 shadow-lg
                                ${card.marked[rowIndex] && card.marked[rowIndex][colIndex] ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-400/50' : ''}
                                ${!card.marked[rowIndex] || !card.marked[rowIndex][colIndex] ? (cell.called ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-black shadow-yellow-400/50' : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400 text-white shadow-blue-500/50') : ''}
                              ${cell.number === 0 ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white font-bold shadow-green-400/50' : ''}
                              hover:scale-105 hover:shadow-xl
                            `}
                            onClick={() => markNumber(card.id, rowIndex, colIndex)}
                              title={`${cell.letter}-${cell.number} (${cell.called ? 'Called' : 'Not Called'})`}
                          >
                            {cell.number === 0 ? 'FREE' : cell.number}
                          </div>
                          );
                        })
                      )}
            </div>
          </CardContent>
        </Card>
      ))}
      

      {/* Power-ups Display - Compact */}
      {gameStatus === 'playing' && (
        <Card className="casino-card mb-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-yellow-400 font-bold text-sm">🎁 Power-ups</h3>
              <div className="text-xs text-gray-300">
                Meter: {powerUpMeter}/3
              </div>
            </div>
            {/* Power-up meter visualization */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(powerUpMeter / 3) * 100}%` }}
              ></div>
            </div>
            <div className="flex gap-1 mb-2">
              {Object.entries(powerUps).map(([type, count]) => (
            <Button
                  key={type}
                  onClick={() => usePowerUp(type)}
                  disabled={count <= 0}
                  className={`text-xs px-2 py-1 h-8 min-w-0 flex-1 ${
                    count > 0 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-sm">
                      {type === 'wildcard' && '🎯'}
                      {type === 'multiplier' && '⚡'}
                      {type === 'timefreeze' && '⏰'}
                      {type === 'lucky' && '🍀'}
                    </div>
                    <div className="text-xs font-bold">{count}</div>
                  </div>
            </Button>
              ))}
            </div>
            
            {/* Power-up Information */}
            <div className="mt-3 p-2 bg-black/20 rounded-lg">
              <div className="text-xs text-gray-300 mb-2">
                <strong className="text-yellow-400">How to Earn Power-ups:</strong>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>• Fill the meter by daubing numbers (1/3 per daub)</div>
                <div>• When meter is full, you get a random power-up!</div>
                <div>• Power-ups reset each game</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Power-up Guide - Show when game is waiting or finished */}
      {(gameStatus === 'waiting' || gameStatus === 'finished') && (
        <Card className="casino-card mb-4">
          <CardContent className="p-4">
            <h3 className="text-yellow-400 font-bold text-lg mb-4 flex items-center gap-2">
              🎁 Power-up System Guide
            </h3>
            
            <div className="space-y-4">
              {/* How to Earn */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                <h4 className="text-blue-400 font-bold text-sm mb-2">🎯 How to Earn Power-ups</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• <strong>Daub Numbers:</strong> Every time you mark a number on your bingo card, the power-up meter fills by 1/3</li>
                  <li>• <strong>Meter Full:</strong> When the meter reaches 3/3, you automatically receive one random power-up</li>
                  <li>• <strong>Reset:</strong> The meter resets to 0 after earning a power-up</li>
                  <li>• <strong>New Game:</strong> All power-ups reset when you start a new game</li>
                </ul>
              </div>

              {/* Power-up Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="text-green-400 font-bold text-sm">Wildcard</h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    <strong>Effect:</strong> Mark any number on your card as called, even if it hasn't been called yet!
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚡</span>
                    <h4 className="text-yellow-400 font-bold text-sm">Multiplier</h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    <strong>Effect:</strong> Double the points for your next pattern completion!
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⏰</span>
                    <h4 className="text-blue-400 font-bold text-sm">Time Freeze</h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    <strong>Effect:</strong> Add 10 seconds to the game timer for more time to play!
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🍀</span>
                    <h4 className="text-purple-400 font-bold text-sm">Lucky Number</h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    <strong>Effect:</strong> The next number called will definitely be on your bingo card!
                  </p>
                </div>
              </div>

              {/* Strategy Tips */}
              <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
                <h4 className="text-orange-400 font-bold text-sm mb-2">💡 Strategy Tips</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• <strong>Save Power-ups:</strong> Don't use them immediately - wait for the right moment!</li>
                  <li>• <strong>Wildcard:</strong> Use when you're close to completing a pattern</li>
                  <li>• <strong>Multiplier:</strong> Save for high-value patterns like Full House or Blackout</li>
                  <li>• <strong>Time Freeze:</strong> Use when you're running out of time but close to winning</li>
                  <li>• <strong>Lucky Number:</strong> Use when you want to guarantee the next number called will be on your card</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default SimpleBingoGame;
