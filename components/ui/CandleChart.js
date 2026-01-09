'use client';

import { createChart, ColorType, AreaSeries, HistogramSeries } from 'lightweight-charts';
import { useState, useMemo, useEffect, useRef } from 'react';

// Color Palette
const COLORS = {
    line: '#22c55e', // Green-500
    topColor: 'rgba(34, 197, 94, 0.4)', // Green gradient
    bottomColor: 'rgba(34, 197, 94, 0.0)',
    up: '#22c55e',
    down: '#ef4444',
    bg: 'transparent',
    grid: '#334155',
    text: '#94a3b8',
};

const isValidDate = (d) => d instanceof Date && !isNaN(d);

const resampleData = (data, interval) => {
    if (!data || data.length === 0) return [];
    if (interval === 'day') return data;

    const grouped = {};
    data.forEach(d => {
        const date = new Date(d.date);
        if (!isValidDate(date)) return; // Skip invalid dates

        let key;
        try {
            if (interval === 'week') {
                const firstDay = new Date(date);
                const day = firstDay.getDay();
                const diff = firstDay.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
                firstDay.setDate(diff);
                key = firstDay.toISOString().split('T')[0];
            } else if (interval === 'month') {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                key = `${y}-${m}-01`;
            } else {
                key = d.date;
            }

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(d);
        } catch (e) {
            console.warn('Date parsing error', e);
        }
    });

    return Object.entries(grouped).map(([date, group]) => {
        group.sort((a, b) => new Date(a.date) - new Date(b.date));
        const first = group[0];
        const last = group[group.length - 1];

        const open = first.open;
        const close = last.close;
        const high = Math.max(...group.map(g => g.high));
        const low = Math.min(...group.map(g => g.low));
        const volume = group.reduce((sum, g) => sum + (g.volume || 0), 0);
        return { date, open, high, low, close, volume };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export default function CandleChart({
    data,
    classId,
    height = 500
}) {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const [range, setRange] = useState('1Y');

    // 1. FILTER & RESAMPLE DATA
    const chartData = useMemo(() => {
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

        // Filter
        const rawFiltered = data.filter(d => new Date(d.date) >= cutoffDate && d.open && d.close);
        // Resample
        const processed = resampleData(rawFiltered, interval);

        // Map to Lightweight Charts format
        // { time: 'YYYY-MM-DD', value: ... } for AreaSeries
        return processed.map(d => ({
            time: d.date.split('T')[0], // Ensure YYYY-MM-DD
            value: d.close, // For AreaSeries
            open: d.open, // For Volume Color logic
            close: d.close,
            volume: d.volume,
            isUp: d.close >= d.open
        }));
    }, [data, range]);

    // 2. INITIALIZE CHART
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Cleanup previous chart
        if (chartRef.current) {
            chartRef.current.remove();
        }

        // Create Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: COLORS.bg },
                textColor: COLORS.text
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            grid: {
                vertLines: { color: COLORS.grid, style: 2 }, // Dotted
                horzLines: { color: COLORS.grid, style: 2 },
            },
            timeScale: {
                borderColor: '#475569',
                timeVisible: true,
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2, // Space for volume
                },
                borderVisible: false,
            },
            crosshair: {
                vertLine: {
                    width: 1,
                    color: '#94a3b8',
                    labelBackgroundColor: '#94a3b8',
                },
                horzLine: {
                    width: 1,
                    color: '#94a3b8',
                    labelBackgroundColor: '#94a3b8',
                },
            },
        });

        // 3. AREA SERIES (Line with Fill)
        const mainSeries = chart.addSeries(AreaSeries, {
            lineColor: COLORS.line,
            topColor: COLORS.topColor,
            bottomColor: COLORS.bottomColor,
            lineWidth: 2,
        });

        mainSeries.setData(chartData);

        // 4. VOLUME SERIES (Overlay)
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume_overlay', // Use separate scale
        });

        // Configure Volume Scale Logic
        chart.priceScale('volume_overlay').applyOptions({
            scaleMargins: {
                top: 0.8, // Push to bottom 20%
                bottom: 0,
            },
            visible: false, // Hide axis labels
        });

        // Map Volume Data
        const volData = chartData.map(d => ({
            time: d.time,
            value: d.volume,
            color: d.isUp ? 'rgba(8, 153, 129, 0.4)' : 'rgba(242, 54, 69, 0.4)'
        }));

        volumeSeries.setData(volData);

        chartRef.current = chart;

        // Resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
        };

    }, [chartData, height]);

    return (
        <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Biểu Đồ Xu Hướng (VNINDEX)</h3>
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

            {/* Chart Container */}
            <div ref={chartContainerRef} className="w-full relative" style={{ height: height }} />

            <div className="text-center text-xs text-slate-600 mt-2">
                * Dữ liệu từ VNDirect. TradingView Engine (Area Mode).
            </div>
        </div>
    );
}
