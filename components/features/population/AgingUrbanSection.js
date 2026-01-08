'use client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';

export default function AgingUrbanSection({ data }) {
    // 3. Aging Structure (Stacked Bar 100%)
    // Show every 10 years to reduce clutter
    const agingData = data.filter(d => d.year >= 1990 && d.year <= 2100 && d.year % 10 === 0);

    // 4. Urbanization (Area)
    const urbanData = data.filter(d => d.year >= 1990 && d.year <= 2100);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            {/* AGING STRUCTURE - STACKED BAR */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h2 className="text-lg font-bold text-white flex items-center mb-4">
                    <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                    3. Cấu Trúc Dân Số (Già Hóa) 👴
                </h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={agingData} stackOffset="expand" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                                formatter={(val) => `${val.toFixed(1)}%`}
                            />
                            <Legend verticalAlign="top" height={36} />

                            <Bar dataKey="age_0_14_pct" name="Trẻ em (0-14)" stackId="a" fill="#22c55e" />
                            <Bar dataKey="age_15_64_pct" name="Lao động (15-64)" stackId="a" fill="#3b82f6" />
                            <Bar dataKey="age_65_plus_pct" name="Người già (65+)" stackId="a" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-slate-500 mt-2 italic">
                    * Tháp dân số đang chuyển từ hình Kim Tự Tháp (nhiều trẻ em) sang hình Nấm (nhiều người già).
                </p>
            </div>

            {/* URBANIZATION - AREA CHART */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h2 className="text-lg font-bold text-white flex items-center mb-4">
                    <span className="bg-cyan-500 w-1 h-6 mr-3 rounded-full"></span>
                    4. Đô Thị Hóa (Urbanization) 🏙️
                </h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={urbanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                type="number"
                                domain={[1990, 2050]}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                unit="%"
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                                formatter={(val) => `${val.toFixed(1)}%`}
                            />
                            <Area
                                type="monotone"
                                dataKey="urban_pct"
                                stroke="#06b6d4"
                                strokeWidth={3}
                                fill="url(#colorUrban)"
                                name="Tỷ lệ Đô thị hóa"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between px-4 mt-2 text-xs font-bold">
                    <span className="text-slate-400">2025: <span className="text-cyan-400">45%</span></span>
                    <span className="text-slate-400">2030: <span className="text-cyan-400">48%</span></span>
                    <span className="text-slate-400">2050: <span className="text-cyan-400">58%</span></span>
                </div>
            </div>
        </section>
    );
}
