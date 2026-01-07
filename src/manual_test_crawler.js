
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { fetchAndProcessEvent } = require('./fetcher');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function runTest() {
    console.log("🧪 --- STARTING MANUAL CRAWLER TEST ---");

    // 0. Cleanup old test events
    await supabase.from('economic_events').delete().eq('event_name', 'TEST_EVENT_WAR_MODE');
    await supabase.from('economic_events').delete().eq('event_name', 'API Crude Oil Stock Change (Jan/02)');

    // 1. Create a Real Test Event (That exists in FMP history)
    const testEvent = {
        event_name: 'API Crude Oil Stock Change (Jan/02)',
        currency: 'USD',
        impact_level: 'High',
        event_time: '2026-01-06T21:30:00.000Z', // Real event time
        previous: '1.7',
        forecast: '1.2',
        actual: null // MISSING actual -> Should trigger War Mode
    };

    console.log("1️⃣ Inserting Test Event:", testEvent.event_name);
    const { data, error } = await supabase.from('economic_events').insert([testEvent]).select().single();

    if (error) {
        console.error("❌ Setup failed:", error.message);
        return;
    }
    const eventId = data.id;
    console.log("   ✅ Created Event ID:", eventId);

    // 2. Trigger Fetcher Directly
    console.log("\n2️⃣ Triggering Fetcher (Direct)...");
    const result = await fetchAndProcessEvent(data);

    console.log("\n3️⃣ Checking Result...");
    if (result.status === "SUCCESS") {
        console.log("   ✅ SUCCESS! Fetcher found the event and processed it.");

        // 3. Verify DB Update
        const { data: updated } = await supabase.from('economic_events').select('*').eq('id', eventId).single();
        console.log("   📊 Final DB State:");
        console.log("      - Actual:", updated.actual);
        console.log("      - AI Sentiment:", updated.ai_sentiment);
        console.log("      - VN Impact:", updated.vn_impact);
    } else {
        console.error("   ❌ FAILED. Scheduler did not process the event as expected.");
        console.log("   Scheduler Result:", result);
    }

    console.log("🧪 --- TEST FINISHED ---");
}

runTest();
