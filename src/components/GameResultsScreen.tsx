import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star, Gift, Home, RotateCcw } from 'lucide-react';

interface GameResults {
  playerScore: number;
  totalNumbersCalled: number;
  patternsCompleted: string[];
  bonusPoints: number;
  penalties: number;
  finalScore: number;
  rank: number;
  totalPlayers: number;
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  celebration: boolean;
}

interface GameResultsScreenProps {
  results: GameResults;
  onPlayAgain: () => void;
  onBackToGameRoom: () => void;
}

const GameResultsScreen: React.FC<GameResultsScreenProps> = ({
  results,
  onPlayAgain,
  onBackToGameRoom
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (results.celebration) {
      setShowCelebration(true);
      setShowFireworks(true);
      
      // Hide fireworks after 5 seconds
      setTimeout(() => setShowFireworks(false), 5000);
    }
  }, [results.celebration]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return <Star className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-400 to-amber-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRankText = (rank: number) => {
    switch (rank) {
      case 1: return '1st Place - CHAMPION!';
      case 2: return '2nd Place - Runner Up!';
      case 3: return '3rd Place - Bronze!';
      default: return `${rank}th Place`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Fireworks Animation */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-green-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-purple-400 rounded-full animate-ping delay-500"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="casino-card border-2 border-gold-400">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              🎉 GAME RESULTS 🎉
            </CardTitle>
            <p className="text-xl text-gray-300">Speed Bingo Complete!</p>
          </CardHeader>
        </Card>

        {/* Player Rank & Score */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-4">
              {getRankIcon(results.rank)}
              <span className={`text-3xl font-bold bg-gradient-to-r ${getRankColor(results.rank)} bg-clip-text text-transparent`}>
                {getRankText(results.rank)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-yellow-400">
              {results.finalScore.toLocaleString()}
            </div>
            <p className="text-xl text-gray-300">Final Score</p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {results.totalPlayers} Players Total
            </Badge>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 p-4 rounded-lg border border-green-400/50">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 font-semibold">Base Score:</span>
                  <span className="text-green-400 font-bold text-xl">{results.playerScore.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/50">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 font-semibold">Bonus Points:</span>
                  <span className="text-blue-400 font-bold text-xl">+{results.bonusPoints.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/50">
                <div className="flex justify-between items-center">
                  <span className="text-red-300 font-semibold">Penalties:</span>
                  <span className="text-red-400 font-bold text-xl">-{results.penalties.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/50">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-300 font-semibold">Numbers Called:</span>
                  <span className="text-yellow-400 font-bold text-xl">{results.totalNumbersCalled}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Action Buttons */}
        <Card className="casino-card">
          <CardContent className="text-center py-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onPlayAgain}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Play Again
              </Button>
              
              <Button
                onClick={onBackToGameRoom}
                variant="outline"
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Home className="w-6 h-6" />
                Back to Game Room
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Celebration Message */}
        {showCelebration && (
          <Card className="casino-card border-2 border-yellow-400 animate-pulse">
            <CardContent className="text-center py-8">
              <div className="text-4xl mb-4">🎉🎊🎉</div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-2">
                Congratulations!
              </h3>
              <p className="text-xl text-gray-300">
                You've completed an amazing game of Speed Bingo!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GameResultsScreen;
