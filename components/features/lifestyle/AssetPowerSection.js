'use client';
import { useState } from 'react';
import MacroChart from '../../ui/MacroChart';

export default function AssetPowerSection({ data }) {
    const [trendRange, setTrendRange] = useState('ALL');

    // Helper
    const getLatest = (key) => {
        if (!data || data.length === 0) return { val: 'N/A', date: '' };
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i][key] !== undefined && data[i][key] !== null) {
                return { val: data[i][key], date: data[i].date };
            }
        }
        return { val: 'N/A', date: '' };
    };

    const latestIphonePow = getLatest('iphone_pow');
    const latestShPow = getLatest('sh_pow');

    // Prices for context
    const latestIphonePrice = getLatest('iphone');
    const latestShPrice = getLatest('sh');
    const latestCondoPrice = getLatest('condo'); // VND/m2
    const latestPhoPrice = getLatest('pho'); // VND

    return (
        <section>
            <h2 className="text-xl font-bold text-white flex items-center mb-6">
                <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                2. Quyền Năng "Tiêu Của Để Dành"
                <span className="ml-3 px-2 py-0.5 text-[10px] font-bold bg-green-900/50 text-green-400 border border-green-800 rounded uppercase tracking-wider">
                    Mới 01/2026
                </span>
            </h2>
            {/* Chart: SH & iPhone Power */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-200 mb-1">Giấc Mơ SH & iPhone 📱🛵</h3>
                        <p className="text-slate-400 text-xs text-justify max-w-md">1 chiếc iPhone hoặc SH mua được bao nhiêu m2 chung cư?</p>

                        {/* Extra Details Row */}
                        <div className="flex gap-4 mt-3 text-xs text-slate-500 border-t border-slate-800 pt-2">
                            <div>
                                <span className="block text-slate-600">Giá iPhone:</span>
                                <span className="text-slate-300 font-mono">{latestIphonePrice.val?.toFixed(1)} Tr</span>
                            </div>
                            <div>
                                <span className="block text-slate-600">Giá SH:</span>
                                <span className="text-slate-300 font-mono">{latestShPrice.val?.toFixed(1)} Tr</span>
                            </div>
                            <div>
                                <span className="block text-slate-600">Giá Chung Cư:</span>
                                <span className="text-slate-300 font-mono">{latestCondoPrice.val?.toFixed(1)} Tr/m2</span>
                            </div>
                            <div>
                                <span className="block text-slate-600">Phở Index:</span>
                                <span className="text-slate-300 font-mono">{(latestPhoPrice.val / 1000)?.toFixed(0)}k</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-4 md:mt-0 text-right">
                        <div>
                            <p className="text-xs text-slate-500">iPhone ({latestIphonePow.date})</p>
                            <p className="text-xl font-bold text-purple-400">{latestIphonePow.val} m2</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">SH ({latestShPow.date})</p>
                            <p className="text-xl font-bold text-amber-400">{latestShPow.val} m2</p>
                        </div>
                    </div>
                </div>
                <MacroChart
                    data={data}
                    selectedRange={trendRange}
                    onRangeChange={setTrendRange}
                    dataKeys={[
                        { key: 'iphone_pow', color: '#8b5cf6', name: 'iPhone (m2 nhà)', unit: ' m2' },
                        { key: 'sh_pow', color: '#fbbf24', name: 'SH Nhập (m2 nhà)', unit: ' m2' }
                    ]}
                    height={350}
                />
                <p className="text-center text-slate-500 text-xs mt-2 italic">
                    * Ngày xưa 1 con SH đổi được cả mảnh đất. Giờ chỉ là phương tiện đi lại.
                </p>
            </div>
        </section>
    );
}
