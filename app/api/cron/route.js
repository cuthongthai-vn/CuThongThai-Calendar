import { NextResponse } from 'next/server';
import { checkSchedule } from '../../../src/scheduler';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(request) {
    // Security: Validate a secret key if needed (skip for MVP)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

    try {
        const result = await checkSchedule();

        // Auto-run Macro Sync (GDP/CPI/Gold/Forex) & Black Market Scraper
        try {
            console.log("🔄 [Cron] Starting Auto-sync...");
            // Use dynamic import or require
            const { runMacroSync } = require('../../../src/macro_fetcher');
            const { scrapeBlackMarket } = require('../../../src/scraper_black_market');

            const results = await Promise.allSettled([
                runMacroSync(),
                scrapeBlackMarket()
            ]);

            results.forEach((res, index) => {
                const jobName = index === 0 ? 'Macro Sync' : 'Black Market Scraper';
                if (res.status === 'fulfilled') {
                    console.log(`   ✅ ${jobName} Success`);
                } else {
                    console.error(`   ❌ ${jobName} Failed:`, res.reason);
                }
            });

        } catch (err) {
            console.error("❌ Cron Auto-Sync System Error:", err);
        }

        return NextResponse.json({
            message: 'Cron executed',
            scheduler: result
        }, { status: 200 });
    } catch (error) {
        console.error("Cron Fatal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
