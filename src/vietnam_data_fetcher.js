/**
 * vietnam_data_fetcher.js
 * Centralized Vietnam data fetching from multiple FREE sources
 * 
 * Data Sources:
 * 1. Vietcombank XML - Official USDVND exchange rate (real-time)
 * 2. VNDirect API - VNINDEX, stock market data (real-time)
 * 3. World Bank API - Vietnam GDP, CPI, macro indicators (monthly/quarterly)
 * 4. tygiausd.org - Black market USD rate (existing scraper)
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { parseStringPromise } = require('xml2js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ============================================
// 1. VIETCOMBANK XML - Official Exchange Rate
// ============================================

const VCB_EXCHANGE_RATE_URL = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx';

async function fetchVietcombankExchangeRate() {
    console.log('🏦 [VCB] Fetching official exchange rate from Vietcombank XML...');

    try {
        const response = await fetch(VCB_EXCHANGE_RATE_URL);
        const xmlText = await response.text();

        // Parse XML to JSON
        const result = await parseStringPromise(xmlText);

        // Find USD entry in the XML
        const exrates = result.ExrateList?.Exrate || [];
        const usdEntry = exrates.find(item => item.$?.CurrencyCode === 'USD');

        if (!usdEntry) {
            console.error('   ❌ USD not found in Vietcombank XML');
            return null;
        }

        // Extract rates
        const buyRate = parseFloat(usdEntry.$?.Buy || 0);
        const sellRate = parseFloat(usdEntry.$?.Sell || 0);
        const transferRate = parseFloat(usdEntry.$?.Transfer || 0);

        console.log(`   ✅ VCB Rates: Buy=${buyRate}, Sell=${sellRate}, Transfer=${transferRate}`);

        // Save to database
        const today = new Date().toISOString().split('T')[0];

        const { error } = await supabase
            .from('macro_indicators')
            .upsert([
                {
                    indicator_key: 'USDVND_OFFICIAL',
                    date: today,
                    value: transferRate, // Use transfer rate as official
                    source: 'VIETCOMBANK_XML'
                }
            ], { onConflict: 'indicator_key, date' });

        if (error) {
            console.error('   ❌ DB Error:', error.message);
            return null;
        }

        console.log(`   💾 Saved official rate: ${transferRate} VND`);

        return {
            buy: buyRate,
            sell: sellRate,
            transfer: transferRate,
            date: today
        };

    } catch (error) {
        console.error('   ❌ VCB Fetch Failed:', error.message);
        return null;
    }
}

// ============================================
// 2. VNDIRECT API - VNINDEX & Stock Data
// ============================================

const VNDIRECT_BASE = 'https://finfo-api.vndirect.com.vn';

/**
 * Fetch latest VNINDEX value
 */
async function fetchVNINDEX() {
    console.log('📈 [VNDirect] Fetching VNINDEX...');

    try {
        // Endpoint: Index intraday latest
        const url = `${VNDIRECT_BASE}/v4/index_intraday_latest?q=code:VNINDEX`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            console.error('   ❌ VNINDEX data not found');
            return null;
        }

        const vnindex = data.data[0];
        const indexValue = parseFloat(vnindex.indexValue || 0);
        const change = parseFloat(vnindex.change || 0);
        const changePercent = parseFloat(vnindex.changePercent || 0);

        console.log(`   ✅ VNINDEX: ${indexValue} (${change >= 0 ? '+' : ''}${change}, ${changePercent.toFixed(2)}%)`);

        // Save to database
        const today = new Date().toISOString().split('T')[0];

        const { error } = await supabase
            .from('macro_indicators')
            .upsert([
                {
                    indicator_key: 'VNINDEX',
                    date: today,
                    value: indexValue,
                    source: 'VNDIRECT_API'
                }
            ], { onConflict: 'indicator_key, date' });

        if (error) {
            console.error('   ❌ DB Error:', error.message);
            return null;
        }

        console.log(`   💾 Saved VNINDEX: ${indexValue}`);

        return {
            value: indexValue,
            change: change,
            changePercent: changePercent,
            date: today
        };

    } catch (error) {
        console.error('   ❌ VNDirect Fetch Failed:', error.message);
        return null;
    }
}

/**
 * Fetch multiple VN stock indices (VN30, HNX, UPCOM)
 */
async function fetchAllVNIndices() {
    console.log('📊 [VNDirect] Fetching all Vietnam indices...');

    const indices = ['VNINDEX', 'VN30', 'HNX', 'UPCOM'];
    const results = {};

    try {
        const url = `${VNDIRECT_BASE}/v4/index_intraday_latest?q=code:${indices.join(',')}`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!data || !data.data) {
            console.error('   ❌ No indices data found');
            return null;
        }

        const today = new Date().toISOString().split('T')[0];
        const upsertData = [];

        data.data.forEach(index => {
            const code = index.code;
            const value = parseFloat(index.indexValue || 0);
            const change = parseFloat(index.change || 0);
            const changePercent = parseFloat(index.changePercent || 0);

            results[code] = { value, change, changePercent };

            // Prepare for batch upsert
            upsertData.push({
                indicator_key: code,
                date: today,
                value: value,
                source: 'VNDIRECT_API'
            });

            console.log(`   ✅ ${code}: ${value} (${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`);
        });

        // Batch save to database
        const { error } = await supabase
            .from('macro_indicators')
            .upsert(upsertData, { onConflict: 'indicator_key, date' });

        if (error) {
            console.error('   ❌ DB Error:', error.message);
        } else {
            console.log(`   💾 Saved ${upsertData.length} indices to database`);
        }

        return results;

    } catch (error) {
        console.error('   ❌ VNDirect All Indices Fetch Failed:', error.message);
        return null;
    }
}

// ============================================
// 3. WORLD BANK API - Vietnam Macro Indicators
// ============================================

const WORLD_BANK_BASE = 'https://api.worldbank.org/v2';

/**
 * Fetch Vietnam indicator from World Bank
 * @param {string} indicatorCode - WB indicator code (e.g., 'NY.GDP.MKTP.KD.ZG' for GDP growth)
 * @param {string} indicatorKey - Our database key (e.g., 'VN_GDP_YOY')
 * @param {number} years - Number of years to fetch (default: 10)
 */
async function fetchWorldBankIndicator(indicatorCode, indicatorKey, years = 10) {
    console.log(`🌍 [World Bank] Fetching ${indicatorKey} (${indicatorCode})...`);

    try {
        // World Bank API returns most recent data first
        const url = `${WORLD_BANK_BASE}/country/VN/indicator/${indicatorCode}?format=json&per_page=${years}`;

        const response = await fetch(url);
        const data = await response.json();

        // Response format: [metadata, data]
        if (!data || data.length < 2 || !data[1]) {
            console.error('   ❌ No data received from World Bank');
            return null;
        }

        const indicators = data[1];
        const upsertData = [];

        indicators.forEach(item => {
            if (!item.value) return; // Skip null values

            const year = item.date; // e.g., "2023"
            const value = parseFloat(item.value);

            // Convert year to date format (use Dec 31 for annual data)
            const date = `${year}-12-31`;

            upsertData.push({
                indicator_key: indicatorKey,
                date: date,
                value: value,
                source: 'WORLD_BANK_API'
            });
        });

        if (upsertData.length === 0) {
            console.log('   ⚠️ No valid data points found');
            return null;
        }

        // Batch save to database
        const { error } = await supabase
            .from('macro_indicators')
            .upsert(upsertData, { onConflict: 'indicator_key, date' });

        if (error) {
            console.error('   ❌ DB Error:', error.message);
            return null;
        }

        console.log(`   ✅ Saved ${upsertData.length} data points for ${indicatorKey}`);
        console.log(`   📊 Latest: ${upsertData[0].value} (${upsertData[0].date})`);

        return upsertData;

    } catch (error) {
        console.error('   ❌ World Bank Fetch Failed:', error.message);
        return null;
    }
}

/**
 * Fetch all common Vietnam indicators from World Bank
 */
async function fetchAllWorldBankIndicators() {
    console.log('\n🌍 [World Bank] Fetching all Vietnam macro indicators...\n');

    const indicators = [
        { code: 'NY.GDP.MKTP.KD.ZG', key: 'VN_GDP_YOY', name: 'GDP Growth (YoY)' },
        { code: 'FP.CPI.TOTL.ZG', key: 'VN_CPI_YOY', name: 'Inflation (CPI YoY)' },
        { code: 'SL.UEM.TOTL.ZS', key: 'VN_UNEMPLOYMENT_RATE', name: 'Unemployment Rate' },
        { code: 'NY.GDP.MKTP.CD', key: 'VN_GDP_ABS_USD', name: 'GDP Absolute (USD)' },
        { code: 'SP.POP.TOTL', key: 'VN_POPULATION', name: 'Population' },
        { code: 'SP.DYN.LE00.IN', key: 'VN_LIFE_EXPECTANCY', name: 'Life Expectancy' }
    ];

    const results = {};

    for (const indicator of indicators) {
        const data = await fetchWorldBankIndicator(indicator.code, indicator.key);
        results[indicator.key] = data;

        // Sleep 500ms between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ World Bank data fetching complete!\n');

    return results;
}

// ============================================
// 4. MASTER FUNCTION - Run All Fetchers
// ============================================

async function fetchAllVietnamData() {
    console.log('\n🇻🇳 ========================================');
    console.log('   VIETNAM DATA FETCHER - MASTER RUN');
    console.log('========================================\n');

    const results = {};

    // 1. Vietcombank Exchange Rate
    results.exchangeRate = await fetchVietcombankExchangeRate();

    // 2. VNDirect Indices
    results.vnindices = await fetchAllVNIndices();

    // 3. World Bank Indicators
    results.worldBank = await fetchAllWorldBankIndicators();

    console.log('\n✅ ========================================');
    console.log('   ALL VIETNAM DATA FETCHED SUCCESSFULLY');
    console.log('========================================\n');

    return results;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    fetchVietcombankExchangeRate,
    fetchVNINDEX,
    fetchAllVNIndices,
    fetchWorldBankIndicator,
    fetchAllWorldBankIndicators,
    fetchAllVietnamData
};

// ============================================
// CLI EXECUTION
// ============================================

if (require.main === module) {
    fetchAllVietnamData()
        .then(() => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Script failed:', err);
            process.exit(1);
        });
}
