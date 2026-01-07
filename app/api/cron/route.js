import { NextResponse } from 'next/server';
import { checkSchedule } from '../../../src/scheduler';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(request) {
    // Security: Validate a secret key if needed (skip for MVP)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

    try {
        const result = await checkSchedule();

        // Auto-run Macro Sync (GDP/CPI) & Black Market Scraper
        // We run these "fire and forget" or await them depending on timeout limits.
        // For Vercel Hobby (10s limit), best to await but catch errors so main cron doesn't fail.
        try {
            const { runMacroSync } = require('../../../src/macro_fetcher');
            const { scrapeBlackMarket } = require('../../../src/scraper_black_market');

            console.log("🔄 Auto-syncing Macro Data...");
            await Promise.allSettled([
                runMacroSync(),
                scrapeBlackMarket()
            ]);
        } catch (err) {
            console.error("❌ Macro Auto-Sync Failed:", err);
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
