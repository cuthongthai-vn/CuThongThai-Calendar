
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkRanges() {
    console.log("📊 Checking Data Ranges...");
    const { data, error } = await supabase.from('macro_indicators').select('indicator_key, date');

    if (error) {
        console.error(error);
        return;
    }

    const stats = {};

    data.forEach(r => {
        if (!stats[r.indicator_key]) {
            stats[r.indicator_key] = { min: r.date, max: r.date, count: 0 };
        }
        if (r.date < stats[r.indicator_key].min) stats[r.indicator_key].min = r.date;
        if (r.date > stats[r.indicator_key].max) stats[r.indicator_key].max = r.date;
        stats[r.indicator_key].count++;
    });

    console.table(stats);
}

checkRanges();
