export interface BingoNumber {
  value: number;
  called: boolean;
}

export interface BingoCard {
  id: string;
  numbers: number[][];
  marked: boolean[][];
  userId: string;
}

export interface GameRoom {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  prizePool: number;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
}

export interface Player {
  id: string;
  username: string;
  avatar?: string;
  balance: number;
  wins: number;
  gamesPlayed: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'auto_daub' | 'extra_ball' | 'peek_next' | 'double_prize';
}

export interface GameState {
  currentRoom: GameRoom | null;
  playerCards: BingoCard[];
  calledNumbers: number[];
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  powerUps: PowerUp[];
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: number;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'active' | 'completed';
  rounds: TournamentRound[];
  winners: Player[];
  format: 'single_elimination' | 'double_elimination' | 'round_robin';
}

export interface TournamentRound {
  id: string;
  roundNumber: number;
  matches: TournamentMatch[];
  status: 'pending' | 'active' | 'completed';
}

export interface TournamentMatch {
  id: string;
  player1: Player;
  player2: Player;
  winner?: Player;
  gameRoom: GameRoom;
  status: 'pending' | 'active' | 'completed';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'wins' | 'games' | 'money' | 'special';
  requirement: number;
  reward: number;
  unlocked: boolean;
  progress: number;
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  requirement: number;
  reward: number;
  progress: number;
  completed: boolean;
  expiresAt: Date;
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'playing';
  lastSeen: Date;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  rewards: EventReward[];
  active: boolean;
}

export interface EventReward {
  id: string;
  name: string;
  description: string;
  requirement: string;
  reward: number;
  claimed: boolean;
}

export interface VIPBenefit {
  id: string;
  name: string;
  description: string;
  tier: number;
  active: boolean;
}

export interface ChatEmote {
  id: string;
  name: string;
  image: string;
  category: 'happy' | 'sad' | 'excited' | 'angry' | 'special';
}