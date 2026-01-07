-- Add definition for JOLTS Job Openings (Cú Thông Thái Style)
-- "Giải ngố": JOLTS là báo cáo xem các công ty đang cần tuyển bao nhiêu người.

UPDATE economic_events
SET definition_vi = 'JOLTS đếm số lượng tin tuyển dụng đang treo. Số này cao => Doanh nghiệp khát người, kinh tế khoẻ. Nhưng cao quá thì dễ gây lạm phát (do phải tăng lương hút người), khiến Fed sợ và không dám giảm lãi suất sớm.'
WHERE event_name LIKE '%JOLTS%';
