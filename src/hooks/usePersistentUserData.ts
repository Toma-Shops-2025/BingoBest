import { useState, useEffect } from 'react';
import { userDataPersistence, UserProfile } from '@/lib/userDataPersistence';
import { useAuth } from '@/contexts/AuthContext';

export const usePersistentUserData = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile when user changes
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      
      const loadProfile = async () => {
        try {
          const profile = await userDataPersistence.loadUserProfile();
          setUserProfile(profile);
        } catch (err) {
          setError('Failed to load user profile');
          console.error('Error loading user profile:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProfile();
    } else {
      setUserProfile(null);
      setIsLoading(false);
      setError(null);
    }
  }, [user]);

  // Listen for real-time updates from other devices
  useEffect(() => {
    const handleUserDataUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail;
      setUserProfile(updatedProfile);
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, []);

  // Update balance
  const updateBalance = async (newBalance: number, withdrawableBalance?: number, bonusBalance?: number) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await userDataPersistence.updateBalance(newBalance, withdrawableBalance, bonusBalance);
      if (success) {
        // Update local state
        setUserProfile(prev => prev ? {
          ...prev,
          balance: newBalance,
          withdrawableBalance: withdrawableBalance ?? prev.withdrawableBalance,
          bonusBalance: bonusBalance ?? prev.bonusBalance
        } : null);
      }
      return success;
    } catch (err) {
      setError('Failed to update balance');
      console.error('Error updating balance:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update game statistics
  const updateGameStats = async (gamesPlayed: number, gamesWon: number, totalWinnings: number) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await userDataPersistence.updateGameStats(gamesPlayed, gamesWon, totalWinnings);
      if (success) {
        // Update local state
        setUserProfile(prev => prev ? {
          ...prev,
          games_played: gamesPlayed,
          games_won: gamesWon,
          total_winnings: totalWinnings,
          win_rate: gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0
        } : null);
      }
      return success;
    } catch (err) {
      setError('Failed to update game statistics');
      console.error('Error updating game statistics:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update VIP status
  const updateVIPStatus = async (vipTier: number, vipPoints: number) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await userDataPersistence.updateVIPStatus(vipTier, vipPoints);
      if (success) {
        // Update local state
        setUserProfile(prev => prev ? {
          ...prev,
          vip_tier: vipTier,
          vip_points: vipPoints
        } : null);
      }
      return success;
    } catch (err) {
      setError('Failed to update VIP status');
      console.error('Error updating VIP status:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save user profile
  const saveUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await userDataPersistence.saveUserProfile(profile);
      if (success) {
        // Update local state
        setUserProfile(prev => prev ? { ...prev, ...profile } : null);
      }
      return success;
    } catch (err) {
      setError('Failed to save user profile');
      console.error('Error saving user profile:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userProfile,
    isLoading,
    error,
    updateBalance,
    updateGameStats,
    updateVIPStatus,
    saveUserProfile
  };
};
