import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { compareEventData } from '../../../src/logic_processor';
import { getFinancialCommentary } from '../../../src/ai_analyst';

export async function POST(request) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { event_id } = await request.json();

        // 1. Fetch event from DB
        const { data: event, error: fetchError } = await supabase
            .from('economic_events')
            .select('*')
            .eq('id', event_id)
            .single();

        if (fetchError || !event) throw new Error('Event not found');

        // 2a. Fetch Context (Past 7 Days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: pastContext } = await supabase
            .from('economic_events')
            .select('event_name, actual, forecast, event_time')
            .gte('event_time', sevenDaysAgo)
            .lt('event_time', new Date().toISOString())
            .not('actual', 'is', null) // Only completed events
            .order('event_time', { ascending: false })
            .limit(10);

        // 2b. Fetch Context (Future 7 Days - High Impact Only)
        const sevenDaysFuture = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: futureContext } = await supabase
            .from('economic_events')
            .select('event_name, forecast, event_time, impact_level')
            .gt('event_time', new Date().toISOString())
            .lte('event_time', sevenDaysFuture)
            .eq('impact_level', 'High') // Only High impact
            .order('event_time', { ascending: true })
            .limit(5);

        // 3. Run Logic
        const analysis = compareEventData(event);
        if (analysis.status !== "COMPLETED") {
            return NextResponse.json({ error: 'Analysis failed (missing data?)', details: analysis }, { status: 400 });
        }

        // 4. Run AI with Context
        const context = {
            past: pastContext || [],
            future: futureContext || []
        };
        const aiResult = await getFinancialCommentary(event, analysis, context);

        // 4. Update DB
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
