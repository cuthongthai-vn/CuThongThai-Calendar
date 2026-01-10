/**
 * /api/cron/adaptive-poll/route.js
 * 
 * Adaptive Polling Strategy - Main Endpoint
 * Called by cron-job.org every 10 minutes
 * 
 * Modes:
 * - PEACE: No events → return 600s (10 min)
 * - ALERT: Events 2-10 min ahead → return 60s (1 min) 
 * - WAR: Events within ±2 min → trigger high-freq loop
 */

import { createClient } from '@supabase/supabase-js';
import { fetchAndProcessEvent } from '@/src/fetcher';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export async function GET(request) {
    // Security: Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error('❌ Unauthorized cron attempt');
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const timestamp = now.toISOString();
    console.log(`\n⏰ ========================================`);
    console.log(`   Adaptive Poll Check: ${timestamp}`);
    console.log(`========================================\n`);

    try {
        // === STEP 1: Query upcoming events ===
        const twoMinAgo = new Date(now.getTime() - 2 * 60000).toISOString();
        const tenMinAhead = new Date(now.getTime() + 10 * 60000).toISOString();

        const { data: upcomingEvents, error: queryError } = await supabase
            .from('economic_events')
            .select('*')
            .is('actual', null) // Only fetch missing data
            .gte('event_time', twoMinAgo) // -2 min to +10 min window
            .lte('event_time', tenMinAhead)
            .order('event_time', { ascending: true });

        if (queryError) {
            console.error('❌ DB Query Error:', queryError.message);
            return Response.json({
                error: queryError.message,
                mode: 'ERROR'
            }, { status: 500 });
        }

        if (!upcomingEvents || upcomingEvents.length === 0) {
            console.log('💤 PEACE MODE: No events in next 10 minutes');
            console.log('   Next poll: 10 minutes\n');

            return Response.json({
                mode: 'PEACE',
                nextPollSeconds: 600,
                message: 'All quiet on the economic front',
                timestamp
            });
        }

        console.log(`📋 Found ${upcomingEvents.length} pending event(s):\n`);
        upcomingEvents.forEach(e => {
            const diff = (new Date(e.event_time) - now) / 1000;
            console.log(`   - ${e.event} (${e.country})`);
            console.log(`     Time: ${e.event_time}`);
            console.log(`     Diff: ${diff > 0 ? '+' : ''}${Math.round(diff)}s\n`);
        });

        // === STEP 2: Categorize events by urgency ===
        const warEvents = [];
        const alertEvents = [];

        for (const event of upcomingEvents) {
            const diffMs = new Date(event.event_time) - now;
            const diffSec = Math.abs(diffMs / 1000);

            if (Math.abs(diffMs) <= 2 * 60000) {
                // Within ±2 minutes
                warEvents.push({ ...event, diff: diffSec });
            } else if (diffMs > 2 * 60000 && diffMs <= 10 * 60000) {
                // 2-10 minutes ahead
                alertEvents.push({ ...event, diff: diffSec });
            }
        }

        // === STEP 3: Execute appropriate mode ===

        if (warEvents.length > 0) {
            // 🔴 WAR MODE: High-frequency polling
            console.log(`🔥 WAR MODE ACTIVATED: ${warEvents.length} event(s) in ±2 min window\n`);

            const results = [];
            for (const event of warEvents) {
                console.log(`   🎯 Processing: ${event.event} (${event.country})`);
                const res = await fetchAndProcessEvent(event);
                results.push({
                    id: event.id,
                    event: event.event,
                    status: res.status,
                    actual: res.actual || null
                });
                console.log(`      → ${res.status}${res.actual ? ` (actual: ${res.actual})` : ''}\n`);
            }

            // Check if any event got actual data
            const resolved = results.filter(r => r.actual !== null);

            if (resolved.length === warEvents.length) {
                // All events resolved → back to peace
                console.log(`✅ All ${resolved.length} event(s) resolved!`);
                console.log('   Returning to PEACE mode\n');

                return Response.json({
                    mode: 'WAR_COMPLETE',
                    eventsResolved: resolved.length,
                    results,
                    nextPollSeconds: 600,
                    timestamp
                });
            }

            // Still waiting for data → trigger next war poll in 10 seconds
            console.log(`⏳ ${warEvents.length - resolved.length} event(s) still pending`);
            console.log('   Triggering next WAR poll in 10 seconds...\n');

            // Self-trigger via fetch (simpler than Edge recursion)
            const baseUrl = process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : request.url.split('/api')[0];

            setTimeout(() => {
                fetch(`${baseUrl}/api/cron/adaptive-poll`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.CRON_SECRET}`
                    }
                }).catch(err => console.error('❌ Self-trigger failed:', err.message));
            }, 10000); // 10 seconds

            return Response.json({
                mode: 'WAR',
                eventsProcessed: results.length,
                eventsResolved: resolved.length,
                eventsPending: warEvents.length - resolved.length,
                nextPollSeconds: 10,
                results,
                timestamp
            });
        }

        if (alertEvents.length > 0) {
            // 🟡 ALERT MODE: Pre-event warmup
            console.log(`⚠️ ALERT MODE: ${alertEvents.length} event(s) in 2-10 min window`);
            console.log('   Next poll: 1 minute\n');

            return Response.json({
                mode: 'ALERT',
                eventsAhead: alertEvents.length,
                nextPollSeconds: 60,
                events: alertEvents.map(e => ({
                    id: e.id,
                    event: e.event,
                    country: e.country,
                    time: e.event_time,
                    diffSeconds: Math.round(e.diff)
                })),
                timestamp
            });
        }

        // Fallback (shouldn't reach here given our query logic)
        console.log('💤 PEACE MODE (fallback): No urgent events\n');
        return Response.json({
            mode: 'PEACE',
            nextPollSeconds: 600,
            timestamp
        });

    } catch (error) {
        console.error('❌ Adaptive Poll Error:', error.message);
        console.error(error.stack);

        return Response.json({
            error: error.message,
            mode: 'ERROR',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
