const fs = require('fs');
const path = require('path');

// Key Milestones (Approximate real info)
const MILESTONES = [
    { date: '2000-07-28', val: 100 },
    { date: '2001-06-25', val: 571 },
    { date: '2002-01-01', val: 200 },
    { date: '2003-01-01', val: 180 },
    { date: '2004-01-01', val: 230 },
    { date: '2006-01-01', val: 300 },
    { date: '2007-03-12', val: 1170 }, // Peak
    { date: '2008-01-01', val: 920 },
    { date: '2008-06-01', val: 370 }, // Crash
    { date: '2009-02-24', val: 235 }, // Bottom
    { date: '2009-10-01', val: 624 },
    { date: '2016-01-01', val: 560 }, // Sideways years
    { date: '2018-04-09', val: 1204 }, // Peak 2018
    { date: '2020-01-01', val: 960 },
    { date: '2020-03-24', val: 650 }, // Covid
    { date: '2020-12-31', val: 1100 },
    { date: '2022-01-06', val: 1528 }, // ATH
    { date: '2022-11-16', val: 911 }, // Crisis
    { date: '2023-12-31', val: 1129 },
    { date: '2024-12-31', val: 1350 }, // Strong 2024
    { date: '2025-12-31', val: 1750 }, // Strong 2025 
    { date: '2026-01-08', val: 1850 }  // User provided
];

const VOLUME_MILESTONES = [
    { date: '2000-07-28', val: 10000 },       // Very low start
    { date: '2006-01-01', val: 5000000 },     // 5M shares
    { date: '2008-01-01', val: 20000000 },    // 20M shares
    { date: '2016-01-01', val: 100000000 },   // 100M shares
    { date: '2020-01-01', val: 300000000 },   // 300M shares
    { date: '2022-01-01', val: 1000000000 },  // 1B shares boom
    { date: '2023-01-01', val: 600000000 },   // Low liquidity
    { date: '2026-01-08', val: 900000000 }    // Current levels
];

// Helper to get volume at a specific date
function getInterpolatedVolume(date) {
    const d = new Date(date);
    for (let i = 0; i < VOLUME_MILESTONES.length - 1; i++) {
        const start = VOLUME_MILESTONES[i];
        const end = VOLUME_MILESTONES[i + 1];
        if (d >= new Date(start.date) && d <= new Date(end.date)) {
            const totalTime = new Date(end.date) - new Date(start.date);
            const progress = (d - new Date(start.date)) / totalTime;
            // Volume noise is huge
            const base = start.val + (end.val - start.val) * progress;
            const noise = (Math.random() * 0.4 - 0.2) * base; // +/- 20%
            return Math.max(0, Math.floor(base + noise));
        }
    }
    return 100000000; // Fallback
}


function generateDaily() {
    let rows = ['Date,Close,Open,High,Low,Volume'];

    for (let i = 0; i < MILESTONES.length - 1; i++) {
        const start = MILESTONES[i];
        const end = MILESTONES[i + 1];

        const startDate = new Date(start.date);
        const endDate = new Date(end.date);
        const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

        const valDiff = end.val - start.val;

        for (let d = 0; d < days; d++) {
            // Linear Progress
            const progress = d / days;

            // SMOOTHER LINE
            const baseVal = start.val + (valDiff * progress);
            const close = baseVal + (Math.random() - 0.5) * (baseVal * 0.005);

            // Mock OHLC around Close
            // Open is usually previous Close (simplified: close +/- random)
            const open = close + (Math.random() - 0.5) * (close * 0.015);

            // High is max of open/close + margin
            const maxBody = Math.max(open, close);
            const high = maxBody + Math.random() * (close * 0.01);

            // Low is min of open/close - margin
            const minBody = Math.min(open, close);
            const low = minBody - Math.random() * (close * 0.01);

            // Format Date
            const curDate = new Date(startDate);
            curDate.setDate(startDate.getDate() + d);
            const dateStr = curDate.toISOString().split('T')[0];

            const vol = getInterpolatedVolume(dateStr);

            rows.push(`${dateStr},${close.toFixed(2)},${open.toFixed(2)},${high.toFixed(2)},${low.toFixed(2)},${vol}`);
        }
    }

    // Add last point
    const last = MILESTONES[MILESTONES.length - 1];
    const lastVol = getInterpolatedVolume(last.date);
    // Fake OHLC for last point too
    const lastClose = last.val;
    const lastOpen = lastClose * 0.99;
    const lastHigh = lastClose * 1.01;
    const lastLow = lastClose * 0.98;

    rows.push(`${last.date},${lastClose},${lastOpen},${lastHigh},${lastLow},${lastVol}`);

    return rows.join('\n');
}

const csvContent = generateDaily();
const outPath = path.join(__dirname, '../../data_upload/vietnam-vnindex-history-daily-interpolated.csv');
fs.writeFileSync(outPath, csvContent);
console.log(`✅ Generated ${MILESTONES.length} period interpolated CSV at: ${outPath}`);
