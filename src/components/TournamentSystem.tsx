import React, { useState } from 'react';
import { Tournament, Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Clock, DollarSign } from 'lucide-react';

interface TournamentSystemProps {
  tournaments: Tournament[];
  player: Player;
  onJoinTournament: (tournamentId: string) => void;
}

const TournamentSystem: React.FC<TournamentSystemProps> = ({
  tournaments,
  player,
  onJoinTournament
}) => {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');

  const filteredTournaments = tournaments.filter(t => t.status === selectedTab);

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Tournaments
        </h2>
      </div>

      {/* Tournament Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['upcoming', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md capitalize font-medium transition-colors ${
              selectedTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tournament Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No {selectedTab} tournaments</h3>
            <p className="text-gray-500">Check back later for new tournaments!</p>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{tournament.name}</CardTitle>
                <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                  {tournament.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{tournament.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span>Entry: ${tournament.entryFee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Prize: ${tournament.prizePool}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>{formatDate(tournament.startTime)}</span>
                </div>
              </div>
              
              {tournament.status === 'upcoming' && (
                <Button
                  onClick={() => onJoinTournament(tournament.id)}
                  disabled={player.balance < tournament.entryFee || 
                           tournament.currentParticipants >= tournament.maxParticipants}
                  className="w-full"
                >
                  Join Tournament
                </Button>
              )}
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TournamentSystem;