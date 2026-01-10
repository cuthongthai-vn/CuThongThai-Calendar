
'use client';

import {
    ComposedChart,
    Area,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useState, useMemo } from 'react';

const CustomTooltip = ({ active, payload, label, dataKeysConfig }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl text-xs">
                <p className="font-bold text-slate-300 mb-2">{label}</p>
                {payload.map((entry, index) => {
                    const config = dataKeysConfig?.find(k => k.key === entry.dataKey);

                    // Logic: If originalValueKey exists, show THAT value (e.g. Rate), otherwise show plotted value
                    const rawVal = config?.originalValueKey
                        ? payload[0].payload[config.originalValueKey]
                        : entry.value;

                    // Format number: 2 decimals + thousand separator
                    const displayVal = typeof rawVal === 'number'
                        ? rawVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : rawVal;
                    const displayUnit = config?.originalValueKey
                        ? (config.originalUnit || '')
                        : entry.unit;

                    return (
                        <p key={index} style={{ color: entry.color }} className="mb-1">
                            {entry.name}: <span className="font-mono">{displayVal}</span>
                            {displayUnit && <span className="text-slate-500 ml-1">{displayUnit}</span>}
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

export default function MacroChart({
    data,
    title,
    chartId, // Add chartId here
    dataKeys = [{ key: 'value', color: '#10b981', name: 'Giá trị', type: 'area' }],
    height = 350,
    syncId = null,
    selectedRange,      // Controlled State
    onRangeChange       // Callback
}) {
    // ... State Logic remains same ...
    const [internalRange, setInternalRange] = useState('5Y');
    const [hiddenKeys, setHiddenKeys] = useState([]);

    const timeRange = selectedRange || internalRange;
    const handleRangeChange = (r) => {
        if (onRangeChange) onRangeChange(r);
        else setInternalRange(r);
    };

    const filteredData = useMemo(() => {
        let cutoff = new Date('1900-01-01'); // Default for ALL (very old)
        if (timeRange !== 'ALL') {
            const now = new Date();
            cutoff = new Date();
            if (timeRange === '1Y') cutoff.setFullYear(now.getFullYear() - 1);
            if (timeRange === '3Y') cutoff.setFullYear(now.getFullYear() - 3);
            if (timeRange === '5Y') cutoff.setFullYear(now.getFullYear() - 5);
            if (timeRange === '10Y') cutoff.setFullYear(now.getFullYear() - 10);
            if (timeRange === '25Y') cutoff.setFullYear(now.getFullYear() - 25);
        }

        return data.filter(d => {
            const passesDate = new Date(d.date) >= cutoff;
            if (!passesDate) return false;

            // Check if ANY of the dataKeys has a value in this row
            // We shouldn't filter by 'hiddenKeys' here because logic implies "data availability"
            // But if the user hides a key, maybe they want to see the other key's full range?
            // Usually, "max available" means available for the keys *passed* to the chart.
            const hasData = dataKeys.some(k => {
                const val = d[k.key];
                return val !== undefined && val !== null && val !== '';
            });
            return hasData;
        });
    }, [data, timeRange, dataKeys]);

    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setHiddenKeys(prev =>
            prev.includes(dataKey) ? prev.filter(k => k !== dataKey) : [...prev, dataKey]
        );
    };

    const activeLeftKeys = dataKeys.filter(k => !hiddenKeys.includes(k.key) && k.yAxisId !== 'right');
    const leftValues = filteredData
        .flatMap(d => activeLeftKeys.map(k => d[k.key]))
        .filter(v => typeof v === 'number' && !isNaN(v));

    let minVal = 0;
    let maxVal = 'auto'; // Recharts auto
    if (leftValues.length > 0) {
        let min = Math.min(...leftValues);
        let max = Math.max(...leftValues);
        const padding = (max - min) * 0.05;
        minVal = min - padding;
        maxVal = max + padding;
        if (min >= 0 && minVal < 0) minVal = 0;
    }

    const hasRightAxis = dataKeys.some(k => k.yAxisId === 'right');

    return (
        <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            {/* Header ... */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                    {title && <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>}

                    {/* Share Button */}
                    {chartId && (
                        <button
                            onClick={() => {
                                const url = `${window.location.origin}${window.location.pathname}?chart=${chartId}`;
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Cú Thông Thái - ' + (title || 'Biểu Đồ'),
                                        text: 'Xem biểu đồ chi tiết: ' + (title || ''),
                                        url: url
                                    }).catch(console.error);
                                } else {
                                    navigator.clipboard.writeText(url);
                                    alert('Đã copy link biểu đồ: ' + url);
                                }
                            }}
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                            title="Chia sẻ biểu đồ này"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.287.696.345 1.074.059.378.044.76-.042 1.135l-2.471 5.925M7.5 12a2.3 2.3 0 0 0 .5-1.5m-5.409 6.273a2.25 2.25 0 1 1 3.182-3.182m-3.182 3.182c.324.18.696.287 1.074.345.378.059.76.044 1.135-.042l5.925-2.471m-6.273-5.409A2.25 2.25 0 0 1 12 7.5m2.273 5.409-2.273-5.409a2.25 2.25 0 0 1 5.409 2.273 2.25 2.25 0 0 1-5.409 2.273" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
                    {['1Y', '3Y', '5Y', '10Y', '25Y', 'ALL'].map(range => (
                        <button
                            key={range}
                            onClick={() => handleRangeChange(range)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${timeRange === range ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>


            {/* Latest Values Overlay (Top Right) */}
            <div className="flex flex-wrap justify-end gap-3 mb-2 px-2">
                {filteredData.length > 0 && dataKeys.map(k => {
                    if (hiddenKeys.includes(k.key)) return null;
                    const latestItem = filteredData[filteredData.length - 1];

                    const val = k.originalValueKey
                        ? latestItem[k.originalValueKey]
                        : latestItem[k.key];

                    const unit = k.originalValueKey
                        ? (k.originalUnit || '')
                        : (k.unit || '');

                    if (val === undefined || val === null) return null;

                    return (
                        <div key={k.key} className="flex items-center text-xs font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: k.color }}></div>
                            <span className="text-slate-400 mr-1">{k.name}:</span>
                            <span className="text-slate-200 font-bold">
                                {typeof val === 'number' ? val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : val}
                                <span className="text-slate-500 ml-1">{unit}</span>
                            </span>
                        </div>
                    );
                })}
            </div>

            <div style={{ width: '100%', height: height, minHeight: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={filteredData}
                        syncId={syncId}
                        margin={{ top: 10, right: hasRightAxis ? 10 : 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {dataKeys.filter(k => !k.type || k.type === 'area').map((k, i) => (
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
                            yAxisId="left"
                            stroke="#64748b"
                            tick={{ fontSize: 11 }}
                            domain={[minVal, maxVal]}
                            tickFormatter={(val) => {
                                if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
                                if (val >= 1000) return `${(val / 1000).toFixed(2)}k`;
                                return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }}
                        />
                        {hasRightAxis && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#94a3b8"
                                tick={{ fontSize: 11 }}
                            />
                        )}
                        <Tooltip content={<CustomTooltip dataKeysConfig={dataKeys} />} />
                        <Legend onClick={handleLegendClick} />

                        {dataKeys.map((k) => {
                            const axisId = k.yAxisId || 'left';
                            const isHidden = hiddenKeys.includes(k.key);

                            if (k.type === 'bar') {
                                return (
                                    <Bar
                                        key={k.key}
                                        dataKey={k.key}
                                        fill={k.color}
                                        yAxisId={axisId}
                                        barSize={20}
                                        radius={[4, 4, 0, 0]}
                                        name={k.name}
                                        unit={k.unit}
                                        hide={isHidden}
                                    />
                                );
                            } else if (k.type === 'line') {
                                return (
                                    <Line
                                        key={k.key}
                                        type="monotone"
                                        dataKey={k.key}
                                        stroke={k.color}
                                        yAxisId={axisId}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                        name={k.name}
                                        unit={k.unit}
                                        hide={isHidden}
                                    />
                                );
                            }
                            // Default to Area
                            return (
                                <Area
                                    key={k.key}
                                    type="monotone"
                                    dataKey={k.key}
                                    stroke={k.color}
                                    fill={`url(#color${k.key})`}
                                    yAxisId={axisId}
                                    strokeWidth={2}
                                    activeDot={{ r: 4, strokeWidth: 0 }}
                                    name={k.name}
                                    unit={k.unit}
                                    hide={isHidden}
                                />
                            );
                        })}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div >
    );
}

