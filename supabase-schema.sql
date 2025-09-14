-- BingoBest Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    wins INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    avatar_url TEXT,
    vip_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_players INTEGER NOT NULL,
    current_players INTEGER DEFAULT 0,
    entry_fee DECIMAL(10,2) NOT NULL,
    prize_pool DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bingo cards table
CREATE TABLE IF NOT EXISTS bingo_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
    numbers INTEGER[5][5] NOT NULL,
    marked BOOLEAN[5][5] DEFAULT ARRAY[
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, true, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]
    ],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    entry_fee DECIMAL(10,2) NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    prize_pool DECIMAL(10,2) DEFAULT 0.00,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    format VARCHAR(20) DEFAULT 'single_elimination' CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, user_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('wins', 'games', 'money', 'special')),
    requirement INTEGER NOT NULL,
    reward DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_id)
);

-- Daily challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirement INTEGER NOT NULL,
    reward DECIMAL(10,2) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User daily challenges table
CREATE TABLE IF NOT EXISTS user_daily_challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, challenge_id)
);

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Seasonal events table
CREATE TABLE IF NOT EXISTS seasonal_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Power-ups table
CREATE TABLE IF NOT EXISTS power_ups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('auto_daub', 'extra_ball', 'peek_next', 'double_prize')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User power-ups table
CREATE TABLE IF NOT EXISTS user_power_ups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    power_up_id UUID REFERENCES power_ups(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
    called_numbers INTEGER[] DEFAULT '{}',
    current_number INTEGER,
    game_started_at TIMESTAMP WITH TIME ZONE,
    game_ended_at TIMESTAMP WITH TIME ZONE,
    winner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_bingo_cards_user_id ON bingo_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_bingo_cards_room_id ON bingo_cards(room_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user_id ON tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, requirement, reward) VALUES
('First Win', 'Win your first game', '🏆', 'wins', 1, 10.00),
('Bingo Beginner', 'Play 10 games', '🎮', 'games', 10, 25.00),
('Money Maker', 'Earn $100', '💰', 'money', 100, 50.00),
('Lucky Streak', 'Win 5 games in a row', '🍀', 'special', 5, 100.00),
('High Roller', 'Win a high stakes game', '💎', 'special', 1, 75.00),
('Social Butterfly', 'Make 10 friends', '👥', 'special', 10, 30.00),
('Tournament Champion', 'Win a tournament', '🏅', 'special', 1, 200.00),
('Daily Grinder', 'Complete 7 daily challenges', '📅', 'special', 7, 40.00);

-- Insert default power-ups
INSERT INTO power_ups (name, description, cost, icon, type) VALUES
('Auto Daub', 'Automatically mark numbers on your card', 5.00, '🎯', 'auto_daub'),
('Extra Ball', 'Get one extra number called', 10.00, '⚽', 'extra_ball'),
('Peek Next', 'See the next number before it''s called', 8.00, '👁️', 'peek_next'),
('Double Prize', 'Double your winnings for this game', 15.00, '💎', 'double_prize');

-- Insert sample game rooms
INSERT INTO game_rooms (name, max_players, entry_fee, prize_pool) VALUES
('Beginner Room', 10, 5.00, 0.00),
('High Stakes', 20, 25.00, 0.00),
('VIP Lounge', 5, 50.00, 0.00),
('Speed Bingo', 15, 10.00, 0.00);

-- Insert sample tournaments
INSERT INTO tournaments (name, description, entry_fee, max_participants, prize_pool, start_time, end_time) VALUES
('Weekend Warrior', 'Weekly tournament for all players', 25.00, 64, 1600.00, NOW() + INTERVAL '2 hours', NOW() + INTERVAL '26 hours'),
('High Roller Championship', 'Exclusive tournament for VIP players', 100.00, 32, 3200.00, NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days'),
('Speed Bingo Masters', 'Fast-paced tournament with quick games', 15.00, 48, 720.00, NOW() + INTERVAL '3 hours', NOW() + INTERVAL '27 hours');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bingo_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_power_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - you may want to customize these)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view game rooms" ON game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can view tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view power-ups" ON power_ups FOR SELECT USING (true);
CREATE POLICY "Users can view their own bingo cards" ON bingo_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own daily challenges" ON user_daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own friends" ON friends FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can view their own power-ups" ON user_power_ups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view chat messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
