
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// FMP Config
const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const CURRENCIES = ['USD', 'VND', 'CNY', 'EUR', 'JPY', 'GBP'];
const IMPORTANT_EVENTS_VN = ['CPI', 'GDP', 'Rate', 'Trade', 'Retail', 'Industrial'];

async function syncCalendar() {
    console.log("📅 Starting Economic Calendar Sync (FMP & VN)...");

    // 1. Define Time Range (-3 Months to +3 Months) to catch strict past and future
    const today = new Date();
    const past = new Date();
    past.setMonth(today.getMonth() - 2);
    const future = new Date();
    future.setMonth(today.getMonth() + 2);

    const fromDate = past.toISOString().split('T')[0];
    const toDate = future.toISOString().split('T')[0];

    console.log(`   ⏳ Fetching range: ${fromDate} to ${toDate}`);

    // 2. Fetch from FMP
    const url = `${FMP_BASE_URL}/economic-calendar?from=${fromDate}&to=${toDate}&apikey=${FMP_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("   ❌ FMP API Error:", data);
            return;
        }

        console.log(`   📥 Received ${data.length} raw events.`);

        // 3. Filter & Map
        const filteredEvents = data.filter(e => {
            if (!e.currency) return false;
            // Vietnam: Keep ALL events
            if (e.currency === 'VND' || e.country === 'VN') return true;
            // Major Currencies: Keep High/Medium impact only
            if (CURRENCIES.includes(e.currency)) {
                // FMP impact is usually "Low", "Medium", "High" or null
                return e.impact === 'High' || e.impact === 'Medium';
            }
            return false;
        });

        console.log(`   📉 Filtered down to ${filteredEvents.length} relevant events.`);

        // Map to DB Schema
        const dbRows = filteredEvents.map(e => ({
            event_name: e.event,
            currency: e.currency,
            impact_level: e.impact || 'Low',
            event_time: e.date, // FMP returns "YYYY-MM-DD HH:mm:ss"
            previous: e.previous ? String(e.previous) : null,
            forecast: e.estimate ? String(e.estimate) : null,
            actual: e.actual ? String(e.actual) : null,
            // country: e.country // DB might not have this, based on fetcher.js
        }));

        // 4. Truncate & Insert
        // Warning: Supabase generic client doesn't support "truncate". 
        // We will "delete all" (dangerous for huge tables, but ok here).
        // Or upsert? Upsert is safer if we want to preserve IDs, but user said "make standard again", implies clean slate.
        // Let's delete all events within the window? Or just delete all?
        // User said "failed payload" (test data). Best to clear table.

        console.log("   🧹 Clearing existing 'economic_events' table...");
        const { error: delError } = await supabase
            .from('economic_events')
            .delete()
            .neq('id', 0); // Hack to delete all rows

        if (delError) console.error("   ⚠️ Clear Warning:", delError.message);

        // Batch Insert
        const BATCH = 50;
        for (let i = 0; i < dbRows.length; i += BATCH) {
            const chunk = dbRows.slice(i, i + BATCH);
            const { error: insError } = await supabase
                .from('economic_events')
                .insert(chunk);

            if (insError) console.error(`   ❌ Insert Batch ${i} Error:`, insError.message);
            else console.log(`   ✅ Inserted batch ${i} - ${i + chunk.length}`);
        }

        console.log("🎉 Sync Complete!");

    } catch (err) {
        console.error("   ❌ Script Failed:", err);
    }
}

syncCalendar();
