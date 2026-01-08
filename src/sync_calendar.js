
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// FMP Config
const FMP_API_KEY = 'yyDnvvfeBME7XcxAUzDI8V28KGKtXnCg';
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const CURRENCIES = ['USD', 'VND', 'CNY', 'EUR', 'JPY', 'GBP'];
const IMPORTANT_EVENTS_VN = ['CPI', 'GDP', 'Rate', 'Trade', 'Retail', 'Industrial'];

async function syncCalendar() {
    console.log("📅 Starting Economic Calendar Sync (FMP & VN)...");

    // 1. Define Time Range (-3 Months to +3 Months) to catch strict past and future
    const today = new Date();
    const past = new Date();
    past.setMonth(today.getMonth() - 2);
    const future = new Date();
    future.setMonth(today.getMonth() + 2);

    const fromDate = past.toISOString().split('T')[0];
    const toDate = future.toISOString().split('T')[0];

    console.log(`   ⏳ Fetching range: ${fromDate} to ${toDate}`);

    // 2. Fetch from FMP
    const url = `${FMP_BASE_URL}/economic-calendar?from=${fromDate}&to=${toDate}&apikey=${FMP_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("   ❌ FMP API Error:", data);
            return;
        }

        console.log(`   📥 Received ${data.length} raw events.`);

        // 3. Filter & Map
        const filteredEvents = data.filter(e => {
            if (!e.currency) return false;
            // Vietnam: Keep ALL events
            if (e.currency === 'VND' || e.country === 'VN') return true;
            // Major Currencies: Keep High/Medium impact only
            if (CURRENCIES.includes(e.currency)) {
                // FMP impact is usually "Low", "Medium", "High" or null
                return e.impact === 'High' || e.impact === 'Medium';
            }
            return false;
        });

        console.log(`   📉 Filtered down to ${filteredEvents.length} relevant events.`);

        // --- OWL PERSONA KNOWLEDGE BASE ---

        // --- OWL PERSONA KNOWLEDGE BASE (V3 - DETAILED) ---

        const EVENT_DEFINITIONS = {
            // INFLATION
            'CPI': "Chỉ số giá tiêu dùng (CPI). Đây là thước đo lạm phát phổ biến nhất. Nó giống như cái 'hóa đơn đi chợ' của toàn dân. Hóa đơn tăng nghĩa là tiền mất giá.",
            'PPI': "Chỉ số giá sản xuất (PPI). Giá bán buôn tại cổng nhà máy. Nếu giá này tăng, sớm muộn gì giá hàng hóa ngoài siêu thị cũng tăng theo.",
            'PCE': "Chỉ số chi tiêu tiêu dùng cá nhân (PCE). Đây là thước đo lạm phát ưa thích của Fed vì nó phản ánh hành vi thay đổi hàng hóa của người dân khi giá tăng.",

            // LABOR
            'Non Farm Payrolls': "Bảng lương phi nông nghiệp. Số lượng việc làm mới được tạo ra trong tháng (trừ ngành nông nghiệp). Đây là chỉ số quan trọng nhất đánh giá sức khỏe kinh tế Mỹ.",
            'Unemployment Rate': "Tỷ lệ thất nghiệp. Phần trăm số người trong lực lượng lao động đang không có việc làm. Tỷ lệ này càng thấp, kinh tế càng khỏe (nhưng Fed lại lo lạm phát).",
            'Initial Jobless Claims': "Số đơn xin trợ cấp thất nghiệp lần đầu. Số liệu này ra hàng tuần, cho biết có bao nhiêu người vừa bị sa thải tuần qua. Con số này tăng là dấu hiệu xấu cho thị trường lao động.",
            'Continuing Jobless Claims': "Tổng số người đang nhận tiền trợ cấp thất nghiệp. Nếu số này tăng, nghĩa là người thất nghiệp khó tìm được việc làm mới.",
            'Jobless Claims 4-Week Average': "Trung bình 4 tuần của đơn xin trợ cấp thất nghiệp. Giúp loại bỏ các biến động nhiễu hàng tuần, cho cái nhìn chuẩn xác hơn về xu hướng sa thải.",
            'JOLTs': "Cơ hội việc làm (JOLTs). Số lượng vị trí tuyển dụng đang mở. Số này cao chứng tỏ các sếp đang 'khát' nhân viên, người lao động có quyền đòi lương cao hơn.",

            // ACTIVITY & GROWTH
            'GDP': "Tổng sản phẩm quốc nội (GDP). Tổng thu nhập của cả nền kinh tế. Số dương là tăng trưởng, số âm là thụt lùi. Hai quý âm liên tiếp gọi là 'Suy thoái kỹ thuật'.",
            'Retail Sales': "Doanh số bán lẻ. Phản ánh sức mua của người dân. Dân dám chi tiền mua sắm tẹt ga thì kinh tế mới chạy tốt.",
            'Consumer Confidence': "Niềm tin tiêu dùng. Đo lường độ lạc quan của người dân về tài chính. Dân có tin tưởng tương lai thì mới dám vay tiền tiêu xài.",
            'Manufacturing PMI': "Chỉ số quản trị mua hàng (PMI) ngành Sản xuất. Khảo sát các giám đốc nhà máy. Trên 50 là mở rộng, dưới 50 là thu hẹp (ế ẩm).",
            'Services PMI': "Chỉ số quản trị mua hàng (PMI) ngành Dịch vụ. Tương tự như sản xuất nhưng cho mảng dịch vụ (Du lịch, Nhà hàng, Tài chính...). Mảng này chiếm phần lớn GDP Mỹ.",
            'Chicago PMI': "Chỉ số PMI vùng Chicago. Một chỉ báo sớm quan trọng về sức khỏe ngành sản xuất tại trung tâm công nghiệp lớn của Mỹ.",
            'NBS Manufacturing PMI': "PMI Sản xuất của Trung Quốc (NBS - Tổng cục Thống kê). Số liệu chính thức của chính phủ TQ về sức khỏe công xưởng thế giới.",
            'Caixin Manufacturing PMI': "PMI Sản xuất Trung Quốc (Caixin). Khảo sát tư nhân, tập trung vào các doanh nghiệp vừa và nhỏ, xuất khẩu. Thường nhạy hơn số liệu NBS.",

            // ENERGY
            'Crude Oil Inventories': "Dự trữ Dầu thô (EIA). Báo cáo hàng tuần của Chính phủ Mỹ về lượng dầu trong kho. Kho vơi là cầu tăng (Giá dầu dễ tăng), kho đầy là ế ẩm (Giá dầu dễ giảm).",
            'API Crude Oil': "Dự trữ Dầu thô (API). Báo cáo của Viện Dầu khí Mỹ (Tư nhân), thường ra trước báo cáo EIA một ngày. Trader dùng nó để 'đoán' số liệu EIA.",
            'Gasoline Inventories': "Dự trữ Xăng. Tương tự dầu thô, nhưng là xăng thành phẩm. Mùa hè dân Mỹ đi du lịch nhiều (Driving Season) thì kho này thường giảm mạnh.",
            'Natural Gas Storage': "Dự trữ Khí tự nhiên. Quan trọng vào mùa đông. Kho vơi nhanh nghĩa là dân đốt sưởi nhiều, giá khí sẽ tăng.",

            // CENTRAL BANK & FINANCE
            'Fed Interest Rate': "Lãi suất điều hành của Fed. Công cụ quyền lực nhất thế giới tài chính. Tăng lãi là 'đạp phanh' kinh tế (giảm lạm phát), giảm lãi là 'bơm oxy' (kích thích tăng trưởng).",
            'FOMC Minutes': "Biên bản cuộc họp FOMC. Chi tiết những gì các quan chức Fed đã bàn luận trong cuộc họp trước (thường ra sau 3 tuần). Soi từng câu chữ để đoán ý định tương lai.",
            'FOMC Statement': "Tuyên bố FOMC. Văn bản chính thức sau cuộc họp, công bố lãi suất mới và quan điểm về kinh tế.",
            'Trade Balance': "Cán cân thương mại. Xuất khẩu trừ Nhập khẩu. Dương (Xuất siêu) là bán đắt hàng, Âm (Nhập siêu) là mua nhiều hơn bán.",
            'CFTC Gold': "Báo cáo vị thế ròng (COT) của CFTC. Cho biết 'phe cá mập' (Smart Money) đang Long (mua) hay Short (bán) ròng đối với Vàng.",
            '10-Year Note Auction': "Đấu giá Trái phiếu 10 năm. Lãi suất trúng thầu cho biết giới đầu tư đang kỳ vọng gì về lãi suất dài hạn.",
            'Housing Starts': "Số lượng nhà mới khởi công. Dân dám xây nhà là kinh tế đang hưng phấn.",
            'Building Permits': "Giấy phép xây dựng. Chỉ báo sớm cho thấy sắp tới có nhiều công trường mọc lên không.",

            // EUROPE & OTHERS
            'Unemployment Change': "Số lượng người thất nghiệp thay đổi (Thường dùng ở Đức/Anh). Số dương là nhiều người mất việc hơn (Xấu), số âm là bớt người thất nghiệp (Tốt).",
            'Nationwide Housing Prices': "Chỉ số giá nhà Nationwide (Anh). Thước đo uy tín về sức nóng của thị trường bất động sản Anh Quốc.",
            'Consumer Credit': "Tín dụng tiêu dùng. Dân Mỹ vay nợ nhiều để tiêu xài hay đang thắt lưng buộc bụng? Vay nhiều là tự tin, vay ít là lo âu.",

            // CFTC POSITIONING
            'CFTC S&P 500': "Báo cáo vị thế S&P 500 (CFTC). Cho biết các quỹ lớn (Smart Money) đang đặt cược thị trường chứng khoán Mỹ Tăng (Long) hay Giảm (Short).",
            'CFTC Nasdaq': "Báo cáo vị thế Nasdaq 100 (CFTC). Xem 'cá mập' đang gom hay xả cổ phiếu công nghệ.",
            'CFTC Crude Oil': "Báo cáo vị thế Dầu thô (CFTC). Soi xem các ông trùm năng lượng đang kỳ vọng giá dầu lên hay xuống.",
            'CFTC': "Báo cáo Cam kết Thương nhân (COT) của CFTC. Bản đồ dòng tiền của các quỹ đầu cơ lớn trên thị trường phái sinh."
        };

        const getDefinition = (name) => {
            // Sort keys by length desc to match specific phrases first (e.g. 'Flash Manufacturing PMI' before 'PMI')
            const sortedKeys = Object.keys(EVENT_DEFINITIONS).sort((a, b) => b.length - a.length);
            for (const key of sortedKeys) {
                if (name.includes(key) || name.toLowerCase().includes(key.toLowerCase())) return EVENT_DEFINITIONS[key];
            }
            return "Sự kiện kinh tế quan trọng, cần theo dõi biến động thực tế so với kỳ trước để đánh giá xu hướng.";
        };

        // PROFESSOR OWL LOGIC ENGINE 🦉🎓 -> Now "Jungle Analysts"

        const getRandomCharacterIntro = (sentiment) => {
            const INTROS = [
                "🦉 Cú Thông Thái soi: ",
                "📈 Bìm Bịp hô hào: ",
                "📉 Chim Lợn cảnh báo: ",
                "🦈 Cá Mập rình mồi: ",
                "🎀 Cú Hồng thắc mắc: ",
                "🦓 Ngựa Vằn hoang mang: "
            ];
            return INTROS[Math.floor(Math.random() * INTROS.length)];
        };

        const generateExplanatoryCommentary = (e, context) => {
            // MUST have Actual to comment.
            // MODIFICATION: If Actual is missing, return Neutral + Definition instead of logic.
            if (e.actual === null || e.actual === undefined || e.actual === '') {
                const def = getDefinition(e.event);
                // Check if it's High Impact to warn user
                let warning = "";
                if (e.impact === 'High') warning = "\n⚠️ Sự kiện quan trọng nhưng chưa có dữ liệu công bố.";
                return {
                    sentiment: 'NEUTRAL',
                    comment: `ℹ️ Chưa có số liệu thực tế để phân tích.\n💡 Thông tin thêm: ${def}${warning}`,
                    definition: def
                };
            }

            const actual = parseFloat(e.actual);
            const hasForecast = (e.estimate !== null && e.estimate !== undefined && e.estimate !== '');
            const forecast = hasForecast ? parseFloat(e.estimate) : null;
            const previous = parseFloat(e.previous);

            const name = e.event;
            const definition = getDefinition(name);

            if (isNaN(actual)) return { sentiment: null, comment: null, definition };

            // Base Comparisons
            let diff, percent;
            let comparisonText = "";

            if (hasForecast && !isNaN(forecast)) {
                diff = actual - forecast;
                percent = forecast !== 0 ? (diff / Math.abs(forecast)) * 100 : 0;
                comparisonText = `(Dự báo ${forecast})`;
            } else if (!isNaN(previous)) {
                diff = actual - previous;
                percent = previous !== 0 ? (diff / Math.abs(previous)) * 100 : 0;
                comparisonText = `(Kỳ trước ${previous})`;
            } else {
                diff = 0;
                percent = 0;
                comparisonText = "(Không có dự báo)";
            }

            let sentiment = 'NEUTRAL';
            let analysis = "";
            let impact_country = ""; // Impact on the issuing country
            let impact_world = "";   // Impact on Assets (Gold, Crypto)
            let impact_vn = "";      // Impact on Vietnam (Conditional)

            const isHigher = diff > 0;
            const isLower = diff < 0;

            // Country Mapping
            let countryName = "Nước sở tại";
            if (e.currency === 'USD') countryName = "Mỹ";
            else if (e.currency === 'EUR') countryName = "Châu Âu (EU)";
            else if (e.currency === 'GBP') countryName = "Anh Quốc";
            else if (e.currency === 'JPY') countryName = "Nhật Bản";
            else if (e.currency === 'CNY') countryName = "Trung Quốc";
            else if (e.currency === 'VND') countryName = "Việt Nam";

            // --- LOGIC ENGINE ---

            // 1. INFLATION (CPI, PPI, PCE) -> Lower is Good
            if (name.includes('CPI') || name.includes('PPI') || name.includes('Price Index')) {
                if (isHigher && Math.abs(percent) > 0.1) {
                    sentiment = 'BEARISH';
                    analysis = `Lạm phát 'nóng' hơn kỳ vọng ${comparisonText}. Giá cả leo thang làm đau đầu các nhà hoạch định chính sách.`;
                    impact_country = "NHTW sẽ phải giữ 'phanh' lãi suất lâu hơn để kiềm chế giá cả.";
                    impact_world = "Đồng tiền nội tệ tăng giá. Vàng và Crypto chịu áp lực giảm.";
                    impact_vn = "Tỷ giá USD/VND có thể căng thẳng. Dòng vốn ngoại e ngại.";
                } else if (isLower && Math.abs(percent) > 0.1) {
                    sentiment = 'BULLISH';
                    analysis = `Lạm phát hạ nhiệt ${comparisonText}! Hàng hóa rẻ đi, áp lực lên ví tiền giảm bớt.`;
                    impact_country = "Tin tốt! NHTW có cơ sở để sớm hạ lãi suất hỗ trợ kinh tế.";
                    impact_world = "Đồng tiền nội tệ giảm. Vàng và Bitcoin hưởng lợi từ kỳ vọng tiền rẻ.";
                    impact_vn = "SBV dễ thở hơn trong điều hành tỷ giá. Tiền rẻ rục rịch chảy vào.";
                } else {
                    analysis = "Lạm phát đi ngang, đúng như kịch bản an toàn.";
                    impact_country = "Chính sách tiền tệ tiếp tục duy trì sự thận trọng.";
                    impact_world = "Thị trường chưa có cớ để bùng nổ. Phe Bò và Gấu vẫn đang gườm nhau.";
                    impact_vn = ""; // No significant impact
                }
            }

            // 2. LABOR MARKET (Payrolls, Unemployment, Claims)
            else if (name.includes('Payroll') || name.includes('Employment') || name.includes('JOLTs')) {
                if (isHigher && Math.abs(percent) > 1) { // Strong Jobs
                    sentiment = 'BEARISH';
                    analysis = `Thị trường việc làm quá khỏe ${comparisonText}. Doanh nghiệp vẫn tuyển dụng ầm ầm.`;
                    impact_country = "Kinh tế tốt nhưng NHTW sẽ lo lương tăng gây lạm phát. Lãi suất sẽ giữ ở mức cao.";
                    impact_world = "USD/Lợi suất trái phiếu tăng. Tài sản rủi ro (Chứng khoán, Crypto) bị 'hút máu'.";
                    impact_vn = "Tỷ giá chịu áp lực. Dòng vốn FII có thể rút ròng.";
                } else if (isLower && Math.abs(percent) > 1) { // Weak Jobs
                    sentiment = 'BULLISH';
                    analysis = `Thị trường việc làm 'cảm lạnh' ${comparisonText}. Doanh nghiệp ngấm đòn lãi suất cao.`;
                    impact_country = "Kinh tế yếu đi buộc NHTW phải sớm 'bơm oxy' (hạ lãi).";
                    impact_world = "USD suy yếu. Vàng và Coin sẽ hưởng lợi lớn.";
                    impact_vn = "Áp lực tỷ giá giảm. Cơ hội cho dòng tiền đầu cơ quay lại.";
                } else {
                    analysis = "Thị trường việc làm ổn định, đi đúng quỹ đạo.";
                    impact_country = "Kịch bản 'Hạ cánh mềm' (Soft Landing) đang đi đúng hướng.";
                    impact_world = "Thị trường dao động biên độ hẹp.";
                    impact_vn = "";
                }
            }
            else if (name.includes('Claims') || name.includes('Unemployment')) {
                if (isHigher) { // Unemployment UP -> Fed Pivot -> Bullish Assets
                    sentiment = 'BULLISH';
                    analysis = `Số người thất nghiệp tăng ${comparisonText}. Kiếm việc làm đang khó khăn hơn.`;
                    impact_country = "Áp lực lên NHTW phải nới lỏng tiền tệ để cứu vãn việc làm.";
                    impact_world = "Tiền rẻ sắp trở lại? DXY giảm là cơ hội cho Vàng và Bitcoin.";
                    impact_vn = "Tỷ giá hạ nhiệt, dư địa chính sách rộng mở.";
                } else if (isLower) {
                    sentiment = 'BEARISH';
                    analysis = `Ít người thất nghiệp hơn ${comparisonText}. Ai cũng có việc làm thì kinh tế còn 'lì' lắm.`;
                    impact_country = "NHTW sẽ chưa vội hạ lãi đâu. Tiền rẻ còn xa lắm.";
                    impact_world = "Tài sản rủi ro gặp khó. Cash is King.";
                    impact_vn = "Khối ngoại có thể bán ròng.";
                } else {
                    analysis = "Số liệu thị trường lao động không đổi. Mọi thứ vẫn hoạt động bình thường.";
                    impact_country = "Không có thay đổi lớn trong kỳ vọng chính sách.";
                    impact_world = "Trader đang chờ các tín hiệu rõ ràng hơn.";
                    impact_vn = "";
                }
            }

            // 3. ACTIVITY (GDP, Retail Sales, PMI)
            else if (name.includes('GDP') || name.includes('Retail') || name.includes('PMI')) {
                if (isHigher && Math.abs(percent) > 2) {
                    sentiment = 'BULLISH';
                    analysis = `Kinh tế tăng trưởng mạnh mẽ ${comparisonText}. Các hoạt động sản xuất kinh doanh sôi động.`;
                    impact_country = "Suy thoái? Còn lâu nhé! Tâm lý lạc quan bao trùm.";
                    impact_world = "Chứng khoán nước sở tại hưởng lợi. Dòng tiền tin tưởng vào tăng trưởng.";
                    impact_vn = "Xuất khẩu (dệt may, gỗ...) sang thị trường này sẽ thuận lợi.";
                } else if (isLower && Math.abs(percent) > 2) {
                    sentiment = 'BEARISH';
                    analysis = `Báo động! Các chỉ số hoạt động suy yếu ${comparisonText}. Kinh tế đang phanh gấp.`;
                    impact_country = "Nỗi lo suy thoái nhen nhóm. Người dân thắt lưng buộc bụng.";
                    impact_world = "Dòng tiền tìm về kênh trú ẩn an toàn (Trái phiếu).";
                    impact_vn = "Đơn hàng xuất khẩu sụt giảm. Cảng biển, vận tải bị ảnh hưởng.";
                } else {
                    analysis = "Kinh tế tăng trưởng đúng lộ trình, số liệu khớp dự báo.";
                    impact_country = "Mọi thứ vẫn trong tầm kiểm soát. 'No news is good news'.";
                    impact_world = "Ít biến động.";
                    impact_vn = "";
                }
            }

            // 4. ENERGY (Crude Oil, Gasoline)
            else if (name.includes('Crude') || name.includes('Gasoline') || name.includes('Inventory')) {
                // Impact Country here is mainly about Inflation/Energy Prices
                countryName = "Thị trường Năng lượng";
                if (diff > 0) {
                    sentiment = 'BULLISH';
                    analysis = `Kho dự trữ đầy ắp ${comparisonText}! Nguồn cung đang dư thừa.`;
                    impact_country = "Giá năng lượng sẽ giảm -> Lạm phát bớt áp lực.";
                    impact_world = "Giá dầu (WTI/Brent) chịu áp lực giảm. Tốt cho thị trường chung.";
                    impact_vn = "Giá xăng kỳ tới hy vọng giảm. Nhóm vận tải/phân bón hưởng lợi.";
                } else {
                    sentiment = 'BEARISH';
                    analysis = `Kho dự trữ vơi đi nhanh chóng ${comparisonText}. Nhu cầu đang vượt nguồn cung.`;
                    impact_country = "Giá năng lượng dễ tăng lại -> Lạm phát khó giảm.";
                    impact_world = "Giá dầu tăng. Cổ phiếu dầu khí hưởng lợi nhưng xấu cho vĩ mô.";
                    impact_vn = "Giá xăng có thể tăng. Cổ phiếu PVD, PVS có câu chuyện.";
                }
            }

            // 5. RATES & MINUTES
            else if (name.includes('Rate') || name.includes('Decision')) {
                if (isHigher) {
                    sentiment = 'BEARISH';
                    analysis = `Tin sét đánh! Lãi suất tăng lên ${actual}%. 'Máy hút tiền' bật max công suất.`;
                    impact_country = "Mùa đông tài chính. Chi phí vay vốn tăng cao đè nặng doanh nghiệp.";
                    impact_world = "Tiền rút về gửi tiết kiệm/trái phiếu. Chứng khoán tắm máu.";
                    impact_vn = "Lãi suất liên ngân hàng nhích lên. Cổ phiếu BĐS, Chứng khoán gặp khó.";
                } else if (isLower) {
                    sentiment = 'BULLISH';
                    analysis = `Quay xe rồi! Lãi suất giảm xuống ${actual}%. Van tiền đã mở.`;
                    impact_country = "Kích thích kinh tế. Doanh nghiệp và người dân dễ thở hơn.";
                    impact_world = "Tiền rẻ chảy vào tài sản rủi ro. Mùa uptrend bắt đầu?";
                    impact_vn = "Cơn mưa rào giải tỏa thanh khoản. Múc xúc húc!";
                } else {
                    sentiment = 'NEUTRAL';
                    analysis = `Lãi suất giữ nguyên ở mức ${actual}%. Quan trọng là định hướng tương lai.`;
                    impact_country = "Chính sách duy trì sự ổn định để quan sát thêm.";
                    impact_world = "Thị trường nín thở chờ tín hiệu từ bài phát biểu/biểu đồ Dot Plot.";
                    impact_vn = "Tỷ giá tạm thời ổn định.";
                }
            } else {
                // Generic
                if (Math.abs(percent) > 5) {
                    analysis = `Số liệu biến động mạnh ${comparisonText}. Cần chú ý kỹ.`;
                    impact_country = "Tác động tức thì lên tâm lý nhà đầu tư.";
                    impact_world = "Biến động mạnh trong ngắn hạn.";
                    impact_vn = "";
                } else {
                    analysis = "Số liệu ra lò không chênh lệch nhiều. Mọi thứ vẫn bình thường.";
                    impact_country = "Ổn định.";
                    impact_world = "Ít biến động.";
                    impact_vn = "";
                }
            }

            // Assembly Commentary
            const intro = getRandomCharacterIntro(sentiment);
            let comment = `${intro}${analysis}`;

            // Add Tiered Impact
            if (impact_country) comment += `\n👉 Tại ${countryName}: ${impact_country}`;
            if (impact_world) comment += `\n🌍 Thế giới: ${impact_world}`;

            // Add VN Impact ONLY if relevant (High Impact USD/CNY/VND)
            // Logic: if impact_vn is set AND (currency is VND OR (USD/CNY and Impact High/Medium))
            const isRelevantForVN = e.currency === 'VND' || ((e.currency === 'USD' || e.currency === 'CNY') && (e.impact === 'High' || e.impact === 'Medium'));

            if (impact_vn && isRelevantForVN) {
                comment += `\n🇻🇳 Việt Nam: ${impact_vn}`;
            }

            // Add Context Warning (Only for HIGH IMPACT events)
            if (e.impact === 'High' && context && context.upcoming && context.upcoming.length > 0) {
                const upcomingNames = context.upcoming.slice(0, 2).map(ev => ev.event).join(", ");
                comment += `\n⚠️ Lưu ý: Trong 7 ngày tới còn có tin quan trọng: ${upcomingNames}.`;
            } else if (sentiment === 'NEUTRAL' || !hasForecast) {
                // Or add definition context if neutral/boring
                comment += `\n💡 Thông tin thêm: ${definition.split('.')[0]}.`;
            }

            return { sentiment, comment, definition };
        };

        // Map to DB Schema
        const dbRows = filteredEvents.map(e => {
            // Find context: Upcoming High Impact events in next 7 days
            const eventDate = new Date(e.date);
            const nextWeek = new Date(eventDate);
            nextWeek.setDate(eventDate.getDate() + 7);

            const upcoming = filteredEvents.filter(ev => {
                const d = new Date(ev.date);
                return d > eventDate && d <= nextWeek && (ev.impact === 'High' || ev.currency === 'USD');
            });

            const context = { upcoming };
            const { sentiment, comment, definition } = generateExplanatoryCommentary(e, context);

            return {
                event_name: e.event,
                currency: e.currency,
                impact_level: e.impact || 'Low',
                event_time: e.date, // FMP returns "YYYY-MM-DD HH:mm:ss"
                previous: e.previous ? String(e.previous) : null,
                forecast: e.estimate ? String(e.estimate) : null,
                actual: e.actual ? String(e.actual) : null,
                ai_sentiment: sentiment,
                ai_commentary: comment,
                definition_vi: definition
            };
        });

        // 4. Truncate & Insert
        // Warning: Supabase generic client doesn't support "truncate". 
        // We will "delete all" (dangerous for huge tables, but ok here).
        // Or upsert? Upsert is safer if we want to preserve IDs, but user said "make standard again", implies clean slate.
        // Let's delete all events within the window? Or just delete all?
        // User said "failed payload" (test data). Best to clear table.

        console.log("   🧹 Clearing existing 'economic_events' table...");
        const { error: delError } = await supabase
            .from('economic_events')
            .delete()
            .neq('id', 0); // Hack to delete all rows

        if (delError) console.error("   ⚠️ Clear Warning:", delError.message);

        // Batch Insert
        const BATCH = 50;
        for (let i = 0; i < dbRows.length; i += BATCH) {
            const chunk = dbRows.slice(i, i + BATCH);
            const { error: insError } = await supabase
                .from('economic_events')
                .insert(chunk);

            if (insError) console.error(`   ❌ Insert Batch ${i} Error:`, insError.message);
            else console.log(`   ✅ Inserted batch ${i} - ${i + chunk.length}`);
        }

        console.log("🎉 Sync Complete!");

    } catch (err) {
        console.error("   ❌ Script Failed:", err);
    }
}

syncCalendar();
