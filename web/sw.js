// Service worker của app Sổ tay học Toán: lưu sẵn các file để mở được khi không có mạng.
// File của app: lấy từ mạng trước (luôn có bản mới khi online), mất mạng thì dùng bản đã lưu.
// Font Google: dùng bản đã lưu trước. Đổi VER khi muốn xóa bộ nhớ đệm cũ.
const VER = 'sotay-v15';
const SHELL = [
  './', './WebApp_So_tay_hoc_Toan.html', './manifest.webmanifest',
  './app.css', './boot.js', './db.js', './app.js', './congthuc.js', './view_congthuc.js',
  './data.js', './data_them.js', './mucdo.js', './sach.js', './dethi_them.js', './dethi_mucdo.js', './thucte.js', './chuong.js', './bosung.js', './hinh.js', './hinh_bosung.js', './phantich.js',
  './loigiai_10.js', './loigiai_11.js', './loigiai_12.js', './loigiai_dethi.js',
  './app/icon-192.png', './app/icon-512.png', './app/icon-maskable-512.png', './app/apple-touch-icon.png'
];
const OPTIONAL = [];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(async c => {
    await c.addAll(SHELL);
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
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !font) return;
  // Chỉ lưu phản hồi thành công và không phải chuyển hướng. Phông Google trả phản hồi "mờ" (opaque) nên chấp nhận riêng cho phông.
  const keep = res => { if (res && !res.redirected && (res.ok || (font && res.type === 'opaque'))) { const copy = res.clone(); e.waitUntil(caches.open(VER).then(c => c.put(req, copy)).catch(() => {})); } return res; };
  if (font) { e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(keep))); return; }
  e.respondWith(fetch(req).then(keep).catch(() =>
    caches.match(req, {ignoreSearch: true}).then(hit => hit || (req.mode === 'navigate' ? caches.match('./WebApp_So_tay_hoc_Toan.html') : undefined))));
});
