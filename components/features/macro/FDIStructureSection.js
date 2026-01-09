'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EXPORT_SHARE_DATA, OWL_COMMENTS } from '../../../src/data/trade_report';

export default function FDIStructureSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                3. Cơ Cấu Xuất Khẩu: Ai Làm Chủ Cuộc Chơi? 🏭
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <p className="text-slate-400 text-sm">
                        Tỷ trọng đóng góp vào kim ngạch xuất khẩu quốc gia. <br />
                        FDI (Samsung, Lego, Apple...) đang chiếm tới <span className="text-purple-400 font-bold">77%</span>.
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-w-sm">
                        <p className="text-yellow-400 text-xs italic">
                            {OWL_COMMENTS.dependence}
                        </p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={EXPORT_SHARE_DATA}
                            stackOffset="expand"
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                            <YAxis tickFormatter={(toPercent) => `${(toPercent * 100).toFixed(0)}%`} tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                formatter={(value) => `${value}%`}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="domestic_pct" name="Doanh Nghiệp Việt" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="fdi_pct" name="Khối FDI (Nước ngoài)" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
