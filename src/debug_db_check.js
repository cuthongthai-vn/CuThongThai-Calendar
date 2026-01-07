
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkLatest() {
    console.log("🔍 Checking Latest Data in DB...");

    const keys = ['VN_INTEREST_RATE', 'VN_GDP_ABS_BUSD', 'VN_SAVINGS_RATE_12M'];

    for (const key of keys) {
        const { data, error } = await supabase
            .from('macro_indicators')
            .select('*')
            .eq('indicator_key', key)
            .order('date', { ascending: false })
            .limit(5);

        if (error) console.error(error);
        else {
            console.log(`\n--- ${key} (Latest 5) ---`);
            console.table(data);
        }
    }
}

checkLatest();
