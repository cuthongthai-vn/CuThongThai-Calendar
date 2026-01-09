'use client';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TRADE_BALANCE_DATA, OWL_COMMENTS } from '../../../src/data/trade_report';
import TooltipWrapper from '../../ui/TooltipWrapper';
import ShareButton from '../../ui/ShareButton';

export default function TradeBalanceSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-yellow-500 w-1 h-6 mr-3 rounded-full"></span>
                1. Cán Cân Thương Mại: Ai Đang Gánh Team? ⚖️
                <ShareButton chartId="trade-balance" className="ml-3" />
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <p className="text-slate-400 text-sm italic">
                        <span className="text-green-500 font-bold">FDI (Khối ngoại)</span> thăng hoa, gánh toàn bộ thâm hụt của <span className="text-red-500 font-bold">Domestic (Trong nước)</span>. <br />
                        <span className="text-xs text-slate-500 mt-1 block">Đơn vị: Tỷ USD</span>
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 max-w-sm">
                        <p className="text-yellow-400 text-xs italic">
                            {OWL_COMMENTS.trade_balance}
                        </p>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={TRADE_BALANCE_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.3} vertical={false} />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: 'Tỷ USD', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ padding: 0 }}
                                formatter={(value) => `${value > 0 ? '+' : ''}${value} tỷ $`}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <ReferenceLine y={0} stroke="#64748b" />

                            <Bar dataKey="fdi_balance" name="FDI (Xuất Siêu)" fill="#22c55e" barSize={20} radius={[4, 4, 0, 0]} stackId="a" />
                            <Bar dataKey="domestic_balance" name="Nội Địa (Nhập Siêu)" fill="#ef4444" barSize={20} radius={[4, 4, 0, 0]} stackId="a" />
                            <Line type="monotone" dataKey="total" name="Tổng Cán Cân" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24' }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
