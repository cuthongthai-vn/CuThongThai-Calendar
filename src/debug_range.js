
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testRange() {
    console.log("🧪 Testing .range(0, 2000)...");

    // Attempt to fetch MORE than 1000 rows
    const { data, error, count } = await supabase
        .from('macro_indicators')
        .select('*', { count: 'exact' })
        .order('date', { ascending: true })
        .range(0, 2000);

    if (error) {
        console.error("❌ Limit Test Failed:", error.message);
    } else {
        console.log(`✅ Fetched: ${data.length} rows.`);
        console.log(`   Total in DB: ${count}`);

        if (data.length > 1000) {
            console.log("   🎉 SUCCESS: Retrieved > 1000 rows. Range/Limit override works!");
            // Check last item date
            console.log("   Last Item Date:", data[data.length - 1].date);
        } else {
            console.log("   ⚠️ FAILED: Retrieved <= 1000 rows. Limit barrier persists.");
        }
    }
}

testRange();
