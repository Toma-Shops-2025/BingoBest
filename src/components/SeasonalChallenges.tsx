import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Gift, Star, Clock, Snowflake, Sun, Leaf, Flower } from 'lucide-react';

interface SeasonalChallenge {
  id: string;
  name: string;
  description: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Holiday';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
  progress: number;
  requirement: number;
  reward: {
    coins: number;
    items: string[];
    title?: string;
  };
  timeLeft: string;
  completed: boolean;
}

const SeasonalChallenges: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const challenges: SeasonalChallenge[] = [
    {
      id: '1',
      name: 'Winter Wonderland',
      description: 'Win 25 games during the winter season',
      season: 'Winter',
      difficulty: 'Medium',
      progress: 18,
      requirement: 25,
      reward: {
        coins: 500,
        items: ['Snowflake Card Back', 'Winter Avatar Frame'],
        title: 'Frost Master'
      },
      timeLeft: '12 days',
      completed: false
    },
    {
      id: '2',
      name: 'Holiday Spirit',
      description: 'Play bingo on 10 different holiday dates',
      season: 'Holiday',
      difficulty: 'Hard',
      progress: 7,
      requirement: 10,
      reward: {
        coins: 1000,
        items: ['Holiday Emote Pack', 'Festive Number Caller'],
        title: 'Holiday Hero'
      },
      timeLeft: '5 days',
      completed: false
    },
    {
      id: '3',
      name: 'Spring Awakening',
      description: 'Complete 50 patterns in spring-themed games',
      season: 'Spring',
      difficulty: 'Easy',
      progress: 50,
      requirement: 50,
      reward: {
        coins: 300,
        items: ['Flower Power Card', 'Spring Breeze Effect']
      },
      timeLeft: 'Completed',
      completed: true
    },
    {
      id: '4',
      name: 'Summer Heat Wave',
      description: 'Win 3 speed bingo games in under 5 minutes each',
      season: 'Summer',
      difficulty: 'Legendary',
      progress: 1,
      requirement: 3,
      reward: {
        coins: 2000,
        items: ['Solar Flare Card Back', 'Heat Wave Animation', 'Summer Crown'],
        title: 'Speed Demon'
      },
      timeLeft: '45 days',
      completed: false
    },
    {
      id: '5',
      name: 'Autumn Harvest',
      description: 'Collect 100 bonus coins from fall games',
      season: 'Fall',
      difficulty: 'Medium',
      progress: 75,
      requirement: 100,
      reward: {
        coins: 400,
        items: ['Maple Leaf Dauber', 'Harvest Moon Background']
      },
      timeLeft: '28 days',
      completed: false
    }
  ];

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'Spring': return <Flower className="w-5 h-5 text-pink-500" />;
      case 'Summer': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'Fall': return <Leaf className="w-5 h-5 text-orange-500" />;
      case 'Winter': return <Snowflake className="w-5 h-5 text-blue-500" />;
      case 'Holiday': return <Gift className="w-5 h-5 text-red-500" />;
      default: return <Star className="w-5 h-5 text-purple-500" />;
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'Spring': return 'bg-pink-500';
      case 'Summer': return 'bg-yellow-500';
      case 'Fall': return 'bg-orange-500';
      case 'Winter': return 'bg-blue-500';
      case 'Holiday': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-orange-500';
      case 'Legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredChallenges = selectedSeason === 'all' 
    ? challenges 
    : challenges.filter(c => c.season === selectedSeason);

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-purple-500" />
          Seasonal Challenges
        </h2>
        <Badge variant="secondary">
          {completedCount}/{challenges.length} Completed
        </Badge>
      </div>

      {/* Season Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Spring', 'Summer', 'Fall', 'Winter', 'Holiday'].map((season) => (
          <Button
            key={season}
            variant={selectedSeason === season ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeason(season)}
            className="capitalize flex items-center gap-1"
          >
            {season !== 'all' && getSeasonIcon(season)}
            {season}
          </Button>
        ))}
      </div>

      {/* Challenge Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            className={`hover:shadow-lg transition-all duration-300 ${
              challenge.completed ? 'bg-green-50 border-green-200' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getSeasonIcon(challenge.season)}
                  <CardTitle className="text-lg">{challenge.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Badge className={`${getSeasonColor(challenge.season)} text-white text-xs`}>
                    {challenge.season}
                  </Badge>
                  <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white text-xs`}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!challenge.completed && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.requirement}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.requirement) * 100}
                    className="h-2"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rewards:</span>
                  <Badge className="bg-yellow-500 text-white">
                    {challenge.reward.coins} coins
                  </Badge>
                </div>
                
                <ul className="text-xs text-gray-600 space-y-1">
                  {challenge.reward.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <Gift className="w-3 h-3 text-blue-500" />
                      {item}
                    </li>
                  ))}
                  {challenge.reward.title && (
                    <li className="flex items-center gap-1 text-purple-600 font-medium">
                      <Star className="w-3 h-3" />
                      Title: "{challenge.reward.title}"
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className={challenge.completed ? 'text-green-600' : 'text-orange-600'}>
                    {challenge.timeLeft}
                  </span>
                </div>
                {challenge.completed && (
                  <Badge className="bg-green-500 text-white">
                    ✓ Completed
                  </Badge>
                )}
              </div>

              {!challenge.completed && (
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events Teaser */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
            <Star className="text-yellow-500" />
            Coming Soon: Valentine's Day Event
          </h3>
          <p className="text-gray-600 mb-4">
            Special romantic-themed challenges with exclusive rewards starting February 1st!
          </p>
          <Badge variant="outline" className="text-pink-600 border-pink-300">
            14 days remaining
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalChallenges;