// Kiểm thử hàm làm sạch dữ liệu của lớp lưu trữ (web/db.js): dữ liệu đọc từ máy hoặc từ tệp sao lưu
// không được tin, nên mọi trường lạ, sai kiểu hoặc sai khuôn khóa phải bị loại.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitize, sanitizeEvent } = require('../web/db.js');

const GOOD = {
  grade: 12, done: ['12-I', '12-II'], found: true, h: { tuhoc: 1, hoi: [0, 2] }, ans: { '12-I-1': 0 },
  result: { grade: 12, chapters: ['12-I'], lessons: { '12-I-1': false }, h: { tuhoc: 1 }, date: '16/11/2026' },
  prac: { '12-I-1#0': { ok: true, hint: false, at: 1700000000000 } }, rv: { '12-I-1#1': { box: 1, due: 1700000000000 } },
  errT: { '12-I-1#1': { t: 2, at: 1700000000000 } },
  hist: [{ at: 1700000000000, mode: 'tn', total: 6.25, p1: 2.5, p2: 2.25, p3: 1.5, weak: ['Hàm số'] }],
  target: 8, book: 'ctst',
  exam: { mode: 'mt', target: 8, seed: 12345, k: [['I-1#0'], ['II-1#2@II-2'], ['III-1#0']], ans: { p10: 2, p20: { 0: 1, 3: 0 }, p30: '3,5' }, submitted: false, start: 1700000000000 }
};

test('dữ liệu hợp lệ được giữ nguyên', () => {
  const s = sanitize(GOOD);
  assert.equal(s.grade, 12);
  assert.deepEqual(s.done, ['12-I', '12-II']);
  assert.deepEqual(s.h, { tuhoc: 1, hoi: [0, 2] });
  assert.deepEqual(s.prac, GOOD.prac);
  assert.deepEqual(s.rv, GOOD.rv);
  assert.deepEqual(s.result.lessons, { '12-I-1': false });
  assert.equal(s.result.date, '16/11/2026');
  assert.equal(s.hist[0].total, 6.25);
  assert.equal(s.book, 'ctst');
  assert.deepEqual(s.exam.k, GOOD.exam.k);
  assert.deepEqual(s.exam.ans, { p10: 2, p20: { 0: 1, 3: 0 }, p30: '3,5' });
});

test('đầu vào không phải đối tượng trả về null', () => {
  for (const v of [null, undefined, 5, 'x', [], true]) assert.equal(sanitize(v), null);
});

test('giá trị thiếu nhận mặc định an toàn', () => {
  const s = sanitize({});
  assert.equal(s.grade, 11); assert.equal(s.done, null); assert.equal(s.found, true); assert.equal(s.target, 7); assert.equal(s.book, 'kntt');
  assert.deepEqual(s.prac, {}); assert.deepEqual(s.hist, []); assert.equal(s.result, null); assert.equal(s.exam, null);
});

test('khóa chứa mã HTML hoặc khóa nguyên mẫu bị loại', () => {
  const dirty = JSON.parse(JSON.stringify(GOOD));
  dirty.prac['<img src=x onerror=alert(1)>#0'] = { ok: true, at: 1 };
  dirty.prac['12-I-1#0"><script>'] = { ok: true, at: 1 };
  dirty.rv = JSON.parse('{"__proto__": {"box": 1, "due": 1}, "constructor": {"box": 1, "due": 1}, "12-I-1#1": {"box": 1, "due": 5}}');
  dirty.ans = JSON.parse('{"__proto__": 1, "12-I-1": 2}');
  dirty.h = JSON.parse('{"constructor": 1, "tuhoc": 2}');
  const s = sanitize(dirty);
  assert.deepEqual(Object.keys(s.prac), ['12-I-1#0']);
  assert.deepEqual(Object.keys(s.rv), ['12-I-1#1']);
  assert.deepEqual(s.ans, { '12-I-1': 2 });
  assert.deepEqual(s.h, { tuhoc: 2 });
  assert.equal(Object.getPrototypeOf(s.rv), Object.prototype);
  assert.equal({}.box, undefined, 'Object.prototype không bị sửa');
});

test('chuỗi và số ngoài khuôn bị thay bằng mặc định', () => {
  const s = sanitize({ ...GOOD, grade: '12', book: '<script>', target: 1e9, done: ['12-I', '<b>', 7, 'a b'],
    result: { ...GOOD.result, date: '<b>x</b>', chapters: ['12-I', '"><svg>'] },
    hist: [{ at: 5, mode: '<i>', total: 999, p1: -4, weak: ['<u>yếu</u>', 7] }, { at: 'x' }, null] });
  assert.equal(s.grade, 11); assert.equal(s.book, 'kntt'); assert.equal(s.target, 7);
  assert.deepEqual(s.done, ['12-I']);
  assert.equal(s.result.date, ''); assert.deepEqual(s.result.chapters, ['12-I']);
  assert.equal(s.hist.length, 1);
  assert.equal(s.hist[0].mode, 'tn'); assert.equal(s.hist[0].total, 0); assert.equal(s.hist[0].p1, 0);
  assert.deepEqual(s.hist[0].weak, ['uyếu/u']);
});

test('đề đang làm: tham chiếu câu và đáp án sai khuôn bị loại', () => {
  const s = sanitize({ ...GOOD, exam: { ...GOOD.exam, k: [['I-1#0', '<x>#1', 5], ['II-1#2@II-2'], []], ans: { p10: 2, p11: 99, p99x: 1, p20: { 0: 1, 9: 1, a: 1 }, p30: 'x'.repeat(500), evil: '<b>' } } });
  assert.deepEqual(s.exam.k[0], ['I-1#0']);
  assert.deepEqual(Object.keys(s.exam.ans).sort(), ['p10', 'p20', 'p30']);
  assert.deepEqual(s.exam.ans.p20, { 0: 1 });
  assert.equal(s.exam.ans.p30.length, 40);
  assert.equal(sanitize({ ...GOOD, exam: { k: 'x' } }).exam, null);
});

test('kết quả kiểu cũ (true/false) được chuyển sang dạng mới', () => {
  assert.deepEqual(sanitize({ prac: { '11-I-1#0': true } }).prac, { '11-I-1#0': { ok: true, hint: false, at: 0 } });
});

test('lịch sử nộp đề chỉ giữ 30 lần gần nhất', () => {
  const hist = Array.from({ length: 50 }, (_, i) => ({ at: 1000 + i, mode: 'tn', total: 5 }));
  const s = sanitize({ hist });
  assert.equal(s.hist.length, 30); assert.equal(s.hist[0].at, 1020);
});

test('nhật ký hoạt động: chỉ giữ trường đã biết', () => {
  assert.deepEqual(sanitizeEvent({ at: 10, type: 'practice', key: '11-I-1#0', ok: true, hint: false, extra: '<b>' }), { at: 10, type: 'practice', key: '11-I-1#0', ok: true, hint: undefined, n: undefined, score: undefined, mode: undefined });
  assert.equal(sanitizeEvent({ at: 10, type: '<script>' }), undefined);
  assert.equal(sanitizeEvent({ type: 'exam' }), undefined);
  assert.equal(sanitizeEvent(null), undefined);
});
