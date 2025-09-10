import { useState, useCallback } from 'react';
import { BingoCard, GameState, Player, PowerUp, GameRoom } from '@/types/game';

export const useBingoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: null,
    playerCards: [],
    calledNumbers: [],
    gameStarted: false,
    gameEnded: false,
    winner: null,
    powerUps: []
  });

  const [player, setPlayer] = useState<Player>({
    id: '1',
    username: 'Player1',
    balance: 100.00,
    wins: 0,
    gamesPlayed: 0
  });

  const generateBingoCard = useCallback((): BingoCard => {
    const numbers: number[][] = [];
    const marked: boolean[][] = [];
    
    for (let col = 0; col < 5; col++) {
      const colNumbers: number[] = [];
      const colMarked: boolean[] = [];
      const min = col * 15 + 1;
      const max = col * 15 + 15;
      const used = new Set<number>();
      
      for (let row = 0; row < 5; row++) {
        if (row === 2 && col === 2) {
          colNumbers.push(0); // FREE space
          colMarked.push(true);
        } else {
          let num;
          do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (used.has(num));
          used.add(num);
          colNumbers.push(num);
          colMarked.push(false);
        }
      }
      numbers.push(colNumbers);
      marked.push(colMarked);
    }

    // Transpose to get row-major order
    const transposedNumbers = numbers[0].map((_, i) => numbers.map(row => row[i]));
    const transposedMarked = marked[0].map((_, i) => marked.map(row => row[i]));

    return {
      id: Math.random().toString(36).substr(2, 9),
      numbers: transposedNumbers,
      marked: transposedMarked,
      userId: player.id
    };
  }, [player.id]);

  const markNumber = useCallback((cardId: string, row: number, col: number) => {
    setGameState(prev => ({
      ...prev,
      playerCards: prev.playerCards.map(card =>
        card.id === cardId
          ? {
              ...card,
              marked: card.marked.map((r, rIdx) =>
                rIdx === row
                  ? r.map((c, cIdx) => cIdx === col ? true : c)
                  : r
              )
            }
          : card
      )
    }));
  }, []);

  return {
    gameState,
    setGameState,
    player,
    setPlayer,
    generateBingoCard,
    markNumber
  };
};