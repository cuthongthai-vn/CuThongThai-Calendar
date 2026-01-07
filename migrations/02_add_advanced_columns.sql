-- Migration: Add fields for Tooltips, Sparklines, and Consensus
-- Run this in Supabase SQL Editor

-- 1. Add Vietnamese definition for Tooltips
ALTER TABLE economic_events 
ADD COLUMN IF NOT EXISTS definition_vi TEXT;

-- 2. Add Historical Data (JSONB) for Sparklines
-- Format: [{ "date": "2024-01-01", "actual": 3.4 }, ...]
ALTER TABLE economic_events 
ADD COLUMN IF NOT EXISTS historical_data JSONB DEFAULT '[]'::jsonb;

-- 3. Add Forecast Statistics (JSONB) for Consensus Analysis
-- Format: { "low": 3.0, "high": 3.5, "avg": 3.2 }
ALTER TABLE economic_events 
ADD COLUMN IF NOT EXISTS forecast_stats JSONB DEFAULT '{}'::jsonb;

-- 4. Add Vietnamese Event Name
ALTER TABLE economic_events 
ADD COLUMN IF NOT EXISTS event_name_vi TEXT;

-- 5. Add Comment to explain columns
COMMENT ON COLUMN economic_events.definition_vi IS 'Vietnamese explanation of the economic indicator for tooltips';
COMMENT ON COLUMN economic_events.historical_data IS 'Past 12 months actual values for sparkline charts';
COMMENT ON COLUMN economic_events.forecast_stats IS 'Market consensus data (low, high, avg) for shock analysis';
