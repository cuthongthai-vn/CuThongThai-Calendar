import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Service layer for macro indicators data
 * Centralizes data fetching logic and provides reusable functions
 */

/**
 * Fetch macro indicators with optional filters
 * @param {import('../../types').FilterOptions} [filters={}] - Filter options
 * @returns {Promise<import('../../types').MacroIndicator[]>} Array of macro indicator records
 * @throws {Error} If database query fails
 */
export async function getMacroIndicators(filters = {}) {
    const supabase = getSupabaseClient();

    let query = supabase
        .from('macro_indicators')
        .select('*')
        .order('date', { ascending: true });

    if (filters.indicatorKeys) {
        query = query.or(filters.indicatorKeys);
    }

    if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
    }

    if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch macro indicators: ${error.message}`);
    }

    return data || [];
}

/**
 * Fetch all economic events
 * @param {import('../../types').EventQueryOptions} [options={}] - Query options
 * @returns {Promise<import('../../types').EconomicEvent[]>} Array of economic events
 * @throws {Error} If database query fails
 */
export async function getEconomicEvents(options = {}) {
    const supabase = getSupabaseClient();

    const {
        orderBy = 'event_time',
        ascending = false,
        limit = null
    } = options;

    let query = supabase
        .from('economic_events')
        .select('*')
        .order(orderBy, { ascending });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return data || [];
}

/**
 * Fetch a single event by ID
 * @param {string} eventId - Event UUID
 * @returns {Promise<import('../../types').EconomicEvent>} Event record
 * @throws {Error} If event not found or query fails
 */
export async function getEventById(eventId) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from('economic_events')
        .select('*')
        .eq('id', eventId)
        .single();

    if (error) {
        throw new Error(`Failed to fetch event ${eventId}: ${error.message}`);
    }

    return data;
}

/**
 * Update an event record
 * @param {string} eventId - Event UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated event
 */
export async function updateEvent(eventId, updates) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from('economic_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update event ${eventId}: ${error.message}`);
    }

    return data;
}

/**
 * Upsert macro indicator data
 * @param {Array} rows - Array of indicator records to upsert
 * @returns {Promise<Object>} Upsert result
 */
export async function upsertMacroIndicators(rows) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from('macro_indicators')
        .upsert(rows, { onConflict: 'indicator_key, date' });

    if (error) {
        throw new Error(`Failed to upsert macro indicators: ${error.message}`);
    }

    return { success: true, count: rows.length };
}
