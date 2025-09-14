import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Shield, Activity } from 'lucide-react';
import { financialSafety, FinancialBalance, FinancialTransaction } from '@/lib/financialSafety';

interface FinancialDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ isOpen, onClose }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const data = financialSafety.getDashboardData();
      setDashboardData(data);
    }
  }, [isOpen, refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getHealthColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (level: string) => {
    switch (level) {
      case 'low': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'medium': return <Activity className="w-5 h-5 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'critical': return <Shield className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white casino-text-glow">
              💰 Financial Safety Dashboard
            </h2>
            <div className="flex gap-2">
              <Button onClick={refreshData} variant="outline" size="sm">
                🔄 Refresh
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                ✕ Close
              </Button>
            </div>
          </div>

          {dashboardData && (
            <div className="space-y-6">
              {/* Test Mode Controls */}
              <Card className="casino-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    🧪 Test Mode Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        Test Mode: {dashboardData.testMode ? 'ENABLED' : 'DISABLED'}
                      </p>
                      <p className="text-sm text-gray-300">
                        {dashboardData.testMode 
                          ? 'All games can start regardless of funds (for testing)' 
                          : 'Normal financial safety checks are active'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          financialSafety.enableTestMode();
                          refreshData();
                        }}
                        variant={dashboardData.testMode ? "default" : "outline"}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Enable Test Mode
                      </Button>
                      <Button
                        onClick={() => {
                          financialSafety.disableTestMode();
                          refreshData();
                        }}
                        variant={!dashboardData.testMode ? "default" : "outline"}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Disable Test Mode
                      </Button>
                      <Button
                        onClick={async () => {
                          await financialSafety.addTestFunds(10000);
                          refreshData();
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add $10K Test Funds
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Status */}
              <Card className="casino-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {getHealthIcon(dashboardData.healthCheck.warningLevel)}
                    Financial Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Badge 
                        variant={dashboardData.healthCheck.isHealthy ? "default" : "destructive"}
                        className="text-lg px-4 py-2"
                      >
                        {dashboardData.healthCheck.warningLevel.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-300 mt-2">
                        {dashboardData.healthCheck.message}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Available Balance</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(dashboardData.balance.availableBalance)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Platform Profit</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(dashboardData.balance.platformProfit)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <p className="text-yellow-300 text-sm">
                      <strong>Recommended Action:</strong> {dashboardData.healthCheck.recommendedAction}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="casino-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <p className="text-sm text-gray-400">Total Deposits</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(dashboardData.balance.totalDeposits)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="casino-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <p className="text-sm text-gray-400">Entry Fees</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(dashboardData.balance.totalEntryFees)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="casino-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                      <p className="text-sm text-gray-400">Prize Payouts</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(dashboardData.balance.totalPrizePayouts)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="casino-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-gray-400">Reserved Funds</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(dashboardData.balance.reservedForPayouts)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Stats */}
              <Card className="casino-card">
                <CardHeader>
                  <CardTitle className="text-white">📊 Today's Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Deposits</p>
                      <p className="text-xl font-bold text-green-400">
                        {formatCurrency(dashboardData.dailyStats.deposits)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Payouts</p>
                      <p className="text-xl font-bold text-red-400">
                        {formatCurrency(dashboardData.dailyStats.payouts)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Profit</p>
                      <p className="text-xl font-bold text-yellow-400">
                        {formatCurrency(dashboardData.dailyStats.profit)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Games Played</p>
                      <p className="text-xl font-bold text-blue-400">
                        {dashboardData.dailyStats.gamesPlayed}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="casino-card">
                <CardHeader>
                  <CardTitle className="text-white">📋 Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dashboardData.recentTransactions.map((transaction: FinancialTransaction) => (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            transaction.type === 'deposit' ? 'bg-green-500' :
                            transaction.type === 'prize_payout' ? 'bg-red-500' :
                            transaction.type === 'entry_fee' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-400">{formatDate(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'deposit' || transaction.type === 'entry_fee' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'entry_fee' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
