
# 📁 Yêu Cầu Dữ Liệu Lịch Sử (Data Specs)

Ông chuẩn bị giúp tôi các file Excel hoặc CSV (UTF-8) theo định dạng dưới đây nhé.
Mỗi loại dữ liệu nên để một file riêng cho dễ quản lý.

## 1. Tỷ Giá USD/VND (Official & Chợ Đen)
*Tên file gợi ý:* `ty_gia_history.csv`
*Cột:* `Date`, `Official`, `BlackMarket`

**Ví dụ:**
```csv
Date,Official,BlackMarket
2024-01-01,24300,24800
2024-01-02,24350,24900
...
```

## 2. Tăng Trưởng GDP (Theo Quý/Năm)
*Tên file gợi ý:* `gdp_vietnam.csv`
*Cột:* `Date`, `GDP_YoY` (Phần trăm tăng trưởng so với cùng kỳ)

**Ví dụ:**
```csv
Date,GDP_YoY
2023-12-31,6.72
2023-09-30,5.33
2023-06-30,4.14
...
```
*(Lưu ý: Date nên để là ngày cuối của Quý)*

## 3. Lãi Suất (Điều Hành & Tiết Kiệm 12T)
*Tên file gợi ý:* `lai_suat.csv`
*Cột:* `Date`, `RefRate`, `Savings12M`

**Ví dụ:**
```csv
Date,RefRate,Savings12M
2024-01-01,4.5,5.0
2023-12-01,4.5,5.2
...
```

## 4. Lạm Phát (CPI YoY)
*Tên file gợi ý:* `cpi_inflation.csv`
*Cột:* `Date`, `CPI_YoY`

**Ví dụ:**
```csv
Date,CPI_YoY
2024-01-31,3.4
2023-12-31,3.2
...
```

---
**Ghi chú:**
- Định dạng ngày: `YYYY-MM-DD` (Năm-Tháng-Ngày) là chuẩn nhất.
- Số liệu: Dùng dấu chấm `.` cho số thập phân (Ví dụ: `6.5`, không dùng `6,5`).
- Nếu ông có file Excel gộp chung cũng được, nhưng tách ra CSV thì tool chạy nhanh và ít lỗi hơn.
