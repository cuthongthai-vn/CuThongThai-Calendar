'use client';
import { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';
import { getRanges, formatDate } from '../../../src/utils/dateHelpers';

export default function GoldenWindowSection({ data }) {
    // Data is already yearly

    const chartData = data.map(item => ({
        year: item.year,
        dependency_ratio: item.dependency_ratio,
        working_age: item.age_15_64_pct,
        // Helper for coloring
        isGolden: item.golden_window
    }));

    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-yellow-500 w-1 h-6 mr-3 rounded-full"></span>
                1. Giai Đoạn Dân Số Vàng (Golden Window) 🌟
            </h2>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-sm mb-2">
                            Tỷ lệ phụ thuộc (Dependency Ratio) càng thấp càng tốt. <br />
                            <span className="text-yellow-400">Vùng sáng</span> là giai đoạn vàng (2006 - 2040).
                        </p>
                        <div className="flex gap-4 text-xs mt-2">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded"></div>
                                <span className="text-slate-300">Giai đoạn vàng (53% - 42%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
                                <span className="text-slate-300">Tỷ lệ phụ thuộc (Người già + Trẻ em / Lao động)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                type="number"
                                domain={[1990, 2060]} // Focus on the relevant era
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[30, 80]}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                                labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
                            />

                            {/* The Golden Window Highlight */}
                            <ReferenceArea x1={2006} x2={2040} strokeOpacity={0} fill="#eab308" fillOpacity={0.15} />

                            {/* Current Year Marker */}
                            <ReferenceLine x={2026} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: '2026', fill: '#3b82f6', fontSize: 12 }} />

                            <Area
                                type="monotone"
                                dataKey="dependency_ratio"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fill="url(#colorDep)"
                                name="Tỷ lệ phụ thuộc"
                                unit="%"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase">Bắt Đầu</p>
                        <p className="text-xl font-bold text-yellow-500">2006</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase">Kết Thúc</p>
                        <p className="text-xl font-bold text-red-500">2040</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase">Hiện Tại</p>
                        <p className="text-xl font-bold text-blue-400">Năm thứ 21/34</p>
                        <p className="text-[10px] text-slate-400">Còn 14 năm nữa!</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
