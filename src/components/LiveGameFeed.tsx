import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Zap } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import BalanceBreakdown from './BalanceBreakdown';
import { gameState } from '@/lib/gameState';

interface MiniGame {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxWin: number;
  icon: React.ReactNode;
}

interface LiveGameFeedProps {
  playerBalance: number;
  playerWithdrawableBalance: number;
  playerBonusBalance: number;
  onBalanceUpdate: (newBalance: number, newWithdrawableBalance: number, newBonusBalance: number) => void;
}

const LiveGameFeed: React.FC<LiveGameFeedProps> = ({ 
  playerBalance, 
  playerWithdrawableBalance, 
  playerBonusBalance, 
  onBalanceUpdate 
}) => {
  const [diceResult, setDiceResult] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{
    dice: number;
    win: number;
    time: string;
  }>>([]);
  const [selectedGame, setSelectedGame] = useState<string>('1'); // Default to Lucky Dice Roll
  const [doubleOrNothingResult, setDoubleOrNothingResult] = useState<boolean | null>(null);
  const [lightningStrikeResult, setLightningStrikeResult] = useState<number | null>(null);
  
  const { playDiceRoll, playWin, playButtonClick } = useSoundEffects();

  const miniGames: MiniGame[] = [
      {
        id: '1',
      name: 'Lucky Dice Roll',
      description: 'Roll the dice and win instant prizes!',
      cost: 10,
      maxWin: 25,
      icon: <img src="/dice-1.png" alt="Dice 1" className="w-6 h-6" />
      },
      {
        id: '2',
      name: 'Double or Nothing',
      description: 'Double your bet or lose it all!',
      cost: 5,
      maxWin: 10,
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

  const selectGame = (gameId: string) => {
    setSelectedGame(gameId);
    setLastWin(null);
    setDiceResult(0);
    setDoubleOrNothingResult(null);
    setLightningStrikeResult(null);
  };

  const rollDice = () => {
    if (isRolling || playerBalance < 10) return;
    
    // Play dice roll sound
    playDiceRoll();
    
    setIsRolling(true);
    
    // Deduct from player's real balance
    const newWithdrawableBalance = Math.max(0, playerWithdrawableBalance - 10);
    const newBonusBalance = playerBonusBalance;
    const newTotalBalance = newWithdrawableBalance + newBonusBalance;
    
    onBalanceUpdate(newTotalBalance, newWithdrawableBalance, newBonusBalance);
    
    // Start mini-game session
    const sessionId = gameState.startGameSession('mini-game', 10);
    
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
          // Add winnings to player's withdrawable balance (real money)
          const newWithdrawableBalance = playerWithdrawableBalance - 10 + winAmount;
          const newTotalBalance = newWithdrawableBalance + playerBonusBalance;
          
          onBalanceUpdate(newTotalBalance, newWithdrawableBalance, playerBonusBalance);
          
          setLastWin(winAmount);
          setGameHistory(prev => [{
            dice: finalResult,
            win: winAmount,
            time: new Date().toLocaleTimeString(),
            gameName: 'Lucky Dice Roll'
          }, ...prev.slice(0, 4)]);
          // Play win sound
          playWin();
          
          // Complete game session with win
          gameState.completeGameSession(sessionId, winAmount, true);
        } else {
          setLastWin(0);
          // Complete game session with loss
          gameState.completeGameSession(sessionId, 0, false);
        }
      }
    }, 100);
  };

  const getDiceIcon = (number: number) => {
    return <img src={`/dice-${number}.png`} alt={`Dice ${number}`} className="w-12 h-12" />;
  };

  // Double or Nothing game
  const playDoubleOrNothing = () => {
    if (playerBalance < 5) return;
    
    playButtonClick();
    
    // Deduct from player's real balance
    const newWithdrawableBalance = Math.max(0, playerWithdrawableBalance - 5);
    const newBonusBalance = playerBonusBalance;
    const newTotalBalance = newWithdrawableBalance + newBonusBalance;
    
    onBalanceUpdate(newTotalBalance, newWithdrawableBalance, newBonusBalance);
    
    // Start mini-game session
    const sessionId = gameState.startGameSession('mini-game', 5);
    
    // 50% chance to win (realistic house edge)
    const win = Math.random() < 0.5;
    setDoubleOrNothingResult(win);
    
    if (win) {
      // Add winnings to player's withdrawable balance (real money)
      const newWithdrawableBalance = playerWithdrawableBalance - 5 + 10;
      const newTotalBalance = newWithdrawableBalance + playerBonusBalance;
      
      onBalanceUpdate(newTotalBalance, newWithdrawableBalance, playerBonusBalance);
      
      setLastWin(10);
      playWin();
      
      // Complete game session with win
      gameState.completeGameSession(sessionId, 10, true);
    } else {
      setLastWin(0);
      
      // Complete game session with loss
      gameState.completeGameSession(sessionId, 0, false);
    }
  };

  // Lightning Strike game
  const playLightningStrike = () => {
    if (playerBalance < 15) return;
    
    playButtonClick();
    
    // Deduct from player's real balance
    const newWithdrawableBalance = Math.max(0, playerWithdrawableBalance - 15);
    const newBonusBalance = playerBonusBalance;
    const newTotalBalance = newWithdrawableBalance + newBonusBalance;
    
    onBalanceUpdate(newTotalBalance, newWithdrawableBalance, newBonusBalance);
    
    // Start mini-game session
    const sessionId = gameState.startGameSession('mini-game', 15);
    
    // Random result with weighted odds
    const random = Math.random();
    let winAmount = 0;
    let result = 0;
    
    if (random < 0.1) { // 10% chance
      winAmount = 30;
      result = 3;
    } else if (random < 0.3) { // 20% chance
      winAmount = 20;
      result = 2;
    } else if (random < 0.6) { // 30% chance
      winAmount = 10;
      result = 1;
    }
    // 40% chance of no win
    
    setLightningStrikeResult(result);
    
    if (winAmount > 0) {
      // Add winnings to player's withdrawable balance (real money)
      const newWithdrawableBalance = playerWithdrawableBalance - 15 + winAmount;
      const newTotalBalance = newWithdrawableBalance + playerBonusBalance;
      
      onBalanceUpdate(newTotalBalance, newWithdrawableBalance, playerBonusBalance);
      
      setLastWin(winAmount);
      playWin();
      
      // Complete game session with win
      gameState.completeGameSession(sessionId, winAmount, true);
    } else {
      setLastWin(0);
      
      // Complete game session with loss
      gameState.completeGameSession(sessionId, 0, false);
    }
  };

  return (
    <div className="space-y-6 h-full">
      {/* Mini Games Section */}
      <Card className="relative overflow-hidden h-full" style={{
        backgroundImage: 'url("/minigame-background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 h-full flex flex-col">
          <CardHeader className="p-6 lg:p-8">
            <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
              🎮 Mini Games
              <Badge variant="secondary">Fun & Rewards</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 flex-1">
          <div className="grid grid-cols-1 gap-4 lg:gap-6 mb-6">
            {miniGames.map((game) => (
              <div 
                key={game.id} 
                onClick={() => selectGame(game.id)}
                className={`group p-4 lg:p-6 border rounded-lg hover:shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer ${
                  selectedGame === game.id 
                    ? 'border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 shadow-lg shadow-yellow-400/20' 
                    : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    selectedGame === game.id 
                      ? 'bg-gradient-to-br from-yellow-400/30 to-yellow-600/30' 
                      : 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 group-hover:from-yellow-400/30 group-hover:to-yellow-600/30'
                  }`}>
                    {game.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      selectedGame === game.id 
                        ? 'text-yellow-300' 
                        : 'text-white group-hover:text-yellow-300'
                    }`}>{game.name}</h3>
                    <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{game.description}</p>
                  </div>
                    </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60 font-medium">Cost: ${game.cost}</span>
                  <Badge variant="outline" className="border-yellow-400/50 text-yellow-300 bg-yellow-400/10">Max: ${game.maxWin}</Badge>
                </div>
                {selectedGame === game.id && (
                  <div className="mt-3 text-center">
                    <span className="text-xs text-yellow-300 font-medium">✓ Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          </CardContent>
        </div>
      </Card>

      {/* Active Game Interface */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            {selectedGame === '1' && '🎲 Lucky Dice Roll'}
            {selectedGame === '2' && '💰 Double or Nothing'}
            {selectedGame === '3' && '⚡ Lightning Strike'}
            <Badge variant="success" className="bg-green-500/20 text-green-300 border-green-400/50">Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            {/* Balance Display */}
            <div className="flex justify-center gap-6 mb-6">
              <BalanceBreakdown
                totalBalance={playerBalance}
                withdrawableBalance={playerWithdrawableBalance}
                bonusBalance={playerBonusBalance}
                compact={true}
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 p-4 rounded-lg"
              />
              {lastWin !== null && (
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30">
                  <div className={`text-2xl font-bold ${lastWin > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {lastWin > 0 ? `+$${lastWin}` : 'No Win'}
                  </div>
                  <div className="text-sm text-yellow-300/80 font-medium">Last Roll</div>
                </div>
              )}
            </div>

            {/* Game Display */}
            <div className="flex justify-center">
          {selectedGame === '1' && (
            <div className={`p-8 lg:p-12 xl:p-16 rounded-xl border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${isRolling ? 'animate-pulse bg-yellow-500/20 border-yellow-400/50' : 'hover:bg-white/15 transition-all duration-300'}`}>
                  <div className="text-white">
                    {diceResult > 0 ? getDiceIcon(diceResult) : <img src="/dice-1.png" alt="Dice 1" className="w-16 h-16 opacity-60" />}
                  </div>
                </div>
              )}
              
              {selectedGame === '2' && (
                <div className="p-8 rounded-xl border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                  <div className="text-white text-center">
                    {doubleOrNothingResult === null ? (
                      <Coins className="w-16 h-16 text-white/60 mx-auto" />
                    ) : doubleOrNothingResult ? (
                      <div className="text-green-400 text-4xl font-bold">💰 WIN!</div>
                    ) : (
                      <div className="text-red-400 text-4xl font-bold">❌ LOSE</div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedGame === '3' && (
                <div className="p-8 rounded-xl border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                  <div className="text-white text-center">
                    {lightningStrikeResult === null ? (
                      <Zap className="w-16 h-16 text-white/60 mx-auto" />
                    ) : lightningStrikeResult === 0 ? (
                      <div className="text-red-400 text-4xl font-bold">⚡ MISS</div>
                    ) : (
                      <div className="text-yellow-400 text-4xl font-bold">⚡ HIT x{lightningStrikeResult}!</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Game Button */}
            <Button 
              onClick={() => {
                if (selectedGame === '1') rollDice();
                else if (selectedGame === '2') playDoubleOrNothing();
                else if (selectedGame === '3') playLightningStrike();
              }}
              disabled={
                (selectedGame === '1' && (isRolling || playerBalance < 10)) ||
                (selectedGame === '2' && playerBalance < 5) ||
                (selectedGame === '3' && playerBalance < 15)
              }
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedGame === '1' && (isRolling ? '🎲 Rolling...' : '🎲 Roll Dice ($10)')}
              {selectedGame === '2' && '💰 Double or Nothing ($5)'}
              {selectedGame === '3' && '⚡ Lightning Strike ($15)'}
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