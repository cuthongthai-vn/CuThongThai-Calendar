
// Try loading from .env.local first, then .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env if .env.local missing or incomplete

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Init Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Checked .env.local and .env');
    console.error('   Need NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_FILE = path.join(__dirname, '../data_upload/vietnam-population-yearly-1950-2100.csv');

async function importPopulation() {
    console.log(`🚀 Starting Population Import from ${CSV_FILE}...`);

    const results = [];

    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (data) => {
            // Transform data types
            const cleanData = {
                year: parseInt(data.Year),
                total_population: data.Total_Population ? parseInt(data.Total_Population) : null,
                growth_rate_pct: data.Growth_Rate_Pct ? parseFloat(data.Growth_Rate_Pct) : null,
                age_0_14_pct: data.Age_0_14_Pct ? parseFloat(data.Age_0_14_Pct) : null,
                age_15_64_pct: data.Age_15_64_Pct ? parseFloat(data.Age_15_64_Pct) : null,
                age_65_plus_pct: data.Age_65_Plus_Pct ? parseFloat(data.Age_65_Plus_Pct) : null,
                tfr: data.TFR ? parseFloat(data.TFR) : null,
                median_age: data.Median_Age ? parseFloat(data.Median_Age) : null,
                dependency_ratio: data.Dependency_Ratio ? parseFloat(data.Dependency_Ratio) : null,
                life_expectancy: data.Life_Expectancy ? parseFloat(data.Life_Expectancy) : null,
                births: data.Births ? parseInt(data.Births) : null,
                deaths: data.Deaths ? parseInt(data.Deaths) : null,
                natural_increase: data.Natural_Increase ? parseInt(data.Natural_Increase) : null,
                urban_pct: data.Urban_Pct ? parseFloat(data.Urban_Pct) : null,
                golden_window: (data.Golden_Window === 'YES'),
                period: data.Period || null
            };
            results.push(cleanData);
        })
        .on('end', async () => {
            console.log(`📊 Parsed ${results.length} rows.`);

            // Chunked insert to avoid payload limits
            const CHUNK_SIZE = 100;
            for (let i = 0; i < results.length; i += CHUNK_SIZE) {
                const chunk = results.slice(i, i + CHUNK_SIZE);
                console.log(`   Writing chunk ${i} - ${i + chunk.length}...`);

                const { error } = await supabase
                    .from('population_stats')
                    .upsert(chunk, { onConflict: 'year' }); // Upsert by Year id

                if (error) {
                    console.error('❌ Insert Error:', error);
                }
            }

            console.log('✅ Import Completed successfully!');
        });
}

importPopulation();
