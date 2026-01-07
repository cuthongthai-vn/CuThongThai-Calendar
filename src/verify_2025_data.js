
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function verifyData() {
    console.log("🔍 Verifying 2025 Data...");

    const checkIndicators = ['VN_GDP_YOY', 'VN_CPI_YOY', 'VN_GDP_ABS_BUSD', 'VN_INTEREST_RATE', 'USDVND_OFFICIAL', 'USDVND_BLACK_MARKET'];

    for (const key of checkIndicators) {
        const { data, error } = await supabase
            .from('macro_indicators')
            .select('*')
            .eq('indicator_key', key)
            .gte('date', '2025-01-01')
            .order('date', { ascending: true });

        if (error) {
            console.error(`❌ Error checking ${key}:`, error.message);
        } else {
            if (data.length > 0) {
                console.log(`✅ ${key}: Found ${data.length} entries for 2025+.`);
                console.log(`   Sample: ${data[0].date} -> ${data[0].value}`);
            } else {
                console.log(`⚠️ ${key}: NO entries found for 2025+.`);
            }
        }
    }
}

verifyData();
