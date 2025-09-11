import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LiveGame {
  id: string;
  roomName: string;
  players: number;
  maxPlayers: number;
  prizePool: number;
  status: 'starting' | 'in-progress' | 'ending';
  timeRemaining?: string;
  lastWinner?: string;
  winAmount?: number;
}

const LiveGameFeed: React.FC = () => {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [recentWins, setRecentWins] = useState<Array<{
    player: string;
    amount: number;
    room: string;
    time: string;
  }>>([]);

  useEffect(() => {
    // Simulate live games
    const games: LiveGame[] = [
      {
        id: '1',
        roomName: 'High Stakes Arena',
        players: 18,
        maxPlayers: 20,
        prizePool: 450,
        status: 'in-progress',
        timeRemaining: '3:45'
      },
      {
        id: '2',
        roomName: 'Speed Bingo',
        players: 12,
        maxPlayers: 15,
        prizePool: 180,
        status: 'starting',
        timeRemaining: '0:30'
      },
      {
        id: '3',
        roomName: 'VIP Lounge',
        players: 4,
        maxPlayers: 5,
        prizePool: 200,
        status: 'ending',
        lastWinner: 'LuckyPlayer',
        winAmount: 200
      }
    ];
    setLiveGames(games);

    // Simulate recent wins
    const wins = [
      { player: 'BingoMaster', amount: 125, room: 'Beginner Room', time: '2 min ago' },
      { player: 'NumberWiz', amount: 300, room: 'High Stakes', time: '5 min ago' },
      { player: 'CardShark', amount: 75, room: 'Speed Bingo', time: '8 min ago' },
      { player: 'LuckyPlayer', amount: 200, room: 'VIP Lounge', time: '12 min ago' }
    ];
    setRecentWins(wins);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'starting': return 'bg-yellow-500';
      case 'in-progress': return 'bg-green-500';
      case 'ending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Games */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔴 Live Games
            <Badge variant="secondary">{liveGames.length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveGames.map((game) => (
              <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(game.status)}`}></div>
                    <span className="font-semibold">{game.roomName}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {game.players}/{game.maxPlayers} players • ${game.prizePool} prize
                    {game.timeRemaining && ` • ${game.timeRemaining} left`}
                  </div>
                  {game.lastWinner && (
                    <div className="text-sm text-green-600">
                      🎉 {game.lastWinner} won ${game.winAmount}!
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant={game.status === 'starting' ? 'default' : 'outline'}
                  disabled={game.status === 'ending'}
                  onClick={() => {
                    if (game.status === 'starting') {
                      alert(`Joined ${game.roomName}! Game starting soon.`);
                    } else {
                      alert(`Watching ${game.roomName}! Enjoy the game.`);
                    }
                  }}
                >
                  {game.status === 'starting' ? 'Join' : 'Watch'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Winners */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Recent Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentWins.map((win, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <span className="font-semibold text-green-600">{win.player}</span>
                  <span className="text-sm text-gray-600 ml-2">won ${win.amount}</span>
                  <div className="text-xs text-gray-500">{win.room} • {win.time}</div>
                </div>
                <Badge variant="outline">${win.amount}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveGameFeed;