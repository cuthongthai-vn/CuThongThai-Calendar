'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RESERVES_DATA, OWL_COMMENTS } from '../../../src/data/trade_report';
import ShareButton from '../../ui/ShareButton';

export default function ReservesHealthSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-red-500 w-1 h-6 mr-3 rounded-full"></span>
                2. Sức Khỏe Đồng Tiền: Vùng An Toàn IMF 🛡️
                <ShareButton chartId="reserves" className="ml-3" />
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <p className="text-slate-400 text-sm">
                            Số tháng nhập khẩu mà dự trữ ngoại hối có thể chi trả. <br />
                            <span className="text-red-500 font-bold">Dưới 3 tháng</span> là báo động đỏ (IMF Warning).
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="inline-block w-3 h-3 bg-red-500/20 border border-red-500 rounded"></span>
                            <span className="text-slate-500">Vùng Nguy Hiểm (Khiến áp lực tăng lãi suất)</span>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-w-sm">
                        <p className="text-yellow-400 text-xs italic">
                            {OWL_COMMENTS.reserves}
                        </p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={RESERVES_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMonths" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                            <YAxis domain={[0, 6]} tick={{ fill: '#94a3b8' }} label={{ value: 'Tháng nhập khẩu', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                formatter={(val) => `${val} tháng`}
                            />
                            <ReferenceLine y={3} label={{ position: 'right', value: 'IMF Safe Line (3.0)', fill: '#22c55e', fontSize: 12 }} stroke="#22c55e" strokeDasharray="5 5" />
                            <Area type="monotone" dataKey="months" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMonths)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
