export const WEALTH_PYRAMID_DATA = [
    {
        tier: "Low",
        range: "< 250M",
        population_pct: 62,
        wealth_share: 5,
        population: "43.2M",
        color: "#94a3b8",
        definition: "Nhóm dân số đông nhất nhưng nắm ít tài sản nhất.",
        owl_says: "🦉 'Hạt Gạo Làng Ta': Lực lượng lao động chính, nhưng ví tiền mỏng manh. Chỉ cần một cơn bão bệnh tật hay thất nghiệp là lung lay."
    },
    {
        tier: "Middle",
        range: "250M - 2.5 Tỷ",
        population_pct: 35,
        wealth_share: 35,
        population: "24.5M",
        color: "#3b82f6",
        definition: "Tầng lớp trung lưu, xương sống của nền kinh tế.",
        owl_says: "🦉 'Ong Thợ Chăm Chỉ': Có nhà (trả góp), có xe, có sổ tiết kiệm. Là mục tiêu săn đón của các ngân hàng và shop hàng hiệu."
    },
    {
        tier: "HNW",
        range: "2.5 Tỷ - 25 Tỷ",
        population_pct: 3,
        wealth_share: 43,
        population: "2.1M",
        color: "#eab308",
        definition: "Triệu phú USD (High Net Worth). Giới giàu mới nổi.",
        owl_says: "🦉 'Đại Bàng Non': Tự do tài chính bước đầu. Tiền đẻ ra tiền. Sở hữu nhiều BĐS và bắt đầu quan tâm đến Art, Rượu vang."
    },
    {
        tier: "UHNW",
        range: "> 25 Tỷ",
        population_pct: 0.3,
        wealth_share: 17,
        population: "200K",
        color: "#ef4444",
        definition: "Giới siêu giàu (Ultra High Net Worth). Top 1%.",
        owl_says: "🦉 'Cá Mập Chúa': Tiền chỉ là con số. Lãi suất ngân hàng 1 tháng đủ nuôi cả dòng họ. Lái cuộc chơi đầu tư."
    }
];

export const LORENZ_CURVE_DATA = [
    { pop_cumulative: 0, wealth_cumulative: 0, equality: 0 },
    { pop_cumulative: 10, wealth_cumulative: 0.5, equality: 10 },
    { pop_cumulative: 20, wealth_cumulative: 1.7, equality: 20 },
    { pop_cumulative: 30, wealth_cumulative: 3.7, equality: 30 },
    { pop_cumulative: 40, wealth_cumulative: 6.7, equality: 40 },
    { pop_cumulative: 50, wealth_cumulative: 11.2, equality: 50 },
    { pop_cumulative: 60, wealth_cumulative: 18.2, equality: 60 },
    { pop_cumulative: 70, wealth_cumulative: 28.2, equality: 70 },
    { pop_cumulative: 80, wealth_cumulative: 43.2, equality: 80 },
    { pop_cumulative: 90, wealth_cumulative: 68.2, equality: 90 },
    { pop_cumulative: 100, wealth_cumulative: 100, equality: 100 }
];

export const GINI_TREND_DATA = [
    { year: 2012, gini_wealth: 0.630, gini_income: 0.401 },
    { year: 2014, gini_wealth: 0.633, gini_income: 0.399 },
    { year: 2016, gini_wealth: 0.629, gini_income: 0.395 },
    { year: 2018, gini_wealth: 0.608, gini_income: 0.392 },
    { year: 2020, gini_wealth: 0.613, gini_income: 0.389 },
    { year: 2024, gini_wealth: 0.600, gini_income: 0.372 }
];

export const ASSET_COMPOSITION_DATA = [
    { type: "Real Estate", vn_pct: 72, us_pct: 35, cn_pct: 68, color: "#ef4444" }, // VN heavily skewed RE
    { type: "Financial", vn_pct: 5, us_pct: 58, cn_pct: 27, color: "#3b82f6" }, // Stocks/Bonds
    { type: "Durables", vn_pct: 23, us_pct: 7, cn_pct: 5, color: "#eab308" } // Gold, Cars, jewelry
];

export const ECONOMIC_CLASS_DATA = [
    {
        class: "E",
        label: "Low Income",
        income: "< 5M",
        pct_2024: 44,
        pct_2030: 30,
        color: "#64748b",
        owl_says: "Thu nhập dưới 5 triệu. Chi tiêu chủ yếu cho ăn uống, sinh hoạt phí cơ bản. Dễ bị tổn thương nhất khi giá cả leo thang."
    },
    {
        class: "D",
        label: "Lower-Middle",
        income: "5-15M",
        pct_2024: 28,
        pct_2030: 25,
        color: "#3b82f6",
        owl_says: "Thu nhập 5-15 triệu. Đủ sống nhưng khó tích lũy. Bắt đầu quan tâm đến mua sắm online, săn sale."
    },
    {
        class: "C",
        label: "Middle Class",
        income: "15-25M",
        pct_2024: 18,
        pct_2030: 25,
        color: "#22c55e",
        owl_says: "Thu nhập 15-25 triệu. Tầng lớp trung lưu mới. Sẵn sàng vay mua nhà, mua xe trả góp. Động lực chính của nền kinh tế."
    },
    {
        class: "B",
        label: "Upper-Middle",
        income: "25-50M",
        pct_2024: 8,
        pct_2030: 15,
        color: "#eab308",
        owl_says: "Thu nhập 25-50 triệu. Sống thoải mái, du lịch nước ngoài, cho con học trường tư. Bắt đầu đầu tư cổ phiếu, đất nền."
    },
    {
        class: "A",
        label: "Elite",
        income: "> 50M",
        pct_2024: 2,
        pct_2030: 5,
        color: "#ef4444",
        owl_says: "Thu nhập trên 50 triệu. Giới tinh hoa. Tiêu dùng hàng hiệu, xe sang. Mối quan tâm là giữ tiền và chuyển giao tài sản."
    }
];

export const INCOME_PERCENTILES = [
    { label: "Top 1% (Elite)", threshold_vnd: 152, threshold_usd: 72715, color: "#ef4444" },
    { label: "Top 5% (Affluent)", threshold_vnd: 66, threshold_usd: 31398, color: "#f97316" },
    { label: "Top 10% (Upper)", threshold_vnd: 43, threshold_usd: 20609, color: "#eab308" },
    { label: "Median (P50)", threshold_vnd: 13, threshold_usd: 6400, color: "#3b82f6" },
    { label: "Bottom 30%", threshold_vnd: 8, threshold_usd: 3984, color: "#94a3b8" }
];
