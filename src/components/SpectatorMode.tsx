import React, { useState, useEffect } from 'react';
import { GameRoom, Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Play, MessageCircle, Clock, Trophy, Zap } from 'lucide-react';

interface SpectatorModeProps {
  activeGames: GameRoom[];
  onJoinAsSpectator: (roomId: string) => void;
  onJoinAsPlayer: (roomId: string) => void;
}

const SpectatorMode: React.FC<SpectatorModeProps> = ({
  activeGames,
  onJoinAsSpectator,
  onJoinAsPlayer
}) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [mockGame, setMockGame] = useState<any>(null);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [gameTime, setGameTime] = useState(0);

  // Mock game data for demonstration
  useEffect(() => {
    if (activeGames.length === 0) {
      const mockGameData = {
        id: 'mock-game-1',
        name: 'Speed Bingo',
        currentPlayers: 8,
        maxPlayers: 20,
        prizePool: 40.50,
        entryFee: 5.00,
        timeLeft: 180, // 3 minutes
        status: 'playing',
        players: [
          { id: '1', username: 'BingoBeast318', position: 1, prize: 24.30 },
          { id: '2', username: 'LuckyPlayer42', position: 2, prize: 10.13 },
          { id: '3', username: 'CardMaster99', position: 3, prize: 6.08 },
          { id: '4', username: 'NumberHunter', position: 0, prize: 0 },
          { id: '5', username: 'BingoPro', position: 0, prize: 0 },
          { id: '6', username: 'QuickDraw', position: 0, prize: 0 },
          { id: '7', username: 'LuckyDuck', position: 0, prize: 0 },
          { id: '8', username: 'BingoKing', position: 0, prize: 0 }
        ]
      };
      setMockGame(mockGameData);
    }
  }, [activeGames.length]);

  // Simulate number calling for mock game
  useEffect(() => {
    if (mockGame && mockGame.status === 'playing') {
      const interval = setInterval(() => {
        // Generate random bingo number (1-75)
        const newNumber = Math.floor(Math.random() * 75) + 1;
        setCurrentNumber(newNumber);
        setCalledNumbers(prev => [...prev, newNumber]);
        setGameTime(prev => prev + 1);
      }, 2000); // Call number every 2 seconds

      return () => clearInterval(interval);
    }
  }, [mockGame]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Eye className="text-blue-500" />
        <h2 className="text-2xl font-bold">Spectator Mode</h2>
      </div>

      {/* Real Active Games */}
      {activeGames.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {activeGames.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <Badge className="bg-green-500">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Players</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {game.currentPlayers}/{game.maxPlayers}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Prize Pool</p>
                    <p className="font-semibold text-green-600">${game.prizePool}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onJoinAsSpectator(game.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Watch
                  </Button>
                  {game.currentPlayers < game.maxPlayers && (
                    <Button
                      onClick={() => onJoinAsPlayer(game.id)}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join Game
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mock Game Display */}
      {activeGames.length === 0 && mockGame && (
        <div className="space-y-6">
          {/* Live Game Header */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <CardTitle className="text-xl text-green-700">{mockGame.name}</CardTitle>
                  <Badge className="bg-green-500">LIVE</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(gameTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{mockGame.currentPlayers}/{mockGame.maxPlayers}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Game Display */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Number Calling Display */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-yellow-500" />
                  Live Number Calling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  {/* Current Number Display */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-32 h-32 mx-auto flex items-center justify-center">
                    <span className="text-4xl font-bold">
                      {currentNumber || 'BINGO'}
                    </span>
                  </div>
                  
                  {/* Called Numbers */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Called Numbers ({calledNumbers.length})</h4>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {calledNumbers.slice(-20).map((num, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockGame.players.slice(0, 5).map((player: any, index: number) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm">{player.username}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          ${player.prize.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {player.position > 0 ? 'Winner!' : 'Playing...'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${mockGame.prizePool}</div>
                  <div className="text-sm text-gray-600">Total Prize Pool</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockGame.currentPlayers}</div>
                  <div className="text-sm text-gray-600">Active Players</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${mockGame.entryFee}</div>
                  <div className="text-sm text-gray-600">Entry Fee</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spectator Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="text-blue-500" />
                Live Spectator Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-blue-600">BingoFan123:</span>
                    <span>This is so exciting! 🎉</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-green-600">LuckyPlayer:</span>
                    <span>Go BingoBeast318! You got this! 💪</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-purple-600">Spectator99:</span>
                    <span>I wish I could join this game! 😍</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-orange-600">BingoWatcher:</span>
                    <span>Number {currentNumber} just called! 🔥</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Join the conversation..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <Button size="sm">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Games Available */}
      {activeGames.length === 0 && !mockGame && (
        <div className="text-center py-12 text-gray-500">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Active Games</h3>
          <p>No games are currently in progress to spectate.</p>
        </div>
      )}
    </div>
  );
};

export default SpectatorMode;