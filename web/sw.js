// Service worker của app Sổ tay học Toán: lưu sẵn các file để mở được khi không có mạng.
// File của app: lấy từ mạng trước (luôn có bản mới khi online), mất mạng thì dùng bản đã lưu.
// Chỉ xử lý yêu cầu GET cùng nguồn gốc, kể cả phông chữ tự lưu. Đổi VER khi muốn xóa bộ nhớ đệm cũ.
const VER = 'sotay-v21';
const SHELL = [
  './', './WebApp_So_tay_hoc_Toan.html', './manifest.webmanifest',
  './app.css', './boot.js', './db.js', './app.js', './phanso.js', './congthuc.js', './view_congthuc.js',
  './data.js', './data_them.js', './mucdo.js', './sach.js', './dethi_them.js', './dethi_mucdo.js', './thucte.js', './chuong.js', './bosung.js', './hinh.js', './hinh_bosung.js', './phantich.js',
  './loigiai_10.js', './loigiai_11.js', './loigiai_12.js', './loigiai_dethi.js',
  './app/icon-192.png', './app/icon-512.png', './app/icon-maskable-512.png', './app/apple-touch-icon.png',
  './fonts/be-vietnam-pro-400-vietnamese.woff2', './fonts/be-vietnam-pro-400-latin.woff2',
  './fonts/be-vietnam-pro-500-vietnamese.woff2', './fonts/be-vietnam-pro-500-latin.woff2',
  './fonts/be-vietnam-pro-600-vietnamese.woff2', './fonts/be-vietnam-pro-600-latin.woff2',
  './fonts/be-vietnam-pro-700-vietnamese.woff2', './fonts/be-vietnam-pro-700-latin.woff2'
];
const OPTIONAL = [];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(async c => {
    // cache: 'reload' bỏ qua bộ nhớ đệm HTTP của trình duyệt (GitHub Pages cho lưu 10 phút), để không cài nhầm tệp cũ.
    await c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})));
    await Promise.all(OPTIONAL.map(u => c.add(u).catch(() => {})));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('sotay-') && k !== VER).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Chỉ lưu phản hồi thành công và không phải chuyển hướng.
  const keep = res => { if (res && res.ok && !res.redirected) { const copy = res.clone(); e.waitUntil(caches.open(VER).then(c => c.put(req, copy)).catch(() => {})); } return res; };
  // Luôn hỏi lại máy chủ (no-cache: dùng ETag, tệp không đổi thì chỉ nhận phản hồi 304) để các tệp không lệch phiên bản.
  const net = req.mode === 'navigate' ? fetch(req.url, {cache: 'no-cache', credentials: 'same-origin'}) : fetch(req, {cache: 'no-cache'});
  e.respondWith(net.then(keep).catch(() =>
    caches.match(req, {ignoreSearch: true}).then(hit => hit || (req.mode === 'navigate' ? caches.match('./WebApp_So_tay_hoc_Toan.html') : undefined))));
});
