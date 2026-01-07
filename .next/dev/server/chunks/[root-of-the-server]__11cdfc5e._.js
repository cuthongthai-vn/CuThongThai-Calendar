module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/logic_processor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * logic_processor.js
 * Core logic for handling economic data comparisons and basic sentiment analysis.
 */ // Utility to clean numeric strings (e.g., "105.4K" -> 105.4)
function parseEconomicValue(valueStr) {
    if (!valueStr || typeof valueStr !== 'string') return null;
    // Simple parser: remove commas, %, etc. Keep dots and minus.
    // Enhanced to handle 'K', 'M', 'B' suffixes if necessary, 
    // but usually calendars provide raw numbers or consistent strings.
    // For now, simple regex stripping.
    const cleanStr = valueStr.replace(/[^0-9.-]/g, '');
    const val = parseFloat(cleanStr);
    return isNaN(val) ? null : val;
}
/**
 * Compares Actual vs Forecast to determine deviation.
 * @param {Object} event - Event object containing forecast and actual strings.
 * @returns {Object} Result containing deviation info.
 */ function compareEventData(event) {
    const { event_name, forecast, actual, previous } = event;
    const forecastVal = parseEconomicValue(forecast);
    const actualVal = parseEconomicValue(actual);
    const previousVal = parseEconomicValue(previous);
    // If data is missing
    if (actualVal === null || forecastVal === null) {
        return {
            status: "WAITING_FOR_DATA",
            deviation: null,
            sentiment: "NEUTRAL",
            details: "Missing forecast or actual data"
        };
    }
    const deviation = actualVal - forecastVal;
    // Calculate percentage deviation if needed
    const deviationPercent = forecastVal !== 0 ? deviation / Math.abs(forecastVal) * 100 : 0;
    // Determine basic sentiment (This is naive and needs event-specific rules)
    // E.g., For CPI: Actual > Forecast => Bearish for Stocks/Bullish for Currency (Inflation up)
    // E.g., For GDP: Actual > Forecast => Bullish for Currency
    // For now, we return the raw deviation direction
    let direction = "EQUAL";
    if (deviation > 0) direction = "HIGHER";
    if (deviation < 0) direction = "LOWER";
    return {
        status: "COMPLETED",
        forecast: forecastVal,
        actual: actualVal,
        deviation_absolute: deviation,
        deviation_percent: deviationPercent.toFixed(2) + '%',
        direction: direction,
        timestamp: new Date().toISOString()
    };
}
/**
 * Generates a prompt for the AI based on the event data.
 */ function generateAIPrompt(event, analysisResult) {
    return `
    Analyze the following economic event:
    Event: ${event.event_name}
    Currency: ${event.currency}
    Forecast: ${event.forecast}
    Actual: ${event.actual}
    Deviation: ${analysisResult.direction} (${analysisResult.deviation_absolute})
    
    Task: Explain the potential impact of this result on:
    1. The ${event.currency} currency strength.
    2. The Vietnamese market (VNI index and USD/VND exchange rate).
    Keep it concise and actionable for a trader.
    `;
}
module.exports = {
    parseEconomicValue,
    compareEventData,
    generateAIPrompt
};
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/ai_analyst.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { GoogleGenerativeAI } = __turbopack_context__.r("[project]/node_modules/@google/generative-ai/dist/index.js [app-route] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Priority list of models to try
const MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-pro",
    "gemini-1.0-pro"
];
async function getFinancialCommentary(eventData, deviationData, context = {
    past: [],
    future: []
}) {
    // Prepare Prompt Once
    const pastStr = context.past?.map((e)=>`- ${e.event_time?.slice(0, 10)}: ${e.event_name} (Act: ${e.actual})`).join('\n') || "";
    const futureStr = context.future?.map((e)=>`- ${e.event_time?.slice(0, 10)}: ${e.event_name} (Impact: ${e.impact_level})`).join('\n') || "";
    const prompt = `
    Vai trò: Cú Thông Thái.
    SỰ KIỆN: ${eventData.event_name} (Act: ${eventData.actual} / Fcst: ${eventData.forecast})
    BỐI CẢNH: 
    ${pastStr}
    ${futureStr}
    
    NHIỆM VỤ: Trả về JSON.
    Sentiment: BULLISH | BEARISH | NEUTRAL.
    Commentary: Nhận định ngắn dưới 80 từ.
    VN_Impact: Tác động tới VN-Index/Tỷ giá.
    
    OUTPUT JSON:
    { "commentary": "...", "sentiment": "...", "vn_impact": "..." }
    `;
    console.log(`[AI] Starting analysis for ${eventData.event_name}...`);
    let lastError = null;
    // Retry Logic with Model Fallback
    for (const modelName of MODELS_TO_TRY){
        try {
            console.log(`[AI] Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName
            });
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            // Try Parse JSON
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.warn(`[AI] JSON Parse failed for ${modelName}, using raw text.`);
                json = {
                    commentary: text
                };
            }
            console.log(`[AI] Success with ${modelName}`);
            return {
                commentary: json.commentary,
                sentiment: json.sentiment || "NEUTRAL",
                vn_impact: json.vn_impact || json.assessment || "Chưa có đánh giá chi tiết"
            };
        } catch (error) {
            console.warn(`[AI] Failed with ${modelName}: ${error.message}`);
            lastError = error;
        // Continue to next model
        }
    }
    // If all failed
    console.error("!!! ALL AI MODELS FAILED !!!", lastError);
    let userMessage = "Lỗi hệ thống AI (All Models Failed)";
    if (lastError?.message?.includes("429") || lastError?.message?.includes("Quota")) {
        userMessage = "AI đang quá tải (Rate Limit). Vui lòng đợi 30s rồi thử lại.";
    } else if (lastError?.message?.includes("404")) {
        userMessage = "Model không khả dụng (404). Kiểm tra lại Region/API Key.";
    }
    return {
        commentary: "Cú đang mất kết nối vệ tinh...",
        sentiment: "NEUTRAL",
        vn_impact: userMessage
    };
}
module.exports = {
    getFinancialCommentary
};
}),
"[project]/app/api/analyze/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$logic_processor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/logic_processor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai_analyst$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ai_analyst.js [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Supabase credentials missing'
        }, {
            status: 500
        });
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
    try {
        const { event_id } = await request.json();
        // 1. Fetch event from DB
        const { data: event, error: fetchError } = await supabase.from('economic_events').select('*').eq('id', event_id).single();
        if (fetchError || !event) throw new Error('Event not found');
        // 2a. Fetch Context (Past 7 Days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: pastContext } = await supabase.from('economic_events').select('event_name, actual, forecast, event_time').gte('event_time', sevenDaysAgo).lt('event_time', new Date().toISOString()).not('actual', 'is', null) // Only completed events
        .order('event_time', {
            ascending: false
        }).limit(10);
        // 2b. Fetch Context (Future 7 Days - High Impact Only)
        const sevenDaysFuture = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: futureContext } = await supabase.from('economic_events').select('event_name, forecast, event_time, impact_level').gt('event_time', new Date().toISOString()).lte('event_time', sevenDaysFuture).eq('impact_level', 'High') // Only High impact
        .order('event_time', {
            ascending: true
        }).limit(5);
        // 3. Run Logic
        const analysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$logic_processor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareEventData"])(event);
        if (analysis.status !== "COMPLETED") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Analysis failed (missing data?)',
                details: analysis
            }, {
                status: 400
            });
        }
        // 4. Run AI with Context
        const context = {
            past: pastContext || [],
            future: futureContext || []
        };
        const aiResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai_analyst$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFinancialCommentary"])(event, analysis, context);
        // 4. Update DB
        const { data: updatedEvent, error: updateError } = await supabase.from('economic_events').update({
            ai_commentary: aiResult.commentary,
            ai_sentiment: aiResult.sentiment,
            vn_impact: aiResult.vn_impact || "Chưa có đánh giá chi tiết",
            updated_at: new Date().toISOString()
        }).eq('id', event_id).select().single();
        if (updateError) throw updateError;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedEvent);
    } catch (error) {
        console.error("AI Analyze Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11cdfc5e._.js.map