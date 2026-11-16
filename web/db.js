// Lớp lưu trữ của Sổ tay Toán.
//
// Nguồn chính là IndexedDB (cơ sở dữ liệu "sotay-toan"), gồm các kho:
//   kv        {k, v}                  trạng thái chung: lớp, bộ sách, chương đã học, phiếu thói quen, kết quả chẩn đoán, đề đang làm
//   practice  {key, ok, hint, at}     kết quả gần nhất của từng câu ôn tập
//   review    {key, box, due}         lịch ôn lại giãn cách 1-3-7 ngày (chỉ mục: due)
//   errors    {key, t, at}            loại lỗi học sinh tự phân loại
//   exams     {at, mode, total, ...}  lịch sử các lần nộp đề
//   events    {id, at, type, ...}     nhật ký hoạt động chỉ ghi thêm (chỉ mục: at), dùng cho thống kê
// localStorage giữ một bản chụp gần nhất để: (1) không mất dữ liệu nếu tab đóng trước khi IndexedDB ghi xong,
// (2) chạy được ở trình duyệt chặn IndexedDB, (3) chuyển dữ liệu của bản cũ (trước đây chỉ dùng localStorage).
//
// Mọi dữ liệu đọc vào (từ máy hoặc từ tệp sao lưu) đều đi qua sanitize(): chỉ giữ các trường đã biết, đúng kiểu,
// đúng khuôn khóa. Dữ liệu trong máy người dùng có thể bị sửa tay hoặc bị tiện ích trình duyệt ghi đè nên không được tin.
(() => {
  'use strict';
  const DB_NAME = 'sotay-toan', DB_VER = 1, LS_KEY = 'khkt-sotay', SCHEMA = 2, APP_ID = 'so-tay-hoc-toan';
  const TS_MAX = 4e12, MAX_EVENTS = 3000;
  const ID = /^[A-Za-z0-9-]{1,32}$/, ITEM = /^[A-Za-z0-9-]{1,32}#(d|\d{1,3})$/, REF = /^[A-Za-z0-9-]{1,32}#(d|\d{1,3})(@[A-Za-z0-9-]{1,32})?$/;
  const WORD = /^[a-z0-9]{1,16}$/, BAD_KEY = new Set(['__proto__', 'constructor', 'prototype']);

  // ---------- kiểm tra và làm sạch dữ liệu ----------
  const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const num = (v, lo, hi, d) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : d;
  const int = (v, lo, hi, d) => Number.isInteger(v) && v >= lo && v <= hi ? v : d;
  const str = (v, re, d) => typeof v === 'string' && re.test(v) ? v : d;
  const list = (a, fn, max) => Array.isArray(a) ? a.slice(0, max).map(fn).filter(v => v !== undefined) : [];
  const map = (o, keyRe, fn, max = 5000) => {
    const out = {}; if (!isObj(o)) return out; let n = 0;
    for (const k of Object.keys(o)) {
      if (n >= max) break;
      if (BAD_KEY.has(k) || !keyRe.test(k)) continue;
      const v = fn(o[k]); if (v !== undefined) { out[k] = v; n++; }
    }
    return out;
  };
  const habits = h => map(h, WORD, v => Array.isArray(v) ? list(v, x => int(x, 0, 20), 20) : int(v, 0, 20), 40);
  const grade = g => g === 12 ? 12 : 11;

  function sanitizeExam(e) {
    if (!isObj(e) || !Array.isArray(e.k) || e.k.length !== 3) return null;
    const sc = e.score;
    return {
      mode: str(e.mode, WORD, 'tn'), target: num(e.target, 0, 10, undefined), ch: str(e.ch, ID, undefined), seed: num(e.seed, 0, 1e16, 1),
      k: e.k.map(a => list(a, r => str(r, REF), 40)),
      ans: map(e.ans, /^p[123]\d{1,2}$/, v => typeof v === 'number' ? int(v, 0, 9) : typeof v === 'string' ? v.slice(0, 40) : isObj(v) ? map(v, /^[0-3]$/, x => int(x, 0, 1), 4) : undefined, 80),
      submitted: e.submitted === true, start: num(e.start, 0, TS_MAX, 0),
      score: isObj(sc) ? { p1: num(sc.p1, 0, 10, 0), p2: num(sc.p2, 0, 10, 0), p3: num(sc.p3, 0, 10, 0), total: num(sc.total, 0, 10, 0), weak: list(sc.weak, v => str(v, ID), 80) } : undefined
    };
  }

  // Trả về trạng thái sạch, hoặc null nếu đầu vào không phải một đối tượng.
  function sanitize(d) {
    if (!isObj(d)) return null;
    const R = d.result;
    return {
      savedAt: num(d.savedAt, 0, TS_MAX, 0),
      grade: grade(d.grade),
      done: Array.isArray(d.done) ? list(d.done, v => str(v, ID), 80) : null,
      found: d.found !== false,
      h: habits(d.h),
      ans: map(d.ans, ID, v => int(v, 0, 9), 400),
      result: isObj(R) ? { grade: grade(R.grade), chapters: list(R.chapters, v => str(v, ID), 80), lessons: map(R.lessons, ID, v => typeof v === 'boolean' ? v : undefined, 400), h: habits(R.h), date: str(R.date, /^[0-9/.\- ]{1,16}$/, '') } : null,
      prac: map(d.prac, ITEM, v => typeof v === 'boolean' ? { ok: v, hint: false, at: 0 } : isObj(v) ? { ok: v.ok === true, hint: v.hint === true, at: num(v.at, 0, TS_MAX, 0) } : undefined),
      rv: map(d.rv, ITEM, v => isObj(v) ? { box: int(v.box, 0, 9, 0), due: num(v.due, 0, TS_MAX, 0) } : undefined),
      errT: map(d.errT, ITEM, v => isObj(v) ? { t: int(v.t, 0, 9, 0), at: num(v.at, 0, TS_MAX, 0) } : undefined),
      hist: (Array.isArray(d.hist) ? d.hist.slice(-30) : []).map(v => isObj(v) && num(v.at, 1, TS_MAX) ? {
        at: v.at, mode: str(v.mode, WORD, 'tn'), target: num(v.target, 0, 10, undefined), ch: str(v.ch, ID, undefined),
        total: num(v.total, 0, 10, 0), p1: num(v.p1, 0, 10, 0), p2: num(v.p2, 0, 10, 0), p3: num(v.p3, 0, 10, 0),
        weak: list(v.weak, x => typeof x === 'string' ? x.replace(/[<>&"'`]/g, '').slice(0, 80) : undefined, 5)
      } : undefined).filter(Boolean),
      target: num(d.target, 0, 10, 7),
      book: str(d.book, /^[a-z]{2,12}$/, 'kntt'),
      exam: sanitizeExam(d.exam)
    };
  }
  const sanitizeEvent = e => isObj(e) && num(e.at, 1, TS_MAX) && str(e.type, WORD) ? {
    at: e.at, type: e.type, key: str(e.key, ITEM, undefined), ok: typeof e.ok === 'boolean' ? e.ok : undefined,
    hint: e.hint === true ? true : undefined, n: int(e.n, 0, 1000, undefined), score: num(e.score, 0, 10, undefined), mode: str(e.mode, WORD, undefined)
  } : undefined;

  if (typeof module !== 'undefined' && module.exports) { module.exports = { sanitize, sanitizeEvent, SCHEMA, APP_ID }; return; }

  // ---------- localStorage (bản chụp dự phòng) ----------
  const lsRead = () => { try { return sanitize(JSON.parse(localStorage.getItem(LS_KEY) || 'null')); } catch (e) { return null; } };
  const lsWrite = s => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); return true; } catch (e) { return false; } };
  const lsWorks = () => { try { localStorage.setItem('khkt-probe', '1'); localStorage.removeItem('khkt-probe'); return true; } catch (e) { return false; } };

  // ---------- IndexedDB ----------
  let db = null, backend = 'memory', memEvents = [];
  const STORES = { prac: 'practice', rv: 'review', errT: 'errors' };
  const shadow = { practice: new Map(), review: new Map(), errors: new Map(), exams: new Map() };   // bản đã ghi, để chỉ ghi phần thay đổi
  const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const txDone = tx => new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = tx.onabort = () => rej(tx.error || new Error('Giao dịch bị hủy')); });

  function open() {
    return new Promise((res, rej) => {
      let r; try { r = indexedDB.open(DB_NAME, DB_VER); } catch (e) { return rej(e); }
      // Nâng cấp lược đồ theo từng phiên bản; thêm phiên bản mới thì thêm một khối if (old < n).
      r.onupgradeneeded = ev => {
        const d = r.result;
        if (ev.oldVersion < 1) {
          d.createObjectStore('kv', { keyPath: 'k' });
          d.createObjectStore('practice', { keyPath: 'key' });
          d.createObjectStore('review', { keyPath: 'key' }).createIndex('due', 'due');
          d.createObjectStore('errors', { keyPath: 'key' });
          d.createObjectStore('exams', { keyPath: 'at' });
          d.createObjectStore('events', { keyPath: 'id', autoIncrement: true }).createIndex('at', 'at');
        }
      };
      r.onsuccess = () => { const d = r.result; d.onversionchange = () => d.close(); res(d); };
      r.onerror = () => rej(r.error); r.onblocked = () => rej(new Error('IndexedDB đang bị khóa bởi tab khác'));
    });
  }

  async function readAll() {
    const tx = db.transaction(['kv', 'practice', 'review', 'errors', 'exams']), all = n => req(tx.objectStore(n).getAll());
    const [kv, pr, rv, er, ex] = await Promise.all([all('kv'), all('practice'), all('review'), all('errors'), all('exams')]);
    const st = (kv.find(x => x.k === 'state') || {}).v;
    if (!st) return null;
    const strip = rows => { const o = {}; rows.forEach(r => { const { key, ...v } = r; if (typeof key === 'string' && !BAD_KEY.has(key)) o[key] = v; }); return o; };
    return { ...st, prac: strip(pr), rv: strip(rv), errT: strip(er), hist: ex.sort((a, b) => a.at - b.at) };
  }

  // Ghi một bản trạng thái. full = true: xóa sạch rồi ghi lại (dùng khi nhập tệp, chuyển dữ liệu, hoặc sau một lần ghi lỗi).
  function write(s, full) {
    const tx = db.transaction(['kv', 'practice', 'review', 'errors', 'exams'], 'readwrite');
    const { prac, rv, errT, hist, ...rest } = s;
    tx.objectStore('kv').put({ k: 'state', v: rest });
    tx.objectStore('kv').put({ k: 'meta', v: { app: APP_ID, schema: SCHEMA, updatedAt: Date.now() } });
    const sync = (name, entries, keyName) => {
      const st = tx.objectStore(name), sh = shadow[name], seen = new Set();
      if (full) { st.clear(); sh.clear(); }
      for (const [k, v] of entries) { seen.add(k); const j = JSON.stringify(v); if (sh.get(k) !== j) { st.put({ ...v, [keyName]: k }); sh.set(k, j); } }
      for (const k of [...sh.keys()]) if (!seen.has(k)) { st.delete(k); sh.delete(k); }
    };
    sync('practice', Object.entries(prac), 'key'); sync('review', Object.entries(rv), 'key'); sync('errors', Object.entries(errT), 'key');
    sync('exams', hist.map(h => [h.at, h]), 'at');
    return txDone(tx);
  }

  // Hàng đợi ghi: mỗi lúc chỉ một giao dịch; nếu có thay đổi mới trong lúc đang ghi thì ghi tiếp bản mới nhất.
  let queued = null, writing = false, needFull = false, lastError = null;
  async function pump() {
    if (writing || !db) return; writing = true;
    while (queued) {
      const s = queued; queued = null;
      try { await write(s, needFull); needFull = false; lastError = null; }
      catch (e) { needFull = true; lastError = e; Object.values(shadow).forEach(m => m.clear()); }
    }
    writing = false;
  }
  function save(state) {
    const s = sanitize({ ...state, savedAt: Date.now() }); if (!s) return;
    lsWrite(s);
    if (db) { queued = s; pump(); }
  }

  async function init() {
    const ls = lsRead();
    try { db = await open(); backend = 'indexeddb'; }
    catch (e) { db = null; backend = lsWorks() ? 'localstorage' : 'memory'; lastError = e; }
    let st = null;
    if (db) { try { st = sanitize(await readAll()); } catch (e) { st = null; needFull = true; } }
    // Bản localStorage mới hơn (tab đóng trước khi IndexedDB ghi xong) hoặc là dữ liệu của bản cũ: lấy nó và ghi vào IndexedDB.
    if (ls && (!st || ls.savedAt > st.savedAt)) {
      const first = !st;
      if (db) { try { await write(ls, true); if (first) await seedEvents(ls); } catch (e) { needFull = true; lastError = e; } }
      return ls;
    }
    if (st) { needFull = true; return st; }   // lần ghi đầu của phiên dựng lại bản đối chiếu
    return null;
  }

  // ---------- nhật ký hoạt động ----------
  async function seedEvents(s) {   // dữ liệu bản cũ không có nhật ký: dựng lại từ thời điểm làm bài đã lưu
    const tx = db.transaction('events', 'readwrite'), st = tx.objectStore('events');
    Object.entries(s.prac).forEach(([key, v]) => { if (v.at) st.add({ at: v.at, type: 'practice', key, ok: v.ok, hint: v.hint || undefined }); });
    s.hist.forEach(h => st.add({ at: h.at, type: 'exam', mode: h.mode, score: h.total }));
    return txDone(tx);
  }
  function log(type, data) {
    const ev = sanitizeEvent({ ...data, type, at: Date.now() }); if (!ev) return;
    if (!db) { memEvents.push(ev); if (memEvents.length > MAX_EVENTS) memEvents.shift(); return; }
    try {
      const tx = db.transaction('events', 'readwrite'), st = tx.objectStore('events');
      st.add(ev);
      st.count().onsuccess = e => {   // giữ nhật ký trong giới hạn: quá ngưỡng thì xóa 500 bản ghi cũ nhất
        if (e.target.result <= MAX_EVENTS) return; let left = 500;
        st.openCursor().onsuccess = c => { const cur = c.target.result; if (cur && left-- > 0) { cur.delete(); cur.continue(); } };
      };
    } catch (e) { lastError = e; }
  }
  async function events(since = 0) {
    if (!db) return memEvents.filter(e => e.at >= since);
    return req(db.transaction('events').objectStore('events').index('at').getAll(IDBKeyRange.lowerBound(since)));
  }
  // Số câu đã làm và số câu đúng theo từng ngày, trong `days` ngày gần nhất (kể cả hôm nay).
  async function stats(days = 7) {
    const DAY = 864e5, t0 = new Date(); t0.setHours(0, 0, 0, 0); const start = t0.getTime() - (days - 1) * DAY;
    const out = Array.from({ length: days }, (_, i) => ({ day: start + i * DAY, n: 0, ok: 0, exams: 0 }));
    (await events(start)).forEach(e => {
      const b = out[Math.floor((e.at - start) / DAY)]; if (!b) return;
      if (e.type === 'practice') { b.n++; if (e.ok) b.ok++; } else if (e.type === 'exam') b.exams++;
    });
    return out;
  }

  // ---------- sao lưu, khôi phục, xóa ----------
  async function exportAll(state) {
    return { app: APP_ID, schema: SCHEMA, exportedAt: new Date().toISOString(), state: sanitize(state), events: (await events()).map(({ id, ...e }) => e) };
  }
  // Nhận tệp sao lưu (hoặc bản chụp localStorage kiểu cũ). Trả về trạng thái đã làm sạch; ném lỗi nếu tệp không hợp lệ.
  async function importAll(obj) {
    if (!isObj(obj)) throw new Error('Tệp không đúng định dạng.');
    const legacy = !('app' in obj) && ('prac' in obj || 'result' in obj || 'grade' in obj);
    if (!legacy && obj.app !== APP_ID) throw new Error('Đây không phải tệp sao lưu của Sổ tay Toán.');
    if (!legacy && !(Number.isInteger(obj.schema) && obj.schema >= 1 && obj.schema <= SCHEMA)) throw new Error('Tệp sao lưu thuộc phiên bản mới hơn app này.');
    const s = sanitize(legacy ? obj : obj.state); if (!s) throw new Error('Tệp sao lưu không có dữ liệu.');
    s.savedAt = Date.now();
    const evs = list(legacy ? [] : obj.events, sanitizeEvent, MAX_EVENTS);
    lsWrite(s);
    if (db) {
      queued = null; await write(s, true);
      const tx = db.transaction('events', 'readwrite'), st = tx.objectStore('events'); st.clear(); evs.forEach(e => st.add(e)); await txDone(tx);
      if (!evs.length) await seedEvents(s);
    } else memEvents = evs;
    return s;
  }
  async function clear() {
    try { localStorage.removeItem(LS_KEY); } catch (e) { /* không có localStorage */ }
    memEvents = []; queued = null;
    if (!db) return;
    const names = ['kv', 'practice', 'review', 'errors', 'exams', 'events'], tx = db.transaction(names, 'readwrite');
    names.forEach(n => tx.objectStore(n).clear()); Object.values(shadow).forEach(m => m.clear());
    await txDone(tx);
  }
  async function info() {
    const out = { backend, schema: SCHEMA, dbVersion: db ? db.version : 0, error: lastError ? String(lastError.message || lastError) : '', counts: {}, persisted: false };
    if (db) {
      const names = ['practice', 'review', 'errors', 'exams', 'events'], tx = db.transaction(names);
      (await Promise.all(names.map(n => req(tx.objectStore(n).count())))).forEach((c, i) => { out.counts[names[i]] = c; });
    }
    try { out.persisted = !!(navigator.storage && navigator.storage.persisted && await navigator.storage.persisted()); } catch (e) { /* trình duyệt không hỗ trợ */ }
    return out;
  }
  // Xin trình duyệt không tự xóa dữ liệu khi máy thiếu dung lượng. Gọi sau khi học sinh đã có dữ liệu đáng giữ.
  const persist = () => { try { return navigator.storage && navigator.storage.persist ? navigator.storage.persist() : Promise.resolve(false); } catch (e) { return Promise.resolve(false); } };

  window.KHKT_DB = { init, save, log, stats, exportAll, importAll, clear, info, persist, sanitize };
})();
