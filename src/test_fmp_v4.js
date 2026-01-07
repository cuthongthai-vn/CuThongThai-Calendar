
require('dotenv').config();
const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
const BASE_V4 = 'https://financialmodelingprep.com/api/v4';

async function testEndpoint(name, url) {
    console.log(`\n🧪 Testing ${name}...`);
    console.log(`   URL: ${url.replace(FMP_API_KEY, 'HIDDEN')}`);
    try {
        const res = await fetch(url);
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            if (Array.isArray(json) || json.historical) {
                console.log(`   ✅ Success!`);
                if (json.historical) console.log(`   📝 History Length: ${json.historical.length}`);
                else if (Array.isArray(json)) console.log(`   📝 Array Length: ${json.length}`);
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
    // 1. Forex History V4
    // FMP V4 logic for forex might be different, let's try standard mapping
    await testEndpoint("Forex History (V4)", `${BASE_V4}/historical-price-full/USDVND?apikey=${FMP_API_KEY}`);

    // 2. Forex Quote V4 (if exists)
    await testEndpoint("Forex Quote (V4)", `${BASE_V4}/quote/USDVND?apikey=${FMP_API_KEY}`);

    // 3. Treasury (Bonds)
    await testEndpoint("Treasury (V4)", `${BASE_V4}/treasury?apikey=${FMP_API_KEY}`);
}

runTests();
