
/**
 * debug_fmp_calendar.js
 * Inspects what FMP returns for Vietnam in the last 1 year to check for Interest Rates.
 */
require('dotenv').config();

const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

async function fetchRawCalendar() {
    const today = new Date();
    const rangeAgo = new Date(); // Re-use invalidates const, so I should just initialize it once properly.
    // Actually, I can just replace the whole block to be clean.
    const startRange = new Date();
    startRange.setMonth(today.getMonth() - 3);

    const fromStr = startRange.toISOString().split('T')[0];
    const toStr = today.toISOString().split('T')[0];

    // Use 'stable' endpoint
    const url = `${FMP_BASE_URL}/economic-calendar?from=${fromStr}&to=${toStr}&apikey=${FMP_API_KEY}`;

    console.log(`Fetching: ${url.replace(FMP_API_KEY, 'HIDDEN')}`);

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Filter VN
        const vnEvents = data.filter(e => e.country === 'VN' || e.currency === 'VND' || e.event.includes('Vietnam'));

        console.log(`Found ${vnEvents.length} Vietnam events.`);

        // Group by event name to see what's available
        const eventTypes = {};
        vnEvents.forEach(e => {
            if (!eventTypes[e.event]) eventTypes[e.event] = { count: 0, lastDate: e.date, sampleVal: e.actual };
            eventTypes[e.event].count++;
            if (e.date > eventTypes[e.event].lastDate) {
                eventTypes[e.event].lastDate = e.date;
                eventTypes[e.event].sampleVal = e.actual;
            }
        });

        console.table(eventTypes);

    } catch (e) {
        console.error(e);
    }
}

fetchRawCalendar();
