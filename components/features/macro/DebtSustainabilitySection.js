'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';
import { DEBT_SUSTAINABILITY_DATA, HEALTH_BOWL_COMMENTS } from '../../../src/data/macro_health';
import ShareButton from '../../ui/ShareButton';

export default function DebtSustainabilitySection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-blue-500 w-1 h-6 mr-3 rounded-full"></span>
                2. Sức Bền Nợ: An Toàn Hay Rủi Ro? 💣
                <ShareButton chartId="debt" className="ml-3" />
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <p className="text-slate-400 text-sm">
                        Tỷ lệ Nợ trên GDP (%). <span className="text-green-500 font-bold">Nợ Công</span> đang ở mức thấp kỷ lục (34%).
                        Tuy nhiên số liệu <span className="text-blue-500 font-bold">Nợ Tư Nhân</span> cần xem xét kỹ.
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-w-sm">
                        <p className="text-amber-500 text-xs italic font-bold">
                            ⚠️ {HEALTH_BOWL_COMMENTS.debt_warning}
                        </p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={DEBT_SUSTAINABILITY_DATA}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis dataKey="type" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis unit="%" tick={{ fill: '#94a3b8' }} domain={[0, 160]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <ReferenceLine y={60} label={{ position: 'right', value: 'Trần Nợ Công (60%)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
                            <ReferenceLine y={140} label={{ position: 'right', value: 'World Bank Private Est (~140%)', fill: '#fbbf24', fontSize: 10 }} stroke="#fbbf24" strokeDasharray="5 5" />

                            <Bar dataKey="value" name="% GDP" radius={[4, 4, 0, 0]} barSize={60}>
                                {DEBT_SUSTAINABILITY_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList dataKey="value" position="top" fill="#fff" formatter={(v) => `${v}%`} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
