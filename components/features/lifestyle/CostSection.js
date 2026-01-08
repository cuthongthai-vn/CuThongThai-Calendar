'use client';
import { useState } from 'react';
import MacroChart from '../../ui/MacroChart';

export default function CostSection({ data }) {
    const [lifeRange, setLifeRange] = useState('ALL');

    const getLatest = (key) => {
        if (!data || data.length === 0) return { val: 'N/A', date: '' };
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i][key] !== undefined && data[i][key] !== null) {
                return { val: data[i][key], date: data[i].date };
            }
        }
        return { val: 'N/A', date: '' };
    };

    const latestHaoHao = getLatest('haohao');
    const latestBeer = getLatest('beer');
    const latestDining = getLatest('dining_freq');
    const latestBeauty = getLatest('beauty_spend');

    return (
        <section>
            <h2 className="text-xl font-bold text-white flex items-center mb-6">
                <span className="bg-red-500 w-1 h-6 mr-3 rounded-full"></span>
                3. Chi Phí & Chất Lượng Sống
                <span className="ml-3 px-2 py-0.5 text-[10px] font-bold bg-green-900/50 text-green-400 border border-green-800 rounded uppercase tracking-wider">
                    Mới 01/2026
                </span>
            </h2>

            {/* 2.1: BASIC SURVIVAL */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-200 mb-1">Chi phí CEO ăn Mì Tôm uống Bia Hơi 🍜🍻</h3>
                        <p className="text-slate-400 text-xs">Combo "sinh tồn" cơ bản.</p>
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0 text-right">
                        <div>
                            <p className="text-xs text-slate-500">Hảo Hảo ({latestHaoHao.date})</p>
                            <p className="text-xl font-bold text-red-400">{latestHaoHao.val?.toLocaleString()} đ</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Bia Hơi ({latestBeer.date})</p>
                            <p className="text-xl font-bold text-yellow-400">{latestBeer.val?.toLocaleString()} đ</p>
                        </div>
                    </div>
                </div>
                <MacroChart
                    data={data}
                    selectedRange={lifeRange}
                    onRangeChange={setLifeRange}
                    dataKeys={[
                        { key: 'haohao', color: '#ef4444', name: 'Hảo Hảo (đ/gói)', unit: ' đ' },
                        { key: 'beer', color: '#eab308', name: 'Bia Hơi (đ/cốc)', axis: 'right', unit: ' đ' }
                    ]}
                    height={300}
                />
            </div>

            {/* 2.2: ENJOYMENT - SPLIT INTO 2 CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dining */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-200">Ăn Ngon 🥢</h3>
                            <p className="text-slate-400 text-xs">Đi ăn hàng / tháng.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 text-nowrap">{latestDining.date}</p>
                            <p className="text-2xl font-bold text-orange-400">{latestDining.val} <span className="text-sm">lần</span></p>
                        </div>
                    </div>
                    <MacroChart
                        data={data}
                        selectedRange={lifeRange}
                        onRangeChange={setLifeRange}
                        dataKeys={[
                            { key: 'dining_freq', color: '#f97316', name: 'Đi ăn (lần/tháng)', unit: ' lần' }
                        ]}
                        height={300}
                    />
                </div>
                {/* Beauty */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-200">Làm Đẹp 💄</h3>
                            <p className="text-slate-400 text-xs">Chi tiêu Nhan Sắc.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 text-nowrap">{latestBeauty.date}</p>
                            <p className="text-2xl font-bold text-pink-400">{latestBeauty.val?.toFixed(1)} <span className="text-sm">Tr/năm</span></p>
                        </div>
                    </div>
                    <MacroChart
                        data={data}
                        selectedRange={lifeRange}
                        onRangeChange={setLifeRange}
                        dataKeys={[
                            { key: 'beauty_spend', color: '#ec4899', name: 'Chi làm đẹp (Tr/năm)', unit: ' Tr' }
                        ]}
                        height={300}
                    />
                </div>
            </div>
        </section>
    );
}
