/**
 * scheduler.js
 * "The Brain": Decides when to wake up (Peace Mode) or fight (War Mode).
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { fetchAndProcessEvent } = require('./fetcher');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkSchedule() {
    console.log(`\n⏰ [Scheduler] Running check at ${new Date().toISOString()}`);

    // LOGIC: Find events that are:
    // 1. Missing 'actual' data
    // 2. Happened recently (past 15 mins) OR are happening soon (next 5 mins)
    //    Postgres Interval syntax: 
    //    event_time > NOW() - 15 mins AND event_time < NOW() + 5 mins

    const { data: events, error } = await supabase
        .from('economic_events')
        .select('*')
        .is('actual', null) // Only fetch missing data
        .gt('event_time', new Date(Date.now() - 15 * 60000).toISOString()) // Don't fetch too old
        .lt('event_time', new Date(Date.now() + 5 * 60000).toISOString()); // Look ahead 5 mins

    if (error) {
        console.error("❌ Scheduler DB Query Error:", error);
        return { status: "ERROR", error };
    }

    if (!events || events.length === 0) {
        console.log("💤 Peace Mode: No upcoming/active events. Sleeping.");
        return { status: "PEACE", eventsProcessed: 0 };
    }

    console.log(`🔥 WAR MODE ACTIVATED: Found ${events.length} pending events!`);

    const results = [];
    for (const event of events) {
        const res = await fetchAndProcessEvent(event);
        results.push({ id: event.id, name: event.event_name, result: res.status });
    }

    return { status: "WAR_MODE_ACTIVE", processed: results };
}

// Allow running standalone for testing: `node src/scheduler.js`
if (require.main === module) {
    checkSchedule();
}

module.exports = { checkSchedule };
