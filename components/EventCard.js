import React from 'react';
import Sparkline from './Sparkline';
import TooltipWrapper from './TooltipWrapper';

const EventCard = ({ event }) => {
    // Helper to determine color for "Actual"
    const getActualColor = () => {
        if (!event.actual || !event.forecast) return 'text-white';
        const cleanNumber = (str) => parseFloat(String(str).replace(/[^0-9.-]/g, ''));
        const actualVal = cleanNumber(event.actual);
        const forecastVal = cleanNumber(event.forecast);
        if (isNaN(actualVal) || isNaN(forecastVal)) return 'text-white';
        // Green if actual >= forecast (context dependent, but simple default)
        return actualVal >= forecastVal ? 'text-green-500' : 'text-red-500';
    };

    // Consolidated Logic for Consensus Badge
    const getConsensusBadge = () => {
        if (!event.actual || !event.forecast) return null;

        const cleanNumber = (str) => parseFloat(String(str).replace(/[^0-9.-]/g, ''));
        const actualVal = cleanNumber(event.actual);
        const forecastVal = cleanNumber(event.forecast);

        if (isNaN(actualVal) || isNaN(forecastVal) || forecastVal === 0) return null;

        // Calculate deviation percentage
        // Avoid division by zero issues if forecast is 0 (handled above)
        const deviation = Math.abs((actualVal - forecastVal) / forecastVal);

        // Thresholds: Shock > 20% deviation (Arbitrary for now, customizable later)
        if (deviation > 0.2) {
            return (
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-600/80 text-white rounded border border-red-500 animate-pulse">
                    ⚡ SỐC ({(deviation * 100).toFixed(0)}%)
                </span>
            );
        } else {
            return (
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-gray-700/50 text-gray-400 rounded border border-gray-600">
                    ✅ Đúng bài
                </span>
            );
        }
    };

    // Helper: Map Currency/Country Code to Vietnamese Country Name
    const getCountryName = () => {
        const c = event.country || event.currency;
        if (c === 'US' || c === 'USD') return 'Mỹ';
        if (c === 'VN' || c === 'VND' || c === 'Vietnam') return 'Việt Nam';
        if (c === 'CN' || c === 'CNY' || c === 'China') return 'Trung Quốc';
        if (c === 'EU' || c === 'EUR') return 'Châu Âu';
        if (c === 'GB' || c === 'GBP') return 'Anh';
        if (c === 'JP' || c === 'JPY') return 'Nhật Bản';
        return c; // Fallback
    };

    // Helper: Format Date & Time (Hanoi)
    const formatDateTime = (isoString) => {
        if (!isoString) return { date: '', time: '' };
        const dateObj = new Date(isoString);

        // Time: HH:mm
        const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });

        // Date: Thứ X, DD/MM
        // Note: 'weekday' in Vietnamese is "Thứ Hai", "Thứ Ba"...
        const dateStr = dateObj.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });

        return { time: timeStr, date: dateStr };
    };

    const { time, date } = formatDateTime(event.event_time);
    const countryName = getCountryName();

    // Impact Color Logic
    const titleColor = event.impact_level === 'High' ? 'text-red-500' : 'text-theme-yellow';

    // Helper: Check if event is Today (Vietnam Time)
    const isToday = () => {
        if (!event.event_time) return false;
        const now = new Date();
        const eventDate = new Date(event.event_time);
        return now.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) ===
            eventDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    };

    const highlightClass = isToday()
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-theme-yellow shadow-[0_0_20px_rgba(255,215,0,0.15)] relative z-10"
        : "bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700 hover:border-theme-yellow/50 backdrop-blur-sm shadow-sm hover:shadow-md";

    // Mascot Image Selection Logic
    const getBullishImage = () => {
        // Deterministic random based on Event ID or Name to avoid re-render flickering
        // Use a simple hash of the event ID or name
        const seedStr = event.id || event.event_name || 'default';
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
        }

        const bullishImages = [
            '/bimbip_1.png',
            '/bimbip_2.png',
            '/bimbip_3.png',
            '/bimbip_4.png',
            '/bimbip_5.png'
        ];

        // Use absolute value of hash to pick index
        const index = Math.abs(hash) % bullishImages.length;
        return bullishImages[index];
    };

    // Use getBearishImage logic
    const getBearishImage = () => {
        const seedStr = event.id || event.event_name || 'default';
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
        }

        const bearishImages = [
            '/chimlon_1.png',
            '/chimlon_2.png',
            '/chimlon_3.png',
            '/chimlon_4.png',
            '/chimlon_5.png'
        ];

        // Use absolute value of hash to pick index
        const index = Math.abs(hash) % bearishImages.length;
        return bearishImages[index];
    };

    return (
        <div className={`${highlightClass} p-5 rounded-xl flex flex-col md:flex-row gap-5 transition-all duration-300 mb-4 relative group`}>

            {isToday() && (
                <div className="absolute -top-3 left-4 bg-black text-theme-yellow border border-theme-yellow text-xs font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider z-20">
                    🔥 Hôm nay
                </div>
            )}


            {/* Left Column: Time + Name */}
            <div className="md:w-1/4 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-gray-800 pb-2 md:pb-0 pr-0 md:pr-4">
                <div className="flex flex-col">
                    <span className="text-theme-yellow font-bold text-2xl leading-none">{time}</span>
                    <span className="text-gray-500 text-sm italic">{date}</span>
                </div>

                <h3 className={`${titleColor} font-bold text-lg flex items-center gap-2 mt-2`}>
                    <TooltipWrapper id={`tooltip-${event.id}`} content={`${countryName}: ${event.definition_vi || 'Chưa có định nghĩa'}`}>
                        {countryName} - {event.event_name_vi || event.event_name}
                    </TooltipWrapper>
                </h3>

                <span className="text-xs text-gray-500 mt-1">{event.currency} • Impact: {event.impact_level}</span>
            </div>

            <span className="text-xs text-gray-500">{event.currency} • {event.impact_level}</span>


            {/* Center Column: Indicators */}
            <div className="md:w-1/4 flex flex-col justify-center items-center gap-2 border-b md:border-b-0 md:border-r border-gray-800 pb-2 md:pb-0 pr-0 md:pr-4">
                <div className="grid grid-cols-3 gap-4 text-center w-full">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kỳ trước</span>
                        <span className="text-gray-300 font-mono font-bold text-base">{event.previous || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dự báo</span>
                        <span className="text-gray-300 font-mono font-bold text-base">{event.forecast || '-'}</span>
                    </div>
                    <div className="flex flex-col relative">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold text-theme-yellow mb-1">Kỳ này</span>
                        <div className="flex flex-col items-center">
                            <span className={`font-mono font-bold text-lg ${getActualColor()}`}>
                                {event.actual || '--'}
                            </span>
                            {getConsensusBadge()}
                            {/* Sparkline Integration */}
                            {event.historical_data && event.historical_data.length > 0 && (
                                <div className="mt-1">
                                    <Sparkline data={event.historical_data} width={30} height={20} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: AI Commentary (Owl's Prophecy) */}
            <div className="md:w-1/2 flex flex-col justify-center gap-4">
                <div className="flex flex-row items-center gap-4">
                    {/* Mascot Display */}
                    {event.ai_sentiment === 'BULLISH' && (
                        <div className="animate-bounce">
                            <img src={getBullishImage()} alt="Bìm Bịp Bullish" className="w-16 h-16 object-contain" />
                        </div>
                    )}
                    {event.ai_sentiment === 'BEARISH' && (
                        <div className="animate-bounce">
                            <img src={getBearishImage()} alt="Chim Lợn Bearish" className="w-16 h-16 object-contain" />
                        </div>
                    )}

                    {/* Commentary */}
                    <div className="flex items-start gap-2 flex-1">
                        {!event.ai_sentiment && (
                            <img src="/Cu_thinking.png" alt="Cú Suy Ngẫm" className="w-16 h-16 object-contain opacity-80" />
                        )}
                        <div className="text-sm text-gray-300 italic">
                            {event.ai_commentary ? (
                                `"${event.ai_commentary}"`
                            ) : (
                                <span className="text-gray-600">Đang chờ Cú Thông Thái suy ngẫm...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EventCard;
