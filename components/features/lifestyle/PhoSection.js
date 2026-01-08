'use client';
import { useState } from 'react';
import MacroChart from '../../ui/MacroChart';

export default function PhoSection({ data }) {
    const [trendRange, setTrendRange] = useState('ALL');

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="bg-yellow-500 w-1 h-6 mr-3 rounded-full"></span>
                    1. Phở Index: Thước Đo Lạm Phát 🍜
                    <span className="ml-3 px-2 py-0.5 text-[10px] font-bold bg-green-900/50 text-green-400 border border-green-800 rounded uppercase tracking-wider animate-pulse">
                        Mới 01/2026
                    </span>
                </h2>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <p className="text-slate-400 text-sm mb-4">
                    Biến động giá Phở (VND) tại Hà Nội và TP.HCM qua các thời kỳ. Giá bát phở là thước đo lạm phát thực tế nhất!
                </p>
                <MacroChart
                    data={data}
                    selectedRange={trendRange}
                    onRangeChange={setTrendRange}
                    dataKeys={[
                        { key: 'pho_hn', color: '#ef4444', name: 'Phở Hà Nội', unit: ' đ', type: 'line' },
                        { key: 'pho_hcm', color: '#8b5cf6', name: 'Phở TP.HCM', unit: ' đ', type: 'line' },
                        { key: 'pho', color: '#eab308', name: 'Trung Bình VN', unit: ' đ', type: 'area' },
                        { key: 'cpi_index', color: '#22c55e', name: 'CPI', unit: '', type: 'line', yAxisId: 'right', originalValueKey: 'cpi', originalUnit: '%' },
                    ]}
                    height={400}
                />
                <div className="mt-2 text-xs text-slate-500 italic">
                    * Dữ liệu tổng hợp từ lịch sử giá tại các quán phở danh tiếng (1975-2025).
                </div>
            </div>
        </section>
    );
}
