
'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useState, useMemo } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl text-xs">
                <p className="font-bold text-slate-300 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="mb-1">
                        {entry.name}: <span className="font-mono">{entry.value.toLocaleString()}</span>
                        {entry.unit && <span className="text-slate-500 ml-1">{entry.unit}</span>}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function MacroChart({
    data,
    title,
    dataKeys = [{ key: 'value', color: '#10b981', name: 'Giá trị' }],
    height = 350,
    syncId = null
}) {
    const [timeRange, setTimeRange] = useState('5Y');
    const [hiddenKeys, setHiddenKeys] = useState([]);

    // Filter Data by Time Range
    const filteredData = useMemo(() => {
        if (timeRange === 'ALL') return data;

        const now = new Date();
        const cutoff = new Date();

        if (timeRange === '1Y') cutoff.setFullYear(now.getFullYear() - 1);
        if (timeRange === '3Y') cutoff.setFullYear(now.getFullYear() - 3);
        if (timeRange === '5Y') cutoff.setFullYear(now.getFullYear() - 5);
        if (timeRange === '10Y') cutoff.setFullYear(now.getFullYear() - 10);
        if (timeRange === '25Y') cutoff.setFullYear(now.getFullYear() - 25);

        return data.filter(d => new Date(d.date) >= cutoff);
    }, [data, timeRange]);

    // Handle Legend Click to Toggle Series
    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setHiddenKeys(prev =>
            prev.includes(dataKey)
                ? prev.filter(k => k !== dataKey)
                : [...prev, dataKey]
        );
    };

    // Determine min/max for better Y-axis scaling based on VISIBLE data
    const activeKeys = dataKeys.filter(k => !hiddenKeys.includes(k.key));
    const allValues = filteredData
        .flatMap(d => activeKeys.map(k => d[k.key]))
        .filter(v => typeof v === 'number' && !isNaN(v)); // Strict number check

    // Auto-scale or default
    let minVal = 0;
    let maxVal = 100;

    if (allValues.length > 0) {
        minVal = Math.min(...allValues);
        maxVal = Math.max(...allValues);
        // Add padding
        const padding = (maxVal - minVal) * 0.05;
        minVal = minVal - padding;
        maxVal = maxVal + padding;

        // If values are close to 0, don't go negative unnecessarily unless data is negative
        if (Math.min(...allValues) >= 0 && minVal < 0) minVal = 0;
    }

    return (
        <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                {title && <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>}

                {/* Time Range Selector */}
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
                    {['1Y', '3Y', '5Y', '10Y', '25Y', 'ALL'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${timeRange === range
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Explicit Height Container for Recharts */}
            <div style={{ width: '100%', height: height, minHeight: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={filteredData}
                        syncId={syncId}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {dataKeys.map((k, i) => (
                                <linearGradient key={i} id={`color${k.key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={k.color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={k.color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 11 }}
                            tickMargin={10}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fontSize: 11 }}
                            domain={[minVal, maxVal]}
                            tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            onClick={handleLegendClick}
                            cursor="pointer"
                        />

                        {dataKeys.map((k, i) => (
                            <Area
                                key={i}
                                type="monotone"
                                dataKey={k.key}
                                stroke={k.color}
                                name={k.name}
                                fill={`url(#color${k.key})`}
                                strokeWidth={2}
                                unit={k.unit || ''}
                                hide={hiddenKeys.includes(k.key)}
                                animationDuration={500}
                                connectNulls={true}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
