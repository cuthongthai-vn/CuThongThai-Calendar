/**
 * Custom error classes and error handling utilities
 */

/**
 * API Error class with status code and details
 */
export class APIError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

/**
 * Database Error class
 */
export class DatabaseError extends APIError {
    constructor(message, details = null) {
        super(message, 500, details);
        this.name = 'DatabaseError';
    }
}

/**
 * Validation Error class
 */
export class ValidationError extends APIError {
    constructor(message, details = null) {
        super(message, 400, details);
        this.name = 'ValidationError';
    }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends APIError {
    constructor(resource, id = null) {
        const message = id
            ? `${resource} with ID ${id} not found`
            : `${resource} not found`;
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Handle and format API errors for consistent response
 * @param {Error} error - The error to handle
 * @returns {Object} Formatted error response
 */
export function handleAPIError(error) {
    // Known API errors
    if (error instanceof APIError) {
        return {
            error: error.message,
            statusCode: error.statusCode,
            details: error.details
        };
    }

    // Supabase errors
    if (error.message?.includes('supabase')) {
        console.error('[Supabase Error]', error);
        return {
            error: 'Đã có lỗi khi truy cập database',
            statusCode: 500,
            details: process.env.NODE_ENV !== 'production' ? error.message : null
        };
    }

    // Unexpected errors
    console.error('[Unexpected Error]', error);
    return {
        error: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
        statusCode: 500,
        details: process.env.NODE_ENV !== 'production' ? error.stack : null
    };
}
