import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Zap, Target, Crown, Clock, Users } from 'lucide-react';

interface AdvancedTournament {
  id: string;
  name: string;
  format: 'blitz' | 'marathon' | 'survival' | 'team_battle' | 'mystery_box' | 'progressive';
  description: string;
  entryFee: number;
  prizePool: number;
  duration: string;
  specialRules: string[];
  participants: number;
  maxParticipants: number;
  startTime: Date;
  status: 'upcoming' | 'active' | 'completed';
}

const AdvancedTournaments: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  const tournaments: AdvancedTournament[] = [
    {
      id: '1',
      name: 'Lightning Blitz Championship',
      format: 'blitz',
      description: 'Fast-paced 5-minute games with instant number calling',
      entryFee: 25,
      prizePool: 500,
      duration: '2 hours',
      specialRules: ['Numbers called every 2 seconds', 'Auto-daub enabled', 'No chat allowed'],
      participants: 45,
      maxParticipants: 64,
      startTime: new Date(Date.now() + 3600000),
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Endurance Marathon',
      format: 'marathon',
      description: '12-hour tournament with multiple game modes',
      entryFee: 50,
      prizePool: 2000,
      duration: '12 hours',
      specialRules: ['Multiple card types', 'Bonus rounds every 2 hours', 'Progressive jackpots'],
      participants: 28,
      maxParticipants: 32,
      startTime: new Date(Date.now() + 7200000),
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Team Battle Royale',
      format: 'team_battle',
      description: 'Teams of 4 compete for ultimate glory',
      entryFee: 20,
      prizePool: 800,
      duration: '3 hours',
      specialRules: ['Shared team cards', 'Team power-ups', 'Captain bonuses'],
      participants: 32,
      maxParticipants: 48,
      startTime: new Date(Date.now() + 1800000),
      status: 'active'
    }
  ];

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'blitz': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'marathon': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'team_battle': return <Users className="w-5 h-5 text-green-500" />;
      case 'survival': return <Target className="w-5 h-5 text-red-500" />;
      default: return <Trophy className="w-5 h-5 text-purple-500" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'blitz': return 'bg-yellow-500';
      case 'marathon': return 'bg-blue-500';
      case 'team_battle': return 'bg-green-500';
      case 'survival': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };

  const filteredTournaments = selectedFormat === 'all' 
    ? tournaments 
    : tournaments.filter(t => t.format === selectedFormat);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Crown className="text-yellow-500" />
          Advanced Tournaments
        </h2>
      </div>

      {/* Format Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'blitz', 'marathon', 'team_battle', 'survival'].map((format) => (
          <Button
            key={format}
            variant={selectedFormat === format ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFormat(format)}
            className="capitalize"
          >
            {format.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {/* Tournament Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getFormatIcon(tournament.format)}
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                </div>
                <Badge className={`${getFormatColor(tournament.format)} text-white`}>
                  {tournament.format.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{tournament.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Entry: ${tournament.entryFee}</div>
                <div>Prize: ${tournament.prizePool}</div>
                <div>Duration: {tournament.duration}</div>
                <div>Status: {tournament.status}</div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Participants</span>
                  <span>{tournament.participants}/{tournament.maxParticipants}</span>
                </div>
                <Progress 
                  value={(tournament.participants / tournament.maxParticipants) * 100}
                  className="h-2"
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Special Rules:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {tournament.specialRules.map((rule, index) => (
                    <li key={index}>• {rule}</li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                disabled={tournament.status !== 'upcoming'}
              >
                {tournament.status === 'upcoming' ? 'Join Tournament' : 
                 tournament.status === 'active' ? 'In Progress' : 'Completed'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvancedTournaments;