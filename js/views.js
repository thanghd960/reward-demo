/* Pure(ish) render functions: build HTML strings from data + state. No DOM writes here. */

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN');
}

function statusBadge(status) {
  const map = {
    'Đã đặt': 'bg-blue-100 text-blue-700',
    'Đã sử dụng': 'bg-emerald-100 text-emerald-700',
    'Hủy': 'bg-red-100 text-red-700',
  };
  return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}">${status}</span>`;
}

function walletStatusLabel(status) {
  return { available: 'Chưa đặt lịch', booked: 'Đã đặt lịch', used: 'Đã sử dụng' }[status] || status;
}

function merchantChipHtml(m) {
  return `
    <button data-action="filter-merchant" data-id="${m.id}"
      class="flex-shrink-0 flex flex-col items-center gap-2 w-24 group">
      <div class="w-16 h-16 rounded-2xl bg-${m.color}-100 text-${m.color}-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
        <i class="fa-solid ${m.icon}"></i>
      </div>
      <span class="text-xs font-medium text-slate-600 text-center line-clamp-2">${m.name}</span>
    </button>`;
}

function voucherCardHtml(v) {
  const m = getMerchant(v.merchantId);
  const claimed = State.isClaimed(v.id);
  return `
    <div data-action="open-voucher" data-id="${v.id}"
      class="cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div class="voucher-banner relative h-24 bg-${m.color}-500 flex items-center justify-between px-4">
        ${v.hot ? '<span class="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span>' : ''}
        <i class="fa-solid ${m.icon} text-white/90 text-2xl"></i>
        <span class="text-white font-extrabold text-xl drop-shadow">${v.discount}</span>
      </div>
      <div class="p-4">
        <p class="text-xs font-medium text-${m.color}-600 mb-1">${m.name}</p>
        <h3 class="font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[2.5rem]">${v.title}</h3>
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span><i class="fa-regular fa-clock mr-1"></i>HSD ${formatDate(v.expiry)}</span>
          ${claimed ? '<span class="text-emerald-600 font-medium"><i class="fa-solid fa-check-circle mr-1"></i>Đã lưu</span>' : ''}
        </div>
      </div>
    </div>`;
}

function renderHome() {
  const hot = VOUCHERS.filter((v) => v.hot);
  return `
    <section class="page-enter">
      <div class="hero-gradient rounded-3xl mx-4 mt-4 p-8 md:p-12 text-white relative overflow-hidden">
        <div class="relative z-10 max-w-lg">
          <h1 class="text-2xl md:text-4xl font-extrabold mb-3">Ưu đãi độc quyền mỗi ngày</h1>
          <p class="text-white/85 mb-6">Claim voucher yêu thích, đặt lịch sử dụng chỉ trong vài chạm.</p>
          <button data-action="nav" data-route="vouchers" class="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
            Khám phá voucher <i class="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
        <i class="fa-solid fa-ticket absolute -right-6 -bottom-8 text-[160px] text-white/10"></i>
      </div>

      <div class="mt-8 px-4">
        <h2 class="text-lg font-bold text-slate-800 mb-3">Merchant nổi bật</h2>
        <div class="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          ${MERCHANTS.map(merchantChipHtml).join('')}
        </div>
      </div>

      <div class="mt-8 px-4 pb-10">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold text-slate-800"><i class="fa-solid fa-fire text-orange-500 mr-1"></i>Voucher hot / Trending</h2>
          <button data-action="nav" data-route="vouchers" class="text-sm font-medium text-indigo-600 hover:underline">Xem tất cả</button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${hot.map(voucherCardHtml).join('')}
        </div>
      </div>
    </section>`;
}

function renderVouchers(filters) {
  const { search = '', category = 'Tất cả', merchantId = '' } = filters;
  const categories = ['Tất cả', ...new Set(MERCHANTS.map((m) => m.category))];
  let list = VOUCHERS.slice();
  if (merchantId) list = list.filter((v) => v.merchantId === merchantId);
  if (category !== 'Tất cả') list = list.filter((v) => v.category === category);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((v) => {
      const m = getMerchant(v.merchantId);
      return v.title.toLowerCase().includes(q) || m.name.toLowerCase().includes(q);
    });
  }

  return `
    <section class="page-enter px-4 py-6 max-w-6xl mx-auto">
      <h1 class="text-xl font-bold text-slate-800 mb-4">Danh sách Voucher</h1>
      <div class="flex flex-col md:flex-row gap-3 mb-4">
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input id="voucher-search" type="text" value="${search}" placeholder="Tìm voucher hoặc merchant..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        ${merchantId ? `<button data-action="clear-merchant-filter" class="text-sm px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"><i class="fa-solid fa-xmark mr-1"></i>${getMerchant(merchantId)?.name || ''}</button>` : ''}
      </div>
      <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-5">
        ${categories.map((c) => `
          <button data-action="filter-category" data-category="${c}"
            class="flex-shrink-0 text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${c === category ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}">
            ${c}
          </button>`).join('')}
      </div>
      ${list.length ? `
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${list.map(voucherCardHtml).join('')}
        </div>` : `
        <div class="text-center py-16 text-slate-400">
          <i class="fa-regular fa-face-frown text-4xl mb-3"></i>
          <p>Không tìm thấy voucher phù hợp.</p>
        </div>`}
    </section>`;
}

function walletCardHtml(item) {
  const v = getVoucher(item.voucherId);
  const m = getMerchant(v.merchantId);
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-4 items-center">
      <div class="w-14 h-14 flex-shrink-0 rounded-xl bg-${m.color}-100 text-${m.color}-600 flex items-center justify-center text-xl">
        <i class="fa-solid ${m.icon}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-${m.color}-600 font-medium">${m.name}</p>
        <h3 class="font-semibold text-slate-800 line-clamp-2">${v.title}</h3>
        <p class="text-xs text-slate-400 mt-1">${walletStatusLabel(item.status)} · HSD ${formatDate(v.expiry)}</p>
      </div>
      <div class="flex flex-col gap-2 items-end flex-shrink-0">
        ${item.status === 'available'
          ? `<button data-action="wallet-book" data-id="${v.id}" class="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Đặt lịch</button>`
          : `<span class="text-xs font-medium text-slate-400"><i class="fa-solid fa-circle-check mr-1"></i>${walletStatusLabel(item.status)}</span>`}
        <button data-action="open-voucher" data-id="${v.id}" class="text-xs text-slate-400 hover:text-indigo-600">Chi tiết</button>
      </div>
    </div>`;
}

function renderWallet() {
  if (!State.isLoggedIn()) return renderLoginRequired('Ví Voucher Của Tôi');
  const items = State.wallet;
  return `
    <section class="page-enter px-4 py-6 max-w-3xl mx-auto">
      <h1 class="text-xl font-bold text-slate-800 mb-4">Ví Voucher Của Tôi</h1>
      ${items.length ? `<div class="flex flex-col gap-3">${items.map(walletCardHtml).join('')}</div>` : `
        <div class="text-center py-16 text-slate-400">
          <i class="fa-solid fa-wallet text-4xl mb-3"></i>
          <p>Bạn chưa lưu voucher nào.</p>
          <button data-action="nav" data-route="vouchers" class="mt-3 text-indigo-600 font-medium hover:underline">Khám phá voucher ngay</button>
        </div>`}
    </section>`;
}

function bookingRowHtml(b) {
  const v = getVoucher(b.voucherId);
  const m = getMerchant(v.merchantId);
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div class="flex justify-between items-start gap-3">
        <div class="flex gap-3 min-w-0">
          <div class="w-12 h-12 flex-shrink-0 rounded-xl bg-${m.color}-100 text-${m.color}-600 flex items-center justify-center">
            <i class="fa-solid ${m.icon}"></i>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-${m.color}-600 font-medium">${m.name}</p>
            <h3 class="font-semibold text-slate-800 line-clamp-2">${v.title}</h3>
            <p class="text-xs text-slate-400 mt-1"><i class="fa-regular fa-calendar mr-1"></i>${formatDate(b.date)} ${b.time ? '· ' + b.time : ''}</p>
          </div>
        </div>
        ${statusBadge(b.status)}
      </div>
      ${b.status === 'Đã đặt' ? `
        <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
          <button data-action="mark-used" data-id="${b.id}" class="text-xs font-medium text-emerald-600 hover:underline">Đánh dấu đã sử dụng</button>
          <span class="text-slate-300">·</span>
          <button data-action="cancel-booking" data-id="${b.id}" class="text-xs font-medium text-red-500 hover:underline">Hủy booking</button>
        </div>` : ''}
    </div>`;
}

function renderHistory() {
  if (!State.isLoggedIn()) return renderLoginRequired('Lịch sử Booking');
  const bookings = State.bookings;
  return `
    <section class="page-enter px-4 py-6 max-w-3xl mx-auto">
      <h1 class="text-xl font-bold text-slate-800 mb-4">Lịch sử Booking</h1>
      ${bookings.length ? `<div class="flex flex-col gap-3">${bookings.map(bookingRowHtml).join('')}</div>` : `
        <div class="text-center py-16 text-slate-400">
          <i class="fa-regular fa-calendar-xmark text-4xl mb-3"></i>
          <p>Bạn chưa có booking nào.</p>
          <button data-action="nav" data-route="vouchers" class="mt-3 text-indigo-600 font-medium hover:underline">Khám phá voucher ngay</button>
        </div>`}
    </section>`;
}

function renderLoginRequired(title) {
  return `
    <section class="page-enter px-4 py-20 max-w-md mx-auto text-center">
      <i class="fa-solid fa-lock text-4xl text-slate-300 mb-4"></i>
      <h1 class="text-lg font-bold text-slate-800 mb-2">${title}</h1>
      <p class="text-slate-400 mb-5">Vui lòng đăng nhập để xem nội dung này.</p>
      <button data-action="open-login" class="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700">Đăng nhập ngay</button>
    </section>`;
}

function voucherDetailModalContent(v) {
  const m = getMerchant(v.merchantId);
  const claimed = State.isClaimed(v.id);
  return `
    <div class="voucher-banner relative h-32 bg-${m.color}-500 rounded-t-2xl flex items-center justify-between px-6">
      ${v.hot ? '<span class="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span>' : ''}
      <i class="fa-solid ${m.icon} text-white/90 text-3xl"></i>
      <span class="text-white font-extrabold text-3xl drop-shadow">${v.discount}</span>
    </div>
    <div class="p-6">
      <p class="text-sm font-medium text-${m.color}-600 mb-1">${m.name} · ${v.category}</p>
      <h2 class="text-lg font-bold text-slate-800 mb-3">${v.title}</h2>
      <p class="text-sm text-slate-500 mb-4">${v.description}</p>
      <div class="bg-slate-50 rounded-xl p-4 mb-4">
        <p class="text-xs font-semibold text-slate-600 mb-2">Điều kiện áp dụng</p>
        <ul class="text-xs text-slate-500 space-y-1 list-disc list-inside">
          ${v.terms.map((t) => `<li>${t}</li>`).join('')}
        </ul>
      </div>
      <p class="text-xs text-slate-400 mb-5"><i class="fa-regular fa-clock mr-1"></i>Hạn sử dụng: ${formatDate(v.expiry)}</p>
      <div class="flex gap-3">
        <button data-action="claim" data-id="${v.id}" ${claimed ? 'disabled' : ''}
          class="flex-1 font-semibold px-4 py-2.5 rounded-xl border transition-colors ${claimed ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'}">
          ${claimed ? '<i class="fa-solid fa-check mr-1"></i>Đã lưu' : 'Claim Voucher'}
        </button>
        <button data-action="book" data-id="${v.id}"
          class="flex-1 font-semibold px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          Đặt lịch ngay
        </button>
      </div>
    </div>`;
}

function bookingModalContent(v) {
  const m = getMerchant(v.merchantId);
  const today = new Date().toISOString().slice(0, 10);
  return `
    <div class="p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-1">Đặt lịch sử dụng voucher</h2>
      <p class="text-sm text-slate-500 mb-4">${v.title} · <span class="font-medium text-${m.color}-600">${m.name}</span></p>
      <form id="booking-form" class="flex flex-col gap-4">
        <input type="hidden" name="voucherId" value="${v.id}" />
        <div>
          <label class="text-xs font-medium text-slate-600 mb-1 block">Chọn merchant</label>
          <div class="text-sm px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
            <i class="fa-solid ${m.icon} mr-2 text-${m.color}-600"></i>${m.name}
          </div>
        </div>
        <div>
          <label class="text-xs font-medium text-slate-600 mb-1 block">Chọn ngày áp dụng</label>
          <input required type="date" name="date" min="${today}" value="${today}"
            class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-slate-600 mb-1 block">Khung giờ</label>
          <select name="time" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            <option>09:00 - 11:00</option>
            <option>11:00 - 13:00</option>
            <option>14:00 - 16:00</option>
            <option>16:00 - 18:00</option>
            <option>18:00 - 20:00</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-slate-600 mb-1 block">Ghi chú (không bắt buộc)</label>
          <textarea name="note" rows="2" placeholder="Yêu cầu thêm..."
            class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"></textarea>
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700">
          Xác nhận Booking
        </button>
      </form>
    </div>`;
}

function bookingSuccessContent(booking) {
  const v = getVoucher(booking.voucherId);
  const m = getMerchant(v.merchantId);
  return `
    <div class="p-8 text-center">
      <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4">
        <i class="fa-solid fa-check"></i>
      </div>
      <h2 class="text-lg font-bold text-slate-800 mb-1">Đặt lịch thành công!</h2>
      <p class="text-sm text-slate-500 mb-5">${v.title} tại ${m.name}<br/>${formatDate(booking.date)} · ${booking.time}</p>
      <div class="flex gap-3">
        <button data-action="close-modal" data-modal="modal-booking" class="flex-1 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Đóng</button>
        <button data-action="goto-history" class="flex-1 font-semibold px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Xem lịch sử</button>
      </div>
    </div>`;
}

function loginModalContent() {
  return `
    <div class="p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-1">Đăng nhập</h2>
      <p class="text-sm text-slate-500 mb-4">Đăng nhập demo để claim voucher và đặt lịch.</p>
      <form id="login-form" class="flex flex-col gap-4">
        <div>
          <label class="text-xs font-medium text-slate-600 mb-1 block">Họ tên</label>
          <input required name="name" type="text" placeholder="Nguyễn Văn A"
            class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-slate-600 mb-1 block">Số điện thoại</label>
          <input name="phone" type="tel" placeholder="09xxxxxxxx"
            class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700">
          Đăng nhập
        </button>
        <p class="text-[11px] text-center text-slate-400">Đây là đăng nhập demo, không yêu cầu mật khẩu.</p>
      </form>
    </div>`;
}
