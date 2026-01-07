/**
 * logic_processor.js
 * Core logic for handling economic data comparisons and basic sentiment analysis.
 */

// Utility to clean numeric strings (e.g., "105.4K" -> 105.4)
function parseEconomicValue(valueStr) {
    if (!valueStr || typeof valueStr !== 'string') return null;
    
    // Simple parser: remove commas, %, etc. Keep dots and minus.
    // Enhanced to handle 'K', 'M', 'B' suffixes if necessary, 
    // but usually calendars provide raw numbers or consistent strings.
    // For now, simple regex stripping.
    const cleanStr = valueStr.replace(/[^0-9.-]/g, '');
    const val = parseFloat(cleanStr);
    return isNaN(val) ? null : val;
}

/**
 * Compares Actual vs Forecast to determine deviation.
 * @param {Object} event - Event object containing forecast and actual strings.
 * @returns {Object} Result containing deviation info.
 */
function compareEventData(event) {
    const { event_name, forecast, actual, previous } = event;

    const forecastVal = parseEconomicValue(forecast);
    const actualVal = parseEconomicValue(actual);
    const previousVal = parseEconomicValue(previous);

    // If data is missing
    if (actualVal === null || forecastVal === null) {
        return {
            status: "WAITING_FOR_DATA",
            deviation: null,
            sentiment: "NEUTRAL",
            details: "Missing forecast or actual data"
        };
    }

    const deviation = actualVal - forecastVal;
    
    // Calculate percentage deviation if needed
    const deviationPercent = forecastVal !== 0 ? (deviation / Math.abs(forecastVal)) * 100 : 0;

    // Determine basic sentiment (This is naive and needs event-specific rules)
    // E.g., For CPI: Actual > Forecast => Bearish for Stocks/Bullish for Currency (Inflation up)
    // E.g., For GDP: Actual > Forecast => Bullish for Currency
    
    // For now, we return the raw deviation direction
    let direction = "EQUAL";
    if (deviation > 0) direction = "HIGHER";
    if (deviation < 0) direction = "LOWER";

    return {
        status: "COMPLETED",
        forecast: forecastVal,
        actual: actualVal,
        deviation_absolute: deviation,
        deviation_percent: deviationPercent.toFixed(2) + '%',
        direction: direction,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generates a prompt for the AI based on the event data.
 */
function generateAIPrompt(event, analysisResult) {
    return `
    Analyze the following economic event:
    Event: ${event.event_name}
    Currency: ${event.currency}
    Forecast: ${event.forecast}
    Actual: ${event.actual}
    Deviation: ${analysisResult.direction} (${analysisResult.deviation_absolute})
    
    Task: Explain the potential impact of this result on:
    1. The ${event.currency} currency strength.
    2. The Vietnamese market (VNI index and USD/VND exchange rate).
    Keep it concise and actionable for a trader.
    `;
}

module.exports = {
    parseEconomicValue,
    compareEventData,
    generateAIPrompt
};
