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

  const getEventStatus = (event: SeasonalEvent) => {
    const now = new Date();
    if (now < event.startDate) {
      return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    } else if (now >= event.startDate && now <= event.endDate) {
      return { status: 'active', color: 'green', text: 'Active' };
    } else {
      return { status: 'ended', color: 'gray', text: 'Ended' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Star className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Seasonal Events</h2>
        </div>
      </div>

      <div className="grid gap-6">
        {events.map((event) => {
          const eventStatus = getEventStatus(event);
          return (
            <Card key={event.id} className="relative overflow-hidden border-0 shadow-2xl">
              {/* Dynamic Background */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: eventStatus.status === 'active' 
                    ? `linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2)), url('/event-background.jpg')`
                    : eventStatus.status === 'upcoming'
                    ? `linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2)), url('/event-background.jpg')`
                    : `linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.2)), url('/event-background.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <div className={`absolute inset-0 backdrop-blur-sm ${
                eventStatus.status === 'active' 
                  ? 'bg-gradient-to-br from-green-500/30 to-emerald-600/30'
                  : eventStatus.status === 'upcoming'
                  ? 'bg-gradient-to-br from-blue-500/30 to-indigo-600/30'
                  : 'bg-gradient-to-br from-gray-500/30 to-slate-600/30'
              }`} />
              
              <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${
                          eventStatus.status === 'active' 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : eventStatus.status === 'upcoming'
                            ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            : 'bg-gradient-to-r from-gray-400 to-slate-500'
                        } shadow-lg`}>
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold text-white drop-shadow-lg truncate">
                            {event.name}
                          </CardTitle>
                          <p className="text-sm text-white/90 font-medium drop-shadow-md mt-1">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        eventStatus.status === 'active' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : eventStatus.status === 'upcoming'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                      }`}>
                        {eventStatus.status === 'active' && <Clock className="w-4 h-4" />}
                        {eventStatus.status === 'upcoming' && <Calendar className="w-4 h-4" />}
                        {eventStatus.status === 'ended' && <Calendar className="w-4 h-4" />}
                        {eventStatus.text}
                      </div>
                      
                      <div className="mt-2 text-sm text-white/80 font-medium">
                        <div className="flex items-center gap-1 justify-end">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                        </div>
                        {eventStatus.status === 'active' && (
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <Clock className="w-4 h-4" />
                            <span>{getDaysRemaining(event.endDate)} days left</span>
                          </div>
                        )}
                        {eventStatus.status === 'upcoming' && (
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <Clock className="w-4 h-4" />
                            <span>Starts in {Math.ceil((event.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white drop-shadow-lg">Event Rewards</h4>
                    </div>
                    
                    <div className="grid gap-3">
                      {event.rewards.map((reward) => (
                        <div
                          key={reward.id}
                          className={`relative overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 ${
                            reward.claimed 
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-green-500/20'
                              : eventStatus.status === 'active'
                              ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/50 shadow-blue-500/20'
                              : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/50 shadow-gray-500/20'
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                          
                          <div className="relative z-10 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`p-2 rounded-full ${
                                    reward.claimed 
                                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                      : eventStatus.status === 'active'
                                      ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                      : 'bg-gradient-to-r from-gray-400 to-slate-500'
                                  } shadow-lg`}>
                                    <Star className="w-4 h-4 text-white" />
                                  </div>
                                  <h5 className="text-lg font-bold text-white drop-shadow-lg">
                                    {reward.name}
                                  </h5>
                                </div>
                                <p className="text-sm text-white/90 font-medium drop-shadow-md mb-2">
                                  {reward.description}
                                </p>
                                <p className="text-xs text-white/70 font-medium drop-shadow-sm">
                                  {reward.requirement}
                                </p>
                              </div>
                              
                              <div className="flex-shrink-0 text-right">
                                <div className="flex flex-col items-end gap-2">
                                  <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                    reward.claimed 
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                  }`}>
                                    ${reward.reward}
                                  </div>
                                  
                                  <div className="flex items-center gap-1 text-xs text-white/80">
                                    <span>⚠️</span>
                                    <span>Non-withdrawable</span>
                                  </div>
                                  
                                  {reward.claimed ? (
                                    <div className="flex items-center gap-1 text-xs text-green-300 font-bold">
                                      <span>✓</span>
                                      <span>Claimed</span>
                                    </div>
                                  ) : eventStatus.status === 'active' ? (
                                    <Button
                                      size="sm"
                                      onClick={() => onClaimReward(event.id, reward.id)}
                                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                      Claim Reward
                                    </Button>
                                  ) : eventStatus.status === 'upcoming' ? (
                                    <div className="flex items-center gap-1 text-xs text-blue-300 font-bold">
                                      <Calendar className="w-3 h-3" />
                                      <span>Event not started</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-xs text-gray-300 font-bold">
                                      <Clock className="w-3 h-3" />
                                      <span>Event ended</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="relative overflow-hidden rounded-xl border-0 shadow-2xl">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-red-500/20"
            style={{
              backgroundImage: `url('/event-background.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/30 backdrop-blur-sm" />
          
          <div className="relative z-10 text-center py-16 px-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-4">No Active Events</h3>
            <p className="text-lg text-white/90 font-medium drop-shadow-md">Check back soon for exciting seasonal events!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonalEvents;