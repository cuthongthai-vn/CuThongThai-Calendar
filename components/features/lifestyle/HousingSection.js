'use client';
import { useState } from 'react';
import MacroChart from '../../ui/MacroChart';

export default function HousingSection({ data }) {
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

    const latestYearsHouse = getLatest('years_to_buy');
    const latestSalaryHouse = getLatest('salary_per_sqm');
    const latestIncome = getLatest('income');
    const latestCondoPrice = getLatest('condo');

    return (
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
                        data={data}
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
                        data={data}
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
    );
}
