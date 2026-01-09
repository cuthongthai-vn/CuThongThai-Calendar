import { createClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase client for server-side usage
 * This centralizes all database connections and enables connection pooling
 */
let supabaseClient = null;

/**
 * Get or create the Supabase client instance
 * @returns {import('@supabase/supabase-js').SupabaseClient} Supabase client
 * @throws {Error} If environment variables are missing
 */
export function getSupabaseClient() {
    if (!supabaseClient) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error(
                'Missing Supabase credentials. Please check your .env file. ' +
                'Required: SUPABASE_URL and SUPABASE_KEY'
            );
        }

        supabaseClient = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false // Server-side doesn't need session persistence
            },
            global: {
                headers: {
                    'x-app-name': 'CuThongThai-Calendar',
                    'x-client-info': 'server-centralized'
                }
            }
        });
    }

    return supabaseClient;
}

/**
 * Reset the client (useful for testing or environment changes)
 */
export function resetSupabaseClient() {
    supabaseClient = null;
}
