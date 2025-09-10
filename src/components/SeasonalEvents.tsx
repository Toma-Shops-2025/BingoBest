import React from 'react';
import { SeasonalEvent } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Gift, Star, Clock } from 'lucide-react';

interface SeasonalEventsProps {
  events: SeasonalEvent[];
  onClaimReward: (eventId: string, rewardId: string) => void;
}

const SeasonalEvents: React.FC<SeasonalEventsProps> = ({
  events,
  onClaimReward
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Star className="text-yellow-500" />
        <h2 className="text-2xl font-bold">Seasonal Events</h2>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className={`${event.active ? 'border-yellow-300 bg-yellow-50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {event.name}
                    {event.active && <Badge className="bg-yellow-500">Active</Badge>}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                  {event.active && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {getDaysRemaining(event.endDate)} days left
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-500" />
                  Event Rewards
                </h4>
                {event.rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-3 rounded-lg border ${
                      reward.claimed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{reward.name}</h5>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{reward.requirement}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={reward.claimed ? "default" : "outline"}
                          className={reward.claimed ? "bg-green-500" : ""}
                        >
                          ${reward.reward}
                        </Badge>
                        {reward.claimed ? (
                          <p className="text-xs text-green-600 mt-1">✓ Claimed</p>
                        ) : event.active ? (
                          <Button
                            size="sm"
                            onClick={() => onClaimReward(event.id, reward.id)}
                            className="mt-2"
                          >
                            Claim
                          </Button>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">Event ended</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Active Events</h3>
          <p>Check back soon for exciting seasonal events!</p>
        </div>
      )}
    </div>
  );
};

export default SeasonalEvents;