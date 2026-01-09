'use client';

export default function ShareButton({ title, chartId, className = "" }) {
    if (!chartId) return null;

    const handleShare = async (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}${window.location.pathname}?chart=${chartId}`;

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
                // Continue to clipboard fallback
            }
        }

        // 2. Try Clipboard (Desktop/Fallback)
        try {
            await navigator.clipboard.writeText(url);
            // User requested specific message
            alert('Đã sao chép, bạn muốn chia sẻ lên đâu?');
        } catch (clipboardError) {
            // 3. Last Resort: Window Prompt (For iframes/blocked permissions)
            window.prompt('Link chia sẻ (Ctrl+C để copy):', url);
        }
    };

    return (
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
    );
}
