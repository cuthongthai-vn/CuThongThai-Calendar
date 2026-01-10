/**
 * clear_ai_cache.js
 * Clear cached AI commentary errors from database
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function clearAICache() {
    console.log('🧹 Starting AI Commentary Cache Clear...\n');

    try {
        // Get events from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        console.log(`   Clearing commentary for events since ${sevenDaysAgo.toISOString().split('T')[0]}...`);

        // Update using raw SQL via RPC or direct update
        const { data: events, error: fetchError } = await supabase
            .from('economic_events')
            .select('id, event, ai_commentary')
            .gte('event_time', sevenDaysAgo.toISOString())
            .not('ai_commentary', 'is', null);

        if (fetchError) {
            console.error('❌ Error fetching events:', fetchError.message);
            process.exit(1);
        }

        console.log(`   Found ${events.length} events with commentary\n`);

        // Clear each one
        let cleared = 0;
        for (const event of events) {
            const { error: updateError } = await supabase
                .from('economic_events')
                .update({
                    ai_commentary: null,
                    ai_sentiment: null,
                    vn_impact: null
                })
                .eq('id', event.id);

            if (!updateError) {
                cleared++;
                console.log(`   ✓ Cleared: ${event.event}`);
            }
        }

        console.log(`\n✅ Successfully cleared ${cleared} events`);
        console.log('   Events will regenerate AI commentary on next page load\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        process.exit(1);
    }
}

clearAICache();
