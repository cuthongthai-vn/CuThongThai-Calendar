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
    { date: '2025-12-31', val: 1680 }, // Boom 2025
    { date: '2026-01-10', val: 1720 }  // Now
];

function generateDaily() {
    let rows = ['Date,Close'];

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

            // Random Walk Noise (Daily volatility ~ 0.5% - 1.5%)
            // We want the overall trend to match, but look jagged
            const baseVal = start.val + (valDiff * progress);
            const noise = (Math.random() - 0.5) * (baseVal * 0.02); // +/- 1% noise

            let val = baseVal + noise;

            // Format Date
            const curDate = new Date(startDate);
            curDate.setDate(startDate.getDate() + d);
            const dateStr = curDate.toISOString().split('T')[0];

            rows.push(`${dateStr},${val.toFixed(2)}`);
        }
    }

    // Add last point
    const last = MILESTONES[MILESTONES.length - 1];
    rows.push(`${last.date},${last.val}`);

    return rows.join('\n');
}

const csvContent = generateDaily();
const outPath = path.join(__dirname, '../../data_upload/vietnam-vnindex-history-daily-interpolated.csv');
fs.writeFileSync(outPath, csvContent);
console.log(`✅ Generated ${MILESTONES.length} period interpolated CSV at: ${outPath}`);
