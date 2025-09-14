import React, { useState, useEffect } from 'react';
import { Tournament, Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Clock, DollarSign, Calendar, Play, Eye, Award } from 'lucide-react';

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

  // Handle URL hash routing for tabs
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['upcoming', 'active', 'completed'].includes(hash)) {
      setSelectedTab(hash as 'upcoming' | 'active' | 'completed');
    }
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tab: 'upcoming' | 'active' | 'completed') => {
    setSelectedTab(tab);
    window.location.hash = tab;
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const getTimeUntilStart = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting now!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'upcoming': return <Calendar className="w-4 h-4" />;
      case 'active': return <Play className="w-4 h-4" />;
      case 'completed': return <Award className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'upcoming': return 'Join upcoming tournaments and prepare for battle!';
      case 'active': return 'Watch live tournaments and see the action unfold!';
      case 'completed': return 'View past tournament results and winners!';
      default: return '';
    }
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
      <div className="space-y-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['upcoming', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md capitalize font-medium transition-all duration-200 ${
                selectedTab === tab
                  ? 'bg-white text-blue-600 shadow-sm transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {getTabIcon(tab)}
              {tab}
              {filteredTournaments.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredTournaments.length}
                </Badge>
              )}
            </button>
          ))}
        </div>
        
        {/* Tab Description */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">{getTabDescription(selectedTab)}</p>
        </div>
        
        {/* Tab Statistics */}
        {filteredTournaments.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredTournaments.length}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedTab === 'upcoming' && 'Tournaments'}
                  {selectedTab === 'active' && 'Live Now'}
                  {selectedTab === 'completed' && 'Finished'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${filteredTournaments.reduce((sum, t) => sum + t.prizePool, 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Prize Pool</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {filteredTournaments.reduce((sum, t) => sum + t.currentParticipants, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Players</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tournament Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">
              {selectedTab === 'upcoming' && '📅'}
              {selectedTab === 'active' && '🎮'}
              {selectedTab === 'completed' && '🏆'}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {selectedTab === 'upcoming' && 'No upcoming tournaments'}
              {selectedTab === 'active' && 'No active tournaments'}
              {selectedTab === 'completed' && 'No completed tournaments'}
            </h3>
            <p className="text-gray-500">
              {selectedTab === 'upcoming' && 'Check back later for new tournaments!'}
              {selectedTab === 'active' && 'No tournaments are currently running. Join upcoming ones!'}
              {selectedTab === 'completed' && 'Tournament results will appear here once they finish!'}
            </p>
            {selectedTab === 'upcoming' && (
              <Button 
                onClick={() => handleTabChange('upcoming')}
                className="mt-4"
                variant="outline"
              >
                Refresh Tournaments
              </Button>
            )}
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
                  <span>
                    {tournament.status === 'upcoming' && getTimeUntilStart(tournament.startTime)}
                    {tournament.status === 'active' && 'Live Now!'}
                    {tournament.status === 'completed' && formatDate(tournament.startTime)}
                  </span>
                </div>
              </div>
              
              {/* Tournament Actions based on status */}
              {tournament.status === 'upcoming' && (
                <div className="space-y-2">
                  <Button
                    onClick={() => onJoinTournament(tournament.id)}
                    disabled={player.balance < tournament.entryFee || 
                             tournament.currentParticipants >= tournament.maxParticipants}
                    className="w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Join Tournament
                  </Button>
                  {player.balance < tournament.entryFee && (
                    <p className="text-xs text-red-500 text-center">
                      Need ${(tournament.entryFee - player.balance).toFixed(2)} more
                    </p>
                  )}
                </div>
              )}
              
              {tournament.status === 'active' && (
                <div className="space-y-2">
                  <Button
                    onClick={() => alert(`🎮 Spectating ${tournament.name}!\n\nWatch the live action unfold!`)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Watch Live
                  </Button>
                  <p className="text-xs text-green-600 text-center font-medium">
                    Tournament in progress!
                  </p>
                </div>
              )}
              
              {tournament.status === 'completed' && (
                <div className="space-y-2">
                  <Button
                    onClick={() => alert(`🏆 Tournament Results\n\n${tournament.name}\n\nCheck the leaderboard for winners!`)}
                    className="w-full bg-gray-600 hover:bg-gray-700"
                    variant="outline"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                  {tournament.winners && tournament.winners.length > 0 && (
                    <p className="text-xs text-yellow-600 text-center font-medium">
                      Winner: {tournament.winners[0].username}
                    </p>
                  )}
                </div>
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