
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

                    const displayVal = typeof rawVal === 'number' ? rawVal.toLocaleString() : rawVal;
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
                {title && <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>}
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
            EMPTY_STRING

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
                                {typeof val === 'number' ? val.toLocaleString() : val}
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
                            tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
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

