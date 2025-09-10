import { BingoCard } from '@/types/game';

export const checkWin = (card: BingoCard): boolean => {
  const { marked } = card;
  
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (marked[row].every(cell => cell)) {
      return true;
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    if (marked.every(row => row[col])) {
      return true;
    }
  }
  
  // Check diagonals
  const diagonal1 = marked.every((row, index) => row[index]);
  const diagonal2 = marked.every((row, index) => row[4 - index]);
  
  return diagonal1 || diagonal2;
};

export const checkFullHouse = (card: BingoCard): boolean => {
  return card.marked.every(row => row.every(cell => cell));
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getBingoColumn = (number: number): string => {
  if (number >= 1 && number <= 15) return 'B';
  if (number >= 16 && number <= 30) return 'I';
  if (number >= 31 && number <= 45) return 'N';
  if (number >= 46 && number <= 60) return 'G';
  if (number >= 61 && number <= 75) return 'O';
  return '';
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculatePrizePool = (entryFee: number, playerCount: number): number => {
  return entryFee * playerCount * 0.9; // 10% house edge
};

export const getWinningPattern = (card: BingoCard): string => {
  const { marked } = card;
  
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (marked[row].every(cell => cell)) {
      return `Row ${row + 1}`;
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    if (marked.every(row => row[col])) {
      const columns = ['B', 'I', 'N', 'G', 'O'];
      return `Column ${columns[col]}`;
    }
  }
  
  // Check diagonals
  if (marked.every((row, index) => row[index])) {
    return 'Diagonal (Top-Left to Bottom-Right)';
  }
  
  if (marked.every((row, index) => row[4 - index])) {
    return 'Diagonal (Top-Right to Bottom-Left)';
  }
  
  if (checkFullHouse(card)) {
    return 'Full House';
  }
  
  return 'No Win';
};