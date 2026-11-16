// Kiểm tra web/congthuc.js: (a) cấu trúc dữ liệu, (b) phép thử số cho các công thức dễ sai.
// Chạy: node tools/kiemtra_congthuc.js   (thoát mã 0 nếu mọi kiểm tra đều đạt)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WEB = path.join(__dirname, '..', 'web');
global.window = global;
for (const f of ['data.js', 'data_them.js', 'congthuc.js']) {
  vm.runInThisContext(fs.readFileSync(path.join(WEB, f), 'utf8'), { filename: f });
}
const CT = window.KHKT_CT;
const loi = [];
const bao = m => loi.push(m);

// ───────────────────────── (a) Cấu trúc ─────────────────────────
const chuong = [];
for (const g of [10, 11, 12]) for (const c of window.KHKT_DATA[g]) chuong.push({ g, id: c.id, ten: c.ten });
const viTri = new Map(chuong.map((c, i) => [c.id, i]));
if (chuong.length !== 23) bao(`data.js + data_them.js có ${chuong.length} chương, mong đợi 23`);

const isStr = s => typeof s === 'string' && s.trim().length > 0;
const kiTuLa = new Map();
function ktChuoi(s, noi) {
  if (!isStr(s)) { bao(`${noi}: chuỗi rỗng hoặc không phải chuỗi`); return; }
  if (/[\\$]/.test(s)) bao(`${noi}: có ký tự \\ hoặc $: ${s}`);
  if (/<\/?[A-Za-z][^<>]*>/.test(s)) bao(`${noi}: có dạng thẻ HTML: ${s}`);
  if (/&[A-Za-z]+;|&#\d+;/.test(s)) bao(`${noi}: có thực thể HTML: ${s}`);
  if (/<=|>=|!=|=>|->|\*/.test(s)) bao(`${noi}: dùng ký hiệu ASCII thay cho ký hiệu toán: ${s}`);
  if (/(^|[\s(=+·/,;[])-(?=\s*[\dA-Za-zα-ωπ√(])/.test(s)) bao(`${noi}: dấu trừ ASCII "-" (phải dùng "−"): ${s}`);
  if (/\d\.\d/.test(s)) bao(`${noi}: dấu thập phân kiểu Anh (phải dùng dấu phẩy): ${s}`);
  // chỉ cho phép dấu gạch trên kết hợp U+0304 (x̄, B̄) như data.js đang dùng; cấm mũi tên vectơ kết hợp và các dấu khác
  if (/[̀-̃̅-ͯ⃐-⃿꜀-ꜟ]/.test(s)) bao(`${noi}: có ký tự kết hợp khó hiển thị: ${s}`);
  if (/\b(sqrt|frac|cdot|infty|alpha|Delta)\b/.test(s)) bao(`${noi}: còn tên lệnh kiểu LaTeX: ${s}`);
  let mo = 0;
  // tính chung ( [ với ) ] để chấp nhận nửa khoảng [a; b)
  for (const ch of s) { if (ch === '(' || ch === '[') mo++; if (ch === ')' || ch === ']') mo--; if (mo < 0) break; }
  if (mo !== 0) bao(`${noi}: ngoặc không cân: ${s}`);
  for (const ch of s) if (ch.codePointAt(0) > 0x7F && !/\p{L}/u.test(ch)) kiTuLa.set(ch, (kiTuLa.get(ch) || 0) + 1);
}
function ktMuc(m, noi, batBuocGhiChu) {
  if (!m || typeof m !== 'object') { bao(`${noi}: mục không hợp lệ`); return 0; }
  for (const k of Object.keys(m)) if (!['ten', 'ct', 'gc', 'dk'].includes(k)) bao(`${noi}: khóa lạ "${k}"`);
  ktChuoi(m.ten, `${noi} ten`);
  if (!Array.isArray(m.ct) || m.ct.length === 0) { bao(`${noi} (${m.ten}): ct phải là mảng không rỗng`); return 0; }
  m.ct.forEach((s, i) => ktChuoi(s, `${noi} (${m.ten}) ct[${i}]`));
  if ('gc' in m) ktChuoi(m.gc, `${noi} (${m.ten}) gc`);
  if ('dk' in m) ktChuoi(m.dk, `${noi} (${m.ten}) dk`);
  if (batBuocGhiChu && !isStr(m.dk) && !isStr(m.gc)) bao(`${noi} (${m.ten}): mục nâng cao phải có dk hoặc gc`);
  return m.ct.length;
}

if (!CT || !Array.isArray(CT.cb) || !Array.isArray(CT.nc)) {
  console.error('Không đọc được window.KHKT_CT với hai mảng cb, nc'); process.exit(1);
}
for (const k of Object.keys(CT)) if (!['cb', 'nc'].includes(k)) bao(`KHKT_CT có khóa lạ "${k}"`);

const tk = { cbCh: 0, cbMuc: 0, cbCt: 0, ncCd: 0, ncMuc: 0, ncCt: 0 };
const daCo = new Set();
let truoc = -1;
CT.cb.forEach((c, i) => {
  const noi = `cb[${i}] ${c && c.ch}`;
  for (const k of Object.keys(c)) if (!['g', 'ch', 'ten', 'muc'].includes(k)) bao(`${noi}: khóa lạ "${k}"`);
  if (![10, 11, 12].includes(c.g)) bao(`${noi}: g phải là 10, 11 hoặc 12`);
  if (!viTri.has(c.ch)) { bao(`${noi}: ch không có trong data.js`); return; }
  if (!String(c.ch).startsWith(c.g + '-')) bao(`${noi}: g = ${c.g} không khớp id chương`);
  if (daCo.has(c.ch)) bao(`${noi}: chương bị lặp`);
  daCo.add(c.ch);
  const vt = viTri.get(c.ch);
  if (vt <= truoc) bao(`${noi}: sai thứ tự so với data.js`);
  truoc = vt;
  ktChuoi(c.ten, `${noi} ten`);
  const goc = chuong[vt].ten;
  if (c.ten !== goc) bao(`${noi}: tên chương "${c.ten}" khác data.js "${goc}"`);
  if (!Array.isArray(c.muc) || c.muc.length < 3 || c.muc.length > 8) bao(`${noi}: cần 3–8 mục, đang có ${c.muc ? c.muc.length : 0}`);
  const tenMuc = new Set();
  (c.muc || []).forEach((m, j) => {
    if (tenMuc.has(m.ten)) bao(`${noi}: trùng tên mục "${m.ten}"`);
    tenMuc.add(m.ten);
    tk.cbCt += ktMuc(m, `${noi} muc[${j}]`, false); tk.cbMuc++;
  });
  tk.cbCh++;
});
for (const c of chuong) if (!daCo.has(c.id)) bao(`cb thiếu chương ${c.id} (${c.ten})`);

if (CT.nc.length < 8 || CT.nc.length > 12) bao(`nc cần 8–12 chủ đề, đang có ${CT.nc.length}`);
const tenNc = new Set();
CT.nc.forEach((cd, i) => {
  const noi = `nc[${i}] ${cd && cd.ten}`;
  for (const k of Object.keys(cd)) if (!['ten', 'muc'].includes(k)) bao(`${noi}: khóa lạ "${k}"`);
  ktChuoi(cd.ten, `${noi} ten`);
  if (!Array.isArray(cd.muc) || cd.muc.length === 0) { bao(`${noi}: muc rỗng`); return; }
  cd.muc.forEach((m, j) => {
    if (tenNc.has(m.ten)) bao(`${noi}: trùng tên mục "${m.ten}"`);
    tenNc.add(m.ten);
    tk.ncCt += ktMuc(m, `${noi} muc[${j}]`, true); tk.ncMuc++;
  });
  tk.ncCd++;
});
if (tk.ncMuc < 40 || tk.ncMuc > 60) bao(`nc cần khoảng 40–60 mục, đang có ${tk.ncMuc}`);

// nc không được chép lại nội dung cb
const chuan = s => s.replace(/\s+/g, ' ').trim();
const cbCt = new Set(), cbTen = new Set();
for (const c of CT.cb) for (const m of c.muc || []) { cbTen.add(m.ten); for (const s of m.ct || []) cbCt.add(chuan(s)); }
for (const cd of CT.nc) for (const m of cd.muc || []) {
  if (cbTen.has(m.ten)) bao(`nc "${m.ten}": trùng tên mục với cb`);
  for (const s of m.ct || []) if (cbCt.has(chuan(s))) bao(`nc "${m.ten}": công thức trùng cb: ${s}`);
}

// Tệp phải là UTF-8 không BOM, mỗi mục một dòng
const nguon = fs.readFileSync(path.join(WEB, 'congthuc.js'));
if (nguon[0] === 0xEF && nguon[1] === 0xBB) bao('congthuc.js có BOM');
const dongMuc = nguon.toString('utf8').split('\n').filter(d => /^\s*\{ ten: ".*", ct: \[/.test(d)).length;
if (dongMuc !== tk.cbMuc + tk.ncMuc) bao(`số dòng mục (${dongMuc}) khác số mục (${tk.cbMuc + tk.ncMuc}): mỗi mục nên nằm trên một dòng`);

// ───────────────────────── (b) Phép thử số ─────────────────────────
let soPhep = 0;
const phepThu = [];
function thu(loai, ch, tenMuc, fn) { phepThu.push({ loai, ch, tenMuc, fn }); }
class SaiSo extends Error {}
function gan(x, y, tol = 1e-9, ghi = '') {
  soPhep++;
  const ok = Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= tol * Math.max(1, Math.abs(x), Math.abs(y));
  if (!ok) throw new SaiSo(`${ghi} ${x} ≠ ${y}`);
}
function dung(dk, ghi = '') { soPhep++; if (!dk) throw new SaiSo(`sai: ${ghi}`); }

// tiện ích
let hat = 20240917;
const ngauNhien = () => { hat = (hat * 1103515245 + 12345) % 2147483648; return hat / 2147483648; };
const nn = (a, b) => a + (b - a) * ngauNhien();
const nguyen = (a, b) => Math.floor(nn(a, b + 1));
const lap = (n, f) => { for (let i = 0; i < n; i++) f(i); };
function simpson(f, a, b, n = 4000) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return s * h / 3;
}
const dh = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const dh2 = (f, x, h = 1e-4) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
const giaiThua = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const C = (n, k) => (k < 0 || k > n) ? 0 : Math.round(giaiThua(n) / (giaiThua(k) * giaiThua(n - k)));
const A = (n, k) => Math.round(giaiThua(n) / giaiThua(n - k));
const cong = (u, v) => u.map((x, i) => x + v[i]);
const tru = (u, v) => u.map((x, i) => x - v[i]);
const nhan = (k, u) => u.map(x => k * x);
const vh = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const dai = u => Math.sqrt(vh(u, u));
const coHuong = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const diem3 = (r = 5) => [nn(-r, r), nn(-r, r), nn(-r, r)];
const theTichTuDien = (P, Q, R, S) => Math.abs(vh(coHuong(tru(Q, P), tru(R, P)), tru(S, P))) / 6;
function giai3(M, b) { // Cramer
  const det = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det(M);
  return [0, 1, 2].map(j => det(M.map((r, i) => r.map((x, k) => k === j ? b[i] : x))) / D);
}
function tamCau(P) { // tâm mặt cầu qua 4 điểm
  const M = [1, 2, 3].map(i => nhan(2, tru(P[i], P[0])));
  const b = [1, 2, 3].map(i => vh(P[i], P[i]) - vh(P[0], P[0]));
  return giai3(M, b);
}
function tamGiacNN() { // tam giác ngẫu nhiên không suy biến trong mặt phẳng
  for (;;) {
    const P = [[nn(-5, 5), nn(-5, 5)], [nn(-5, 5), nn(-5, 5)], [nn(-5, 5), nn(-5, 5)]];
    const s = Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])) / 2;
    if (s > 1) return P;
  }
}
function canhGoc(P) { // a = BC, b = CA, c = AB và các góc
  const [Ap, Bp, Cp] = P;
  const a = dai(tru(Bp, Cp)), b = dai(tru(Cp, Ap)), c = dai(tru(Ap, Bp));
  const gA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
  const gB = Math.acos((c * c + a * a - b * b) / (2 * c * a));
  return { a, b, c, A: gA, B: gB, C: Math.PI - gA - gB };
}
const dtTG = P => Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])) / 2;
const R_ngoai = (a, b, c, S) => a * b * c / (4 * S);

// ── cb ──
thu('cb', '10-III', 'Giá trị lượng giác đặc biệt', () => {
  const r = Math.PI / 180, s2 = Math.SQRT2, s3 = Math.sqrt(3);
  [[0, 0, 1], [30, 1 / 2, s3 / 2], [45, s2 / 2, s2 / 2], [60, s3 / 2, 1 / 2], [90, 1, 0], [120, s3 / 2, -1 / 2], [135, s2 / 2, -s2 / 2], [150, 1 / 2, -s3 / 2], [180, 0, -1]]
    .forEach(([d, s, c]) => { gan(Math.sin(d * r), s, 1e-12, d + '° sin'); gan(Math.cos(d * r), c, 1e-12, d + '° cos'); });
  gan(Math.tan(30 * r), s3 / 3); gan(Math.tan(60 * r), s3); gan(Math.tan(45 * r), 1);
});
thu('cb', '10-III', 'Góc bù nhau, góc phụ nhau', () => lap(20, () => {
  const x = nn(0.1, 3);
  gan(Math.sin(Math.PI - x), Math.sin(x)); gan(Math.cos(Math.PI - x), -Math.cos(x)); gan(Math.tan(Math.PI - x), -Math.tan(x));
  gan(Math.tan(Math.PI / 2 - x), 1 / Math.tan(x), 1e-8);
}));
thu('cb', '10-III', 'Định lí côsin', () => lap(30, () => {
  const k = canhGoc(tamGiacNN());
  gan(k.a ** 2, k.b ** 2 + k.c ** 2 - 2 * k.b * k.c * Math.cos(k.A), 1e-9);
  gan(k.c ** 2, k.a ** 2 + k.b ** 2 - 2 * k.a * k.b * Math.cos(k.C), 1e-9);
}));
thu('cb', '10-III', 'Định lí sin', () => lap(30, () => {
  const P = tamGiacNN(), k = canhGoc(P), R = R_ngoai(k.a, k.b, k.c, dtTG(P));
  gan(k.a / Math.sin(k.A), 2 * R, 1e-8); gan(k.b / Math.sin(k.B), 2 * R, 1e-8); gan(k.c / Math.sin(k.C), 2 * R, 1e-8);
}));
thu('cb', '10-III', 'Diện tích tam giác', () => lap(30, () => {
  const P = tamGiacNN(), k = canhGoc(P), S = dtTG(P), p = (k.a + k.b + k.c) / 2;
  gan(0.5 * k.b * k.c * Math.sin(k.A), S, 1e-8);
  gan(Math.sqrt(p * (p - k.a) * (p - k.b) * (p - k.c)), S, 1e-8);
  // r từ tâm nội tiếp
  const I = [0, 1].map(t => (k.a * P[0][t] + k.b * P[1][t] + k.c * P[2][t]) / (2 * p));
  const [x1, y1] = P[1], [x2, y2] = P[2];
  const r = Math.abs((y2 - y1) * I[0] - (x2 - x1) * I[1] + x2 * y1 - y2 * x1) / Math.hypot(y2 - y1, x2 - x1);
  gan(p * r, S, 1e-8);
}));
thu('cb', '10-IV', 'Tích vô hướng', () => lap(20, () => {
  const a = [nn(-5, 5), nn(-5, 5)], b = [nn(-5, 5), nn(-5, 5)];
  const goc = Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]);
  gan(vh(a, b), dai(a) * dai(b) * Math.cos(goc), 1e-9);
  gan(vh(cong(a, b), cong(a, b)), vh(a, a) + 2 * vh(a, b) + vh(b, b), 1e-9);
}));
thu('cb', '10-VI', 'Hàm số bậc hai', () => lap(20, () => {
  const a = nn(-3, 3) || 1, b = nn(-5, 5), c = nn(-5, 5), D = b * b - 4 * a * c, x0 = -b / (2 * a);
  const f = x => a * x * x + b * x + c;
  gan(f(x0), -D / (4 * a), 1e-9);
  const h = nn(0.1, 2); gan(f(x0 - h), f(x0 + h), 1e-9);
  dung(a > 0 ? f(x0 + h) > f(x0) : f(x0 + h) < f(x0), 'chiều biến thiên');
}));
thu('cb', '10-VI', 'Phương trình bậc hai và định lí Viète', () => {
  lap(20, () => {
    const a = nn(0.5, 3) * (ngauNhien() < 0.5 ? -1 : 1), b = nn(-9, 9), c = nn(-2, 2);
    const D = b * b - 4 * a * c; if (D <= 0) return;
    const x1 = (-b + Math.sqrt(D)) / (2 * a), x2 = (-b - Math.sqrt(D)) / (2 * a);
    gan(a * x1 * x1 + b * x1 + c, 0, 1e-9); gan(x1 + x2, -b / a); gan(x1 * x2, c / a);
    const bp = b / 2, Dp = bp * bp - a * c; gan((-bp + Math.sqrt(Dp)) / a, x1, 1e-9);
  });
  const a = 2, c = 5, b = -(a + c); gan(a * (c / a) ** 2 + b * (c / a) + c, 0); gan(a + b + c, 0);
  const b2 = a + c; gan(a * (-c / a) ** 2 + b2 * (-c / a) + c, 0);
});
thu('cb', '10-VI', 'Dấu của tam thức bậc hai', () => lap(30, () => {
  const a = nn(-3, 3), b = nn(-4, 4), c = nn(-4, 4), D = b * b - 4 * a * c; if (Math.abs(a) < 0.1) return;
  const f = x => a * x * x + b * x + c;
  if (D < 0) lap(20, () => dung(Math.sign(f(nn(-50, 50))) === Math.sign(a), 'Δ < 0 cùng dấu a'));
  else if (D > 0) {
    const r = [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((u, v) => u - v);
    dung(Math.sign(f((r[0] + r[1]) / 2)) === -Math.sign(a), 'trong trái');
    dung(Math.sign(f(r[1] + 1)) === Math.sign(a) && Math.sign(f(r[0] - 1)) === Math.sign(a), 'ngoài cùng');
  }
}));
thu('cb', '10-VII', 'Đường tròn', () => lap(20, () => {
  const a = nn(-5, 5), b = nn(-5, 5), R = nn(1, 5), t = nn(0, 6.28);
  const c = a * a + b * b - R * R; gan(Math.sqrt(a * a + b * b - c), R);
  const x0 = a + R * Math.cos(t), y0 = b + R * Math.sin(t);
  gan(x0 * x0 + y0 * y0 - 2 * a * x0 - 2 * b * y0 + c, 0, 1e-9);
  // tiếp tuyến: khoảng cách từ tâm bằng R
  const A_ = x0 - a, B_ = y0 - b, C_ = -(A_ * x0 + B_ * y0);
  gan(Math.abs(A_ * a + B_ * b + C_) / Math.hypot(A_, B_), R, 1e-9);
}));
thu('cb', '10-VII', 'Khoảng cách từ điểm đến đường thẳng', () => lap(20, () => {
  const a = nn(-5, 5), b = nn(-5, 5), c = nn(-5, 5), x0 = nn(-5, 5), y0 = nn(-5, 5);
  // điểm gần nhất trên đường thẳng tìm bằng tham số hóa
  const P0 = Math.abs(b) > Math.abs(a) ? [0, -c / b] : [-c / a, 0], u = [-b, a];
  const t = vh(tru([x0, y0], P0), u) / vh(u, u), H = cong(P0, nhan(t, u));
  gan(dai(tru([x0, y0], H)), Math.abs(a * x0 + b * y0 + c) / Math.hypot(a, b), 1e-9);
}));
thu('cb', '10-VII', 'Elip', () => lap(10, () => {
  const b = nn(1, 3), a = b + nn(0.5, 3), c = Math.sqrt(a * a - b * b), t = nn(0, 6.28);
  const M = [a * Math.cos(t), b * Math.sin(t)];
  gan(dai(tru(M, [-c, 0])) + dai(tru(M, [c, 0])), 2 * a, 1e-9);
}));
thu('cb', '10-VII', 'Hypebol', () => lap(10, () => {
  const a = nn(1, 3), b = nn(1, 3), c = Math.sqrt(a * a + b * b), t = nn(-2, 2), s = ngauNhien() < 0.5 ? -1 : 1;
  const M = [s * a * Math.cosh(t), b * Math.sinh(t)];
  gan(Math.abs(dai(tru(M, [-c, 0])) - dai(tru(M, [c, 0]))), 2 * a, 1e-9);
}));
thu('cb', '10-VII', 'Parabol', () => lap(10, () => {
  const p = nn(0.5, 4), y = nn(-5, 5), x = y * y / (2 * p);
  gan(dai(tru([x, y], [p / 2, 0])), x + p / 2, 1e-9);
}));
thu('cb', '10-VIII', 'Tính chất của số tổ hợp', () => { for (let n = 1; n <= 15; n++) for (let k = 1; k <= n; k++) { gan(C(n, k - 1) + C(n, k), C(n + 1, k)); gan(C(n, k), C(n, n - k)); gan(A(n, k), giaiThua(k) * C(n, k)); } });
thu('cb', '10-VIII', 'Nhị thức Newton (n = 4, n = 5)', () => lap(10, () => {
  const a = nn(-3, 3), b = nn(-3, 3);
  gan((a + b) ** 4, a ** 4 + 4 * a ** 3 * b + 6 * a * a * b * b + 4 * a * b ** 3 + b ** 4, 1e-9);
  gan((a + b) ** 5, a ** 5 + 5 * a ** 4 * b + 10 * a ** 3 * b ** 2 + 10 * a * a * b ** 3 + 5 * a * b ** 4 + b ** 5, 1e-9);
}));
thu('cb', '11-I', 'Radian và hệ thức cơ bản', () => lap(20, () => {
  const x = nn(0.1, 1.4); gan(1 + Math.tan(x) ** 2, 1 / Math.cos(x) ** 2, 1e-9); gan(1 + 1 / Math.tan(x) ** 2, 1 / Math.sin(x) ** 2, 1e-9);
  gan(Math.PI / 180 * 180, Math.PI);
}));
thu('cb', '11-I', 'Giá trị lượng giác của các góc có liên quan đặc biệt', () => lap(20, () => {
  const x = nn(-3, 3), P = Math.PI;
  gan(Math.sin(P + x), -Math.sin(x)); gan(Math.cos(P + x), -Math.cos(x)); gan(Math.tan(P + x), Math.tan(x), 1e-8);
  gan(Math.cos(P / 2 - x), Math.sin(x)); gan(Math.cos(P - x), -Math.cos(x));
}));
thu('cb', '11-I', 'Công thức cộng', () => lap(30, () => {
  const a = nn(-1.2, 1.2), b = nn(-0.3, 0.3), s = Math.sin, c = Math.cos, t = Math.tan;
  gan(c(a - b), c(a) * c(b) + s(a) * s(b)); gan(c(a + b), c(a) * c(b) - s(a) * s(b));
  gan(s(a - b), s(a) * c(b) - c(a) * s(b)); gan(s(a + b), s(a) * c(b) + c(a) * s(b));
  if (Math.abs(1 - t(a) * t(b)) > 0.1) gan(t(a + b), (t(a) + t(b)) / (1 - t(a) * t(b)), 1e-8);
  gan(t(a - b), (t(a) - t(b)) / (1 + t(a) * t(b)), 1e-8);
}));
thu('cb', '11-I', 'Công thức nhân đôi và hạ bậc', () => lap(30, () => {
  const a = nn(-0.7, 0.7), s = Math.sin, c = Math.cos, t = Math.tan;
  gan(s(2 * a), 2 * s(a) * c(a)); gan(c(2 * a), 2 * c(a) ** 2 - 1); gan(c(2 * a), 1 - 2 * s(a) ** 2);
  gan(t(2 * a), 2 * t(a) / (1 - t(a) ** 2), 1e-8); gan(s(a) ** 2, (1 - c(2 * a)) / 2); gan(c(a) ** 2, (1 + c(2 * a)) / 2);
}));
thu('cb', '11-I', 'Biến đổi tích thành tổng', () => lap(30, () => {
  const a = nn(-4, 4), b = nn(-4, 4), s = Math.sin, c = Math.cos;
  gan(c(a) * c(b), (c(a - b) + c(a + b)) / 2); gan(s(a) * s(b), (c(a - b) - c(a + b)) / 2); gan(s(a) * c(b), (s(a - b) + s(a + b)) / 2);
}));
thu('cb', '11-I', 'Biến đổi tổng thành tích', () => lap(30, () => {
  const a = nn(-4, 4), b = nn(-4, 4), s = Math.sin, c = Math.cos, u = (a + b) / 2, v = (a - b) / 2;
  gan(c(a) + c(b), 2 * c(u) * c(v)); gan(c(a) - c(b), -2 * s(u) * s(v)); gan(s(a) + s(b), 2 * s(u) * c(v)); gan(s(a) - s(b), 2 * c(u) * s(v));
}));
thu('cb', '11-I', 'Phương trình lượng giác cơ bản', () => lap(20, () => {
  const m = nn(-1, 1), al = Math.asin(m), k = nguyen(-3, 3);
  gan(Math.sin(al + 2 * k * Math.PI), m, 1e-9); gan(Math.sin(Math.PI - al + 2 * k * Math.PI), m, 1e-9);
  const be = Math.acos(m); gan(Math.cos(-be + 2 * k * Math.PI), m, 1e-9);
  gan(Math.sin(-Math.PI / 2 + 2 * k * Math.PI), -1); gan(Math.cos(Math.PI + 2 * k * Math.PI), -1);
}));
thu('cb', '11-II', 'Cấp số cộng', () => lap(10, () => {
  const u1 = nn(-5, 5), d = nn(-3, 3), n = nguyen(1, 40); let s = 0, u = u1;
  for (let i = 1; i <= n; i++) { s += u; if (i < n) u += d; }
  gan(u, u1 + (n - 1) * d, 1e-9); gan(s, n * (u1 + u) / 2, 1e-9); gan(s, n * (2 * u1 + (n - 1) * d) / 2, 1e-9);
}));
thu('cb', '11-II', 'Cấp số nhân', () => lap(10, () => {
  const u1 = nn(-5, 5), q = nn(-1.5, 1.5), n = nguyen(1, 20); let s = 0, u = u1;
  for (let i = 1; i <= n; i++) { s += u; if (i < n) u *= q; }
  gan(u, u1 * q ** (n - 1), 1e-9); gan(s, u1 * (1 - q ** n) / (1 - q), 1e-9);
}));
// mẫu ghép nhóm: so công thức với nội suy tuyến tính đường tần số tích lũy (cách định nghĩa độc lập)
function ogive(dau, h, tanSo, muc) {
  let tich = 0;
  for (let i = 0; i < tanSo.length; i++) {
    if (tich + tanSo[i] >= muc && tanSo[i] > 0) return dau + i * h + (muc - tich) / tanSo[i] * h;
    tich += tanSo[i];
  }
}
function congThucQ(dau, h, tanSo, muc) { // đúng như ghi trong congthuc.js
  let C_ = 0, m = 0;
  while (C_ + tanSo[m] < muc) { C_ += tanSo[m]; m++; }
  return (dau + m * h) + ((muc - C_) / tanSo[m]) * h;
}
const mauGN = () => { const k = nguyen(4, 8); return { dau: nguyen(0, 50), h: nguyen(2, 10), f: Array.from({ length: k }, () => nguyen(1, 15)) }; };
thu('cb', '11-III', 'Trung vị', () => lap(30, () => { const m = mauGN(), n = m.f.reduce((s, x) => s + x); gan(congThucQ(m.dau, m.h, m.f, n / 2), ogive(m.dau, m.h, m.f, n / 2), 1e-12); }));
thu('cb', '11-III', 'Tứ phân vị', () => lap(30, () => {
  const m = mauGN(), n = m.f.reduce((s, x) => s + x);
  gan(congThucQ(m.dau, m.h, m.f, n / 4), ogive(m.dau, m.h, m.f, n / 4), 1e-12); gan(congThucQ(m.dau, m.h, m.f, 3 * n / 4), ogive(m.dau, m.h, m.f, 3 * n / 4), 1e-12);
}));
thu('cb', '11-III', 'Mốt', () => {
  // [0;10) 2, [10;20) 7, [20;30) 4: M₀ = 10 + 5/(5 + 3)·10 = 16,25 (tính tay)
  const f = [2, 7, 4], m = 1, M0 = 10 + ((f[m] - f[m - 1]) / ((f[m] - f[m - 1]) + (f[m] - f[m + 1]))) * 10;
  gan(M0, 16.25);
});
thu('cb', '11-III', 'Số trung bình', () => { const x = [5, 15, 25], f = [2, 7, 4]; gan((2 * 5 + 7 * 15 + 4 * 25) / 13, x.reduce((s, v, i) => s + v * f[i], 0) / 13); });
thu('cb', '12-III', 'Phương sai, độ lệch chuẩn', () => lap(20, () => {
  const k = nguyen(3, 7), x = Array.from({ length: k }, () => nn(-10, 10)), f = Array.from({ length: k }, () => nguyen(1, 9));
  const n = f.reduce((s, v) => s + v), tb = x.reduce((s, v, i) => s + f[i] * v, 0) / n;
  const s1 = x.reduce((s, v, i) => s + f[i] * (v - tb) ** 2, 0) / n, s2 = x.reduce((s, v, i) => s + f[i] * v * v, 0) / n - tb * tb;
  gan(s1, s2, 1e-9);
}));
thu('cb', '11-V', 'Cấp số nhân lùi vô hạn', () => lap(10, () => {
  const u1 = nn(-5, 5), q = nn(-0.9, 0.9); let s = 0; for (let i = 0; i < 2000; i++) s += u1 * q ** i; gan(s, u1 / (1 - q), 1e-9);
}));
thu('cb', '11-V', 'Khử dạng vô định', () => lap(10, () => {
  const A_ = nn(0, 9), B = nn(0, 3); gan(Math.sqrt(A_) - B, (A_ - B * B) / (Math.sqrt(A_) + B), 1e-9);
}));
thu('cb', '11-VI', 'Quy tắc tính lôgarit', () => lap(20, () => {
  const a = nn(0.2, 5), b = nn(0.1, 9), c = nn(0.1, 9), m = nn(0.2, 5), al = nn(-3, 3), lg = (x, y) => Math.log(y) / Math.log(x);
  if (Math.abs(a - 1) < 0.05 || Math.abs(m - 1) < 0.05) return;
  gan(lg(a, b * c), lg(a, b) + lg(a, c), 1e-9); gan(lg(a, b / c), lg(a, b) - lg(a, c), 1e-9); gan(lg(a, b ** al), al * lg(a, b), 1e-9);
  gan(lg(a, b), lg(m, b) / lg(m, a), 1e-9); gan(lg(a, m), 1 / lg(m, a), 1e-9); gan(lg(a, m) * lg(m, b), lg(a, b), 1e-9);
  gan(a ** lg(a, b), b, 1e-9);
}));
thu('cb', '11-VII', 'Thể tích', () => lap(5, () => {
  // chóp cụt đều tứ giác: so với tích phân diện tích thiết diện
  const a = nn(2, 5), b = nn(0.5, 1.9), h = nn(1, 5), S = a * a, S2 = b * b;
  gan(simpson(z => (a + (b - a) * z / h) ** 2, 0, h), h * (S + S2 + Math.sqrt(S * S2)) / 3, 1e-9);
}));
thu('cb', '11-VII', 'Khoảng cách', () => lap(10, () => {
  const b = nn(1, 5), c = nn(1, 5), AH = b * c / Math.hypot(b, c); gan(1 / AH ** 2, 1 / b ** 2 + 1 / c ** 2, 1e-9);
}));
thu('cb', '11-IX', 'Đạo hàm các hàm số thường gặp', () => lap(10, () => {
  const x = nn(0.3, 1.3), a = nn(1.5, 4), n = nguyen(2, 6);
  gan(dh(t => t ** n, x), n * x ** (n - 1), 1e-7); gan(dh(t => 1 / t, x), -1 / x ** 2, 1e-7); gan(dh(Math.sqrt, x), 1 / (2 * Math.sqrt(x)), 1e-7);
  gan(dh(Math.tan, x), 1 / Math.cos(x) ** 2, 1e-6); gan(dh(t => 1 / Math.tan(t), x), -1 / Math.sin(x) ** 2, 1e-6);
  gan(dh(t => a ** t, x), a ** x * Math.log(a), 1e-7); gan(dh(t => Math.log(t) / Math.log(a), x), 1 / (x * Math.log(a)), 1e-7);
}));
thu('cb', '11-IX', 'Quy tắc tính đạo hàm', () => lap(10, () => {
  const x = nn(0.3, 2), u = Math.sin, up = Math.cos, v = t => t * t + 1, vp = t => 2 * t;
  gan(dh(t => u(t) * v(t), x), up(x) * v(x) + u(x) * vp(x), 1e-7);
  gan(dh(t => u(t) / v(t), x), (up(x) * v(x) - u(x) * vp(x)) / v(x) ** 2, 1e-7);
  gan(dh(t => 1 / v(t), x), -vp(x) / v(x) ** 2, 1e-7);
}));
thu('cb', '11-IX', 'Đạo hàm hàm hợp thường gặp', () => lap(10, () => {
  const x = nn(0.3, 1), u = t => t * t + t + 1, up = t => 2 * t + 1, n = nguyen(2, 5), a = nn(1.5, 3);
  gan(dh(t => u(t) ** n, x), n * u(x) ** (n - 1) * up(x), 1e-7); gan(dh(t => Math.sqrt(u(t)), x), up(x) / (2 * Math.sqrt(u(x))), 1e-7);
  gan(dh(t => Math.cos(u(t)), x), -up(x) * Math.sin(u(x)), 1e-6); gan(dh(t => Math.exp(u(t)), x), up(x) * Math.exp(u(x)), 1e-7);
  gan(dh(t => Math.log(u(t)), x), up(x) / u(x), 1e-7); gan(dh(t => a ** u(t), x), up(x) * a ** u(x) * Math.log(a), 1e-7);
  gan(dh(t => Math.tan(u(t) / 3), x), up(x) / 3 / Math.cos(u(x) / 3) ** 2, 1e-6);
}));
thu('cb', '12-I', 'Hàm phân thức y = (ax + b)/(cx + d)', () => lap(10, () => {
  const a = nn(-5, 5), b = nn(-5, 5), c = nn(1, 5), d = nn(-5, 5), f = x => (a * x + b) / (c * x + d), x = -d / c + nn(0.5, 3);
  gan(dh(f, x), (a * d - b * c) / (c * x + d) ** 2, 1e-6); gan(f(1e9), a / c, 1e-6);
  const h = nn(0.2, 2); gan((f(-d / c + h) + f(-d / c - h)) / 2, a / c, 1e-9); // đối xứng qua I
}));
thu('cb', '12-I', 'Hàm phân thức y = (ax² + bx + c)/(mx + n)', () => lap(10, () => {
  const a = nn(1, 3), b = nn(-3, 3), c = nn(-3, 3), m = nn(1, 3), n = nn(-3, 3);
  const p = a / m, q = (b - p * n) / m, r = c - q * n, f = x => (a * x * x + b * x + c) / (m * x + n);
  const x = nn(-5, 5); if (Math.abs(m * x + n) < 0.1) return; gan(f(x), p * x + q + r / (m * x + n), 1e-9);
}));
thu('cb', '12-I', 'Hàm bậc ba y = ax³ + bx² + cx + d', () => lap(20, () => {
  const a = nn(-3, 3), b = nn(-3, 3), c = nn(-3, 3), d = nn(-3, 3); if (Math.abs(a) < 0.2) return;
  const f = x => a * x ** 3 + b * x * x + c * x + d, x0 = -b / (3 * a), h = nn(0.1, 2);
  gan(f(x0 + h) + f(x0 - h), 2 * f(x0), 1e-9); // tâm đối xứng
  const D = 4 * b * b - 12 * a * c; dung((D > 0) === (b * b - 3 * a * c > 0), 'điều kiện hai cực trị');
}));
thu('cb', '12-IV', 'Bảng nguyên hàm', () => lap(5, () => {
  const x = nn(0.2, 1.3), al = nn(-3, 3), a = nn(1.5, 4);
  gan(dh(t => t ** (al + 1) / (al + 1), x), x ** al, 1e-6); gan(dh(t => Math.log(Math.abs(t)), -x), -1 / x, 1e-6);
  gan(dh(t => a ** t / Math.log(a), x), a ** x, 1e-7); gan(dh(Math.tan, x), 1 / Math.cos(x) ** 2, 1e-6); gan(dh(t => -1 / Math.tan(t), x), 1 / Math.sin(x) ** 2, 1e-6);
  gan(dh(t => -Math.cos(t), x), Math.sin(x), 1e-7);
}));
thu('cb', '12-IV', 'Tích phân và tính chất', () => { gan(simpson(x => x * x, 1, 4), (64 - 1) / 3, 1e-10); gan(simpson(Math.exp, 0, 1) + simpson(Math.exp, 1, 3), simpson(Math.exp, 0, 3), 1e-9); });
thu('cb', '12-IV', 'Thể tích', () => lap(5, () => { const h = nn(1, 4), r = nn(1, 3); gan(Math.PI * simpson(x => (r * x / h) ** 2, 0, h), Math.PI * r * r * h / 3, 1e-9); }));
thu('cb', '12-V', 'Phương trình mặt phẳng', () => lap(10, () => {
  const a = diem3(), b = diem3(), n = coHuong(a, b); gan(vh(n, a), 0, 1e-9); gan(vh(n, b), 0, 1e-9);
  const p = nn(1, 5), q = nn(1, 5), r = nn(1, 5); [[p, 0, 0], [0, q, 0], [0, 0, r]].forEach(P => gan(P[0] / p + P[1] / q + P[2] / r, 1));
}));
thu('cb', '12-V', 'Khoảng cách từ điểm đến mặt phẳng', () => lap(10, () => {
  const n = diem3(), D = nn(-5, 5), D2 = nn(-5, 5), M = diem3();
  const t = (vh(n, M) + D) / vh(n, n), H = tru(M, nhan(t, n)); gan(vh(n, H) + D, 0, 1e-9);
  gan(dai(tru(M, H)), Math.abs(vh(n, M) + D) / dai(n), 1e-9);
  const P = nhan(-D / vh(n, n), n); gan(Math.abs(vh(n, P) + D2) / dai(n), Math.abs(D - D2) / dai(n), 1e-9);
}));
thu('cb', '12-V', 'Góc trong không gian', () => lap(10, () => {
  const u = diem3(), n = diem3(), up = tru(u, nhan(vh(u, n) / vh(n, n), n)); // hình chiếu của u lên mặt phẳng
  const goc = Math.acos(vh(u, up) / (dai(u) * dai(up))); gan(Math.sin(goc), Math.abs(vh(u, n)) / (dai(u) * dai(n)), 1e-9);
}));
thu('cb', '12-V', 'Mặt cầu', () => lap(10, () => {
  const I = diem3(), R = nn(3, 6), n = diem3(), h = nn(0, 2.9), H = cong(I, nhan(h / dai(n), n));
  const v = coHuong(n, [1, 0, 0]), r = Math.sqrt(R * R - h * h), P = cong(H, nhan(r / dai(v), v)); // P trên mặt phẳng, cách H một đoạn r
  gan(dai(tru(P, I)), R, 1e-9);
}));
thu('cb', '12-VI', 'Công thức Bayes', () => lap(10, () => {
  const pB = nn(0.05, 0.95), pAB = nn(0, 1), pAnB = nn(0, 1), pA = pB * pAB + (1 - pB) * pAnB;
  // mô phỏng bảng xác suất đồng thời
  const giao = pB * pAB; gan(giao / pA, pB * pAB / (pB * pAB + (1 - pB) * pAnB), 1e-12);
}));

// ── nc ──
const bacBa = () => { for (;;) { const a = nn(-3, 3), b = nn(-4, 4), c = nn(-4, 4), d = nn(-4, 4); if (Math.abs(a) > 0.2 && b * b - 3 * a * c > 0.5) return { a, b, c, d, f: x => a * x ** 3 + b * x * x + c * x + d }; } };
const cucTriBa = ({ a, b, c }) => { const D = 4 * b * b - 12 * a * c; return [(-2 * b - Math.sqrt(D)) / (6 * a), (-2 * b + Math.sqrt(D)) / (6 * a)]; };
thu('nc', null, 'Đường thẳng qua hai điểm cực trị của hàm bậc ba', () => lap(30, () => {
  const H = bacBa(), { a, b, c, d, f } = H, k = 2 * c / 3 - 2 * b * b / (9 * a), m = d - b * c / (9 * a);
  for (const x of cucTriBa(H)) gan(f(x), k * x + m, 1e-9);
  const x = nn(-5, 5), y1 = 3 * a * x * x + 2 * b * x + c, y2 = 6 * a * x + 2 * b;
  gan(f(x) - y1 * y2 / (18 * a), k * x + m, 1e-9);
}));
thu('nc', null, 'Hai điểm cực trị của hàm bậc ba', () => lap(30, () => {
  const H = bacBa(), { a, b, c, f } = H, [x1, x2] = cucTriBa(H);
  gan(Math.abs(x1 - x2), 2 * Math.sqrt(b * b - 3 * a * c) / (3 * Math.abs(a)), 1e-9);
  gan(x1 + x2, -2 * b / (3 * a), 1e-9); gan(x1 * x2, c / (3 * a), 1e-9);
  gan((x1 + x2) / 2, -b / (3 * a), 1e-9); gan((f(x1) + f(x2)) / 2, f(-b / (3 * a)), 1e-9);
}));
thu('nc', null, 'Dấu hiệu cực trị bằng đạo hàm cấp hai', () => {
  const f = x => x ** 3 - 3 * x; // f′(±1) = 0, f″(1) = 6 > 0, f″(−1) = −6 < 0
  gan(dh(f, 1), 0, 1e-8); gan(dh2(f, 1), 6, 1e-5); gan(dh2(f, -1), -6, 1e-5);
  [1e-2, 1e-3].forEach(h => { dung(f(1) < f(1 + h) && f(1) < f(1 - h), 'cực tiểu tại 1'); dung(f(-1) > f(-1 + h) && f(-1) > f(-1 - h), 'cực đại tại −1'); });
  // f″ = 0 thì chưa kết luận: x⁴ có cực tiểu, x³ không có cực trị
  dung(0 < 1e-3 ** 4 && 1e-3 ** 3 > 0 && (-1e-3) ** 3 < 0, 'phản ví dụ f″ = 0');
});
thu('nc', null, 'Cực trị hàm trùng phương', () => lap(30, () => {
  const a = nn(-3, 3), b = nn(-3, 3), c = nn(-3, 3); if (Math.abs(a) < 0.2 || Math.abs(b) < 0.2) return;
  const f = x => a * x ** 4 + b * x * x + c;
  // y′ = 2x(2ax² + b): số nghiệm phân biệt
  const soNghiem = 1 + (-b / (2 * a) > 0 ? 2 : 0); dung((soNghiem === 3) === (a * b < 0), 'ab < 0 ⇔ ba cực trị');
  if (a * b < 0) {
    const x = Math.sqrt(-b / (2 * a)); gan(dh(f, x), 0, 1e-7); gan(f(x), c - b * b / (4 * a), 1e-9); gan(f(-x), c - b * b / (4 * a), 1e-9);
    if (a > 0) dung(f(0) > f(0.01) && f(x) < f(x + 0.01), 'a > 0, b < 0: CĐ tại 0'); else dung(f(0) < f(0.01) && f(x) > f(x + 0.01), 'a < 0, b > 0: CT tại 0');
  }
}));
thu('nc', null, 'Tam giác ba điểm cực trị của hàm trùng phương', () => {
  const diem = (a, b, c) => { const x = Math.sqrt(-b / (2 * a)), y = c - b * b / (4 * a); return [[0, c], [-x, y], [x, y]]; };
  lap(10, () => { // vuông cân: b³ = −8a
    const a = nn(0.2, 3) * (ngauNhien() < 0.5 ? -1 : 1), b = Math.cbrt(-8 * a), [P, Q, R] = diem(a, b, nn(-3, 3));
    gan(vh(tru(Q, P), tru(R, P)), 0, 1e-9);
  });
  lap(10, () => { // đều: b³ = −24a
    const a = nn(0.2, 3) * (ngauNhien() < 0.5 ? -1 : 1), b = Math.cbrt(-24 * a), [P, Q, R] = diem(a, b, nn(-3, 3));
    gan(dai(tru(Q, R)), dai(tru(P, Q)), 1e-9);
  });
  lap(20, () => {
    const a = nn(0.2, 3), b = -nn(0.2, 3), s = ngauNhien() < 0.5 ? 1 : -1, P = diem(s * a, s * b, nn(-3, 3));
    gan(dtTG(P) ** 2, -((s * b) ** 5) / (32 * (s * a) ** 3), 1e-9);
  });
});
thu('nc', null, 'Tiệm cận của hàm phân thức hữu tỉ', () => {
  const X = 1e7;
  gan((3 * X + 1) / (X * X - 2), 0, 1e-6); // bậc tử < bậc mẫu
  gan((2 * X * X + 1) / (5 * X * X - X), 2 / 5, 1e-6); // cùng bậc
  const f = x => (x * x + 1) / (x - 1); gan(f(X) - (X + 1), 0, 1e-6); gan(f(-X) - (-X + 1), 0, 1e-6); // tiệm cận xiên y = x + 1
  dung(Math.abs(f(1 + 1e-9)) > 1e8, 'TCĐ x = 1');
  const g = x => (x + 1) / (x * x - 1); gan(g(-1 + 1e-7), -0.5, 1e-6); dung(Math.abs(g(1 + 1e-9)) > 1e8, 'nghiệm chung −1 không là TCĐ, x = 1 vẫn là TCĐ');
});
thu('nc', null, 'Tiệm cận xiên của hàm chứa căn bậc hai', () => lap(10, () => {
  const a = nn(0.5, 5), b = nn(-5, 5), c = nn(-5, 5), f = x => Math.sqrt(a * x * x + b * x + c), X = 1e6;
  gan(f(X) - Math.sqrt(a) * (X + b / (2 * a)), 0, 1e-5); gan(f(-X) + Math.sqrt(a) * (-X + b / (2 * a)), 0, 1e-5);
}));
thu('nc', null, 'Tiếp tuyến của đồ thị hàm phân thức bậc nhất', () => lap(20, () => {
  const a = nn(-5, 5), b = nn(-5, 5), c = nn(0.5, 4) * (ngauNhien() < 0.5 ? -1 : 1), d = nn(-5, 5); if (Math.abs(a * d - b * c) < 0.5) return;
  const f = x => (a * x + b) / (c * x + d), fp = x => (a * d - b * c) / (c * x + d) ** 2, x0 = -d / c + nn(0.3, 3) * (ngauNhien() < 0.5 ? -1 : 1);
  const tt = x => fp(x0) * (x - x0) + f(x0), xI = -d / c, yI = a / c;
  const PA = [xI, tt(xI)], PB = [x0 + (yI - f(x0)) / fp(x0), yI];
  gan((PA[0] + PB[0]) / 2, x0, 1e-9); gan((PA[1] + PB[1]) / 2, f(x0), 1e-9);
  gan(dtTG([[xI, yI], PA, PB]), 2 * Math.abs(a * d - b * c) / (c * c), 1e-9);
}));
thu('nc', null, 'Biểu thức a·sin x + b·cos x', () => lap(20, () => {
  const a = nn(-5, 5), b = nn(-5, 5), R = Math.hypot(a, b), phi = Math.atan2(b, a), x = nn(-6, 6);
  gan(Math.cos(phi), a / R); gan(Math.sin(phi), b / R);
  gan(a * Math.sin(x) + b * Math.cos(x), R * Math.sin(x + phi), 1e-9);
  let max = -Infinity; for (let t = 0; t < 2 * Math.PI; t += 1e-3) max = Math.max(max, a * Math.sin(t) + b * Math.cos(t)); dung(max <= R + 1e-12 && max > R - 1e-5, 'giá trị lớn nhất');
  const cc = nn(-R, R), nghiem = Math.asin(cc / R) - phi; gan(a * Math.sin(nghiem) + b * Math.cos(nghiem), cc, 1e-9);
  gan(Math.sin(x) + Math.cos(x), Math.SQRT2 * Math.sin(x + Math.PI / 4)); gan(Math.sin(x) - Math.cos(x), Math.SQRT2 * Math.sin(x - Math.PI / 4));
}));
thu('nc', null, 'Công thức nhân ba', () => lap(20, () => {
  const a = nn(-1.4, 1.4), s = Math.sin, c = Math.cos, t = Math.tan;
  gan(s(3 * a), 3 * s(a) - 4 * s(a) ** 3); gan(c(3 * a), 4 * c(a) ** 3 - 3 * c(a));
  if (Math.abs(1 - 3 * t(a) ** 2) > 0.2 && Math.abs(c(3 * a)) > 0.1) gan(t(3 * a), (3 * t(a) - t(a) ** 3) / (1 - 3 * t(a) ** 2), 1e-8);
}));
thu('nc', null, 'Biểu diễn theo t = tan(x/2)', () => lap(20, () => {
  const x = nn(-3, 3), t = Math.tan(x / 2);
  gan(Math.sin(x), 2 * t / (1 + t * t)); gan(Math.cos(x), (1 - t * t) / (1 + t * t)); if (Math.abs(1 - t * t) > 0.1) gan(Math.tan(x), 2 * t / (1 - t * t), 1e-8);
}));
thu('nc', null, 'Tổng lũy thừa bậc bốn, bậc sáu của sin và cos', () => lap(20, () => {
  const x = nn(-6, 6), s = Math.sin(x), c = Math.cos(x), s2 = Math.sin(2 * x);
  gan(s ** 4 + c ** 4, 1 - s2 * s2 / 2); gan(s ** 6 + c ** 6, 1 - 3 * s2 * s2 / 4); gan((s + c) ** 2, 1 + s2); gan((s - c) ** 2, 1 - s2);
}));
thu('nc', null, 'Hệ thức lượng giác trong tam giác', () => lap(30, () => {
  const A_ = nn(0.1, 2.5), B = nn(0.1, Math.PI - A_ - 0.1), C_ = Math.PI - A_ - B, s = Math.sin, c = Math.cos, t = Math.tan;
  gan(s(2 * A_) + s(2 * B) + s(2 * C_), 4 * s(A_) * s(B) * s(C_), 1e-9);
  gan(c(A_) ** 2 + c(B) ** 2 + c(C_) ** 2 + 2 * c(A_) * c(B) * c(C_), 1, 1e-9);
  if ([A_, B, C_].every(g => Math.abs(g - Math.PI / 2) > 0.05)) gan(t(A_) + t(B) + t(C_), t(A_) * t(B) * t(C_), 1e-8);
}));
thu('nc', null, 'Độ dài đường trung tuyến', () => lap(20, () => {
  const P = tamGiacNN(), k = canhGoc(P), trung = (U, V) => nhan(0.5, cong(U, V));
  const ma = dai(tru(P[0], trung(P[1], P[2]))), mb = dai(tru(P[1], trung(P[2], P[0]))), mc = dai(tru(P[2], trung(P[0], P[1])));
  gan(ma * ma, (2 * k.b ** 2 + 2 * k.c ** 2 - k.a ** 2) / 4, 1e-9); gan(ma * ma + mb * mb + mc * mc, 0.75 * (k.a ** 2 + k.b ** 2 + k.c ** 2), 1e-9);
}));
thu('nc', null, 'Công thức hình chiếu', () => lap(20, () => {
  const k = canhGoc(tamGiacNN());
  gan(k.a, k.b * Math.cos(k.C) + k.c * Math.cos(k.B), 1e-9); gan(k.b, k.c * Math.cos(k.A) + k.a * Math.cos(k.C), 1e-9); gan(k.c, k.a * Math.cos(k.B) + k.b * Math.cos(k.A), 1e-9);
}));
thu('nc', null, 'Độ dài đường phân giác trong', () => lap(20, () => {
  const P = tamGiacNN(), k = canhGoc(P);
  // D là giao của tia phân giác góc A (hướng tổng hai vectơ đơn vị) với BC
  const e1 = nhan(1 / k.c, tru(P[1], P[0])), e2 = nhan(1 / k.b, tru(P[2], P[0])), w = cong(e1, e2);
  const BC = tru(P[2], P[1]), det = w[0] * (-BC[1]) - w[1] * (-BC[0]), r = tru(P[1], P[0]);
  const s = (r[0] * (-BC[1]) - r[1] * (-BC[0])) / det, D = cong(P[0], nhan(s, w));
  const la = dai(tru(D, P[0]));
  gan(la, 2 * k.b * k.c * Math.cos(k.A / 2) / (k.b + k.c), 1e-9);
  gan(la * la, k.b * k.c * ((k.b + k.c) ** 2 - k.a ** 2) / (k.b + k.c) ** 2, 1e-9);
  gan(dai(tru(D, P[1])) / dai(tru(D, P[2])), k.c / k.b, 1e-9);
}));
thu('nc', null, 'Bán kính nội tiếp theo nửa góc', () => {
  lap(20, () => {
    const P = tamGiacNN(), k = canhGoc(P), p = (k.a + k.b + k.c) / 2, S = dtTG(P), r = S / p;
    gan(r, (p - k.a) * Math.tan(k.A / 2), 1e-9);
    const I = [0, 1].map(t => (k.a * P[0][t] + k.b * P[1][t] + k.c * P[2][t]) / (2 * p));
    const AB = tru(P[1], P[0]), T = cong(P[0], nhan(vh(tru(I, P[0]), AB) / vh(AB, AB), AB)); // tiếp điểm trên AB
    gan(dai(tru(T, P[0])), p - k.a, 1e-9);
  });
  lap(10, () => { const b = nn(1, 5), c = nn(1, 5), a = Math.hypot(b, c), p = (a + b + c) / 2; gan(b * c / 2 / p, (b + c - a) / 2, 1e-9); gan(R_ngoai(a, b, c, b * c / 2), a / 2, 1e-9); });
});
thu('nc', null, 'Diện tích tam giác theo tọa độ đỉnh', () => lap(20, () => {
  const P = tamGiacNN(), k = canhGoc(P), p = (k.a + k.b + k.c) / 2;
  const [[x1, y1], [x2, y2], [x3, y3]] = P;
  gan(0.5 * Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)), Math.sqrt(p * (p - k.a) * (p - k.b) * (p - k.c)), 1e-8);
}));
thu('nc', null, 'Khoảng cách giữa hai đường thẳng song song', () => lap(20, () => {
  const a = nn(-5, 5), b = nn(1, 5), c1 = nn(-5, 5), c2 = nn(-5, 5), M = [0, -c1 / b];
  gan(Math.abs(a * M[0] + b * M[1] + c2) / Math.hypot(a, b), Math.abs(c1 - c2) / Math.hypot(a, b), 1e-9);
}));
thu('nc', null, 'Điểm đối xứng qua một đường thẳng', () => lap(20, () => {
  const a = nn(-5, 5), b = nn(-5, 5), c = nn(-5, 5), x0 = nn(-5, 5), y0 = nn(-5, 5), t = (a * x0 + b * y0 + c) / (a * a + b * b);
  const H = [x0 - a * t, y0 - b * t], M2 = [x0 - 2 * a * t, y0 - 2 * b * t];
  gan(a * H[0] + b * H[1] + c, 0, 1e-9); gan(vh(tru([x0, y0], H), [-b, a]), 0, 1e-9); // MH ⊥ chỉ phương
  gan((x0 + M2[0]) / 2, H[0]); gan((y0 + M2[1]) / 2, H[1]);
}));
thu('nc', null, 'Tâm sai, bán kính qua tiêu và đường chuẩn của elip', () => lap(20, () => {
  const b = nn(1, 3), a = b + nn(0.3, 3), c = Math.sqrt(a * a - b * b), e = c / a, t = nn(0, 6.28), x = a * Math.cos(t), M = [x, b * Math.sin(t)];
  const MF1 = dai(tru(M, [-c, 0])), MF2 = dai(tru(M, [c, 0]));
  gan(MF1, a + e * x, 1e-9); gan(MF2, a - e * x, 1e-9); gan(MF1 / Math.abs(x + a / e), e, 1e-9); gan(MF2 / Math.abs(x - a / e), e, 1e-9);
}));
thu('nc', null, 'Tâm sai, tiệm cận và bán kính qua tiêu của hypebol', () => lap(20, () => {
  const a = nn(1, 3), b = nn(1, 3), c = Math.sqrt(a * a + b * b), e = c / a, t = nn(-2, 2), s = ngauNhien() < 0.5 ? -1 : 1;
  const x = s * a * Math.cosh(t), M = [x, b * Math.sinh(t)];
  gan(dai(tru(M, [-c, 0])), Math.abs(a + e * x), 1e-9); gan(dai(tru(M, [c, 0])), Math.abs(a - e * x), 1e-9);
  const X = 1e6; gan(b * Math.sqrt(X * X / (a * a) - 1) - (b / a) * X, 0, 1e-5);
}));
thu('nc', null, 'Tiếp tuyến của conic', () => {
  // kiểm tra: M₀ thuộc đường thẳng, và đường thẳng chỉ chạm conic tại M₀ (nghiệm kép)
  const kep = (F, M0, n) => { const d = [-n[1], n[0]]; const g = s => F(M0[0] + s * d[0], M0[1] + s * d[1]); gan(g(0), 0, 1e-9); gan(dh(g, 0, 1e-4), 0, 1e-6); dung(Math.abs(dh2(g, 0)) > 1e-6, 'không suy biến'); };
  lap(10, () => {
    const a = nn(1, 4), b = nn(1, 4), t = nn(0, 6.28), M0 = [a * Math.cos(t), b * Math.sin(t)];
    kep((x, y) => x * x / (a * a) + y * y / (b * b) - 1, M0, [M0[0] / (a * a), M0[1] / (b * b)]);
    const A_ = nn(-3, 3), B = nn(-3, 3), Cc = Math.sqrt(A_ * A_ * a * a + B * B * b * b);
    // Ax + By + C = 0 với C² = A²a² + B²b²: phương trình hoành độ có Δ = 0
    if (Math.abs(B) > 0.3) { const p2 = 1 / (a * a) + A_ * A_ / (B * B * b * b), p1 = 2 * A_ * Cc / (B * B * b * b), p0 = Cc * Cc / (B * B * b * b) - 1; gan(p1 * p1 - 4 * p2 * p0, 0, 1e-9); }
  });
  lap(10, () => {
    const a = nn(1, 4), b = nn(1, 4), t = nn(-2, 2), M0 = [a * Math.cosh(t), b * Math.sinh(t)];
    kep((x, y) => x * x / (a * a) - y * y / (b * b) - 1, M0, [M0[0] / (a * a), -M0[1] / (b * b)]);
  });
  lap(10, () => {
    const p = nn(0.5, 4), y0 = nn(-4, 4), M0 = [y0 * y0 / (2 * p), y0];
    kep((x, y) => y * y - 2 * p * x, M0, [-p, y0]); // y₀y = p(x + x₀) ⇔ −p·x + y₀·y − p·x₀ = 0
  });
});
thu('nc', null, 'Tỉ số thể tích khối chóp tam giác', () => lap(20, () => {
  const S = diem3(), A_ = diem3(), B = diem3(), C_ = diem3(), x = nn(0.1, 2), y = nn(0.1, 2), z = nn(0.1, 2);
  const tia = (P, k) => cong(S, nhan(k, tru(P, S)));
  const V = theTichTuDien(S, A_, B, C_); if (V < 0.5) return;
  gan(theTichTuDien(S, tia(A_, x), tia(B, y), tia(C_, z)) / V, x * y * z, 1e-9);
}));
thu('nc', null, 'Mặt phẳng cắt hình chóp có đáy là hình bình hành', () => lap(30, () => {
  const S = [0, 0, nn(2, 6)], A_ = [nn(-4, -1), nn(-4, -1), 0], B = [nn(1, 4), nn(-4, -1), 0], D = [nn(-4, -1), nn(1, 4), 0], Cc = cong(B, tru(D, A_));
  const x = nn(1, 3), y = nn(1, 3), z = nn(1, 3);
  const M = cong(S, nhan(1 / x, tru(A_, S))), N = cong(S, nhan(1 / y, tru(B, S))), P = cong(S, nhan(1 / z, tru(Cc, S)));
  // giao của mặt phẳng (MNP) với SD
  const n = coHuong(tru(N, M), tru(P, M)), SD = tru(D, S), k = vh(n, tru(M, S)) / vh(n, SD); if (k <= 0.05 || k > 1) return;
  const Q = cong(S, nhan(k, SD)), t = 1 / k;
  gan(x + z, y + t, 1e-9);
  const V = theTichTuDien(S, M, N, P) + theTichTuDien(S, M, P, Q), V0 = 2 * theTichTuDien(S, A_, B, Cc);
  gan(V / V0, (x + y + z + t) / (4 * x * y * z * t), 1e-9);
}));
thu('nc', null, 'Tứ diện vuông và tứ diện đều', () => {
  lap(20, () => {
    const a = nn(1, 5), b = nn(1, 5), c = nn(1, 5), O = [0, 0, 0], A_ = [a, 0, 0], B = [0, b, 0], Cc = [0, 0, c];
    gan(theTichTuDien(O, A_, B, Cc), a * b * c / 6, 1e-12);
    const n = [1 / a, 1 / b, 1 / c], h = 1 / dai(n); // (ABC): x/a + y/b + z/c = 1
    gan(1 / h ** 2, 1 / a ** 2 + 1 / b ** 2 + 1 / c ** 2, 1e-12);
  });
  const P = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], a = dai(tru(P[0], P[1]));
  gan(theTichTuDien(...P), a ** 3 * Math.SQRT2 / 12, 1e-12);
  const n = coHuong(tru(P[1], P[0]), tru(P[2], P[0])); gan(Math.abs(vh(n, tru(P[3], P[0]))) / dai(n), a * Math.sqrt(6) / 3, 1e-12);
  gan(dai(tamCau(P)) === 0 ? dai(P[0]) : dai(tru(P[0], tamCau(P))), a * Math.sqrt(6) / 4, 1e-12);
});
thu('nc', null, 'Diện tích hình chiếu', () => lap(20, () => {
  const T = [diem3(), diem3(), diem3()], S = dai(coHuong(tru(T[1], T[0]), tru(T[2], T[0]))) / 2, n = coHuong(tru(T[1], T[0]), tru(T[2], T[0]));
  const Sp = dtTG(T.map(P => [P[0], P[1]])), cosPhi = Math.abs(n[2]) / dai(n); // chiếu xuống (Oxy)
  gan(Sp, S * cosPhi, 1e-9);
}));
thu('nc', null, 'Mặt cầu ngoại tiếp khi có cạnh vuông góc đáy', () => lap(20, () => {
  const P = tamGiacNN().map(p => [p[0], p[1], 0]), k = canhGoc(P), r = R_ngoai(k.a, k.b, k.c, dtTG(P)), h = nn(1, 6);
  const S = [P[0][0], P[0][1], h];
  const I = tamCau([S, ...P]); gan(dai(tru(I, S)), Math.sqrt(r * r + h * h / 4), 1e-9);
  const lt = P.map(p => [p[0], p[1], h]); // lăng trụ đứng: tâm cách đều 6 đỉnh
  const I2 = tamCau([P[0], P[1], P[2], lt[0]]); for (const Q of lt) gan(dai(tru(I2, Q)), Math.sqrt(r * r + h * h / 4), 1e-9);
  const a = nn(1, 4), b = nn(1, 4), c = nn(1, 4), I3 = tamCau([[0, 0, 0], [a, 0, 0], [0, b, 0], [0, 0, c]]);
  gan(dai(tru(I3, [a, b, c])), Math.sqrt(a * a + b * b + c * c) / 2, 1e-9);
}));
thu('nc', null, 'Mặt cầu ngoại tiếp hình chóp có các cạnh bên bằng nhau', () => lap(20, () => {
  const P = tamGiacNN().map(p => [p[0], p[1], 0]);
  const O = tamCau([P[0], P[1], P[2], [P[0][0], P[0][1], 1]]); // tâm đường tròn ngoại tiếp đáy nằm ở O[0], O[1]
  const h = nn(1, 6), S = [O[0], O[1], h], l = dai(tru(S, P[0]));
  gan(l, dai(tru(S, P[1])), 1e-9);
  gan(dai(tru(tamCau([S, ...P]), S)), l * l / (2 * h), 1e-9);
}));
thu('nc', null, 'Mặt cầu ngoại tiếp hình chóp có mặt bên vuông góc đáy', () => lap(20, () => {
  // đáy ABC trong (Oxy), mặt bên SAB nằm trong mặt phẳng y = 0 (vuông góc đáy), AB trên trục Ox
  const A_ = [nn(-4, -1), 0, 0], B = [nn(1, 4), 0, 0], Cc = [nn(-3, 3), nn(1, 5), 0], S = [nn(-3, 3), 0, nn(1, 5)];
  const R2 = (() => { const P = [A_, B, Cc].map(p => [p[0], p[1]]); const k = canhGoc(P); return R_ngoai(k.a, k.b, k.c, dtTG(P)); })();
  const R1 = (() => { const P = [A_, B, S].map(p => [p[0], p[2]]); const k = canhGoc(P); return R_ngoai(k.a, k.b, k.c, dtTG(P)); })();
  const m = dai(tru(A_, B)), R = dai(tru(tamCau([S, A_, B, Cc]), S));
  gan(R * R, R1 * R1 + R2 * R2 - m * m / 4, 1e-9);
}));
thu('nc', null, 'Diện tích tam giác, hình bình hành bằng tích có hướng', () => lap(20, () => {
  const A_ = diem3(), B = diem3(), Cc = diem3(), a = dai(tru(B, Cc)), b = dai(tru(Cc, A_)), c = dai(tru(A_, B)), p = (a + b + c) / 2;
  gan(dai(coHuong(tru(B, A_), tru(Cc, A_))) / 2, Math.sqrt(Math.max(0, p * (p - a) * (p - b) * (p - c))), 1e-7);
  const AB = tru(B, A_), AD = tru(Cc, A_), goc = Math.acos(vh(AB, AD) / (dai(AB) * dai(AD)));
  gan(dai(coHuong(AB, AD)), dai(AB) * dai(AD) * Math.sin(goc), 1e-9);
}));
thu('nc', null, 'Thể tích tứ diện, hình hộp bằng tích hỗn tạp', () => lap(20, () => {
  const A_ = diem3(), B = diem3(), Cc = diem3(), D = diem3(), n = coHuong(tru(B, A_), tru(Cc, A_));
  const day = dai(n) / 2, cao = Math.abs(vh(n, tru(D, A_))) / dai(n);
  gan(Math.abs(vh(n, tru(D, A_))) / 6, day * cao / 3, 1e-9);
  // hình hộp = 6 tứ diện (cách chia hình hộp thành 6 tứ diện cùng đường chéo AC′)
  const u = tru(B, A_), v = tru(Cc, A_), w = tru(D, A_), O = A_, X = (...k) => k.reduce((s, q) => cong(s, q), O);
  const C1 = X(u, v, w), dinh = [[X(u), X(u, v)], [X(u, v), X(v)], [X(v), X(v, w)], [X(v, w), X(w)], [X(w), X(u, w)], [X(u, w), X(u)]];
  gan(dinh.reduce((s, [P, Q]) => s + theTichTuDien(O, P, Q, C1), 0), Math.abs(vh(coHuong(u, v), w)), 1e-9);
  const c2 = cong(nhan(nn(-2, 2), u), nhan(nn(-2, 2), v)); gan(vh(coHuong(u, v), c2), 0, 1e-9);
}));
thu('nc', null, 'Khoảng cách từ điểm đến đường thẳng trong không gian', () => lap(20, () => {
  const A_ = diem3(), u = diem3(), M = diem3(), t = vh(tru(M, A_), u) / vh(u, u), H = cong(A_, nhan(t, u));
  let nho = Infinity; for (let s = t - 1; s <= t + 1; s += 1e-3) nho = Math.min(nho, dai(tru(M, cong(A_, nhan(s, u)))));
  gan(dai(coHuong(tru(M, A_), u)) / dai(u), dai(tru(M, H)), 1e-9); dung(nho >= dai(tru(M, H)) - 1e-12, 'H gần nhất');
}));
thu('nc', null, 'Khoảng cách giữa hai đường thẳng chéo nhau', () => lap(20, () => {
  const M1 = diem3(), u1 = diem3(), M2 = diem3(), u2 = diem3(), w = tru(M1, M2);
  // điểm gần nhau nhất: giải hệ 2 ẩn
  const a = vh(u1, u1), b = vh(u1, u2), c = vh(u2, u2), d = vh(u1, w), e = vh(u2, w), D = a * c - b * b; if (D < 1e-3) return;
  const s = (b * e - c * d) / D, t = (a * e - b * d) / D;
  const kc = dai(tru(cong(M1, nhan(s, u1)), cong(M2, nhan(t, u2)))), n = coHuong(u1, u2);
  gan(Math.abs(vh(n, tru(M2, M1))) / dai(n), kc, 1e-8);
}));
thu('nc', null, 'Hình chiếu và điểm đối xứng qua mặt phẳng', () => lap(20, () => {
  const n = diem3(), D = nn(-5, 5), M = diem3(), t = (vh(n, M) + D) / vh(n, n), H = tru(M, nhan(t, n)), M2 = tru(M, nhan(2 * t, n));
  gan(vh(n, H) + D, 0, 1e-9); gan(dai(coHuong(tru(M, H), n)), 0, 1e-9); [0, 1, 2].forEach(i => gan((M[i] + M2[i]) / 2, H[i], 1e-12));
}));
thu('nc', null, 'Giá trị nhỏ nhất của αMA² + βMB² trên mặt phẳng', () => lap(10, () => {
  const n = diem3(), D = nn(-5, 5), A_ = diem3(), B = diem3(), al = nn(-2, 4), be = nn(0.5, 4); if (al + be < 0.3) return;
  const I = nhan(1 / (al + be), cong(nhan(al, A_), nhan(be, B))), f = M => al * vh(tru(M, A_), tru(M, A_)) + be * vh(tru(M, B), tru(M, B));
  gan(vh(cong(nhan(al, tru(A_, I)), nhan(be, tru(B, I))), [1, 1, 1]), 0, 1e-9);
  const M = diem3(); gan(f(M), (al + be) * vh(tru(M, I), tru(M, I)) + al * vh(tru(A_, I), tru(A_, I)) + be * vh(tru(B, I), tru(B, I)), 1e-9);
  const t = (vh(n, I) + D) / vh(n, n), H = tru(I, nhan(t, n)), u = coHuong(n, [1, 0, 0]), v = coHuong(n, u);
  lap(300, () => { const P = cong(H, cong(nhan(nn(-5, 5), u), nhan(nn(-5, 5), v))); dung(f(P) >= f(H) - 1e-9, 'H nhỏ nhất'); });
}));
thu('nc', null, 'Nguyên hàm dạng f(ax + b)', () => lap(10, () => {
  const a = nn(0.5, 3) * (ngauNhien() < 0.5 ? -1 : 1), b = nn(-2, 2), al = nn(-3, 3), x = (nn(0.5, 2) - b) / a, u = a * x + b; // u > 0
  gan(dh(t => (a * t + b) ** (al + 1) / (a * (al + 1)), x), u ** al, 1e-6);
  gan(dh(t => Math.log(Math.abs(a * t + b)) / a, x), 1 / u, 1e-6);
  gan(dh(t => Math.exp(a * t + b) / a, x), Math.exp(u), 1e-6);
  gan(dh(t => -Math.cos(a * t + b) / a, x), Math.sin(u), 1e-6); gan(dh(t => Math.sin(a * t + b) / a, x), Math.cos(u), 1e-6);
}));
thu('nc', null, 'Nguyên hàm phân thức hay gặp', () => lap(10, () => {
  const al = nn(-3, 3), be = al + nn(0.5, 3), m = nn(0.5, 3), x = be + nn(0.2, 3);
  gan(dh(t => Math.log(Math.abs((t - al) / (t - be))) / (al - be), x), 1 / ((x - al) * (x - be)), 1e-6);
  const y = m + nn(0.2, 3); gan(dh(t => Math.log(Math.abs((t - m) / (t + m))) / (2 * m), y), 1 / (y * y - m * m), 1e-6);
  const z = nn(-m + 0.1, m - 0.1); gan(dh(t => Math.log(Math.abs((t - m) / (t + m))) / (2 * m), z), 1 / (z * z - m * m), 1e-6);
}));
thu('nc', null, 'Tích phân từng phần', () => {
  gan(simpson(Math.log, 1, 3), (3 * Math.log(3) - 3) - (0 - 1), 1e-10);
  gan(simpson(x => x * Math.exp(x), 0, 2), (2 - 1) * Math.exp(2) - (0 - 1) * 1, 1e-10);
  const u = x => x * x, up = x => 2 * x, v = Math.sin, vp = Math.cos; // ∫ u·v′ = [uv] − ∫ u′v
  gan(simpson(x => u(x) * vp(x), 0.3, 2.2), u(2.2) * v(2.2) - u(0.3) * v(0.3) - simpson(x => up(x) * v(x), 0.3, 2.2), 1e-10);
});
thu('nc', null, 'Tích phân hàm chẵn, hàm lẻ', () => lap(5, () => {
  const a = nn(0.5, 3), le = x => x ** 3 - 2 * Math.sin(x), chan = x => x * x + Math.cos(x), m = nn(0.3, 5);
  gan(simpson(le, -a, a), 0, 1e-10); gan(simpson(chan, -a, a), 2 * simpson(chan, 0, a), 1e-10);
  gan(simpson(x => chan(x) / (1 + m ** x), -a, a), simpson(chan, 0, a), 1e-10);
}));
thu('nc', null, 'Đổi biến x = a + b − x và hàm tuần hoàn', () => {
  const f = x => Math.exp(x) / (1 + x * x); gan(simpson(f, 1, 3), simpson(x => f(4 - x), 1, 3), 1e-10);
  const g = t => t * t + 1; gan(simpson(x => x * g(Math.sin(x)), 0, Math.PI), Math.PI / 2 * simpson(x => g(Math.sin(x)), 0, Math.PI), 1e-10);
  const h = x => Math.sin(x) ** 2 + Math.cos(3 * x), T = 2 * Math.PI, a = nn(-3, 3); gan(simpson(h, a, a + T), simpson(h, 0, T), 1e-10);
});
thu('nc', null, 'Diện tích giới hạn bởi parabol và đường thẳng', () => lap(10, () => {
  const a = nn(0.3, 3) * (ngauNhien() < 0.5 ? -1 : 1), x1 = nn(-4, 1), x2 = x1 + nn(0.5, 4), f = x => a * (x - x1) * (x - x2);
  gan(simpson(x => Math.abs(f(x)), x1, x2), Math.abs(a) * (x2 - x1) ** 3 / 6, 1e-9);
  const b = -a * (x1 + x2), c = a * x1 * x2, D = b * b - 4 * a * c; gan(D * Math.sqrt(D) / (6 * a * a), Math.abs(a) * (x2 - x1) ** 3 / 6, 1e-9);
}));
thu('nc', null, 'Thể tích khối tròn xoay mở rộng', () => {
  // ống trụ rỗng: f = 2, g = 1 trên [0; 3] (cùng dương và cùng âm) cho 9π
  gan(Math.PI * simpson(x => Math.abs(4 - 1), 0, 3), 9 * Math.PI, 1e-12); gan(Math.PI * simpson(x => Math.abs((-2) ** 2 - (-1) ** 2), 0, 3), 9 * Math.PI, 1e-12);
  // quay quanh Oy: x = √y, 0 ≤ y ≤ 4; so với phương pháp vỏ trụ 2π∫₀² x(4 − x²)dx = 8π
  gan(Math.PI * simpson(y => y, 0, 4), 2 * Math.PI * simpson(x => x * (4 - x * x), 0, 2), 1e-10); gan(Math.PI * simpson(y => y, 0, 4), 8 * Math.PI, 1e-10);
  lap(5, () => {
    const a = nn(1, 4), b = nn(1, 4), y = x => b * Math.sqrt(Math.max(0, 1 - x * x / (a * a)));
    gan(2 * simpson(y, -a, a, 200000), Math.PI * a * b, 1e-6); gan(Math.PI * simpson(x => y(x) ** 2, -a, a), 4 / 3 * Math.PI * a * b * b, 1e-9);
  });
});
thu('nc', null, 'Bất đẳng thức AM–GM (Cô-si)', () => lap(200, () => {
  const a = nn(0, 9), b = nn(0, 9), c = nn(0, 9); dung((a + b) / 2 >= Math.sqrt(a * b) - 1e-12); dung((a + b + c) / 3 >= Math.cbrt(a * b * c) - 1e-12); dung(a * b <= (a + b) ** 2 / 4 + 1e-12);
  gan((a + a) / 2, Math.sqrt(a * a)); gan((a + a + a) / 3, Math.cbrt(a ** 3));
}));
thu('nc', null, 'Bất đẳng thức Cauchy–Schwarz (Bu-nhi-a-cốp-xki)', () => lap(200, () => {
  const a = diem3(), b = diem3(); dung(vh(a, b) ** 2 <= vh(a, a) * vh(b, b) + 1e-9);
  dung((a[0] * b[0] + a[1] * b[1]) ** 2 <= (a[0] ** 2 + a[1] ** 2) * (b[0] ** 2 + b[1] ** 2) + 1e-9);
  const k = nn(-3, 3), c = nhan(k, a); gan(vh(a, c) ** 2, vh(a, a) * vh(c, c), 1e-9);
}));
thu('nc', null, 'Bất đẳng thức cộng mẫu (Engel)', () => lap(200, () => {
  const a = nn(-5, 5), b = nn(-5, 5), c = nn(-5, 5), x = nn(0.1, 5), y = nn(0.1, 5), z = nn(0.1, 5);
  dung(a * a / x + b * b / y >= (a + b) ** 2 / (x + y) - 1e-9); dung(a * a / x + b * b / y + c * c / z >= (a + b + c) ** 2 / (x + y + z) - 1e-9); dung(1 / x + 1 / y >= 4 / (x + y) - 1e-12);
  gan(a * a / x + (a * y / x) ** 2 / y, (a + a * y / x) ** 2 / (x + y), 1e-9); // dấu bằng khi a/x = b/y
}));
thu('nc', null, 'Một số bất đẳng thức hay dùng', () => lap(200, () => {
  const a = nn(-5, 5), b = nn(-5, 5), c = nn(-5, 5), x = nn(-1, 3), n = nguyen(1, 12);
  dung(a * a + b * b >= 2 * a * b - 1e-12); dung((a + b) ** 2 >= 4 * a * b - 1e-12); dung(a * a + b * b + c * c >= a * b + b * c + c * a - 1e-12);
  dung((a + b + c) ** 2 >= 3 * (a * b + b * c + c * a) - 1e-9); dung(Math.abs(a) + Math.abs(b) >= Math.abs(a + b) - 1e-12);
  dung((Math.abs(a) + Math.abs(b) - Math.abs(a + b) < 1e-12) === (a * b >= 0), 'dấu bằng |a| + |b|'); dung((1 + x) ** n >= 1 + n * x - 1e-12, 'Bernoulli');
}));
thu('nc', null, 'Tổng các lũy thừa', () => { let s1 = 0, s2 = 0, s3 = 0, sl = 0, sp = 0; for (let n = 1; n <= 60; n++) { s1 += n; s2 += n * n; s3 += n ** 3; sl += 2 * n - 1; sp += 1 / (n * (n + 1)); gan(s1, n * (n + 1) / 2); gan(s2, n * (n + 1) * (2 * n + 1) / 6); gan(s3, (n * (n + 1) / 2) ** 2); gan(sl, n * n); gan(sp, n / (n + 1), 1e-12); } });
thu('nc', null, 'Dãy truy hồi uₙ₊₁ = a·uₙ + b', () => lap(10, () => {
  const a = nn(-2, 2), b = nn(-5, 5), u1 = nn(-5, 5); if (Math.abs(a - 1) < 0.1) return; const c = b / (1 - a); let u = u1;
  for (let n = 1; n <= 15; n++) { gan(u, (u1 - c) * a ** (n - 1) + c, 1e-9); u = a * u + b; }
}));
thu('nc', null, 'Lãi kép nhiều kì trong năm và lãi kép liên tục', () => lap(5, () => {
  const A_ = nn(10, 500), r = nn(0.01, 0.12), m = nguyen(2, 12), n = nguyen(1, 10); let T = A_;
  for (let i = 0; i < m * n; i++) T += T * r / m; gan(T, A_ * (1 + r / m) ** (m * n), 1e-10);
  const M = 1e7; gan(A_ * (1 + r / M) ** (M * n), A_ * Math.exp(r * n), 1e-6);
  const B = A_ * nn(1.1, 4); let k = 0, V = A_; while (V < B) { V *= 1 + r; k++; } gan(k, Math.ceil(Math.log(B / A_) / Math.log(1 + r)));
}));
thu('nc', null, 'Gửi tiền đều đặn mỗi kì', () => lap(10, () => {
  const a = nn(1, 10), r = nn(0.002, 0.03), n = nguyen(1, 60); let dau = 0, cuoi = 0;
  for (let i = 1; i <= n; i++) { dau = (dau + a) * (1 + r); cuoi = cuoi * (1 + r) + a; }
  gan(dau, a * (1 + r) * ((1 + r) ** n - 1) / r, 1e-10); gan(cuoi, a * ((1 + r) ** n - 1) / r, 1e-10);
}));
thu('nc', null, 'Vay trả góp', () => lap(10, () => {
  const A_ = nn(50, 500), r = nn(0.002, 0.03), n = nguyen(2, 60), a = nn(1, 10); let no = A_;
  for (let i = 1; i <= n; i++) no = no * (1 + r) - a; gan(no, A_ * (1 + r) ** n - a * ((1 + r) ** n - 1) / r, 1e-9);
  const tra = A_ * r * (1 + r) ** n / ((1 + r) ** n - 1); let no2 = A_; for (let i = 1; i <= n; i++) no2 = no2 * (1 + r) - tra; gan(no2, 0, 1e-9);
}));
thu('nc', null, 'Tăng trưởng mũ và phân rã phóng xạ', () => lap(5, () => {
  const N0 = nn(1, 100), r = nn(-0.5, 0.5), t = nn(0, 5), N = s => N0 * Math.exp(r * s); gan(dh(N, t), r * N(t), 1e-7);
  const T = nn(1, 50), m0 = nn(1, 100), m = s => m0 * 0.5 ** (s / T); gan(m(T), m0 / 2, 1e-12); gan(m(3 * T), m0 / 8, 1e-12);
  const rr = Math.abs(r) + 0.01; gan(N0 * Math.exp(rr * Math.log(2) / rr), 2 * N0, 1e-12);
}));
thu('nc', null, 'Nhị thức Newton tổng quát', () => lap(10, () => {
  const a = nn(-2, 2), b = nn(-2, 2), n = nguyen(1, 12); let s = 0; for (let k = 0; k <= n; k++) s += C(n, k) * a ** (n - k) * b ** k;
  gan(s, (a + b) ** n, 1e-9); for (let k = 0; k <= n; k++) gan(C(n, k), C(n, n - k));
}));
thu('nc', null, 'Tổng các số tổ hợp', () => { for (let n = 1; n <= 20; n++) { let t = 0, d = 0, ch = 0, le = 0, k1 = 0; for (let k = 0; k <= n; k++) { t += C(n, k); d += (-1) ** k * C(n, k); if (k % 2) le += C(n, k); else ch += C(n, k); k1 += k * C(n, k); } gan(t, 2 ** n); gan(d, 0); gan(ch, 2 ** (n - 1)); gan(le, 2 ** (n - 1)); gan(k1, n * 2 ** (n - 1)); } });
thu('nc', null, 'Chia kẹo Euler', () => {
  const dem = (n, k, min) => { if (k === 1) return n >= min ? 1 : 0; let s = 0; for (let x = min; x <= n; x++) s += dem(n - x, k - 1, min); return s; };
  for (let n = 1; n <= 12; n++) for (let k = 1; k <= 5; k++) { if (n >= k) gan(dem(n, k, 1), C(n - 1, k - 1)); gan(dem(n, k, 0), C(n + k - 1, k - 1)); }
});
thu('nc', null, 'Hoán vị vòng quanh và hoán vị lặp', () => {
  const hoanVi = arr => arr.length <= 1 ? [arr] : arr.flatMap((x, i) => hoanVi([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [x, ...p]));
  for (let n = 2; n <= 6; n++) {
    const lop = new Set(hoanVi([...Array(n).keys()]).map(p => { const i = p.indexOf(0); return [...p.slice(i), ...p.slice(0, i)].join(','); }));
    gan(lop.size, giaiThua(n - 1));
  }
  const tu = 'AABBBCD'.split(''), kq = new Set(hoanVi(tu).map(p => p.join(''))); gan(kq.size, giaiThua(7) / (giaiThua(2) * giaiThua(3)));
});
thu('nc', null, 'Chọn các số không liên tiếp', () => {
  for (let n = 1; n <= 14; n++) for (let k = 1; 2 * k - 1 <= n; k++) {
    let dem = 0; for (let m = 0; m < 1 << n; m++) { let c = 0, x = m; while (x) { c += x & 1; x >>= 1; } if (c === k && !(m & (m >> 1))) dem++; }
    gan(dem, C(n - k + 1, k));
  }
});
thu('nc', null, 'Phép thử lặp Bernoulli', () => lap(5, () => {
  const n = nguyen(1, 10), p = nn(0, 1), P = new Array(n + 1).fill(0);
  for (let m = 0; m < 1 << n; m++) { let k = 0, pr = 1; for (let i = 0; i < n; i++) { if (m >> i & 1) { k++; pr *= p; } else pr *= 1 - p; } P[k] += pr; }
  for (let k = 0; k <= n; k++) gan(P[k], C(n, k) * p ** k * (1 - p) ** (n - k), 1e-12);
  gan(1 - P[0], 1 - (1 - p) ** n, 1e-12);
}));
thu('nc', null, 'Xác suất toàn phần và Bayes với nhiều trường hợp', () => lap(10, () => {
  const k = nguyen(2, 6), w = Array.from({ length: k }, () => nn(0.1, 1)), tong = w.reduce((s, x) => s + x), pB = w.map(x => x / tong), pAB = pB.map(() => nn(0, 1));
  // bảng đồng thời: P(Bᵢ ∩ A) = P(Bᵢ)·P(A | Bᵢ); cộng theo i ra P(A)
  const giao = pB.map((x, i) => x * pAB[i]), pA = giao.reduce((s, x) => s + x);
  gan(pA, pB.reduce((s, x, i) => s + x * pAB[i], 0), 1e-12);
  const hau = giao.map(x => x / pA); gan(hau.reduce((s, x) => s + x), 1, 1e-12); hau.forEach((x, i) => gan(x, pB[i] * pAB[i] / pA, 1e-12));
}));

// chạy phép thử
const timMuc = (loai, ch, ten) => loai === 'cb'
  ? (CT.cb.find(c => c.ch === ch) || { muc: [] }).muc.some(m => m.ten === ten)
  : CT.nc.some(cd => cd.muc.some(m => m.ten === ten));
const daThu = new Set();
let datPhep = 0;
for (const p of phepThu) {
  const nhan_ = `${p.loai}${p.ch ? ' ' + p.ch : ''} › ${p.tenMuc}`;
  if (!timMuc(p.loai, p.ch, p.tenMuc)) { bao(`phép thử trỏ tới mục không tồn tại: ${nhan_}`); continue; }
  try { p.fn(); datPhep++; daThu.add(p.loai + '|' + p.tenMuc); }
  catch (e) { bao(`THỬ SỐ SAI ${nhan_}: ${e.message}`); }
}
const ncChuaThu = [];
for (const cd of CT.nc) for (const m of cd.muc) if (!daThu.has('nc|' + m.ten)) ncChuaThu.push(m.ten);
for (const t of ncChuaThu) bao(`mục nâng cao chưa có phép thử số: ${t}`);

// ───────────────────────── Báo cáo ─────────────────────────
console.log('Kiểm tra web/congthuc.js');
console.log(`  cb: ${tk.cbCh}/${chuong.length} chương, ${tk.cbMuc} mục, ${tk.cbCt} công thức`);
console.log(`  nc: ${tk.ncCd} chủ đề, ${tk.ncMuc} mục, ${tk.ncCt} công thức`);
console.log(`  phép thử số: ${datPhep}/${phepThu.length} nhóm đạt, ${soPhep} phép so sánh`);
console.log(`  mục cb có phép thử: ${[...daThu].filter(x => x.startsWith('cb|')).length}; mục nc có phép thử: ${[...daThu].filter(x => x.startsWith('nc|')).length}/${tk.ncMuc}`);
if (process.argv.includes('--kitu')) console.log('  ký tự ngoài ASCII (không phải chữ):', [...kiTuLa.keys()].sort().join(' '));
if (loi.length) {
  console.log(`\nCÓ ${loi.length} LỖI:`);
  for (const m of loi) console.log('  - ' + m);
  process.exit(1);
}
console.log('\nKẾT QUẢ: ĐẠT');
