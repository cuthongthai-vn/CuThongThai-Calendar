
/**
 * scraper_black_market.js
 * Scrapes 'USD Chợ Đen' rates from tygiausd.org
 */
require('dotenv').config();
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TARGET_URL = 'https://tygiausd.org/';

async function scrapeBlackMarket() {
    console.log(`🕵️‍♀️ Scraping USD Black Market from: ${TARGET_URL}`);

    try {
        const res = await fetch(TARGET_URL);
        const html = await res.text();
        const $ = cheerio.load(html);

        // Debug: Save HTML to inspect (Optional, kept for future debugging)
        // const fs = require('fs');
        // fs.writeFileSync('debug_tygia.html', html);

        let buyPrice = null;
        let sellPrice = null;

        // TARGET STRUCTURE FROM debug_tygia.html:
        // <tr>
        //     <th title="giá usd chợ đen"><a href="..."><h3>USD chợ đen</h3></a></th>
        //     <td class="text-right">26,840 <span class="d">-110</span></td>
        //     <td class="text-right">26,880 <span class="d">-120</span></td>
        // </tr>

        $('table tr').each((i, el) => {
            const rowHtml = $(el).html();
            // Check if this row is the target
            if (rowHtml && (rowHtml.includes('USD chợ đen') || rowHtml.includes('chợ đen'))) {
                const tds = $(el).find('td.text-right');

                if (tds.length >= 2) {
                    // Method: Get direct text, ignoring child elements (spans)
                    // The number 26,840 is usually a direct text node before the span
                    // .contents() gets all nodes (text + elements). .filter -> text nodes.

                    const extractNumber = (tdElement) => {
                        // Get all text, but we need to be careful of the span
                        // Simplest: Replace all non-digit/dot/comma chars with nothing, 
                        // BUT extracting from full text "26,840 -110" -> "26840110". Bad.
                        // We must remove the span first.
                        const clone = $(tdElement).clone();
                        clone.find('span').remove(); // Remove the daily change span
                        const cleanText = clone.text().trim(); // "26,840"
                        return parseFloat(cleanText.replace(/,/g, ''));
                    };

                    const b = extractNumber(tds[0]);
                    const s = extractNumber(tds[1]);

                    if (!isNaN(b) && !isNaN(s)) {
                        buyPrice = b;
                        sellPrice = s;
                        console.log(`   🎯 Match Found! Buy: ${b} | Sell: ${s}`);
                    }
                }
            }
        });

        if (buyPrice && sellPrice) {
            const today = new Date().toISOString().split('T')[0];

            // Upsert: Store Sell Price as the main "USDVND_BLACK_MARKET"
            // If user wants both lines (Buy/Sell), usage would be complex.
            // For now, let's upsert the SELL price as the primary indicator for charts.

            const rows = [
                {
                    indicator_key: 'USDVND_BLACK_MARKET',
                    date: today,
                    value: sellPrice,
                    source: 'SCRAPER_TYGIAUSD'
                },
                {
                    indicator_key: 'USDVND_BLACK_MARKET_BUY', // Optional secondary key if needed later
                    date: today,
                    value: buyPrice,
                    source: 'SCRAPER_TYGIAUSD'
                }
            ];

            const { error } = await supabase
                .from('macro_indicators')
                .upsert(rows, { onConflict: 'indicator_key, date' });

            if (error) console.error("   ❌ DB Error:", error.message);
            else console.log(`   ✅ Saved Black Market Rate: ${sellPrice} VND (Sell)`);

        } else {
            console.log("   ❌ Could not extract Black Market rates.");
        }

    } catch (e) {
        console.error("   ❌ Scraper Failed:", e.message);
    }
}

if (require.main === module) {
    scrapeBlackMarket();
}

module.exports = { scrapeBlackMarket };
