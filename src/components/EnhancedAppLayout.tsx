import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBingoGame } from '@/hooks/useBingoGame';
import AuthModal from './AuthModal';
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
import LiveGameFeed from './LiveGameFeed';
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

const EnhancedAppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { gameState, setGameState, player, setPlayer, generateBingoCard, markNumber } = useBingoGame();
  
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<Player[]>([]);

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
    }
  ];

  const handleAddFundsClick = () => {
    setPaymentAmount(25);
    setShowPaymentModal(true);
  };

  const renderTabContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Please sign in to access the game</h2>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Sign In
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'tournaments':
        return <TournamentSystem />;
      case 'achievements':
        return <AchievementSystem />;
      case 'challenges':
        return <DailyChallenges />;
      case 'friends':
        return <FriendsSystem />;
      case 'events':
        return <SeasonalEvents />;
      case 'vip':
        return <VIPSystem />;
      case 'spectate':
        return <SpectatorMode />;
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-2">
              <GameRooms
                rooms={gameRooms}
                onJoinRoom={() => {}}
                playerBalance={player.balance}
              />
            </div>
            <div className="space-y-6">
              <PowerUpShop
                powerUps={powerUps}
                playerBalance={player.balance}
                onPurchase={() => {}}
              />
              <Leaderboard players={leaderboardPlayers} />
              <GameStats player={player} />
            </div>
            <div>
              <LiveGameFeed />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Ultimate Bingo Experience!</h1>
          <p className="text-xl mb-6">Tournaments, achievements, friends, and more!</p>
          {!user && (
            <div className="space-x-4">
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign Up to Play
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {user && (
          <div className="mb-8">
            <GameHeader 
              player={player}
              currentRoom={gameState.currentRoom?.name}
              prizePool={gameState.currentRoom?.prizePool || 0}
              onSignOut={signOut}
              onAddFunds={handleAddFundsClick}
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <MainNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            unreadChallenges={2} 
          />
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
      
      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentAmount}
        onPaymentSuccess={() => {}}
      />
      
      <WinModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        winAmount={100}
        winType="line"
      />
      
      <GameInstructions />
      <ChatSystem playerUsername={player.username} />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default EnhancedAppLayout;