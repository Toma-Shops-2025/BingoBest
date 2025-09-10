import { supabase } from './supabase';
import { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type GameRoom = Database['public']['Tables']['game_rooms']['Row'];
type BingoCard = Database['public']['Tables']['bingo_cards']['Row'];
type Tournament = Database['public']['Tables']['tournaments']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type PowerUp = Database['public']['Tables']['power_ups']['Row'];

export class SupabaseService {
  // User operations
  static async createUser(userData: {
    username: string;
    email: string;
    balance?: number;
  }): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  }

  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  static async updateUserBalance(userId: string, newBalance: number): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user balance:', error);
      return false;
    }

    return true;
  }

  // Game room operations
  static async getGameRooms(): Promise<GameRoom[]> {
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching game rooms:', error);
      return [];
    }

    return data || [];
  }

  static async createGameRoom(roomData: {
    name: string;
    max_players: number;
    entry_fee: number;
  }): Promise<GameRoom | null> {
    const { data, error } = await supabase
      .from('game_rooms')
      .insert([roomData])
      .select()
      .single();

    if (error) {
      console.error('Error creating game room:', error);
      return null;
    }

    return data;
  }

  static async updateGameRoomStatus(roomId: string, status: 'waiting' | 'playing' | 'finished'): Promise<boolean> {
    const { error } = await supabase
      .from('game_rooms')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', roomId);

    if (error) {
      console.error('Error updating game room status:', error);
      return false;
    }

    return true;
  }

  // Bingo card operations
  static async createBingoCard(cardData: {
    user_id: string;
    room_id: string;
    numbers: number[][];
    marked: boolean[][];
  }): Promise<BingoCard | null> {
    const { data, error } = await supabase
      .from('bingo_cards')
      .insert([cardData])
      .select()
      .single();

    if (error) {
      console.error('Error creating bingo card:', error);
      return null;
    }

    return data;
  }

  static async getBingoCards(userId: string, roomId: string): Promise<BingoCard[]> {
    const { data, error } = await supabase
      .from('bingo_cards')
      .select('*')
      .eq('user_id', userId)
      .eq('room_id', roomId);

    if (error) {
      console.error('Error fetching bingo cards:', error);
      return [];
    }

    return data || [];
  }

  static async updateBingoCard(cardId: string, marked: boolean[][]): Promise<boolean> {
    const { error } = await supabase
      .from('bingo_cards')
      .update({ marked })
      .eq('id', cardId);

    if (error) {
      console.error('Error updating bingo card:', error);
      return false;
    }

    return true;
  }

  // Tournament operations
  static async getTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }

    return data || [];
  }

  static async joinTournament(tournamentId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tournament_participants')
      .insert([{ tournament_id: tournamentId, user_id: userId }]);

    if (error) {
      console.error('Error joining tournament:', error);
      return false;
    }

    return true;
  }

  // Achievement operations
  static async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  }

  static async getUserAchievements(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  }

  // Power-up operations
  static async getPowerUps(): Promise<PowerUp[]> {
    const { data, error } = await supabase
      .from('power_ups')
      .select('*')
      .order('cost', { ascending: true });

    if (error) {
      console.error('Error fetching power-ups:', error);
      return [];
    }

    return data || [];
  }

  static async purchasePowerUp(userId: string, powerUpId: string, quantity: number = 1): Promise<boolean> {
    const { error } = await supabase
      .from('user_power_ups')
      .insert([{ user_id: userId, power_up_id: powerUpId, quantity }]);

    if (error) {
      console.error('Error purchasing power-up:', error);
      return false;
    }

    return true;
  }

  // Chat operations
  static async getChatMessages(roomId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        users (username, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }

    return data || [];
  }

  static async sendChatMessage(roomId: string, userId: string, message: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_messages')
      .insert([{ room_id: roomId, user_id: userId, message }]);

    if (error) {
      console.error('Error sending chat message:', error);
      return false;
    }

    return true;
  }

  // Real-time subscriptions
  static subscribeToGameRoom(roomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`game_room_${roomId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
        callback
      )
      .subscribe();
  }

  static subscribeToChat(roomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat_${roomId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
        callback
      )
      .subscribe();
  }

  static subscribeToBingoCards(userId: string, roomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`bingo_cards_${userId}_${roomId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bingo_cards', filter: `user_id=eq.${userId},room_id=eq.${roomId}` },
        callback
      )
      .subscribe();
  }
}
