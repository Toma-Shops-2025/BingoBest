import React from 'react';
import { VIPBenefit, Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Gift, Zap } from 'lucide-react';

interface VIPSystemProps {
  player: Player;
  vipBenefits: VIPBenefit[];
  currentTier: number;
  nextTierRequirement: number;
  onUpgradeVIP: () => void;
}

const VIPSystem: React.FC<VIPSystemProps> = ({
  player,
  vipBenefits,
  currentTier,
  nextTierRequirement,
  onUpgradeVIP
}) => {
  const tierColors = {
    0: 'text-gray-500',
    1: 'text-blue-500',
    2: 'text-purple-500',
    3: 'text-yellow-500',
    4: 'text-orange-500',
    5: 'text-red-500'
  };

  const tierNames = {
    0: 'Regular',
    1: 'Bronze VIP',
    2: 'Silver VIP', 
    3: 'Gold VIP',
    4: 'Platinum VIP',
    5: 'Diamond VIP'
  };

  const progressToNext = currentTier < 5 ? ((player.gamesPlayed || 0) / nextTierRequirement) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* VIP Status Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Crown className="w-6 h-6" />
        <h2 className="text-2xl font-bold">VIP Status</h2>
        </div>
      </div>

      {/* Current VIP Status */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20"
          style={{
            backgroundImage: `url('/vip-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-600/30 backdrop-blur-sm" />
        
        <div className="relative z-10">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${currentTier === 0 ? 'from-gray-400 to-gray-600' : currentTier === 1 ? 'from-yellow-400 to-yellow-600' : currentTier === 2 ? 'from-blue-400 to-blue-600' : currentTier === 3 ? 'from-purple-400 to-purple-600' : currentTier === 4 ? 'from-orange-400 to-orange-600' : 'from-red-400 to-red-600'} shadow-lg`}>
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                  {tierNames[currentTier as keyof typeof tierNames]}
                </h3>
                <div className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {`Tier ${currentTier}`}
                </div>
              </div>
            </div>
        </CardHeader>
          
          <CardContent className="space-y-6">
          {currentTier < 5 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-white font-medium">Progress to {tierNames[(currentTier + 1) as keyof typeof tierNames]}</span>
                  <span className="text-white font-bold">{player.gamesPlayed || 0}/{nextTierRequirement} games</span>
                </div>
                <Progress 
                  value={progressToNext} 
                  className="h-4 bg-white/20" 
                  style={{
                    background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)'
                  }}
                />
            </div>
          )}

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold text-white drop-shadow-lg">{player.wins || 0}</p>
                <p className="text-sm text-white/80 font-medium">Total Wins</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold text-green-300 drop-shadow-lg">${(player.balance || 0).toFixed(2)}</p>
                <p className="text-sm text-white/80 font-medium">Balance</p>
            </div>
          </div>

          {currentTier < 5 && (
              <Button 
                onClick={onUpgradeVIP} 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
              Upgrade VIP Status
            </Button>
          )}
        </CardContent>
        </div>
      </Card>

      {/* VIP Benefits */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-500/20 to-teal-500/20"
          style={{
            backgroundImage: `url('/benefits-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-600/30 backdrop-blur-sm" />
        
        <div className="relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg mb-4">
              <Gift className="w-6 h-6" />
              <CardTitle className="text-2xl font-bold">VIP Benefits</CardTitle>
            </div>
        </CardHeader>
          
        <CardContent>
            <div className="grid gap-4">
              {vipBenefits.map((benefit, index) => (
              <div
                key={benefit.id}
                  className={`relative overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 ${
                  benefit.active && currentTier >= benefit.tier
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-green-500/20'
                      : currentTier < benefit.tier
                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/50 shadow-blue-500/20'
                      : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/50 shadow-gray-500/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                  
                  <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${
                            benefit.active && currentTier >= benefit.tier
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : currentTier < benefit.tier
                              ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-500'
                          } shadow-lg`}>
                            <Gift className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white drop-shadow-lg">
                      {benefit.name}
                          </h4>
                          <div 
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              benefit.active && currentTier >= benefit.tier
                                ? 'bg-green-500/30 text-green-200 border-green-400/50'
                                : currentTier < benefit.tier
                                ? 'bg-blue-500/30 text-blue-200 border-blue-400/50'
                                : 'bg-gray-500/30 text-gray-200 border-gray-400/50'
                            }`}
                          >
                            {`Tier ${benefit.tier}+`}
                          </div>
                        </div>
                        <p className="text-sm text-white/90 font-medium drop-shadow-md">
                          {benefit.description}
                        </p>
                  </div>
                      
                      <div className="flex-shrink-0">
                    {benefit.active && currentTier >= benefit.tier ? (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg">
                            <Star className="w-4 h-4" />
                            <span className="font-bold">Active</span>
                          </div>
                    ) : currentTier < benefit.tier ? (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg">
                            <Crown className="w-4 h-4" />
                            <span className="font-bold">Tier {benefit.tier} Required</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white px-4 py-2 rounded-full shadow-lg">
                            <Zap className="w-4 h-4" />
                            <span className="font-bold">Inactive</span>
                          </div>
                        )}
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default VIPSystem;