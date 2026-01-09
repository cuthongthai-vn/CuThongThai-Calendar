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
            const volume = json.v[lastIdx]; // Volume

            // Convert timestamp to YYYY-MM-DD
            const dateObj = new Date(timestamp * 1000);
            const dateStr = dateObj.toISOString().split('T')[0];

            console.log(`   🎯 Latest Data: ${dateStr} - Close: ${closePrice} - Vol: ${volume}`);

            // Upsert Price
            const { error: err1 } = await supabase
                .from('macro_indicators')
                .upsert({
                    indicator_key: 'VNINDEX',
                    date: dateStr,
                    value: closePrice,
                    source: 'VNDIRECT_API'
                }, { onConflict: 'indicator_key, date' });



            // Upsert Open
            const { error: err3 } = await supabase
                .from('macro_indicators')
                .upsert({
                    indicator_key: 'VNINDEX_OPEN',
                    date: dateStr,
                    value: json.o[lastIdx],
                    source: 'VNDIRECT_API'
                }, { onConflict: 'indicator_key, date' });

            // Upsert High
            const { error: err4 } = await supabase
                .from('macro_indicators')
                .upsert({
                    indicator_key: 'VNINDEX_HIGH',
                    date: dateStr,
                    value: json.h[lastIdx],
                    source: 'VNDIRECT_API'
                }, { onConflict: 'indicator_key, date' });

            // Upsert Low
            const { error: err5 } = await supabase
                .from('macro_indicators')
                .upsert({
                    indicator_key: 'VNINDEX_LOW',
                    date: dateStr,
                    value: json.l[lastIdx],
                    source: 'VNDIRECT_API'
                }, { onConflict: 'indicator_key, date' });

            // Upsert Volume
            const { error: err2 } = await supabase
                .from('macro_indicators')
                .upsert({
                    indicator_key: 'VNINDEX_VOLUME',
                    date: dateStr,
                    value: volume,
                    source: 'VNDIRECT_API'
                }, { onConflict: 'indicator_key, date' });

            if (err1 || err2 || err3 || err4 || err5) {
                console.error(`   ❌ Database Error: ${err1?.message} | ${err2?.message} | ${err3?.message}`);
            } else {
                console.log(`   ✅ Successfully updated VNINDEX OHLCV for ${dateStr}`);
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
