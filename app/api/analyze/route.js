import { getSupabaseClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import { compareEventData } from '../../../src/logic_processor';
import { getFinancialCommentary } from '../../../src/ai_analyst';

export async function POST(request) {
    try {
        const supabase = getSupabaseClient();
        const { event_id } = await request.json();

        // 1. Fetch event from DB
        const { data: event, error: fetchError } = await supabase
            .from('economic_events')
            .select('*')
            .eq('id', event_id)
            .single();

        if (fetchError || !event) throw new Error('Event not found');

        // 2. Fetch Context (Past + Future in Parallel)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const sevenDaysFuture = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const now = new Date().toISOString();

        const [pastContext, futureContext] = await Promise.all([
            // Past 7 Days
            supabase
                .from('economic_events')
                .select('event_name, actual, forecast, event_time')
                .gte('event_time', sevenDaysAgo)
                .lt('event_time', now)
                .not('actual', 'is', null) // Only completed events
                .order('event_time', { ascending: false })
                .limit(10)
                .then(res => res.data || []),

            // Future 7 Days - High Impact Only
            supabase
                .from('economic_events')
                .select('event_name, forecast, event_time, impact_level')
                .gt('event_time', now)
                .lte('event_time', sevenDaysFuture)
                .eq('impact_level', 'High')
                .order('event_time', { ascending: true })
                .limit(5)
                .then(res => res.data || [])
        ]);

        // 3. Run Logic
        const analysis = compareEventData(event);
        if (analysis.status !== "COMPLETED") {
            return NextResponse.json({
                error: 'Analysis failed (missing data?)',
                details: analysis
            }, { status: 400 });
        }

        // 4. Run AI with Context
        const context = {
            past: pastContext,
            future: futureContext
        };
        const aiResult = await getFinancialCommentary(event, analysis, context);

        // 5. Update DB
        const { data: updatedEvent, error: updateError } = await supabase
            .from('economic_events')
            .update({
                ai_commentary: aiResult.commentary,
                ai_sentiment: aiResult.sentiment,
                vn_impact: aiResult.vn_impact || "Chưa có đánh giá chi tiết",
                updated_at: new Date().toISOString()
            })
            .eq('id', event_id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json(updatedEvent);

    } catch (error) {
        console.error("AI Analyze Error:", error);
        return NextResponse.json({
            error: 'Failed to analyze event',
            details: error.message
        }, { status: 500 });
    }
}
