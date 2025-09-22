import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lykaexuftxqwuwnvrakr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sbp_b50161dc6327c9999a86debc655a2b17502fe232';

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Please check your environment variables.');
}

// Lazy initialization to avoid circular dependencies
let _supabase: any = null;

export const getSupabase = () => {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Set the correct site URL for email confirmations
        siteUrl: import.meta.env.VITE_SITE_URL || 'https://bingobest.live',
        redirectTo: (import.meta.env.VITE_SITE_URL || 'https://bingobest.live') + '/email-confirmation.html'
      }
    });
  }
  return _supabase;
};

// For backward compatibility
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    return getSupabase()[prop];
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          balance: number;
          withdrawable_balance: number;
          bonus_balance: number;
          level: number;
          experience: number;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
          last_sign_in_at?: string;
          is_online: boolean;
          total_winnings: number;
          games_played: number;
          games_won: number;
          win_rate: number;
          vip_tier: number;
          vip_points: number;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          balance?: number;
          withdrawable_balance?: number;
          bonus_balance?: number;
          level?: number;
          experience?: number;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string;
          is_online?: boolean;
          total_winnings?: number;
          games_played?: number;
          games_won?: number;
          win_rate?: number;
          vip_tier?: number;
          vip_points?: number;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          balance?: number;
          withdrawable_balance?: number;
          bonus_balance?: number;
          level?: number;
          experience?: number;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string;
          is_online?: boolean;
          total_winnings?: number;
          games_played?: number;
          games_won?: number;
          win_rate?: number;
          vip_tier?: number;
          vip_points?: number;
        };
      };
      game_rooms: {
        Row: {
          id: string;
          name: string;
          description?: string;
          max_players: number;
          current_players: number;
          entry_fee: number;
          prize_pool: number;
          status: 'waiting' | 'playing' | 'finished';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          max_players: number;
          current_players?: number;
          entry_fee: number;
          prize_pool?: number;
          status?: 'waiting' | 'playing' | 'finished';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          max_players?: number;
          current_players?: number;
          entry_fee?: number;
          prize_pool?: number;
          status?: 'waiting' | 'playing' | 'finished';
          created_at?: string;
          updated_at?: string;
        };
      };
      bingo_cards: {
        Row: {
          id: string;
          user_id: string;
          room_id: string;
          numbers: number[][];
          marked: boolean[][];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          room_id: string;
          numbers: number[][];
          marked: boolean[][];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          room_id?: string;
          numbers?: number[][];
          marked?: boolean[][];
          created_at?: string;
          updated_at?: string;
        };
      };
      tournaments: {
        Row: {
          id: string;
          name: string;
          description?: string;
          entry_fee: number;
          max_participants: number;
          current_participants: number;
          prize_pool: number;
          start_time: string;
          end_time: string;
          status: 'upcoming' | 'active' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          entry_fee: number;
          max_participants: number;
          current_participants?: number;
          prize_pool?: number;
          start_time: string;
          end_time: string;
          status?: 'upcoming' | 'active' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          entry_fee?: number;
          max_participants?: number;
          current_participants?: number;
          prize_pool?: number;
          start_time?: string;
          end_time?: string;
          status?: 'upcoming' | 'active' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: 'wins' | 'games' | 'money' | 'special';
          requirement: number;
          reward: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          category: 'wins' | 'games' | 'money' | 'special';
          requirement: number;
          reward: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          category?: 'wins' | 'games' | 'money' | 'special';
          requirement?: number;
          reward?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      power_ups: {
        Row: {
          id: string;
          name: string;
          description: string;
          cost: number;
          icon: string;
          type: 'auto_daub' | 'extra_ball' | 'peek_next' | 'double_prize';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          cost: number;
          icon: string;
          type: 'auto_daub' | 'extra_ball' | 'peek_next' | 'double_prize';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          cost?: number;
          icon?: string;
          type?: 'auto_daub' | 'extra_ball' | 'peek_next' | 'double_prize';
          created_at?: string;
          updated_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          room_id: string;
          entry_fee: number;
          winnings: number;
          duration: number;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          room_id: string;
          entry_fee: number;
          winnings?: number;
          duration?: number;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          room_id?: string;
          entry_fee?: number;
          winnings?: number;
          duration?: number;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          message?: string;
          created_at?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          device_id: string;
          device_type: 'mobile' | 'desktop' | 'tablet';
          last_activity: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_id: string;
          device_type: 'mobile' | 'desktop' | 'tablet';
          last_activity?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_id?: string;
          device_type?: 'mobile' | 'desktop' | 'tablet';
          last_activity?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}