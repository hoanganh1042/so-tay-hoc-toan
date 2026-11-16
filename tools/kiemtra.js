// Kiểm tra lời giải: đủ khóa cho mọi câu và bước cuối khớp đáp án. Chạy: node tools/kiemtra.js [tiền tố]
const path = require('path'); const R = p => require(path.join(__dirname, '..', 'web', p));
global.window = {};
['data.js', 'data_them.js', 'dethi_them.js', 'mucdo.js', 'dethi_mucdo.js', 'thucte.js', 'chuong.js', 'bosung.js'].forEach(R);
Object.entries(window.KHKT_EX_ADD || {}).forEach(([id, add]) => { for (const g of [10, 11, 12]) for (const c of window.KHKT_DATA[g]) for (const l of c.lessons) if (l.id === id) l.ex.push(...add); });
['loigiai_10.js', 'loigiai_11.js', 'loigiai_12.js', 'loigiai_dethi.js'].forEach(f => { try { R(f); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; } });
const LG = window.KHKT_LG || {}, pre = process.argv[2] || '';
const items = [];
for (const g of [10, 11, 12]) for (const c of window.KHKT_DATA[g]) for (const l of c.lessons) { items.push([l.id + '#d', l.d]); l.ex.forEach((e, i) => items.push([l.id + '#' + i, e])); }
for (const s of window.KHKT_EXAM) s.items.concat(window.KHKT_EXAM_ADD[s.id] || [], (window.KHKT_EXAM_LV || {})[s.id] || []).forEach((e, i) => items.push([s.id + '#' + i, e]));
const want = e => e.t === 'mc' ? 'Đáp án: ' + e.o[e.a] : e.t === 'sa' ? 'Đáp án: ' + e.a : 'Kết luận: ' + e.s.map((x, i) => 'abcd'[i] + ' ' + (x[1] ? 'Đúng' : 'Sai')).join(', ') + '.';
let miss = [], bad = [], ok = 0;
for (const [k, e] of items) {
  if (!k.startsWith(pre)) continue;
  const s = LG[k];
  if (!s) { miss.push(k); continue; }
  const last = s.b[s.b.length - 1];
  if (!s.h || !s.y.length || s.b.length < 2) bad.push(k + ': thiếu phần');
  else if (last !== want(e)) bad.push(k + ': bước cuối "' + last + '" ≠ "' + want(e) + '"');
  else ok++;
}
const extra = Object.keys(LG).filter(k => !items.some(([x]) => x === k));
console.log('đúng', ok, '| thiếu', miss.length, '| lỗi', bad.length, '| khóa thừa', extra.length);
if (bad.length) console.log(bad.join('\n'));
if (extra.length) console.log('thừa:', extra.join(' '));
if (process.argv[3] === 'v') console.log('thiếu:', miss.join(' '));
