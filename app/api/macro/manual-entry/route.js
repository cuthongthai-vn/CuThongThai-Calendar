import { getSupabaseClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/macro/manual-entry
 * Admin endpoint for adding daily macro data manually.
 * Request Body:
 * {
 *   "date": "2025-01-08",
 *   "items": [
 *      { "key": "USDVND_BLACK_MARKET", "value": 25500 },
 *      { "key": "USDVND_OFFICIAL", "value": 24500 }
 *   ]
 * }
 * OR flat format:
 * {
 *   "indicator_key": "USDVND_BLACK_MARKET",
 *   "date": "2025-01-08",
 *   "value": 25500,
 *   "text_content": "Optional text"
 * }
 */
export async function POST(request) {
    try {
        const supabase = getSupabaseClient();
        const body = await request.json();

        let rows = [];

        if (body.items && Array.isArray(body.items)) {
            // Old format (items array)
            rows = body.items.map(item => ({
                indicator_key: item.key,
                date: body.date,
                value: Number(item.value),
                source: 'MANUAL_ADMIN'
            }));
        } else if (body.indicator_key) {
            // New flat format from MacroUpdateModal
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
        return NextResponse.json({
            error: 'Failed to insert macro data',
            details: e.message
        }, { status: 500 });
    }
}
