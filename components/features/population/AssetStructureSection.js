'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ASSET_COMPOSITION_DATA } from '../../../src/data/wealth_report';

export default function AssetStructureSection() {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <span className="bg-blue-500 w-1 h-6 mr-3 rounded-full"></span>
                3. Cấu Trúc Tài Sản (Asset Allocation) 🏠
            </h2>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <p className="text-slate-400 text-sm mb-6">
                    Người Việt giữ tài sản ở đâu? <span className="text-red-500 font-bold">72% là Bất Động Sản</span>.
                    Tài chính (Cổ phiếu/Trái phiếu) chiếm rất ít so với Mỹ.
                </p>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={ASSET_COMPOSITION_DATA}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="type" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                            <YAxis unit="%" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                            />
                            <Legend />
                            <Bar dataKey="vn_pct" name="Việt Nam 🇻🇳" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="us_pct" name="Mỹ 🇺🇸" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="cn_pct" name="Trung Quốc 🇨🇳" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs text-slate-500">
                    <div>
                        <span className="block text-red-500 font-bold text-lg">72%</span>
                        Bất Động Sản (VN)
                    </div>
                    <div>
                        <span className="block text-blue-500 font-bold text-lg">5%</span>
                        Tài Chính (VN)
                    </div>
                    <div>
                        <span className="block text-yellow-500 font-bold text-lg">23%</span>
                        Vàng & Xe (VN)
                    </div>
                </div>
            </div>
        </section>
    );
}
