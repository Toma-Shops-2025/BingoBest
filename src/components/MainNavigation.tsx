import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Trophy, 
  Target, 
  Calendar, 
  Users, 
  Star, 
  Crown, 
  Eye 
} from 'lucide-react';

interface MainNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadChallenges: number;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadChallenges
}) => {
  const navItems = [
    { id: 'home', label: 'Game Rooms', icon: Home },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Target },
    { id: 'challenges', label: 'Daily', icon: Calendar, badge: unreadChallenges },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'events', label: 'Events', icon: Star },
    { id: 'vip', label: 'VIP', icon: Crown },
    { id: 'spectate', label: 'Watch', icon: Eye }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className="flex items-center gap-2 whitespace-nowrap relative"
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;