// Financial Safety Net System for BingoBest
// Ensures platform profitability and prevents financial losses

export interface FinancialTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize_payout' | 'platform_fee';
  amount: number;
  userId?: string;
  gameId?: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  metadata?: Record<string, any>;
}

export interface FinancialBalance {
  totalDeposits: number;
  totalWithdrawals: number;
  totalEntryFees: number;
  totalPrizePayouts: number;
  totalPlatformFees: number;
  availableBalance: number;
  reservedForPayouts: number;
  platformProfit: number;
  lastUpdated: Date;
}

export interface GameFinancialCheck {
  canStart: boolean;
  reason?: string;
  requiredBalance: number;
  availableBalance: number;
  estimatedPayouts: number;
  platformFee: number;
  safetyMargin: number;
}

export class FinancialSafetyManager {
  private static instance: FinancialSafetyManager;
  private transactions: FinancialTransaction[] = [];
  private balance: FinancialBalance = {
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalEntryFees: 0,
    totalPrizePayouts: 0,
    totalPlatformFees: 0,
    availableBalance: 0,
    reservedForPayouts: 0,
    platformProfit: 0,
    lastUpdated: new Date()
  };
  private testMode: boolean = true; // Enable test mode for development

  // Safety thresholds
  private readonly MINIMUM_BALANCE_RATIO = 0.15; // 15% minimum balance for safety
  private readonly PLATFORM_FEE_PERCENTAGE = 0.10; // 10% platform fee
  private readonly SAFETY_MARGIN_MULTIPLIER = 1.5; // 50% safety margin

  private constructor() {
    this.loadFinancialData();
  }

  public static getInstance(): FinancialSafetyManager {
    if (!FinancialSafetyManager.instance) {
      FinancialSafetyManager.instance = new FinancialSafetyManager();
    }
    return FinancialSafetyManager.instance;
  }

  // Record a financial transaction
  public async recordTransaction(transaction: Omit<FinancialTransaction, 'id' | 'timestamp'>): Promise<FinancialTransaction> {
    const newTransaction: FinancialTransaction = {
      ...transaction,
      id: this.generateTransactionId(),
      timestamp: new Date()
    };

    this.transactions.push(newTransaction);
    await this.updateBalance();
    await this.saveFinancialData();
    
    return newTransaction;
  }

  // Check if a game can start financially
  public canStartGame(gameConfig: {
    entryFee: number;
    minPlayers: number;
    maxPlayers: number;
    estimatedPlayers: number;
  }): GameFinancialCheck {
    // If in test mode, always allow games to start
    if (this.testMode) {
      const estimatedPayouts = this.calculateEstimatedPayouts(gameConfig);
      const platformFee = estimatedPayouts * this.PLATFORM_FEE_PERCENTAGE;
      return {
        canStart: true,
        reason: undefined,
        requiredBalance: estimatedPayouts,
        availableBalance: this.balance.availableBalance,
        estimatedPayouts,
        platformFee,
        safetyMargin: 0
      };
    }

    const estimatedPayouts = this.calculateEstimatedPayouts(gameConfig);
    const platformFee = estimatedPayouts * this.PLATFORM_FEE_PERCENTAGE;
    const requiredBalance = estimatedPayouts + (estimatedPayouts * this.SAFETY_MARGIN_MULTIPLIER);
    const availableBalance = this.balance.availableBalance;
    const safetyMargin = requiredBalance * this.MINIMUM_BALANCE_RATIO;

    const canStart = availableBalance >= requiredBalance && 
                    (availableBalance - requiredBalance) >= safetyMargin;

    return {
      canStart,
      reason: canStart ? undefined : this.getFailureReason(availableBalance, requiredBalance, safetyMargin),
      requiredBalance,
      availableBalance,
      estimatedPayouts,
      platformFee,
      safetyMargin
    };
  }

  // Process a deposit
  public async processDeposit(userId: string, amount: number, method: string): Promise<FinancialTransaction> {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    const transaction = await this.recordTransaction({
      type: 'deposit',
      amount,
      userId,
      status: 'completed',
      description: `Deposit via ${method}`,
      metadata: { method }
    });

    return transaction;
  }

  // Process entry fee collection
  public async processEntryFee(userId: string, gameId: string, amount: number): Promise<FinancialTransaction> {
    const transaction = await this.recordTransaction({
      type: 'entry_fee',
      amount,
      userId,
      gameId,
      status: 'completed',
      description: `Entry fee for game ${gameId}`
    });

    return transaction;
  }

  // Process prize payout (only if sufficient funds)
  public async processPrizePayout(userId: string, gameId: string, amount: number): Promise<FinancialTransaction | null> {
    // Check if we have sufficient funds
    if (this.balance.availableBalance < amount) {
      console.warn(`Insufficient funds for payout: ${amount}. Available: ${this.balance.availableBalance}`);
      return null;
    }

    const transaction = await this.recordTransaction({
      type: 'prize_payout',
      amount,
      userId,
      gameId,
      status: 'completed',
      description: `Prize payout for game ${gameId}`
    });

    return transaction;
  }

  // Get current financial status
  public getFinancialStatus(): FinancialBalance {
    return { ...this.balance };
  }

  // Get transaction history
  public getTransactionHistory(limit: number = 100): FinancialTransaction[] {
    return this.transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Calculate estimated payouts for a game
  private calculateEstimatedPayouts(gameConfig: {
    entryFee: number;
    minPlayers: number;
    maxPlayers: number;
    estimatedPlayers: number;
  }): number {
    const players = Math.max(gameConfig.minPlayers, gameConfig.estimatedPlayers);
    const totalEntryFees = players * gameConfig.entryFee;
    return totalEntryFees * 0.90; // 90% goes to payouts, 10% to platform
  }

  // Get failure reason for game start
  private getFailureReason(available: number, required: number, safety: number): string {
    if (available < required) {
      return `Insufficient balance. Need ${required.toFixed(2)}, have ${available.toFixed(2)}`;
    }
    if ((available - required) < safety) {
      return `Insufficient safety margin. Need ${safety.toFixed(2)} more for safety`;
    }
    return 'Unknown reason';
  }

  // Update balance calculations
  private async updateBalance(): Promise<void> {
    const deposits = this.transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawals = this.transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const entryFees = this.transactions
      .filter(t => t.type === 'entry_fee' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const prizePayouts = this.transactions
      .filter(t => t.type === 'prize_payout' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const platformFees = this.transactions
      .filter(t => t.type === 'platform_fee' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const availableBalance = deposits + entryFees - withdrawals - prizePayouts;
    const reservedForPayouts = entryFees * 0.90; // Reserve 90% of entry fees for payouts
    const platformProfit = platformFees + (entryFees * this.PLATFORM_FEE_PERCENTAGE);

    this.balance = {
      totalDeposits: deposits,
      totalWithdrawals: withdrawals,
      totalEntryFees: entryFees,
      totalPrizePayouts: prizePayouts,
      totalPlatformFees: platformFees,
      availableBalance,
      reservedForPayouts,
      platformProfit,
      lastUpdated: new Date()
    };
  }

  // Generate unique transaction ID
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Load financial data from storage
  private async loadFinancialData(): Promise<void> {
    try {
      const stored = localStorage.getItem('bingoBest_financial_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.transactions = data.transactions.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
        this.balance = {
          ...data.balance,
          lastUpdated: new Date(data.balance.lastUpdated)
        };
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  }

  // Save financial data to storage
  private async saveFinancialData(): Promise<void> {
    try {
      const data = {
        transactions: this.transactions,
        balance: this.balance
      };
      localStorage.setItem('bingoBest_financial_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving financial data:', error);
    }
  }

  // Emergency fund check
  public emergencyFundCheck(): {
    isHealthy: boolean;
    warningLevel: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    recommendedAction: string;
  } {
    const ratio = this.balance.availableBalance / (this.balance.totalEntryFees || 1);
    
    if (ratio >= 0.5) {
      return {
        isHealthy: true,
        warningLevel: 'low',
        message: 'Financial health is excellent',
        recommendedAction: 'Continue normal operations'
      };
    } else if (ratio >= 0.3) {
      return {
        isHealthy: true,
        warningLevel: 'medium',
        message: 'Financial health is good',
        recommendedAction: 'Monitor closely'
      };
    } else if (ratio >= 0.15) {
      return {
        isHealthy: false,
        warningLevel: 'high',
        message: 'Financial health is concerning',
        recommendedAction: 'Increase deposits or reduce payouts'
      };
    } else {
      return {
        isHealthy: false,
        warningLevel: 'critical',
        message: 'Financial health is critical',
        recommendedAction: 'STOP ALL PAYOUTS - Emergency action required'
      };
    }
  }

  // Test mode controls
  public enableTestMode(): void {
    this.testMode = true;
    console.log('🧪 Financial Safety Test Mode ENABLED - All games can start regardless of funds');
  }

  public disableTestMode(): void {
    this.testMode = false;
    console.log('🔒 Financial Safety Test Mode DISABLED - Normal safety checks active');
  }

  public isTestMode(): boolean {
    return this.testMode;
  }

  // Add test funds for testing purposes
  public async addTestFunds(amount: number = 10000): Promise<void> {
    await this.processDeposit('test_admin', amount, 'test_funds');
    console.log(`💰 Added $${amount} test funds to the system`);
  }

  // Get financial dashboard data
  public getDashboardData(): {
    balance: FinancialBalance;
    recentTransactions: FinancialTransaction[];
    healthCheck: ReturnType<typeof this.emergencyFundCheck>;
    dailyStats: {
      deposits: number;
      payouts: number;
      profit: number;
      gamesPlayed: number;
    };
    testMode: boolean;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = this.transactions.filter(t => 
      t.timestamp >= today && t.status === 'completed'
    );

    const dailyStats = {
      deposits: todayTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0),
      payouts: todayTransactions
        .filter(t => t.type === 'prize_payout')
        .reduce((sum, t) => sum + t.amount, 0),
      profit: todayTransactions
        .filter(t => t.type === 'platform_fee')
        .reduce((sum, t) => sum + t.amount, 0),
      gamesPlayed: new Set(todayTransactions
        .filter(t => t.type === 'entry_fee')
        .map(t => t.gameId)
      ).size
    };

    return {
      balance: this.getFinancialStatus(),
      recentTransactions: this.getTransactionHistory(20),
      healthCheck: this.emergencyFundCheck(),
      dailyStats,
      testMode: this.testMode
    };
  }
}

// Export singleton instance
export const financialSafety = FinancialSafetyManager.getInstance();
