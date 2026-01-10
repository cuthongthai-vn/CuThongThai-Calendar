export const POLICY_STANCE_DATA = [
    { category: "Tiền Tệ (Monetary)", value: 75, label: "Giãn (Loosening)", color: "#10b981", metric: "M2 +11.7%", note: "Lãi suất thấp 3.0%" },
    { category: "Tài Khóa (Fiscal)", value: 85, label: "Bung Mạnh (Expansive)", color: "#ef4444", metric: "Chi tiêu +19%", note: "Thâm hụt -2.3% GDP" }
];

export const DEBT_SUSTAINABILITY_DATA = [
    { type: "Nợ Công (Public)", value: 34.2, limit: 60, status: "An Toàn", color: "#10b981" },
    { type: "Nợ Tư Nhân (Private)*", value: 35.2, limit: 150, status: "Thấp (Nghi vấn?)", color: "#3b82f6" }
    // Note: User provided 35.2%, but external sources say ~136%. Chart will note this.
];

export const OVERHEATING_INDICATORS = [
    { name: "M2 Growth", value: 11.7, threshold: 12, status: "Cao" },
    { name: "Lạm Phát (CPI)", value: 3.3, threshold: 4.5, status: "Ổn định" },
    { name: "Tăng Trưởng Tín Dụng", value: 19.0, threshold: 14, status: "Nóng!" } // Updated 2025 forecast from media
];

export const HEALTH_BOWL_COMMENTS = {
    fiscal_monetary: "🦉 'Song Kiếm Hợp Bích': Cả Tiền Tệ và Tài Khóa đều đang 'bung lụa'. Chính phủ chi tiêu mạnh (+19%), NHNN bơm tiền (+11.7%). Đây là liều thuốc tăng lực cực mạnh cho GDP 2025!",
    debt_warning: "🦉 'Cú Cảnh Báo': Số liệu Nợ Công (34.2%) rất đẹp. Nhưng Nợ Tư Nhân (35.2%) trong báo cáo này có vẻ THẤP HƠN thực tế (WB ước tính >140%). Cần cẩn trọng 'tảng băng chìm'!",
    overheating: "🦉 'Nhiệt Kế': Chưa sốt! Lạm phát 3.3% vẫn trong tầm kiểm soát. Tín dụng mới chạy 6.9% (chưa nóng). Chỉ có M2 là hơi cao. Vẫn còn dư địa để 'đạp ga' tiếp!"
};
