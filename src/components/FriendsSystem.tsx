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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-blue-500" />
          Friends ({friends.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Friend */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
          />
          <Button onClick={handleAddFriend} size="sm">
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>

        {/* Friends List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-sm font-medium">
                        {friend.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{friend.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{friend.status}</p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSendMessage(friend.id)}
                  className="p-1 h-7 w-7"
                >
                  <MessageCircle className="w-3 h-3" />
                </Button>
                {friend.status === 'online' && (
                  <Button
                    size="sm"
                    onClick={() => onInviteToGame(friend.id)}
                    className="p-1 h-7 w-7"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {friends.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No friends yet</p>
            <p className="text-sm">Add friends to play together!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsSystem;