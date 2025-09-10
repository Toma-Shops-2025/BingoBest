import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lykaexuftxqwuwnvrakr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sbp_b50161dc6327c9999a86debc655a2b17502fe232';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          wins: number;
          games_played: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          balance?: number;
          wins?: number;
          games_played?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          balance?: number;
          wins?: number;
          games_played?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_rooms: {
        Row: {
          id: string;
          name: string;
          max_players: number;
          current_players: number;
          entry_fee: number;
          prize_pool: number;
          status: 'waiting' | 'playing' | 'finished';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          max_players: number;
          current_players?: number;
          entry_fee: number;
          prize_pool?: number;
          status?: 'waiting' | 'playing' | 'finished';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          max_players?: number;
          current_players?: number;
          entry_fee?: number;
          prize_pool?: number;
          status?: 'waiting' | 'playing' | 'finished';
          created_at?: string;
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
        };
        Insert: {
          id?: string;
          user_id: string;
          room_id: string;
          numbers: number[][];
          marked: boolean[][];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          room_id?: string;
          numbers?: number[][];
          marked?: boolean[][];
          created_at?: string;
        };
      };
      tournaments: {
        Row: {
          id: string;
          name: string;
          description: string;
          entry_fee: number;
          max_participants: number;
          current_participants: number;
          prize_pool: number;
          start_time: string;
          end_time: string;
          status: 'upcoming' | 'active' | 'completed';
          format: 'single_elimination' | 'double_elimination' | 'round_robin';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          entry_fee: number;
          max_participants: number;
          current_participants?: number;
          prize_pool: number;
          start_time: string;
          end_time: string;
          status?: 'upcoming' | 'active' | 'completed';
          format: 'single_elimination' | 'double_elimination' | 'round_robin';
          created_at?: string;
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
          format?: 'single_elimination' | 'double_elimination' | 'round_robin';
          created_at?: string;
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
        };
      };
    };
  };
}
