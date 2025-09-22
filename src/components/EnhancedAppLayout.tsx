import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { GAME_CONFIGS, GameSessionManager } from '@/lib/prizeDistribution';
import { gameState, getGameState } from '@/lib/gameState';
import { userDataPersistence, UserProfile } from '@/lib/userDataPersistence';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import GameHeader from './GameHeader';
import BalanceBreakdown from './BalanceBreakdown';
import BingoCard from './BingoCard';
import NumberDisplay from './NumberDisplay';
import GameRooms from './GameRooms';
import SimplePaymentSystem from './SimplePaymentSystem';
import BingoBestDashboard from './BingoBestDashboard';
import Leaderboard from './Leaderboard';
import GameInstructions from './GameInstructions';
import WinModal from './WinModal';
import GameStats from './GameStats';
import ChatSystem from './ChatSystem';
import MainNavigation from './MainNavigation';
import TournamentSystem from './TournamentSystem';
import TournamentPlayArea from './TournamentPlayArea';
import TournamentResultsScreen from './TournamentResultsScreen';
import AchievementSystem from './AchievementSystem';
import DailyChallenges from './DailyChallenges';
import FriendsSystem from './FriendsSystem';
import SeasonalEvents from './SeasonalEvents';
import VIPSystem from './VIPSystem';
import SpectatorMode from './SpectatorMode';
import LiveGameFeed from './LiveGameFeed';
import BingoGame from './BingoGame';
import SimpleBingoGame from './SimpleBingoGame';
import GameResultsScreen from './GameResultsScreen';
import BingoGameFallback from './BingoGameFallback';
import PWAInstallPrompt from './PWAInstallPrompt';
import BackToTopButton from './BackToTopButton';
import NavigationBreadcrumbs from './NavigationBreadcrumbs';
import LoadingSpinner from './LoadingSpinner';
import UserProfile from './UserProfile';
import GameSounds from './GameSounds';
import PushNotifications, { NotificationPermissionRequest } from './PushNotifications';
import ErrorBoundary from './ErrorBoundary';
import CasinoBackgroundMusic from './CasinoBackgroundMusic';
import FloatingParticles from './FloatingParticles';
import { financialSafety } from '@/lib/financialSafety';
import { analytics, trackPageView, trackUserAction } from '@/lib/analytics';
import { 
  GameRoom, 
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
  
  const [persistentUserProfile, setPersistentUserProfile] = useState<UserProfile | null>(null);
  
  // Load persistent user data when user changes
  useEffect(() => {
    if (user) {
      const loadPersistentData = async () => {
        const profile = await userDataPersistence.loadUserProfile();
        if (profile) {
          setPersistentUserProfile(profile);
          // Update player state with persistent data
          setPlayer(prev => ({
            ...prev,
            id: profile.id,
            username: profile.username,
            balance: profile.balance,
            withdrawableBalance: profile.withdrawableBalance,
            bonusBalance: profile.bonusBalance,
            level: profile.level,
            experience: profile.experience,
            totalWinnings: profile.total_winnings,
            gamesPlayed: profile.games_played,
            gamesWon: profile.games_won,
            winRate: profile.win_rate
          }));
        }
      };
      loadPersistentData();
    } else {
      setPersistentUserProfile(null);
    }
  }, [user]);


  // Listen for user data updates from other devices
  useEffect(() => {
    const handleUserDataUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail;
      console.log('🔄 Real-time user data update received:', updatedProfile);
      setPersistentUserProfile(updatedProfile);
      setPlayer(prev => ({
        ...prev,
        balance: updatedProfile.balance,
        withdrawableBalance: updatedProfile.withdrawableBalance,
        bonusBalance: updatedProfile.bonusBalance,
        level: updatedProfile.level,
        experience: updatedProfile.experience,
        totalWinnings: updatedProfile.total_winnings,
        gamesPlayed: updatedProfile.games_played,
        gamesWon: updatedProfile.games_won,
        winRate: updatedProfile.win_rate,
        vipTier: updatedProfile.vip_tier,
        vipPoints: updatedProfile.vip_points
      }));
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, []);
  
  // Initialize player with real game state
  const [player, setPlayer] = useState<Player>(() => {
    const stats = gameState.getPlayerStats();
    return {
      id: user?.id || 'guest',
      username: user?.email?.split('@')[0] || 'Player1',
      balance: 235.00, // Total balance
      withdrawableBalance: 150.00, // Real money that can be withdrawn
      bonusBalance: 85.00, // Non-withdrawable bonus credits
      level: 1,
      experience: stats.vipPoints,
      avatar: '',
      achievements: stats.achievementsUnlocked,
      friends: [],
      isOnline: true,
      lastActive: new Date().toISOString(),
      totalWinnings: stats.totalWinnings,
      gamesPlayed: stats.gamesPlayed,
      gamesWon: stats.gamesWon,
      winRate: stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0,
      favoriteRoom: 'Speed Bingo',
      joinDate: new Date().toISOString(),
      preferences: {
        soundEnabled: true,
        notificationsEnabled: true,
        theme: 'light'
      }
    };
  });

  const [gameSession, setGameSession] = useState({
    currentRoom: null as GameRoom | null,
    gameStatus: 'waiting' as 'waiting' | 'playing' | 'finished',
    currentNumber: null as number | null,
    calledNumbers: [] as number[],
    bingoCards: [] as any[],
    gameTimer: 300,
    currentSessionId: null as string | null,
    playerScore: 0,
    completedPatterns: [] as string[],
    gameType: 'bingo' as 'bingo' | 'tournament',
    tournamentId: null as string | null
  });

  // Tournament score tracking
  const [tournamentScores, setTournamentScores] = useState<Record<string, Array<{
    playerId: string;
    playerName: string;
    score: number;
    timestamp: Date;
    gameId: string;
  }>>>({});
  
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Tournament routing state
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showTournamentPlay, setShowTournamentPlay] = useState(false);
  
  // Friends state management
  const [mockFriends, setMockFriends] = useState<Friend[]>([
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
  ]);

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
      // timeLeft removed
      rules: getGameRules(config.id),
      powerUpsAllowed: true,
      minLevel: 1,
      maxLevel: 20
    }));
  });
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<Player[]>([
    { id: '1', username: 'BingoMaster', avatar: '', balance: 250, wins: 45, gamesPlayed: 120 },
    { id: '2', username: 'LuckyPlayer', avatar: '', balance: 180, wins: 32, gamesPlayed: 95 },
    { id: '3', username: 'Winner123', avatar: '', balance: 135, wins: 28, gamesPlayed: 80 },
    { id: '4', username: 'BingoQueen', avatar: '', balance: 108, wins: 22, gamesPlayed: 65 },
    { id: '5', username: 'GameChamp', avatar: '', balance: 84, wins: 18, gamesPlayed: 55 }
  ]);
  const [showBingoGame, setShowBingoGame] = useState(false);
  const [showGameResults, setShowGameResults] = useState(false);
  const [gameResults, setGameResults] = useState<any>(null);
  const [showTournamentResults, setShowTournamentResults] = useState(false);
  const [tournamentResults, setTournamentResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  // Room timers state removed
  const [showSpectatorMode, setShowSpectatorMode] = useState(false);
  const [spectatingTournament, setSpectatingTournament] = useState<string | null>(null);

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

  // Room timers removed - no longer needed

  const heroImage = "/1000015560.png";
  const ballImages = [
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515322144_660039cf.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515323914_9918e934.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515325711_afac1161.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515327507_f2967e74.webp",
    "https://d64gsuwffb70l.cloudfront.net/68c18cfaf53345a2b0f3b279_1757515329263_e8f5a258.webp"
  ];


  const handleAddFunds = (amount: number) => {
    setPlayer(prev => ({
      ...prev,
      balance: (prev.balance || 0) + amount
    }));
  };

  const handleWithdraw = (amount: number) => {
    if (amount <= (player.balance || 0)) {
      setPlayer(prev => ({
        ...prev,
        balance: (prev.balance || 0) - amount
      }));
    }
  };

  const handleAddFundsClick = () => {
    setActiveTab('wallet');
    // Scroll to top when opening wallet
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

        // Financial Safety Check - Ensure platform can cover payouts
        const financialCheck = financialSafety.canStartGame({
          entryFee: room.entryFee,
          minPlayers: room.maxPlayers * 0.3, // Assume 30% of max players
          maxPlayers: room.maxPlayers,
          estimatedPlayers: room.playerCount
        });

        if (!financialCheck.canStart) {
          alert(`🎰 Game Temporarily Unavailable\n\nThis game room is currently being prepared for the next round. Please try again in a few moments or join a different game room.\n\nThank you for your patience!`);
          setIsLoading(false);
          return;
        }
        
        // Create a game session with the new prize distribution system
        const realPlayer = {
          id: user?.id || 'anonymous',
          username: user?.user_metadata?.username || 'Player',
          entryFee: room.entryFee
        };
        
        const gameSession = GameSessionManager.createGameSession(roomId, [realPlayer]);
        
        // Record entry fee transaction
        await financialSafety.processEntryFee(
          user?.id || 'anonymous',
          gameSession.id,
          room.entryFee
        );

        // Start game session and track progress
        const sessionId = gameState.startGameSession('bingo', room.entryFee);
        
        // Deduct entry fee from balance
        setPlayer(prev => ({
          ...prev,
          balance: (prev.balance || 0) - room.entryFee,
          withdrawableBalance: Math.max(0, (prev.withdrawableBalance || 0) - room.entryFee)
        }));
        
        setGameSession(prev => ({
          ...prev,
          currentRoom: room,
          gameStatus: 'waiting',
          currentSessionId: sessionId
        }));
        
        // Start the bingo game with error handling
        try {
          setShowBingoGame(true);
          setActiveTab('home'); // Switch to home tab to show the game
          // Scroll to game area instead of top
          setTimeout(() => {
            const gameElement = document.querySelector('[data-game-area]');
            if (gameElement) {
              gameElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
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



  const handleSpectateTournament = (tournamentId: string) => {
    setSpectatingTournament(tournamentId);
    setShowSpectatorMode(true);
    setActiveTab('spectate');
    // Scroll to top when starting spectating
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // Create tournament system with proper timing cycles
        const now = new Date();
        
        // Calculate next cycle end times for each tournament
        const getNextCycleEnd = (cycleHours: number) => {
          const cycleMs = cycleHours * 60 * 60 * 1000;
          const currentCycleStart = new Date(Math.floor(now.getTime() / cycleMs) * cycleMs);
          return new Date(currentCycleStart.getTime() + cycleMs);
        };
        
        const tournaments = [
          {
            id: 'hourly-blast',
            name: 'Hourly Blast',
            description: 'Fast-paced bingo tournament - play as many times as you want!',
            entryFee: 5.00,
            maxParticipants: 50,
            currentParticipants: 23,
            prizePool: 50.00,
            startTime: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 minutes ago
            endTime: getNextCycleEnd(1), // Ends every hour
            status: 'active' as const,
            rounds: [],
            winners: [],
            format: 'score_based' as const,
            cycleHours: 1
          },
          {
            id: 'quick-strike',
            name: 'Quick Strike',
            description: 'Join immediately - no waiting! Play multiple times!',
            entryFee: 10.00,
            maxParticipants: 20,
            currentParticipants: 8,
            prizePool: 100.00,
            startTime: new Date(now.getTime() - 2 * 60 * 1000), // Started 2 minutes ago
            endTime: getNextCycleEnd(5), // Ends every 5 hours
            status: 'active' as const,
            rounds: [],
            winners: [],
            format: 'score_based' as const,
            cycleHours: 5
          },
          {
            id: 'daily-championship',
            name: 'Daily Championship',
            description: 'The ultimate bingo championship with massive prizes',
            entryFee: 15.00,
            maxParticipants: 100,
            currentParticipants: 67,
            prizePool: 150.00,
            startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000), // Started 6 hours ago
            endTime: getNextCycleEnd(12), // Ends every 12 hours
            status: 'active' as const,
            rounds: [],
            winners: [],
            format: 'score_based' as const,
            cycleHours: 12
          },
          {
            id: 'mega-jackpot',
            name: 'Mega Jackpot Tournament',
            description: 'The biggest tournament of the month!',
            entryFee: 20.00,
            maxParticipants: 200,
            currentParticipants: 156,
            prizePool: 200.00,
            startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000), // Started 12 hours ago
            endTime: getNextCycleEnd(24), // Ends every 24 hours
            status: 'active' as const,
            rounds: [],
            winners: [],
            format: 'score_based' as const,
            cycleHours: 24
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
              
              // Deduct entry fee and start game immediately
              setPlayer(prev => ({
                ...prev,
                balance: prev.balance - tournament.entryFee
              }));
              
              // Set tournament context and start game immediately
              setGameSession(prev => ({
                ...prev,
                currentRoom: {
                  id: tournament.id,
                  name: tournament.name,
                  maxPlayers: tournament.maxParticipants,
                  currentPlayers: tournament.currentParticipants,
                  entryFee: tournament.entryFee,
                  prizePool: tournament.prizePool,
                  status: 'playing' as const,
                  createdAt: tournament.startTime
                },
                gameType: 'tournament',
                tournamentId: tournament.id
              }));
              
              // Start the bingo game immediately
              setShowBingoGame(true);
              setActiveTab('home');
              
              console.log(`🎮 Starting tournament game: ${tournament.name}`);
            }
          }}
          onSpectateTournament={handleSpectateTournament}
        />;
      case 'achievements':
        const achievements = gameState.getAchievements();
        return <AchievementSystem 
          achievements={achievements} 
          onClaimReward={(id) => {
            const reward = gameState.claimAchievement(id);
            if (reward > 0) {
              // Update player balance
              setPlayer(prev => ({
                ...prev,
                bonusBalance: prev.bonusBalance + reward,
                balance: prev.balance + reward
              }));
              
              alert(`🎉 Achievement Unlocked!\n\nYou earned $${reward} bonus credits!\n\nKeep playing to unlock more achievements!`);
            } else {
              alert('This achievement reward has already been claimed or achievement not completed yet.');
            }
          }} 
        />;
      case 'challenges':
        // Create dynamic daily challenges
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Reset to start of day

        // Get real challenge progress from game state
        const challengeProgress = gameState.getChallengeProgress();
        const dailyChallenges = [
          {
            id: 'daily-play-3',
            name: 'Daily Player',
            description: 'Play 3 games today to earn bonus credits',
            requirement: 3,
            reward: 5,
            progress: challengeProgress.find(c => c.id === 'daily-play-3')?.progress || 0,
            completed: challengeProgress.find(c => c.id === 'daily-play-3')?.completed || false,
            expiresAt: tomorrow
          },
          {
            id: 'daily-win-1',
            name: 'Lucky Winner',
            description: 'Win at least 1 game today',
            requirement: 1,
            reward: 10,
            progress: challengeProgress.find(c => c.id === 'daily-win-1')?.progress || 0,
            completed: challengeProgress.find(c => c.id === 'daily-win-1')?.completed || false,
            expiresAt: tomorrow
          },
          {
            id: 'daily-spend-10',
            name: 'Big Spender',
            description: 'Spend $5 on entry fees today',
            requirement: 5,
            reward: 8,
            progress: challengeProgress.find(c => c.id === 'daily-spend-10')?.progress || 0,
            completed: challengeProgress.find(c => c.id === 'daily-spend-10')?.completed || false,
            expiresAt: tomorrow
          },
          {
            id: 'daily-streak',
            name: 'Streak Master',
            description: 'Play games for 3 consecutive days',
            requirement: 3,
            reward: 20,
            progress: challengeProgress.find(c => c.id === 'daily-streak')?.progress || 0,
            completed: challengeProgress.find(c => c.id === 'daily-streak')?.completed || false,
            expiresAt: tomorrow
          }
        ];

        return <DailyChallenges 
          challenges={dailyChallenges} 
          onClaimReward={(id) => {
            const reward = gameState.claimChallengeReward(id);
            if (reward > 0) {
              // Update player balance
              setPlayer(prev => ({
                ...prev,
                bonusBalance: prev.bonusBalance + reward,
                balance: prev.balance + reward
              }));
              
              alert(`🎉 Challenge Completed!\n\nYou earned $${reward} bonus credits!\n\nKeep playing to complete more challenges!`);
            } else {
              alert('This reward has already been claimed or challenge not completed yet.');
            }
          }} 
        />;
      case 'friends':

        return <FriendsSystem 
          friends={mockFriends} 
          onAddFriend={(username) => {
            try {
              // Validate username
              if (!username || username.trim().length < 2) {
                alert('❌ Please enter a valid username (at least 2 characters)');
                return;
              }
              
              // Check if trying to add yourself
              if (username.toLowerCase() === 'you' || username.toLowerCase() === 'yourself') {
                alert('❌ You cannot add yourself as a friend!');
                return;
              }
              
              // Check if friend already exists
              const existingFriend = mockFriends.find(f => f.username.toLowerCase() === username.toLowerCase());
              if (existingFriend) {
                alert(`❌ You're already friends with ${username}!`);
                return;
              }
              
              // Simulate friend request
              const newFriend: Friend = {
                id: `friend_${Date.now()}`,
                username: username.trim(),
                avatar: '',
                status: 'offline',
                lastSeen: new Date()
              };
              
              // Add to friends list (simulating acceptance)
              setMockFriends(prev => [...prev, newFriend]);
              
              alert(`🎉 Friend request sent to ${username}!\n\nThey have been added to your friends list!\n\nYou can now chat and play games together.`);
              
              console.log('Friend added:', newFriend);
            } catch (error) {
              console.error('Error adding friend:', error);
              alert('❌ There was an error adding your friend. Please try again.');
            }
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
        // Create exciting seasonal events with current dates
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        const seasonalEvents = [
          {
            id: 'new-year-celebration-2025',
            name: 'New Year Celebration',
            description: 'Ring in the new year with special bingo games and celebration prizes!',
            startDate: new Date(`${currentYear}-01-01`),
            endDate: new Date(`${currentYear}-01-31`),
            active: currentDate >= new Date(`${currentYear}-01-01`) && currentDate <= new Date(`${currentYear}-01-31`),
            rewards: [
              {
                id: 'new-year-daily',
                name: 'New Year Daily',
                description: 'Play every day in January',
                requirement: 'Play at least 1 game daily',
                reward: 8,
                claimed: false
              },
              {
                id: 'new-year-resolution',
                name: 'Resolution Keeper',
                description: 'Win 10 games in January',
                requirement: 'Win 10 games this month',
                reward: 30,
                claimed: false
              },
              {
                id: 'new-year-champion',
                name: 'New Year Champion',
                description: 'Play 25 games in January',
                requirement: 'Complete 25 games this month',
                reward: 80,
                claimed: false
              }
            ]
          },
          {
            id: 'valentines-love-2025',
            name: 'Valentine\'s Love Bingo',
            description: 'Share the love with heart-themed bingo games and romantic prizes!',
            startDate: new Date(`${currentYear}-02-01`),
            endDate: new Date(`${currentYear}-02-28`),
            active: currentDate >= new Date(`${currentYear}-02-01`) && currentDate <= new Date(`${currentYear}-02-28`),
            rewards: [
              {
                id: 'valentines-heart',
                name: 'Heart of Gold',
                description: 'Play on Valentine\'s Day',
                requirement: 'Play any game on Feb 14',
                reward: 25,
                claimed: false
              },
              {
                id: 'valentines-couple',
                name: 'Love Birds',
                description: 'Win 5 games in February',
                requirement: 'Win 5 games this month',
                reward: 40,
                claimed: false
              }
            ]
          },
          {
            id: 'spring-renewal-2025',
            name: 'Spring Renewal Bingo',
            description: 'Welcome spring with fresh bingo games and blooming prizes!',
            startDate: new Date(`${currentYear}-03-01`),
            endDate: new Date(`${currentYear}-05-31`),
            active: currentDate >= new Date(`${currentYear}-03-01`) && currentDate <= new Date(`${currentYear}-05-31`),
            rewards: [
              {
                id: 'spring-daily',
                name: 'Spring Daily',
                description: 'Play every day in spring',
                requirement: 'Play at least 1 game daily',
                reward: 12,
                claimed: false
              },
              {
                id: 'spring-bloom',
                name: 'Spring Bloom',
                description: 'Win 15 games in spring',
                requirement: 'Win 15 games this season',
                reward: 60,
                claimed: false
              },
              {
                id: 'spring-master',
                name: 'Spring Master',
                description: 'Play 50 games in spring',
                requirement: 'Complete 50 games this season',
                reward: 120,
                claimed: false
              }
            ]
          },
          {
            id: 'summer-splash-2025',
            name: 'Summer Splash Bingo',
            description: 'Dive into summer with special water-themed bingo games and splash prizes!',
            startDate: new Date(`${currentYear}-06-01`),
            endDate: new Date(`${currentYear}-08-31`),
            active: currentDate >= new Date(`${currentYear}-06-01`) && currentDate <= new Date(`${currentYear}-08-31`),
            rewards: [
              {
                id: 'summer-daily',
                name: 'Summer Daily',
                description: 'Play every day in summer',
                requirement: 'Play at least 1 game daily',
                reward: 15,
                claimed: false
              },
              {
                id: 'summer-wave',
                name: 'Wave Rider',
                description: 'Win 20 games in summer',
                requirement: 'Win 20 games this season',
                reward: 80,
                claimed: false
              },
              {
                id: 'summer-champion',
                name: 'Summer Champion',
                description: 'Play 75 games in summer',
                requirement: 'Complete 75 games this season',
                reward: 200,
                claimed: false
              }
            ]
          },
          {
            id: 'halloween-spooky-2025',
            name: 'Spooky Halloween Bingo',
            description: 'Trick or treat with our haunted bingo games and ghostly prizes!',
            startDate: new Date(`${currentYear}-10-01`),
            endDate: new Date(`${currentYear}-10-31`),
            active: currentDate >= new Date(`${currentYear}-10-01`) && currentDate <= new Date(`${currentYear}-10-31`),
            rewards: [
              {
                id: 'halloween-trick',
                name: 'Trick or Treat',
                description: 'Play during Halloween week',
                requirement: 'Play any game Oct 25-31',
                reward: 15,
                claimed: false
              },
              {
                id: 'halloween-costume',
                name: 'Costume Contest',
                description: 'Win with a special pattern',
                requirement: 'Win with X-pattern on Halloween',
                reward: 80,
                claimed: false
              }
            ]
          },
          {
            id: 'holiday-jackpot-2025',
            name: 'Holiday Jackpot Extravaganza',
            description: 'Celebrate the holidays with our biggest prize pool ever!',
            startDate: new Date(`${currentYear}-12-01`),
            endDate: new Date(`${currentYear}-12-31`),
            active: currentDate >= new Date(`${currentYear}-12-01`) && currentDate <= new Date(`${currentYear}-12-31`),
            rewards: [
              {
                id: 'holiday-daily',
                name: 'Daily Gift',
                description: 'Play every day in December',
                requirement: 'Play at least 1 game daily',
                reward: 12,
                claimed: false
              },
              {
                id: 'holiday-mega',
                name: 'Mega Jackpot',
                description: 'Win the grand prize',
                requirement: 'Win 100 games in December',
                reward: 400,
                claimed: false
              }
            ]
          }
        ];

        return <SeasonalEvents 
          events={seasonalEvents} 
          onClaimReward={(eventId, rewardId) => {
            try {
              const event = seasonalEvents.find(e => e.id === eventId);
              const reward = event?.rewards.find(r => r.id === rewardId);
              
              if (!event || !reward) {
                alert('❌ Error: Reward not found!');
                return;
              }
              
              // Mark reward as claimed
              const updatedEvents = seasonalEvents.map(e => 
                e.id === eventId 
                  ? {
                      ...e,
                      rewards: e.rewards.map(r => 
                        r.id === rewardId 
                          ? { ...r, claimed: true }
                          : r
                      )
                    }
                  : e
              );
              
              // Update the events state
              setSeasonalEvents(updatedEvents);
              
              // Show success message
              alert(`🎉 Reward claimed!\n\nEvent: ${event.name}\nReward: ${reward.name}\n\nYou earned $${reward.reward}!\n\nThis reward is non-withdrawable and will be added to your account balance.`);
              
              console.log('Reward claimed:', { eventId, rewardId, reward });
            } catch (error) {
              console.error('Error claiming reward:', error);
              alert('❌ There was an error claiming your reward. Please try again.');
            }
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

        // Update VIP status and get current tier
        gameState.updateVIPStatus();
        const stats = gameState.getPlayerStats();
        const currentTier = stats.vipTier;
        const nextTierRequirement = currentTier < 5 ? [10, 20, 30, 50, 100][currentTier] : 100;

        return <VIPSystem 
          player={player} 
          vipBenefits={vipBenefits} 
          currentTier={currentTier} 
          nextTierRequirement={nextTierRequirement}
          onUpgradeVIP={async () => {
            console.log('VIP Upgrade button clicked!');
            console.log('Current tier:', currentTier);
            console.log('Games played:', gamesPlayed);
            console.log('Next tier requirement:', nextTierRequirement);
            
            try {
              // Update VIP status based on current games played
              const gameState = getGameState();
              gameState.updateVIPStatus();
              
              // Get updated stats
              const updatedStats = gameState.getPlayerStats();
              const newTier = updatedStats.vipTier;
              
              console.log('Updated tier:', newTier);
              
              if (newTier > currentTier) {
                // VIP tier actually upgraded
                const tierNames = ['Regular', 'Bronze VIP', 'Silver VIP', 'Gold VIP', 'Platinum VIP', 'Diamond VIP'];
                alert(`🎉 Congratulations! You've been upgraded to ${tierNames[newTier]}!\n\nYour VIP benefits are now active!`);
                
                // Force a re-render to show updated VIP status
                setStats(prevStats => ({
                  ...prevStats,
                  vipTier: newTier,
                  vipPoints: updatedStats.vipPoints
                }));

                // Save VIP status to persistent storage
                if (user) {
                  await userDataPersistence.updateVIPStatus(newTier, updatedStats.vipPoints);
                }
              } else {
                // Not enough games played yet
                const gamesNeeded = nextTierRequirement - gamesPlayed;
                alert(`Keep playing to reach the next VIP tier!\n\nCurrent: ${currentTier === 0 ? 'Regular' : `Tier ${currentTier}`}\nNext: ${currentTier < 5 ? `Tier ${currentTier + 1}` : 'Max Level'}\n\nPlay ${gamesNeeded} more games to upgrade!`);
              }
            } catch (error) {
              console.error('VIP upgrade error:', error);
              alert('There was an error processing your VIP upgrade. Please try again.');
            }
          }}
        />;
      case 'spectate':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Spectating Tournament</h2>
              <Button 
                onClick={() => {
                  setShowSpectatorMode(false);
                  setSpectatingTournament(null);
                  setActiveTab('tournaments');
                }}
                variant="outline"
              >
                Back to Tournaments
              </Button>
            </div>
            <SpectatorMode 
              activeGames={[]} 
              onJoinAsSpectator={(id) => alert(`Watching game ${id} as spectator!`)} 
              onJoinAsPlayer={(id) => alert(`Joined game ${id} as player!`)} 
            />
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-6">
            <SimplePaymentSystem 
              playerBalance={player.balance}
              onAddFunds={handleAddFunds}
              onWithdraw={handleWithdraw}
            />
          </div>
        );
      case 'platform':
        return (
          <div className="space-y-6">
            <BingoBestDashboard />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div 
              className="p-6 rounded-lg"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/game-cards-background.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <GameRooms
                rooms={gameRooms}
                onJoinRoom={handleJoinRoom}
                playerBalance={player.balance}
              />
            </div>
            <Leaderboard players={leaderboardPlayers} />
            <GameStats player={player} />
            <LiveGameFeed 
              playerBalance={player.balance}
              playerWithdrawableBalance={player.withdrawableBalance}
              playerBonusBalance={player.bonusBalance}
                onBalanceUpdate={async (newBalance, newWithdrawableBalance, newBonusBalance) => {
                  setPlayer(prev => ({
                    ...prev,
                    balance: newBalance,
                    withdrawableBalance: newWithdrawableBalance,
                    bonusBalance: newBonusBalance
                  }));
                  
                  // Save to persistent storage
                  if (user) {
                    await userDataPersistence.updateBalance(newBalance, newWithdrawableBalance, newBonusBalance);
                  }
                }}
            />
          </div>
        );
    }
  };

  return (
    <GameSounds>
      <PushNotifications>
    <div className="min-h-screen casino-bg relative">
      <FloatingParticles />
      {/* Hero Section - Casino Design */}
      <div 
        className="relative h-[600px] bg-cover bg-center flex items-center justify-center casino-glow"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="text-center z-10">
          {/* Hero Logo Overlay */}
          <div className="mb-8">
            <img 
              src="/Hero-Logo-Overlay.png" 
              alt="BingoBest Logo" 
              className="mx-auto max-w-full h-auto max-h-[30rem] drop-shadow-2xl opacity-75"
              style={{ transform: 'scale(1.25)' }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        {/* Welcome Bonus Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🎉</span>
            <h3 className="text-lg font-bold text-white">New Player Welcome Bonus</h3>
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-green-300 font-medium">
            Start with $100 free credits to explore all our games!
          </p>
          <p className="text-sm text-gray-300 mt-1">
            One-time bonus for new players only
          </p>
        </div>

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
          {/* Detailed Balance Breakdown */}
          <div className="mt-4">
            <BalanceBreakdown
              totalBalance={player.balance}
              withdrawableBalance={player.withdrawableBalance}
              bonusBalance={player.bonusBalance}
              showDetails={true}
            />
          </div>
        </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <MainNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
        </div>

        {/* Important Disclaimer */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-sm text-yellow-800 font-medium">
              <p className="font-bold text-yellow-900 mb-1">IMPORTANT - PLEASE READ:</p>
              <p className="mb-1">Any bonus monies or rewards monies are to be used for game play entry fees. All actual winnings are added to your account and are withdrawable.</p>
              <p className="mb-1">When a player does not have any bonus or rewards monies, players can enter any games or tournaments by Adding Funds to their account!</p>
              <p className="font-bold text-yellow-900">Thank You and Win Big with BingoBest!!!</p>
            </div>
          </div>
        </div>
        

        
        {/* Tab Content */}
        {showBingoGame ? (
          <div className="space-y-4" data-game-area>
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
                autoStart={false}
                gameName={gameSession.currentRoom?.name || 'Speed Bingo'}
                gameId={gameSession.currentRoom?.id}
                gameType={gameSession.gameType}
                entryFee={gameSession.currentRoom?.entryFee || 5.00}
                onNumberCalled={(number) => {
                  // Track called numbers in game session
                  setGameSession(prev => ({
                    ...prev,
                    calledNumbers: [...prev.calledNumbers, number]
                  }));
                }}
                onScoreUpdate={(newScore) => {
                  // Track player score updates
                  setGameSession(prev => ({
                    ...prev,
                    playerScore: newScore
                  }));
                }}
                onWin={async (winType, prize) => {
                  setShowWinModal(true);
                  
                  // Complete game session and track progress
                  gameState.completeGameSession(gameState.currentSessionId!, prize, true);
                  
                  // Update player balance and stats
                  const newBalance = (player.balance || 0) + prize;
                  const newWithdrawableBalance = (player.withdrawableBalance || 0) + prize;
                  const newStats = gameState.getPlayerStats();
                  
                  setPlayer(prev => ({
                    ...prev,
                    balance: newBalance,
                    withdrawableBalance: newWithdrawableBalance,
                    totalWinnings: newStats.totalWinnings,
                    gamesPlayed: newStats.gamesPlayed,
                    gamesWon: newStats.gamesWon,
                    winRate: newStats.gamesPlayed > 0 ? (newStats.gamesWon / newStats.gamesPlayed) * 100 : 0
                  }));
                  
                  // Persist the balance update to the database
                  if (user) {
                    try {
                      await userDataPersistence.updateBalance(newBalance, newWithdrawableBalance, player.bonusBalance);
                      console.log(`✅ Balance updated: +$${prize} (Total: $${newBalance})`);
                    } catch (error) {
                      console.error('Error updating balance:', error);
                    }
                  }
                  
                  alert(`Congratulations! You won ${winType} and earned $${prize}!`);
                }}
                onPatternCompleted={(pattern, score) => {
                  // Track completed patterns in game session
                  setGameSession(prev => ({
                    ...prev,
                    completedPatterns: [...prev.completedPatterns, pattern],
                    playerScore: prev.playerScore + score
                  }));
                }}
                onGameEnd={() => {
                  // Get the current game session to access real prize distribution
                  const currentSession = gameSession.currentSessionId ? 
                    GameSessionManager.getGameSession(gameSession.currentSessionId) : null;
                  
                  // Get actual game data from the bingo game
                  const actualPlayerScore = gameSession.playerScore || 0;
                  const actualNumbersCalled = gameSession.calledNumbers?.length || 0;
                  const actualPatternsCompleted = gameSession.completedPatterns || [];
                  
                  // Handle tournament vs regular game results
                  if (gameSession.gameType === 'tournament' && gameSession.tournamentId) {
                    // Tournament game - show tournament results
                    const tournamentId = gameSession.tournamentId;
                    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    
                    // Track tournament score
                    setTournamentScores(prev => ({
                      ...prev,
                      [tournamentId]: [
                        ...(prev[tournamentId] || []),
                        {
                          playerId: player.id,
                          playerName: player.username,
                          score: actualPlayerScore,
                          timestamp: new Date(),
                          gameId: gameId
                        }
                      ]
                    }));
                    
                    console.log(`🏆 Tournament score recorded: ${actualPlayerScore} points for ${tournamentId}`);
                    
                    // Generate tournament results
                    const tournamentResults = {
                      tournamentName: gameSession.currentRoom?.name || 'Tournament',
                      tournamentId: tournamentId,
                      playerScore: actualPlayerScore,
                      rank: Math.floor(Math.random() * 10) + 1, // Mock rank for now
                      totalPlayers: Math.floor(Math.random() * 50) + 20, // Mock total players
                      cycleTimeRemaining: '2h 15m', // Mock remaining time
                      nextCycleEnd: new Date(Date.now() + 2 * 60 * 60 * 1000), // Mock next cycle end
                      bestScore: actualPlayerScore + Math.floor(Math.random() * 10000), // Mock best score
                      averageScore: Math.floor(actualPlayerScore * 0.7), // Mock average score
                      gamesPlayed: (tournamentScores[tournamentId]?.length || 0) + 1,
                      patternsCompleted: actualPatternsCompleted.length > 0 ? actualPatternsCompleted : ['Line'],
                      numbersCalled: actualNumbersCalled,
                      bonusPoints: Math.max(0, actualPlayerScore - (actualNumbersCalled * 1000)),
                      penalties: 0,
                      finalScore: actualPlayerScore + Math.max(0, actualPlayerScore - (actualNumbersCalled * 1000))
                    };
                    
                    setTournamentResults(tournamentResults);
                    setShowBingoGame(false);
                    setShowTournamentResults(true);
                    setGameSession(prev => ({ ...prev, gameStatus: 'finished' }));
                  } else {
                    // Regular game - show regular results
                    const mockResults = {
                      playerScore: actualPlayerScore,
                      totalNumbersCalled: actualNumbersCalled,
                      patternsCompleted: actualPatternsCompleted.length > 0 ? actualPatternsCompleted : ['Line'],
                      bonusPoints: Math.max(0, actualPlayerScore - (actualNumbersCalled * 1000)),
                      penalties: 0,
                      finalScore: 0,
                      rank: Math.floor(Math.random() * 5) + 1,
                      totalPlayers: currentSession?.players.length || Math.floor(Math.random() * 20) + 10,
                      prizes: currentSession ? {
                        first: Math.round(currentSession.prizeDistribution.firstPlace * 100) / 100,
                        second: Math.round(currentSession.prizeDistribution.secondPlace * 100) / 100,
                        third: Math.round(currentSession.prizeDistribution.thirdPlace * 100) / 100
                      } : {
                        first: 50,
                        second: 25,
                        third: 10
                      },
                      celebration: true
                    };
                    
                    mockResults.finalScore = mockResults.playerScore + mockResults.bonusPoints - mockResults.penalties;
                    
                    setGameResults(mockResults);
                    setShowBingoGame(false);
                    setShowGameResults(true);
                    setGameSession(prev => ({ ...prev, gameStatus: 'finished' }));
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        ) : showGameResults && gameResults ? (
          <GameResultsScreen
            results={gameResults}
            onPlayAgain={() => {
              setShowGameResults(false);
              setShowBingoGame(true);
            }}
            onBackToGameRoom={() => {
              setShowGameResults(false);
              setActiveTab('home');
            }}
          />
        ) : showTournamentResults && tournamentResults ? (
          <TournamentResultsScreen
            results={tournamentResults}
            onPlayAgain={() => {
              setShowTournamentResults(false);
              setShowBingoGame(true);
            }}
            onBackToTournaments={() => {
              setShowTournamentResults(false);
              setActiveTab('tournaments');
            }}
          />
        ) : showTournamentPlay && selectedTournament ? (
          <TournamentPlayArea
            tournament={selectedTournament}
            player={player}
            onBack={() => {
              setShowTournamentPlay(false);
              setSelectedTournament(null);
            }}
            onStartGame={() => {
              // Start the actual bingo game for the tournament
              setShowBingoGame(true);
              setShowTournamentPlay(false);
              // Set tournament context for the game
              setGameSession(prev => ({
                ...prev,
                currentRoom: {
                  id: selectedTournament.id,
                  name: selectedTournament.name,
                  maxPlayers: selectedTournament.maxParticipants,
                  currentPlayers: selectedTournament.currentParticipants,
                  entryFee: selectedTournament.entryFee,
                  prizePool: selectedTournament.prizePool,
                  status: 'playing' as const,
                  createdAt: selectedTournament.startTime
                },
                gameType: 'tournament',
                tournamentId: selectedTournament.id
              }));
            }}
          />
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

      {/* Casino Background Music */}
      <CasinoBackgroundMusic enabled={true} />


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">BingoBest</h3>
              <p className="text-gray-300 text-sm">
                Crypto Bingo Adventures - The ultimate online bingo experience with real money prizes, tournaments, and social features.
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
                    href="mailto:support@bingobest.live?subject=BingoBest Support Request&body=Hello BingoBest Support Team,%0D%0A%0D%0AI need help with:%0D%0A%0D%0A"
                    className="text-gray-300 hover:text-white"
                    onClick={(e) => {
                      // Fallback for browsers that don't support mailto
                      if (!e.defaultPrevented) {
                        e.preventDefault();
                        const email = 'support@bingobest.live';
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
            <div>
              <h4 className="font-semibold mb-4">🎁 Get Free Credits!</h4>
              <p className="text-gray-300 text-sm mb-3">
                Subscribe for exclusive bonuses, game tips, and special offers!
              </p>
              <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-md">
                <p className="text-xs text-green-300 font-medium">
                  ✨ New players start with $100 welcome bonus!
                </p>
              </div>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-2 px-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    alert('🎉 Thank you for subscribing!\n\nYou\'ll receive:\n• $5 Free Credits (non-withdrawable)\n• Weekly bonus codes\n• Game strategy tips\n• Exclusive tournament invites\n\nCheck your email for confirmation!');
                  }}
                >
                  Subscribe & Get $5 Free!
                </button>
                <p className="text-xs text-gray-400">
                  *Free credits are non-withdrawable, for gameplay only
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 BingoBest. All rights reserved. | 18+ Only | Play Responsibly</p>
          </div>
        </div>
      </footer>
    </div>
      </PushNotifications>
    </GameSounds>
  );
};

export default EnhancedAppLayout;