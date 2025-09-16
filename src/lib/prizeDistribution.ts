// BingoBest Prize Distribution System
// Handles 90/10 split between Payout Account and BingoBest Account

export interface GameConfig {
  id: string;
  name: string;
  entryFee: number;
  minPlayers: number;
  maxPlayers: number;
  gameType: 'bingo' | 'tournament' | 'special';
  duration: number; // in minutes
}

export interface PrizeDistribution {
  totalEntryFees: number;
  bingoBestCut: number; // 10%
  payoutPool: number; // 90%
  firstPlace: number; // 60% of payout pool
  secondPlace: number; // 25% of payout pool
  thirdPlace: number; // 15% of payout pool
}

export interface Player {
  id: string;
  username: string;
  entryFee: number;
  position?: number;
  prize?: number;
}

export interface GameSession {
  id: string;
  gameConfig: GameConfig;
  players: Player[];
  prizeDistribution: PrizeDistribution;
  status: 'waiting' | 'playing' | 'finished';
  startTime?: Date;
  endTime?: Date;
}

// Game Configurations
export const GAME_CONFIGS: GameConfig[] = [
  {
    id: 'speed-bingo',
    name: 'Speed Bingo',
    entryFee: 2.00,
    minPlayers: 3,
    maxPlayers: 20,
    gameType: 'bingo',
    duration: 5
  },
  {
    id: 'classic-bingo',
    name: 'Classic Bingo',
    entryFee: 5.00,
    minPlayers: 5,
    maxPlayers: 30,
    gameType: 'bingo',
    duration: 10
  },
  {
    id: 'high-stakes-arena',
    name: 'High Stakes Arena',
    entryFee: 10.00,
    minPlayers: 8,
    maxPlayers: 50,
    gameType: 'bingo',
    duration: 15
  },
  {
    id: 'daily-tournament',
    name: 'Daily Tournament',
    entryFee: 8.00,
    minPlayers: 10,
    maxPlayers: 100,
    gameType: 'tournament',
    duration: 30
  },
  {
    id: 'weekly-championship',
    name: 'Weekly Championship',
    entryFee: 20.00,
    minPlayers: 20,
    maxPlayers: 200,
    gameType: 'tournament',
    duration: 60
  }
];

// Additional Player Generator for Low Traffic
export class AdditionalPlayerGenerator {
  private static playerNames = [
    'LuckyPlayer', 'BingoMaster', 'CardShark', 'NumberHunter',
    'QuickDraw', 'BingoPro', 'LuckyDuck', 'NumberNinja',
    'BingoKing', 'CardQueen', 'LuckyStar', 'BingoBoss',
    'NumberWizard', 'CardMaster', 'LuckyCharm', 'BingoBeast'
  ];

  static generateAdditionalPlayer(gameConfig: GameConfig): Player {
    const randomName = this.playerNames[Math.floor(Math.random() * this.playerNames.length)];
    const randomSuffix = Math.floor(Math.random() * 999) + 1;
    
    return {
      id: `player_${Date.now()}_${randomSuffix}`,
      username: `${randomName}${randomSuffix}`,
      entryFee: gameConfig.entryFee
    };
  }

  static generateAdditionalPlayers(count: number, gameConfig: GameConfig): Player[] {
    const players: Player[] = [];
    for (let i = 0; i < count; i++) {
      players.push(this.generateAdditionalPlayer(gameConfig));
    }
    return players;
  }
}

// Prize Distribution Calculator
export class PrizeDistributionCalculator {
  static calculatePrizeDistribution(players: Player[], gameConfig: GameConfig): PrizeDistribution {
    const totalEntryFees = players.reduce((sum, player) => sum + player.entryFee, 0);
    const bingoBestCut = totalEntryFees * 0.10; // 10% to BingoBest Account
    const payoutPool = totalEntryFees * 0.90; // 90% to Payout Account
    
    return {
      totalEntryFees,
      bingoBestCut,
      payoutPool,
      firstPlace: payoutPool * 0.60, // 60% of payout pool
      secondPlace: payoutPool * 0.25, // 25% of payout pool
      thirdPlace: payoutPool * 0.15  // 15% of payout pool
    };
  }

  static distributePrizes(players: Player[], prizeDistribution: PrizeDistribution): Player[] {
    // Sort players by performance (for now, random - in real game, by win time/score)
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    
    return shuffledPlayers.map((player, index) => {
      let prize = 0;
      let position = 0;
      
      if (index === 0) {
        prize = prizeDistribution.firstPlace;
        position = 1;
      } else if (index === 1) {
        prize = prizeDistribution.secondPlace;
        position = 2;
      } else if (index === 2) {
        prize = prizeDistribution.thirdPlace;
        position = 3;
      }
      
      return {
        ...player,
        position,
        prize
      };
    });
  }
}

// Game Session Manager
export class GameSessionManager {
  private static sessions: Map<string, GameSession> = new Map();

  static createGameSession(gameConfigId: string, realPlayers: Player[]): GameSession {
    const gameConfig = GAME_CONFIGS.find(config => config.id === gameConfigId);
    if (!gameConfig) {
      throw new Error(`Game config not found: ${gameConfigId}`);
    }

    // Check if we need additional players to meet minimum requirements
    const neededPlayers = gameConfig.minPlayers - realPlayers.length;
    let allPlayers = [...realPlayers];
    
    if (neededPlayers > 0) {
      const additionalPlayers = AdditionalPlayerGenerator.generateAdditionalPlayers(neededPlayers, gameConfig);
      allPlayers = [...realPlayers, ...additionalPlayers];
    }

    // Ensure we don't exceed max players
    if (allPlayers.length > gameConfig.maxPlayers) {
      allPlayers = allPlayers.slice(0, gameConfig.maxPlayers);
    }

    const prizeDistribution = PrizeDistributionCalculator.calculatePrizeDistribution(allPlayers, gameConfig);
    
    const session: GameSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameConfig,
      players: allPlayers,
      prizeDistribution,
      status: 'waiting'
    };

    this.sessions.set(session.id, session);
    return session;
  }

  static getGameSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  static startGame(sessionId: string): GameSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.status = 'playing';
    session.startTime = new Date();
    return session;
  }

  static finishGame(sessionId: string): GameSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.status = 'finished';
    session.endTime = new Date();
    
    // Distribute prizes
    session.players = PrizeDistributionCalculator.distributePrizes(session.players, session.prizeDistribution);
    
    return session;
  }

  static getAllSessions(): GameSession[] {
    return Array.from(this.sessions.values());
  }
}

// Crypto Integration for Prize Distribution
export class CryptoPrizeDistributor {
  // BingoBest Account - Your Bitcoin wallet (10% platform cut)
  private static bingoBestWallet = '19BgRYm2NZBzBdtwZFRogVSZhMCyXp2rck';
  // Payout Account - Your Ethereum wallet (90% player prizes)
  private static payoutWallet = '0x94476E0835bfA7F983aCa4090BF004994C9B38FA';

  static async distributePrizes(session: GameSession): Promise<{
    bingoBestTransfer: { amount: number; wallet: string };
    payoutTransfers: { playerId: string; amount: number; wallet: string }[];
  }> {
    const { prizeDistribution, players } = session;
    
    // Calculate BingoBest account transfer (10% cut)
    const bingoBestTransfer = {
      amount: prizeDistribution.bingoBestCut,
      wallet: this.bingoBestWallet
    };

    // Calculate individual player payouts
    const payoutTransfers = players
      .filter(player => player.prize && player.prize > 0)
      .map(player => ({
        playerId: player.id,
        amount: player.prize!,
        wallet: 'Player_Wallet_Address'
      }));

    return {
      bingoBestTransfer,
      payoutTransfers
    };
  }

  static async processCryptoTransfer(amount: number, fromWallet: string, toWallet: string): Promise<boolean> {
    // This would integrate with your crypto payment system
    // For now, return true as a placeholder
    console.log(`Transferring ${amount} from ${fromWallet} to ${toWallet}`);
    return true;
  }
}

// Revenue Analytics
export class RevenueAnalytics {
  static calculateDailyRevenue(sessions: GameSession[]): {
    totalRevenue: number;
    bingoBestRevenue: number;
    totalPayouts: number;
    netProfit: number;
  } {
    const today = new Date();
    const todaySessions = sessions.filter(session => 
      session.startTime && 
      session.startTime.toDateString() === today.toDateString()
    );

    const totalRevenue = todaySessions.reduce((sum, session) => 
      sum + session.prizeDistribution.totalEntryFees, 0
    );

    const bingoBestRevenue = todaySessions.reduce((sum, session) => 
      sum + session.prizeDistribution.bingoBestCut, 0
    );

    const totalPayouts = todaySessions.reduce((sum, session) => 
      sum + session.prizeDistribution.payoutPool, 0
    );

    const netProfit = bingoBestRevenue;

    return {
      totalRevenue,
      bingoBestRevenue,
      totalPayouts,
      netProfit
    };
  }

  static calculatePlayerStats(sessions: GameSession[]): {
    totalPlayers: number;
    averagePrize: number;
    totalPrizesPaid: number;
  } {
    const allPlayers = sessions.flatMap(session => session.players);
    
    const totalPrizesPaid = allPlayers.reduce((sum, player) => sum + (player.prize || 0), 0);
    const averagePrize = totalPrizesPaid / Math.max(allPlayers.length, 1);

    return {
      totalPlayers: allPlayers.length,
      averagePrize,
      totalPrizesPaid
    };
  }
}

// All exports are already defined above as individual exports
