require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const VN_DIRECT_API = "https://dchart-api.vndirect.com.vn/dchart/history?resolution=D&symbol=VNINDEX";

async function fetchVNINDEX() {
    console.log(`\n📈 Fetching VNINDEX Daily from VNDirect...`);

    // Calculate From/To timestamps (last 7 days to be safe)
    const now = Math.floor(Date.now() / 1000);
    const from = now - (7 * 24 * 60 * 60);
    const url = `${VN_DIRECT_API}&from=${from}&to=${now}`;

    try {
        const res = await fetch(url);
        const json = await res.json();

        if (json.s === 'ok' && json.t && json.c && json.t.length > 0) {
            // Get the latest data point
            const lastIdx = json.t.length - 1;
            const timestamp = json.t[lastIdx];
            const closePrice = json.c[lastIdx];

            // Convert timestamp to YYYY-MM-DD
            const dateObj = new Date(timestamp * 1000);
            const dateStr = dateObj.toISOString().split('T')[0];

            console.log(`   🎯 Latest Data: ${dateStr} - Close: ${closePrice}`);

            // Upsert to DB
            const { error } = await supabase
                .from('macro_indicators')
                .upsert({
                    indicator_key: 'VNINDEX',
                    date: dateStr,
                    value: closePrice,
                    source: 'VNDIRECT_API'
                }, { onConflict: 'indicator_key, date' });

            if (error) {
                console.error(`   ❌ Database Error: ${error.message}`);
            } else {
                console.log(`   ✅ Successfully updated VNINDEX for ${dateStr}: ${closePrice}`);
            }

        } else {
            console.error(`   ❌ Invalid API Response or No Data: ${JSON.stringify(json)}`);
        }

    } catch (e) {
        console.error(`   ❌ Fetch Error: ${e.message}`);
    }
}

if (require.main === module) {
    fetchVNINDEX();
}

module.exports = { fetchVNINDEX };
