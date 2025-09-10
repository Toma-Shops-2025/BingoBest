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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="text-blue-500" />
          Daily Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`p-4 rounded-lg border ${
              challenge.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{challenge.name}</h4>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
              {challenge.completed ? (
                <Badge className="bg-green-500">
                  <Gift className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeRemaining(challenge.expiresAt)}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{challenge.progress}/{challenge.requirement}</span>
              </div>
              <Progress 
                value={(challenge.progress / challenge.requirement) * 100}
                className="h-2"
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-green-600">
                Reward: ${challenge.reward}
              </Badge>
              {challenge.completed && (
                <Button
                  size="sm"
                  onClick={() => onClaimReward(challenge.id)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Claim Reward
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyChallenges;