// Kiểm thử bộ dựng phân số đứng và dấu căn (web/phanso.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { frac } = require(path.join(__dirname, '..', 'web', 'phanso.js'));

// Viết gọn kết quả: ⟦tử│mẫu⟧ cho phân số, √⟨…⟩ cho căn.
const plain = h => h
  .replace(/<span class="fr"><span class="fr-n">/g, '⟦')
  .replace(/<\/span><span class="fr-s">\/<\/span><span class="fr-d">/g, '│')
  .replace(/<span class="rt"><span class="rt-s">(.)<\/span><span class="rt-b">/g, '$1⟨')
  .replace(/<span class="fr-s">[()]<\/span>/g, '')
  .replace(/<\/span><\/span>/g, '⟩')
  .replace(/│([^⟦⟩]*)⟩/g, '│$1⟧');

test('đọc đúng tử và mẫu', () => {
  assert.equal(plain(frac('tan α = sin α/cos α')), 'tan α = ⟦sin α│cos α⟧');
  assert.equal(plain(frac('(a + b)/2')), '⟦a + b│2⟧');
  assert.equal(plain(frac('1/(x + 1)')), '⟦1│x + 1⟧');
  assert.equal(plain(frac('1 + tan²α = 1/cos²α')), '1 + tan²α = ⟦1│cos²α⟧');
  assert.equal(plain(frac('x ∈ [π/3; 5π/3]')), 'x ∈ [⟦π│3⟧; ⟦5π│3⟧]');
  assert.equal(plain(frac('d = |AC × u|/|u|')), 'd = ⟦|AC × u|│|u|⟧');
});

test('dấu căn phủ hết biểu thức dưới căn', () => {
  assert.equal(plain(frac('|a| = √(a₁² + a₂²)')), '|a| = √⟨a₁² + a₂²⟩');
  assert.equal(plain(frac('√3x')), '√⟨3⟩x');
});

test('không đổi chữ thường, đơn vị, dấu cách', () => {
  for (const s of ['60 km/h', 'và/hoặc', 'đồng/giờ', 'nam/nữ', 'a / b', 'https://example.org/a/b'])
    assert.equal(frac(s), s, s);
});

test('không thêm gì ngoài thẻ span cố định', () => {
  const out = frac('&lt;b&gt;/x &amp; 1/2');
  assert.equal(out.replace(/<\/?span[^>]*>/g, ''), '&lt;b&gt;/x &amp; 1/2');
  assert.ok(!/<(?!\/?span[ >])/.test(out));
});
