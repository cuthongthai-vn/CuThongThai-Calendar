import { getSupabaseClient } from '@/lib/supabase/client';
import AssetsDashboard from './AssetsDashboard';

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ searchParams }) {
    const charId = searchParams?.chart;

    const TITLES = {
        'vnindex': 'Biểu Đồ VNINDEX',
        'gold': 'Giá Vàng SJC & Thế Giới',
        're-vnd': 'Giá Bất Động Sản (VND)',
        'housing': 'Khả Năng Mua Nhà',
        'rent-burden': 'Áp Lực Thuê Nhà',
    };

    const title = charId && TITLES[charId]
        ? `${TITLES[charId]} | Cú Thông Thái`
        : 'Tài Sản & Giá Cả | Cú Thông Thái';

    return {
        title: title,
        description: 'Theo dõi biến động tài sản: Vàng, Chứng Khoán, Bất Động Sản và chi phí sinh hoạt.',
        openGraph: {
            title: title,
            images: [`/api/og?chart=${charId || 'assets'}`],
        },
    };
}

// Helper to pivot data.
const pivotData = (rows) => {
    const map = {};
    rows.forEach(r => {
        const dateStr = r.date.split('T')[0];
        if (!map[dateStr]) map[dateStr] = { date: dateStr };

        if (r.indicator_key === 'GOLD_SJC') map[dateStr].sjc = Number(r.value);
        if (r.indicator_key === 'GOLD_WORLD') map[dateStr].world = Number(r.value);

        if (r.indicator_key === 'RE_HANOI_GOLD') map[dateStr].hn_gold = Number(r.value);
        if (r.indicator_key === 'RE_HANOI_VND') map[dateStr].hn_vnd = Number(r.value);
        if (r.indicator_key === 'RE_HCMC_GOLD') map[dateStr].hcm_gold = Number(r.value);
        if (r.indicator_key === 'RE_HCMC_VND') map[dateStr].hcm_vnd = Number(r.value);

        if (r.indicator_key === 'PHO_PRICE_VND') map[dateStr].pho = Number(r.value);

        // Add Forex & CPI for local usage
        // Mapped from USDVND_OFFICIAL (imported in import_history.js)
        if (r.indicator_key === 'USDVND_OFFICIAL') map[dateStr].usd_vnd = Number(r.value);
        if (r.indicator_key === 'VN_CPI_YOY') map[dateStr].cpi = Number(r.value);

        // Lifestyle / Fun Keys
        if (r.indicator_key === 'PRICE_IPHONE_VN') map[dateStr].iphone = Number(r.value);
        if (r.indicator_key === 'PRICE_SH_VN') map[dateStr].sh = Number(r.value);
        if (r.indicator_key === 'PRICE_HAO_HAO_VN') map[dateStr].haohao = Number(r.value);
        if (r.indicator_key === 'PRICE_BIA_HOI_VN') map[dateStr].beer = Number(r.value);
        if (r.indicator_key === 'INCOME_AVG_VN') map[dateStr].income = Number(r.value);
        if (r.indicator_key === 'RE_CONDO_VN') map[dateStr].condo = Number(r.value);
        if (r.indicator_key === 'METRIC_SALARY_PER_SQM') map[dateStr].salary_per_sqm = Number(r.value);

        // Rental / Survival Keys
        if (r.indicator_key === 'SURVIVAL_HAN_SINGLE_RENT') map[dateStr].rent_han_single = Number(r.value);
        if (r.indicator_key === 'SURVIVAL_SGN_SINGLE_RENT') map[dateStr].rent_sgn_single = Number(r.value);
        if (r.indicator_key === 'SURVIVAL_HAN_SINGLE_INCOME') map[dateStr].income_han_single = Number(r.value);
        if (r.indicator_key === 'SURVIVAL_SGN_SINGLE_INCOME') map[dateStr].income_sgn_single = Number(r.value);

        if (r.indicator_key === 'VNINDEX') map[dateStr].vnindex = Number(r.value);
        if (r.indicator_key === 'VNINDEX_VOLUME') map[dateStr].vnindex_vol = Number(r.value);
        if (r.indicator_key === 'VNINDEX_OPEN') map[dateStr].vnindex_open = Number(r.value);
        if (r.indicator_key === 'VNINDEX_HIGH') map[dateStr].vnindex_high = Number(r.value);
        if (r.indicator_key === 'VNINDEX_LOW') map[dateStr].vnindex_low = Number(r.value);
    });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
};


// Helper to extract latest value
const getLatest = (data, key) => {
    const valid = data.filter(d => d[key] !== undefined && d[key] !== null);
    if (valid.length === 0) return { value: 'N/A', date: '' };
    const last = valid[valid.length - 1];
    return { value: last[key], date: last.date };
};

// ... (interpolateData helper remains same) ...
const interpolateData = (data, key) => {
    let lastIndex = -1;

    // Find first valid index
    for (let i = 0; i < data.length; i++) {
        if (data[i][key] !== undefined && data[i][key] !== null) {
            lastIndex = i;
            break;
        }
    }

    if (lastIndex === -1) return data; // No data at all

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

    // Forward fill the rest (flat line for latest)
    if (lastIndex < data.length - 1) {
        const lastVal = data[lastIndex][key];
        for (let i = lastIndex + 1; i < data.length; i++) {
            data[i][key] = lastVal;
        }
    }

    return data;
};

export default async function AssetsPage() {
    // ... (fetch logic remains same) ...
    // Chunked fetching to bypass Supabase 1000-row limit
    let allData = [];
    let from = 0;
    const CHUNK_SIZE = 1000;
    let more = true;

    // Filter string constructing
    const filterStr = 'indicator_key.like.GOLD%,' +
        'indicator_key.like.RE%,' +
        'indicator_key.like.PHO%,' +
        'indicator_key.like.PRICE%,' + // New: Fetch all PRICE_... keys
        'indicator_key.like.INCOME%,' + // New: Fetch INCOME...
        'indicator_key.like.SURVIVAL%,' + // New: Fetch SURVIVAL...
        'indicator_key.like.METRIC%,' + // New: Fetch METRIC...
        'indicator_key.eq.VNINDEX,' + // New: Fetch VNINDEX
        'indicator_key.eq.VNINDEX_VOLUME,' + // FETCH VOLUME
        'indicator_key.eq.VNINDEX_OPEN,' +
        'indicator_key.eq.VNINDEX_HIGH,' +
        'indicator_key.eq.VNINDEX_LOW,' +
        'indicator_key.eq.USDVND_OFFICIAL,' +
        'indicator_key.eq.VN_CPI_YOY';

    while (more) {
        const supabase = getSupabaseClient();
        const { data: chunk, error } = await supabase
            .from('macro_indicators')
            .select('*')
            .or(filterStr)
            .order('date', { ascending: true })
            .range(from, from + CHUNK_SIZE - 1);

        if (error) {
            console.error('Error loading assets:', error);
            if (from === 0) return <div className="p-10 text-red-500">Error loading data</div>;
            break;
        }

        if (chunk) {
            allData = [...allData, ...chunk];
            if (chunk.length < CHUNK_SIZE) {
                more = false;
            } else {
                from += CHUNK_SIZE;
            }
        } else {
            more = false;
        }
    }

    const rawData = allData;
    let chartData = pivotData(rawData || []);

    // 1. Calculate Converted World Gold & Prepare USD/oz
    const usdMap = {};
    chartData.forEach(d => {
        if (d.usd_vnd) usdMap[d.date] = d.usd_vnd;
    });

    let lastUsd = 0;
    chartData.forEach(d => {
        if (d.usd_vnd) lastUsd = d.usd_vnd;

        // USD/oz Raw
        if (d.world) {
            d.world_usd = d.world;
        }

        // Converted
        if (d.world && (d.usd_vnd || lastUsd)) {
            const rate = d.usd_vnd || lastUsd;
            d.world_converted = (d.world * rate * 1.20565) / 1000000;
        }

        if (d.sjc && d.sjc > 500) {
            d.sjc = d.sjc / 1000000;
        }
    });

    // 2. Interpolate Phở Data & Fun Metrics (Smooth Curve)
    // We only interpolate 'pho' key within the full chartData
    // 2. Interpolate Data for Smooth Charts
    chartData = interpolateData(chartData, 'pho');
    chartData = interpolateData(chartData, 'condo');
    chartData = interpolateData(chartData, 'income');
    chartData = interpolateData(chartData, 'iphone');
    chartData = interpolateData(chartData, 'sh');
    chartData = interpolateData(chartData, 'salary_per_sqm'); // New
    chartData = interpolateData(chartData, 'rent_han_single'); // New
    chartData = interpolateData(chartData, 'rent_sgn_single'); // New
    chartData = interpolateData(chartData, 'income_han_single'); // New
    chartData = interpolateData(chartData, 'income_sgn_single'); // New

    // Real Estate Interpolation (Fix missing data gaps)
    chartData = interpolateData(chartData, 'hn_vnd');
    chartData = interpolateData(chartData, 'hcm_vnd');
    chartData = interpolateData(chartData, 'hn_gold');
    chartData = interpolateData(chartData, 'hcm_gold');

    // Filter subsets
    const goldData = chartData.filter(d => d.sjc || d.world_converted || d.world_usd);
    const reData = chartData.filter(d => d.hn_vnd || d.hcm_vnd || d.hn_gold || d.hcm_gold);
    const phoData = chartData.filter(d => d.pho || d.cpi);

    // Latest Metrics calculation (removed as logic is moved to Dashboard, but fetcher still needs basic filtering?)
    // Actually, AssetsDashboard receives the FULL 'chartData' and does its own filtering/latest logic inside.
    // So we can clean up this file significantly.

    return (
        <AssetsDashboard data={chartData} />
    );
}
