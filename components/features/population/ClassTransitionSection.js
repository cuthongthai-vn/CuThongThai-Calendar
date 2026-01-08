'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { ECONOMIC_CLASS_DATA, INCOME_PERCENTILES } from '../../../src/data/wealth_report';

export default function ClassTransitionSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                4. Tầng Lớp Kinh Tế (Economic Class) 🚀
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2030 Projection Chart */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase">Dự báo chuyển dịch (2024 vs 2030)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={ECONOMIC_CLASS_DATA}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis dataKey="class" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Bar dataKey="pct_2024" name="2024 (%)" fill="#64748b" barSize={12} radius={[0, 4, 4, 0]} />
                                <Bar dataKey="pct_2030" name="2030 (%)" fill="#8b5cf6" barSize={12} radius={[0, 4, 4, 0]}>
                                    <LabelList dataKey="pct_2030" position="right" fill="#8b5cf6" formatter={(v) => `${v}%`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Income Thresholds Table */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-slate-300 mb-1 uppercase px-2">Cần bao nhiêu tiền để lọt Top?</h3>
                    {INCOME_PERCENTILES.map((item) => (
                        <div key={item.label} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex justify-between items-center hover:bg-gray-800/50 transition">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-slate-200 font-semibold">{item.label}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-lg font-bold text-white">{item.threshold_vnd} Triệu/tháng</span>
                                <span className="text-[10px] text-slate-500">~${item.threshold_usd.toLocaleString()}/năm</span>
                            </div>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-600 italic px-2 mt-1">
                        *Thu nhập hộ gia đình (PPP adjusted). Nguồn: World Inequality Database 2021.
                    </p>
                </div>
            </div>
        </section>
    );
}
