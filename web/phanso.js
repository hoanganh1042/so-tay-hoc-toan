// Hiển thị phân số dạng đứng: "a/b" thành tử ở trên, mẫu ở dưới.
// Đầu vào là chuỗi ĐÃ thoát ký tự HTML (không chứa thẻ). Hàm chỉ chèn thêm các thẻ <span> cố định,
// tử và mẫu vẫn là văn bản đã thoát, nên không mở thêm đường chèn mã.
// Dấu "/" vẫn nằm trong trang (ẩn bằng CSS) để trình đọc màn hình đọc đúng và khi sao chép vẫn ra "a/b".
//
// Quy ước đọc tử và mẫu (giống cách viết trong dữ liệu):
//   - một nhóm ngoặc: (a + b)/2, 1/(x + 1)
//   - một cụm liền nhau: 2x/3, AB/AC, y'/y, x²/4, √x/2
//   - hàm lượng giác, logarit đứng trước: sin α/cos α, 1/cos²x, ln x/x
// Không đổi khi có dấu cách quanh "/", khi hai bên là chữ tiếng Việt ("và/hoặc") hay đơn vị ("km/h").
(() => {
  'use strict';
  const ATOM = /[A-Za-z0-9Α-Ωα-ω₀-ₜᵢ-ᵪⱼ²³¹⁰-ⁿᴬ-ᵡʰ-˿̄'′″°∞!√∛]/;
  const SUP = /[²³¹⁰-ⁿᴬ-ᵡʰ-˿'′″!]/;
  const OPEN = { ')': '(', ']': '[' }, CLOSE = { '(': ')', '[': ']' };
  const LETTER = /\p{L}/u;
  const FN = /(?:sin|cos|tan|cot|ln|lg|log[₀-₉]*)[²³]?$/;
  const FN_FWD = /^(?:sin|cos|tan|cot|ln|lg|log[₀-₉]*)[²³]?(?![A-Za-z])/;
  const VIET = /[À-ÖØ-öø-ɏḀ-ỿ]/;   // chữ có dấu (trừ × và ÷)
  const UNITS = new Set(['km', 'h', 'm', 's', 'cm', 'mm', 'dm', 'g', 'kg', 'l', 'ml', 'ha', 'phút', 'giờ', 'ngày', 'tháng', 'năm', 'người', 'đồng']);
  const FNWORD = new Set(['sin', 'cos', 'tan', 'cot', 'log']);

  const isAtom = (s, k) => {
    const c = s[k]; if (c === undefined) return false;
    if (ATOM.test(c)) return true;
    return (c === '.' || c === ',') && /[0-9]/.test(s[k - 1] || '') && /[0-9]/.test(s[k + 1] || '');
  };
  // Tìm ngoặc khớp, chấp nhận cả ( ) và [ ].
  const matchBack = (s, k) => { const o = OPEN[s[k]]; let d = 0; for (let j = k; j >= 0; j--) { if (s[j] === s[k]) d++; else if (s[j] === o && --d === 0) return j; } return -1; };
  const matchFwd = (s, k) => { const c = CLOSE[s[k]]; let d = 0; for (let j = k; j < s.length; j++) { if (s[j] === s[k]) d++; else if (s[j] === c && --d === 0) return j; } return -1; };

  // Điểm bắt đầu của tử số (đứng ngay trước "/" ở vị trí i), hoặc -1.
  function leftStart(s, i) {
    let k = i - 1;
    while (k >= 0 && SUP.test(s[k])) k--;
    let start;
    if (s[k] === ')' || s[k] === ']') { start = matchBack(s, k); if (start < 0) return -1; }
    else if (s[k] === '|') { start = s.lastIndexOf('|', k - 1); if (start < 0) return -1; }
    else start = k + 1;
    while (start > 0 && isAtom(s, start - 1)) start--;
    if (start >= i || LETTER.test(s[start - 1] || '') || /[./:]/.test(s[start - 1] || '')) return -1;   // giữa một từ hoặc đường dẫn   // đồng/giờ: không cắt giữa một từ
    // "sin α/cos α": tử là cả "sin α".
    if (s[start - 1] === ' ' && /^[A-Za-zΑ-ω]/.test(s.slice(start, i))) {
      const m = s.slice(0, start - 1).match(FN);
      if (m && !/[A-Za-z]/.test(s[start - 1 - m[0].length - 1] || '')) start = start - 1 - m[0].length;
    }
    return start;
  }

  // Một toán hạng bắt đầu ở k (đi về bên phải). Trả về vị trí kết thúc (không gồm), hoặc -1.
  function operandEnd(s, k) {
    let end;
    if (s[k] === '(' || s[k] === '[') { const j = matchFwd(s, k); if (j < 0) return -1; end = j + 1; }
    else if (s[k] === '|') { const j = s.indexOf('|', k + 1); if (j < 0) return -1; end = j + 1; }
    else {
      end = k; while (isAtom(s, end)) end++;
      if (end === k) return -1;
      if (s[end] === '(') { const j = matchFwd(s, end); if (j < 0) return -1; end = j + 1; }   // f(x), √(x + 1)
    }
    while (end < s.length && SUP.test(s[end])) end++;
    return LETTER.test(s[end] || '') || s[end] === '/' ? -1 : end;
  }

  // Điểm kết thúc của mẫu số (bắt đầu ngay sau "/" ở vị trí i), hoặc -1.
  function rightEnd(s, i) {
    const k = i + 1, m = s.slice(k).match(FN_FWD);
    if (m) { let k2 = k + m[0].length; if (s[k2] === ' ') k2++; const e = operandEnd(s, k2); if (e > 0) return e; }
    return operandEnd(s, k);
  }

  function plausible(a, b) {
    if (VIET.test(a) || VIET.test(b)) return false;                                // chữ tiếng Việt: và/hoặc, 1/3 số học sinh
    const words = (a + ' ' + b).match(/[a-z]{5,}/g) || [];
    if (words.some(w => !FNWORD.has(w.replace(/[²³]$/, '')))) return false;            // từ thường: http, path, ...
    if (UNITS.has(a.replace(/^[0-9.,\s]+/, '')) && UNITS.has(b)) return false;         // 60km/h, 3 m/s
    return true;
  }

  const unwrap = x => ((x[0] === '(' || x[0] === '[') && matchFwd(x, 0) === x.length - 1) ? x.slice(1, -1) : x;
  const box = (n, d) => `<span class="fr"><span class="fr-n">${render(unwrap(n))}</span><span class="fr-s">/</span><span class="fr-d">${render(unwrap(d))}</span></span>`;

  function render(s) {
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(' || c === '[') depth++;
      else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
      else if (c === '/' && depth === 0) {
        const a = leftStart(s, i), b = a >= 0 ? rightEnd(s, i) : -1;
        if (a >= 0 && b > 0 && plausible(s.slice(a, i), s.slice(i + 1, b)))
          return render(s.slice(0, a)) + box(s.slice(a, i), s.slice(i + 1, b)) + render(s.slice(b));
      }
    }
    // Không có phân số ở tầng ngoài: dựng dấu căn, rồi tìm tiếp trong từng nhóm ngoặc.
    let out = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      if (c === '√' || c === '∛') {
        const k = i + 1;
        if (s[k] === '(') { const j = matchFwd(s, k); if (j > k) { out += root(c, render(s.slice(k + 1, j)), true); i = j + 1; continue; } }
        // √3, √12,5, √x, √x₁ (không gộp chữ đứng sau: √3x là √3 nhân x)
        const m = s.slice(k).match(/^(?:[0-9]+(?:[.,][0-9]+)?|[A-Za-zΑ-ω][₀-ₜ]*)/);
        if (m) { out += root(c, m[0], false); i = k + m[0].length; continue; }
      }
      if (c === '(' || c === '[') { const j = matchFwd(s, i); if (j > i) { out += c + render(s.slice(i + 1, j)) + s[j]; i = j + 1; continue; } }
      out += s[i++];
    }
    return out;
  }
  // Dấu căn có gạch ngang phủ hết biểu thức dưới căn. Cặp ngoặc gốc vẫn giữ (ẩn) để sao chép ra đúng "√(…)".
  const root = (sign, body, paren) => `<span class="rt"><span class="rt-s">${sign}</span><span class="rt-b">${paren ? '<span class="fr-s">(</span>' : ''}${body}${paren ? '<span class="fr-s">)</span>' : ''}</span></span>`;

  const frac = s => /[/√∛]/.test(String(s)) ? render(String(s)) : String(s);
  if (typeof window !== 'undefined') window.KHKT_FRAC = frac;
  if (typeof module !== 'undefined') module.exports = { frac };
})();
