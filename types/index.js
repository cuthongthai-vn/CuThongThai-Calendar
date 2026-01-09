/**
 * @typedef {Object} EconomicEvent
 * @property {string} id - UUID
 * @property {string} event_name - Event name (English)
 * @property {string} event_time - ISO timestamp
 * @property {string} country - Country code (US, VN, CN)
 * @property {number|null} actual - Actual value
 * @property {number|null} forecast - Forecasted value
 * @property {number|null} previous - Previous value
 * @property {'High'|'Medium'|'Low'} impact_level - Impact level
 * @property {string|null} ai_commentary - AI-generated commentary
 * @property {'bullish'|'bearish'|'neutral'|null} ai_sentiment - AI sentiment
 * @property {string|null} vn_impact - Vietnam-specific impact analysis
 * @property {string|null} translated_name - Vietnamese translation
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} MacroIndicator
 * @property {string} indicator_key - Indicator identifier (e.g., 'VNINDEX', 'USDVND_OFFICIAL')
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {number|null} value - Numeric value
 * @property {string|null} text_content - Optional text content
 * @property {string} source - Data source (e.g., 'MANUAL_ADMIN', 'VND_DIRECT')
 * @property {string} created_at - Creation timestamp
 */

/**
 * @typedef {Object} ChartDataPoint
 * @property {string} date - Date string
 * @property {number} [value] - Generic value
 * @property {number} [official] - Official USD/VND rate
 * @property {number} [black_market] - Black market rate
 * @property {number} [gdp] - GDP growth %
 * @property {number} [cpi] - CPI inflation %
 * @property {number} [vnindex] - VNINDEX value
 * @property {number} [volume] - Trading volume
 */

/**
 * @typedef {Object} CandlestickData
 * @property {string} date - Date in YYYY-MM-DD
 * @property {number} open - Opening price
 * @property {number} high - Highest price
 * @property {number} low - Lowest price
 * @property {number} close - Closing price
 * @property {number} volume - Trading volume
 */

/**
 * @typedef {Object} AIAnalysisResult
 * @property {string} commentary - AI-generated commentary
 * @property {'bullish'|'bearish'|'neutral'} sentiment - Market sentiment
 * @property {string} vn_impact - Vietnam-specific impact
 * @property {string} translated_name - Vietnamese event name
 */

/**
 * @typedef {Object} SupabaseClient
 * @property {Function} from - Query builder
 * @property {Function} rpc - RPC call
 */

/**
 * @typedef {Object} APIError
 * @property {string} error - Error message
 * @property {number} statusCode - HTTP status code
 * @property {*} [details] - Additional error details
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string} [indicatorKeys] - OR filter for indicator_key
 * @property {string} [dateFrom] - Minimum date
 * @property {string} [dateTo] - Maximum date
 */

/**
 * @typedef {Object} EventQueryOptions
 * @property {string} [orderBy] - Field to order by
 * @property {boolean} [ascending] - Sort ascending
 * @property {number} [limit] - Result limit
 */

export { };
