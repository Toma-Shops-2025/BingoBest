import React, { useState, useEffect } from 'react';
import { Tournament, Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  Play, 
  ArrowLeft, 
  Target,
  Zap,
  Star,
  Crown,
  Gamepad2
} from 'lucide-react';

interface TournamentPlayAreaProps {
  tournament: Tournament;
  player: Player;
  onBack: () => void;
  onStartGame: () => void;
}

const TournamentPlayArea: React.FC<TournamentPlayAreaProps> = ({
  tournament,
  player,
  onBack,
  onStartGame
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<'waiting' | 'starting' | 'playing' | 'finished'>('waiting');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(1); // Single round tournaments for now

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const startTime = new Date(tournament.startTime);
      const endTime = new Date(tournament.endTime);
      
      if (now < startTime) {
        // Tournament hasn't started yet
        const diff = startTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        setGamePhase('waiting');
      } else if (now >= startTime && now < endTime) {
        // Tournament is active
        const diff = endTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        setGamePhase('playing');
      } else {
        // Tournament is finished
        setTimeRemaining('Tournament Ended');
        setGamePhase('finished');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tournament]);

  const getPhaseIcon = () => {
    switch (gamePhase) {
      case 'waiting': return <Clock className="w-6 h-6 text-blue-500" />;
      case 'starting': return <Zap className="w-6 h-6 text-yellow-500" />;
      case 'playing': return <Play className="w-6 h-6 text-green-500" />;
      case 'finished': return <Trophy className="w-6 h-6 text-purple-500" />;
      default: return <Gamepad2 className="w-6 h-6 text-gray-500" />;
    }
  };

  const getPhaseText = () => {
    switch (gamePhase) {
      case 'waiting': return 'Waiting for tournament to start...';
      case 'starting': return 'Tournament starting soon!';
      case 'playing': return 'Tournament in progress!';
      case 'finished': return 'Tournament completed!';
      default: return 'Unknown status';
    }
  };

  const getPhaseColor = () => {
    switch (gamePhase) {
      case 'waiting': return 'from-blue-500 to-blue-600';
      case 'starting': return 'from-yellow-500 to-orange-500';
      case 'playing': return 'from-green-500 to-emerald-500';
      case 'finished': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              {tournament.name}
            </h1>
            <p className="text-white/80">{tournament.description}</p>
          </div>
          
          <div className="text-right">
            <div className="text-white/80 text-sm">Your Balance</div>
            <div className="text-2xl font-bold text-green-400">${player.balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Tournament Status */}
        <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getPhaseIcon()}
                <div>
                  <h3 className="text-xl font-bold text-white">{getPhaseText()}</h3>
                  <p className="text-white/80">Time Remaining: {timeRemaining}</p>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getPhaseColor()} text-white font-bold`}>
                {tournament.status.toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${tournament.prizePool}</div>
              <div className="text-sm text-white/80">Prize Pool</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
              <div className="text-sm text-white/80">Players</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{currentRound}/{totalRounds}</div>
              <div className="text-sm text-white/80">Round</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${tournament.entryFee}</div>
              <div className="text-sm text-white/80">Entry Fee</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Tournament Play Area
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Round Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>Round Progress</span>
                <span>{currentRound} of {totalRounds}</span>
              </div>
              <Progress 
                value={(currentRound / totalRounds) * 100} 
                className="h-3 bg-white/20"
              />
            </div>

            {/* Game Status */}
            <div className="text-center py-8">
              {gamePhase === 'waiting' && (
                <div className="space-y-4">
                  <div className="text-6xl">⏰</div>
                  <h3 className="text-2xl font-bold text-white">Tournament Starting Soon!</h3>
                  <p className="text-white/80">Get ready for the action to begin!</p>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-blue-200 font-medium">
                      Tournament starts in: <span className="font-bold">{timeRemaining}</span>
                    </p>
                  </div>
                </div>
              )}

              {gamePhase === 'playing' && (
                <div className="space-y-4">
                  <div className="text-6xl">🎮</div>
                  <h3 className="text-2xl font-bold text-white">Tournament in Progress!</h3>
                  <p className="text-white/80">Play your best and compete for the prize!</p>
                  <Button
                    onClick={onStartGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Playing
                  </Button>
                </div>
              )}

              {gamePhase === 'finished' && (
                <div className="space-y-4">
                  <div className="text-6xl">🏆</div>
                  <h3 className="text-2xl font-bold text-white">Tournament Completed!</h3>
                  <p className="text-white/80">Check the leaderboard for results!</p>
                  <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                    <p className="text-purple-200 font-medium">
                      Final Prize Pool: <span className="font-bold">${tournament.prizePool}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tournament Rules */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Tournament Rules
              </h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Complete bingo patterns as fast as possible</li>
                <li>• Points are awarded for each number marked and pattern completed</li>
                <li>• Higher scores earn better tournament rankings</li>
                <li>• Tournament lasts 2 minutes - play your best!</li>
                <li>• Winner takes the prize pool based on final ranking!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentPlayArea;
