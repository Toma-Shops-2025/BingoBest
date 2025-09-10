import React from 'react';
import { Achievement } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Gift } from 'lucide-react';

interface AchievementSystemProps {
  achievements: Achievement[];
  onClaimReward: (achievementId: string) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  onClaimReward
}) => {
  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'wins': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'games': return <Target className="w-5 h-5 text-blue-500" />;
      case 'money': return <Gift className="w-5 h-5 text-green-500" />;
      case 'special': return <Star className="w-5 h-5 text-purple-500" />;
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Achievements
        </h2>
        <Badge variant="secondary">
          {unlockedAchievements.length}/{achievements.length} Unlocked
        </Badge>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-600">Unlocked</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(achievement.category)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">{achievement.name}</h4>
                      <p className="text-sm text-green-600">{achievement.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-green-500">+${achievement.reward}</Badge>
                        <span className="text-xs text-green-500">✓ Completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-3">In Progress</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {lockedAchievements.map((achievement) => (
            <Card key={achievement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getCategoryIcon(achievement.category)}
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.requirement}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.requirement) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">Reward: ${achievement.reward}</Badge>
                        <span className="text-xs text-gray-500 capitalize">
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;