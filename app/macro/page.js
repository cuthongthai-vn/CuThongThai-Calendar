import { createClient } from '@supabase/supabase-js';
import MacroChart from '../../components/ui/MacroChart';
import MacroHeader from '../../components/features/macro/MacroHeader';
import FloatingCTA from '../../components/ui/FloatingCTA';
import TradeBalanceSection from '../../components/features/macro/TradeBalanceSection';
import ReservesHealthSection from '../../components/features/macro/ReservesHealthSection';
import FDIStructureSection from '../../components/features/macro/FDIStructureSection';
import PolicyStanceSection from '../../components/features/macro/PolicyStanceSection';
import DebtSustainabilitySection from '../../components/features/macro/DebtSustainabilitySection';
import OverheatingMonitorSection from '../../components/features/macro/OverheatingMonitorSection';

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ searchParams }) {
    const charId = searchParams?.chart;

    const TITLES = {
        'exchange-rate': 'Tỷ Giá USD/VND',
        'rates': 'Lãi Suất & Tiết Kiệm',
        'gdp-abs': 'Quy Mô GDP Việt Nam',
        'gdp-cpi': 'Tăng Trưởng GDP & Lạm Phát',
    };

    const title = charId && TITLES[charId]
        ? `${TITLES[charId]} | Cú Thông Thái`
        : 'Vĩ Mô Việt Nam | Cú Thông Thái';

    return {
        title: title,
        description: 'Dữ liệu kinh tế vĩ mô Việt Nam cập nhật liên tục: GDP, CPI, Tỷ giá, Lãi suất.',
        openGraph: {
            title: title,
            images: [`/api/og?chart=${charId || 'macro'}`],
        },
    };
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ... (pivotData) ...

export default async function MacroPage() {
    // Robust Fetching Strategy: Loop to bypass 1000-row API limits
    let allRows = [];
    let from = 0;
    const step = 1000;
    let keepFetching = true;

    // OPTIMIZED: Only fetch Macro-related keys
    const filterStr = 'indicator_key.eq.USDVND_OFFICIAL,' +
        'indicator_key.eq.USDVND_BLACK_MARKET,' +
        'indicator_key.eq.VN_GDP_YOY,' +
        'indicator_key.eq.VN_GDP_ABS_BUSD,' +
        'indicator_key.eq.VN_CPI_YOY,' +
        'indicator_key.eq.VN_INTEREST_RATE,' +
        'indicator_key.eq.VN_SAVINGS_RATE_12M';

    while (keepFetching) {
        const { data, error } = await supabase
            .from('macro_indicators')
            .select('date, indicator_key, value')
            .or(filterStr) // Apply Filter
            .order('date', { ascending: true })
            .range(from, from + step - 1);

        if (error) {
            console.error('Error loading data chunk:', error.message);
            return <div className="text-red-500 p-10">Error loading data: {error.message}</div>;
        }

        if (data && data.length > 0) {
            allRows = [...allRows, ...data];
            from += step;
            if (data.length < step) {
                keepFetching = false;
            }
        } else {
            keepFetching = false;
        }
    }

    // Alias for compatibility with existing code
    const rawData = allRows;
    console.log(`[MacroPage] Total Raw Rows Fetched: ${rawData.length}`);

    // Helper to interpolate data (Linear fill + Forward fill)
    const interpolateData = (data, key) => {
        let lastIndex = -1;
        // Find first valid
        for (let i = 0; i < data.length; i++) {
            if (data[i][key] !== undefined && data[i][key] !== null) {
                lastIndex = i;
                break;
            }
        }
        if (lastIndex === -1) return data;

        for (let i = lastIndex + 1; i < data.length; i++) {
            if (data[i][key] !== undefined && data[i][key] !== null) {
                const startVal = data[lastIndex][key];
                const endVal = data[i][key];
                const steps = i - lastIndex;
                const stepValue = (endVal - startVal) / steps;
                for (let j = 1; j < steps; j++) {
                    data[lastIndex + j][key] = startVal + (stepValue * j);
                }
                lastIndex = i;
            }
        }
        // Forward fill
        if (lastIndex < data.length - 1) {
            const lastVal = data[lastIndex][key];
            for (let i = lastIndex + 1; i < data.length; i++) {
                data[i][key] = lastVal;
            }
        }
        return data;
    };

    let chartData = pivotData(rawData);
    console.log(`[MacroPage] Loaded ${chartData.length} rows`);

    // Interpolate to fill gaps (Quarterly GDP vs Monthly CPI, erratic Forex)
    chartData = interpolateData(chartData, 'official');
    chartData = interpolateData(chartData, 'black_market');
    chartData = interpolateData(chartData, 'gdp');
    chartData = interpolateData(chartData, 'cpi');
    chartData = interpolateData(chartData, 'ref_rate');
    chartData = interpolateData(chartData, 'savings_rate');

    // Filter subsets for specific charts

    // 1. Forex: Filter out days where NO forex data exists at all
    // Pass FULL history, MacroChart handles time-range slicing now.
    const forexData = chartData.filter(d => d.official || d.black_market);

    // 2. GDP Growth & CPI
    const econData = chartData.filter(d => d.gdp !== undefined || d.cpi !== undefined);

    // 3. GDP Absolute (Billion USD)
    const gdpAbsData = chartData.filter(d => d.gdp_abs !== undefined);

    // 4. Interest Rates
    const ratesData = chartData.filter(d => d.ref_rate !== undefined || d.savings_rate !== undefined);


    // Helper to get latest valid value and date for a key
    const getLatest = (key) => {
        // Iterate backwards to find latest non-null
        for (let i = chartData.length - 1; i >= 0; i--) {
            if (chartData[i][key] !== undefined && chartData[i][key] !== null) {
                return { value: chartData[i][key], date: chartData[i].date };
            }
        }
        return { value: 'N/A', date: '' };
    };

    const latestOfficial = getLatest('official');
    const latestBlackMarket = getLatest('black_market');
    const latestRefRate = getLatest('ref_rate');
    const latestSavings = getLatest('savings_rate');
    const latestGdpAbs = getLatest('gdp_abs');
    const latestGdp = getLatest('gdp');
    const latestCpi = getLatest('cpi');

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10 pb-[500px]">
            <MacroHeader activeTab="macro" />

            <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">

                {/* --- PART I: MARKET INDICATORS --- */}
                <h3 className="text-2xl font-bold text-slate-200 mb-8 border-l-4 border-green-500 pl-4 uppercase">
                    I. Chỉ Số Thị Trường (Market Indicators)
                </h3>

                {/* SECTION 1: EXCHANGE RATE */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="bg-green-500 w-1 h-6 mr-3 rounded-full"></span>
                            Tỷ Giá USD/VND
                        </h2>
                        <div className="flex gap-4 mt-2 md:mt-0">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Chợ Đen ({latestBlackMarket.date})</p>
                                <p className="text-lg font-bold text-amber-400">{latestBlackMarket.value?.toLocaleString()} ₫</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Ngân Hàng ({latestOfficial.date})</p>
                                <p className="text-lg font-bold text-blue-400">{latestOfficial.value?.toLocaleString()} ₫</p>
                            </div>
                        </div>
                    </div>
                    <MacroChart
                        data={forexData}
                        dataKeys={[
                            { key: 'black_market', color: '#fbbf24', name: 'Chợ Đen' },
                            { key: 'official', color: '#3b82f6', name: 'Ngân Hàng' }
                        ]}
                        height={400}
                    />

                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* SECTION 2: INTEREST RATES */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                                Lãi Suất (%)
                                <ShareButton chartId="rates" className="ml-3" />
                            </h2>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Tiết Kiệm 12T ({latestSavings.date})</p>
                                <p className="text-lg font-bold text-pink-500">{latestSavings.value}%</p>
                            </div>
                        </div>
                        <MacroChart
                            data={ratesData}
                            dataKeys={[
                                { key: 'ref_rate', color: '#a855f7', name: 'Điều hành (SBV)' },
                                { key: 'savings_rate', color: '#ec4899', name: 'Tiết kiệm 12T' }
                            ]}
                        />
                    </section>

                    {/* SECTION 3: GDP SIZE (ABSOLUTE) */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <span className="bg-emerald-500 w-1 h-6 mr-3 rounded-full"></span>
                                Quy Mô GDP (Tỷ USD)
                                <ShareButton chartId="gdp-abs" className="ml-3" />
                            </h2>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Năm {latestGdpAbs.date?.substring(0, 4)}</p>
                                <p className="text-lg font-bold text-emerald-400">{latestGdpAbs.value} Tỷ $</p>
                            </div>
                        </div>
                        <MacroChart
                            data={gdpAbsData}
                            dataKeys={[
                                { key: 'gdp_abs', color: '#10b981', name: 'GDP (Tỷ $)', unit: 'B$' }
                            ]}
                        />
                    </section>

                    {/* SECTION 4: GDP GROWTH & INFLATION */}
                    <section className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <span className="bg-cyan-500 w-1 h-6 mr-3 rounded-full"></span>
                                Tăng Trưởng & Lạm Phát (%)
                                <ShareButton chartId="gdp-cpi" className="ml-3" />
                            </h2>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">GDP ({latestGdp.date})</p>
                                    <p className="text-lg font-bold text-cyan-400">{latestGdp.value}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">CPI ({latestCpi.date})</p>
                                    <p className="text-lg font-bold text-orange-500">{latestCpi.value}%</p>
                                </div>
                            </div>
                        </div>
                        <MacroChart
                            data={econData}
                            dataKeys={[
                                { key: 'gdp', color: '#06b6d4', name: 'GDP (YoY)' },
                                { key: 'cpi', color: '#f97316', name: 'CPI (Lạm phát)' }
                            ]}
                        />
                    </section>
                </div>

                {/* --- PART II: MACRO BALANCE NEW SECTION --- */}
                <div className="mt-16 mb-8 border-t border-slate-800 pt-8">
                    <h3 className="text-2xl font-bold text-slate-200 mb-8 border-l-4 border-yellow-500 pl-4 uppercase">
                        II. Sức Khỏe & Cân Đối Vĩ Mô (Stability)
                    </h3>

                    <TradeBalanceSection />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ReservesHealthSection />
                        <FDIStructureSection />
                    </div>
                </div>

                {/* --- PART III: POLICY & HEALTH NEW SECTION --- */}
                <div className="mt-16 mb-8 border-t border-slate-800 pt-8">
                    <h3 className="text-2xl font-bold text-slate-200 mb-8 border-l-4 border-pink-500 pl-4 uppercase">
                        III. Chính Sách & Sức Bền (Policy & Health)
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PolicyStanceSection />
                        <OverheatingMonitorSection />
                    </div>
                    <DebtSustainabilitySection />
                </div>
            </div>


            {/* --- SOURCE FOOTER --- */}
            <div className="text-center text-slate-600 text-xs md:text-sm mt-12 mb-4 italic">
                ** Nguồn dữ liệu: World Bank (WB), IMF, Tổng cục Thống kê (GSO), Ngân hàng Nhà nước (SBV) và Tổng hợp.
            </div>

            {/* SPACER DIV TO PREVENT OVERLAP */}
            <div style={{ height: '300px' }} className="w-full"></div>

            <FloatingCTA />
        </div>
    );
}
