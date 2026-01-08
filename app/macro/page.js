import { createClient } from '@supabase/supabase-js';
import MacroChart from '../../components/MacroChart';
import MacroHeader from '../../components/MacroHeader';
import FloatingCTA from '../../components/FloatingCTA';

export const dynamic = 'force-dynamic'; // Disable caching to fetch fresh data on every request

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Helper to pivot data: { '2024-01-01': { date: '...', USD: 25000, ... } }
const pivotData = (rows) => {
    const map = {};
    rows.forEach(r => {
        // Normalize date to YYYY-MM-DD
        const dateStr = r.date.split('T')[0];
        if (!map[dateStr]) map[dateStr] = { date: dateStr };

        // Map indicator keys to simplified props
        if (r.indicator_key === 'USDVND_OFFICIAL') map[dateStr].official = Number(r.value);
        if (r.indicator_key === 'USDVND_BLACK_MARKET') map[dateStr].black_market = Number(r.value);
        if (r.indicator_key === 'VN_GDP_YOY') map[dateStr].gdp = Number(r.value);
        if (r.indicator_key === 'VN_GDP_ABS_BUSD') map[dateStr].gdp_abs = Number(r.value);
        if (r.indicator_key === 'VN_CPI_YOY') map[dateStr].cpi = Number(r.value);
        if (r.indicator_key === 'VN_INTEREST_RATE') map[dateStr].ref_rate = Number(r.value);
        if (r.indicator_key === 'VN_SAVINGS_RATE_12M') map[dateStr].savings_rate = Number(r.value);
    });
    // Convert to sorted array
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export default async function MacroPage() {
    // Robust Fetching Strategy: Loop to bypass 1000-row API limits
    let allRows = [];
    let from = 0;
    const step = 1000;
    let keepFetching = true;

    while (keepFetching) {
        const { data, error } = await supabase
            .from('macro_indicators')
            .select('*')
            .order('date', { ascending: true })
            .range(from, from + step - 1);

        if (error) {
            console.error('Error loading data chunk:', error.message);
            return <div className="text-red-500 p-10">Error loading data: {error.message}</div>;
        }

        if (data && data.length > 0) {
            allRows = [...allRows, ...data];
            from += step;
            // If we got fewer than 'step', we are done
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

    const chartData = pivotData(rawData);
    console.log(`[MacroPage] Loaded ${chartData.length} rows`);
    if (chartData.length > 0) {
        console.log(`[MacroPage] First Date: ${chartData[0].date}`);
        console.log(`[MacroPage] Last Date: ${chartData[chartData.length - 1].date}`);
        console.log(`[MacroPage] Last Item:`, JSON.stringify(chartData[chartData.length - 1]));
    }

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
            </div>

            {/* SPACER DIV TO PREVENT OVERLAP */}
            <div style={{ height: '300px' }} className="w-full"></div>

            <FloatingCTA />
        </div>
    );
}
