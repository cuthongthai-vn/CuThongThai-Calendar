
'use client';
export default function MacroHeader() {
    return (
        <header className="mb-10 flex items-end justify-between relative">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-2">
                    VĨ MÔ VIỆT NAM
                </h1>
                <p className="text-slate-400">
                    Bức tranh sức khỏe nền kinh tế qua các con số biết nói.
                </p>
            </div>
            <div className="text-xs text-slate-500 absolute top-0 right-0 text-right">
                ** Nguồn: GSO, WB, IMF và Tổng hợp
            </div>
        </header>
    );
}
