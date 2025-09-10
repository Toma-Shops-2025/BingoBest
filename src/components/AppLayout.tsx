import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBingoGame } from '@/hooks/useBingoGame';
import GameHeader from './GameHeader';
import BingoCard from './BingoCard';
import NumberDisplay from './NumberDisplay';
import PowerUpShop from './PowerUpShop';
import GameRooms from './GameRooms';
import PaymentModal from './PaymentModal';
import Leaderboard from './Leaderboard';
import GameInstructions from './GameInstructions';
import WinModal from './WinModal';
import GameStats from './GameStats';
import ChatSystem from './ChatSystem';
import MainNavigation from './MainNavigation';
import TournamentSystem from './TournamentSystem';
import AchievementSystem from './AchievementSystem';
import DailyChallenges from './DailyChallenges';
import FriendsSystem from './FriendsSystem';
import SeasonalEvents from './SeasonalEvents';
import VIPSystem from './VIPSystem';
import SpectatorMode from './SpectatorMode';
import AdvancedTournaments from './AdvancedTournaments';
import EnhancedAchievements from './EnhancedAchievements';
import SkillBasedMatchmaking from './SkillBasedMatchmaking';
import GameModeVariations from './GameModeVariations';
import SeasonalChallenges from './SeasonalChallenges';
import AdvancedGamingHub from './AdvancedGamingHub';
import { 
  GameRoom, 
  PowerUp, 
  Player, 
  Tournament, 
  Achievement, 
  DailyChallenge, 
  Friend, 
  SeasonalEvent, 
  VIPBenefit 
} from '@/types/game';
const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const { gameState, setGameState, player, setPlayer, generateBingoCard, markNumber } = useBingoGame();
  
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([]);
  const [vipBenefits, setVipBenefits] = useState<VIPBenefit[]>([]);
  const heroImage = "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515318315_894aa039.webp";
  const ballImages = [
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515322144_660039cf.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515323914_9918e934.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515325711_afac1161.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515327507_f2967e74.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515329263_e8f5a258.webp"
  ];
  const powerUps: PowerUp[] = [
    {
      id: '1',
      name: 'Auto Daub',
      description: 'Automatically mark numbers',
      cost: 5,
      icon: '',
      type: 'auto_daub'
    },
    {
      id: '2', 
      name: 'Extra Ball',
      description: 'Get one extra number',
      cost: 10,
      icon: '',
      type: 'extra_ball'
    },
    {
      id: '3',
      name: 'Peek Next',
      description: 'See next number early',
      cost: 8,
      icon: '',
      type: 'peek_next'
    },
    {
      id: '4',
      name: 'Double Prize',
      description: 'Double your winnings',
      cost: 15,
      icon: '',
      type: 'double_prize'
    }
  ];

  useEffect(() => {
    // Initialize game rooms
    const rooms: GameRoom[] = [
      {
        id: '1',
        name: 'Beginner Room',
        maxPlayers: 10,
        currentPlayers: 7,
        entryFee: 5,
        prizePool: 35,
        status: 'waiting',
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'High Stakes',
        maxPlayers: 20,
        currentPlayers: 15,
        entryFee: 25,
        prizePool: 375,
        status: 'playing',
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'VIP Room',
        maxPlayers: 5,
        currentPlayers: 3,
        entryFee: 50,
        prizePool: 150,
        status: 'waiting',
        createdAt: new Date()
      }
    ];
    setGameRooms(rooms);

    // Initialize leaderboard
    const players: Player[] = [
      { id: '1', username: 'BingoMaster', balance: 500, wins: 47, gamesPlayed: 89 },
      { id: '2', username: 'LuckyPlayer', balance: 350, wins: 35, gamesPlayed: 67 },
      { id: '3', username: 'NumberWiz', balance: 280, wins: 28, gamesPlayed: 54 },
      { id: '4', username: 'CardShark', balance: 220, wins: 22, gamesPlayed: 43 },
      { id: '5', username: 'BingoQueen', balance: 180, wins: 18, gamesPlayed: 38 }
    ];
    setLeaderboardPlayers(players);
  }, []);

  const handleJoinRoom = (roomId: string) => {
    const room = gameRooms.find(r => r.id === roomId);
    if (room && player.balance >= room.entryFee) {
      setPlayer(prev => ({ ...prev, balance: prev.balance - room.entryFee }));
      setGameState(prev => ({ 
        ...prev, 
        currentRoom: room,
        playerCards: [generateBingoCard()],
        gameStarted: true
      }));
    }
  };

  const handlePowerUpPurchase = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (powerUp && player.balance >= powerUp.cost) {
      setPlayer(prev => ({ ...prev, balance: prev.balance - powerUp.cost }));
      // Add power-up logic here
    }
  };

  const handleAddFunds = (amount: number) => {
    setPaymentAmount(amount);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setPlayer(prev => ({ ...prev, balance: prev.balance + paymentAmount }));
  };

  const handleNumberClick = (cardId: string, row: number, col: number) => {
    markNumber(cardId, row, col);
  };

  // Show Advanced Gaming Hub if selected
  if (activeTab === 'advanced') {
    return <AdvancedGamingHub />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Win Big with Bingo!</h1>
          <p className="text-xl mb-6">Join thousands of players in the ultimate money bingo experience</p>
          <div className="space-x-4">
            <button
              onClick={() => handleAddFunds(25)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Add $25 to Play
            </button>
            <button
              onClick={() => handleAddFunds(50)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Add $50 to Play
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="mb-8">
          <GameHeader 
            player={player}
            currentRoom={gameState.currentRoom?.name}
            prizePool={gameState.currentRoom?.prizePool || 0}
          />
        </div>

        {gameState.gameStarted && gameState.currentRoom ? (
          /* Active Game Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bingo Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {gameState.playerCards.map((card) => (
                  <BingoCard
                    key={card.id}
                    card={card}
                    onNumberClick={(row, col) => handleNumberClick(card.id, row, col)}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Game Info */}
            <div className="space-y-6">
              <NumberDisplay
                currentNumber={currentNumber}
                calledNumbers={gameState.calledNumbers}
                ballImages={ballImages}
              />
              <PowerUpShop
                powerUps={powerUps}
                playerBalance={player.balance}
                onPurchase={handlePowerUpPurchase}
              />
            </div>
          </div>
        ) : (
          /* Enhanced Lobby Layout with New Features */
          <div>
            {/* Navigation Tabs */}
            <div className="mb-6">
              <MainNavigation activeTab="home" onTabChange={() => {}} unreadChallenges={2} />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <GameRooms
                  rooms={gameRooms}
                  onJoinRoom={handleJoinRoom}
                  playerBalance={player.balance}
                />
                
                {/* Tournament Preview */}
                <div className="bg-white rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🏆 Featured Tournament
                  </h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold">Weekend Warrior Championship</h4>
                    <p className="text-sm text-gray-600">64 players • $1,600 prize pool • Starts in 2 hours</p>
                    <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                      Join Tournament ($25)
                    </button>
                  </div>
                </div>
                
                {/* Advanced Gaming Hub Access */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🎮 Advanced Gaming Hub
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      Access advanced tournaments, skill-based matchmaking, enhanced achievements, 
                      seasonal challenges, and premium power-ups.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">
                        Advanced Tournaments
                      </span>
                      <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                        Skill Rankings
                      </span>
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                        Seasonal Events
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('advanced')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Enter Advanced Hub
                    </button>
                  </div>
              </div>
              
              <div className="space-y-6">
                <PowerUpShop
                  powerUps={powerUps}
                  playerBalance={player.balance}
                  onPurchase={handlePowerUpPurchase}
                />
                
                {/* Daily Challenges Preview */}
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold mb-3">📅 Daily Challenges</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Play 3 Games</span>
                      <span className="text-green-600">1/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '33%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500">Reward: $15</p>
                  </div>
                </div>
                
                <Leaderboard players={leaderboardPlayers} />
                <GameStats player={player} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals and Fixed Elements */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <GameInstructions />
      <ChatSystem playerUsername={player.username} />
    </div>
  );
};

export default AppLayout;