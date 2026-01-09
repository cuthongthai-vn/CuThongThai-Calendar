'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ShareButton({ title, chartId, className = "" }) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!chartId) return null;

    const url = typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?chart=${chartId}`
        : '';

    const handleShare = async (e) => {
        e.stopPropagation();

        // 1. Try Web Share API (Mobile/Safe Context)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Cú Thông Thái - ' + (title || 'Biểu Đồ'),
                    text: 'Xem biểu đồ chi tiết: ' + (title || ''),
                    url: url
                });
                return;
            } catch (error) {
                if (error.name === 'AbortError') return;
            }
        }

        // 2. Try Clipboard (Desktop/Fallback)
        try {
            await navigator.clipboard.writeText(url);
            alert('Đã sao chép, bạn muốn chia sẻ lên đâu?');
        } catch (clipboardError) {
            // 3. Last Resort: Custom Modal (No more ugly native prompt)
            setShowModal(true);
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className={`p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors z-20 relative ${className}`}
                title="Chia sẻ biểu đồ này"
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
            </button>

            {showModal && <ShareModal url={url} onClose={() => setShowModal(false)} />}
        </>
    );
}

function ShareModal({ url, onClose }) {
    const inputRef = useRef(null);
    const [copyStatus, setCopyStatus] = useState('Sao chép');

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.select();
        }
    }, []);

    const handleCopy = () => {
        if (inputRef.current) {
            inputRef.current.select();
            try {
                // Try deprecated execCommand as last ditch within the modal context
                // if writeText failed earlier (it likely will fail here too if context is same)
                document.execCommand('copy');
                setCopyStatus('Đã chép!');
                setTimeout(() => onClose(), 1000);
            } catch (err) {
                setCopyStatus('Hãy copy thủ công');
            }
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-white mb-2">Chia Sẻ Biểu Đồ</h3>
                <p className="text-slate-400 text-sm mb-4">
                    Trình duyệt chặn tự động sao chép. Bạn hãy copy link dưới đây:
                </p>

                <div className="flex gap-2 mb-6">
                    <input
                        ref={inputRef}
                        type="text"
                        readOnly
                        value={url}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
                        onClick={(e) => e.target.select()}
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                        {copyStatus}
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
