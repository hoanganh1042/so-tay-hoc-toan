// Kiểm thử ngân hàng nội dung: cấu trúc câu hỏi, lời giải, hình minh họa và bảng công thức.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadData, allItems } = require('./helpers.js');

const w = loadData();
const { lessons, items } = allItems(w);
const keys = new Set(items.map(([k]) => k));
const chapters = new Set([10, 11, 12].flatMap(g => w.KHKT_DATA[g].map(c => c.id)));

test('mã chương và mã bài học là duy nhất, đúng khuôn', () => {
  const ids = [10, 11, 12].flatMap(g => w.KHKT_DATA[g].flatMap(c => [c.id, ...c.lessons.map(l => l.id)]));
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[A-Za-z0-9-]{1,32}$/);
});

test('mỗi bài học có yêu cầu cần đạt, kiến thức cần nhớ, 1 câu chẩn đoán và bài tập', () => {
  for (const l of Object.values(lessons)) {
    assert.ok(Array.isArray(l.ycc) && l.ycc.length, l.id + ': thiếu yêu cầu cần đạt');
    assert.ok(Array.isArray(l.kt) && l.kt.length, l.id + ': thiếu kiến thức cần nhớ');
    assert.equal(l.d.t, 'mc', l.id + ': câu chẩn đoán phải là trắc nghiệm');
    assert.ok(l.ex.length >= 3, l.id + ': quá ít bài tập');
  }
});

test('mọi câu hỏi đúng cấu trúc theo kiểu câu', () => {
  for (const [k, e] of items) {
    assert.ok(typeof e.q === 'string' && e.q.trim(), k + ': thiếu đề bài');
    if (e.t === 'mc') {
      assert.equal(e.o.length, 4, k + ': cần 4 lựa chọn');
      assert.equal(new Set(e.o).size, 4, k + ': lựa chọn bị trùng');
      assert.ok(Number.isInteger(e.a) && e.a >= 0 && e.a < 4, k + ': đáp án ngoài phạm vi');
    } else if (e.t === 'tf') {
      assert.equal(e.s.length, 4, k + ': cần 4 ý đúng/sai');
      for (const s of e.s) assert.ok(typeof s[0] === 'string' && typeof s[1] === 'boolean', k + ': ý đúng/sai sai cấu trúc');
    } else if (e.t === 'sa') {
      assert.ok(typeof e.a === 'string' && e.a.trim(), k + ': thiếu đáp án');
      assert.match(e.a, /^−?\d+(,\d+)?$/, k + ': đáp án trả lời ngắn phải là số kiểu Việt Nam');
    } else assert.fail(k + ': kiểu câu lạ ' + e.t);
    if (e.m !== undefined) assert.ok(['N', 'T', 'V', 'TF'].includes(e.m), k + ': mức độ lạ ' + e.m);
  }
});

test('mọi câu đều có lời giải ba lớp và bước cuối khớp đáp án', () => {
  const LG = w.KHKT_LG;
  const want = e => e.t === 'mc' ? 'Đáp án: ' + e.o[e.a] : e.t === 'sa' ? 'Đáp án: ' + e.a : 'Kết luận: ' + e.s.map((x, i) => 'abcd'[i] + ' ' + (x[1] ? 'Đúng' : 'Sai')).join(', ') + '.';
  const bad = [];
  for (const [k, e] of items) {
    const s = LG[k];
    if (!s) bad.push(k + ': thiếu lời giải');
    else if (!s.h || !s.y.length || s.b.length < 2) bad.push(k + ': lời giải thiếu phần');
    else if (s.b[s.b.length - 1] !== want(e)) bad.push(k + ': bước cuối không khớp đáp án');
  }
  assert.deepEqual(bad, []);
  assert.deepEqual(Object.keys(LG).filter(k => !keys.has(k)), [], 'có lời giải không thuộc câu nào');
});

test('hình minh họa gắn với câu có thật và là SVG không chứa mã chạy được', () => {
  for (const [k, svg] of Object.entries(w.KHKT_HINH)) {
    assert.ok(keys.has(k), k + ': hình không gắn với câu nào');
    assert.ok(svg.startsWith('<svg'), k + ': không phải SVG');
    assert.doesNotMatch(svg, /<script|javascript:|\son[a-z]+\s*=|<foreignObject|<iframe|href\s*=/i, k + ': hình chứa nội dung không an toàn');
    // Thuộc tính style duy nhất được phép là biến độ rộng hiển thị ở thẻ gốc, ví dụ style="--fw:168px".
    assert.doesNotMatch(svg.replace(/^<svg([^>]*?) style="--fw:\d+(\.\d+)?px"/, '<svg$1'), /\sstyle\s*=/i, k + ': hình không được dùng thuộc tính style');
  }
});

test('đề thi: mỗi vị trí câu có đủ câu dự trữ', () => {
  for (const s of w.KHKT_EXAM) {
    const n = s.items.length + ((w.KHKT_EXAM_ADD || {})[s.id] || []).length + ((w.KHKT_EXAM_LV || {})[s.id] || []).length;
    assert.ok(n >= 2, s.id + ': cần ít nhất 2 câu để đề không lặp');
  }
});

test('bảng công thức: đủ chương, đúng cấu trúc, chỉ là văn bản thuần', () => {
  const CT = w.KHKT_CT;
  assert.ok(CT && Array.isArray(CT.cb) && Array.isArray(CT.nc));
  const seen = new Set();
  const checkItems = (c, where) => {
    assert.ok(typeof c.ten === 'string' && c.ten.trim(), where + ': thiếu tên');
    assert.ok(Array.isArray(c.muc) && c.muc.length, where + ': không có mục nào');
    for (const m of c.muc) {
      assert.ok(typeof m.ten === 'string' && m.ten.trim(), where + ': mục thiếu tên');
      assert.ok(Array.isArray(m.ct) && m.ct.length, where + ' / ' + m.ten + ': không có công thức');
      for (const f of m.ct.concat(m.dk || [], m.gc || [])) {
        assert.equal(typeof f, 'string');
        assert.doesNotMatch(f, /\\[a-zA-Z]+|\$|<\/?[a-z]/, where + ' / ' + m.ten + ': có LaTeX hoặc thẻ HTML: ' + f);
      }
    }
  };
  for (const c of CT.cb) {
    assert.ok([10, 11, 12].includes(c.g), c.ten + ': lớp không hợp lệ');
    assert.ok(chapters.has(c.ch), c.ten + ': mã chương không tồn tại: ' + c.ch);
    assert.ok(c.ch.startsWith(c.g + '-'), c.ten + ': lớp không khớp mã chương');
    assert.ok(!seen.has(c.ch), c.ch + ': chương bị lặp'); seen.add(c.ch);
    checkItems(c, c.ch);
  }
  assert.deepEqual([...chapters].filter(id => !seen.has(id)), [], 'chương chưa có công thức');
  for (const c of CT.nc) {
    checkItems(c, 'Nâng cao: ' + c.ten);
    for (const m of c.muc) assert.ok(m.dk || m.gc, 'Nâng cao / ' + m.ten + ': cần nêu điều kiện hoặc ghi chú áp dụng');
  }
});
