import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, Target, ArrowLeft, Home, RotateCcw } from 'lucide-react';

interface TournamentResultsScreenProps {
  results: {
    tournamentName: string;
    tournamentId: string;
    playerScore: number;
    rank: number;
    totalPlayers: number;
    cycleTimeRemaining: string;
    nextCycleEnd: Date;
    bestScore: number;
    averageScore: number;
    gamesPlayed: number;
    patternsCompleted: string[];
    numbersCalled: number;
    bonusPoints: number;
    penalties: number;
    finalScore: number;
  };
  onPlayAgain: () => void;
  onBackToTournaments: () => void;
}

const TournamentResultsScreen: React.FC<TournamentResultsScreenProps> = ({
  results,
  onPlayAgain,
  onBackToTournaments
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-white';
    }
  };

  const getRankText = (rank: number) => {
    switch (rank) {
      case 1: return 'CHAMPION!';
      case 2: return '2nd Place';
      case 3: return '3rd Place';
      default: return `${rank}th Place`;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToTournaments}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Tournament Results
            </h1>
            <p className="text-white/80">{results.tournamentName}</p>
          </div>
          
          <div className="text-right">
            <div className="text-white/80 text-sm">Cycle Time Remaining</div>
            <div className="text-2xl font-bold text-yellow-400">{results.cycleTimeRemaining}</div>
          </div>
        </div>

        {/* Tournament Status Card */}
        <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{getRankIcon(results.rank)}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{getRankText(results.rank)}</h3>
                  <p className="text-white/80">Your Score: {results.finalScore.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-400">{results.finalScore.toLocaleString()}</div>
                <div className="text-white/80">Final Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{results.rank}</div>
              <div className="text-sm text-white/80">Current Rank</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{results.totalPlayers}</div>
              <div className="text-sm text-white/80">Total Players</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{results.gamesPlayed}</div>
              <div className="text-sm text-white/80">Games Played</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{results.cycleTimeRemaining}</div>
              <div className="text-sm text-white/80">Time Left</div>
            </CardContent>
          </Card>
        </div>

        {/* Score Breakdown */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white">Base Score:</span>
                <span className="text-green-400 font-bold">{results.playerScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white">Bonus Points:</span>
                <span className="text-yellow-400 font-bold">+{results.bonusPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white">Numbers Called:</span>
                <span className="text-blue-400 font-bold">{results.numbersCalled}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white">Penalties:</span>
                <span className="text-red-400 font-bold">-{results.penalties.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Final Score:</span>
                <span className="text-3xl font-bold text-yellow-400">{results.finalScore.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Leaderboard Preview */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Tournament Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="text-white font-bold">Best Score</div>
                    <div className="text-yellow-400 text-sm">Current Leader</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-400">{results.bestScore.toLocaleString()}</div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="text-white font-bold">Average Score</div>
                    <div className="text-gray-400 text-sm">All Players</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{results.averageScore.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          
          <Button
            onClick={onBackToTournaments}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Tournaments
          </Button>
        </div>

        {/* Tournament Info */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="text-lg font-bold text-white mb-2">Tournament Cycle Information</h4>
              <p className="text-white/80 text-sm">
                This tournament cycle ends in <span className="font-bold text-yellow-400">{results.cycleTimeRemaining}</span>
              </p>
              <p className="text-white/60 text-xs mt-2">
                Final rankings and prize distribution will be calculated when the cycle ends.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentResultsScreen;
