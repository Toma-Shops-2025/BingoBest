import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Coins, Zap } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface MiniGame {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxWin: number;
  icon: React.ReactNode;
}

const LiveGameFeed: React.FC = () => {
  const [diceResult, setDiceResult] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{
    dice: number;
    win: number;
    time: string;
  }>>([]);
  
  const { playDiceRoll, playWin, playButtonClick } = useSoundEffects();

  const miniGames: MiniGame[] = [
    {
      id: '1',
      name: 'Lucky Dice Roll',
      description: 'Roll the dice and win instant prizes!',
      cost: 10,
      maxWin: 100,
      icon: <Dice1 className="w-6 h-6" />
    },
    {
      id: '2',
      name: 'Double or Nothing',
      description: 'Double your bet or lose it all!',
      cost: 25,
      maxWin: 200,
      icon: <Coins className="w-6 h-6" />
    },
    {
      id: '3',
      name: 'Lightning Strike',
      description: 'Quick wins with electric energy!',
      cost: 15,
      maxWin: 150,
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const rollDice = () => {
    if (isRolling || balance < 10) return;
    
    // Play dice roll sound
    playDiceRoll();
    
    setIsRolling(true);
    setBalance(prev => prev - 10);
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalResult);
        setIsRolling(false);
        
        // Calculate winnings
        let winAmount = 0;
        if (finalResult === 6) winAmount = 100;
        else if (finalResult === 5) winAmount = 50;
        else if (finalResult === 4) winAmount = 25;
        else if (finalResult === 3) winAmount = 15;
        else if (finalResult === 2) winAmount = 10;
        
        if (winAmount > 0) {
          setBalance(prev => prev + winAmount);
          setLastWin(winAmount);
          setGameHistory(prev => [{
            dice: finalResult,
            win: winAmount,
            time: new Date().toLocaleTimeString()
          }, ...prev.slice(0, 4)]);
          // Play win sound
          playWin();
        } else {
          setLastWin(0);
        }
      }
    }, 100);
  };

  const getDiceIcon = (number: number) => {
    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = diceIcons[number - 1];
    return <IconComponent className="w-12 h-12" />;
  };

  return (
    <div className="space-y-6">
      {/* Mini Games Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎮 Mini Games
            <Badge variant="secondary">Fun & Rewards</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {miniGames.map((game) => (
              <div key={game.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  {game.icon}
                  <div>
                    <h3 className="font-semibold">{game.name}</h3>
                    <p className="text-sm text-gray-600">{game.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Cost: ${game.cost}</span>
                  <Badge variant="outline">Max: ${game.maxWin}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lucky Dice Roll Game */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎲 Lucky Dice Roll
            <Badge variant="success">Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {/* Balance Display */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${balance}</div>
                <div className="text-sm text-gray-600">Balance</div>
              </div>
              {lastWin !== null && (
                <div className="text-center">
                  <div className={`text-xl font-bold ${lastWin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {lastWin > 0 ? `+$${lastWin}` : 'No Win'}
                  </div>
                  <div className="text-sm text-gray-600">Last Roll</div>
                </div>
              )}
            </div>

            {/* Dice Display */}
            <div className="flex justify-center">
              <div className={`p-6 rounded-lg border-2 ${isRolling ? 'animate-pulse bg-yellow-50' : 'bg-gray-50'}`}>
                {diceResult > 0 ? getDiceIcon(diceResult) : <Dice1 className="w-12 h-12 text-gray-400" />}
              </div>
            </div>

            {/* Roll Button */}
            <Button 
              onClick={rollDice}
              disabled={isRolling || balance < 10}
              size="lg"
              className="w-full"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice ($10)'}
            </Button>

            {/* Game History */}
            {gameHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Recent Rolls</h4>
                <div className="space-y-2">
                  {gameHistory.map((roll, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getDiceIcon(roll.dice)}
                        <span className="font-medium">Rolled {roll.dice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${roll.win > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {roll.win > 0 ? `+$${roll.win}` : 'No Win'}
                        </span>
                        <span className="text-xs text-gray-500">{roll.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveGameFeed;