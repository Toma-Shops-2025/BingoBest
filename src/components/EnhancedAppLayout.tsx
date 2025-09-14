import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBingoGame } from '@/hooks/useBingoGame';
import { GAME_CONFIGS, GameSessionManager } from '@/lib/prizeDistribution';
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
import SimpleBingoGame from './SimpleBingoGame';
import BingoGameFallback from './BingoGameFallback';
import PWAInstallPrompt from './PWAInstallPrompt';
import BackToTopButton from './BackToTopButton';
import NavigationBreadcrumbs from './NavigationBreadcrumbs';
import LoadingSpinner from './LoadingSpinner';
import UserProfile from './UserProfile';
import GameSounds from './GameSounds';
import PushNotifications, { NotificationPermissionRequest } from './PushNotifications';
import ErrorBoundary from './ErrorBoundary';
import { analytics, trackPageView, trackUserAction } from '@/lib/analytics';
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
  
  // Initialize player with default values
  const [player, setPlayer] = useState<Player>({
    id: user?.id || 'guest',
    username: user?.email?.split('@')[0] || 'Player1',
    balance: 100.00,
    level: 1,
    experience: 0,
    avatar: '',
    achievements: [],
    friends: [],
    isOnline: true,
    lastActive: new Date().toISOString(),
    totalWinnings: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    winRate: 0,
    favoriteRoom: 'Speed Bingo',
    joinDate: new Date().toISOString(),
    preferences: {
      soundEnabled: true,
      notificationsEnabled: true,
      theme: 'light'
    }
  });

  const [gameState, setGameState] = useState({
    currentRoom: null as GameRoom | null,
    gameStatus: 'waiting' as 'waiting' | 'playing' | 'finished',
    currentNumber: null as number | null,
    calledNumbers: [] as number[],
    bingoCards: [] as any[],
    gameTimer: 300
  });
  
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  // Initialize game rooms from prize distribution config
  const [gameRooms, setGameRooms] = useState<GameRoom[]>(() => {
    return GAME_CONFIGS.map(config => ({
      id: config.id,
      name: config.name,
      description: getGameDescription(config.id),
      playerCount: Math.floor(Math.random() * (config.maxPlayers - config.minPlayers)) + config.minPlayers,
      maxPlayers: config.maxPlayers,
      entryFee: config.entryFee,
      prizePool: calculatePrizePool(config),
      gameType: config.gameType === 'bingo' ? 'bingo' : 'tournament',
      status: 'waiting' as const,
      timeLeft: config.duration * 60,
      rules: getGameRules(config.id),
      powerUpsAllowed: true,
      minLevel: 1,
      maxLevel: 20
    }));
  });

  // Helper functions for game room configuration
  const getGameDescription = (gameId: string): string => {
    const descriptions: Record<string, string> = {
      'speed-bingo': 'Fast-paced bingo with quick rounds',
      'classic-bingo': 'Traditional bingo with full house wins',
      'high-stakes-arena': 'High-value games for serious players',
      'daily-tournament': 'Daily tournament with big prizes',
      'weekly-championship': 'Weekly championship event'
    };
    return descriptions[gameId] || 'Exciting bingo game';
  };

  const getGameRules = (gameId: string): string => {
    const rules: Record<string, string> = {
      'speed-bingo': 'First to complete any line wins!',
      'classic-bingo': 'Complete any line, diagonal, or full house',
      'high-stakes-arena': 'Multiple winning patterns with big prizes',
      'daily-tournament': 'Tournament format with multiple rounds',
      'weekly-championship': 'Championship format with elimination rounds'
    };
    return rules[gameId] || 'Standard bingo rules';
  };

  const calculatePrizePool = (config: any): number => {
    // Calculate prize pool based on minimum players and 90% distribution
    return (config.entryFee * config.minPlayers * 0.90);
  };
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<Player[]>([
    { id: '1', username: 'BingoMaster', avatar: '', balance: 1250, wins: 45, gamesPlayed: 120 },
    { id: '2', username: 'LuckyPlayer', avatar: '', balance: 890, wins: 32, gamesPlayed: 95 },
    { id: '3', username: 'Winner123', avatar: '', balance: 675, wins: 28, gamesPlayed: 80 },
    { id: '4', username: 'BingoQueen', avatar: '', balance: 540, wins: 22, gamesPlayed: 65 },
    { id: '5', username: 'GameChamp', avatar: '', balance: 420, wins: 18, gamesPlayed: 55 }
  ]);
  const [showBingoGame, setShowBingoGame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [roomTimers, setRoomTimers] = useState<Record<string, number>>({});

  // Scroll to top when component mounts or activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, showBingoGame]);

  // Update player when user changes
  useEffect(() => {
    if (user) {
      setPlayer(prev => ({
        ...prev,
        id: user.id,
        username: user.email?.split('@')[0] || 'Player1'
      }));
      analytics.setUserId(user.id);
      trackPageView(activeTab);
    }
  }, [user, activeTab]);

  // Initialize room timers
  useEffect(() => {
    const initialTimers: Record<string, number> = {};
    gameRooms.forEach(room => {
      initialTimers[room.id] = room.timeLeft;
    });
    setRoomTimers(initialTimers);
  }, []);

  // Update room timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRoomTimers(prev => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach(roomId => {
          if (newTimers[roomId] > 0) {
            newTimers[roomId] -= 1;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const heroImage = "/1000015560.png";
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

  const handleJoinRoom = useCallback(async (roomId: string) => {
    setIsLoading(true);
    try {
      // Find the room and join it
      const room = gameRooms.find(r => r.id === roomId);
      if (room) {
        // Check if player has enough balance
        if ((player.balance || 0) < room.entryFee) {
          alert(`Insufficient funds! You need $${room.entryFee} to join this game.`);
          return;
        }
        
        // Create a game session with the new prize distribution system
        const realPlayer = {
          id: user?.id || 'anonymous',
          username: user?.user_metadata?.username || 'Player',
          entryFee: room.entryFee
        };
        
        const gameSession = GameSessionManager.createGameSession(roomId, [realPlayer]);
        
        // Deduct entry fee from balance
        setPlayer(prev => ({
          ...prev,
          balance: (prev.balance || 0) - room.entryFee
        }));
        
        setGameState(prev => ({
          ...prev,
          currentRoom: room,
          gameStatus: 'waiting',
          gameSessionId: gameSession.id
        }));
        
        // Start the bingo game with error handling
        try {
          setShowBingoGame(true);
          setActiveTab('home'); // Switch to home tab to show the game
          // Scroll to top when starting game
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (gameError) {
          console.error('Error starting bingo game:', gameError);
          setShowBingoGame(false);
          alert('Failed to start the game. Please try again.');
          return;
        }
        
        // Track analytics
        try {
          trackUserAction('join_room', { 
            roomId, 
            roomName: room.name, 
            entryFee: room.entryFee,
            sessionId: gameSession.id,
            prizePool: gameSession.prizeDistribution.payoutPool
          });
        } catch (analyticsError) {
          console.warn('Analytics tracking failed:', analyticsError);
        }
        
        alert(`🎉 Joined ${room.name}!\n💰 Entry fee: $${room.entryFee}\n🏆 Prize Pool: $${gameSession.prizeDistribution.payoutPool.toFixed(2)}\n👥 Players: ${gameSession.players.length}\n\nStarting bingo game...`);
      } else {
        alert('Room not found. Please try again.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      try {
        trackUserAction('join_room_error', { roomId, error: error?.message || 'Unknown error' });
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      alert('Failed to join room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [gameRooms, player.balance]);

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
    setIsLoading(true);
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
        balance: (prev.balance || 0) + paymentAmount
      }));
      
      setShowPaymentModal(false);
      alert(`Payment successful! Added $${paymentAmount} to your balance. Your new balance is $${((player.balance || 0) + paymentAmount).toFixed(2)}`);
    } catch (error) {
      console.error('Payment success error:', error);
      alert('Payment processed but there was an error updating your balance. Please contact support.');
    } finally {
      setIsLoading(false);
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
        // Create exciting tournaments
        const now = new Date();
        const tournaments = [
          {
            id: 'daily-quick-fire',
            name: 'Daily Quick Fire',
            description: 'Fast-paced bingo tournament with quick rounds',
            entryFee: 5.00,
            maxParticipants: 50,
            currentParticipants: 23,
            prizePool: 200.00,
            startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
            endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
            status: 'upcoming' as const,
            rounds: [],
            winners: [],
            format: 'single_elimination' as const
          },
          {
            id: 'weekend-championship',
            name: 'Weekend Championship',
            description: 'The ultimate bingo championship with massive prizes',
            entryFee: 25.00,
            maxParticipants: 100,
            currentParticipants: 67,
            prizePool: 2000.00,
            startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
            endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 2 days from now
            status: 'upcoming' as const,
            rounds: [],
            winners: [],
            format: 'double_elimination' as const
          },
          {
            id: 'speed-masters',
            name: 'Speed Masters',
            description: 'Currently running - join the action!',
            entryFee: 10.00,
            maxParticipants: 30,
            currentParticipants: 28,
            prizePool: 250.00,
            startTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
            endTime: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now
            status: 'active' as const,
            rounds: [],
            winners: [],
            format: 'round_robin' as const
          },
          {
            id: 'mega-jackpot',
            name: 'Mega Jackpot Tournament',
            description: 'The biggest tournament of the month!',
            entryFee: 50.00,
            maxParticipants: 200,
            currentParticipants: 156,
            prizePool: 8000.00,
            startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            endTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 1 week + 1 day
            status: 'upcoming' as const,
            rounds: [],
            winners: [],
            format: 'single_elimination' as const
          },
          {
            id: 'yesterday-winner',
            name: 'Yesterday\'s Winner',
            description: 'Completed tournament - see who won!',
            entryFee: 15.00,
            maxParticipants: 40,
            currentParticipants: 40,
            prizePool: 500.00,
            startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
            endTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
            status: 'completed' as const,
            rounds: [],
            winners: [
              {
                id: 'winner1',
                username: 'BingoChamp',
                balance: 1000,
                wins: 25,
                gamesPlayed: 50
              }
            ],
            format: 'single_elimination' as const
          }
        ];

        return <TournamentSystem 
          tournaments={tournaments} 
          player={player} 
          onJoinTournament={(id) => {
            const tournament = tournaments.find(t => t.id === id);
            if (tournament) {
              if (player.balance < tournament.entryFee) {
                alert(`❌ Insufficient Funds!\n\nYou need $${tournament.entryFee} to join this tournament.\n\nCurrent balance: $${player.balance}`);
                return;
              }
              if (tournament.currentParticipants >= tournament.maxParticipants) {
                alert(`❌ Tournament Full!\n\n${tournament.name} is already full.\n\nTry joining another tournament!`);
                return;
              }
              alert(`🎉 Tournament Joined!\n\n${tournament.name}\n\nEntry Fee: $${tournament.entryFee}\nPrize Pool: $${tournament.prizePool}\n\nGood luck!`);
            }
          }} 
        />;
      case 'achievements':
        return <AchievementSystem 
          achievements={[]} 
          onClaimReward={(id) => alert(`Claimed reward for achievement ${id}!`)} 
        />;
      case 'challenges':
        // Create dynamic daily challenges
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Reset to start of day

        const dailyChallenges = [
          {
            id: 'daily-play-3',
            name: 'Daily Player',
            description: 'Play 3 games today to earn bonus credits',
            requirement: 3,
            reward: 25,
            progress: Math.floor(Math.random() * 4), // Random progress 0-3
            completed: false,
            expiresAt: tomorrow
          },
          {
            id: 'daily-win-1',
            name: 'Lucky Winner',
            description: 'Win at least 1 game today',
            requirement: 1,
            reward: 50,
            progress: Math.floor(Math.random() * 2), // Random progress 0-1
            completed: false,
            expiresAt: tomorrow
          },
          {
            id: 'daily-spend-10',
            name: 'Big Spender',
            description: 'Spend $10 on entry fees today',
            requirement: 10,
            reward: 30,
            progress: Math.floor(Math.random() * 11), // Random progress 0-10
            completed: false,
            expiresAt: tomorrow
          },
          {
            id: 'daily-streak',
            name: 'Streak Master',
            description: 'Play games for 3 consecutive days',
            requirement: 3,
            reward: 100,
            progress: Math.floor(Math.random() * 4), // Random progress 0-3
            completed: false,
            expiresAt: tomorrow
          }
        ];

        return <DailyChallenges 
          challenges={dailyChallenges} 
          onClaimReward={(id) => {
            const challenge = dailyChallenges.find(c => c.id === id);
            if (challenge) {
              alert(`🎉 Challenge Completed!\n\n${challenge.name}\n\nYou earned $${challenge.reward}!\n\nKeep playing to complete more challenges!`);
            }
          }} 
        />;
      case 'friends':
        // Mock friends data for demonstration
        const mockFriends: Friend[] = [
          {
            id: 'friend1',
            username: 'BingoMaster99',
            avatar: '',
            status: 'online',
            lastSeen: new Date()
          },
          {
            id: 'friend2', 
            username: 'LuckyPlayer42',
            avatar: '',
            status: 'playing',
            lastSeen: new Date()
          },
          {
            id: 'friend3',
            username: 'CardShark',
            avatar: '',
            status: 'offline',
            lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            id: 'friend4',
            username: 'NumberHunter',
            avatar: '',
            status: 'online',
            lastSeen: new Date()
          }
        ];

        return <FriendsSystem 
          friends={mockFriends} 
          onAddFriend={(username) => {
            // Check if friend already exists
            const existingFriend = mockFriends.find(f => f.username.toLowerCase() === username.toLowerCase());
            if (existingFriend) {
              alert(`You're already friends with ${username}!`);
              return;
            }
            
            // Add new friend
            const newFriend: Friend = {
              id: `friend_${Date.now()}`,
              username: username,
              avatar: '',
              status: 'offline',
              lastSeen: new Date()
            };
            
            alert(`Friend request sent to ${username}!\n\nThey will appear in your friends list once they accept.`);
          }} 
          onInviteToGame={(id) => {
            const friend = mockFriends.find(f => f.id === id);
            alert(`🎮 Game Invitation Sent!\n\nInvited ${friend?.username} to join your game!\n\nThey'll receive a notification and can join if they're online.`);
          }} 
          onSendMessage={(id) => {
            const friend = mockFriends.find(f => f.id === id);
            alert(`💬 Message Sent!\n\nYour message to ${friend?.username} has been sent!\n\nChat feature coming soon!`);
          }} 
        />;
      case 'events':
        // Create exciting seasonal events
        const seasonalEvents = [
          {
            id: 'summer-splash-2024',
            name: 'Summer Splash Bingo',
            description: 'Dive into summer with special water-themed bingo games and splash prizes!',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-08-31'),
            active: true,
            rewards: [
              {
                id: 'summer-daily',
                name: 'Daily Summer Bonus',
                description: 'Play 3 games in a day',
                requirement: 'Complete 3 games in 24 hours',
                reward: 25,
                claimed: false
              },
              {
                id: 'summer-weekly',
                name: 'Weekly Wave Rider',
                description: 'Win 5 games in a week',
                requirement: 'Win 5 games within 7 days',
                reward: 100,
                claimed: false
              },
              {
                id: 'summer-monthly',
                name: 'Summer Champion',
                description: 'Play 50 games this month',
                requirement: 'Complete 50 games in June',
                reward: 500,
                claimed: false
              }
            ]
          },
          {
            id: 'back-to-school-2024',
            name: 'Back to School Bingo',
            description: 'Get ready for the school year with educational bingo challenges!',
            startDate: new Date('2024-08-15'),
            endDate: new Date('2024-09-15'),
            active: false,
            rewards: [
              {
                id: 'school-study',
                name: 'Study Session',
                description: 'Play 10 games in a day',
                requirement: 'Complete 10 games in 24 hours',
                reward: 50,
                claimed: false
              },
              {
                id: 'school-homework',
                name: 'Homework Helper',
                description: 'Win 3 games in a row',
                requirement: 'Win 3 consecutive games',
                reward: 75,
                claimed: false
              }
            ]
          },
          {
            id: 'halloween-spooky-2024',
            name: 'Spooky Halloween Bingo',
            description: 'Trick or treat with our haunted bingo games and ghostly prizes!',
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            active: false,
            rewards: [
              {
                id: 'halloween-trick',
                name: 'Trick or Treat',
                description: 'Play during Halloween week',
                requirement: 'Play any game Oct 25-31',
                reward: 30,
                claimed: false
              },
              {
                id: 'halloween-costume',
                name: 'Costume Contest',
                description: 'Win with a special pattern',
                requirement: 'Win with X-pattern on Halloween',
                reward: 200,
                claimed: false
              }
            ]
          },
          {
            id: 'holiday-jackpot-2024',
            name: 'Holiday Jackpot Extravaganza',
            description: 'Celebrate the holidays with our biggest prize pool ever!',
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-31'),
            active: false,
            rewards: [
              {
                id: 'holiday-daily',
                name: 'Daily Gift',
                description: 'Play every day in December',
                requirement: 'Play at least 1 game daily',
                reward: 20,
                claimed: false
              },
              {
                id: 'holiday-mega',
                name: 'Mega Jackpot',
                description: 'Win the grand prize',
                requirement: 'Win 100 games in December',
                reward: 1000,
                claimed: false
              }
            ]
          }
        ];

        return <SeasonalEvents 
          events={seasonalEvents} 
          onClaimReward={(eventId, rewardId) => {
            alert(`🎉 Reward claimed!\n\nEvent: ${seasonalEvents.find(e => e.id === eventId)?.name}\nReward: ${seasonalEvents.find(e => e.id === eventId)?.rewards.find(r => r.id === rewardId)?.name}\n\nYou earned $${seasonalEvents.find(e => e.id === eventId)?.rewards.find(r => r.id === rewardId)?.reward}!`);
          }} 
        />;
      case 'vip':
        // VIP Benefits data
        const vipBenefits = [
          {
            id: '1',
            name: 'Bonus Entry Fees',
            description: 'Get 10% bonus on all entry fees paid',
            tier: 1,
            active: true
          },
          {
            id: '2', 
            name: 'Exclusive Game Rooms',
            description: 'Access to VIP-only high-stakes rooms',
            tier: 2,
            active: true
          },
          {
            id: '3',
            name: 'Priority Support',
            description: 'Get faster customer support response',
            tier: 2,
            active: true
          },
          {
            id: '4',
            name: 'Daily Bonus',
            description: 'Receive daily bonus credits',
            tier: 3,
            active: true
          },
          {
            id: '5',
            name: 'Double Prizes',
            description: 'Win double prizes in special events',
            tier: 4,
            active: true
          },
          {
            id: '6',
            name: 'Personal Manager',
            description: 'Dedicated VIP account manager',
            tier: 5,
            active: true
          }
        ];

        // Calculate VIP tier based on games played
        const gamesPlayed = player.gamesPlayed || 0;
        let currentTier = 0;
        let nextTierRequirement = 10;
        
        if (gamesPlayed >= 50) currentTier = 5;
        else if (gamesPlayed >= 30) { currentTier = 4; nextTierRequirement = 50; }
        else if (gamesPlayed >= 20) { currentTier = 3; nextTierRequirement = 30; }
        else if (gamesPlayed >= 10) { currentTier = 2; nextTierRequirement = 20; }
        else if (gamesPlayed >= 5) { currentTier = 1; nextTierRequirement = 10; }

        return <VIPSystem 
          player={player} 
          vipBenefits={vipBenefits} 
          currentTier={currentTier} 
          nextTierRequirement={nextTierRequirement}
          onUpgradeVIP={() => {
            alert(`Keep playing to reach the next VIP tier!\n\nCurrent: ${currentTier === 0 ? 'Regular' : `Tier ${currentTier}`}\nNext: ${currentTier < 5 ? `Tier ${currentTier + 1}` : 'Max Level'}\n\nPlay ${nextTierRequirement - gamesPlayed} more games to upgrade!`);
          }}
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
                rooms={gameRooms.map(room => ({
                  ...room,
                  timeLeft: roomTimers[room.id] || room.timeLeft
                }))}
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
    <GameSounds>
      <PushNotifications>
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Hero Section - New Design */}
      <div 
        className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Notification Permission Request */}
        <NotificationPermissionRequest />

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Back to Top Button */}
        <BackToTopButton />

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <LoadingSpinner size="lg" text="Processing..." />
            </div>
          </div>
        )}
        
        {user && (
        <div className="mb-8">
          <GameHeader 
            player={player}
            currentRoom={gameState.currentRoom?.name}
            prizePool={gameState.currentRoom?.prizePool || 0}
              onSignOut={signOut}
              onAddFunds={handleAddFundsClick}
              onViewProfile={() => setShowUserProfile(true)}
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

        {/* Quick Play Button */}
        {!showBingoGame && (
          <div className="mb-6 text-center">
            <Button 
              onClick={() => {
                setShowBingoGame(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold"
            >
              🎮 Play Bingo Now! 🎮
            </Button>
            <p className="text-gray-600 mt-2">Click to start playing immediately!</p>
          </div>
        )}
        
        {/* Tab Content */}
        {showBingoGame ? (
          <div className="space-y-4">
            <NavigationBreadcrumbs
              items={[
                { label: 'Game Rooms', onClick: () => setActiveTab('home') },
                { label: 'Playing Bingo' }
              ]}
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
            <ErrorBoundary>
              <SimpleBingoGame 
                onWin={(winType, prize) => {
                  setShowWinModal(true);
                  setPlayer(prev => ({ ...prev, balance: (prev.balance || 0) + prize }));
                  alert(`Congratulations! You won ${winType} and earned $${prize}!`);
                }}
                onGameEnd={() => {
                  setShowBingoGame(false);
                  setGameState(prev => ({ ...prev, gameStatus: 'finished' }));
                }}
              />
            </ErrorBoundary>
          </div>
        ) : (
          <div>
            {activeTab !== 'home' && (
              <NavigationBreadcrumbs
                items={[
                  { label: 'Game Rooms', onClick: () => setActiveTab('home') },
                  { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }
                ]}
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
        winType="line"
        prize={100}
      />
      
      <GameInstructions />
      <ChatSystem playerUsername={player.username || 'Player'} />
      
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

      {/* User Profile Modal */}
      {showUserProfile && user && (
        <UserProfile
          userId={user.id}
          onClose={() => setShowUserProfile(false)}
        />
      )}

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
      </PushNotifications>
    </GameSounds>
  );
};

export default EnhancedAppLayout;