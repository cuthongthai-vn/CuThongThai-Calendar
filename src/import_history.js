
/**
 * import_history.js
 * Tool to import historical macro data from CSV files.
 * Supports merging Annual (low res) and Monthly/Quarterly (high res) data.
 * Strategy: Latest file processed (High Res) overwrites/adds to previous data (Low Res).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const DATA_DIR = path.join(__dirname, '../data_upload');

async function parseCSV(fileName, mapRow) {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        console.log(`   ⏭️  Skipping ${fileName} (Not found)`);
        return [];
    }

    console.log(`   📂 Reading ${fileName}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);

    const validRows = [];
    // Start from line 1
    for (let i = 1; i < lines.length; i++) {
        // Handle CSV parsing robustly (basic verify)
        const row = lines[i].split(',').map(s => s.trim());
        if (row.length < 2) continue;

        const mapped = mapRow(row);
        if (mapped) validRows.push(...mapped);
    }
    return validRows;
}

// Helper to merge datasets. 
// If multiple entries exist for same Key+Date, the LATER one overrides.
// This allows us to load "Annual" first, then "Monthly" to refine.
function mergeDatasets(...datasets) {
    const map = new Map();
    let count = 0;

    datasets.forEach(ds => {
        ds.forEach(item => {
            const id = `${item.indicator_key}|${item.date}`;
            map.set(id, item);
        });
    });

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}

async function runImport() {
    console.log("🚀 Starting Smart Data Import...");

    const allData = [];

    // --- 1. GDP (Combine Annual + Monthly/Quarterly) ---
    const gdpAnnual = await parseCSV('gdp_vietnam annual.csv', (row) => {
        const val = parseFloat(row[1]);
        return (!isNaN(val)) ? [{ indicator_key: 'VN_GDP_YOY', date: row[0], value: val, source: 'GSO_ANNUAL' }] : [];
    });
    const gdpMonthly = await parseCSV('gdp_vietnam monthly.csv', (row) => {
        const val = parseFloat(row[1]);
        return (!isNaN(val)) ? [{ indicator_key: 'VN_GDP_YOY', date: row[0], value: val, source: 'GSO_Q' }] : [];
    });
    // Merge: Monthly takes precedence if date overlaps (though unlikley for Q headers vs Annual)
    const gdpFinal = mergeDatasets(gdpAnnual, gdpMonthly);
    allData.push(...gdpFinal);


    // --- 2. CPI (Combine Annual + Monthly) ---
    const cpiAnnual = await parseCSV('cpi_inflation annual.csv', (row) => {
        const val = parseFloat(row[1]);
        return (!isNaN(val)) ? [{ indicator_key: 'VN_CPI_YOY', date: row[0], value: val, source: 'CPI_ANNUAL' }] : [];
    });
    const cpiMonthly = await parseCSV('cpi_inflation monthly.csv', (row) => {
        const val = parseFloat(row[1]);
        return (!isNaN(val)) ? [{ indicator_key: 'VN_CPI_YOY', date: row[0], value: val, source: 'CPI_MONTHLY' }] : [];
    });
    const cpiFinal = mergeDatasets(cpiAnnual, cpiMonthly);
    allData.push(...cpiFinal);


    // --- 3. Interest Rates & Savings (Single File) ---
    const interestData = await parseCSV('lai_suat.csv', (row) => {
        const date = row[0];
        const ref = parseFloat(row[1]);
        const sav = parseFloat(row[2]);
        const res = [];
        if (!isNaN(ref)) res.push({ indicator_key: 'VN_INTEREST_RATE', date, value: ref, source: 'SBV' });
        if (!isNaN(sav)) res.push({ indicator_key: 'VN_SAVINGS_RATE_12M', date, value: sav, source: 'BANKS' });
        return res;
    });
    allData.push(...interestData);


    // --- 4. Forex (History) ---
    const forexData = await parseCSV('ty_gia_history.csv', (row) => {
        const date = row[0];
        const official = parseFloat(row[1]);
        const black = parseFloat(row[2]);
        const res = [];
        if (!isNaN(official)) res.push({ indicator_key: 'USDVND_OFFICIAL', date, value: official, source: 'HISTORY' });
        if (!isNaN(black)) res.push({ indicator_key: 'USDVND_BLACK_MARKET', date, value: black, source: 'HISTORY' });
        return res;
    });
    allData.push(...forexData);

    // --- 5. Interest Rates Supplement (2018-2025) ---
    const interestSupp = await parseCSV('vietnam-interest-rates-2017-2025.csv', (row) => {
        const date = row[0];
        const ref = parseFloat(row[1]);
        const sav = parseFloat(row[2]);
        const res = [];
        if (!isNaN(ref)) res.push({ indicator_key: 'VN_INTEREST_RATE', date, value: ref, source: 'USER_SUPP' });
        if (!isNaN(sav)) res.push({ indicator_key: 'VN_SAVINGS_RATE_12M', date, value: sav, source: 'USER_SUPP' });
        return res;
    });
    allData.push(...interestSupp);

    // --- 6. GDP Absolute (Billion USD) ---
    const gdpAbs = await parseCSV('vietnam-gdp-usd-annual-1985-2025.csv', (row) => {
        const val = parseFloat(row[1]);
        return (!isNaN(val)) ? [{ indicator_key: 'VN_GDP_ABS_BUSD', date: row[0], value: val, source: 'USER_UPLOAD' }] : [];
    });
    allData.push(...gdpAbs);

    // Deduplicate entire payload before inserting
    // Keys: indicator_key + date
    const uniqueMap = new Map();
    allData.forEach(item => {
        uniqueMap.set(`${item.indicator_key}|${item.date}`, item);
    });
    const finalData = Array.from(uniqueMap.values());
    console.log(`⚡ Total Points to Insert (Deduplicated): ${finalData.length}`);

    // --- Batch Insert ---
    const CHUNK_SIZE = 2000;
    for (let i = 0; i < finalData.length; i += CHUNK_SIZE) {
        const chunk = finalData.slice(i, i + CHUNK_SIZE);
        console.log(`   💾 Importing chunk ${i} - ${i + chunk.length}...`);

        const { error } = await supabase
            .from('macro_indicators')
            .upsert(chunk, { onConflict: 'indicator_key, date' });

        if (error) {
            console.error("   ❌ Error:", error.message);
        }
    }

    console.log("✅ Import Finished Successfully!");
}

runImport();
