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

async function getFinancialCommentary(eventData, deviationData, context = { past: [], future: [] }) {

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

    // Retry Logic with Model Fallback
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`[AI] Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
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
            return {
                commentary: json.commentary,
                sentiment: json.sentiment || "NEUTRAL",
                vn_impact: json.vn_impact || json.assessment || "Chưa có đánh giá chi tiết",
                translated_name: json.translated_name
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

module.exports = { getFinancialCommentary };
