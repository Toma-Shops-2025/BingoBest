import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { gameEconomy } from '@/lib/gameEconomy';
import { DollarSign, Users, Gamepad2, TrendingUp, TrendingDown } from 'lucide-react';

const BingoBestDashboard: React.FC = () => {
  const [stats, setStats] = useState(gameEconomy.getGameStats());
  const [bingoBestAccount, setBingoBestAccount] = useState(gameEconomy.getBingoBestAccount());

  useEffect(() => {
    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setStats(gameEconomy.getGameStats());
      setBingoBestAccount(gameEconomy.getBingoBestAccount());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 BingoBest Platform</h2>
        <p className="text-gray-300">Real-time platform statistics and earnings</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Total Fees Collected</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(bingoBestAccount.totalFeesCollected)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Prizes Paid</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(bingoBestAccount.totalPrizesPaid)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${bingoBestAccount.netProfit >= 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${bingoBestAccount.netProfit >= 0 ? 'text-green-300' : 'text-red-300'} text-sm font-medium`}>
                  Net Profit
                </p>
                <p className={`text-2xl font-bold ${bingoBestAccount.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(bingoBestAccount.netProfit)}
                </p>
              </div>
              {bingoBestAccount.netProfit >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Active Games</p>
                <p className="text-2xl font-bold text-purple-400">
                  {bingoBestAccount.activeGames}
                </p>
              </div>
              <Gamepad2 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/20 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Players</span>
              <Badge variant="secondary" className="bg-blue-600">
                {stats.totalPlayers}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Games</span>
              <Badge variant="secondary" className="bg-green-600">
                {stats.totalGames}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Completed Games</span>
              <Badge variant="secondary" className="bg-purple-600">
                {stats.completedGames}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Completion Rate</span>
              <Badge variant="secondary" className="bg-orange-600">
                {stats.totalGames > 0 ? Math.round((stats.completedGames / stats.totalGames) * 100) : 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/20 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Entry Fees Collected</span>
              <span className="text-green-400 font-bold">
                {formatCurrency(bingoBestAccount.totalFeesCollected)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Prizes Paid Out</span>
              <span className="text-blue-400 font-bold">
                {formatCurrency(bingoBestAccount.totalPrizesPaid)}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Net Profit</span>
                <span className={`font-bold text-lg ${bingoBestAccount.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(bingoBestAccount.netProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Rooms & Entry Fees */}
      <Card className="bg-gray-900/20 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">🎮 Game Rooms & Entry Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-900/20 rounded-lg">
              <h3 className="font-bold text-blue-400 mb-2">Speed Bingo</h3>
              <p className="text-sm text-gray-300 mb-2">Entry Fee: $3.00</p>
              <p className="text-sm text-green-400">Prize Pool: $10.00</p>
            </div>
            <div className="p-4 bg-green-900/20 rounded-lg">
              <h3 className="font-bold text-green-400 mb-2">Classic Bingo</h3>
              <p className="text-sm text-gray-300 mb-2">Entry Fee: $5.00</p>
              <p className="text-sm text-green-400">Prize Pool: $25.00</p>
            </div>
            <div className="p-4 bg-purple-900/20 rounded-lg">
              <h3 className="font-bold text-purple-400 mb-2">High Stakes Arena</h3>
              <p className="text-sm text-gray-300 mb-2">Entry Fee: $12.00</p>
              <p className="text-sm text-green-400">Prize Pool: $100.00</p>
            </div>
            <div className="p-4 bg-orange-900/20 rounded-lg">
              <h3 className="font-bold text-orange-400 mb-2">Daily Tournament</h3>
              <p className="text-sm text-gray-300 mb-2">Entry Fee: $8.00</p>
              <p className="text-sm text-green-400">Prize Pool: $75.00</p>
            </div>
            <div className="p-4 bg-red-900/20 rounded-lg">
              <h3 className="font-bold text-red-400 mb-2">Weekly Championship</h3>
              <p className="text-sm text-gray-300 mb-2">Entry Fee: $20.00</p>
              <p className="text-sm text-green-400">Prize Pool: $200.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gray-900/20 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">💰 How the Economy Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-900/20 rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <h3 className="font-bold text-blue-400 mb-2">1. Player Deposits</h3>
              <p className="text-sm text-gray-300">
                Players add money to their accounts via PayPal or other methods
              </p>
            </div>
            <div className="text-center p-4 bg-green-900/20 rounded-lg">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-bold text-green-400 mb-2">2. Entry Fees</h3>
              <p className="text-sm text-gray-300">
                Players pay entry fees ($3-$20) to play games. Fees go to BingoBest account
              </p>
            </div>
            <div className="text-center p-4 bg-purple-900/20 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-bold text-purple-400 mb-2">3. Prize Payouts</h3>
              <p className="text-sm text-gray-300">
                Winners receive prizes from prize pools ($10-$200). Winnings can be withdrawn or used to play more games
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button for Testing */}
      <div className="text-center">
        <Button
          onClick={() => {
            gameEconomy.reset();
            setStats(gameEconomy.getGameStats());
            setBingoBestAccount(gameEconomy.getBingoBestAccount());
          }}
          variant="outline"
          className="bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-800/30"
        >
          🔄 Reset Platform Data (Testing Only)
        </Button>
      </div>
    </div>
  );
};

export default BingoBestDashboard;
