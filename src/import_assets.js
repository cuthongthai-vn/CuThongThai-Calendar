require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Helper to parse DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateStr) {
    if (!dateStr) return null;
    // Check if already YYYY-MM-DD
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;

    // Handle DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        // parts[0] = Day, parts[1] = Month, parts[2] = Year
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr; // Fallback
}

async function importCsv(filePath, mapRowToIndicators) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                try {
                    const indicators = mapRowToIndicators(data);
                    indicators.forEach(ind => {
                        if (ind && !isNaN(ind.value)) {
                            results.push(ind);
                        }
                    });
                } catch (err) {
                    console.error('Error parsing row:', data, err);
                }
            })
            .on('end', async () => {
                console.log(`Parsed ${results.length} rows from ${path.basename(filePath)}`);

                const uniqueMap = new Map();
                results.forEach(item => {
                    uniqueMap.set(`${item.indicator_key}|${item.date}`, item);
                });
                const uniqueResults = Array.from(uniqueMap.values());
                console.log(`Parsed ${results.length} rows, Deduplicated to ${uniqueResults.length} from ${path.basename(filePath)}`);

                // Chunk insert to avoid request size limits
                const chunkSize = 500;
                for (let i = 0; i < uniqueResults.length; i += chunkSize) {
                    const chunk = uniqueResults.slice(i, i + chunkSize);
                    const { error } = await supabase
                        .from('macro_indicators')
                        .upsert(chunk, { onConflict: 'indicator_key, date' });

                    if (error) {
                        // If error is about affecting row second time, try smaller chunks or ignore? 
                        // Actually the dedupe above should fix it.
                        console.error(`Error inserting chunk ${i}:`, error.message);
                    } else {
                        console.log(`Inserted chunk ${i} - ${i + chunk.length}`);
                    }
                }
                resolve();
            })
            .on('error', (err) => reject(err));
    });
}

async function run() {
    console.log("Starting Assets Import...");

    // 1. Hanoi Land
    await importCsv(
        path.join(__dirname, '../data_upload/hanoi-land-prices-1975-2025.csv'),
        (row) => [
            {
                indicator_key: 'RE_HANOI_GOLD',
                date: row.Date,
                value: parseFloat(row.Price_Gold_Tael),
                source: 'MANUAL_IMPORT'
            },
            {
                indicator_key: 'RE_HANOI_VND',
                date: row.Date,
                value: parseFloat(row.Price_VND_Million),
                source: 'MANUAL_IMPORT'
            }
        ]
    );

    // 2. HCMC Land
    await importCsv(
        path.join(__dirname, '../data_upload/hcmc-land-prices-1975-2025.csv'),
        (row) => [
            {
                indicator_key: 'RE_HCMC_GOLD',
                date: row.Date,
                value: parseFloat(row.Price_Gold_Tael),
                source: 'MANUAL_IMPORT'
            },
            {
                indicator_key: 'RE_HCMC_VND',
                date: row.Date,
                value: parseFloat(row.Price_VND_Million),
                source: 'MANUAL_IMPORT'
            }
        ]
    );

    // 3. Gold
    await importCsv(
        path.join(__dirname, '../data_upload/vietnam-gold-complete-1975-2025.csv'),
        (row) => [
            {
                indicator_key: 'GOLD_SJC',
                date: row.Date,
                value: parseFloat(row.Gold_VND_Per_Tael),
                source: 'MANUAL_IMPORT'
            },
            {
                indicator_key: 'GOLD_WORLD',
                date: row.Date,
                value: parseFloat(row.USD_Per_Oz),
                source: 'MANUAL_IMPORT'
            }
        ]
    );

    // 4. Pho
    await importCsv(
        path.join(__dirname, '../data_upload/vietnam-pho-prices-1975-2025.csv'),
        (row) => [
            {
                indicator_key: 'PHO_PRICE_VND',
                date: row.Date,
                value: parseFloat(row.Pho_Price_VND),
                source: 'MANUAL_IMPORT'
            }
        ]
    );

    console.log("Assets Import Completed!");
}

run();
