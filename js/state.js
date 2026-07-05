/* App state: demo login, wallet (claimed vouchers) and booking history. Persisted to localStorage. */

const STORAGE_KEYS = {
  user: 'evoucher_user',
  wallet: 'evoucher_wallet',
  bookings: 'evoucher_bookings',
};

const Store = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const State = {
  user: Store.read(STORAGE_KEYS.user, null),
  wallet: Store.read(STORAGE_KEYS.wallet, []),
  bookings: Store.read(STORAGE_KEYS.bookings, []),

  isLoggedIn() {
    return !!this.user;
  },

  login(name, phone) {
    this.user = { name, phone: phone || '', loggedAt: new Date().toISOString() };
    Store.write(STORAGE_KEYS.user, this.user);
  },

  logout() {
    this.user = null;
    localStorage.removeItem(STORAGE_KEYS.user);
  },

  getWalletItem(voucherId) {
    return this.wallet.find((w) => w.voucherId === voucherId);
  },

  isClaimed(voucherId) {
    return !!this.getWalletItem(voucherId);
  },

  claimVoucher(voucherId) {
    let item = this.getWalletItem(voucherId);
    if (item) return item;
    item = {
      id: genId('w'),
      voucherId,
      claimedAt: new Date().toISOString(),
      status: 'available', // available | booked | used
    };
    this.wallet.unshift(item);
    Store.write(STORAGE_KEYS.wallet, this.wallet);
    return item;
  },

  addBooking({ voucherId, date, time, note }) {
    const walletItem = this.claimVoucher(voucherId);
    const booking = {
      id: genId('b'),
      walletItemId: walletItem.id,
      voucherId,
      date,
      time,
      note: note || '',
      status: 'Đã đặt', // Đã đặt | Đã sử dụng | Hủy
      createdAt: new Date().toISOString(),
    };
    this.bookings.unshift(booking);
    walletItem.status = 'booked';
    Store.write(STORAGE_KEYS.bookings, this.bookings);
    Store.write(STORAGE_KEYS.wallet, this.wallet);
    return booking;
  },

  cancelBooking(bookingId) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    booking.status = 'Hủy';
    const walletItem = this.wallet.find((w) => w.id === booking.walletItemId);
    if (walletItem) walletItem.status = 'available';
    Store.write(STORAGE_KEYS.bookings, this.bookings);
    Store.write(STORAGE_KEYS.wallet, this.wallet);
  },

  markUsed(bookingId) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    booking.status = 'Đã sử dụng';
    const walletItem = this.wallet.find((w) => w.id === booking.walletItemId);
    if (walletItem) walletItem.status = 'used';
    Store.write(STORAGE_KEYS.bookings, this.bookings);
    Store.write(STORAGE_KEYS.wallet, this.wallet);
  },

  getBooking(id) {
    return this.bookings.find((b) => b.id === id);
  },
};
