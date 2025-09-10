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

  const progressToNext = currentTier < 5 ? (player.gamesPlayed / nextTierRequirement) * 100 : 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Crown className="text-yellow-500" />
        <h2 className="text-2xl font-bold">VIP Status</h2>
      </div>

      {/* Current VIP Status */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className={tierColors[currentTier as keyof typeof tierColors]} />
              <span>{tierNames[currentTier as keyof typeof tierNames]}</span>
            </div>
            <Badge className="bg-yellow-500">Tier {currentTier}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentTier < 5 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {tierNames[(currentTier + 1) as keyof typeof tierNames]}</span>
                <span>{player.gamesPlayed}/{nextTierRequirement} games</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{player.wins}</p>
              <p className="text-sm text-gray-600">Total Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">${player.balance}</p>
              <p className="text-sm text-gray-600">Balance</p>
            </div>
          </div>

          {currentTier < 5 && (
            <Button onClick={onUpgradeVIP} className="w-full bg-yellow-500 hover:bg-yellow-600">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade VIP Status
            </Button>
          )}
        </CardContent>
      </Card>

      {/* VIP Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="text-green-500" />
            VIP Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {vipBenefits.map((benefit) => (
              <div
                key={benefit.id}
                className={`p-3 rounded-lg border ${
                  benefit.active && currentTier >= benefit.tier
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {benefit.name}
                      <Badge variant="outline" size="sm">
                        Tier {benefit.tier}+
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                  <div>
                    {benefit.active && currentTier >= benefit.tier ? (
                      <Badge className="bg-green-500">
                        <Star className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : currentTier < benefit.tier ? (
                      <Badge variant="outline">
                        Tier {benefit.tier} Required
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VIPSystem;