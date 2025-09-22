import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { SupabaseService } from '@/lib/supabaseService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Failed to get initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setLoading(false);
      }
    });

    return () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from auth changes:', error);
      }
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await SupabaseService.getUser(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set a fallback profile if Supabase is unavailable
      setUserProfile({
        id: userId,
        username: 'Player',
        balance: 100.00,
        level: 1,
        experience: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_online: true,
        total_winnings: 0,
        games_played: 0,
        games_won: 0,
        win_rate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: (import.meta.env.VITE_SITE_URL || 'https://bingobest.live') + '/email-confirmation.html',
        },
      });

      if (data.user && !error) {
        // Create user profile in our database
        await SupabaseService.createUser({
          username,
          email,
          balance: 100.00, // Starting balance
        });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process');
      const { error } = await supabase.auth.signOut();
      console.log('Supabase signOut response:', { error });
      
      if (error) {
        console.error('Error signing out:', error);
        // Force local sign out even if Supabase fails
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setLoading(false);
      } else {
        console.log('AuthContext: Sign out successful');
        // Ensure local state is cleared
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Force local sign out even if there's an error
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) return { error: 'No user logged in' };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        // Refresh user profile
        await fetchUserProfile(user.id);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
