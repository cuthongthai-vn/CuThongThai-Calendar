
require('dotenv').config();
const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
const BASE_V3 = 'https://financialmodelingprep.com/api/v3';
const BASE_V4 = 'https://financialmodelingprep.com/api/v4';
const BASE_STABLE = 'https://financialmodelingprep.com/stable';

async function testEndpoint(name, url) {
    console.log(`\n🧪 Testing ${name}...`);
    console.log(`   URL: ${url.replace(FMP_API_KEY, 'HIDDEN')}`);
    try {
        const res = await fetch(url);
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
                console.log(`   ✅ Success! Array length: ${json.length}`);
                if (json.length > 0) console.log(`   📝 Sample: ${JSON.stringify(json[0]).slice(0, 100)}`);
            } else if (json['Error Message']) {
                console.log(`   ❌ Error: ${json['Error Message']}`);
            } else {
                console.log(`   ⚠️ Object Response: ${JSON.stringify(json).slice(0, 100)}`);
            }
        } catch (e) {
            console.log(`   ❌ Invalid JSON: ${text.slice(0, 100)}`);
        }
    } catch (e) {
        console.log(`   ❌ network/server failed: ${e.message}`);
    }
}

async function runTests() {
    // 1. Forex Realtime
    await testEndpoint("Forex Quote (V3)", `${BASE_V3}/quote/USDVND?apikey=${FMP_API_KEY}`);

    // 2. Forex History V3
    await testEndpoint("Forex History (V3 Chart)", `${BASE_V3}/historical-chart/1day/USDVND?apikey=${FMP_API_KEY}`);

    // 3. Forex History V4 (Often for premium)
    await testEndpoint("Forex History (V4 Standard)", `${BASE_V3}/historical-price-full/USDVND?apikey=${FMP_API_KEY}`);

    // 4. Calendar Short Range (Stable)
    const today = new Date().toISOString().split('T')[0];
    await testEndpoint("Calendar Short (Stable)", `${BASE_STABLE}/economic-calendar?from=${today}&to=${today}&apikey=${FMP_API_KEY}`);

    // 5. Calendar Long Range (Stable)
    await testEndpoint("Calendar Long (Stable)", `${BASE_STABLE}/economic-calendar?from=2024-01-01&to=2024-02-01&apikey=${FMP_API_KEY}`);

    // 6. Calendar V3
    await testEndpoint("Calendar Short (V3)", `${BASE_V3}/economic-calendar?from=${today}&to=${today}&apikey=${FMP_API_KEY}`);
}

runTests();
