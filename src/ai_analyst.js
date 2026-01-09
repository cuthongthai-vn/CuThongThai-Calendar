const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

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

// In-memory cache for AI commentary
// Structure: { key: "eventId-actual", value: { commentary, sentiment, vn_impact, translated_name, timestamp } }
const commentaryCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper: Generate cache key
function getCacheKey(eventData) {
    return `${eventData.id || eventData.event_name}-${eventData.actual}`;
}

// Helper: Check if cache entry is still valid
function isCacheValid(timestamp) {
    return (Date.now() - timestamp) < CACHE_TTL;
}

// Helper: Sleep for exponential backoff
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper: Run with timeout
function withTimeout(promise, timeoutMs) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
        )
    ]);
}

async function getFinancialCommentary(eventData, deviationData, context = { past: [], future: [] }) {
    // Check cache first
    const cacheKey = getCacheKey(eventData);
    const cached = commentaryCache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
        console.log(`[AI Cache] Hit for event: ${eventData.event_name}`);
        return {
            commentary: cached.commentary,
            sentiment: cached.sentiment,
            vn_impact: cached.vn_impact,
            translated_name: cached.translated_name
        };
    }

    // Prepare Prompt Once
    const pastStr = context.past?.map(e => `- ${e.event_time?.slice(0, 10)}: ${e.event_name} (Act: ${e.actual})`).join('\n') || "";
    const futureStr = context.future?.map(e => `- ${e.event_time?.slice(0, 10)}: ${e.event_name} (Impact: ${e.impact_level})`).join('\n') || "";

    const prompt = `
    Vai trò: Cú Thông Thái.
    SỰ KIỆN: ${eventData.event_name} (Act: ${eventData.actual} / Fcst: ${eventData.forecast})
    BỐI CẢNH: 
    ${pastStr}
    ${futureStr}
    
    NHIỆM VỤ: Trả về JSON.
    Sentiment: BULLISH | BEARISH | NEUTRAL.
    Commentary: Nhận định ngắn dưới 80 từ, giọng điệu Cú Thông Thái (hài hước, bình dân).
    VN_Impact: Tác động tới VN-Index/Tỷ giá.
    Translated_Name: Tên sự kiện dịch sang tiếng Việt (ngắn gọn, chuẩn tài chính).
    
    OUTPUT JSON:
    { "commentary": "...", "sentiment": "...", "vn_impact": "...", "translated_name": "..." }
    `;

    console.log(`[AI] Starting analysis for ${eventData.event_name}...`);

    let lastError = null;
    let backoffDelay = 100; // Start with 100ms, doubles each retry

    // Retry Logic with Model Fallback and Exponential Backoff
    for (let i = 0; i < MODELS_TO_TRY.length; i++) {
        const modelName = MODELS_TO_TRY[i];

        try {
            console.log(`[AI] Attempting with model: ${modelName}`);

            // Add backoff delay before retry (except first attempt)
            if (i > 0) {
                console.log(`[AI] Retry with backoff: ${backoffDelay}ms`);
                await sleep(backoffDelay);
                backoffDelay = Math.min(backoffDelay * 2, 800); // Double delay, max 800ms
            }

            const model = genAI.getGenerativeModel({ model: modelName });

            // Wrap in timeout (30 seconds per attempt)
            const result = await withTimeout(
                model.generateContent(prompt),
                30000
            );

            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            // Try Parse JSON
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.warn(`[AI] JSON Parse failed for ${modelName}, using raw text.`);
                json = { commentary: text };
            }

            console.log(`[AI] Success with ${modelName}`);

            const successResult = {
                commentary: json.commentary,
                sentiment: json.sentiment || "NEUTRAL",
                vn_impact: json.vn_impact || json.assessment || "Chưa có đánh giá chi tiết",
                translated_name: json.translated_name
            };

            // Store in cache
            commentaryCache.set(cacheKey, {
                ...successResult,
                timestamp: Date.now()
            });
            console.log(`[AI Cache] Stored for event: ${eventData.event_name}`);

            return successResult;

        } catch (error) {
            console.warn(`[AI] Failed with ${modelName}: ${error.message}`);
            lastError = error;
            // Continue to next model
        }
    }

    // If all failed
    console.error("!!! ALL AI MODELS FAILED !!!", lastError);

    let userMessage = "Lỗi hệ thống AI (All Models Failed)";
    let commentary = "Cú đang mất kết nối vệ tinh...";

    if (lastError?.message) {
        const errorMsg = lastError.message.toLowerCase();

        // Specific error type detection
        if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("rate limit")) {
            userMessage = "AI đang quá tải (Rate Limit). Vui lòng đợi 30s rồi thử lại.";
            commentary = "⏳ Cú đang nghỉ ngơi vì bay quá nhiều chuyến. Thử lại sau nhé!";
        } else if (errorMsg.includes("404")) {
            userMessage = "Model không khả dụng (404). Kiểm tra lại Region/API Key.";
            commentary = "🔧 Cú đang bảo trì. Vui lòng thông báo quản trị viên.";
        } else if (errorMsg.includes("timeout")) {
            userMessage = "AI phản hồi chậm (Timeout). Máy chủ có thể quá tải.";
            commentary = "⏱️ Cú đang suy nghĩ lâu quá. Hệ thống bận, thử lại sau nhé!";
        } else if (errorMsg.includes("recitation") || errorMsg.includes("content policy")) {
            userMessage = "Nội dung vi phạm chính sách (Content Policy).";
            commentary = "🚫 Cú không được phép bình luận về nội dung này.";
        } else if (errorMsg.includes("safety")) {
            userMessage = "Bộ lọc an toàn đã chặn (Safety Filter).";
            commentary = "🛡️ Cú thấy nội dung này nhạy cảm, tạm không bình luận.";
        } else if (errorMsg.includes("api key")) {
            userMessage = "API Key không hợp lệ hoặc hết hạn.";
            commentary = "🔑 Cú mất chìa khóa rồi. Liên hệ quản trị viên nhé!";
        }
    }

    return {
        commentary: commentary,
        sentiment: "NEUTRAL",
        vn_impact: userMessage
    };
}

module.exports = { getFinancialCommentary };
