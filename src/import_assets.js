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

    // 4. Pho (New History 1975-2025)
    await importCsv(
        path.join(__dirname, '../data_upload/vietnam-pho-price-history-1975-2025.csv'),
        (row) => {
            // Columns: Year,Hanoi_Pho_Price_VND,HCMC_Pho_Price_VND
            const date = `${row.Year}-01-01`;
            const valHN = parseFloat(row.Hanoi_Pho_Price_VND);
            const valHCM = parseFloat(row.HCMC_Pho_Price_VND);
            const avg = (valHN + valHCM) / 2;

            return [
                { indicator_key: 'PRICE_PHO_VN', date, value: avg, source: 'PHO_HISTORY_NEW' },
                { indicator_key: 'PRICE_PHO_HN', date, value: valHN, source: 'PHO_HISTORY_NEW' },
                { indicator_key: 'PRICE_PHO_HCM', date, value: valHCM, source: 'PHO_HISTORY_NEW' }
            ];
        }
    );

    // 5. Lifestyle Index (Final Refined Version)
    await importCsv(
        path.join(__dirname, '../data_upload/vietnam-lifestyle-index-2000-2025-final.csv'),
        (row) => {
            // CSV columns: Year,iPhone_Price_Million,SH_Price_Million,HaoHao_Price,BiaHoi_Price,Avg_Income_Million,Condo_Price_Million_SqM,DiningOut_Times_Month,Beauty_Spending_Million,Months_Salary_Per_SqM
            const date = `${row.Year}-01-01`;
            const source = 'LIFESTYLE_FINAL_REFINED';

            return [
                { indicator_key: 'PRICE_IPHONE_VN', date, value: parseFloat(row.iPhone_Price_Million), source },
                { indicator_key: 'PRICE_SH_VN', date, value: parseFloat(row.SH_Price_Million), source },
                { indicator_key: 'PRICE_HAO_HAO_VN', date, value: parseFloat(row.HaoHao_Price), source },
                { indicator_key: 'PRICE_BIA_HOI_VN', date, value: parseFloat(row.BiaHoi_Price), source },
                { indicator_key: 'INCOME_AVG_VN', date, value: parseFloat(row.Avg_Income_Million), source },
                { indicator_key: 'RE_CONDO_VN', date, value: parseFloat(row.Condo_Price_Million_SqM), source },

                // New Metrics
                { indicator_key: 'LIFESTYLE_DINING_FREQ', date, value: parseFloat(row.DiningOut_Times_Month), source },
                { indicator_key: 'LIFESTYLE_BEAUTY_SPEND', date, value: parseFloat(row.Beauty_Spending_Million), source }, // Changed from Growth to Spend
                { indicator_key: 'METRIC_SALARY_PER_SQM', date, value: parseFloat(row.Months_Salary_Per_SqM), source }
            ];
        }
    );

    // 6. Survival Index (Detailed Multi-City)
    await importCsv(
        path.join(__dirname, '../data_upload/survival-index-complete-2000-2025 final.csv'),
        (row) => {
            // Columns: Year, Location, Household_Type, Rent_Million, ..., Total_Cost_Million, Avg_Income_Monthly_Million, Survival_Index_Pct

            // Map Location to Code
            const cityMap = {
                'Hanoi': 'HAN',
                'HCMC': 'SGN',
                'Da_Nang': 'DAD',
                'Can_Tho': 'VCA',
                'Hai_Phong': 'HPH',
                'Binh_Duong': 'BDG'
            };
            const cityCode = cityMap[row.Location] || 'UNK';

            // Map Household Type to Code
            const typeMap = {
                'Single': 'SINGLE',
                'Family_4': 'FAMILY4'
            };
            const typeCode = typeMap[row.Household_Type] || 'UNK';

            const date = `${row.Year}-01-01`;
            const source = 'SURVIVAL_INDEX_2025';
            const prefix = `SURVIVAL_${cityCode}_${typeCode}`;

            return [
                { indicator_key: `${prefix}_COST`, date, value: parseFloat(row.Total_Cost_Million), source },
                { indicator_key: `${prefix}_INCOME`, date, value: parseFloat(row.Avg_Income_Monthly_Million), source },
                { indicator_key: `${prefix}_INDEX`, date, value: parseFloat(row.Survival_Index_Pct), source },
                // Optional Details
                { indicator_key: `${prefix}_RENT`, date, value: parseFloat(row.Rent_Million), source },
                { indicator_key: `${prefix}_FOOD`, date, value: parseFloat(row.Food_Million), source }
            ];
        }
    );

    // 7. CPI Inflation (Annual)
    await importCsv(
        path.join(__dirname, '../data_upload/cpi_inflation annual.csv'),
        (row) => [
            {
                indicator_key: 'CPI',
                date: row.Date, // YYYY-MM-DD
                value: parseFloat(row.CPI_YoY),
                source: 'CPI_ANNUAL'
            }
        ]
    );

    console.log("Assets Import Completed!");
}

run();
