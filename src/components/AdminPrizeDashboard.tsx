import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  GAME_CONFIGS, 
  GameSessionManager, 
  RevenueAnalytics,
  CryptoPrizeDistributor,
  type GameSession,
  type GameConfig
} from '@/lib/prizeDistribution';

const AdminPrizeDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('speed-bingo');
  const [bingoBestWallet, setBingoBestWallet] = useState<string>('');
  const [payoutWallet, setPayoutWallet] = useState<string>('');
  const [revenueStats, setRevenueStats] = useState<any>(null);

  useEffect(() => {
    loadSessions();
    loadWalletAddresses();
  }, []);

  const loadSessions = () => {
    const allSessions = GameSessionManager.getAllSessions();
    setSessions(allSessions);
    
    const stats = RevenueAnalytics.calculateDailyRevenue(allSessions);
    setRevenueStats(stats);
  };

  const loadWalletAddresses = () => {
    // Set your actual wallet addresses
    setBingoBestWallet('19BgRYm2NZBzBdtwZFRogVSZhMCyXp2rck'); // Bitcoin wallet
    setPayoutWallet('0x94476E0835bfA7F983aCa4090BF004994C9B38FA'); // Ethereum wallet
  };

  const createTestSession = async () => {
    const gameConfig = GAME_CONFIGS.find(config => config.id === selectedGame);
    if (!gameConfig) return;

    // Create a test session with 1 real player and bots
    const realPlayer = {
      id: 'test_player_1',
      username: 'TestPlayer',
      isBot: false,
      entryFee: gameConfig.entryFee
    };

    const session = GameSessionManager.createGameSession(selectedGame, [realPlayer]);
    loadSessions();
    
    alert(`Test session created: ${session.id}\nPlayers: ${session.players.length}\nPrize Pool: $${session.prizeDistribution.payoutPool.toFixed(2)}`);
  };

  const simulateGame = async (sessionId: string) => {
    // Start the game
    GameSessionManager.startGame(sessionId);
    
    // Simulate game duration (in real app, this would be actual game time)
    setTimeout(() => {
      const finishedSession = GameSessionManager.finishGame(sessionId);
      if (finishedSession) {
        loadSessions();
        alert(`Game finished! Winners:\n1st: ${finishedSession.players[0]?.username} - $${finishedSession.players[0]?.prize?.toFixed(2)}\n2nd: ${finishedSession.players[1]?.username} - $${finishedSession.players[1]?.prize?.toFixed(2)}\n3rd: ${finishedSession.players[2]?.username} - $${finishedSession.players[2]?.prize?.toFixed(2)}`);
      }
    }, 2000);
  };

  const distributePrizes = async (sessionId: string) => {
    const session = GameSessionManager.getGameSession(sessionId);
    if (!session) return;

    try {
      const distribution = await CryptoPrizeDistributor.distributePrizes(session);
      
      alert(`Prize Distribution:\n\nBingoBest Account (10%): $${distribution.bingoBestTransfer.amount.toFixed(2)}\n\nPlayer Payouts:\n${distribution.payoutTransfers.map(p => `${p.playerId}: $${p.amount.toFixed(2)}`).join('\n')}`);
    } catch (error) {
      alert(`Error distributing prizes: ${error}`);
    }
  };

  const updateGameConfig = (gameId: string, newEntryFee: number) => {
    const gameConfig = GAME_CONFIGS.find(config => config.id === gameId);
    if (gameConfig) {
      gameConfig.entryFee = newEntryFee;
      alert(`Updated ${gameConfig.name} entry fee to $${newEntryFee}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">BingoBest Prize Distribution System</CardTitle>
          <p className="text-gray-600">Admin-only dashboard for managing the 90/10 split system</p>
        </CardHeader>
      </Card>

      {/* Revenue Statistics */}
      {revenueStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueStats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">BingoBest Cut (10%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${revenueStats.bingoBestRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Payouts (90%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${revenueStats.totalPayouts.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${revenueStats.netProfit.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Game Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GAME_CONFIGS.map((game) => (
              <div key={game.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{game.name}</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={game.entryFee}
                        onChange={(e) => updateGameConfig(game.id, parseFloat(e.target.value))}
                        className="w-20"
                      />
                      <Button size="sm" onClick={() => updateGameConfig(game.id, game.entryFee)}>
                        Update
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Players: {game.minPlayers}-{game.maxPlayers}
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: {game.duration} min
                  </div>
                  <div className="text-sm">
                    <strong>Prize Pool:</strong> ${(game.entryFee * game.minPlayers * 0.9).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Configuration</CardTitle>
          <p className="text-sm text-gray-600">Your configured wallet addresses for prize distribution</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bingoBestWallet">BingoBest Account (10% cut) - Bitcoin</Label>
              <Input
                id="bingoBestWallet"
                value={bingoBestWallet}
                readOnly
                className="bg-gray-50"
                placeholder="Bitcoin wallet address"
              />
              <p className="text-xs text-gray-500 mt-1">Platform revenue goes to this Bitcoin wallet</p>
            </div>
            <div>
              <Label htmlFor="payoutWallet">Payout Account (90% distribution) - Ethereum</Label>
              <Input
                id="payoutWallet"
                value={payoutWallet}
                readOnly
                className="bg-gray-50"
                placeholder="Ethereum wallet address"
              />
              <p className="text-xs text-gray-500 mt-1">Player prizes are distributed from this Ethereum wallet</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Session Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Test Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Select Game:</Label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {GAME_CONFIGS.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name} (${game.entryFee})
                </option>
              ))}
            </select>
            <Button onClick={createTestSession}>
              Create Test Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-gray-500">No active sessions</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{session.gameConfig.name}</h3>
                      <p className="text-sm text-gray-600">Session: {session.id}</p>
                    </div>
                    <Badge variant={session.status === 'finished' ? 'secondary' : 'default'}>
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Players:</strong> {session.players.length}
                    </div>
                    <div>
                      <strong>Entry Fees:</strong> ${session.prizeDistribution.totalEntryFees.toFixed(2)}
                    </div>
                    <div>
                      <strong>BingoBest Cut:</strong> ${session.prizeDistribution.bingoBestCut.toFixed(2)}
                    </div>
                    <div>
                      <strong>Prize Pool:</strong> ${session.prizeDistribution.payoutPool.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {session.status === 'waiting' && (
                      <Button size="sm" onClick={() => simulateGame(session.id)}>
                        Start Game
                      </Button>
                    )}
                    {session.status === 'finished' && (
                      <Button size="sm" onClick={() => distributePrizes(session.id)}>
                        Distribute Prizes
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrizeDashboard;
