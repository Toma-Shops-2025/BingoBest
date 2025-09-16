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
      maxWin: 25,
      icon: <Dice1 className="w-6 h-6" />
    },
    {
      id: '2',
      name: 'Double or Nothing',
      description: 'Double your bet or lose it all!',
      cost: 25,
      maxWin: 50,
      icon: <Coins className="w-6 h-6" />
    },
    {
      id: '3',
      name: 'Lightning Strike',
      description: 'Quick wins with electric energy!',
      cost: 15,
      maxWin: 30,
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
        
        // Calculate winnings (more realistic odds and amounts)
        let winAmount = 0;
        if (finalResult === 6) winAmount = 25; // 25% return on 6
        else if (finalResult === 5) winAmount = 15; // 15% return on 5
        else if (finalResult === 4) winAmount = 8; // 8% return on 4
        else if (finalResult === 3) winAmount = 5; // 5% return on 3
        else if (finalResult === 2) winAmount = 3; // 3% return on 2
        // 1 = no win (most common outcome)
        
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
              <div key={game.id} className="group p-4 border border-white/20 rounded-lg hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 group-hover:from-yellow-400/30 group-hover:to-yellow-600/30 transition-all duration-300">
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-yellow-300 transition-colors duration-300">{game.name}</h3>
                    <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{game.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60 font-medium">Cost: ${game.cost}</span>
                  <Badge variant="outline" className="border-yellow-400/50 text-yellow-300 bg-yellow-400/10">Max: ${game.maxWin}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lucky Dice Roll Game */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            🎲 Lucky Dice Roll
            <Badge variant="success" className="bg-green-500/20 text-green-300 border-green-400/50">Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            {/* Balance Display */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30">
                <div className="text-3xl font-bold text-green-400">${balance}</div>
                <div className="text-sm text-green-300/80 font-medium">Balance</div>
              </div>
              {lastWin !== null && (
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30">
                  <div className={`text-2xl font-bold ${lastWin > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {lastWin > 0 ? `+$${lastWin}` : 'No Win'}
                  </div>
                  <div className="text-sm text-yellow-300/80 font-medium">Last Roll</div>
                </div>
              )}
            </div>

            {/* Dice Display */}
            <div className="flex justify-center">
              <div className={`p-8 rounded-xl border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${isRolling ? 'animate-pulse bg-yellow-500/20 border-yellow-400/50' : 'hover:bg-white/15 transition-all duration-300'}`}>
                <div className="text-white">
                  {diceResult > 0 ? getDiceIcon(diceResult) : <Dice1 className="w-16 h-16 text-white/60" />}
                </div>
              </div>
            </div>

            {/* Roll Button */}
            <Button 
              onClick={rollDice}
              disabled={isRolling || balance < 10}
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice ($10)'}
            </Button>

            {/* Game History */}
            {gameHistory.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4 text-white text-lg">Recent Rolls</h4>
                <div className="space-y-3">
                  {gameHistory.map((roll, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-600/20">
                          {getDiceIcon(roll.dice)}
                        </div>
                        <span className="font-medium text-white">Rolled {roll.dice}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-lg ${roll.win > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {roll.win > 0 ? `+$${roll.win}` : 'No Win'}
                        </span>
                        <span className="text-xs text-white/60 font-medium">{roll.time}</span>
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