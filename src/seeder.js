const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const EVENTS = [
    // --- USA (The Big Boss) ---
    // Past Month
    { event_name: 'Non-Farm Payrolls', currency: 'USD', impact_level: 'High', event_time: '2026-01-05T19:30:00Z', previous: '175K', forecast: '180K', actual: '210K' },
    { event_name: 'Unemployment Rate', currency: 'USD', impact_level: 'High', event_time: '2026-01-05T19:30:00Z', previous: '4.1%', forecast: '4.1%', actual: '4.0%' },
    { event_name: 'ISM Manufacturing PMI', currency: 'USD', impact_level: 'High', event_time: '2026-01-03T15:00:00Z', previous: '46.7', forecast: '47.2', actual: '47.4' },
    { event_name: 'FOMC Meeting Minutes', currency: 'USD', impact_level: 'High', event_time: '2026-01-03T19:00:00Z', previous: '', forecast: '', actual: 'Hawkish' }, // Textual actual often works too
    { event_name: 'CPI m/m', currency: 'USD', impact_level: 'High', event_time: '2025-12-12T13:30:00Z', previous: '0.1%', forecast: '0.1%', actual: '0.2%' },
    { event_name: 'Core CPI m/m', currency: 'USD', impact_level: 'High', event_time: '2025-12-12T13:30:00Z', previous: '0.3%', forecast: '0.3%', actual: '0.3%' },
    { event_name: 'Fed Interest Rate Decision', currency: 'USD', impact_level: 'High', event_time: '2025-12-13T19:00:00Z', previous: '5.50%', forecast: '5.50%', actual: '5.50%' },
    { event_name: 'Retail Sales m/m', currency: 'USD', impact_level: 'High', event_time: '2025-12-14T13:30:00Z', previous: '-0.1%', forecast: '0.0%', actual: '0.3%' },
    { event_name: 'PPI m/m', currency: 'USD', impact_level: 'Medium', event_time: '2025-12-13T13:30:00Z', previous: '0.0%', forecast: '0.1%', actual: '0.0%' },
    { event_name: 'GDP Growth Rate QoQ (Final)', currency: 'USD', impact_level: 'High', event_time: '2025-12-21T13:30:00Z', previous: '5.2%', forecast: '5.2%', actual: '4.9%' },

    // Future Month (Forecasts)
    { event_name: 'CPI m/m', currency: 'USD', impact_level: 'High', event_time: '2026-01-11T13:30:00Z', previous: '0.2%', forecast: '0.2%', actual: null },
    { event_name: 'Core CPI m/m', currency: 'USD', impact_level: 'High', event_time: '2026-01-11T13:30:00Z', previous: '0.3%', forecast: '0.3%', actual: null },
    { event_name: 'PPI m/m', currency: 'USD', impact_level: 'Medium', event_time: '2026-01-12T13:30:00Z', previous: '0.0%', forecast: '0.1%', actual: null },
    { event_name: 'Retail Sales m/m', currency: 'USD', impact_level: 'High', event_time: '2026-01-17T13:30:00Z', previous: '0.3%', forecast: '0.4%', actual: null },
    { event_name: 'Prelim UoM Consumer Sentiment', currency: 'USD', impact_level: 'Medium', event_time: '2026-01-19T15:00:00Z', previous: '69.7', forecast: '70.0', actual: null },
    { event_name: 'Fed Interest Rate Decision', currency: 'USD', impact_level: 'High', event_time: '2026-01-31T19:00:00Z', previous: '5.50%', forecast: '5.50%', actual: null },
    { event_name: 'ISM Services PMI', currency: 'USD', impact_level: 'High', event_time: '2026-01-05T15:00:00Z', previous: '52.7', forecast: '52.6', actual: null },
    { event_name: 'CB Consumer Confidence', currency: 'USD', impact_level: 'High', event_time: '2026-01-30T15:00:00Z', previous: '102.0', forecast: '103.5', actual: null },
    { event_name: 'JOLTS Job Openings', currency: 'USD', impact_level: 'High', event_time: '2026-01-09T15:00:00Z', previous: '8.79M', forecast: '8.85M', actual: null },
    { event_name: 'Advance GDP q/q', currency: 'USD', impact_level: 'High', event_time: '2026-01-25T13:30:00Z', previous: '4.9%', forecast: '2.0%', actual: null },
    { event_name: 'Empire State Manufacturing Index', currency: 'USD', impact_level: 'Medium', event_time: '2026-01-16T13:30:00Z', previous: '-14.5', forecast: '-5.0', actual: null },
    { event_name: 'Philly Fed Manufacturing Index', currency: 'USD', impact_level: 'Medium', event_time: '2026-01-18T13:30:00Z', previous: '-5.9', forecast: '-10.0', actual: null },

    // --- VIETNAM (Local Impact) ---
    // Past
    { event_name: 'VN CPI YoY', currency: 'VND', impact_level: 'High', event_time: '2025-12-29T02:00:00Z', previous: '3.45%', forecast: '3.5%', actual: '3.58%' },
    { event_name: 'VN GDP Growth Year', currency: 'VND', impact_level: 'High', event_time: '2025-12-29T02:00:00Z', previous: '5.33%', forecast: '5.1%', actual: '5.05%' },
    { event_name: 'VN Trade Balance', currency: 'VND', impact_level: 'Medium', event_time: '2025-12-29T02:00:00Z', previous: '$1.2B', forecast: '$1.0B', actual: '$1.5B' },
    { event_name: 'VN Retail Sales YoY', currency: 'VND', impact_level: 'Medium', event_time: '2025-12-29T02:00:00Z', previous: '9.3%', forecast: '9.5%', actual: '9.3%' },

    // Future
    { event_name: 'VN Industrial Production YoY', currency: 'VND', impact_level: 'Medium', event_time: '2026-01-29T02:00:00Z', previous: '5.8%', forecast: '6.0%', actual: null },
    { event_name: 'VN CPI YoY', currency: 'VND', impact_level: 'High', event_time: '2026-01-29T02:00:00Z', previous: '3.58%', forecast: '3.6%', actual: null },
    { event_name: 'VN Trade Balance', currency: 'VND', impact_level: 'Medium', event_time: '2026-01-29T02:00:00Z', previous: '$1.5B', forecast: '$1.2B', actual: null },
    { event_name: 'VN FDI Inflow', currency: 'VND', impact_level: 'Medium', event_time: '2026-01-25T02:00:00Z', previous: '$36.6B', forecast: '', actual: null },
    { event_name: 'SBV Refinancing Rate Decision', currency: 'VND', impact_level: 'High', event_time: '2026-01-20T10:00:00Z', previous: '4.5%', forecast: '4.5%', actual: null }, // Unscheduled often, but planned here

    // --- CHINA (Regional Influence) ---
    // Past
    { event_name: 'CN Caixin Manufacturing PMI', currency: 'CNY', impact_level: 'High', event_time: '2026-01-02T01:45:00Z', previous: '50.7', forecast: '50.5', actual: '50.8' },
    { event_name: 'CN GDP Growth Rate YoY', currency: 'CNY', impact_level: 'High', event_time: '2025-12-17T02:00:00Z', previous: '4.9%', forecast: '5.0%', actual: '5.2%' },
    { event_name: 'CN Industrial Production YoY', currency: 'CNY', impact_level: 'High', event_time: '2025-12-15T02:00:00Z', previous: '6.6%', forecast: '6.6%', actual: '6.8%' },

    // Future
    { event_name: 'CN CPI YoY', currency: 'CNY', impact_level: 'High', event_time: '2026-01-12T01:30:00Z', previous: '-0.5%', forecast: '-0.4%', actual: null },
    { event_name: 'CN PPI YoY', currency: 'CNY', impact_level: 'Medium', event_time: '2026-01-12T01:30:00Z', previous: '-3.0%', forecast: '-2.8%', actual: null },
    { event_name: 'CN Retail Sales YoY', currency: 'CNY', impact_level: 'High', event_time: '2026-01-17T02:00:00Z', previous: '10.1%', forecast: '8.0%', actual: null },
    { event_name: 'CN Unemployment Rate', currency: 'CNY', impact_level: 'Medium', event_time: '2026-01-17T02:00:00Z', previous: '5.0%', forecast: '5.0%', actual: null },
    { event_name: 'CN Non-Manufacturing PMI', currency: 'CNY', impact_level: 'Medium', event_time: '2026-01-31T01:30:00Z', previous: '50.4', forecast: '50.5', actual: null },

    // --- EUROPE/OTHERS (Global Sentiment) ---
    { event_name: 'ECB Interest Rate Decision', currency: 'EUR', impact_level: 'High', event_time: '2026-01-25T13:15:00Z', previous: '4.50%', forecast: '4.50%', actual: null },
    { event_name: 'UK CPI YoY', currency: 'GBP', impact_level: 'High', event_time: '2026-01-17T07:00:00Z', previous: '3.9%', forecast: '3.8%', actual: null },
    { event_name: 'BOJ Interest Rate Decision', currency: 'JPY', impact_level: 'High', event_time: '2026-01-23T03:00:00Z', previous: '-0.10%', forecast: '-0.10%', actual: null },
];

async function seedData() {
    console.log(`🌱 Checking database for existing events...`);

    // 1. Fetch ALL existing events
    const { data: existingEvents, error: fetchError } = await supabase
        .from('economic_events')
        .select('event_name, event_time');

    if (fetchError) {
        console.error('❌ Error fetching existing data:', fetchError);
        return;
    }

    // 2. Filter out events that already exist
    const newEvents = EVENTS.filter(e => {
        const exists = existingEvents.some(existing =>
            existing.event_name === e.event_name &&
            new Date(existing.event_time).getTime() === new Date(e.event_time).getTime()
        );
        return !exists;
    });

    if (newEvents.length === 0) {
        console.log('✅ All events already exist. No new data to seed.');
        return;
    }

    console.log(`🌱 Identified ${newEvents.length} new events to insert.`);

    // 3. Insert in batches of 10 to avoid freezing/timeouts and show progress
    const BATCH_SIZE = 10;
    for (let i = 0; i < newEvents.length; i += BATCH_SIZE) {
        const batch = newEvents.slice(i, i + BATCH_SIZE);
        console.log(`... Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(newEvents.length / BATCH_SIZE)} (${batch.length} events)...`);

        const { error: insertError } = await supabase
            .from('economic_events')
            .insert(batch);

        if (insertError) {
            console.error(`❌ Error inserting batch ${i}:`, insertError.message);
        } else {
            console.log(`   ✅ Batch inserted successfully.`);
        }

        // Small delay to be safe
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`🎉 DONE! Successfully seeded ${newEvents.length} new events.`);
}

seedData();
