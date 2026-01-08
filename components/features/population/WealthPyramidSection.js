'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { WEALTH_PYRAMID_DATA } from '../../../src/data/wealth_report';

export default function WealthPyramidSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-green-500 w-1 h-6 mr-3 rounded-full"></span>
                1. Tháp Tài Sản (Wealth Pyramid) 🔺
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Chart */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <p className="text-slate-400 text-sm mb-4">
                        Phân tầng dân số theo tài sản ròng (Net Wealth). <br />
                        <span className="text-red-500 font-bold">0.3%</span> dân số nắm giữ <span className="text-red-500 font-bold">17%</span> tài sản quốc gia.
                    </p>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={WEALTH_PYRAMID_DATA}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis dataKey="tier" type="category" width={60} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                />
                                <Bar dataKey="population_pct" name="% Dân số" radius={[0, 4, 4, 0]}>
                                    {WEALTH_PYRAMID_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    <LabelList dataKey="population_pct" position="right" fill="#fff" formatter={(val) => `${val}%`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Legend / Details */}
                <div className="flex flex-col gap-4">
                    {WEALTH_PYRAMID_DATA.slice().reverse().map((item) => (
                        <div key={item.tier} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:border-gray-700 transition">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-12 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <div>
                                    <p className="font-bold text-slate-200 text-lg">{item.tier}</p>
                                    <p className="text-xs text-slate-500">{item.range}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-300">{item.population}</p>
                                <p className="text-xs text-slate-500">Người</p>
                            </div>
                            <div className="text-right border-l border-gray-800 pl-4 w-24">
                                <p className="text-sm font-bold text-white">{item.wealth_share}%</p>
                                <p className="text-[10px] text-slate-500 uppercase">Tài sản</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
