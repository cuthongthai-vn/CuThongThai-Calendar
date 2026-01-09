'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { OVERHEATING_INDICATORS, HEALTH_BOWL_COMMENTS } from '../../../src/data/macro_health';

export default function OverheatingMonitorSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-orange-500 w-1 h-6 mr-3 rounded-full"></span>
                3. Nhiệt Kế Kinh Tế: Có Quá Nóng? 🌡️
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <p className="text-slate-400 text-sm">
                        So sánh các chỉ số tăng trưởng với "Ngưỡng cảnh báo". <br />
                        Nếu cột thực tế vượt quá vạch đỏ, nền kinh tế đang <span className="text-orange-500 font-bold">Overheating</span>.
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-w-sm">
                        <p className="text-yellow-400 text-xs italic">
                            {HEALTH_BOWL_COMMENTS.overheating}
                        </p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={OVERHEATING_INDICATORS}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis unit="%" tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Legend />
                            <Bar dataKey="value" name="Thực tế 2025" fill="#3b82f6" barSize={40} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="threshold" name="Ngưỡng Nóng (Limit)" fill="#ea580c" barSize={40} radius={[4, 4, 0, 0]} opacity={0.3} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
