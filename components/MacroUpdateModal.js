
'use client';
import { useState } from 'react';

export default function MacroUpdateModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        indicator_key: 'USDVND_BLACK_MARKET',
        date: new Date().toISOString().split('T')[0],
        value: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        try {
            const res = await fetch('/api/macro/manual-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                setMsg('✅ Cập nhật thành công!');
                if (onSuccess) onSuccess();
                setTimeout(() => {
                    setMsg('');
                    onClose();
                }, 1500);
            } else {
                setMsg(`❌ Lỗi: ${data.error}`);
            }
        } catch (err) {
            setMsg('❌ Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="bg-amber-500 w-2 h-6 rounded-full"></span>
                    Cập Nhật Số Liệu
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Chỉ Số</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
                            value={formData.indicator_key}
                            onChange={e => setFormData({ ...formData, indicator_key: e.target.value })}
                        >
                            <option value="USDVND_BLACK_MARKET">USD Chợ Đen (Bán)</option>
                            <option value="USDVND_OFFICIAL">USD Ngân Hàng</option>
                            <option value="VN_GDP_YOY">GDP Growth (YoY)</option>
                            <option value="VN_CPI_YOY">CPI Inflation (YoY)</option>
                            <option value="VN_INTEREST_RATE">Lãi Suất Điều Hành</option>
                            <option value="VN_SAVINGS_RATE_12M">Lãi Suất Tiết Kiệm (12T)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Ngày</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-amber-500 outline-none"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Giá Trị</label>
                        <input
                            type="number"
                            step="any"
                            required
                            placeholder="VD: 25400 hoặc 6.5"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-lg focus:border-amber-500 outline-none"
                            value={formData.value}
                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                        />
                    </div>

                    {msg && <div className={`text-sm text-center font-bold ${msg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>{msg}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Đang Lưu...' : 'Lưu Dữ Liệu'}
                    </button>
                </form>
            </div>
        </div>
    );
}
