import { createClient } from '@supabase/supabase-js';
import FloatingCTA from '../../components/ui/FloatingCTA';
import GoldenWindowSection from '../../components/features/population/GoldenWindowSection';
import BirthDeathSection from '../../components/features/population/BirthDeathSection';
import AgingUrbanSection from '../../components/features/population/AgingUrbanSection';

import WealthPyramidSection from '../../components/features/population/WealthPyramidSection';
import InequalitySection from '../../components/features/population/InequalitySection';
import AssetStructureSection from '../../components/features/population/AssetStructureSection';
import ClassTransitionSection from '../../components/features/population/ClassTransitionSection';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export const metadata = {
    title: 'Dân Số Việt Nam (1950-2100) | Cú Thông Thái',
    description: 'Tra cứu dữ liệu Dân số Việt Nam qua các thời kỳ: Giai đoạn dân số vàng, tỷ lệ sinh/tử, già hóa dân số và dự báo đến năm 2100.',
    openGraph: {
        title: 'Dân Số Việt Nam - Cơ hội & Thách thức',
        description: 'Bức tranh toàn cảnh 150 năm vận mệnh dân tộc. Chúng ta đang ở đâu trong "Giai đoạn vàng"?',
        images: ['/og-population.png'],
    },
};

export default async function PopulationPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl) {
        console.error('❌ Missing Supabase URL. Check .env');
        return <div className="text-red-500 p-10 text-center">Lỗi cấu hình Database (Missing URL).</div>;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('population_stats')
        .select('*')
        .order('year', { ascending: true });

    if (error) {
        console.error('Population Fetch Error:', error);
        return <div className="text-red-500 p-10 text-center">Lỗi tải dữ liệu dân số.</div>;
    }

    // Safety check
    if (!data || data.length === 0) {
        return <div className="text-slate-400 p-10 text-center">Chưa có dữ liệu dân số.</div>;
    }

    return (
        <main className="min-h-screen bg-slate-950 pb-20 pt-8">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-theme-yellow mb-4">
                        Dân Số Việt Nam <span className="text-white">1950 - 2100</span> 🇻🇳
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                        Toàn cảnh bức tranh dân số qua các thời kỳ: Từ bùng nổ dân số, Giai đoạn vàng, đến thách thức Già hóa và Suy giảm.
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase">Dân số 2025</p>
                            <span className="text-2xl font-bold text-green-500">102.3M</span>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase">Đỉnh Dân Số (2060)</p>
                            <span className="text-2xl font-bold text-orange-500">113.0M</span>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg hidden md:block">
                            <p className="text-xs text-slate-500 uppercase">Tuổi Thọ TB</p>
                            <span className="text-2xl font-bold text-blue-500">78 Năm</span>
                        </div>
                    </div>
                </div>

                {/* PART I: POPULATION */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-slate-200 mb-8 border-l-4 border-theme-yellow pl-4 uppercase">
                        I. Bức Tranh Dân Số
                    </h3>
                    <GoldenWindowSection data={data} />
                    <BirthDeathSection data={data} />
                    <AgingUrbanSection data={data} />
                </div>

                {/* PART II: SOCIETY & WEALTH */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-200 mb-8 border-l-4 border-green-500 pl-4 uppercase">
                        II. Phân Tầng Xã Hội & Tài Sản
                    </h3>
                    <WealthPyramidSection />
                    <InequalitySection />
                    <AssetStructureSection />
                    <ClassTransitionSection />
                </div>


                {/* Footer Note */}
                <div className="text-center text-xs text-slate-600 mt-12 pb-12 italic">
                    Dữ liệu nguồn: Tổng cục Thống kê (GSO) & Dự báo Liên Hợp Quốc (UN World Population Prospects).
                </div>
            </div>

            <FloatingCTA />
        </main>
    );
}
