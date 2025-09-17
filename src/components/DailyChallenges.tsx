import React from 'react';
import { DailyChallenge } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Gift, Clock } from 'lucide-react';

interface DailyChallengesProps {
  challenges: DailyChallenge[];
  onClaimReward: (challengeId: string) => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({
  challenges,
  onClaimReward
}) => {
  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Daily Challenges</h2>
        </div>
      </div>

      {/* Current Date Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Calendar className="w-5 h-5" />
          <span className="font-bold text-lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Main Challenges Card */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-red-500/20"
          style={{
            backgroundImage: `url('/challenges-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/30 backdrop-blur-sm" />
        
        <div className="relative z-10">
          <CardContent className="p-6 space-y-6">

            {challenges.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg mb-6">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-4">No Daily Challenges Available</h3>
                <p className="text-lg text-white/90 font-medium drop-shadow-md">Check back tomorrow for new challenges!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`relative overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 ${
                      challenge.completed 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-green-500/20'
                        : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/50 shadow-blue-500/20'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                    
                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-full ${
                              challenge.completed 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            } shadow-lg`}>
                              <Gift className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white drop-shadow-lg">
                              {challenge.name}
                            </h4>
                          </div>
                          <p className="text-sm text-white/90 font-medium drop-shadow-md mb-3">
                            {challenge.description}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {challenge.completed ? (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg">
                              <Gift className="w-4 h-4" />
                              <span className="font-bold">Completed</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg">
                              <Clock className="w-4 h-4" />
                              <span className="font-bold">{formatTimeRemaining(challenge.expiresAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white font-medium">Progress</span>
                          <span className="text-white font-bold">{challenge.progress}/{challenge.requirement}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              challenge.completed 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            }`}
                            style={{ width: `${(challenge.progress / challenge.requirement) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Reward Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                            challenge.completed 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          }`}>
                            Reward: ${challenge.reward}
                          </div>
                          <p className="text-xs text-white/70 font-medium mt-2">
                            ⚠️ Rewards are non-withdrawable - for gameplay only
                          </p>
                        </div>
                        
                        {challenge.completed && (
                          <Button
                            onClick={() => onClaimReward(challenge.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Gift className="w-5 h-5 mr-2" />
                            Claim Reward
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default DailyChallenges;