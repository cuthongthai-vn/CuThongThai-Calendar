'use client';

export default function ShareButton({ title, chartId, className = "" }) {
    if (!chartId) return null;

    const handleShare = (e) => {
        e.stopPropagation(); // Prevent bubbling if inside a clickable area
        const url = `${window.location.origin}${window.location.pathname}?chart=${chartId}`;

        if (navigator.share) {
            navigator.share({
                title: 'Cú Thông Thái - ' + (title || 'Biểu Đồ'),
                text: 'Xem biểu đồ chi tiết: ' + (title || ''),
                url: url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            alert('Đã copy link biểu đồ: ' + url);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`text-slate-500 hover:text-blue-400 transition-colors ${className}`}
            title="Chia sẻ biểu đồ này"
            type="button"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.287.696.345 1.074.059.378.044.76-.042 1.135l-2.471 5.925M7.5 12a2.3 2.3 0 0 0 .5-1.5m-5.409 6.273a2.25 2.25 0 1 1 3.182-3.182m-3.182 3.182c.324.18.696.287 1.074.345.378.059.76.044 1.135-.042l5.925-2.471m-6.273-5.409A2.25 2.25 0 0 1 12 7.5m2.273 5.409-2.273-5.409a2.25 2.25 0 0 1 5.409 2.273 2.25 2.25 0 0 1-5.409 2.273" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
        </button>
    );
}
