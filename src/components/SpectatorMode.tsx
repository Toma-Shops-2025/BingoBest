import React, { useState } from 'react';
import { GameRoom, Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Play, MessageCircle } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Eye className="text-blue-500" />
        <h2 className="text-2xl font-bold">Spectator Mode</h2>
      </div>

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

      {activeGames.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Active Games</h3>
          <p>No games are currently in progress to spectate.</p>
        </div>
      )}

      {/* Spectator Chat */}
      {selectedGame && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="text-blue-500" />
              Spectator Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
              <p className="text-sm text-gray-500 text-center">
                Spectator chat will appear here...
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <Button size="sm">Send</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpectatorMode;