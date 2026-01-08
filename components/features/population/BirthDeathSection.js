'use client';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';

export default function BirthDeathSection({ data }) {
    // Only data from 2000 onwards has Births/Deaths in many datasets, or interpolate differently.
    // Our CSV has Births/Deaths from 2001. Check data quality.

    // Filter rows that have valid Births data (avoid 0s if they are placeholders)
    // Actually the CSV has Births/Deaths mostly from 2001.
    const chartData = data
        .filter(item => item.year >= 2000 && item.year <= 2100);

    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-blue-500 w-1 h-6 mr-3 rounded-full"></span>
                2. Sinh vs Tử (The Cross of Doom) ☠️
            </h2>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="mb-2">
                    <p className="text-slate-400 text-sm">
                        Khi đường <span className="text-blue-400 font-bold">Số ca sinh</span> cắt xuống đường <span className="text-red-400 font-bold">Số ca tử</span>, dân số tự nhiên bắt đầu giảm (Natural Decrease).
                    </p>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                type="number"
                                domain={[2000, 2100]}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => (val / 1000000).toFixed(1) + 'M'}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                                formatter={(val) => new Intl.NumberFormat('vi-VN').format(val)}
                                labelStyle={{ color: '#9ca3af' }}
                            />

                            {/* The Cross of Doom Highlight - Approx 2070 based on CSV */}
                            <ReferenceLine x={2071} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Điểm cắt (2071)', fill: '#ef4444', fontSize: 12 }} />

                            {/* Danger Zone */}
                            <ReferenceArea x1={2071} x2={2100} strokeOpacity={0} fill="#ef4444" fillOpacity={0.1} />

                            <Line
                                type="monotone"
                                dataKey="births"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                name="Số ca sinh"
                            />
                            <Line
                                type="monotone"
                                dataKey="deaths"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={false}
                                name="Số ca tử"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
