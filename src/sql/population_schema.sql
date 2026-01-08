-- Create table for Population Stats
CREATE TABLE IF NOT EXISTS population_stats (
    year INTEGER PRIMARY KEY,
    total_population BIGINT,
    growth_rate_pct NUMERIC,
    age_0_14_pct NUMERIC,
    age_15_64_pct NUMERIC,
    age_65_plus_pct NUMERIC,
    tfr NUMERIC,
    median_age NUMERIC,
    dependency_ratio NUMERIC,
    life_expectancy NUMERIC,
    births BIGINT,
    deaths BIGINT,
    natural_increase BIGINT,
    urban_pct NUMERIC,
    golden_window BOOLEAN,
    period TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE population_stats ENABLE ROW LEVEL SECURITY;

-- Create Policy: Allow public read access
CREATE POLICY "Allow public read access" ON population_stats
    FOR SELECT USING (true);

-- Create Policy: Allow authenticated insert/update (if needed, or service_role only)
-- For now, allowing service_role (default) is enough for scripts.
