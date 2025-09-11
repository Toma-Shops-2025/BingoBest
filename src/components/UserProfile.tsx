import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Trophy, Star, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

interface UserStats {
  totalGamesPlayed: number;
  totalWinnings: number;
  gamesWon: number;
  winRate: number;
  favoriteRoom: string;
  joinDate: string;
  lastPlayed: string;
  achievements: number;
  level: number;
  experience: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onClose }) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    notifications: true,
    soundEnabled: true,
    theme: 'light'
  });

  useEffect(() => {
    fetchUserProfile();
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Profile loading timeout, using defaults');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch user data, but don't fail if user doesn't exist in users table
      let userData = null;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!error) {
          userData = data;
        }
      } catch (userError) {
        console.log('User not found in users table, using defaults');
      }

      // Try to fetch game statistics, but don't fail if table doesn't exist
      let gameStats = [];
      try {
        const { data, error } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', userId);
        
        if (!error && data) {
          gameStats = data;
        }
      } catch (statsError) {
        console.log('Game sessions table not found, using defaults');
      }

      // Calculate statistics
      const totalGames = gameStats?.length || 0;
      const gamesWon = gameStats?.filter(session => session.won).length || 0;
      const totalWinnings = gameStats?.reduce((sum, session) => sum + (session.winnings || 0), 0) || 0;
      const winRate = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;

      setUserStats({
        totalGamesPlayed: totalGames,
        totalWinnings,
        gamesWon,
        winRate,
        favoriteRoom: 'Speed Bingo',
        joinDate: userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Today',
        lastPlayed: gameStats?.[0]?.created_at ? new Date(gameStats[0].created_at).toLocaleDateString() : 'Never',
        achievements: 0,
        level: Math.floor(totalWinnings / 100) + 1,
        experience: totalWinnings % 100
      });

      setFormData({
        displayName: userData?.display_name || 'Player1',
        bio: userData?.bio || 'Welcome to BingoBest!',
        notifications: userData?.notifications_enabled ?? true,
        soundEnabled: userData?.sound_enabled ?? true,
        theme: userData?.theme || 'light'
      });

    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Set default values if everything fails
      setUserStats({
        totalGamesPlayed: 0,
        totalWinnings: 0,
        gamesWon: 0,
        winRate: 0,
        favoriteRoom: 'Speed Bingo',
        joinDate: 'Today',
        lastPlayed: 'Never',
        achievements: 0,
        level: 1,
        experience: 0
      });

      setFormData({
        displayName: 'Player1',
        bio: 'Welcome to BingoBest!',
        notifications: true,
        soundEnabled: true,
        theme: 'light'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          notifications_enabled: formData.notifications,
          sound_enabled: formData.soundEnabled,
          theme: formData.theme
        })
        .eq('id', userId);

      if (error) throw error;

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6" />
            User Profile
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Display Name</Label>
                      <Input
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleSaveProfile}>
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        Level
                      </span>
                      <Badge variant="secondary">{userStats?.level || 1}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-purple-500" />
                        Experience
                      </span>
                      <span>{userStats?.experience || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        Total Winnings
                      </span>
                      <span className="font-bold text-green-600">
                        ${userStats?.totalWinnings?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Game Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Games Played</span>
                      <Badge>{userStats?.totalGamesPlayed || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Games Won</span>
                      <Badge variant="secondary">{userStats?.gamesWon || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate</span>
                      <Badge variant="outline">{userStats?.winRate?.toFixed(1) || 0}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Winnings</span>
                      <span className="font-bold text-green-600">
                        ${userStats?.totalWinnings?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Join Date
                      </span>
                      <span>{userStats?.joinDate || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Played</span>
                      <span>{userStats?.lastPlayed || 'Never'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Favorite Room</span>
                      <span>{userStats?.favoriteRoom || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Achievements</span>
                      <Badge>{userStats?.achievements || 0}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Level Progress</span>
                        <span>{userStats?.experience || 0}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${userStats?.experience || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {100 - (userStats?.experience || 0)} more experience to next level
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications for game events</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-gray-600">Play sounds during games</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.soundEnabled}
                      onChange={(e) => setFormData({...formData, soundEnabled: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div>
                    <Label>Theme</Label>
                    <select
                      value={formData.theme}
                      onChange={(e) => setFormData({...formData, theme: e.target.value})}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      Save Settings
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
