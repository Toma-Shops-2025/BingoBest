import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
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
import BingoGame from './BingoGame';
import PWAInstallPrompt from './PWAInstallPrompt';
import BackToTopButton from './BackToTopButton';
import NavigationBreadcrumbs from './NavigationBreadcrumbs';
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
  const [showBingoGame, setShowBingoGame] = useState(false);

  // Scroll to top when component mounts or activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, showBingoGame]);

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
    // Scroll to top when opening payment modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Scroll to top when changing tabs - use setTimeout to ensure DOM is updated
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleJoinRoom = (roomId: string) => {
    // Find the room and join it
    const room = gameRooms.find(r => r.id === roomId);
    if (room) {
      setGameState(prev => ({
        ...prev,
        currentRoom: room,
        gameStatus: 'waiting'
      }));
      // Start the bingo game
      setShowBingoGame(true);
      setActiveTab('home'); // Switch to home tab to show the game
      // Scroll to top when starting game
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert(`Joined ${room.name}! Starting bingo game...`);
    }
  };

  const handlePurchasePowerUp = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (powerUp && player.balance >= powerUp.cost) {
      // Deduct cost from balance
      setPlayer(prev => ({
        ...prev,
        balance: prev.balance - powerUp.cost
      }));
      // Show success message
      alert(`Purchased ${powerUp.name} for $${powerUp.cost}!`);
    } else {
      alert('Insufficient funds!');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Update balance in database
      if (user) {
        const { error } = await supabase
          .from('users')
          .update({ balance: player.balance + paymentAmount })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating balance:', error);
          alert('Payment processed but failed to update balance. Please contact support.');
          return;
        }
      }
      
      // Update local state
      setPlayer(prev => ({
        ...prev,
        balance: prev.balance + paymentAmount
      }));
      
      setShowPaymentModal(false);
      alert(`Payment successful! Added $${paymentAmount} to your balance. Your new balance is $${(player.balance + paymentAmount).toFixed(2)}`);
    } catch (error) {
      console.error('Payment success error:', error);
      alert('Payment processed but there was an error updating your balance. Please contact support.');
    }
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
        return <TournamentSystem 
          tournaments={[]} 
          player={player} 
          onJoinTournament={(id) => alert(`Joined tournament ${id}!`)} 
        />;
      case 'achievements':
        return <AchievementSystem 
          achievements={[]} 
          onClaimReward={(id) => alert(`Claimed reward for achievement ${id}!`)} 
        />;
      case 'challenges':
        return <DailyChallenges 
          challenges={[]} 
          onClaimReward={(id) => alert(`Claimed reward for challenge ${id}!`)} 
        />;
      case 'friends':
        return <FriendsSystem 
          friends={[]} 
          onAddFriend={(username) => alert(`Added friend ${username}!`)} 
          onInviteToGame={(id) => alert(`Invited friend ${id} to game!`)} 
          onSendMessage={(id) => alert(`Sent message to friend ${id}!`)} 
        />;
      case 'events':
        return <SeasonalEvents 
          events={[]} 
          player={player} 
        />;
      case 'vip':
        return <VIPSystem 
          player={player} 
          vipBenefits={[]} 
          currentTier={0} 
          nextTierRequirement={10} 
          onUpgradeVIP={() => alert('VIP upgrade feature coming soon!')} 
        />;
      case 'spectate':
        return <SpectatorMode 
          activeGames={[]} 
          onJoinAsSpectator={(id) => alert(`Watching game ${id} as spectator!`)} 
          onJoinAsPlayer={(id) => alert(`Joined game ${id} as player!`)} 
        />;
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-2">
              <GameRooms
                rooms={gameRooms}
                onJoinRoom={handleJoinRoom}
                playerBalance={player.balance}
              />
            </div>
            <div className="space-y-6">
              <PowerUpShop
                powerUps={powerUps}
                playerBalance={player.balance}
                onPurchase={handlePurchasePowerUp}
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

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
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
            onTabChange={handleTabChange} 
            unreadChallenges={2} 
          />
        </div>
        
        {/* AdSense Banner Ad */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">Advertisement Space</p>
            <p className="text-xs sm:text-sm text-gray-400">Google AdSense Banner Ad (728x90)</p>
            <div className="mt-2 text-xs text-gray-300 hidden sm:block">
              Replace with: &lt;ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto"&gt;&lt;/ins&gt;
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {showBingoGame ? (
          <div className="space-y-4">
            <NavigationBreadcrumbs
              currentPage="Playing Bingo"
              onGoHome={() => {
                setActiveTab('home');
                setShowBingoGame(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoBack={() => setShowBingoGame(false)}
            />
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Playing Bingo</h2>
              <Button 
                onClick={() => setShowBingoGame(false)}
                variant="outline"
              >
                Back to Game Rooms
              </Button>
            </div>
            <BingoGame 
              onWin={(winType, prize) => {
                setShowWinModal(true);
                setPlayer(prev => ({ ...prev, balance: prev.balance + prize }));
                alert(`Congratulations! You won ${winType} and earned $${prize}!`);
              }}
              onGameEnd={() => {
                setShowBingoGame(false);
                setGameState(prev => ({ ...prev, gameStatus: 'finished' }));
              }}
            />
          </div>
        ) : (
          <div>
            {activeTab !== 'home' && (
              <NavigationBreadcrumbs
                currentPage={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                onGoHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {renderTabContent()}
          </div>
        )}
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

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Back to Top Button */}
      <BackToTopButton 
        onGoHome={() => {
          setActiveTab('home');
          setShowBingoGame(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">BetBingo</h3>
              <p className="text-gray-300 text-sm">
                The ultimate online bingo experience with real money prizes, tournaments, and social features.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActiveTab('home')} className="text-gray-300 hover:text-white cursor-pointer">Game Rooms</button></li>
                <li><button onClick={() => setActiveTab('tournaments')} className="text-gray-300 hover:text-white cursor-pointer">Tournaments</button></li>
                <li><button onClick={() => setActiveTab('achievements')} className="text-gray-300 hover:text-white cursor-pointer">Achievements</button></li>
                <li><button onClick={() => setActiveTab('friends')} className="text-gray-300 hover:text-white cursor-pointer">Friends</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="mailto:support@betbingo.live?subject=BetBingo Support Request&body=Hello BetBingo Support Team,%0D%0A%0D%0AI need help with:%0D%0A%0D%0A"
                    className="text-gray-300 hover:text-white"
                    onClick={(e) => {
                      // Fallback for browsers that don't support mailto
                      if (!e.defaultPrevented) {
                        e.preventDefault();
                        const email = 'support@betbingo.live';
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(email).then(() => {
                            alert(`Email copied to clipboard: ${email}\n\nPlease paste it into your email client.`);
                          }).catch(() => {
                            alert(`Please email us at: ${email}`);
                          });
                        } else {
                          alert(`Please email us at: ${email}`);
                        }
                      }
                    }}
                  >
                    Contact Us
                  </a>
                </li>
                <li><a href="/help-center.html" target="_blank" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="/faq.html" target="_blank" className="text-gray-300 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy.html" target="_blank" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms-of-service.html" target="_blank" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="/responsible-gaming.html" target="_blank" className="text-gray-300 hover:text-white">Responsible Gaming</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 BetBingo. All rights reserved. | 18+ Only | Play Responsibly</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedAppLayout;