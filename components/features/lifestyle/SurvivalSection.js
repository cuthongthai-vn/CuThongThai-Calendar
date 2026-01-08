'use client';
import { useState } from 'react';
import MacroChart from '../../ui/MacroChart';

export default function SurvivalSection({ data }) {
    const [survivalMode, setSurvivalMode] = useState('SINGLE'); // SINGLE | FAMILY4
    const [houseRange, setHouseRange] = useState('ALL');

    const getLatest = (key) => {
        if (!data || data.length === 0) return { val: 'N/A', date: '' };
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i][key] !== undefined && data[i][key] !== null) {
                return { val: data[i][key], date: data[i].date };
            }
        }
        return { val: 'N/A', date: '' };
    };

    return (
        <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="bg-emerald-500 w-1 h-6 mr-3 rounded-full"></span>
                    5. Chỉ Số Sinh Tồn (Survival Index) ☠️
                    <span className="ml-3 px-2 py-0.5 text-[10px] font-bold bg-green-900/50 text-green-400 border border-green-800 rounded uppercase tracking-wider">
                        Mới 01/2026
                    </span>
                </h2>

                {/* Toggle */}
                <div className="bg-gray-800 p-1 rounded-lg flex mt-2 md:mt-0">
                    <button
                        onClick={() => setSurvivalMode('SINGLE')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${survivalMode === 'SINGLE' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Độc Thân
                    </button>
                    <button
                        onClick={() => setSurvivalMode('FAMILY4')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${survivalMode === 'FAMILY4' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Gia Đình (4 người)
                    </button>
                </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-200">
                            {survivalMode === 'SINGLE' ? 'Cuộc Chiến Sinh Tồn (1 Người)' : 'Gánh Nặng Gia Đình (4 Người)'}
                        </h3>
                        <div className="bg-slate-800/50 p-3 rounded-lg mt-2 max-w-2xl border border-slate-700/50">
                            <p className="text-emerald-400 font-bold text-xs mb-1">🦉 Góc nhìn Cú Thông Thái:</p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                <strong>Survival Index</strong> là thước đo độ "khó thở" của ví tiền. <br />
                                📐 <em>Công thức = (Tổng Chi Phí Ăn Ở Đi Lại... / Tổng Thu Nhập)</em> <br />
                                <span className="text-red-400 font-bold">🔴 {'>'} 100% (Thở Oxy)</span>: Thu không đủ chi, phải "bào" tiền tiết kiệm hoặc vay mượn. <br />
                                <span className="text-emerald-400 font-bold">🟢 {'<'} 70% (Dễ Thở)</span>: Chúc mừng, bạn đang hít thở bầu không khí tự do tài chính!
                            </p>
                        </div>
                    </div>

                    {/* 2025 Ranking Mini-Board */}
                    <div className="mt-4 md:mt-0 flex gap-4 text-xs">
                        <div className="bg-red-500/10 border border-red-500/30 p-2 rounded">
                            <p className="text-red-400 font-bold mb-1">🔥 Khó Sống Nhất 2025</p>
                            {(() => {
                                const mode = survivalMode.toLowerCase();
                                const citiesRaw = [
                                    { code: 'sgn', name: 'TP.HCM' },
                                    { code: 'han', name: 'Hà Nội' },
                                    { code: 'dad', name: 'Đà Nẵng' },
                                    { code: 'hph', name: 'Hải Phòng' },
                                    { code: 'bdg', name: 'Bình Dương' },
                                    { code: 'vca', name: 'Cần Thơ' },
                                ];
                                const cities = citiesRaw.map(c => ({
                                    name: c.name,
                                    val: getLatest(`${c.code}_${mode}_index`).val
                                })).filter(c => typeof c.val === 'number').sort((a, b) => b.val - a.val);

                                const top = cities[0] || { name: 'N/A', val: 0 };

                                return (
                                    <div>
                                        <span className="text-slate-200 font-bold">1. {top.name}</span>
                                        <span className="text-red-400 ml-2">{top.val.toFixed(0)}%</span>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded">
                            <p className="text-emerald-400 font-bold mb-1">🌿 Dễ Thở Nhất 2025</p>
                            {(() => {
                                const mode = survivalMode.toLowerCase();
                                const citiesRaw = [
                                    { code: 'sgn', name: 'TP.HCM' },
                                    { code: 'han', name: 'Hà Nội' },
                                    { code: 'dad', name: 'Đà Nẵng' },
                                    { code: 'hph', name: 'Hải Phòng' },
                                    { code: 'bdg', name: 'Bình Dương' },
                                    { code: 'vca', name: 'Cần Thơ' },
                                ];
                                const cities = citiesRaw.map(c => ({
                                    name: c.name,
                                    val: getLatest(`${c.code}_${mode}_index`).val
                                })).filter(c => typeof c.val === 'number').sort((a, b) => a.val - b.val); // Ascending

                                const top = cities[0] || { name: 'N/A', val: 0 };

                                return (
                                    <div>
                                        <span className="text-slate-200 font-bold">1. {top.name}</span>
                                        <span className="text-emerald-400 ml-2">{top.val.toFixed(0)}%</span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <MacroChart
                    data={data}
                    selectedRange={houseRange} // Reuse house range for now
                    onRangeChange={setHouseRange}
                    dataKeys={[
                        { key: `sgn_${survivalMode.toLowerCase()}_index`, color: '#8b5cf6', name: 'TP.HCM', unit: '%' },
                        { key: `han_${survivalMode.toLowerCase()}_index`, color: '#ef4444', name: 'Hà Nội', unit: '%' },
                        { key: `dad_${survivalMode.toLowerCase()}_index`, color: '#06b6d4', name: 'Đà Nẵng', unit: '%' },
                        { key: `bdg_${survivalMode.toLowerCase()}_index`, color: '#eab308', name: 'Bình Dương', unit: '%' },
                        { key: `hph_${survivalMode.toLowerCase()}_index`, color: '#f97316', name: 'Hải Phòng', unit: '%' },
                        { key: `vca_${survivalMode.toLowerCase()}_index`, color: '#22c55e', name: 'Cần Thơ', unit: '%' },
                    ]}
                    height={400}
                    referenceLines={[
                        { y: 100, label: 'Ngưỡng Chết (100%)', color: '#ef4444' }
                    ]}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-black/30 p-3 rounded text-xs text-slate-400">
                        <strong>💡 Bất ngờ nhẹ 1:</strong> Người độc thân ở <span className="text-red-400">Hà Nội & HCM</span> gần như "không thể sống" nếu không có hỗ trợ (Index &gt; 120%).
                    </div>
                    <div className="bg-black/30 p-3 rounded text-xs text-slate-400">
                        <strong>💡 Bất ngờ nhẹ 2:</strong> <span className="text-emerald-400">Cần Thơ</span> là "thiên đường" với chi phí rẻ hơn 40-50% so với trung tâm.
                    </div>
                    <div className="bg-black/30 p-3 rounded text-xs text-slate-400">
                        <strong>💡 Bất ngờ nhẹ 3:</strong> Năm 2025, gia đình 4 người ở <span className="text-red-400">HCM</span> lần đầu tiên tiêu vượt thu nhập (105%).
                    </div>
                </div>
            </div>
        </section>
    );
}
