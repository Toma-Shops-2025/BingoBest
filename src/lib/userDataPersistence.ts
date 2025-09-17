import { getSupabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  withdrawableBalance: number;
  bonusBalance: number;
  level: number;
  experience: number;
  avatar_url?: string;
  total_winnings: number;
  games_played: number;
  games_won: number;
  win_rate: number;
  vip_tier: number;
  vip_points: number;
  last_sign_in_at?: string;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  device_id: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  last_activity: string;
  is_active: boolean;
}

class UserDataPersistence {
  private supabase = getSupabase();
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;
  private deviceId: string;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.initializeAuthListener();
  }

  private generateDeviceId(): string {
    // Generate a unique device ID based on browser fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `device_${Math.abs(hash)}`;
  }

  private initializeAuthListener() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.currentUser = session.user;
        await this.loadUserProfile();
        await this.registerDevice();
        this.startDataSync();
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.userProfile = null;
        this.stopDataSync();
        await this.unregisterDevice();
      }
    });
  }

  async loadUserProfile(): Promise<UserProfile | null> {
    if (!this.currentUser) return null;

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', this.currentUser.id)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }

      this.userProfile = {
        id: data.id,
        username: data.username,
        email: data.email,
        balance: data.balance || 0,
        withdrawableBalance: data.withdrawable_balance || 0,
        bonusBalance: data.bonus_balance || 0,
        level: data.level || 1,
        experience: data.experience || 0,
        avatar_url: data.avatar_url,
        total_winnings: data.total_winnings || 0,
        games_played: data.games_played || 0,
        games_won: data.games_won || 0,
        win_rate: data.win_rate || 0,
        vip_tier: data.vip_tier || 0,
        vip_points: data.vip_points || 0,
        last_sign_in_at: data.last_sign_in_at,
        is_online: data.is_online || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      console.log('✅ User profile loaded:', this.userProfile);
      return this.userProfile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  async saveUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    if (!this.currentUser || !this.userProfile) return false;

    try {
      const updateData = {
        ...profile,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.supabase
        .from('users')
        .update(updateData)
        .eq('id', this.currentUser.id);

      if (error) {
        console.error('Error saving user profile:', error);
        return false;
      }

      // Update local profile
      this.userProfile = { ...this.userProfile, ...profile };
      console.log('✅ User profile saved:', this.userProfile);
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  async updateBalance(newBalance: number, withdrawableBalance?: number, bonusBalance?: number): Promise<boolean> {
    const updateData: any = { balance: newBalance };
    
    if (withdrawableBalance !== undefined) {
      updateData.withdrawable_balance = withdrawableBalance;
    }
    
    if (bonusBalance !== undefined) {
      updateData.bonus_balance = bonusBalance;
    }

    return await this.saveUserProfile(updateData);
  }

  async updateGameStats(gamesPlayed: number, gamesWon: number, totalWinnings: number): Promise<boolean> {
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
    
    return await this.saveUserProfile({
      games_played: gamesPlayed,
      games_won: gamesWon,
      total_winnings: totalWinnings,
      win_rate: winRate
    });
  }

  async updateVIPStatus(vipTier: number, vipPoints: number): Promise<boolean> {
    return await this.saveUserProfile({
      vip_tier: vipTier,
      vip_points: vipPoints
    });
  }

  async registerDevice(): Promise<boolean> {
    if (!this.currentUser) return false;

    try {
      const deviceType = this.getDeviceType();
      
      const { error } = await this.supabase
        .from('user_sessions')
        .upsert({
          user_id: this.currentUser.id,
          device_id: this.deviceId,
          device_type: deviceType,
          last_activity: new Date().toISOString(),
          is_active: true
        });

      if (error) {
        console.error('Error registering device:', error);
        return false;
      }

      console.log('✅ Device registered:', this.deviceId);
      return true;
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }

  async unregisterDevice(): Promise<boolean> {
    if (!this.currentUser) return false;

    try {
      const { error } = await this.supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', this.currentUser.id)
        .eq('device_id', this.deviceId);

      if (error) {
        console.error('Error unregistering device:', error);
        return false;
      }

      console.log('✅ Device unregistered:', this.deviceId);
      return true;
    } catch (error) {
      console.error('Error unregistering device:', error);
      return false;
    }
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
    
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }

  private startDataSync() {
    // Sync user data every 30 seconds
    this.syncInterval = setInterval(async () => {
      if (this.currentUser && this.userProfile) {
        await this.syncUserData();
      }
    }, 30000);
  }

  private stopDataSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async syncUserData() {
    if (!this.currentUser) return;

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', this.currentUser.id)
        .single();

      if (error) {
        console.error('Error syncing user data:', error);
        return;
      }

      // Check if data has changed
      const hasChanges = JSON.stringify(data) !== JSON.stringify(this.userProfile);
      
      if (hasChanges) {
        console.log('🔄 User data updated from server');
        await this.loadUserProfile();
        
        // Dispatch custom event for components to update
        window.dispatchEvent(new CustomEvent('userDataUpdated', {
          detail: this.userProfile
        }));
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }

  // Public methods for components to use
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  async createUserProfile(user: User, additionalData: {
    username: string;
    email: string;
    balance?: number;
    withdrawableBalance?: number;
    bonusBalance?: number;
  }): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users')
        .insert({
          id: user.id,
          username: additionalData.username,
          email: additionalData.email,
          balance: additionalData.balance || 100, // Welcome bonus
          withdrawable_balance: additionalData.withdrawableBalance || 0,
          bonus_balance: additionalData.bonusBalance || 100, // Welcome bonus
          level: 1,
          experience: 0,
          total_winnings: 0,
          games_played: 0,
          games_won: 0,
          win_rate: 0,
          vip_tier: 0,
          vip_points: 0,
          is_online: true,
          last_sign_in_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating user profile:', error);
        return false;
      }

      console.log('✅ User profile created');
      return true;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
  }

  async signInUser(): Promise<boolean> {
    if (!this.currentUser) return false;

    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          is_online: true,
          last_sign_in_at: new Date().toISOString()
        })
        .eq('id', this.currentUser.id);

      if (error) {
        console.error('Error updating sign-in status:', error);
        return false;
      }

      console.log('✅ User sign-in status updated');
      return true;
    } catch (error) {
      console.error('Error updating sign-in status:', error);
      return false;
    }
  }

  async signOutUser(): Promise<boolean> {
    if (!this.currentUser) return false;

    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          is_online: false
        })
        .eq('id', this.currentUser.id);

      if (error) {
        console.error('Error updating sign-out status:', error);
        return false;
      }

      console.log('✅ User sign-out status updated');
      return true;
    } catch (error) {
      console.error('Error updating sign-out status:', error);
      return false;
    }
  }
}

// Export singleton instance
export const userDataPersistence = new UserDataPersistence();
