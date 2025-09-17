import React, { useState } from 'react';
import { Friend } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, MessageCircle, Play } from 'lucide-react';

interface FriendsSystemProps {
  friends: Friend[];
  onAddFriend: (username: string) => void;
  onInviteToGame: (friendId: string) => void;
  onSendMessage: (friendId: string) => void;
}

const FriendsSystem: React.FC<FriendsSystemProps> = ({
  friends,
  onAddFriend,
  onInviteToGame,
  onSendMessage
}) => {
  const [searchUsername, setSearchUsername] = useState('');

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const handleAddFriend = () => {
    if (searchUsername.trim()) {
      onAddFriend(searchUsername.trim());
      setSearchUsername('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Friends ({friends.length})</h2>
        </div>
      </div>

      {/* Main Friends Card */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-purple-500/20"
          style={{
            backgroundImage: `url('/friends-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 backdrop-blur-sm" />
        
        <div className="relative z-10">
          <CardContent className="p-6 space-y-6">
            {/* Add Friend Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white drop-shadow-lg">Add New Friend</h3>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter username..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                    className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30 focus:border-white/50"
                  />
                </div>
                <Button 
                  onClick={handleAddFriend} 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Friends List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`relative overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 ${
                    friend.status === 'online'
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-green-500/20'
                      : friend.status === 'playing'
                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/50 shadow-blue-500/20'
                      : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/50 shadow-gray-500/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                  
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                            friend.status === 'online'
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : friend.status === 'playing'
                              ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-500'
                          }`}>
                            {friend.avatar ? (
                              <img src={friend.avatar} alt="" className="w-12 h-12 rounded-full" />
                            ) : (
                              <span className="text-lg font-bold text-white">
                                {friend.username.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div 
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(friend.status)}`}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-white drop-shadow-lg truncate">
                            {friend.username}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                              friend.status === 'online'
                                ? 'bg-green-500/30 text-green-200 border border-green-400/50'
                                : friend.status === 'playing'
                                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                                : 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                            }`}>
                              {friend.status === 'online' && '🟢 Online'}
                              {friend.status === 'playing' && '🎮 Playing'}
                              {friend.status === 'offline' && '⚫ Offline'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => onSendMessage(friend.id)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                          title="Send Message"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </Button>
                        {friend.status === 'online' && (
                          <Button
                            onClick={() => onInviteToGame(friend.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                            title="Invite to Game"
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {friends.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-4">No Friends Yet</h3>
                <p className="text-lg text-white/90 font-medium drop-shadow-md">Add friends to play together and have more fun!</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default FriendsSystem;