/* App controller: routing, event delegation, modal + toast management. */

const App = {
  route: 'home',
  filters: { search: '', category: 'Tất cả', merchantId: '' },
  pendingAction: null, // { type: 'claim'|'book', voucherId } — replayed after demo login

  init() {
    this.renderNav();
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('submit', (e) => this.handleSubmit(e));
    document.addEventListener('input', (e) => this.handleInput(e));
  },

  handleHashChange() {
    const route = (location.hash || '#home').replace('#', '');
    this.route = ['home', 'vouchers', 'wallet', 'history'].includes(route) ? route : 'home';
    this.renderPage();
    this.renderNav();
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  navigate(route) {
    location.hash = route;
  },

  renderPage() {
    const app = document.getElementById('app');
    const map = {
      home: () => renderHome(),
      vouchers: () => renderVouchers(this.filters),
      wallet: () => renderWallet(),
      history: () => renderHistory(),
    };
    app.innerHTML = map[this.route]();
  },

  renderNav() {
    document.querySelectorAll('[data-nav-link]').forEach((el) => {
      const active = el.getAttribute('data-nav-link') === this.route;
      el.classList.toggle('text-indigo-600', active);
      el.classList.toggle('font-semibold', active);
      el.classList.toggle('text-slate-500', !active);
    });
    const userBox = document.getElementById('user-box');
    if (State.isLoggedIn()) {
      userBox.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
            ${State.user.name.trim().charAt(0).toUpperCase()}
          </div>
          <span class="hidden sm:inline text-sm font-medium text-slate-700">${State.user.name}</span>
          <button data-action="logout" class="text-xs text-slate-400 hover:text-red-500 ml-1"><i class="fa-solid fa-right-from-bracket"></i></button>
        </div>`;
    } else {
      userBox.innerHTML = `
        <button data-action="open-login" class="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700">
          Đăng nhập
        </button>`;
    }
  },

  // ---- Modal helpers ----
  openModal(id, html) {
    const modal = document.getElementById(id);
    modal.querySelector('[data-modal-body]').innerHTML = html;
    modal.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('modal-open')));
    document.body.classList.add('overflow-hidden');
  },
  closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('modal-open');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => modal.classList.add('hidden'), 200);
  },
  closeAllModals() {
    document.querySelectorAll('.modal-root').forEach((m) => m.classList.remove('modal-open'));
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => document.querySelectorAll('.modal-root').forEach((m) => m.classList.add('hidden')), 200);
  },

  toast(message, type = 'success') {
    const wrap = document.getElementById('toast-container');
    const colors = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-slate-800' };
    const el = document.createElement('div');
    el.className = `toast-item ${colors[type]} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2`;
    el.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i>${message}`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'all .2s ease';
      setTimeout(() => el.remove(), 220);
    }, 2400);
  },

  // ---- Voucher / booking flows ----
  requireLogin(action) {
    if (State.isLoggedIn()) return true;
    this.pendingAction = action;
    this.openModal('modal-login', loginModalContent());
    return false;
  },

  openVoucherDetail(id) {
    const v = getVoucher(id);
    this.openModal('modal-voucher-detail', voucherDetailModalContent(v));
  },

  doClaim(id) {
    if (!this.requireLogin({ type: 'claim', voucherId: id })) return;
    State.claimVoucher(id);
    this.toast('Đã lưu voucher vào ví của bạn.');
    this.closeModal('modal-voucher-detail');
    if (this.route === 'vouchers' || this.route === 'home') this.renderPage();
  },

  openBooking(id) {
    if (!this.requireLogin({ type: 'book', voucherId: id })) return;
    const v = getVoucher(id);
    this.closeModal('modal-voucher-detail');
    this.openModal('modal-booking', bookingModalContent(v));
  },

  submitBooking(form) {
    const data = new FormData(form);
    const booking = State.addBooking({
      voucherId: data.get('voucherId'),
      date: data.get('date'),
      time: data.get('time'),
      note: data.get('note'),
    });
    this.openModal('modal-booking', bookingSuccessContent(booking));
    this.toast('Xác nhận booking thành công!');
    if (this.route === 'wallet' || this.route === 'history') this.renderPage();
  },

  submitLogin(form) {
    const data = new FormData(form);
    const name = data.get('name').trim();
    if (!name) return;
    State.login(name, data.get('phone').trim());
    this.closeModal('modal-login');
    this.renderNav();
    this.toast(`Xin chào, ${name}!`);
    if (this.pendingAction) {
      const { type, voucherId } = this.pendingAction;
      this.pendingAction = null;
      if (type === 'claim') this.doClaim(voucherId);
      if (type === 'book') this.openBooking(voucherId);
    } else {
      this.renderPage();
    }
  },

  // ---- Event delegation ----
  handleClick(e) {
    const trigger = e.target.closest('[data-action]');
    const backdrop = e.target.closest('[data-close-on-backdrop]');
    if (!trigger) {
      if (backdrop && e.target === backdrop) this.closeAllModals();
      return;
    }
    const action = trigger.getAttribute('data-action');
    const id = trigger.getAttribute('data-id');

    switch (action) {
      case 'nav':
        this.navigate(trigger.getAttribute('data-route'));
        break;
      case 'open-voucher':
        this.openVoucherDetail(id);
        break;
      case 'claim':
        this.doClaim(id);
        break;
      case 'book':
      case 'wallet-book':
        this.openBooking(id);
        break;
      case 'open-login':
        this.openModal('modal-login', loginModalContent());
        break;
      case 'logout':
        State.logout();
        this.renderNav();
        this.toast('Đã đăng xuất.', 'info');
        if (this.route === 'wallet' || this.route === 'history') this.renderPage();
        break;
      case 'close-modal':
        this.closeModal(trigger.getAttribute('data-modal'));
        break;
      case 'goto-history':
        this.closeAllModals();
        this.navigate('history');
        break;
      case 'cancel-booking':
        if (confirm('Bạn có chắc muốn hủy booking này?')) {
          State.cancelBooking(id);
          this.renderPage();
          this.toast('Đã hủy booking.', 'info');
        }
        break;
      case 'mark-used':
        State.markUsed(id);
        this.renderPage();
        this.toast('Đã đánh dấu voucher đã sử dụng.');
        break;
      case 'filter-category':
        this.filters.category = trigger.getAttribute('data-category');
        this.renderPage();
        break;
      case 'filter-merchant':
        this.filters.merchantId = id;
        this.filters.category = 'Tất cả';
        this.navigate('vouchers');
        this.renderPage();
        break;
      case 'clear-merchant-filter':
        this.filters.merchantId = '';
        this.renderPage();
        break;
      case 'toggle-mobile-menu':
        document.getElementById('mobile-menu').classList.toggle('hidden');
        break;
    }
  },

  handleSubmit(e) {
    if (e.target.id === 'booking-form') {
      e.preventDefault();
      this.submitBooking(e.target);
    }
    if (e.target.id === 'login-form') {
      e.preventDefault();
      this.submitLogin(e.target);
    }
  },

  handleInput(e) {
    if (e.target.id === 'voucher-search') {
      this.filters.search = e.target.value;
      const grid = document.getElementById('app');
      const focusValue = e.target.value;
      grid.innerHTML = renderVouchers(this.filters);
      const input = document.getElementById('voucher-search');
      input.focus();
      input.value = focusValue;
      input.setSelectionRange(focusValue.length, focusValue.length);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
