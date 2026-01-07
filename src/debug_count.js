
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function countRows() {
    const { count, error } = await supabase
        .from('macro_indicators')
        .select('*', { count: 'exact', head: true });

    if (error) console.error(error);
    else console.log(`📊 Total Rows in Table: ${count}`);
}

countRows();
