'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { POLICY_STANCE_DATA, HEALTH_BOWL_COMMENTS } from '../../../src/data/macro_health';
import ShareButton from '../../ui/ShareButton';

export default function PolicyStanceSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-pink-500 w-1 h-6 mr-3 rounded-full"></span>
                1. Chính Sách 2025: Bơm Hay Hút? 💉
                <ShareButton chartId="policy-stance" className="ml-3" />
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <p className="text-slate-400 text-sm italic">
                        Đánh giá mức độ nới lỏng của <span className="text-green-500 font-bold">Tiền Tệ</span> và <span className="text-red-500 font-bold">Tài Khóa</span>. <br />
                        Thang điểm 100 = "Bung Lụa Tối Đa".
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-w-sm">
                        <p className="text-yellow-400 text-xs italic">
                            {HEALTH_BOWL_COMMENTS.fiscal_monetary}
                        </p>
                    </div>
                </div>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={POLICY_STANCE_DATA}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="category" type="category" width={100} tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 'bold' }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                                {POLICY_STANCE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Metric Details */}
                <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                    {POLICY_STANCE_DATA.map((item) => (
                        <div key={item.category} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-center">
                            <h4 className="text-sm font-bold text-slate-300">{item.category}</h4>
                            <p className="text-lg font-bold" style={{ color: item.color }}>{item.metric}</p>
                            <p className="text-xs text-slate-500">{item.note}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
