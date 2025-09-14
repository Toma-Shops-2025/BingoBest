-- Fix tournaments table constraint
-- Run this in your Supabase SQL editor to fix the end_time constraint issue

-- First, make end_time nullable
ALTER TABLE tournaments ALTER COLUMN end_time DROP NOT NULL;

-- Update any existing tournaments that have null end_time but are completed
UPDATE tournaments 
SET end_time = start_time + INTERVAL '24 hours' 
WHERE end_time IS NULL AND status = 'completed';

-- Update any existing tournaments that have null end_time but are active
UPDATE tournaments 
SET end_time = start_time + INTERVAL '24 hours' 
WHERE end_time IS NULL AND status = 'active';

-- For upcoming tournaments, we can leave end_time as null until they start
