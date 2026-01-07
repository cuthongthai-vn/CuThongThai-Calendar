const https = require('https');

const API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
// Get dates for last month (Historical test for Sparklines)
const today = new Date();
const lastMonth = new Date(today);
lastMonth.setMonth(today.getMonth() - 1);

const fromDate = lastMonth.toISOString().split('T')[0];
const toDate = today.toISOString().split('T')[0];

const url = `https://financialmodelingprep.com/stable/economic-calendar?from=${fromDate}&to=${toDate}&apikey=${API_KEY}`;

console.log(`Fetching data from: ${url.replace(API_KEY, 'HIDDEN')}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const events = JSON.parse(data);
            if (Array.isArray(events)) {
                console.log(`Successfully fetched ${events.length} events.`);

                // Filter for Vietnam, US, China
                // Filter for Vietnam, US, China AND actual value exists
                const countries = ['VN', 'US', 'CN', 'Vietnam', 'United States', 'China'];
                const relevantEvents = events.filter(e => countries.includes(e.country) && e.actual !== null);

                console.log(`Found ${relevantEvents.length} events for US, VN, CN with data.`);
                if (relevantEvents.length > 0) {
                    console.log('Sample event with data:', JSON.stringify(relevantEvents[0], null, 2));
                } else {
                    // Let's print unique countries found to debug
                    const foundCountries = [...new Set(events.map(e => e.country))];
                    console.log("Countries found in response:", foundCountries.slice(0, 20));
                }

            } else {
                console.log('Response is not an array:', data.substring(0, 200));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data.substring(0, 200));
        }
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err);
});
