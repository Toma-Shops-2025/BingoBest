import { useState, useEffect } from 'react';

interface BingoGameState {
  gameStatus: 'waiting' | 'playing' | 'finished';
  currentNumber: number | null;
  calledNumbers: number[];
  gameTimer: number;
}

export function useBingoGame() {
  const [gameState, setGameState] = useState<BingoGameState>({
    gameStatus: 'waiting',
    currentNumber: null,
    calledNumbers: [],
    gameTimer: 300
  });

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      calledNumbers: [],
      currentNumber: null,
      gameTimer: 300
    }));
  };

  const callNumber = () => {
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(num => !gameState.calledNumbers.includes(num));
    
    if (availableNumbers.length === 0) return;

    const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    
    setGameState(prev => ({
      ...prev,
      currentNumber: randomNumber,
      calledNumbers: [...prev.calledNumbers, randomNumber]
    }));
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'finished'
    }));
  };

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.gameTimer > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, gameTimer: prev.gameTimer - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.gameStatus === 'playing' && gameState.gameTimer === 0) {
      endGame();
    }
  }, [gameState.gameStatus, gameState.gameTimer]);

  return {
    gameState,
    startGame,
    callNumber,
    endGame
  };
}