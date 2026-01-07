/**
 * fetcher.js
 * "The Hand": Responsible for grabbing the latest data for a specific event from Financial Modeling Prep (Pro Plan).
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { compareEventData } = require('./logic_processor');
const { getFinancialCommentary } = require('./ai_analyst');

// FMP Configuration
const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg'; // Paid Key
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Tries to fetch real data for a given event from FMP.
 */
async function fetchAndProcessEvent(event) {
    console.log(`\n🕵️ [Fetcher] Target: ${event.event_name} (${event.currency}) at ${event.event_time}`);

    let actualData = null;
    let historicalData = [];

    // --- STRATEGY 1: REAL CRAWL (FMP API) ---
    try {
        // 1. Fetch Current Data (using a small window around the event time)
        // Note: FMP doesn't query by ID, so we look for matching events in a 24h window
        const eventDate = event.event_time.split('T')[0];
        const url = `${FMP_BASE_URL}/economic-calendar?from=${eventDate}&to=${eventDate}&apikey=${FMP_API_KEY}`;

        console.log(`   🌐 Calling FMP URL: ${url.replace(FMP_API_KEY, 'HIDDEN')}`);

        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
            // Find the matching event
            const match = data.find(e =>
                (e.event === event.event_name || e.event.includes(event.event_name)) &&
                e.currency === event.currency
            );

            if (match && match.actual !== null) {
                actualData = String(match.actual);
                console.log(`   ✅ captured ACTUAL from FMP: ${actualData}`);
            } else {
                console.log("   ⚠️ Event found in FMP but 'actual' is null or event not found.");
            }
        }

        // 2. Fetch Historical Data (For Sparklines - 6 months lookback)
        // We only do this if we successfully found the event (or even if not, to populate history)
        if (actualData) {
            console.log("   📚 Fetching history for Sparklines...");

            // Derive country if missing (DB doesn't have country column)
            let targetCountry = event.country;
            if (!targetCountry) {
                if (event.currency === 'USD') targetCountry = 'US';
                else if (event.currency === 'VND') targetCountry = 'VN'; // FMP mostly uses VN? Or Vietnam?
                else if (event.currency === 'CNY') targetCountry = 'CN';
            }
            // FMP often uses full names too, but codes 'US', 'VN', 'CN' are common in API.
            // We'll pass the code. fetchHistory needs to handle it.

            historicalData = await fetchHistory(event.event_name, targetCountry);
        }

    } catch (e) {
        console.error("   ❌ Real fetch failed:", e.message);
    }

    if (!actualData) {
        console.log(`   ⏳ [Wait] No data yet.`);
        return { status: "WAITING" };
    }

    // --- PROCESS & SAVE ---
    // 1. Update Object
    event.actual = actualData;

    // 2. Logic Analysis
    const analysis = compareEventData(event);

    // 3. AI Analysis
    console.log("   🤖 Triggering AI Analyst...");
    let aiResult = { sentiment: 'NEUTRAL', commentary: 'Data released. Analysis pending.' };

    try {
        // Inject History into AI Context if available
        const context = {
            past: historicalData.slice(0, 5) // Give AI the last 5 relevant data points
        };
        aiResult = await getFinancialCommentary(event, analysis, context);
    } catch (err) {
        console.error("   ❌ AI Failed:", err.message);
    }

    // 4. Update Database
    const { error } = await supabase
        .from('economic_events')
        .update({
            actual: actualData,
            historical_data: historicalData, // Save for Sparklines
            ai_sentiment: aiResult.sentiment,
            ai_commentary: aiResult.commentary,
            vn_impact: aiResult.vn_impact || "Dang cap nhat...",
            event_name_vi: aiResult.translated_name, // Save AI translation
            impact_level: event.impact_level
        })
        .eq('id', event.id);

    if (error) {
        console.error("   ❌ DB Update Failed:", error.message);
        return { status: "ERROR", error: error.message };
    }

    console.log("   💾 Saved to DB successfully!");
    return { status: "SUCCESS", actual: actualData, sentiment: aiResult.sentiment };
}

/**
 * Fetch last 6 months of data for a specific event
 */
async function fetchHistory(eventName, country) {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const fromDate = sixMonthsAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    // Note: Fetching this for every single event update is expensive (API calls).
    // Optimization: In production, cache this or batch fetch.
    const url = `${FMP_BASE_URL}/economic-calendar?from=${fromDate}&to=${toDate}&apikey=${FMP_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
            // Filter strictly for this event
            const history = data
                .filter(e => e.event === eventName && e.country === country && e.actual !== null)
                .map(e => ({
                    date: e.date,
                    actual: parseFloat(String(e.actual).replace(/[^0-9.-]/g, '')) || 0
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest to Newest

            return history;
        }
    } catch (e) {
        console.warn("Failed to fetch history:", e.message);
    }
    return [];
}

module.exports = { fetchAndProcessEvent };
