
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { getFinancialCommentary } = require('./ai_analyst');
const { compareEventData } = require('./logic_processor');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function backfillAI_Direct() {
    console.log("🕵️‍♂️ Starting AI Backfill (Direct Mode)...");

    // 1. Find events that have 'actual' data but NO 'ai_sentiment'
    const { data: events, error } = await supabase
        .from('economic_events')
        .select('*')
        .not('actual', 'is', null) // Must have data
        .is('ai_sentiment', null); // Missing AI

    if (error) {
        console.error("❌ DB Query Error:", error.message);
        return;
    }

    if (!events || events.length === 0) {
        console.log("✅ No pending past events found.");
        return;
    }

    console.log(`📉 Found ${events.length} events to analyze.`);

    for (const event of events) {
        console.log(`\n👉 Analyzing: ${event.event_name} (Actual: ${event.actual})`);

        // 2. Logic Analysis (Compare Actual vs Forecast)
        const analysis = compareEventData(event);

        // 3. AI Analysis
        // Mock context if history is missing (or fetch it if crucial, but for backfill we can skip history context to save time)
        const context = { past: [] };

        try {
            const aiResult = await getFinancialCommentary(event, analysis, context);

            // 4. Update Database
            const { error: updateError } = await supabase
                .from('economic_events')
                .update({
                    ai_sentiment: aiResult.sentiment,
                    ai_commentary: aiResult.commentary,
                    vn_impact: aiResult.vn_impact || "Cú Thông Thái đang cập nhật...",
                    event_name_vi: aiResult.translated_name
                })
                .eq('id', event.id);

            if (updateError) {
                console.error("   ❌ Update Failed:", updateError.message);
            } else {
                console.log(`   ✅ AI Updated: [${aiResult.sentiment}] ${aiResult.translated_name}`);
            }

        } catch (err) {
            console.error("   ❌ AI Error:", err.message);
        }

        // Rate limit protection
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log("\n✅ Direct Backfill Complete!");
}

backfillAI_Direct();
