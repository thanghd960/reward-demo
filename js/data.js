/* Fake local data for the eVoucher demo. No backend involved. */

const MERCHANTS = [
  { id: 'm1', name: 'Highlands Coffee', category: 'Ẩm thực', icon: 'fa-mug-hot', color: 'amber' },
  { id: 'm2', name: 'Lotte Mart', category: 'Mua sắm', icon: 'fa-cart-shopping', color: 'rose' },
  { id: 'm3', name: 'Vietravel', category: 'Du lịch', icon: 'fa-plane', color: 'sky' },
  { id: 'm4', name: "L'Amour Spa", category: 'Làm đẹp', icon: 'fa-spa', color: 'pink' },
  { id: 'm5', name: 'CGV Cinemas', category: 'Giải trí', icon: 'fa-film', color: 'purple' },
  { id: 'm6', name: 'FPT Shop', category: 'Điện tử', icon: 'fa-mobile-screen', color: 'indigo' },
];

const VOUCHERS = [
  { id: 'v1', merchantId: 'm1', title: 'Giảm 30% toàn menu đồ uống', discount: '-30%', category: 'Ẩm thực', expiry: '2026-08-31', hot: true,
    description: 'Áp dụng cho tất cả đồ uống tại Highlands Coffee, không áp dụng đồng thời với chương trình khuyến mãi khác.',
    terms: ['Áp dụng tại tất cả chi nhánh toàn quốc', 'Không quy đổi thành tiền mặt', 'Mỗi khách hàng sử dụng 1 lần/ngày'] },
  { id: 'v2', merchantId: 'm1', title: 'Mua 1 tặng 1 bánh ngọt', discount: '1+1', category: 'Ẩm thực', expiry: '2026-07-31', hot: false,
    description: 'Tặng ngay 1 phần bánh ngọt khi mua bất kỳ phần bánh nào cùng loại.',
    terms: ['Áp dụng cho hoá đơn tại quầy', 'Không áp dụng giao hàng'] },
  { id: 'v3', merchantId: 'm2', title: 'Giảm 200.000đ cho đơn từ 1.000.000đ', discount: '-200K', category: 'Mua sắm', expiry: '2026-09-15', hot: true,
    description: 'Áp dụng cho hoá đơn mua sắm từ 1.000.000đ tại Lotte Mart.',
    terms: ['Áp dụng toàn bộ ngành hàng trừ sữa bột và thuốc lá', 'Mỗi hoá đơn áp dụng 1 voucher'] },
  { id: 'v4', merchantId: 'm2', title: 'Giảm 15% ngành hàng thời trang', discount: '-15%', category: 'Mua sắm', expiry: '2026-08-20', hot: false,
    description: 'Ưu đãi dành riêng cho ngành hàng thời trang nam & nữ.',
    terms: ['Không áp dụng hàng đã giảm giá', 'Áp dụng đến hết ngày voucher hết hạn'] },
  { id: 'v5', merchantId: 'm3', title: 'Giảm 500.000đ tour trong nước', discount: '-500K', category: 'Du lịch', expiry: '2026-10-31', hot: true,
    description: 'Áp dụng cho các tour du lịch trong nước từ 3 ngày 2 đêm trở lên.',
    terms: ['Đặt tour trước ít nhất 7 ngày', 'Áp dụng theo số lượng chỗ có hạn'] },
  { id: 'v6', merchantId: 'm3', title: 'Giảm 10% vé máy bay nội địa', discount: '-10%', category: 'Du lịch', expiry: '2026-12-31', hot: false,
    description: 'Ưu đãi vé máy bay nội địa khi đặt qua hệ thống Vietravel.',
    terms: ['Áp dụng hạng vé phổ thông', 'Không áp dụng dịp lễ Tết'] },
  { id: 'v7', merchantId: 'm4', title: 'Giảm 40% liệu trình chăm sóc da', discount: '-40%', category: 'Làm đẹp', expiry: '2026-08-10', hot: true,
    description: 'Áp dụng cho các liệu trình chăm sóc da mặt chuyên sâu tại spa.',
    terms: ['Đặt lịch trước 24 giờ', 'Không áp dụng cho khách hàng mới miễn phí trải nghiệm'] },
  { id: 'v8', merchantId: 'm4', title: 'Tặng 1 buổi massage thư giãn', discount: 'Free', category: 'Làm đẹp', expiry: '2026-07-25', hot: false,
    description: 'Tặng kèm 1 buổi massage thư giãn 30 phút khi sử dụng bất kỳ dịch vụ nào.',
    terms: ['Áp dụng 1 lần cho mỗi khách hàng', 'Cần đặt lịch trước'] },
  { id: 'v9', merchantId: 'm5', title: 'Giảm 50% vé xem phim 2D', discount: '-50%', category: 'Giải trí', expiry: '2026-07-20', hot: true,
    description: 'Áp dụng cho suất chiếu phim 2D từ thứ 2 đến thứ 5 hàng tuần.',
    terms: ['Không áp dụng suất chiếu đặc biệt, phim 3D/4D/IMAX', 'Số lượng vé có hạn mỗi suất'] },
  { id: 'v10', merchantId: 'm5', title: 'Combo bắp nước giảm 25%', discount: '-25%', category: 'Giải trí', expiry: '2026-09-05', hot: false,
    description: 'Áp dụng cho combo bắp nước size L tại quầy.',
    terms: ['Áp dụng kèm hoá đơn mua vé', 'Không áp dụng riêng lẻ'] },
  { id: 'v11', merchantId: 'm6', title: 'Giảm 1.000.000đ điện thoại', discount: '-1TR', category: 'Điện tử', expiry: '2026-08-31', hot: true,
    description: 'Áp dụng cho các dòng điện thoại flagship khi mua tại FPT Shop.',
    terms: ['Áp dụng theo chương trình cụ thể từng sản phẩm', 'Liên hệ nhân viên cửa hàng để biết chi tiết'] },
  { id: 'v12', merchantId: 'm6', title: 'Trả góp 0% lãi suất', discount: '0%', category: 'Điện tử', expiry: '2026-12-31', hot: false,
    description: 'Ưu đãi trả góp 0% lãi suất qua thẻ tín dụng liên kết.',
    terms: ['Áp dụng cho đơn hàng từ 3.000.000đ', 'Phụ thuộc chính sách ngân hàng phát hành thẻ'] },
  { id: 'v13', merchantId: 'm1', title: 'Freeship đơn từ 50.000đ', discount: 'Freeship', category: 'Ẩm thực', expiry: '2026-07-31', hot: false,
    description: 'Miễn phí giao hàng cho đơn đặt qua ứng dụng từ 50.000đ.',
    terms: ['Áp dụng khu vực nội thành', 'Không áp dụng giờ cao điểm'] },
  { id: 'v14', merchantId: 'm2', title: 'Hoàn 10% vào ví điện tử', discount: '+10%', category: 'Mua sắm', expiry: '2026-09-30', hot: false,
    description: 'Hoàn tiền vào ví điện tử liên kết khi thanh toán không dùng tiền mặt.',
    terms: ['Hoàn tiền tối đa 100.000đ/giao dịch', 'Áp dụng thanh toán qua ví điện tử liên kết'] },
];

function getMerchant(id) {
  return MERCHANTS.find((m) => m.id === id);
}

function getVoucher(id) {
  return VOUCHERS.find((v) => v.id === id);
}
