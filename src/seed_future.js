require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seedFuture() {
    console.log("🚀 Seeding Future Data (2026-01-08)...");

    const rows = [
        {
            indicator_key: 'GOLD_WORLD',
            date: '2026-01-08',
            value: 4450, // Requested value
            source: 'MANUAL_FUTURE'
        },
        {
            indicator_key: 'USDVND_OFFICIAL',
            date: '2026-01-08',
            value: 26500, // Estimated/Mocked
            source: 'MANUAL_FUTURE'
        },
        {
            indicator_key: 'GOLD_SJC',
            date: '2026-01-08',
            value: 165000000, // Mocked ~165 Tr
            source: 'MANUAL_FUTURE'
        }
    ];

    const { error } = await supabase
        .from('macro_indicators')
        .upsert(rows, { onConflict: 'indicator_key, date' });

    if (error) {
        console.error("❌ Error seeding future data:", error);
    } else {
        console.log("✅ Future data seeded successfully!");
    }
}

seedFuture();
