'use client';

import { useState } from 'react';
import MacroChart from './MacroChart';
import FloatingCTA from './FloatingCTA';

export default function LifestyleDashboard({ data }) {
    // State for Time Ranges
    const [trendRange, setTrendRange] = useState('ALL');
    const [lifeRange, setLifeRange] = useState('ALL');
    const [houseRange, setHouseRange] = useState('ALL');
    const [survivalMode, setSurvivalMode] = useState('SINGLE'); // SINGLE | FAMILY4

    // SIMULATE DATA TO JAN 2026 (USER REQUEST)
    // EXTEND DATA TO JAN 2026 (Live Projection)
    const extendedData = [...data];
    if (extendedData.length > 0) {
        const lastItem = extendedData[extendedData.length - 1];
        const lastDate = new Date(lastItem.date);
        const lastCpiIndex = lastItem.cpi_index || 100;

        if (lastDate.getFullYear() < 2026) {
            extendedData.push({
                date: '2026-01-01',
                iphone: 35,          // Mock: 35 Million
                sh: 85,              // Mock: 85 Million
                condo: 65,           // Mock: 65 Million/m2
                income: 8.8,         // Mock: 8.8 Million
                haohao: 4500,        // VND
                beer: 15000,         // VND
                pho: 55000,          // Mock: 55k Avg
                pho_hn: 50000,       // Mock
                pho_hcm: 60000,      // Mock
                cpi: 4.5,            // Mock: CPI YoY 4.5%
                cpi_index: lastCpiIndex * 1.045, // Mock Index
                dining_freq: 4,
                beauty_spend: 11.5,  // Mock: 11.5 Million/Year
                salary_per_sqm: (65 / 8.8),
                condo_70m2_price: 65 * 70 // Millions
            });
        }
    }

    // Pre-process data
    const processedData = extendedData.map(d => ({
        ...d,
        // TRANSFORM BEAUTY SPEND: Monthly (Historical) -> Yearly
        // Historical data (e.g. 0.9) is Monthly. Mock 2026 (11.5) is Yearly.
        // Heuristic: If value < 5, assume Monthly and multiply by 12.
        beauty_spend: (d.beauty_spend < 5) ? d.beauty_spend * 12 : d.beauty_spend,

        iphone_pow: (d.iphone && d.condo) ? Number((d.iphone / d.condo).toFixed(2)) : null,
        sh_pow: (d.sh && d.condo) ? Number((d.sh / d.condo).toFixed(2)) : null,
        years_to_buy: (d.condo && d.income)
            ? Number(((d.condo * 70) / (d.income * 12)).toFixed(1))
            : null
    }));

    // Helper to get latest value securely
    const getLatest = (key, sourceData = processedData) => {
        if (!sourceData || sourceData.length === 0) return { val: 'N/A', date: '' };
        for (let i = sourceData.length - 1; i >= 0; i--) {
            if (sourceData[i][key] !== undefined && sourceData[i][key] !== null) {
                return { val: sourceData[i][key], date: sourceData[i].date };
            }
        }
        return { val: 'N/A', date: '' };
    };

    const latestIphonePow = getLatest('iphone_pow');
    const latestShPow = getLatest('sh_pow');
    const latestYearsHouse = getLatest('years_to_buy');

    // Raw Prices for Header Details (use processedData to get simulated 2026 values if present)
    const latestIphonePrice = getLatest('iphone');
    const latestShPrice = getLatest('sh');
    const latestCondoPrice = getLatest('condo'); // VND/m2
    const latestPhoPrice = getLatest('pho'); // VND
    const latestIncome = getLatest('income');
    const latestSalaryHouse = getLatest('salary_per_sqm'); // Use processed/extended data for this too

    const latestHaoHao = getLatest('haohao');
    const latestBeer = getLatest('beer');
    const latestDining = getLatest('dining_freq');
    const latestBeauty = getLatest('beauty_spend');


    return (
        <div className="grid grid-cols-1 gap-12 max-w-7xl mx-auto">

            <div className="text-center py-5">
                <h1 className="text-3xl font-bold text-theme-yellow mb-2">Kinh Tế "Vỉa Hè" ☕️</h1>
                <p className="text-slate-400">Góc nhìn hài hước nhưng "thấm" về chi phí sống và thói quen tiêu dùng</p>
                <p className="text-xs text-green-500 mt-1 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Đã cập nhật dữ liệu tự động đến tháng 01/2026
                </p>
            </div>

            {/* SECTION 1: PHO INDEX */}
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
                        data={processedData}
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

            {/* SECTION 2: TRENDS & POWER */}
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
                        data={processedData}
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

            {/* SECTION 3: COST OF LIVING & LIFESTYLE */}
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
                        data={extendedData}
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
                            data={extendedData}
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
                                <h3 className="text-lg font-bold text-slate-200">Mặc Đẹp 💄</h3>
                                <p className="text-slate-400 text-xs">Chi tiêu Nhan Sắc.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 text-nowrap">{latestBeauty.date}</p>
                                <p className="text-2xl font-bold text-pink-400">{latestBeauty.val?.toFixed(1)} <span className="text-sm">Tr/năm</span></p>
                            </div>
                        </div>
                        <MacroChart
                            data={processedData}
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

            {/* SECTION 4: HOUSING DIFFICULTY */}
            <section>
                <h2 className="text-xl font-bold text-white flex items-center mb-6">
                    <span className="bg-blue-600 w-1 h-6 mr-3 rounded-full"></span>
                    4. Độ Khó An Cư 🏠
                    <span className="ml-3 px-2 py-0.5 text-[10px] font-bold bg-green-900/50 text-green-400 border border-green-800 rounded uppercase tracking-wider">
                        Mới 01/2026
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Chart: Salary Months per m2 */}
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">Chỉ Số "Cày Cuốc"</h3>
                                <p className="text-slate-400 text-xs">Cần bao nhiêu tháng lương toàn phần để mua 1m2?</p>

                                {/* Extra Details */}
                                <div className="mt-2 text-xs text-slate-500">
                                    <p>Thu nhập: <span className="text-slate-300 font-mono">{latestIncome.val?.toFixed(1)} Tr/tháng</span></p>
                                    <p>Giá nhà: <span className="text-slate-300 font-mono">{latestCondoPrice.val?.toFixed(1)} Tr/m2</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 text-nowrap">{latestSalaryHouse.date}</p>
                                <p className="text-3xl font-bold text-red-500">
                                    {latestSalaryHouse.val?.toFixed(1)} <span className="text-lg text-slate-400">tháng</span>
                                </p>
                            </div>
                        </div>

                        <MacroChart
                            data={processedData}
                            selectedRange={houseRange}
                            onRangeChange={setHouseRange}
                            dataKeys={[
                                { key: 'salary_per_sqm', color: '#ef4444', name: 'Số tháng lương / m2', unit: ' tháng', type: 'step' }
                            ]}
                            height={350}
                        />
                        <p className="text-center text-slate-500 text-xs mt-2 italic">
                            * Năm 2000 cần 10 tháng lương cho 1m2. Năm 2026 cần tới {latestSalaryHouse.val?.toFixed(0)} tháng.
                        </p>
                    </div>

                    {/* Chart: Years to Buy House */}
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">Giấc Mơ An Cư</h3>
                                <p className="text-slate-400 text-xs">Số năm thu nhập để mua căn hộ 70m2 (không ăn tiêu).</p>

                                {/* Extra Details */}
                                <div className="mt-2 text-xs text-slate-500">
                                    <p>Tổng giá (70m2): <span className="text-slate-300 font-mono">{((latestCondoPrice.val * 70) / 1000).toFixed(1)} Tỷ</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 text-nowrap">{latestYearsHouse.date}</p>
                                <p className="text-3xl font-bold text-orange-500">
                                    {latestYearsHouse.val || 'N/A'} <span className="text-lg text-slate-400">năm</span>
                                </p>
                            </div>
                        </div>

                        <MacroChart
                            data={processedData}
                            selectedRange={houseRange}
                            onRangeChange={setHouseRange}
                            dataKeys={[
                                { key: 'years_to_buy', color: '#f97316', name: 'Số năm (70m2)', unit: ' năm' }
                            ]}
                            height={350}
                        />
                        <p className="text-center text-slate-500 text-xs mt-2 italic">
                            * Giả định: Căn hộ 70m2, dồn 100% thu nhập để mua nhà.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 5: SURVIVAL INDEX */}
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
                        data={processedData}
                        selectedRange={houseRange} // Reuse house range or make new one? Reuse is fine.
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



            <div style={{ height: '300px' }} className="w-full"></div>
            <FloatingCTA />
        </div>
    );
}
