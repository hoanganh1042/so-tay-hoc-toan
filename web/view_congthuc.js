// Mục "Công thức": tổng hợp công thức trong chương trình (theo chương) và công thức nâng cao (theo chủ đề).
// Dữ liệu ở congthuc.js (window.KHKT_CT). Tệp này chỉ dựng giao diện; app.js truyền vào hàm thoát ký tự và cách tra chương.
//
// Bố cục: mục lục bên trái (trên điện thoại là ô chọn chương), bên phải chỉ hiện MỘT chương mỗi lần để trang
// không thành một bức tường chữ. Khi gõ tìm kiếm thì hiện mọi mục khớp, gom theo chương.
(() => {
  'use strict';
  // Bỏ dấu tiếng Việt để tìm "dao ham" vẫn ra "đạo hàm".
  const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const GRADES = [10, 11, 12];
  const last = { cb: 0, nc: 0 };   // chương đang xem của từng loại, giữ khi chuyển qua lại giữa các tab

  // mode: 'cb' (trong chương trình) hoặc 'nc' (nâng cao). esc: hàm thoát ký tự HTML. chapter(id): {ten, href} hoặc null.
  function html({ mode, esc, chapter }) {
    const CT = window.KHKT_CT, nc = mode === 'nc';
    const head = `<div class="page-head"><h1>Công thức</h1>
      <p class="lead measure muted">Chọn một chương để xem công thức của chương đó, hoặc gõ từ khóa để tìm trong tất cả các chương.</p></div>`;
    if (!CT || !Array.isArray(CT.cb) || !Array.isArray(CT.nc))
      return `<div class="page ct-page">${head}<div class="panel"><p class="err">Không tải được dữ liệu công thức (congthuc.js).</p></div></div>`;
    const mt = s => window.KHKT_FRAC ? window.KHKT_FRAC(esc(s)) : esc(s);   // phân số đứng, dấu căn (phanso.js)
    const list = nc ? CT.nc : CT.cb;
    const cur = Math.min(last[mode] || 0, list.length - 1);
    const label = c => nc ? 'Nâng cao' : `Lớp ${+c.g}`;

    const item = (m, k) => `<article class="ct-item" data-t="${esc(fold([m.ten].concat(m.ct, m.dk || '', m.gc || '').join(' ')))}">
        <h3><span class="ct-no">${k + 1}</span>${esc(m.ten)}</h3>
        <div class="ct-body"><ul class="ct-f">${m.ct.map(f => `<li>${mt(f)}</li>`).join('')}</ul>
        ${m.dk ? `<p class="ct-dk"><span class="ct-k">Điều kiện</span>${mt(m.dk)}</p>` : ''}${m.gc ? `<p class="ct-gc"><span class="ct-k">Lưu ý</span>${mt(m.gc)}</p>` : ''}</div></article>`;
    const section = (c, i) => {
      const ch = !nc && chapter(c.ch), id = `ct-${mode}-${i}`;
      return `<section class="ct-ch" data-i="${i}" aria-labelledby="${id}"${i === cur ? '' : ' hidden'}>
        <header class="ct-ch-head"><p class="ct-eyebrow">${label(c)} · ${c.muc.length} mục</p><h2 id="${id}">${esc(c.ten)}</h2>
        ${ch ? `<a class="link small" href="${esc(ch.href)}">Ôn tập chương này</a>` : ''}</header>
        <div class="ct-items">${c.muc.map(item).join('')}</div></section>`;
    };

    // Mục lục (máy tính) và ô chọn (điện thoại) dùng chung một thứ tự chương.
    const groups = nc ? [{ name: 'Chủ đề', idx: list.map((_, i) => i) }]
      : GRADES.map(g => ({ name: `Lớp ${g}`, idx: list.map((c, i) => +c.g === g ? i : -1).filter(i => i >= 0) })).filter(x => x.idx.length);
    const toc = groups.map(gr => `<p class="ct-toc-g">${gr.name}</p><ol>${gr.idx.map(i =>
      `<li><button type="button" data-i="${i}"${i === cur ? ' class="on" aria-current="true"' : ''}><span class="ct-toc-t">${esc(list[i].ten)}</span><span class="ct-toc-n">${list[i].muc.length}</span></button></li>`).join('')}</ol>`).join('');
    const pick = groups.map(gr => `<optgroup label="${gr.name}">${gr.idx.map(i => `<option value="${i}"${i === cur ? ' selected' : ''}>${esc(list[i].ten)}</option>`).join('')}</optgroup>`).join('');
    const total = list.reduce((n, c) => n + c.muc.length, 0);

    return `<div class="page ct-page" data-mode="${mode}">${head}
      <div class="ct-bar">
        <nav class="ct-seg" aria-label="Loại công thức"><a href="#cong-thuc" ${nc ? '' : 'class="on" aria-current="page"'}>Trong chương trình</a><a href="#cong-thuc-nang-cao" ${nc ? 'class="on" aria-current="page"' : ''}>Nâng cao</a></nav>
        <label class="ct-search"><span class="sr-only">Tìm công thức</span><input type="search" id="ct-q" placeholder="Tìm: côsin, đạo hàm, thể tích…" aria-describedby="ct-total" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
      </div>
      ${nc ? '<p class="ct-note" role="note">Công thức nâng cao không có trong sách giáo khoa. Dùng để làm nhanh câu trắc nghiệm hoặc soát lại đáp án; trong bài tự luận phải chứng minh trước khi dùng.</p>' : ''}
      <div class="ct-layout">
        <aside class="ct-toc" aria-label="Mục lục">${toc}</aside>
        <label class="ct-pick"><span>${nc ? 'Chủ đề' : 'Chương'}</span><select id="ct-sel">${pick}</select></label>
        <div class="ct-main">
          <p class="sr-only" id="ct-total">Tìm trong ${total} mục.</p><p class="small muted" id="ct-count" role="status" aria-live="polite" hidden></p>
          ${list.map(section).join('')}
          <p class="muted" id="ct-empty" hidden>Không có công thức nào khớp. Thử từ khóa ngắn hơn, hoặc xem phần ${nc ? 'Trong chương trình' : 'Nâng cao'}.</p>
          <nav class="ct-pager" aria-label="Chuyển chương"><button type="button" class="btn" id="ct-prev"></button><button type="button" class="btn" id="ct-next"></button></nav>
        </div>
      </div></div>`;
  }

  // Đổi chương và lọc bằng cách ẩn/hiện phần tử, không dựng lại trang nên ô tìm kiếm không mất con trỏ.
  function bind(root) {
    const page = root.querySelector('.ct-page'), q = root.querySelector('#ct-q'); if (!page || !q) return;
    const mode = page.dataset.mode;
    const secs = [...root.querySelectorAll('.ct-ch')], tocBtns = [...root.querySelectorAll('.ct-toc button')];
    const sel = root.querySelector('#ct-sel'), count = root.querySelector('#ct-count'), empty = root.querySelector('#ct-empty');
    const prev = root.querySelector('#ct-prev'), next = root.querySelector('#ct-next'), pager = root.querySelector('.ct-pager');
    const name = i => secs[i].querySelector('h2').textContent;
    let cur = secs.findIndex(s => !s.hidden); if (cur < 0) cur = 0;

    const show = (i, scroll) => {
      cur = Math.max(0, Math.min(secs.length - 1, i)); last[mode] = cur;
      secs.forEach((s, k) => { s.hidden = k !== cur; s.querySelectorAll('.ct-item').forEach(it => { it.hidden = false; }); });
      tocBtns.forEach(b => { const on = +b.dataset.i === cur; b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); b.classList.remove('dim'); });
      sel.value = String(cur);
      // Giữ mục đang chọn trong vùng nhìn thấy của mục lục (chỉ cuộn mục lục, không cuộn trang).
      const toc = root.querySelector('.ct-toc'), on = tocBtns.find(b => +b.dataset.i === cur);
      if (toc && on && toc.clientHeight) { const t = toc.getBoundingClientRect(), r = on.getBoundingClientRect();
        if (r.top < t.top || r.bottom > t.bottom) toc.scrollTop += r.top - t.top - t.height / 3; }
      prev.hidden = cur === 0; next.hidden = cur === secs.length - 1;
      prev.textContent = cur > 0 ? '← ' + name(cur - 1) : ''; next.textContent = cur < secs.length - 1 ? name(cur + 1) + ' →' : '';
      pager.hidden = false; count.hidden = true; empty.hidden = true;
      if (scroll) { const top = page.querySelector('.ct-layout').getBoundingClientRect().top; if (top < 0) window.scrollBy(0, top - 80); }
    };

    const search = () => {
      const words = fold(q.value).split(/\s+/).filter(Boolean);
      if (!words.length) { show(cur, false); return; }
      let shown = 0;
      secs.forEach((s, k) => {
        let n = 0;
        s.querySelectorAll('.ct-item').forEach(it => { const ok = words.every(w => it.dataset.t.includes(w)); it.hidden = !ok; if (ok) n++; });
        s.hidden = !n; shown += n;
        const b = tocBtns.find(x => +x.dataset.i === k); if (b) { b.classList.toggle('dim', !n); b.classList.remove('on'); b.removeAttribute('aria-current'); }
      });
      pager.hidden = true;
      count.hidden = false; count.textContent = shown ? `Tìm thấy ${shown} mục.` : '';
      empty.hidden = shown > 0;
    };

    const go = i => { q.value = ''; show(i, true); };
    tocBtns.forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
    sel.addEventListener('change', () => go(+sel.value));
    prev.addEventListener('click', () => go(cur - 1));
    next.addEventListener('click', () => go(cur + 1));
    q.addEventListener('input', search);
    show(cur, false);
  }

  window.KHKT_CT_VIEW = { html, bind, fold };
})();
