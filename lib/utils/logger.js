/**
 * Environment-aware logging utility
 * Prevents debug logs in production while maintaining error logging
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDebugEnabled = process.env.DEBUG === 'true';

export const logger = {
    /**
     * Debug logs - only shown in development or when DEBUG=true
     */
    log: (...args) => {
        if (!isProduction || isDebugEnabled) {
            console.log(...args);
        }
    },

    /**
     * Error logs - always shown
     */
    error: (...args) => {
        console.error(...args);
    },

    /**
     * Debug logs - only shown when DEBUG=true explicitly set
     */
    debug: (...args) => {
        if (isDebugEnabled) {
            console.log('[DEBUG]', ...args);
        }
    },

    /**
     * Warning logs - shown in all environments
     */
    warn: (...args) => {
        console.warn(...args);
    },

    /**
     * Info logs - only shown in non-production
     */
    info: (...args) => {
        if (!isProduction) {
            console.info(...args);
        }
    }
};
