// Mục "Công thức": tổng hợp công thức trong chương trình (theo chương) và công thức nâng cao (theo chủ đề).
// Dữ liệu ở congthuc.js (window.KHKT_CT). Tệp này chỉ dựng giao diện; app.js truyền vào hàm thoát ký tự và cách tra chương.
(() => {
  'use strict';
  // Bỏ dấu tiếng Việt để tìm "dao ham" vẫn ra "đạo hàm".
  const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const GRADES = [10, 11, 12];

  // mode: 'cb' (trong chương trình) hoặc 'nc' (nâng cao). esc: hàm thoát ký tự HTML. chapter(id): {ten, href} hoặc null.
  function html({ mode, esc, chapter }) {
    const CT = window.KHKT_CT, nc = mode === 'nc';
    const head = `<div class="page-head"><h1>Công thức</h1>
      <p class="lead measure muted">Tra nhanh công thức theo từng chương. Mục Nâng cao gồm công thức và tính chất ngoài sách giáo khoa.</p></div>`;
    if (!CT || !Array.isArray(CT.cb) || !Array.isArray(CT.nc))
      return `<div class="page ct-page">${head}<div class="panel"><p class="err">Không tải được dữ liệu công thức (congthuc.js).</p></div></div>`;
    const item = m => `<article class="ct-item" data-t="${esc(fold([m.ten].concat(m.ct, m.dk || '', m.gc || '').join(' ')))}">
        <h3>${esc(m.ten)}</h3><ul class="ct-f">${m.ct.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        ${m.dk ? `<p class="ct-dk"><b>Điều kiện:</b> ${esc(m.dk)}</p>` : ''}${m.gc ? `<p class="ct-gc muted small">${esc(m.gc)}</p>` : ''}</article>`;
    const group = (c, i) => {
      const ch = !nc && chapter(c.ch), id = 'ct-' + (nc ? 'nc' : 'cb') + i;
      return `<section class="ct-ch" ${nc ? '' : `data-g="${+c.g}"`} aria-labelledby="${id}">
        <div class="ct-ch-head">${nc ? '<span class="tag">Nâng cao</span>' : `<span class="tag">Lớp ${+c.g}</span>`}<h2 id="${id}">${esc(c.ten)}</h2>${ch ? `<a class="link" href="${esc(ch.href)}">Ôn chương này</a>` : ''}</div>
        <div class="ct-list">${c.muc.map(item).join('')}</div></section>`;
    };
    const total = (nc ? CT.nc : CT.cb).reduce((n, c) => n + c.muc.length, 0);
    return `<div class="page ct-page">${head}
      <div class="ct-tools">
        <nav class="ct-seg" aria-label="Loại công thức"><a href="#cong-thuc" ${nc ? '' : 'class="on" aria-current="page"'}>Trong chương trình</a><a href="#cong-thuc-nang-cao" ${nc ? 'class="on" aria-current="page"' : ''}>Nâng cao</a></nav>
        ${nc ? '' : `<div class="ct-grades" role="group" aria-label="Lọc theo lớp"><button type="button" class="ct-chip on" data-g="0" aria-pressed="true">Tất cả</button>${GRADES.map(g => `<button type="button" class="ct-chip" data-g="${g}" aria-pressed="false">Lớp ${g}</button>`).join('')}</div>`}
        <label class="ct-search"><span class="sr-only">Tìm công thức</span><input type="search" id="ct-q" placeholder="Tìm: côsin, đạo hàm, thể tích…" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
      </div>
      ${nc ? '<p class="ct-note" role="note">Công thức nâng cao không có trong sách giáo khoa. Dùng để làm nhanh câu trắc nghiệm hoặc soát lại đáp án; trong bài tự luận phải chứng minh trước khi dùng.</p>' : ''}
      <p class="small muted" id="ct-count" role="status" aria-live="polite" data-total="${total}">${total} mục.</p>
      ${(nc ? CT.nc : CT.cb).map(group).join('')}
      <p class="muted" id="ct-empty" hidden>Không có công thức nào khớp. Thử từ khóa ngắn hơn hoặc xem mục còn lại.</p></div>`;
  }

  // Lọc theo lớp và từ khóa bằng cách ẩn/hiện phần tử, không dựng lại trang nên ô tìm kiếm không mất con trỏ.
  function bind(root) {
    const q = root.querySelector('#ct-q'); if (!q) return;
    const chips = [...root.querySelectorAll('.ct-chip')], count = root.querySelector('#ct-count'), empty = root.querySelector('#ct-empty');
    let grade = 0;
    const apply = () => {
      const words = fold(q.value).split(/\s+/).filter(Boolean); let shown = 0;
      root.querySelectorAll('.ct-ch').forEach(sec => {
        const gOk = !grade || +sec.dataset.g === grade; let n = 0;
        sec.querySelectorAll('.ct-item').forEach(it => { const ok = gOk && words.every(w => it.dataset.t.includes(w)); it.hidden = !ok; if (ok) n++; });
        sec.hidden = !n; shown += n;
      });
      count.textContent = shown === +count.dataset.total ? `${shown} mục.` : `Đang hiện ${shown}/${count.dataset.total} mục.`;
      empty.hidden = shown > 0;
    };
    q.addEventListener('input', apply);
    chips.forEach(b => b.addEventListener('click', () => {
      grade = +b.dataset.g;
      chips.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
      apply();
    }));
  }

  window.KHKT_CT_VIEW = { html, bind, fold };
})();
