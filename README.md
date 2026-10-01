# BÀI THI THỰC HÀNH 2 - LẬP TRÌNH THIẾT BỊ DI ĐỘNG (TH)
**Họ và tên:** VO HUY HOANG | **MSSV:** 21127781 | **URL Clone HTTPS:** `https://github.com/huyhoang0307203-create/21127781_Vohuyhoang_TH2.git` | **Stamp:** `#780976` | **Số cuối:** 1 | **VARIANT:** [Watermark: Dưới | Login: phone | Tab: Shop→Giỏ→Tôi | Haptic: selection | Phí: Công thức B | Detail: card]

---

## 1. Thông tin sinh viên & Đề thi cá nhân hoá
- **Họ và tên:** VÕ HUY HOÀNG (VO HUY HOANG)
- **Mã số sinh viên (MSSV):** 21127781
- **Số cuối MSSV:** `1`
- **Student Seed:** `781`
- **Mã đề (Exam Stamp):** `#780976`
- **Phòng giao hàng mặc định:** `P.481` (`ROOM_LABEL`)
- **Debounce:** `400ms` (`DEBOUNCE_MS`)
- **Stale Time React Query:** `11000ms` (`STALE_TIME_MS`)
- **Hệ số giá:** `25500` (`PRICE_MULTIPLIER`)
- **Phí giao hàng gốc:** `9000 đ` (`BASE_SHIP_FEE`)

### Bảng biến thể (Variant) theo số cuối `1`:
| Thuộc tính | Cấu hình cho MSSV 21127781 | Chi tiết thực hiện |
| :--- | :--- | :--- |
| **Watermark** | Dưới | Nằm ở phía dưới màn hình trên mọi màn hình chính |
| **Ô Login** | `phone` | Nhập số điện thoại sinh viên (bàn phím phone-pad) |
| **Thứ tự Tab** | `shopFirst` | Thứ tự: Cửa hàng (Shop) → Giỏ hàng (Cart) → Tôi (Me) |
| **Haptic khi thêm** | `selection` | `Haptics.selectionAsync()` khi nhấn `+` hoặc Thêm giỏ |
| **Công thức ship** | `Công thức B` | `BASE_SHIP_FEE + Math.round(km * 1500) + 2000` |
| **Detail Screen** | `card` | Push dạng Card tiêu chuẩn trong Navigation Stack |

---

## 2. Thư mục dự án: `KTXGo_21127781`
Mã nguồn toàn bộ dự án nằm tại thư mục `KTXGo_21127781/`.
Xem tài liệu chi tiết tại [`KTXGo_21127781/README.md`](./KTXGo_21127781/README.md).
