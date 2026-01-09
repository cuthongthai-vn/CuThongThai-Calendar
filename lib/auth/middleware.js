import { NextResponse } from 'next/server';

/**
 * Authentication middleware for protecting API routes
 * Wraps API route handlers to require authentication for mutations (POST, PUT, DELETE)
 * GET requests are allowed without authentication (public read access)
 * 
 * Usage:
 * export const POST = withAuth(async (request) => { ... });
 */
export function withAuth(handler) {
    return async (request, context) => {
        // Skip auth for GET requests (public read access)
        if (request.method === 'GET') {
            return handler(request, context);
        }

        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || token !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { error: 'Unauthorized - Valid API key required for this operation' },
                { status: 401 }
            );
        }

        return handler(request, context);
    };
}

/**
 * Cron job authentication middleware
 * Verifies the cron secret from Vercel/cron service
 */
export function withCronAuth(handler) {
    return async (request, context) => {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || token !== process.env.CRON_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid cron secret' },
                { status: 401 }
            );
        }

        return handler(request, context);
    };
}
