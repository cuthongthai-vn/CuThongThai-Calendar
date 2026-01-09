import { getSupabaseClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('economic_events')
            .select('*')
            .order('event_time', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch events',
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const supabase = getSupabaseClient();
        const body = await request.json();

        const { data, error } = await supabase
            .from('economic_events')
            .insert([body])
            .select();

        if (error) throw error;

        return NextResponse.json(data[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to create event',
            details: error.message
        }, { status: 500 });
    }
}
