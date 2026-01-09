import { ImageResponse } from 'next/og';
import { getSupabaseClient } from '@/lib/supabase/client';

export const runtime = 'edge';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const chartId = searchParams.get('chart');

    // Chart configurations
    const CHART_CONFIG = {
        'vnindex': { title: 'VNINDEX', color: '#22c55e', key: 'VNINDEX' },
        'exchange-rate': { title: 'Tỷ Giá USD/VND', color: '#3b82f6', key: 'USDVND_OFFICIAL' },
        'rates': { title: 'Lãi Suất 12T', color: '#d946ef', key: 'VN_SAVINGS_RATE_12M' },
        'gdp-abs': { title: 'Quy Mô GDP', color: '#10b981', key: 'VN_GDP_ABS_BUSD' },
        'gold': { title: 'Giá Vàng SJC', color: '#fbbf24', key: 'GOLD_SJC' },
        're-vnd': { title: 'BĐS Hà Nội', color: '#f472b6', key: 'RE_HANOI_VND' },
    };

    const config = CHART_CONFIG[chartId] || { title: 'Cú Thông Thái', color: '#fbbf24' };

    // Fetch Latest Value
    let latestValue = 'N/A';
    let latestDate = '';

    if (config.key) {
        try {
            const supabase = getSupabaseClient();
            const { data } = await supabase
                .from('macro_indicators')
                .select('value, date')
                .eq('indicator_key', config.key)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                latestValue = data.value.toLocaleString();
                latestDate = data.date.split('T')[0];
            }
        } catch (error) {
            console.error('Failed to fetch OG data:', error);
        }
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontFamily: 'sans-serif'
                }}
            >
                <div style={{ position: 'absolute', top: 40, left: 40, display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 32, fontWeight: 'bold' }}>🦉 Cú Thông Thái</span>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 60,
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: 30,
                    border: '2px solid #334155',
                    width: '80%',
                    height: '70%'
                }}>
                    <h1 style={{ fontSize: 70, fontWeight: 'bold', margin: 0, color: config.color, textAlign: 'center' }}>
                        {config.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 30 }}>
                        <span style={{ fontSize: 90, fontWeight: 'bold', color: '#f8fafc' }}>
                            {latestValue}
                        </span>
                        {config.title.includes('GDP') && <span style={{ fontSize: 40, marginBottom: 15, marginLeft: 10, color: '#94a3b8' }}>USD</span>}
                        {config.title.includes('Vàng') && <span style={{ fontSize: 40, marginBottom: 15, marginLeft: 10, color: '#94a3b8' }}>VNĐ</span>}
                    </div>

                    <span style={{ fontSize: 30, color: '#94a3b8', marginTop: 20 }}>
                        Cập nhật: {latestDate}
                    </span>

                </div>

                <div style={{ position: 'absolute', bottom: 30, right: 40, color: '#475569', fontSize: 20 }}>
                    cuthongthai.vn
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
