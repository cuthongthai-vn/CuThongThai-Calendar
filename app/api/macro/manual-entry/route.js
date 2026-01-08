
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY // Using available key from env
);

/**
 * POST /api/macro/manual-entry
 * Secret Admin Endpoint to adding daily data.
 * Request Body:
 * {
 *   "date": "2025-01-08",
 *   "items": [
 *      { "key": "USDVND_BLACK_MARKET", "value": 25500 },
 *      { "key": "USDVND_OFFICIAL", "value": 24500 }
 *   ],
 *   "secret": "..."
 * }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        // Support both old Format (items array) or new Flat Format (indicator_key)

        let rows = [];

        if (body.items && Array.isArray(body.items)) {
            // Old format
            rows = body.items.map(item => ({
                indicator_key: item.key,
                date: body.date,
                value: Number(item.value),
                source: 'MANUAL_ADMIN'
            }));
        } else if (body.indicator_key) {
            // New Flat Format from MacroUpdateModal
            const { indicator_key, date, value, text_content } = body;
            rows = [{
                indicator_key,
                date,
                value: value ? Number(value) : null,
                text_content: text_content || null,
                source: 'MANUAL_ADMIN'
            }];
        } else {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const { error } = await supabase
            .from('macro_indicators')
            .upsert(rows, { onConflict: 'indicator_key, date' });

        if (error) {
            console.error("Manual Upsert Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, inserted: rows.length });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
