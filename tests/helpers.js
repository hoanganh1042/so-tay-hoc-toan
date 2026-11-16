// Tiện ích dùng chung cho bộ kiểm thử: nạp các tệp dữ liệu của app vào một ngữ cảnh giả lập trình duyệt.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const WEB = path.join(ROOT, 'web');
const APP_HTML = 'WebApp_So_tay_hoc_Toan.html';

const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const html = () => read(WEB, APP_HTML);
// Danh sách tệp mã theo đúng thứ tự trang nạp.
const scripts = () => [...html().matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

// Chạy các tệp dữ liệu (không chạy mã giao diện) và trả về đối tượng window giả.
const UI_FILES = new Set(['boot.js', 'db.js', 'app.js', 'view_congthuc.js']);
function loadData() {
  const window = {};
  const ctx = vm.createContext({ window, console });
  for (const f of scripts()) if (!UI_FILES.has(f)) vm.runInContext(read(WEB, f), ctx, { filename: f });
  return window;
}

// Mọi câu hỏi kèm khóa, theo đúng cách app đánh khóa: <bài>#d, <bài>#<i>, <vị trí đề>#<i>.
function allItems(w) {
  const lessons = {}, items = [];
  for (const g of [10, 11, 12]) for (const c of w.KHKT_DATA[g]) for (const l of c.lessons) lessons[l.id] = { ...l, ex: [...l.ex], ch: c.id, g };
  for (const [id, add] of Object.entries(w.KHKT_EX_ADD || {})) if (lessons[id]) lessons[id].ex.push(...add);
  for (const l of Object.values(lessons)) { items.push([l.id + '#d', l.d]); l.ex.forEach((e, i) => items.push([l.id + '#' + i, e])); }
  for (const s of w.KHKT_EXAM) s.items.concat((w.KHKT_EXAM_ADD || {})[s.id] || [], (w.KHKT_EXAM_LV || {})[s.id] || []).forEach((e, i) => items.push([s.id + '#' + i, e]));
  return { lessons, items };
}

module.exports = { ROOT, WEB, APP_HTML, read, html, scripts, loadData, allItems };
