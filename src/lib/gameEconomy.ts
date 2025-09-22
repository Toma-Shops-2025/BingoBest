// Game Economy System
// Handles deposits, entry fees, prize pools, and winnings

export interface GameSession {
  id: string;
  playerId: string;
  entryFee: number;
  prizePool: number;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  winner?: string;
  prizeAmount?: number;
}

export interface PlayerAccount {
  id: string;
  balance: number;
  totalDeposited: number;
  totalWinnings: number;
  totalFeesPaid: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface BingoBestAccount {
  totalFeesCollected: number;
  totalPrizesPaid: number;
  netProfit: number;
  activeGames: number;
}

class GameEconomy {
  private playerAccounts: Map<string, PlayerAccount> = new Map();
  private bingoBestAccount: BingoBestAccount = {
    totalFeesCollected: 0,
    totalPrizesPaid: 0,
    netProfit: 0,
    activeGames: 0
  };
  private gameSessions: Map<string, GameSession> = new Map();

  // Player Account Management
  createPlayerAccount(playerId: string, initialBalance: number = 0): PlayerAccount {
    const account: PlayerAccount = {
      id: playerId,
      balance: initialBalance,
      totalDeposited: 0,
      totalWinnings: 0,
      totalFeesPaid: 0,
      gamesPlayed: 0,
      gamesWon: 0
    };
    this.playerAccounts.set(playerId, account);
    return account;
  }

  getPlayerAccount(playerId: string): PlayerAccount | null {
    return this.playerAccounts.get(playerId) || null;
  }

  // Deposit Management
  processDeposit(playerId: string, amount: number): boolean {
    const account = this.getPlayerAccount(playerId);
    if (!account) {
      console.error('Player account not found:', playerId);
      return false;
    }

    if (amount <= 0) {
      console.error('Invalid deposit amount:', amount);
      return false;
    }

    // Add to player balance
    account.balance += amount;
    account.totalDeposited += amount;

    console.log(`💰 Deposit processed: Player ${playerId} deposited $${amount.toFixed(2)}`);
    console.log(`💰 New balance: $${account.balance.toFixed(2)}`);
    
    return true;
  }

  // Game Entry Fee Management
  processEntryFee(playerId: string, entryFee: number): boolean {
    const account = this.getPlayerAccount(playerId);
    if (!account) {
      console.error('Player account not found:', playerId);
      return false;
    }

    if (account.balance < entryFee) {
      console.error('Insufficient funds for entry fee:', {
        playerId,
        balance: account.balance,
        entryFee
      });
      return false;
    }

    // Deduct entry fee from player
    account.balance -= entryFee;
    account.totalFeesPaid += entryFee;
    account.gamesPlayed += 1;

    // Add fee to BingoBest account
    this.bingoBestAccount.totalFeesCollected += entryFee;
    this.bingoBestAccount.netProfit += entryFee;
    this.bingoBestAccount.activeGames += 1;

    console.log(`🎮 Entry fee processed: Player ${playerId} paid $${entryFee.toFixed(2)}`);
    console.log(`🎮 New balance: $${account.balance.toFixed(2)}`);
    console.log(`🎮 BingoBest collected: $${this.bingoBestAccount.totalFeesCollected.toFixed(2)}`);
    
    return true;
  }

  // Prize Pool Management
  createGameSession(playerId: string, entryFee: number): GameSession | null {
    const account = this.getPlayerAccount(playerId);
    if (!account) {
      console.error('Player account not found:', playerId);
      return null;
    }

    // Process entry fee
    if (!this.processEntryFee(playerId, entryFee)) {
      return null;
    }

    const session: GameSession = {
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      entryFee,
      prizePool: entryFee, // Prize pool starts with entry fee
      startTime: new Date(),
      status: 'active'
    };

    this.gameSessions.set(session.id, session);
    console.log(`🎯 Game session created: ${session.id} with prize pool $${session.prizePool.toFixed(2)}`);
    
    return session;
  }

  // Prize Distribution
  processWin(gameSessionId: string, prizeAmount: number): boolean {
    const session = this.gameSessions.get(gameSessionId);
    if (!session) {
      console.error('Game session not found:', gameSessionId);
      return false;
    }

    if (session.status !== 'active') {
      console.error('Game session not active:', gameSessionId);
      return false;
    }

    const account = this.getPlayerAccount(session.playerId);
    if (!account) {
      console.error('Player account not found:', session.playerId);
      return false;
    }

    // Add prize to player account
    account.balance += prizeAmount;
    account.totalWinnings += prizeAmount;
    account.gamesWon += 1;

    // Update BingoBest account
    this.bingoBestAccount.totalPrizesPaid += prizeAmount;
    this.bingoBestAccount.netProfit -= prizeAmount;
    this.bingoBestAccount.activeGames -= 1;

    // Update game session
    session.endTime = new Date();
    session.status = 'completed';
    session.winner = session.playerId;
    session.prizeAmount = prizeAmount;

    console.log(`🏆 Prize awarded: Player ${session.playerId} won $${prizeAmount.toFixed(2)}`);
    console.log(`🏆 New balance: $${account.balance.toFixed(2)}`);
    console.log(`🏆 BingoBest net profit: $${this.bingoBestAccount.netProfit.toFixed(2)}`);
    
    return true;
  }

  // Withdrawal Management
  processWithdrawal(playerId: string, amount: number): boolean {
    const account = this.getPlayerAccount(playerId);
    if (!account) {
      console.error('Player account not found:', playerId);
      return false;
    }

    if (account.balance < amount) {
      console.error('Insufficient funds for withdrawal:', {
        playerId,
        balance: account.balance,
        withdrawalAmount: amount
      });
      return false;
    }

    // Deduct from player balance
    account.balance -= amount;

    console.log(`💸 Withdrawal processed: Player ${playerId} withdrew $${amount.toFixed(2)}`);
    console.log(`💸 New balance: $${account.balance.toFixed(2)}`);
    
    return true;
  }

  // Get BingoBest Account Status
  getBingoBestAccount(): BingoBestAccount {
    return { ...this.bingoBestAccount };
  }

  // Get Game Statistics
  getGameStats() {
    const totalPlayers = this.playerAccounts.size;
    const totalGames = this.gameSessions.size;
    const completedGames = Array.from(this.gameSessions.values()).filter(s => s.status === 'completed').length;
    
    return {
      totalPlayers,
      totalGames,
      completedGames,
      bingoBestAccount: this.getBingoBestAccount()
    };
  }

  // Reset for testing
  reset() {
    this.playerAccounts.clear();
    this.gameSessions.clear();
    this.bingoBestAccount = {
      totalFeesCollected: 0,
      totalPrizesPaid: 0,
      netProfit: 0,
      activeGames: 0
    };
  }
}

// Export singleton instance
export const gameEconomy = new GameEconomy();

// Export types
export type { GameSession, PlayerAccount, BingoBestAccount };
