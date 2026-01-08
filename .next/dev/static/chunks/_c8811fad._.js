(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/FloatingCTA.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
const FloatingCTA = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-0 left-0 w-full bg-[#111] border-t border-theme-yellow p-3 flex justify-center items-center z-50 shadow-lg shadow-yellow-500/20",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: "https://cuthongthai.vn/bac-si-tai-chinh-chan-doan-suc-khoe-vi-tien-va-phac-do-dieu-tri/",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "bg-theme-yellow hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all uppercase tracking-wider text-base md:text-lg flex items-center gap-2",
            children: '💊 Đi Khám Bệnh "Viêm Ví"'
        }, void 0, false, {
            fileName: "[project]/components/FloatingCTA.js",
            lineNumber: 6,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/FloatingCTA.js",
        lineNumber: 5,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = FloatingCTA;
const __TURBOPACK__default__export__ = FloatingCTA;
var _c;
__turbopack_context__.k.register(_c, "FloatingCTA");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Sparkline.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sparkline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function Sparkline({ data, width = 60, height = 20, color = '#fbbf24' }) {
    // data is array of numbers or objects with 'actual' property
    if (!data || data.length < 2) return null;
    const values = data.map((d)=>typeof d === 'object' ? d.actual : d).filter((v)=>v !== null && v !== undefined);
    if (values.length < 2) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // Prevent division by zero
    const points = values.map((val, i)=>{
        const x = i / (values.length - 1) * width;
        const y = height - (val - min) / range * height; // Invert Y because SVG coordinates
        return `${x},${y}`;
    }).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: width,
        height: height,
        className: "inline-block ml-2 opacity-80",
        viewBox: `0 0 ${width} ${height}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            fill: "none",
            stroke: color,
            strokeWidth: "1.5",
            points: points,
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/components/Sparkline.js",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Sparkline.js",
        lineNumber: 22,
        columnNumber: 9
    }, this);
}
_c = Sparkline;
var _c;
__turbopack_context__.k.register(_c, "Sparkline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/TooltipWrapper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TooltipWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$tooltip$2f$dist$2f$react$2d$tooltip$2e$min$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-tooltip/dist/react-tooltip.min.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function TooltipWrapper({ id, content, children }) {
    _s();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TooltipWrapper.useEffect": ()=>{
            setIsMounted(true);
        }
    }["TooltipWrapper.useEffect"], []);
    if (!content) return children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "data-tooltip-id": id,
                "data-tooltip-content": content,
                className: "cursor-help border-b border-dotted border-gray-500 hover:text-theme-yellow transition-colors",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/TooltipWrapper.js",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            isMounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$tooltip$2f$dist$2f$react$2d$tooltip$2e$min$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                id: id,
                place: "top",
                effect: "solid",
                className: "z-50 max-w-xs text-sm bg-gray-900 border border-gray-700 shadow-xl rounded-lg p-3 !opacity-100",
                style: {
                    backgroundColor: '#111827',
                    color: '#f3f4f6'
                }
            }, void 0, false, {
                fileName: "[project]/components/TooltipWrapper.js",
                lineNumber: 25,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
_s(TooltipWrapper, "h7njlszr1nxUzrk46zHyBTBrvgI=");
_c = TooltipWrapper;
var _c;
__turbopack_context__.k.register(_c, "TooltipWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/EventCard.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sparkline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sparkline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TooltipWrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TooltipWrapper.js [app-client] (ecmascript)");
;
;
;
;
const EventCard = ({ event })=>{
    // Helper to determine color for "Actual"
    const getActualColor = ()=>{
        if (!event.actual || !event.forecast) return 'text-white';
        const cleanNumber = (str)=>parseFloat(String(str).replace(/[^0-9.-]/g, ''));
        const actualVal = cleanNumber(event.actual);
        const forecastVal = cleanNumber(event.forecast);
        if (isNaN(actualVal) || isNaN(forecastVal)) return 'text-white';
        // Green if actual >= forecast (context dependent, but simple default)
        return actualVal >= forecastVal ? 'text-green-500' : 'text-red-500';
    };
    // Consolidated Logic for Consensus Badge
    const getConsensusBadge = ()=>{
        if (!event.actual || !event.forecast) return null;
        const cleanNumber = (str)=>parseFloat(String(str).replace(/[^0-9.-]/g, ''));
        const actualVal = cleanNumber(event.actual);
        const forecastVal = cleanNumber(event.forecast);
        if (isNaN(actualVal) || isNaN(forecastVal) || forecastVal === 0) return null;
        // Calculate deviation percentage
        // Avoid division by zero issues if forecast is 0 (handled above)
        const deviation = Math.abs((actualVal - forecastVal) / forecastVal);
        // Thresholds: Shock > 20% deviation (Arbitrary for now, customizable later)
        if (deviation > 0.2) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-600/80 text-white rounded border border-red-500 animate-pulse",
                children: [
                    "⚡ SỐC (",
                    (deviation * 100).toFixed(0),
                    "%)"
                ]
            }, void 0, true, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 34,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        } else {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-2 px-2 py-0.5 text-[10px] font-bold bg-gray-700/50 text-gray-400 rounded border border-gray-600",
                children: "✅ Đúng bài"
            }, void 0, false, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 40,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
    };
    // Helper: Map Currency/Country Code to Vietnamese Country Name
    const getCountryName = ()=>{
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
    const formatDateTime = (isoString)=>{
        if (!isoString) return {
            date: '',
            time: ''
        };
        const dateObj = new Date(isoString);
        // Time: HH:mm
        const timeStr = dateObj.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        // Date: Thứ X, DD/MM
        // Note: 'weekday' in Vietnamese is "Thứ Hai", "Thứ Ba"...
        const dateStr = dateObj.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        return {
            time: timeStr,
            date: dateStr
        };
    };
    const { time, date } = formatDateTime(event.event_time);
    const countryName = getCountryName();
    // Impact Color Logic
    const titleColor = event.impact_level === 'High' ? 'text-red-500' : 'text-theme-yellow';
    // Helper: Check if event is Today (Vietnam Time)
    const isToday = ()=>{
        if (!event.event_time) return false;
        const now = new Date();
        const eventDate = new Date(event.event_time);
        return now.toLocaleDateString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
        }) === eventDate.toLocaleDateString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
        });
    };
    const highlightClass = isToday() ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-theme-yellow shadow-[0_0_20px_rgba(255,215,0,0.15)] relative z-10" : "bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700 hover:border-theme-yellow/50 backdrop-blur-sm shadow-sm hover:shadow-md";
    // Mascot Image Selection Logic
    const getBullishImage = ()=>{
        // Deterministic random based on Event ID or Name to avoid re-render flickering
        // Use a simple hash of the event ID or name
        const seedStr = event.id || event.event_name || 'default';
        let hash = 0;
        for(let i = 0; i < seedStr.length; i++){
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
    const getBearishImage = ()=>{
        const seedStr = event.id || event.event_name || 'default';
        let hash = 0;
        for(let i = 0; i < seedStr.length; i++){
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${highlightClass} p-5 rounded-xl flex flex-col md:flex-row gap-5 transition-all duration-300 mb-4 relative group`,
        children: [
            isToday() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -top-3 left-4 bg-black text-theme-yellow border border-theme-yellow text-xs font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider z-20",
                children: "🔥 Hôm nay"
            }, void 0, false, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 141,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:w-1/4 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-gray-800 pb-2 md:pb-0 pr-0 md:pr-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-theme-yellow font-bold text-2xl leading-none",
                                children: time
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.js",
                                lineNumber: 150,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500 text-sm italic",
                                children: date
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.js",
                                lineNumber: 151,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EventCard.js",
                        lineNumber: 149,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: `${titleColor} font-bold text-lg flex items-center gap-2 mt-2`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TooltipWrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            id: `tooltip-${event.id}`,
                            content: `${countryName}: ${event.definition_vi || 'Chưa có định nghĩa'}`,
                            children: [
                                countryName,
                                " - ",
                                event.event_name_vi || event.event_name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 155,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.js",
                        lineNumber: 154,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500 mt-1",
                        children: [
                            event.currency,
                            " • Impact: ",
                            event.impact_level
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EventCard.js",
                        lineNumber: 160,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 148,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-gray-500",
                children: [
                    event.currency,
                    " • ",
                    event.impact_level
                ]
            }, void 0, true, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 163,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:w-1/4 flex flex-col justify-center items-center gap-2 border-b md:border-b-0 md:border-r border-gray-800 pb-2 md:pb-0 pr-0 md:pr-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-3 gap-4 text-center w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-500 uppercase tracking-wider mb-1",
                                    children: "Kỳ trước"
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 170,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-300 font-mono font-bold text-base",
                                    children: event.previous || '-'
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 171,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 169,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-500 uppercase tracking-wider mb-1",
                                    children: "Dự báo"
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 174,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-300 font-mono font-bold text-base",
                                    children: event.forecast || '-'
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 175,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 173,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-500 uppercase tracking-wider font-bold text-theme-yellow mb-1",
                                    children: "Kỳ này"
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 178,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `font-mono font-bold text-lg ${getActualColor()}`,
                                            children: event.actual || '--'
                                        }, void 0, false, {
                                            fileName: "[project]/components/EventCard.js",
                                            lineNumber: 180,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        getConsensusBadge(),
                                        event.historical_data && event.historical_data.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sparkline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                data: event.historical_data,
                                                width: 30,
                                                height: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/EventCard.js",
                                                lineNumber: 187,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/EventCard.js",
                                            lineNumber: 186,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 179,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 177,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EventCard.js",
                    lineNumber: 168,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 167,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:w-1/2 flex flex-col justify-center gap-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-row items-center gap-4",
                    children: [
                        event.ai_sentiment === 'BULLISH' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: getBullishImage(),
                                alt: "Bìm Bịp Bullish",
                                className: "w-16 h-16 object-contain"
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.js",
                                lineNumber: 201,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 200,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        event.ai_sentiment === 'BEARISH' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: getBearishImage(),
                                alt: "Chim Lợn Bearish",
                                className: "w-16 h-16 object-contain"
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.js",
                                lineNumber: 206,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 205,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2 flex-1",
                            children: [
                                !event.ai_sentiment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/Cu_thinking.png",
                                    alt: "Cú Suy Ngẫm",
                                    className: "w-16 h-16 object-contain opacity-80"
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 213,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-300 italic",
                                    children: event.ai_commentary ? `"${event.ai_commentary}"` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-600",
                                        children: "Đang chờ Cú Thông Thái suy ngẫm..."
                                    }, void 0, false, {
                                        fileName: "[project]/components/EventCard.js",
                                        lineNumber: 219,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/EventCard.js",
                                    lineNumber: 215,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EventCard.js",
                            lineNumber: 211,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EventCard.js",
                    lineNumber: 197,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/EventCard.js",
                lineNumber: 196,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/EventCard.js",
        lineNumber: 138,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = EventCard;
const __TURBOPACK__default__export__ = EventCard;
var _c;
__turbopack_context__.k.register(_c, "EventCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/FilterSidebar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
const RANGE_LABELS = [
    {
        key: 'this_week',
        label: '📅 Tuần này'
    },
    {
        key: 'today',
        label: '🔥 Hôm nay'
    },
    {
        key: 'tomorrow',
        label: '🔮 Ngày mai'
    },
    {
        key: 'next_week',
        label: '🔜 Tuần tới'
    },
    {
        key: 'yesterday',
        label: '⏪ Hôm qua'
    },
    {
        key: 'this_month',
        label: 'Tháng này'
    },
    {
        key: 'last_week',
        label: 'Tuần trước'
    },
    {
        key: 'next_month',
        label: 'Tháng tới'
    },
    {
        key: 'last_month',
        label: 'Tháng trước'
    }
];
const FilterSidebar = ({ selectedRange, onSelectRange })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full md:w-auto md:shrink-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "md:sticky md:top-8 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-row md:flex-col gap-2 min-w-max md:min-w-full",
                children: RANGE_LABELS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onSelectRange(item.key),
                        className: `
                                text-sm font-semibold py-2 px-4 rounded-full md:rounded-lg text-left transition-all whitespace-nowrap
                                ${selectedRange === item.key ? 'bg-theme-yellow text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'}
                            `,
                        children: item.label
                    }, item.key, false, {
                        fileName: "[project]/components/FilterSidebar.js",
                        lineNumber: 23,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/components/FilterSidebar.js",
                lineNumber: 19,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/FilterSidebar.js",
            lineNumber: 18,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/FilterSidebar.js",
        lineNumber: 17,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = FilterSidebar;
const __TURBOPACK__default__export__ = FilterSidebar;
var _c;
__turbopack_context__.k.register(_c, "FilterSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/dateHelpers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * dateHelpers.js
 * Utility functions to calculate date ranges for the filter.
 * All calculations assume "Today" is based on current system time (local).
 */ __turbopack_context__.s([
    "getRanges",
    ()=>getRanges
]);
const getRanges = ()=>{
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day local time
    // Helpers to create new date instances relative to 'today'
    const addDays = (d, days)=>{
        const newDate = new Date(d);
        newDate.setDate(d.getDate() + days);
        return newDate;
    };
    // --- RANGE CALCULATIONS ---
    // 1. TODAY
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    // 2. TOMORROW
    const tmrStart = addDays(today, 1);
    const tmrEnd = new Date(tmrStart);
    tmrEnd.setHours(23, 59, 59, 999);
    // 3. YESTERDAY
    const yestStart = addDays(today, -1);
    const yestEnd = new Date(yestStart);
    yestEnd.setHours(23, 59, 59, 999);
    // 4. THIS WEEK (Mon - Sun)
    // getDay(): 0 = Sun, 1 = Mon ... 6 = Sat
    const currentDay = today.getDay();
    // Calculate distance to previous Monday. 
    // If today is Sunday (0), distance is -6. If Monday (1), distance is 0.
    // If today is Tuesday (2), distance is -1.
    const distToMon = currentDay === 0 ? -6 : 1 - currentDay;
    const thisWeekStart = addDays(today, distToMon);
    const thisWeekEnd = addDays(thisWeekStart, 6);
    thisWeekEnd.setHours(23, 59, 59, 999);
    // 5. NEXT WEEK
    const nextWeekStart = addDays(thisWeekStart, 7);
    const nextWeekEnd = addDays(nextWeekStart, 6);
    nextWeekEnd.setHours(23, 59, 59, 999);
    // 6. LAST WEEK
    const lastWeekStart = addDays(thisWeekStart, -7);
    const lastWeekEnd = addDays(lastWeekStart, 6);
    lastWeekEnd.setHours(23, 59, 59, 999);
    // 7. THIS MONTH
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
    thisMonthEnd.setHours(23, 59, 59, 999);
    // 8. NEXT MONTH
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    nextMonthEnd.setHours(23, 59, 59, 999);
    // 9. LAST MONTH
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    lastMonthEnd.setHours(23, 59, 59, 999);
    return {
        today: {
            start: todayStart,
            end: todayEnd
        },
        tomorrow: {
            start: tmrStart,
            end: tmrEnd
        },
        yesterday: {
            start: yestStart,
            end: yestEnd
        },
        this_week: {
            start: thisWeekStart,
            end: thisWeekEnd
        },
        next_week: {
            start: nextWeekStart,
            end: nextWeekEnd
        },
        last_week: {
            start: lastWeekStart,
            end: lastWeekEnd
        },
        this_month: {
            start: thisMonthStart,
            end: thisMonthEnd
        },
        next_month: {
            start: nextMonthStart,
            end: nextMonthEnd
        },
        last_month: {
            start: lastMonthStart,
            end: lastMonthEnd
        }
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FloatingCTA$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FloatingCTA.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/EventCard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FilterSidebar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FilterSidebar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/dateHelpers.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Home() {
    _s();
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredEvents, setFilteredEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedRange, setSelectedRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('this_week'); // Default to This Week
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const fetchEvents = {
                "Home.useEffect.fetchEvents": async ()=>{
                    try {
                        const res = await fetch('/api/events');
                        if (!res.ok) {
                            throw new Error('Failed to fetch events');
                        }
                        const data = await res.json();
                        setEvents(data);
                    } catch (err) {
                        console.error(err);
                        setError(err.message);
                    } finally{
                        setLoading(false);
                    }
                }
            }["Home.useEffect.fetchEvents"];
            fetchEvents();
        }
    }["Home.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (events.length === 0) {
                setFilteredEvents([]);
                return;
            }
            const ranges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$dateHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRanges"])();
            const currentRange = ranges[selectedRange];
            if (!currentRange) {
                console.log(`[Filter] Invalid range key: ${selectedRange}`);
                setFilteredEvents(events);
                return;
            }
            const start = currentRange.start.getTime();
            const end = currentRange.end.getTime();
            console.log(`[Filter] Range: ${selectedRange}`, currentRange.start.toLocaleString(), currentRange.end.toLocaleString());
            const filtered = events.filter({
                "Home.useEffect.filtered": (e)=>{
                    if (!e.event_time) return false;
                    const t = new Date(e.event_time).getTime();
                    // console.log(`   - Event: ${e.event_name} Time: ${new Date(e.event_time).toLocaleString()} (${t})`);
                    return t >= start && t <= end;
                }
            }["Home.useEffect.filtered"]);
            console.log(`[Filter] Result: ${filtered.length} events found.`);
            setFilteredEvents(filtered);
        }
    }["Home.useEffect"], [
        events,
        selectedRange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen pb-24 bg-black font-sans",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#111] border-b border-gray-800 py-6 mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto px-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl md:text-5xl font-black text-theme-yellow mb-2 uppercase tracking-tighter",
                            children: "CÚ THÔNG THÁI"
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 73,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white text-lg font-bold uppercase tracking-widest bg-red-600 inline-block px-3 py-1 text-sm rounded self-center transform -skew-x-12",
                                    children: "Tin Kinh Tế Nóng 24/7"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 77,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 text-sm md:text-base mt-2 italic",
                                    children: '"Đầu Tư Nhẹ Nhàng - Kết Quả Huy Hoàng"'
                                }, void 0, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 76,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.js",
                    lineNumber: 72,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.js",
                lineNumber: 71,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FilterSidebar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        selectedRange: selectedRange,
                        onSelectRange: setSelectedRange
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 90,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            " ",
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center items-center py-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-yellow"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 100,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 99,
                                columnNumber: 25
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-red-500 text-center p-4 border border-red-500 rounded bg-red-900/20",
                                children: [
                                    "Error: ",
                                    error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this),
                            !loading && !error && filteredEvents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-gray-500 py-10 bg-[#111] rounded-lg border border-gray-800",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl mr-2",
                                        children: "📭"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 112,
                                        columnNumber: 29
                                    }, this),
                                    "Không có tin tức nào trong khung giờ này."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 111,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-4",
                                children: filteredEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        event: event
                                    }, event.id || Math.random(), false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 119,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 117,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 96,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.js",
                lineNumber: 87,
                columnNumber: 13
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FloatingCTA$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.js",
                lineNumber: 126,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.js",
        lineNumber: 68,
        columnNumber: 9
    }, this);
}
_s(Home, "kXVEVi415gTLYti8aMxwwlr0dXI=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c8811fad._.js.map