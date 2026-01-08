
/**
 * macro_fetcher.js
 * Responsible for fetching long-term macro data (GDP, CPI, Rate) and saving to `macro_indicators`.
 * NOTE: Forex endpoints are restricted/legacy on this FMP plan. Forex data must be managed manually via Admin.
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// FMP Config
const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
// Use 'stable' as it's the only one confirmed working for Calendar on this plan
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * 1. Sync Economic Indicators (GDP, CPI, Interest Rate)
 * Strategy: Fetch last 90 days. This allows the Cron Job (every 10m) or daily runs 
 * to capture new data without hitting "Premium Quote" limits for long ranges.
 */
async function syncEconomicIndicators() {
    console.log("📈 Syncing Macro Indicators (GDP, CPI, Rate)...");

    // Fetch last 6 months (safe range)
    const today = new Date();
    const rangeAgo = new Date();
    rangeAgo.setMonth(today.getMonth() - 6);

    const fromStr = rangeAgo.toISOString().split('T')[0];
    const toStr = today.toISOString().split('T')[0];

    // Use 'stable' endpoint
    const url = `${FMP_BASE_URL}/economic-calendar?from=${fromStr}&to=${toStr}&apikey=${FMP_API_KEY}`;

    console.log(`   🌐 Fetching Macro from: ${url.replace(FMP_API_KEY, 'HIDDEN')}`);

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
            // Filter for Vietnam High Impact Events
            const vnEvents = data.filter(e =>
                (e.country === 'VN' || e.currency === 'VND' || e.event.includes('Vietnam')) &&
                e.actual !== null
            );

            // Mapper
            const rows = [];
            for (const e of vnEvents) {
                let key = null;
                const name = e.event.toLowerCase();

                // GDP
                if (name.includes('gdp growth')) key = 'VN_GDP_YOY';
                // CPI / Inflation
                else if (name.includes('inflation') || name.includes('cpi')) key = 'VN_CPI_YOY';
                // Interest Rate
                else if (name.includes('interest rate')) key = 'VN_INTEREST_RATE';
                // Trade Balance
                else if (name.includes('trade balance')) key = 'VN_TRADE_BALANCE';

                if (key) {
                    rows.push({
                        indicator_key: key,
                        date: e.date.split(' ')[0],
                        value: parseFloat(String(e.actual).replace(/[^0-9.-]/g, '')),
                        source: 'FMP'
                    });
                }
            }

            // Deduplicate: Keep the last one found (or first) to avoid "ON CONFLICT" batch error
            // Map key: "INDICATOR_KEY|YYYY-MM-DD"
            const uniqueRowsMap = new Map();
            rows.forEach(r => {
                uniqueRowsMap.set(`${r.indicator_key}|${r.date}`, r);
            });
            const uniqueRows = Array.from(uniqueRowsMap.values());

            if (uniqueRows.length > 0) {
                const { error } = await supabase
                    .from('macro_indicators')
                    .upsert(uniqueRows, { onConflict: 'indicator_key, date' });

                if (error) console.error("   ❌ Upsert Error:", error.message);
                else console.log(`   ✅ Synced ${uniqueRows.length} macro data points.`);
            } else {
                console.log("   ⚠️ No matching Vietnam macro events found/updated in this period.");
            }
        } else {
            console.log("   ⚠️ Calendar Error:", JSON.stringify(data).slice(0, 200));
        }
    } catch (e) {
        console.error("   ❌ Sync Failed:", e.message);
    }
}

/**
 * 2. Sync Daily Asset Prices (Gold World, USDVND)
 * We fetch the last few days of history to keep the chart up to date.
 */
async function syncDailyAssets() {
    console.log("💰 Syncing Daily Assets (Gold World, USDVND)...");

    // Symbols to sync
    // XAUUSD = Gold World ($/oz) - Key: GOLD_WORLD
    // USDVND = Forex - Key: USDVND_OFFICIAL

    const assets = [
        { symbol: 'XAUUSD', key: 'GOLD_WORLD' },
        { symbol: 'USDVND', key: 'USDVND_OFFICIAL' }
    ];

    for (const asset of assets) {
        try {
            // Fetch last 5 days history
            const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${asset.symbol}?timeseries=5&apikey=${FMP_API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.historical && Array.isArray(data.historical)) {
                const rows = data.historical.map(h => ({
                    indicator_key: asset.key,
                    date: h.date,
                    value: h.close,
                    source: 'FMP_AUTO'
                }));

                // Upsert
                const { error } = await supabase
                    .from('macro_indicators')
                    .upsert(rows, { onConflict: 'indicator_key, date' });

                if (error) console.error(`   ❌ ${asset.symbol} Error:`, error.message);
                else console.log(`   ✅ Synced ${rows.length} days for ${asset.symbol}`);
            } else {
                console.log(`   ⚠️ No history returned for ${asset.symbol}`);
            }
        } catch (err) {
            console.error(`   ❌ Failed to sync ${asset.symbol}:`, err.message);
        }
    }
}

// Main execution
async function runMacroSync() {
    // await syncExchangeRate(); // DISABLED: API Restricted
    await syncEconomicIndicators(); // Working
    await syncDailyAssets(); // New: Gold & Forex
    console.log("🏁 Macro Sync Complete.");
}

if (require.main === module) {
    runMacroSync();
}

module.exports = { runMacroSync };
