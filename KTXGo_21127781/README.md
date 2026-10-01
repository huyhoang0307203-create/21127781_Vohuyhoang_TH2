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

## 2. Cây thư mục dự án (Chuẩn đề thi)
```
KTXGo_21127781/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
├── index.js
├── docs/
│   ├── screenshot-th2-home.png
│   └── screenshot-th2-cart.png
└── src/
    ├── constants/
    │   ├── student.ts
    │   └── theme.ts
    ├── hooks/
    │   ├── useDebouncedValue.ts
    │   └── useCampusLocation.ts
    ├── services/
    │   ├── apiClient.ts
    │   └── productApi.ts
    ├── stores/
    │   ├── authStore.ts
    │   └── cartStore.ts
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthStack.tsx
    │   ├── MainTabs.tsx
    │   └── ShopStack.tsx
    ├── components/
    │   ├── ProductCard.tsx
    │   └── Watermark.tsx
    └── screens/
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        ├── DetailScreen.tsx
        ├── CartScreen.tsx
        └── MeScreen.tsx
```

---

## 3. Kiến trúc & Công nghệ sử dụng
1. **React Navigation v7:**
   - `RootNavigator`: Điều hướng có điều kiện theo trạng thái đăng nhập `authStore.token`.
   - `AuthStack`: Màn hình Đăng nhập (Login).
   - `MainTabs`: 3 Tab chính (Cửa hàng, Giỏ hàng, Tôi) theo thứ tự `shopFirst`.
   - `ShopStack`: Home → Detail (Presentation `card`).
2. **FlashList (@shopify/flash-list):**
   - Danh sách lưới 2 cột (`numColumns={2}`), `estimatedItemSize={220}`.
   - Key extractor ghép MSSV: `${STUDENT.mssv}-${item.id}`.
   - Tìm kiếm debounce `400ms` với `useDebouncedValue`.
   - 3 trạng thái mạng: Đang tải (Loading), Thành công (Data grid), Lỗi mạng (Error + Thử lại có chứa MSSV).
   - Kéo để làm mới (Pull-to-refresh) gắn liền `refetch`.
3. **Zustand + Persist (AsyncStorage):**
   - `cartStore`: Lưu trữ giỏ hàng, tăng/giảm số lượng, xoá món, tính tổng tiền.
   - Key persist: `ktxgo-cart-21127781`.
   - `authStore`: Quản lý token giả lập `ktxgo-21127781-780976`.
4. **TanStack React Query + Axios:**
   - `apiClient` cấu hình tự động chèn header `X-Student-Id: 21127781`.
   - Quản lý cache và `staleTime: 11000ms`.
5. **Location & Haptics (Permissions & Haversine):**
   - Tọa độ cổng KTX IUH: `10.8222, 106.6875`.
   - Xử lý 3 nhánh quyền: `granted`, `denied`, `blocked` (mở `Linking.openSettings()`).
   - Công thức Haversine tính khoảng cách km và tính phí ship theo Công thức B.
   - Haptic Feedback `selection` khi thao tác thêm giỏ hàng.

---

## 4. Hướng dẫn cài đặt & Chạy ứng dụng

### Bước 1: Cài đặt dependencies
```bash
cd KTXGo_21127781
npm install
```

### Bước 2: Chạy ứng dụng trên máy ảo Android / iOS
```bash
# Khởi động Metro Bundler
npm start

# Chạy trên Android Emulator
npm run android

# Chạy trên iOS Simulator
npm run ios
```

---

## 5. Danh sách Commit (Ít nhất 4 commit chuẩn đề thi)
1. `feat(21127781_TH2): khoi tao project KTXGo_21127781 voi cau truc thu muc va dinh danh student.ts`
2. `feat(21127781_TH2): xay dung Navigation AuthStack, MainTabs shopFirst va man hinh Login theo variant phone`
3. `feat(21127781_TH2): hoan thien HomeScreen FlashList 2 cot, Debounce 400ms va React Query 3 trang thai mang`
4. `feat(21127781_TH2): tich hop Zustand Cart Persist, Detail card, MeScreen Location cong thuc B va Haptics`
