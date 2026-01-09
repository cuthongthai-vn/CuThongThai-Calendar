'use client';

import { useState } from 'react';

import MacroChart from '../../components/ui/MacroChart';
import CandleChart from '../../components/ui/CandleChart';
import FloatingCTA from '../../components/ui/FloatingCTA';

export default function AssetsDashboard({ data }) {
    // State for Time Ranges
    const [goldRange, setGoldRange] = useState('5Y');
    const [reRange, setReRange] = useState('5Y');
    const [phoRange, setPhoRange] = useState('5Y');

    // Helper to extract latest value
    const getLatest = (d, key) => {
        const valid = d.filter(x => x[key] !== undefined && x[key] !== null);
        if (valid.length === 0) return { value: 0, date: '' };
        const last = valid[valid.length - 1];
        return { value: Number(last[key]), date: last.date };
    };

    // Helpert to Calculate Growth
    const calculateGrowth = (dataSet, key, range) => {
        const valid = dataSet.filter(x => x[key] !== undefined && x[key] !== null);
        if (valid.length < 2) return null;

        const latest = valid[valid.length - 1];
        const latestVal = Number(latest[key]);
        const latestDate = new Date(latest.date);

        // Calculate Target Date
        const targetDate = new Date(latest.date);
        if (range === '1Y') targetDate.setFullYear(latestDate.getFullYear() - 1);
        if (range === '3Y') targetDate.setFullYear(latestDate.getFullYear() - 3);
        if (range === '5Y') targetDate.setFullYear(latestDate.getFullYear() - 5);
        if (range === '10Y') targetDate.setFullYear(latestDate.getFullYear() - 10);
        if (range === '25Y') targetDate.setFullYear(latestDate.getFullYear() - 25);
        if (range === 'ALL') return null; // Or logic for ALL?

        // Find closest data point to targetDate (but not after it ideally, or closest absolute?)
        // Since array is sorted:
        // Find first item where date >= targetDate
        const startItem = valid.find(d => new Date(d.date) >= targetDate);

        if (!startItem) return null; // No data far back enough

        const startVal = Number(startItem[key]);
        if (startVal === 0) return null;

        const growth = ((latestVal - startVal) / startVal) * 100;
        return growth;
    };

    // Render Growth Badge
    const GrowthBadge = ({ value }) => {
        if (value === null || isNaN(value)) return null;
        const isPos = value >= 0;
        return (
            <span className={`text-xs font-bold ml-2 px-1.5 py-0.5 rounded ${isPos ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isPos ? '+' : ''}{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
            </span>
        );
    };

    // Filter subsets
    const goldData = data.filter(d => d.sjc || d.world_converted || d.world_usd);
    const reData = data.filter(d => d.hn_vnd || d.hcm_vnd || d.hn_gold || d.hcm_gold);
    const phoData = data.filter(d => d.pho || d.cpi);

    // Latest Metrics & Growth
    const latestSJC = getLatest(goldData, 'sjc');
    const sjcGrowth = calculateGrowth(goldData, 'sjc', goldRange);

    const latestWorld = getLatest(goldData, 'world_converted');
    const worldGrowth = calculateGrowth(goldData, 'world_converted', goldRange);

    const latestWorldUSD = getLatest(goldData, 'world_usd');

    const latestHNVND = getLatest(reData, 'hn_vnd');
    const hnVndGrowth = calculateGrowth(reData, 'hn_vnd', reRange);

    const latestHCMVND = getLatest(reData, 'hcm_vnd');
    const hcmVndGrowth = calculateGrowth(reData, 'hcm_vnd', reRange);

    const latestHNGold = getLatest(reData, 'hn_gold');
    const hnGoldGrowth = calculateGrowth(reData, 'hn_gold', reRange);

    const latestHCMGold = getLatest(reData, 'hcm_gold');
    const hcmGoldGrowth = calculateGrowth(reData, 'hcm_gold', reRange);

    const latestPho = getLatest(phoData, 'pho');
    const phoGrowth = calculateGrowth(phoData, 'pho', phoRange);

    // VNINDEX
    const vnindexData = data.filter(d => d.vnindex);
    const latestVNINDEX = getLatest(vnindexData, 'vnindex');
    const vnindexGrowth = calculateGrowth(vnindexData, 'vnindex', goldRange);

    // --- NEW METRICS PROCESSING ---

    // 1. Gold Spread
    const goldSpreadData = goldData.map(d => {
        if (d.sjc && d.world_converted) {
            return {
                ...d,
                spread: d.sjc - d.world_converted
            };
        }
        return d;
    }).filter(d => d.spread !== undefined);
    const latestSpread = getLatest(goldSpreadData, 'spread');


    // 2. Housing Affordability (Years to Buy 50m2)
    // salary_per_sqm = Months of salary to buy 1m2
    // 50m2 cost in months = salary_per_sqm * 50
    // Years = (salary_per_sqm * 50) / 12
    const housingData = data.filter(d => d.salary_per_sqm).map(d => ({
        ...d,
        years_buy_50m2: (d.salary_per_sqm * 50) / 12
    }));
    const latestHousingYears = getLatest(housingData, 'years_buy_50m2');

    // 3. Rental Burden (% Income)
    const rentData = data.filter(d => d.rent_han_single || d.rent_sgn_single).map(d => {
        let loadHan = null;
        let loadSgn = null;

        if (d.rent_han_single && d.income_han_single) {
            loadHan = (d.rent_han_single / d.income_han_single) * 100;
        }
        if (d.rent_sgn_single && d.income_sgn_single) {
            loadSgn = (d.rent_sgn_single / d.income_sgn_single) * 100;
        }

        return {
            ...d,
            burden_han: loadHan,
            burden_sgn: loadSgn
        };
    });
    const latestBurdenHan = getLatest(rentData, 'burden_han');
    const latestBurdenSgn = getLatest(rentData, 'burden_sgn');

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10 pb-[500px]">


            <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">

                <div className="text-center py-5">
                    <h1 className="text-3xl font-bold text-theme-yellow mb-2">Tài Sản & Giá Cả</h1>
                    <p className="text-slate-400">Theo dõi biến động Vàng, Chứng Khoán và Bất Động Sản qua các thời kỳ</p>
                </div>

                {/* SECTION 0: VNINDEX (NEW) */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="bg-green-500 w-1 h-6 mr-3 rounded-full"></span>
                            Chứng Khoán (VNINDEX)
                        </h2>
                        <div className="flex gap-4 mt-2 md:mt-0 text-right">
                            <div>
                                <p className="text-xs text-slate-400">Điểm số ({latestVNINDEX.date})</p>
                                <div className="flex items-center justify-end">
                                    <p className="text-lg font-bold text-green-400">{latestVNINDEX.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                                    <GrowthBadge value={vnindexGrowth} />
                                </div>
                            </div>
                        </div>

                        <CandleChart
                            chartId="vnindex"
                            data={vnindexData.map(d => ({
                                date: d.date,
                                open: d.vnindex_open || d.vnindex, // Fallback
                                high: d.vnindex_high || d.vnindex,
                                low: d.vnindex_low || d.vnindex,
                                close: d.vnindex,
                                volume: d.vnindex_vol
                            }))}
                            height={400}
                        />
                </section >

                {/* SECTION 1: GOLD */}
                < section >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="bg-yellow-500 w-1 h-6 mr-3 rounded-full"></span>
                            Thị Trường Vàng
                        </h2>
                        <div className="flex gap-4 mt-2 md:mt-0 text-right">
                            <div>
                                <p className="text-xs text-slate-400">SJC ({latestSJC.date})</p>
                                <div className="flex items-center justify-end">
                                    <p className="text-lg font-bold text-amber-400">{latestSJC.value?.toLocaleString()} Tr</p>
                                    <GrowthBadge value={sjcGrowth} />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Thế Giới ({latestWorld.date})</p>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold text-slate-300">{latestWorld.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })} Tr</span>
                                        <GrowthBadge value={worldGrowth} />
                                    </div>
                                    <span className="text-xs text-cyan-400">${latestWorldUSD.value?.toLocaleString()} / oz</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <MacroChart
                        chartId="gold"
                        data={goldData}
                        selectedRange={goldRange}
                        onRangeChange={setGoldRange}
                        dataKeys={[
                            { key: 'sjc', color: '#fbbf24', name: 'Vàng SJC (Tr)', unit: ' Tr' },
                            { key: 'world_converted', color: '#94a3b8', name: 'TG Quy đổi (Tr)', unit: ' Tr' },
                            { key: 'world_usd', color: '#22d3ee', name: 'TG (USD/oz)', yAxisId: 'right', unit: ' $' }
                        ]}
                        height={400}
                    />
                </section >

                {/* SECTION 2: REAL ESTATE */}
                < section >
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* VND */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <span className="bg-blue-500 w-1 h-6 mr-3 rounded-full"></span>
                                    Giá Đất (Triệu/m2)
                                </h2>
                            </div>
                            <div className="flex justify-end gap-4 mb-2">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Hà Nội</p>
                                    <div className="flex items-center justify-end">
                                        <p className="text-base font-bold text-blue-400">{latestHNVND.value?.toLocaleString()}</p>
                                        <GrowthBadge value={hnVndGrowth} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">TP.HCM</p>
                                    <div className="flex items-center justify-end">
                                        <p className="text-base font-bold text-pink-400">{latestHCMVND.value?.toLocaleString()}</p>
                                        <GrowthBadge value={hcmVndGrowth} />
                                    </div>
                                </div>
                            </div>
                            <MacroChart
                                chartId="re-vnd"
                                data={reData}
                                selectedRange={reRange}
                                onRangeChange={setReRange}
                                dataKeys={[
                                    { key: 'hn_vnd', color: '#60a5fa', name: 'Hà Nội' },
                                    { key: 'hcm_vnd', color: '#f472b6', name: 'TP.HCM' }
                                ]}
                                height={350}
                            />
                        </div>
                        {/* GOLD */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <span className="bg-amber-600 w-1 h-6 mr-3 rounded-full"></span>
                                    Giá Đất (Cây Vàng/m2)
                                </h2>
                            </div>
                            <div className="flex justify-end gap-4 mb-2">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Hà Nội</p>
                                    <div className="flex items-center justify-end">
                                        <p className="text-base font-bold text-amber-500">{latestHNGold.value?.toLocaleString()}</p>
                                        <GrowthBadge value={hnGoldGrowth} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">TP.HCM</p>
                                    <div className="flex items-center justify-end">
                                        <p className="text-base font-bold text-orange-600">{latestHCMGold.value?.toLocaleString()}</p>
                                        <GrowthBadge value={hcmGoldGrowth} />
                                    </div>
                                </div>
                            </div>
                            <MacroChart
                                chartId="re-gold"
                                data={reData}
                                selectedRange={reRange}
                                onRangeChange={setReRange}
                                dataKeys={[
                                    { key: 'hn_gold', color: '#d97706', name: 'Hà Nội' },
                                    { key: 'hcm_gold', color: '#b45309', name: 'TP.HCM' }
                                ]}
                                height={350}
                            />
                        </div>
                    </div>
                </section >

                {/* SECTION 3: GOLD SPREAD (NEW) */}
                < section >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="bg-red-500 w-1 h-6 mr-3 rounded-full"></span>
                            Chênh Lệch Giá Vàng (Spread)
                        </h2>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Chênh SJC - TG ({latestSpread.date})</p>
                            <p className="text-lg font-bold text-red-500">{latestSpread.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })} Tr/Lượng</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 italic">
                        * Số tiền "chênh" bạn phải trả thêm cho mỗi lượng vàng SJC so với giá thế giới quy đổi.
                    </p>
                    <MacroChart
                        chartId="gold-spread"
                        data={goldSpreadData}
                        dataKeys={[
                            { key: 'spread', color: '#ef4444', name: 'Chênh Lệch (Tr)', type: 'area' }
                        ]}
                        height={300}
                    />
                </section >

                {/* SECTION 4: HOUSING AFFORDABILITY (NEW) */}
                < section >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="bg-emerald-500 w-1 h-6 mr-3 rounded-full"></span>
                            Khả Năng Mua Nhà (50m2)
                        </h2>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Số năm thu nhập ({latestHousingYears.date})</p>
                            <p className="text-lg font-bold text-emerald-400">{latestHousingYears.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })} Năm</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 italic">
                        * Số năm cần tích lũy 100% thu nhập trung bình để mua được căn hộ 50m2.
                    </p>
                    <MacroChart
                        chartId="housing"
                        data={housingData}
                        dataKeys={[
                            { key: 'years_buy_50m2', color: '#10b981', name: 'Số Năm Cần Thiết' }
                        ]}
                        height={300}
                    />
                </section >

                {/* SECTION 5: RENTAL BURDEN (NEW) */}
                < section >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                            Áp Lực Tiền Thuê (% Thu Nhập)
                        </h2>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Hà Nội</p>
                                <p className="text-base font-bold text-purple-400">{latestBurdenHan.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })}%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">TP.HCM</p>
                                <p className="text-base font-bold text-pink-400">{latestBurdenSgn.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })}%</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 italic">
                        * Tỷ lệ chi phí thuê nhà trên thu nhập hàng tháng (Người độc thân).
                    </p>
                    <MacroChart
                        chartId="rent-burden"
                        data={rentData}
                        dataKeys={[
                            { key: 'burden_han', color: '#a855f7', name: 'Hà Nội (%)' },
                            { key: 'burden_sgn', color: '#ec4899', name: 'TP.HCM (%)' }
                        ]}
                        height={300}
                    />
                </section >
            </div >

            {/* SPACER DIV TO PREVENT OVERLAP */}
            < div style={{ height: '300px' }
            } className="w-full" ></div >

            <FloatingCTA />
        </div >
    );
}
