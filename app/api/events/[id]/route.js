import { getSupabaseClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const supabase = getSupabaseClient();
        const body = await request.json();

        const { data, error } = await supabase
            .from('economic_events')
            .update(body)
            .eq('id', id)
            .select();

        if (error) throw error;

        return NextResponse.json(data[0]);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to update event',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const supabase = getSupabaseClient();

        const { error } = await supabase
            .from('economic_events')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Event deleted' });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to delete event',
            details: error.message
        }, { status: 500 });
    }
}
