-- Seed Definitions for Tooltips (Top Indicators)
-- Run this in Supabase SQL Editor

UPDATE economic_events
SET definition_vi = 'Chỉ số Giá tiêu dùng (Measure of inflation). Đo lường sự thay đổi giá cả dịch vụ/hàng hoá. CPI tăng => Lạm phát tăng => Dễ tăng lãi suất.'
WHERE event_name LIKE '%CPI%';

UPDATE economic_events
SET definition_vi = 'Tổng sản phẩm quốc nội. Thước đo sức khoẻ nền kinh tế. GDP tăng => Kinh tế khoẻ => Tốt cho chứng khoán.'
WHERE event_name LIKE '%GDP%';

UPDATE economic_events
SET definition_vi = 'Chỉ số Quản lý Thu mua. PMI > 50 là mở rộng (Tốt), PMI < 50 là thu hẹp (Xấu). Đo lường sức khoẻ ngành sản xuất/dịch vụ.'
WHERE event_name LIKE '%PMI%';

UPDATE economic_events
SET definition_vi = 'Bảng lương phi nông nghiệp Mỹ. Số lượng việc làm mới tạo ra (trừ nông nghiệp). Số này cao => Kinh tế Mỹ quá khoẻ => Fed sợ lạm phát => Dễ giữ lãi suất cao.'
WHERE event_name LIKE '%Non-Farm Payrolls%';

UPDATE economic_events
SET definition_vi = 'Quyết định lãi suất (Fed/ECB/SBV). Lãi suất tăng => Tiền đắt => Chứng khoán dễ giảm. Lãi suất giảm => Tiền rẻ => Chứng khoán dễ bay.'
WHERE event_name LIKE '%Interest Rate%';

UPDATE economic_events
SET definition_vi = 'Doanh số bán lẻ. Đo sức mua của người dân. Dân chi tiêu mạnh => Kinh tế tốt => Doanh nghiệp có lãi.'
WHERE event_name LIKE '%Retail Sales%';

UPDATE economic_events
SET definition_vi = 'Số đơn xin trợ cấp thất nghiệp lần đầu. Số này tăng cao => Dân thất nghiệp nhiều => Kinh tế yếu đi.'
WHERE event_name LIKE '%Jobless Claims%';

UPDATE economic_events
SET definition_vi = 'Dữ liệu tồn kho dầu thô (API/EIA). Tồn kho giảm => Cầu cao/Cung thấp => Giá dầu dễ tăng.'
WHERE event_name LIKE '%Crude Oil%';
