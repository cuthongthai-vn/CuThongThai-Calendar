import { createClient } from '@supabase/supabase-js';

import LifestyleDashboard from '../../components/LifestyleDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Kinh Tế Vỉa Hè | Cú Thông Thái',
    description: 'Chỉ số iPhone, Phở Index, giá SH và góc nhìn hài hước về chi phí sống tại Việt Nam qua các thập kỷ.',
    openGraph: {
        title: 'Kinh Tế Vỉa Hè - Bức tranh đời sống Việt Nam',
        description: 'Xem ngay chỉ số "Phở Index" và "Giấc mơ SH" thay đổi thế nào qua 20 năm!',
        images: ['/og-lifestyle.png'], // Placeholder, nice to have
    },
};

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Helper to pivot data
const pivotData = (rows) => {
    const map = {};
    rows.forEach(r => {
        const dateStr = r.date.split('T')[0];
        if (!map[dateStr]) map[dateStr] = { date: dateStr };

        // Map keys
        if (r.indicator_key === 'PRICE_IPHONE_VN') map[dateStr].iphone = Number(r.value);
        if (r.indicator_key === 'PRICE_SH_VN') map[dateStr].sh = Number(r.value);

        // Pho Mapping (New)
        if (r.indicator_key === 'PRICE_PHO_VN') map[dateStr].pho = Number(r.value);
        if (r.indicator_key === 'PRICE_PHO_HN') map[dateStr].pho_hn = Number(r.value);
        if (r.indicator_key === 'PRICE_PHO_HCM') map[dateStr].pho_hcm = Number(r.value);
        if (r.indicator_key === 'CPI') map[dateStr].cpi = Number(r.value);

        if (r.indicator_key === 'PRICE_HAO_HAO_VN') map[dateStr].haohao = Number(r.value);
        if (r.indicator_key === 'PRICE_BIA_HOI_VN') map[dateStr].beer = Number(r.value);
        if (r.indicator_key === 'INCOME_AVG_VN') map[dateStr].income = Number(r.value);
        if (r.indicator_key === 'RE_CONDO_VN') map[dateStr].condo = Number(r.value);

        // New Metrics
        // New Metrics
        if (r.indicator_key === 'LIFESTYLE_DINING_FREQ') map[dateStr].dining_freq = Number(r.value);
        if (r.indicator_key === 'LIFESTYLE_BEAUTY_SPEND') map[dateStr].beauty_spend = Number(r.value);
        if (r.indicator_key === 'METRIC_SALARY_PER_SQM') map[dateStr].salary_per_sqm = Number(r.value);

        // Survival Index Mapping
        if (r.indicator_key.startsWith('SURVIVAL_')) {
            // e.g. SURVIVAL_HAN_SINGLE_INDEX -> han_single_index
            const prop = r.indicator_key.replace('SURVIVAL_', '').toLowerCase();
            map[dateStr][prop] = Number(r.value);
        }
    });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Interpolation helper
const interpolateData = (data, key) => {
    let lastIndex = -1;
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

export default async function LifestylePage() {
    // Chunked Fetching
    let allData = [];
    let from = 0;
    const CHUNK_SIZE = 1000;
    let more = true;

    // Filter for Lifestyle Keys
    const filterStr = 'indicator_key.like.PRICE%,' +
        'indicator_key.like.LIFESTYLE%,' +
        'indicator_key.like.METRIC%,' +
        'indicator_key.like.INCOME%,' +
        'indicator_key.like.RE_CONDO%,' +
        'indicator_key.like.CPI%,' +
        'indicator_key.like.SURVIVAL_%';

    while (more) {
        const { data: chunk, error } = await supabase
            .from('macro_indicators')
            .select('*')
            .or(filterStr)
            .order('date', { ascending: true })
            .range(from, from + CHUNK_SIZE - 1);

        if (error) {
            console.error('Error fetching lifestyle data:', error);
            break;
        }

        if (chunk && chunk.length > 0) {
            allData = [...allData, ...chunk];
            if (chunk.length < CHUNK_SIZE) more = false;
            else from += CHUNK_SIZE;
        } else {
            more = false;
        }
    }

    let interpolated = pivotData(allData);
    interpolated = interpolateData(interpolated, 'iphone');
    interpolated = interpolateData(interpolated, 'sh');
    interpolated = interpolateData(interpolated, 'condo');
    interpolated = interpolateData(interpolated, 'income');
    interpolated = interpolateData(interpolated, 'beauty_spend');
    interpolated = interpolateData(interpolated, 'pho');
    interpolated = interpolateData(interpolated, 'pho_hn');
    interpolated = interpolateData(interpolated, 'pho_hcm');
    interpolated = interpolateData(interpolated, 'cpi');

    // Interpolate Survival Types
    ['han', 'sgn', 'dad', 'vca', 'hph', 'bdg'].forEach(city => {
        ['single', 'family4'].forEach(type => {
            interpolated = interpolateData(interpolated, `${city}_${type}_index`);
            interpolated = interpolateData(interpolated, `${city}_${type}_cost`);
            interpolated = interpolateData(interpolated, `${city}_${type}_income`);
        });
    });

    // Calculate CPI Index (Base 100)
    let cpiIndex = 100;
    interpolated.forEach(row => {
        if (typeof row.cpi === 'number') {
            cpiIndex = cpiIndex * (1 + row.cpi / 100);
        }
        row.cpi_index = cpiIndex;
    });

    return (
        <div className="min-h-screen bg-slate-950">
            EMPTY_STRING

            <main className="py-8 px-4 md:px-8">
                <LifestyleDashboard data={interpolated} />
            </main>
        </div>
    );
}
