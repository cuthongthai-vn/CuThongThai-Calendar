'use client';

import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'; // Removed unused imports
import { useState, useMemo } from 'react';

// Custom Shape for Candle
const CandleStick = (props) => {
    const { x, y, width, height, low, high, open, close } = props;
    const isUp = close > open;
    const color = isUp ? '#22c55e' : '#ef4444'; // Green : Red

    // Calculate Y positions
    // Recharts validates coordinates, but we need to map values to pixels manually
    // ACTUALLY: Custom shape receives normalized X, Y, Height, Width from specific data points
    // BUT for Candle, we need access to the Axis scale to plot High/Low.
    // Recharts "Bar" usually passes `y` as the top of the bar.

    // Better approach: Use "ErrorBar" or just SVG lines if we have the scale.
    // However, getting scale inside Shape is hard.

    // ALTERNATIVE: Use 2 Bars? No.
    // BEST PRACTICE with Recharts: Pass the coordinate converter or calculate locally?
    // Simplified:
    // props.y is the top of the bar (max value)
    // props.height is the height of the bar.

    // Let's use simpler logic:
    // Pass high/low/open/close as data.
    // We need the Y-Axis scale function, which Recharts passes to CustomShape if used in <Bar shape={...} />? Not directly.

    // WORKAROUND:
    // Input data for Bar: [min(open, close), max(open, close)]
    // This draws the "Body".
    // Then we draw the "Wick" using High/Low.
    // We need pixel coordinates for High and Low.

    // Fortunately, Recharts passes `yAxis` to the shape if connected? No.

    // Let's defer to a proven method:
    // Use `Bar` for the body.
    // BUT we need floating bars (open to close). Recharts Bar supports [min, max] data since v2!
    // So `dataKey="bodyArray"` where bodyArray = [min(o,c), max(o,c)]

    // What about Wicks?
    // Use `ErrorBar`? Or another `Bar` with very thin width?
    // Or just SVG lines inside the Custom Shape.

    // Let's try the Custom Shape on a Bar that spans Low to High (invisible) or something?

    // TRICK:
    // 1. Data point has `high`, `low`, `open`, `close`.
    // 2. We use a Bar to define the generic X/Y range or just use it as a container.
    // 3. Current Recharts `CustomShape` receives `formattedGraphicalItem`?

    // SIMPLIFIED IMPLEMENTATION:
    // We will just calculate pixels manually relative to the Bar's layout if possible,
    // OR, more reliably, use the `y` and `height` provided by Recharts which correspond to the `dataKey` value.

    // Let's assume we map the "Body" to the Bar.
    // But we need the wicks.

    // Let's try straightforward SVG math.
    const { yAxis } = props; // Recharts < 2.x doesn't reliably pass axis.

    // If we assume props.y and props.height correspond to the value passed to dataKey.
    // If we pass [low, high] to dataKey, then y is top (high), height is distance (high-low).
    // Then we can interpolate open/close relative to that.

    if (!props.payload) return null;
    const { open: o, close: c, high: h, low: l } = props.payload;

    // Calculate ratio
    const totalRange = h - l;
    if (totalRange === 0) return null;

    const pixelHeight = height;
    const pixelY = y; // Top (High)

    const scaleY = (val) => {
        // Linear map: h -> pixelY, l -> pixelY + pixelHeight
        const ratio = (h - val) / totalRange;
        return pixelY + (ratio * pixelHeight);
    };

    const yOpen = scaleY(o);
    const yClose = scaleY(c);
    const yHigh = scaleY(h);
    const yLow = scaleY(l);

    const bodyTop = Math.min(yOpen, yClose);
    const bodyBottom = Math.max(yOpen, yClose);
    const bodyHeight = Math.max(1, bodyBottom - bodyTop); // Min 1px

    return (
        <g>
            {/* Wick */}
            <line x1={x + width / 2} y1={yHigh} x2={x + width / 2} y2={yLow} stroke={color} strokeWidth={1} />
            {/* Body */}
            <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} />
        </g>
    );
};

// Tooltip tailored for Candle
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // payload[0] is usually the candle data if we hover it
        const data = payload[0].payload;
        const color = data.close >= data.open ? 'text-green-400' : 'text-red-400';
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs z-50">
                <p className="font-bold text-slate-300 mb-2">{label}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-slate-500">Open:</span>
                    <span className={`font-mono ${color}`}>{data.open?.toLocaleString()}</span>

                    <span className="text-slate-500">High:</span>
                    <span className="font-mono text-slate-200">{data.high?.toLocaleString()}</span>

                    <span className="text-slate-500">Low:</span>
                    <span className="font-mono text-slate-200">{data.low?.toLocaleString()}</span>

                    <span className="text-slate-500">Close:</span>
                    <span className={`font-mono ${color}`}>{data.close?.toLocaleString()}</span>

                    <span className="text-slate-500 mt-2">Volume:</span>
                    <span className="font-mono text-slate-200 mt-2">{data.volume?.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function CandleChart({
    data, // Expected: { date, open, high, low, close, volume }[]
    height = 400
}) {
    const [range, setRange] = useState('1Y');

    // Filter Data Logic (Duplicate logic from MacroChart, simplified)
    const filteredData = useMemo(() => {
        let cutoff = new Date('1900-01-01');
        const now = new Date();
        const cutoffDate = new Date();

        if (range === '1Y') cutoffDate.setFullYear(now.getFullYear() - 1);
        if (range === '3Y') cutoffDate.setFullYear(now.getFullYear() - 3);
        if (range === '5Y') cutoffDate.setFullYear(now.getFullYear() - 5);
        if (range === '10Y') cutoffDate.setFullYear(now.getFullYear() - 10);
        if (range === 'ALL') cutoffDate.setFullYear(1900);

        return data.filter(d => new Date(d.date) >= cutoffDate && d.open && d.close); // Valid candle only
    }, [data, range]);

    // Calculate Y domain for Candles (Price)
    // We want some padding
    const prices = filteredData.flatMap(d => [d.low, d.high]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.05;
    const yDomain = [Math.floor(minPrice - padding), Math.ceil(maxPrice + padding)];

    // Data Transformation for Recharts
    // We need a specific dataKey that holds [min, max] for the invisible bar that drives the scale logic
    const chartData = filteredData.map(d => ({
        ...d,
        range: [d.low, d.high]
    }));

    return (
        <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            {/* Header / Controls */}
            <div className="flex justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Biểu Đồ Nến</h3>
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
                    {/* Share Button */}
                    {/* Need chartId prop first, assumed passed */}
                    <button
                        onClick={() => {
                            const url = `${window.location.origin}${window.location.pathname}?chart=vnindex`; // Hardcoded for now as it's the only one using Candle

                            if (navigator.share) {
                                navigator.share({
                                    title: 'Biểu Đồ VNINDEX',
                                    url: url
                                }).catch(console.error);
                            } else {
                                navigator.clipboard.writeText(url);
                                alert('Đã copy link: ' + url);
                            }
                        }}
                        className="px-2 py-1 text-slate-500 hover:text-blue-400 transition-colors border-r border-slate-700 mr-1"
                        title="Chia sẻ"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.287.696.345 1.074.059.378.044.76-.042 1.135l-2.471 5.925M7.5 12a2.3 2.3 0 0 0 .5-1.5m-5.409 6.273a2.25 2.25 0 1 1 3.182-3.182m-3.182 3.182c.324.18.696.287 1.074.345.378.059.76.044 1.135-.042l5.925-2.471m-6.273-5.409A2.25 2.25 0 0 1 12 7.5m2.273 5.409-2.273-5.409a2.25 2.25 0 0 1 5.409 2.273 2.25 2.25 0 0 1-5.409 2.273" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </button>
                    {['1Y', '3Y', '5Y', '10Y', 'ALL'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${range === r ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 11 }}
                            minTickGap={30}
                        />
                        {/* Right Axis for Price */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={yDomain}
                            stroke="#94a3b8"
                            tick={{ fontSize: 11 }}
                            tickFormatter={v => v.toLocaleString()}
                        />
                        {/* Left Axis for Volume (Hidden/Subtle) */}
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            hide={true} // or show minimal
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Volume Bars */}
                        {/* We want Volume to be roughly 20-30% of height at bottom */}
                        {/* Recharts doesn't strictly stack axis easily on same chart without "height" hacks. */}
                        {/* Simple way: Put volume on separate axis with huge max domain so they look small */}

                        <Bar
                            dataKey="volume"
                            yAxisId="left"
                            barSize={filteredData.length > 100 ? 3 : 8}
                            shape={(props) => {
                                // Color volume based on Price action
                                const { payload, x, y, width, height } = props;
                                const isUp = payload.close >= payload.open;
                                return <rect x={x} y={y} width={width} height={height} fill={isUp ? '#22c55e' : '#ef4444'} opacity={0.3} />;
                            }}
                        />

                        {/* Candle Stick using Custom Shape Bar */}
                        {/* Logic: dataKey range=[low, high] ensures the Bar covers the full wick area vertically */}
                        <Bar
                            dataKey="range"
                            yAxisId="right"
                            shape={<CandleStick />}
                            barSize={filteredData.length > 100 ? 4 : 10}
                            isAnimationActive={false} // Performance
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
