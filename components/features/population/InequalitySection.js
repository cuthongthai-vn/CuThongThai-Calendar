'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { LORENZ_CURVE_DATA, GINI_TREND_DATA } from '../../../src/data/wealth_report';

export default function InequalitySection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-orange-500 w-1 h-6 mr-3 rounded-full"></span>
                2. Bất Bình Đẳng (Inequality) ⚖️
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lorenz Curve */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Đường cong Lorenz</h3>
                    <p className="text-xs text-slate-400 mb-4 h-8">
                        Đường thực tế càng cong xa đường chéo (bình đẳng), bất công càng lớn.
                    </p>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={LORENZ_CURVE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis
                                    dataKey="pop_cumulative"
                                    type="number"
                                    domain={[0, 100]}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    label={{ value: '% Dân số tích lũy', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Line
                                    type="monotone"
                                    dataKey="equality"
                                    stroke="#64748b"
                                    strokeDasharray="5 5"
                                    strokeWidth={1}
                                    dot={false}
                                    name="Bình đẳng tuyệt đối"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="wealth_cumulative"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ r: 2 }}
                                    name="Thực tế (VN)"
                                />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gini Trend */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Hệ Số Gini (2012 - 2024)</h3>
                    <p className="text-xs text-slate-400 mb-4 h-8">
                        Thang đo 0 (Bình đẳng) - 1 (Bất công). <span className="text-green-500">Xu hướng đang giảm (Tốt).</span>
                    </p>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={GINI_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis domain={[0.3, 0.7]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Line
                                    type="monotone"
                                    dataKey="gini_wealth"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    name="Gini Tài Sản (Cao)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="gini_income"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Gini Thu Nhập (Thấp)"
                                />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}
