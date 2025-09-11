import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Target, Star, Zap } from 'lucide-react';

const GameInstructions: React.FC = () => {
  const winningPatterns = [
    { name: 'Line', description: 'Complete any horizontal, vertical, or diagonal line', prize: '$50' },
    { name: '4 CORNERS', description: 'Mark all four corner squares', prize: '$25' },
    { name: 'X', description: 'Mark both diagonal lines forming an X', prize: '$75' },
    { name: 'Full House', description: 'Mark all 25 squares on your card', prize: '$200' }
  ];

  const powerUps = [
    { name: 'Auto Dab', description: 'Automatically mark called numbers', cost: '$5' },
    { name: 'Extra Ball', description: 'Get an extra number call', cost: '$10' },
    { name: 'Double Win', description: 'Double your next win amount', cost: '$15' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          How to Play BingoBest
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Rules */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Basic Rules
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Numbers are called randomly and appear in the center display</li>
            <li>• Mark numbers on your card when they're called</li>
            <li>• Complete winning patterns to win cash prizes</li>
            <li>• Each game lasts 5 minutes or until someone wins</li>
            <li>• Multiple players can win in the same game</li>
          </ul>
        </div>

        {/* Winning Patterns */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Winning Patterns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {winningPatterns.map((pattern, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{pattern.name}</span>
                  <Badge variant="success">{pattern.prize}</Badge>
                </div>
                <p className="text-sm text-gray-600">{pattern.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Power-Ups */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Power-Ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {powerUps.map((powerUp, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{powerUp.name}</span>
                  <Badge variant="warning">{powerUp.cost}</Badge>
                </div>
                <p className="text-sm text-gray-600">{powerUp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-purple-800">Pro Tips</h3>
          <ul className="space-y-1 text-sm text-purple-700">
            <li>• Watch for multiple patterns simultaneously</li>
            <li>• Use power-ups strategically during busy games</li>
            <li>• Play during peak hours for bigger prize pools</li>
            <li>• Check your balance regularly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameInstructions;