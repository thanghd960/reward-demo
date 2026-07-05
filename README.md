**Phân tích yêu cầu & Thiết kế Giao diện Web eVoucher (Demo)**

Dưới đây là phân tích chi tiết và kế hoạch triển khai **demo giao diện web eVoucher** sử dụng chỉ **HTML5, CSS3 và JavaScript** (không dùng framework).

---

### 1. Các tính năng chính (User Stories)

**Khách hàng (Customer):**

1. **Xem voucher của các merchant**
   - Danh sách voucher (dạng grid)
   - Tìm kiếm voucher
   - Xem chi tiết voucher

2. **Claim voucher & Book lịch**
   - Claim voucher (lưu vào ví cá nhân)
   - Đặt lịch áp dụng voucher (chọn ngày, chọn merchant)
   - Xác nhận booking

3. **Lịch sử booking**
   - Xem danh sách booking đã đặt
   - Trạng thái booking (Đã đặt, Đã sử dụng, Hủy…)
   - Thông tin chi tiết booking

---

### 2. Cấu trúc Trang Web (Demo)

#### **Các Trang Chính**

- **Trang chủ (Home)**
  - Hero banner
  - Merchant nổi bật
  - Voucher hot / Trending

- **Trang Danh sách Voucher**
  - Tìm kiếm
  - Danh sách voucher dạng grid
  - Click để xem chi tiết (modal)

- **Chi tiết Voucher (Modal)**
  - Thông tin voucher
  - Nút **Claim Voucher** và **Đặt lịch ngay**

- **Ví Voucher Của Tôi**
  - Danh sách voucher đã claim
  - Nút đặt lịch từ voucher

- **Lịch sử Booking**
  - Danh sách các lịch đã đặt
  - Trạng thái booking

- **Đăng nhập** (demo đơn giản)

---

### 3. Công nghệ sử dụng cho Demo

- **HTML5**: Cấu trúc trang và semantic tags
- **Tailwind CSS** (qua CDN): Giúp giao diện đẹp, responsive nhanh
- **Vanilla JavaScript**: Xử lý logic (render dữ liệu, modal, claim, booking, chuyển trang…)
- **Font Awesome**: Icon
- **Local Data**: Sử dụng mảng JavaScript (không cần backend)

**Đặc điểm Demo:**
- Single Page Application (SPA) kiểu đơn giản
- Chuyển trang bằng JavaScript (không reload)
- Dữ liệu giả (fake data)
- Responsive trên mobile và desktop
- Modal popup cho chi tiết voucher

---

### 4. Flow Chi Tiết User

```mermaid
graph TD
    A[Trang chủ] --> B[Danh sách Voucher]
    B --> C[Chi tiết Voucher (Modal)]
    C --> D{Đã login?}
    D -->|Chưa| E[Đăng nhập Demo]
    D -->|Rồi| F[Claim Voucher]
    F --> G[Đặt lịch]
    G --> H[Xác nhận Booking]
    H --> I[Lịch sử Booking]