
'use client';
import Link from 'next/link';

export default function MacroHeader({ activeTab = 'macro' }) {
    return (
        <div className="mb-8">
            <header className="flex items-end justify-between relative mb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-2">
                        VĨ MÔ VIỆT NAM
                    </h1>
                    <p className="text-slate-400">
                        Bức tranh sức khỏe nền kinh tế qua các con số biết nói.
                    </p>
                </div>
                <div className="text-xs text-slate-500 absolute top-0 right-0 text-right">
                    ** Nguồn: WB, IMF, GSO và Tổng hợp
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800 space-x-8">
                <Link
                    href="/macro"
                    className={`pb-3 font-bold text-lg border-b-2 transition-all ${activeTab === 'macro'
                        ? 'border-theme-yellow text-theme-yellow'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                >
                    📊 Vĩ Mô
                </Link>
                <Link
                    href="/assets"
                    className={`pb-3 font-bold text-lg border-b-2 transition-all ${activeTab === 'assets'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                >
                    💰 Tài Sản & Giá Cả
                </Link>
                <Link
                    href="/lifestyle"
                    className={`pb-3 font-bold text-lg border-b-2 transition-all ${activeTab === 'lifestyle'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                >
                    ☕️ Vỉa Hè
                </Link>
            </div>
        </div>
    );
}
