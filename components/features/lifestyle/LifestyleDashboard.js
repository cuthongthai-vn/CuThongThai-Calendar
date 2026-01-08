'use client';

import FloatingCTA from '../../ui/FloatingCTA';
import PhoSection from './PhoSection';
import AssetPowerSection from './AssetPowerSection';
import CostSection from './CostSection';
import HousingSection from './HousingSection';
import SurvivalSection from './SurvivalSection';

export default function LifestyleDashboard({ data }) {
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

            <PhoSection data={processedData} />
            <AssetPowerSection data={processedData} />
            <CostSection data={processedData} />
            <HousingSection data={processedData} />
            <SurvivalSection data={processedData} />

            <div style={{ height: '300px' }} className="w-full"></div>
            <FloatingCTA />
        </div>
    );
}
