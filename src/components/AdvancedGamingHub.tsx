import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedTournaments from './AdvancedTournaments';
import EnhancedAchievements from './EnhancedAchievements';
import SkillBasedMatchmaking from './SkillBasedMatchmaking';
import GameModeVariations from './GameModeVariations';
import SeasonalChallenges from './SeasonalChallenges';
import AdvancedPowerUps from './AdvancedPowerUps';
import { Trophy, Target, Zap, Calendar, Crown, Star } from 'lucide-react';

const AdvancedGamingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tournaments');

  const hubStats = {
    totalPlayers: 15847,
    activeTournaments: 12,
    completedAchievements: 342,
    seasonalEventsActive: 3
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced Gaming Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the ultimate bingo gaming with advanced tournaments, skill-based matchmaking, 
            seasonal challenges, and enhanced achievements system.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{hubStats.totalPlayers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{hubStats.activeTournaments}</div>
              <div className="text-sm text-gray-600">Active Tournaments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{hubStats.completedAchievements}</div>
              <div className="text-sm text-gray-600">Achievements Unlocked</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{hubStats.seasonalEventsActive}</div>
              <div className="text-sm text-gray-600">Seasonal Events</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="tournaments" className="flex items-center gap-1">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Tournaments</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="matchmaking" className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Ranked</span>
            </TabsTrigger>
            <TabsTrigger value="modes" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Game Modes</span>
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Seasonal</span>
            </TabsTrigger>
            <TabsTrigger value="powerups" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Power-Ups</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-6">
            <AdvancedTournaments />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <EnhancedAchievements />
          </TabsContent>

          <TabsContent value="matchmaking" className="space-y-6">
            <SkillBasedMatchmaking />
          </TabsContent>

          <TabsContent value="modes" className="space-y-6">
            <GameModeVariations />
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <SeasonalChallenges />
          </TabsContent>

          <TabsContent value="powerups" className="space-y-6">
            <AdvancedPowerUps />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500">
                Join Quick Match
              </Button>
              <Button size="lg" variant="outline">
                Create Tournament
              </Button>
              <Button size="lg" variant="outline">
                View Leaderboards
              </Button>
              <Button size="lg" variant="outline">
                Shop Power-Ups
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedGamingHub;