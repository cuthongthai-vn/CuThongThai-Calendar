/**
 * test_adaptive_poll.js
 * Local testing script for adaptive polling strategy
 * 
 * Usage:
 *   node src/test_adaptive_poll.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testAdaptivePoll() {
    console.log('\n🧪 ========================================');
    console.log('   ADAPTIVE POLL - LOCAL TEST');
    console.log('========================================\n');

    const now = new Date();
    console.log(`Current time: ${now.toISOString()}\n`);

    // Query events like the endpoint does
    const twoMinAgo = new Date(now.getTime() - 2 * 60000).toISOString();
    const tenMinAhead = new Date(now.getTime() + 10 * 60000).toISOString();

    const { data: events, error } = await supabase
        .from('economic_events')
        .select('*')
        .is('actual', null)
        .gte('event_time', twoMinAgo)
        .lte('event_time', tenMinAhead)
        .order('event_time', { ascending: true });

    if (error) {
        console.error('❌ Query Error:', error.message);
        return;
    }

    if (!events || events.length === 0) {
        console.log('💤 PEACE MODE: No events in ±2 min to +10 min window\n');
        console.log('✅ Test complete - system would sleep for 10 minutes\n');
        return;
    }

    console.log(`📋 Found ${events.length} event(s):\n`);

    const warEvents = [];
    const alertEvents = [];

    events.forEach(e => {
        const diffMs = new Date(e.event_time) - now;
        const diffMin = diffMs / 60000;
        const mode = Math.abs(diffMs) <= 2 * 60000 ? '🔴 WAR' : '🟡 ALERT';

        console.log(`${mode} - ${e.event} (${e.country})`);
        console.log(`   Time: ${e.event_time}`);
        console.log(`   Diff: ${diffMin > 0 ? '+' : ''}${diffMin.toFixed(1)} minutes\n`);

        if (Math.abs(diffMs) <= 2 * 60000) {
            warEvents.push(e);
        } else if (diffMs > 2 * 60000 && diffMs <= 10 * 60000) {
            alertEvents.push(e);
        }
    });

    console.log('📊 MODE SUMMARY:');
    console.log(`   🔴 WAR events: ${warEvents.length} (will poll every 10s)`);
    console.log(`   🟡 ALERT events: ${alertEvents.length} (will poll every 1min)`);
    console.log(`   💤 PEACE: ${events.length === 0 ? 'Yes' : 'No'}\n`);

    if (warEvents.length > 0) {
        console.log('🔥 WAR MODE would be activated!');
        console.log('   → Endpoint will call itself every 10 seconds');
        console.log('   → Will continue until all events get actual data\n');
    } else if (alertEvents.length > 0) {
        console.log('⚠️ ALERT MODE would be activated!');
        console.log('   → Endpoint will be called again in 1 minute\n');
    }

    console.log('✅ Test complete!\n');
}

// Allow direct execution
if (require.main === module) {
    testAdaptivePoll()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { testAdaptivePoll };
