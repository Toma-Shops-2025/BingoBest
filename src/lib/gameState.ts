// BingoBest Game State Management
// Centralized state management for all game functionality

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalWinnings: number;
  totalSpent: number;
  currentStreak: number;
  longestStreak: number;
  lastGameDate: Date | null;
  challengesCompleted: string[];
  achievementsUnlocked: string[];
  vipTier: number;
  vipPoints: number;
}

export interface ChallengeProgress {
  id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  lastUpdated: Date;
}

export interface GameSession {
  id: string;
  gameType: 'bingo' | 'tournament' | 'mini-game';
  entryFee: number;
  prizeWon: number;
  completed: boolean;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  current: number;
  completed: boolean;
  reward: number;
  claimed: boolean;
  category: 'games' | 'wins' | 'spending' | 'streak' | 'social';
}

export class GameStateManager {
  private static instance: GameStateManager;
  private playerStats: PlayerStats;
  private challengeProgress: Map<string, ChallengeProgress>;
  private gameSessions: GameSession[];
  private achievements: Achievement[];

  private constructor() {
    this.playerStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      totalWinnings: 0,
      totalSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastGameDate: null,
      challengesCompleted: [],
      achievementsUnlocked: [],
      vipTier: 0,
      vipPoints: 0
    };
    this.challengeProgress = new Map();
    this.gameSessions = [];
    this.achievements = this.initializeAchievements();
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  // Challenge Management
  initializeDailyChallenges(): ChallengeProgress[] {
    const challenges = [
      { id: 'daily-play-3', requirement: 3, reward: 5 },
      { id: 'daily-win-1', requirement: 1, reward: 10 },
      { id: 'daily-spend-10', requirement: 5, reward: 8 },
      { id: 'daily-streak', requirement: 3, reward: 20 }
    ];

    return challenges.map(challenge => {
      const existing = this.challengeProgress.get(challenge.id);
      if (existing) {
        return existing;
      }

      const progress: ChallengeProgress = {
        id: challenge.id,
        progress: 0,
        completed: false,
        claimed: false,
        lastUpdated: new Date()
      };

      this.challengeProgress.set(challenge.id, progress);
      return progress;
    });
  }

  updateChallengeProgress(challengeId: string, increment: number = 1): boolean {
    const challenge = this.challengeProgress.get(challengeId);
    if (!challenge) return false;

    challenge.progress += increment;
    challenge.lastUpdated = new Date();

    if (challenge.progress >= this.getChallengeRequirement(challengeId)) {
      challenge.completed = true;
      this.playerStats.challengesCompleted.push(challengeId);
      return true; // Challenge completed
    }

    return false; // Still in progress
  }

  claimChallengeReward(challengeId: string): number {
    const challenge = this.challengeProgress.get(challengeId);
    if (!challenge || !challenge.completed || challenge.claimed) return 0;

    challenge.claimed = true;
    const reward = this.getChallengeReward(challengeId);
    
    // Add to bonus balance (non-withdrawable)
    this.playerStats.totalWinnings += reward;
    
    return reward;
  }

  private getChallengeRequirement(challengeId: string): number {
    const requirements: Record<string, number> = {
      'daily-play-3': 3,
      'daily-win-1': 1,
      'daily-spend-10': 5,
      'daily-streak': 3
    };
    return requirements[challengeId] || 0;
  }

  private getChallengeReward(challengeId: string): number {
    const rewards: Record<string, number> = {
      'daily-play-3': 5,
      'daily-win-1': 10,
      'daily-spend-10': 8,
      'daily-streak': 20
    };
    return rewards[challengeId] || 0;
  }

  // Game Session Management
  startGameSession(gameType: 'bingo' | 'tournament' | 'mini-game', entryFee: number): string {
    const session: GameSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameType,
      entryFee,
      prizeWon: 0,
      completed: false,
      timestamp: new Date()
    };

    this.gameSessions.push(session);
    this.playerStats.totalSpent += entryFee;
    this.playerStats.gamesPlayed++;

    // Update challenge progress
    this.updateChallengeProgress('daily-play-3');
    this.updateChallengeProgress('daily-spend-10', entryFee);

    return session.id;
  }

  completeGameSession(sessionId: string, prizeWon: number, won: boolean): void {
    const session = this.gameSessions.find(s => s.id === sessionId);
    if (!session) return;

    session.completed = true;
    session.prizeWon = prizeWon;

    if (won) {
      this.playerStats.gamesWon++;
      this.playerStats.totalWinnings += prizeWon;
      this.playerStats.currentStreak++;
      this.playerStats.longestStreak = Math.max(this.playerStats.longestStreak, this.playerStats.currentStreak);
      
      // Update challenge progress
      this.updateChallengeProgress('daily-win-1');
    } else {
      this.playerStats.currentStreak = 0;
    }

    this.playerStats.lastGameDate = new Date();
    this.checkAchievements();
  }

  // Achievement System
  private initializeAchievements(): Achievement[] {
    return [
      {
        id: 'first-game',
        name: 'First Steps',
        description: 'Play your first game',
        requirement: 1,
        current: 0,
        completed: false,
        reward: 10,
        claimed: false,
        category: 'games'
      },
      {
        id: 'first-win',
        name: 'Winner',
        description: 'Win your first game',
        requirement: 1,
        current: 0,
        completed: false,
        reward: 25,
        claimed: false,
        category: 'wins'
      },
      {
        id: 'games-10',
        name: 'Regular Player',
        description: 'Play 10 games',
        requirement: 10,
        current: 0,
        completed: false,
        reward: 50,
        claimed: false,
        category: 'games'
      },
      {
        id: 'wins-5',
        name: 'Lucky Streak',
        description: 'Win 5 games',
        requirement: 5,
        current: 0,
        completed: false,
        reward: 100,
        claimed: false,
        category: 'wins'
      },
      {
        id: 'streak-3',
        name: 'Hot Streak',
        description: 'Win 3 games in a row',
        requirement: 3,
        current: 0,
        completed: false,
        reward: 75,
        claimed: false,
        category: 'streak'
      }
    ];
  }

  private checkAchievements(): void {
    this.achievements.forEach(achievement => {
      if (achievement.completed || achievement.claimed) return;

      switch (achievement.id) {
        case 'first-game':
          achievement.current = this.playerStats.gamesPlayed;
          break;
        case 'first-win':
          achievement.current = this.playerStats.gamesWon;
          break;
        case 'games-10':
          achievement.current = this.playerStats.gamesPlayed;
          break;
        case 'wins-5':
          achievement.current = this.playerStats.gamesWon;
          break;
        case 'streak-3':
          achievement.current = this.playerStats.currentStreak;
          break;
      }

      if (achievement.current >= achievement.requirement) {
        achievement.completed = true;
        this.playerStats.achievementsUnlocked.push(achievement.id);
      }
    });
  }

  claimAchievement(achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || !achievement.completed || achievement.claimed) return 0;

    achievement.claimed = true;
    this.playerStats.totalWinnings += achievement.reward;
    
    return achievement.reward;
  }

  // VIP System
  updateVIPStatus(): void {
    const gamesPlayed = this.playerStats.gamesPlayed;
    let newTier = 0;
    let newPoints = 0;

    if (gamesPlayed >= 50) { newTier = 5; newPoints = gamesPlayed - 50; }
    else if (gamesPlayed >= 30) { newTier = 4; newPoints = gamesPlayed - 30; }
    else if (gamesPlayed >= 20) { newTier = 3; newPoints = gamesPlayed - 20; }
    else if (gamesPlayed >= 10) { newTier = 2; newPoints = gamesPlayed - 10; }
    else if (gamesPlayed >= 5) { newTier = 1; newPoints = gamesPlayed - 5; }

    this.playerStats.vipTier = newTier;
    this.playerStats.vipPoints = newPoints;
  }

  // Getters
  getPlayerStats(): PlayerStats {
    return { ...this.playerStats };
  }

  getChallengeProgress(): ChallengeProgress[] {
    return Array.from(this.challengeProgress.values());
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getGameSessions(): GameSession[] {
    return [...this.gameSessions];
  }

  // Reset for new day
  resetDailyChallenges(): void {
    this.challengeProgress.clear();
    this.initializeDailyChallenges();
  }
}

// Lazy initialization to avoid circular dependency issues
let _gameState: GameStateManager | null = null;

export const getGameState = () => {
  if (!_gameState) {
    _gameState = GameStateManager.getInstance();
  }
  return _gameState;
};

// For backward compatibility
export const gameState = getGameState();
