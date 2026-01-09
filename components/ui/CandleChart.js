'use client';

import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useState, useMemo } from 'react';

// Custom Shape for Candle
// Props received from Recharts Bar (when using dataKey=[low, high])
// x, y, width, height correspond to the [low, high] range on the Y-axis.
const CandleStick = (props) => {
    const { fill, x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;

    // Safety check
    if (open === undefined || close === undefined || high === undefined || low === undefined) return null;

    // Determine color: Green if Close >= Open, Red if Close < Open
    const isUp = close >= open;
    const color = isUp ? '#22c55e' : '#ef4444'; // Green-500 : Red-500
    // Use darker stroke for better visibility? Standard is same color.
    const stroke = color;

    // Calculation Logic:
    // props.y is the pixel position of the TOP value (High).
    // props.height is the pixel height of the range (High - Low).
    // We strictly map values to pixels within this range.

    const totalRange = high - low;
    if (totalRange <= 0) return null; // Avoid division by zero

    // Map a price value to pixel Y coordinate
    // Formula: pixelY = y + height * (High - Value) / (High - Low)
    const getPixelY = (val) => {
        const ratio = (high - val) / totalRange;
        return y + (ratio * height);
    };

    const yHigh = getPixelY(high); // Should be roughly props.y
    const yLow = getPixelY(low);   // Should be roughly props.y + props.height
    const yOpen = getPixelY(open);
    const yClose = getPixelY(close);

    // Body dimensions
    // Body top is the min pixel Y (higher value)
    const bodyTop = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(1, Math.abs(yOpen - yClose)); // Ensure at least 1px

    // Wick X position (centered)
    const wickX = x + width / 2;

    return (
        <g stroke={stroke} fill={color} strokeWidth={1}>
            {/* Wick: Line from High to Low */}
            {/* Split into Top Wick and Bottom Wick to avoid drawing over body? 
                Actually standard is a single line behind or properly layered. 
                Recharts draws SVG order. Let's draw wick first, then body.
            */}
            <line x1={wickX} y1={yHigh} x2={wickX} y2={yLow} />

            {/* Body: Rectangle between Open and Close */}
            {/* Filled rectangle */}
            <rect
                x={x}
                y={bodyTop}
                width={width}
                height={bodyHeight}
                stroke="none"
            />
        </g>
    );
};

// Tooltip tailored for Candle
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isUp = data.close >= data.open;
        const colorClass = isUp ? 'text-green-400' : 'text-red-400';

        return (
            <div className="bg-slate-900/90 border border-slate-700 p-3 rounded shadow-xl text-xs z-50 backdrop-blur-sm">
                <p className="font-bold text-slate-300 mb-2 border-b border-slate-700 pb-1">{label}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <span className="text-slate-400">Open:</span>
                    <span className={`font-mono font-medium ${colorClass}`}>{data.open?.toLocaleString()}</span>

                    <span className="text-slate-400">High:</span>
                    <span className="font-mono text-slate-200">{data.high?.toLocaleString()}</span>

                    <span className="text-slate-400">Low:</span>
                    <span className="font-mono text-slate-200">{data.low?.toLocaleString()}</span>

                    <span className="text-slate-400">Close:</span>
                    <span className={`font-mono font-medium ${colorClass}`}>{data.close?.toLocaleString()}</span>

                    <span className="text-slate-400 mt-2">Volume:</span>
                    <span className="font-mono text-slate-200 mt-2">{data.volume?.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

const resampleData = (data, interval) => {
    if (!data || data.length === 0) return [];
    if (interval === 'day') return data;

    const grouped = {};
    data.forEach(d => {
        const date = new Date(d.date);
        let key;
        if (interval === 'week') {
            const firstDay = new Date(date.setDate(date.getDate() - date.getDay() + 1));
            key = firstDay.toISOString().split('T')[0];
        } else if (interval === 'month') {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        } else {
            key = d.date;
        }

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(d);
    });

    return Object.entries(grouped).map(([date, group]) => {
        group.sort((a, b) => new Date(a.date) - new Date(b.date));
        const open = group[0].open;
        const close = group[group.length - 1].close;
        const high = Math.max(...group.map(g => g.high));
        const low = Math.min(...group.map(g => g.low));
        const volume = group.reduce((sum, g) => sum + (g.volume || 0), 0);
        return { date, open, high, low, close, volume };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export default function CandleChart({
    data,
    chartId, // Still accepted but ShareButton is external now
    height = 500 // Increased default height for better visibility
}) {
    const [range, setRange] = useState('1Y');

    const filteredData = useMemo(() => {
        let cutoffDate = new Date();
        let interval = 'day';

        if (range === '1Y') {
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
            interval = 'day';
        } else if (range === '3Y') {
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 3);
            interval = 'week';
        } else if (range === '5Y') {
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 5);
            interval = 'week';
        } else if (range === '10Y') {
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 10);
            interval = 'month';
        } else if (range === 'ALL') {
            cutoffDate.setFullYear(1900);
            interval = 'month';
        }

        const rawFiltered = data.filter(d => new Date(d.date) >= cutoffDate && d.open && d.close);
        return resampleData(rawFiltered, interval);
    }, [data, range]);

    // Calculate Y domain for Candles (Price)
    const prices = filteredData.flatMap(d => [d.low, d.high]);
    let yDomain = ['auto', 'auto'];
    if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const padding = (maxPrice - minPrice) * 0.05;
        yDomain = [Math.floor(minPrice - padding), Math.ceil(maxPrice + padding)];
    }

    // Calculate Y domain for Volume
    // Goal: Volume bars occupy bottom 15-20% of the chart.
    // Solution: Set Volume Axis max to (MaxVolume * 5).
    const volumes = filteredData.map(d => d.volume || 0);
    const maxVolume = Math.max(...volumes, 1);
    const volumeDomain = [0, maxVolume * 5];

    // Data Transformation for Recharts
    const chartData = filteredData.map(d => ({
        ...d,
        range: [d.low, d.high] // Drives the "Candle" bar vertical span
    }));

    return (
        <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            {/* Header / Controls */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Biểu Đồ Nến</h3>
                </div>

                <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
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
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 10 }}
                            minTickGap={30}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />

                        {/* Right Axis for Price */}
                        <YAxis
                            yAxisId="price"
                            orientation="right"
                            domain={yDomain}
                            stroke="#94a3b8"
                            tick={{ fontSize: 10 }}
                            tickFormatter={v => v.toLocaleString()}
                            axisLine={false}
                            tickLine={false}
                            dx={-5}
                        />

                        {/* Left Axis for Volume (Used to scale volume bars) */}
                        <YAxis
                            yAxisId="volume"
                            orientation="left"
                            domain={volumeDomain}
                            hide={true} // Hidden axis
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeDasharray: '4 4' }} />

                        {/* Volume Bars */}
                        {/* Always rendered at the bottom due to the scaled domain */}
                        <Bar
                            dataKey="volume"
                            yAxisId="volume"
                            barSize={filteredData.length > 150 ? 2 : 6}
                            isAnimationActive={false}
                            shape={(props) => {
                                const { payload, x, y, width, height } = props;
                                const isUp = payload.close >= payload.open;
                                const color = isUp ? '#22c55e' : '#ef4444';
                                // Slight opacity for volume to distinguish from candles
                                return <rect x={x} y={y} width={width} height={height} fill={color} opacity={0.4} />;
                            }}
                        />

                        {/* Candle Stick */}
                        {/* Using transparent Bar with custom shape */}
                        <Bar
                            dataKey="range" // [low, high]
                            yAxisId="price"
                            shape={<CandleStick />}
                            barSize={filteredData.length > 150 ? 4 : 10}
                            isAnimationActive={false}
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
