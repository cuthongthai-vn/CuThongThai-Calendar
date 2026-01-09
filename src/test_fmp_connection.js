
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
    // 1. Control Test: AAPL (Standard Stock)
    await testEndpoint("AAPL History (V3 Full)", `${BASE_V3}/historical-price-full/AAPL?apikey=${FMP_API_KEY}`);

    // 2. Re-test VNINDEX Quote (Realtime might work, History might fail)
    await testEndpoint("VNINDEX Quote", `${BASE_V3}/quote/^VNINDEX?apikey=${FMP_API_KEY}`);

    // 3. Search to see if symbols exist
    await testEndpoint("Search ^VNINDEX", `${BASE_V3}/search?query=^VNINDEX&limit=1&apikey=${FMP_API_KEY}`);
}

runTests();
