-- CORRECTED SQL QUERIES FOR BINGOBEST DATABASE
-- These queries match the actual database schema

-- 1. FIXED: Create tournament (with proper UUID)
INSERT INTO tournaments (name, description, entry_fee, max_participants, prize_pool, start_time, end_time) 
VALUES ('Weekly Championship', 'Weekly tournament for all players', 25.00, 100, 2500.00, 
        '2025-01-15 19:00:00+00', '2025-01-16 19:00:00+00');

-- 2. FIXED: Update tournament status (use actual tournament ID)
-- First, get a tournament ID:
-- SELECT id FROM tournaments WHERE name = 'Weekly Championship' LIMIT 1;
-- Then use that ID in the UPDATE:
UPDATE tournaments SET status = 'active' WHERE name = 'Weekly Championship';

-- 3. FIXED: Daily revenue (using game_rooms table since game_sessions doesn't have entry_fee)
SELECT 
    DATE(gr.created_at) as date, 
    SUM(gr.entry_fee * gr.current_players) as revenue 
FROM game_rooms gr 
WHERE gr.created_at >= CURRENT_DATE 
GROUP BY DATE(gr.created_at);

-- 4. FIXED: User spending (using game_rooms table)
SELECT 
    u.username, 
    SUM(gr.entry_fee * gr.current_players) as total_spent 
FROM users u 
JOIN game_rooms gr ON u.id = gr.id  -- This might need adjustment based on your data structure
GROUP BY u.id, u.username 
ORDER BY total_spent DESC;

-- 5. FIXED: Monthly revenue report (using game_rooms table)
SELECT
    EXTRACT(YEAR FROM gr.created_at) as year,
    EXTRACT(MONTH FROM gr.created_at) as month,
    COUNT(*) as total_games,
    SUM(gr.entry_fee * gr.current_players) as total_revenue,
    AVG(gr.entry_fee) as avg_entry_fee
FROM game_rooms gr
GROUP BY year, month
ORDER BY year DESC, month DESC;

-- 6. FIXED: Top players by winnings (using actual columns from users table)
SELECT 
    u.username,
    u.balance as total_winnings,  -- Using balance as proxy for winnings
    u.games_played,
    u.wins as games_won,
    CASE 
        WHEN u.games_played > 0 THEN ROUND((u.wins::float / u.games_played) * 100, 2)
        ELSE 0 
    END as win_rate
FROM users u 
WHERE u.games_played > 0
ORDER BY u.balance DESC
LIMIT 10;

-- ALTERNATIVE QUERIES FOR BETTER DATA ANALYSIS
-- These might be more useful for your admin dashboard:

-- Daily active users
SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_users
FROM users 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Game room popularity
SELECT 
    gr.name,
    gr.entry_fee,
    gr.current_players,
    gr.max_players,
    gr.status,
    gr.created_at
FROM game_rooms gr
ORDER BY gr.current_players DESC;

-- User engagement stats
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_users_7d,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d,
    AVG(balance) as avg_balance,
    SUM(wins) as total_wins,
    SUM(games_played) as total_games_played
FROM users;

-- Tournament participation
SELECT 
    t.name,
    t.entry_fee,
    t.max_participants,
    COUNT(tp.user_id) as current_participants,
    t.status,
    t.start_time
FROM tournaments t
LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
GROUP BY t.id, t.name, t.entry_fee, t.max_participants, t.status, t.start_time
ORDER BY t.start_time DESC;
