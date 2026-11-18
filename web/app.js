const DATA = window.KHKT_DATA || {};
const FOUND = {11: ['10-III', '10-VI'], 12: ['10-IV', '11-IX']};
const DEFAULT_DONE = {11: ['11-I', '11-II'], 12: ['12-I', '12-II']};
const SAMPLE_WRONG = ['10-VI-16','10-VI-17','10-III-6','11-II-6','11-II-7','11-IV-12'];
const HABITS = [
  {id:'tuhoc',type:'one',t:'Mỗi tuần bạn tự học Toán khoảng bao lâu?',o:['Dưới 1 giờ','Từ 1 đến 3 giờ','Từ 3 đến 5 giờ','Trên 5 giờ']},
  {id:'on',type:'one',t:'Bạn thường ôn tập Toán vào lúc nào?',o:['Đều đặn hằng tuần','Chủ yếu vài ngày trước bài kiểm tra','Chỉ ôn vào đêm trước bài kiểm tra','Hầu như không ôn']},
  {id:'kehoach',type:'scale',t:'Tôi có kế hoạch học Toán rõ ràng.',ends:['Hoàn toàn không đồng ý','Hoàn toàn đồng ý']},
  {id:'btvn',type:'one',t:'Bạn thường làm bài tập về nhà môn Toán như thế nào?',o:['Làm đầy đủ và tự làm','Làm phần lớn, bài khó thì tham khảo lời giải','Ít khi làm','Thường chép lời giải hoặc nhờ người khác làm']},
  {id:'muc',type:'one',t:'Khi tự làm bài tập Toán sau giờ học, bạn thường ở mức nào?',o:['Tự giải được hầu hết, kể cả bài vận dụng','Giải được bài cơ bản, bài vận dụng còn khó','Phải xem lại bài giảng mới giải được bài cơ bản','Cần người hướng dẫn mới giải được']},
  {id:'hoi',type:'many',t:'Khi không hiểu một nội dung Toán, bạn thường làm gì? (chọn nhiều)',o:['Hỏi trực tiếp giáo viên','Nhờ bạn bè giải thích','Tự tìm trong sách, video hoặc trên Internet','Hỏi công cụ AI (ChatGPT, Gemini…)','Chờ đến buổi học thêm để hỏi','Để đó, chưa xử lý']},
  {id:'apluc',type:'scale',t:'Tôi thấy áp lực vì môn Toán.',ends:['Hoàn toàn không đồng ý','Hoàn toàn đồng ý']},
  {id:'kho',type:'many',t:'Khó khăn lớn nhất của bạn khi học Toán là gì? (chọn nhiều)',o:['Hổng kiến thức nền từ các lớp dưới','Khó giải các bài nâng cao','Hay mất điểm vì sai sót, tính toán nhầm','Khó vận dụng lý thuyết vào bài tập','Thiếu động lực, dễ chán','Không gặp khó khăn đáng kể']},
  {id:'hocthem',type:'one',t:'Học kỳ này bạn có học thêm môn Toán không?',o:['Có','Không']},
  {id:'phuthuoc',type:'scale',t:'Nếu không có học thêm, tôi khó tự học Toán.',ends:['Hoàn toàn không đồng ý','Hoàn toàn đồng ý'],showIf:s=>s.h.hocthem===0}
];
const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

// ---------- state ----------
// prac[key] = {ok, hint, at}: kết quả lần làm được ghi (lần đầu mỗi ngày). rv[key] = {box, due}: lịch ôn lại 1-3-7 ngày.
// errT[key] = {t, at}: loại lỗi học sinh tự chọn. hist: kết quả các lần nộp đề. exam: đề đang làm, lưu lại để tải lại trang không mất bài.
const S = {grade:11, done:new Set(DEFAULT_DONE[11]), found:true, step:0, h:{}, ans:{}, result:null, prac:{}, rv:{}, errT:{}, hist:[], exam:null, focus:null, err:''};
// Trạng thái được lưu qua lớp lưu trữ (db.js): IndexedDB là nguồn chính, localStorage là bản dự phòng.
const snapshot = () => ({grade:S.grade, done:[...S.done], found:S.found, h:S.h, ans:S.ans, result:S.result, prac:S.prac, rv:S.rv, errT:S.errT, hist:S.hist, target:S.target, book:S.book, exam:packExam(S.exam)});
function save(){ window.KHKT_DB.save(snapshot()); }
// d: trạng thái đã được db.js làm sạch (đúng kiểu, đúng khuôn khóa), hoặc null khi chưa có dữ liệu.
function applyState(d){ try{ if(!d) return; S.step=0; S.grade=d.grade||11; S.done=new Set(d.done||DEFAULT_DONE[S.grade]); S.found=d.found!==false; S.h=d.h||{}; S.ans=d.ans||{}; S.result=d.result||null;
  S.prac = {}; Object.entries(d.prac||{}).forEach(([k,v]) => { S.prac[k] = typeof v === 'boolean' ? {ok:v, hint:false, at:0} : v; });
  S.rv=d.rv||{}; S.errT=d.errT||{}; S.hist=d.hist||[]; S.target=d.target||7; S.book=has(BOOKS, d.book)?d.book:'kntt'; { const ok = new Set(chaptersOf(S.grade).map(c => c.id)); S.done = new Set([...S.done].filter(id => ok.has(id))); if (!S.done.size && d.done && d.done.length) S.done = new Set(defaultDone()); } S.exam=unpackExam(d.exam); checkState(); }catch(e){} }
const has = (o, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);
// db.js chỉ kiểm tra khuôn dạng. Ở đây đối chiếu với nội dung thật của app: mã chương, mã bài, khóa câu, loại lỗi, kiểu đề
// phải tồn tại, nếu không một tệp sao lưu sai (hoặc dữ liệu của bản app khác) sẽ làm màn hình lỗi mỗi lần mở.
function checkState(){
  const keepKeys = o => { Object.keys(o).forEach(k => { if (!resolveKey(k)) delete o[k]; }); };
  keepKeys(S.prac); keepKeys(S.rv); keepKeys(S.errT);
  Object.keys(S.errT).forEach(k => { if (!ERRT[S.errT[k].t]) delete S.errT[k]; });
  Object.keys(S.ans).forEach(id => { if (!has(ALLLE, id)) delete S.ans[id]; });
  S.hist.forEach(r => { if (!has(MODE_NAME, r.mode)) r.mode = 'tn'; if (r.ch !== undefined && !has(ALLCH, r.ch)) r.ch = undefined; });
  const R = S.result;
  if (R){ R.chapters = R.chapters.filter(id => has(ALLCH, id)); Object.keys(R.lessons).forEach(id => { if (!has(ALLLE, id)) delete R.lessons[id]; }); if (!R.chapters.length) S.result = null; }
  const E = S.exam;
  if (E){ if (!has(MODE_NAME, E.mode) || (E.submitted && !E.score) || (E.ch !== undefined && !has(ALLCH, E.ch))) S.exam = null; else if (E.score) E.score.weak = (E.score.weak || []).filter(id => has(ALLLE, id)); }
}

// ---------- data helpers ----------
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Văn bản toán: thoát ký tự rồi dựng phân số đứng và dấu căn (phanso.js). Không dùng cho thuộc tính HTML.
const mt = s => window.KHKT_FRAC ? window.KHKT_FRAC(esc(s)) : esc(s);
const ALLCH = {}; const ALLLE = {};
Object.entries(DATA).forEach(([g, chs]) => chs.forEach(ch => { ch.g = +g; ALLCH[ch.id] = ch; ch.lessons.forEach(l => { l.ch = ch.id; ALLLE[l.id] = l; }); }));
// Bài tập bổ sung và mức độ từng câu: N Nhận biết, T Thông hiểu, V Vận dụng; câu đúng/sai gồm cả ba mức.
Object.entries(window.KHKT_EX_ADD || {}).forEach(([id, add]) => { if (ALLLE[id]) ALLLE[id].ex.push(...add); });
Object.values(ALLLE).forEach(l => { const m = (window.KHKT_MUC || {})[l.id] || '', at = {0:1, 1:2, 3:3, 4:4};
  l.d.m = l.d.m || m[0] || 'N';
  l.ex.forEach((e,i) => { if (e.t === 'tf') e.m = 'TF'; else if (!e.m) e.m = m[at[i]] || (e.t === 'sa' ? 'V' : 'T'); }); });
// Bộ sách: KNTT dùng chương gốc; CTST, Cánh diều dựng chương theo mục lục sách (sach.js), mỗi bài sổ tay thuộc đúng một bài sách.
const BOOKS = {kntt:{ten:'Kết nối tri thức với cuộc sống', ngan:'Kết nối tri thức'}};
const LE_CH = {kntt:{}}, LE_TITLE = {kntt:{}}, BOOKCH = {kntt:DATA};
Object.entries(window.KHKT_SACH || {}).forEach(([b, def]) => {
  BOOKS[b] = {ten:def.ten, ngan:def.ten}; LE_CH[b] = {}; LE_TITLE[b] = {}; BOOKCH[b] = {};
  [10, 11, 12].forEach(g => { BOOKCH[b][g] = (def[g] || []).map(([so, ten, bai], i) => {
    const ch = {id:`${b}-${g}-${i+1}`, g, so, ten, book:b, lessons:[]};
    bai.forEach(([t, ids]) => ids.forEach(id => { if (ALLLE[id] && !LE_CH[b][id]){ ch.lessons.push(ALLLE[id]); LE_CH[b][id] = ch.id; LE_TITLE[b][id] = ids.length > 1 ? `${t} · ${ALLLE[id].ten.replace(/^Bài \d+\.\s*/, '')}` : t; } }));
    ALLCH[ch.id] = ch; return ch; }).filter(ch => ch.lessons.length); }); });
const bookOf = () => BOOKS[S.book] ? S.book : 'kntt';
const chaptersOf = g => (BOOKCH[bookOf()] || DATA)[g] || [];
const chOf = l => LE_CH[bookOf()][l.id] || l.ch;
const leTitle = l => LE_TITLE[bookOf()][l.id] || l.ten;
const leNo = l => leTitle(l).split('.')[0];
const leT = (l, ch) => ch && ch.book ? (LE_TITLE[ch.book][l.id] || l.ten) : l.ten;
const defaultDone = () => bookOf() === 'kntt' ? DEFAULT_DONE[S.grade] : chaptersOf(S.grade).slice(0, 2).map(c => c.id);
const LEVELS = [['N','Nhận biết'], ['T','Thông hiểu'], ['V','Vận dụng']];
const TF_TAG = ['NB','TH','TH','VD'];
const chName = ch => `Lớp ${ch.g} · Chương ${ch.so}. ${ch.ten}`;
const shortLe = l => l.ten.replace(/^Bài \d+\.\s*/, '');

// ---------- đề thi: gộp câu bổ sung, tiêu chí; lời giải theo 3 phần ----------
const AN = window.KHKT_ANALYSIS || {topics:{}, exams:[], chuan:{mucDo:{}, nangLuc:{}, phan:{}, xepLoai:[], canCu:[]}};
const SLOTS = window.KHKT_EXAM || [];
SLOTS.forEach(sl => { const add = (window.KHKT_EXAM_ADD || {})[sl.id]; if (add) sl.items.push(...add); sl.items.push(...((window.KHKT_EXAM_LV || {})[sl.id] || [])); Object.assign(sl, (window.KHKT_EXAM_META || {})[sl.id] || {}); });
const LG = window.KHKT_LG || {};
const LESSON_TOPIC = {};
Object.entries(AN.topics).forEach(([k, t]) => t.lessons.forEach(id => { if (!LESSON_TOPIC[id]) LESSON_TOPIC[id] = k; }));
const TF_LEVEL = ['B','H','H','VD'];
function solHTML(key, e){
  const s = LG[key];
  if (!s) return `<div class="sol"><div class="sol-sec"><span class="sol-k">Lời giải</span><p>${esc(e.g)}</p></div></div>`;
  return `<div class="sol"><div class="sol-sec"><span class="sol-k">1. Hướng đi</span><p>${mt(s.h)}</p></div>
    <div class="sol-sec"><span class="sol-k">2. Kiến thức và ý tưởng</span><ul>${s.y.map(x => `<li>${mt(x)}</li>`).join('')}</ul></div>
    <div class="sol-sec"><span class="sol-k">3. Các bước giải</span><ol>${s.b.map((x,i) => `<li class="${i===s.b.length-1?'ans':''}">${mt(x)}</li>`).join('')}</ol></div></div>`;
}
function hintHTML(key){
  const s = LG[key]; if (!s) return '';
  return `<div class="hint" hidden><div><span class="sol-k">Hướng đi</span><p>${mt(s.h)}</p></div><div><span class="sol-k">Kiến thức và ý tưởng</span><ul>${s.y.map(x => `<li>${mt(x)}</li>`).join('')}</ul></div></div>`;
}
function diagChapters(){
  const own = chaptersOf(S.grade).filter(c => S.done.has(c.id)).map(c => c.id);
  return [...(S.found ? FOUND[S.grade] : []), ...own];
}
const normNum = s => String(s).trim().replace(/−/g,'-').replace(/\s/g,'').replace(',', '.');
function saCorrect(input, ans){ const a = parseFloat(normNum(ans)), b = parseFloat(normNum(input)); return normNum(input)!=='' && !isNaN(b) && Math.abs(a-b) < 1e-9; }
function seeded(seed){ let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Thứ tự hiển thị phương án trắc nghiệm. Dữ liệu gốc dồn đáp án đúng về A (bài lớp 10 mới: 8/8 câu là A),
// nên vị trí đáp án đúng được rải đều: các câu cùng một bài (hoặc cùng một vị trí đề) lần lượt nhận vị trí kế tiếp
// tính từ một điểm xuất phát theo hash; các phương án còn lại xáo cố định theo khóa câu. Dữ liệu và chỉ số đáp án không đổi.
function hash(str){ let h = 2166136261; for (const c of str){ h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const POS = {}, isMC = e => Array.isArray(e.o);
Object.values(ALLLE).forEach(l => { const o = hash(l.id); [[l.id + '#d', l.d], ...l.ex.map((e,i) => [l.id + '#' + i, e])].filter(([,e]) => isMC(e)).forEach(([k], r) => { POS[k] = o + r; }); });
SLOTS.forEach(sl => { const o = hash(sl.id); sl.items.forEach((e,i) => { if (isMC(e)) POS[sl.id + '#' + i] = o + i; }); });
function order(key, e){
  const n = e.o.length, r = seeded(hash(key) % 2147483646 + 1); r();
  const rest = [...Array(n).keys()].filter(i => i !== e.a);
  for (let i = rest.length - 1; i > 0; i--){ const j = Math.floor(r()*(i+1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  rest.splice((POS[key] ?? hash(key)) % n, 0, e.a); return rest;
}
const LETTER = i => String.fromCharCode(65+i);
const letterOf = (key, e) => LETTER(order(key, e).indexOf(e.a));

// Khóa câu: "bài#i" (bài tập), "bài#d" (câu chẩn đoán), "vị trí đề#i" (câu đề thi thử).
function resolveKey(key){
  const cut = key.lastIndexOf('#'), id = key.slice(0, cut), ix = key.slice(cut + 1);
  if (ALLLE[id]){ const l = ALLLE[id], it = ix === 'd' ? l.d : l.ex[+ix]; return it ? {l, it} : null; }
  const sl = SLOTS.find(x => x.id === id), it = sl && sl.items[+ix];
  return it ? {slot:sl, it, l:ALLLE[it.le || sl.lessons[0]]} : null;
}
function packExam(E){ return E ? {mode:E.mode, target:E.target, ch:E.ch, seed:E.seed, k:[E.p1, E.p2, E.p3].map(a => a.map(x => x.slot && !x.key.startsWith(x.slot.id + '#') ? x.key + '@' + x.slot.id : x.key)), ans:E.ans, submitted:E.submitted, start:E.start, score:E.score} : null; }
function unpackExam(d){
  if (!d || !d.k) return null;
  const parts = d.k.map(a => a.map(ref => { const [key, sid] = ref.split('@'), r = resolveKey(key), sl = sid && SLOTS.find(x => x.id === sid); return r ? (sl ? {...r, slot:sl, key} : {...r, key}) : null; }));
  if (parts.some(p => p.some(x => !x))) return null;
  const E = {mode:d.mode, target:d.target, ch:d.ch, seed:d.seed, p1:parts[0], p2:parts[1], p3:parts[2], ans:d.ans || {}, submitted:!!d.submitted, start:d.start, score:d.score || null};
  if (E.submitted) E.report = buildReport(E);
  return E;
}

// Mức vững của một bài: tự làm đúng (không mở hướng đi) ít nhất 80% số bài tập.
const DAY = 864e5, IV = [1, 3, 7], MASTER = 0.8;
const dayStart = t => { const d = new Date(t); d.setHours(0,0,0,0); return d.getTime(); };
const fmtShort = t => new Date(t).toLocaleDateString('vi-VN', {day:'numeric', month:'numeric'});
const fmtDay = t => new Date(t).toLocaleDateString('vi-VN', {weekday:'long', day:'numeric', month:'numeric'});
function lessonProg(l){ let ok = 0, done = 0; l.ex.forEach((e,i) => { const r = S.prac[l.id + '#' + i]; if (r){ done++; if (r.ok && !r.hint) ok++; } }); const need = Math.ceil(MASTER * l.ex.length); return {ok, done, tot:l.ex.length, need, mastered: ok >= need}; }
// no: câu chẩn đoán sai · sus: làm hết bài tập nhưng tự làm đúng không quá 40% (câu chẩn đoán đúng có thể do đoán) · fix: từng hổng, nay đã vững.
function leStatus(id){
  const l = ALLLE[id], p = lessonProg(l), d = S.result ? S.result.lessons[id] : undefined;
  if (p.mastered) return d === false ? 'fix' : 'ok';
  if (d === false) return 'no';
  if (p.done === p.tot && p.ok <= Math.floor(p.tot * 0.4)) return 'sus';
  return d === true ? 'ok' : '';
}
function weakSet(){ const w = new Set(); Object.keys(ALLLE).forEach(id => { const st = leStatus(id); if (st === 'no' || st === 'sus') w.add(id); }); return w; }

// Ôn lại ngắt quãng: câu sai hẹn làm lại sau 1 ngày; đúng thì giãn ra 3 rồi 7 ngày; sai thì hẹn lại từ đầu.
function reviewAfter(key, good){
  const q = S.rv[key], now = Date.now(), t0 = dayStart(now);
  if (!q){ if (good) return ''; S.rv[key] = {box:0, due:t0 + DAY}; return 'Hẹn ôn lại ngày mai.'; }
  if (!good){ q.box = 0; q.due = t0 + DAY; return 'Ôn lại từ đầu: ngày mai.'; }
  if (now < q.due) return '';
  q.box++;
  if (q.box >= IV.length){ delete S.rv[key]; return 'Đã ôn xong câu này.'; }
  q.due = t0 + IV[q.box] * DAY; return `Ôn tiếp sau ${IV[q.box]} ngày.`;
}
const dueKeys = () => Object.entries(S.rv).filter(([k,q]) => q.due <= Date.now() && resolveKey(k)).sort((a,b) => a[1].due - b[1].due).map(([k]) => k);

const ERRT = [
  {t:'Tính nhầm', vd:'sai dấu khi chuyển vế', tip:'Viết đủ từng bước, không nhẩm gộp; dành 2 phút cuối bài để thay số kiểm tra lại kết quả.'},
  {t:'Sai công thức', vd:'nhớ nhầm công thức nghiệm', tip:'Đọc lại mục Kiến thức cần nhớ của bài; chép công thức hay nhầm ra một thẻ và tự nhắc lại đầu mỗi buổi học.'},
  {t:'Hiểu sai đề', vd:'bỏ sót điều kiện', tip:'Gạch chân dữ kiện, điều kiện và điều đề hỏi trước khi làm; với câu đúng/sai, đọc riêng từng ý.'},
  {t:'Chưa biết hướng', vd:'không biết bắt đầu từ đâu', tip:'Đọc phần Hướng đi và Kiến thức của lời giải, rồi hôm sau tự làm lại câu đó khi chưa xem lời giải.'}
];
function errPick(key){
  const cur = S.errT[key] ? S.errT[key].t : -1;
  return `<div class="errpick" role="group" aria-label="Lỗi do đâu"><b class="small">Lỗi do đâu?</b>${ERRT.map((x,i) => `<button type="button" class="btn sm" data-et="${i}" data-ek="${esc(key)}" aria-pressed="${cur===i}">${x.t}</button>`).join('')}<p class="small muted et-tip">${cur >= 0 ? esc(ERRT[cur].tip) : ''}</p></div>`;
}
const histMode = r => r.mode === 'mt' ? `Mục tiêu ${r.target}` : r.mode === 'ch' && r.ch ? chLabel(r.ch) : (has(MODE_NAME, r.mode) ? MODE_NAME[r.mode] : 'Đề chuẩn').replace('Đề ', '').replace(/^./, c => c.toUpperCase());
function histSummary(){
  const H = S.hist; if (!H.length) return null;
  const f = v => (+v || 0).toLocaleString('vi-VN', {maximumFractionDigits:2});
  const last = H[H.length-1], same = H.filter(r => r.mode === last.mode && r.target === last.target), first = same[0], d = Math.round((last.total - first.total)*100)/100;
  const name = last.mode === 'mt' ? `Đề mục tiêu ${last.target}` : (has(MODE_NAME, last.mode) ? MODE_NAME[last.mode] : 'Đề chuẩn');
  return {f, n:H.length, line: same.length > 1 ? `${name}: lần đầu ${f(first.total)} điểm, gần nhất ${f(last.total)} điểm (${d >= 0 ? '+' : '−'}${f(Math.abs(d))}).` : `${name}: ${f(last.total)} điểm. Làm thêm một đề cùng loại để so với lần đầu.`};
}

// ---------- routing ----------
const view = document.getElementById('view');
function routeInner(){
  const h = (location.hash || '#chan-doan').slice(1);
  let tab = h === 'huong-dan' ? 'huong-dan' : h.startsWith('cong-thuc') ? 'cong-thuc' : h.startsWith('on-tap') || h === 'on-lai' ? 'on-tap' : h.startsWith('de-thi') ? 'de-thi' : (['chan-doan','so-tay'].includes(h) ? h : 'chan-doan');
  document.getElementById('b-help').classList.toggle('on', tab === 'huong-dan');
  document.querySelectorAll('nav.tabs a').forEach(a => { const on = a.dataset.tab === tab; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  if (tab === 'chan-doan') view.innerHTML = viewDiag();
  if (tab === 'on-tap') { const cid = h.length > 7 ? h.slice(7) : ''; view.innerHTML = h === 'on-lai' ? viewReview() : cid && has(ALLCH, cid) ? viewChapter(ALLCH[cid]) : viewChapters(); }
  const nb = document.getElementById('rv-badge'); if (nb){ const n = dueKeys().length; nb.hidden = !n; nb.textContent = n; }
  if (tab === 'de-thi') view.innerHTML = h === 'de-thi-phan-tich' ? viewAnalysis() : viewExam();
  if (tab === 'so-tay') view.innerHTML = viewBook();
  if (tab === 'cong-thuc') view.innerHTML = window.KHKT_CT_VIEW.html({mode: h === 'cong-thuc-nang-cao' ? 'nc' : 'cb', esc,
    chapter: id => { const c = ALLCH[id]; return c ? {ten:c.ten, href:'#on-tap-' + (c.lessons[0] ? chOf(c.lessons[0]) : id)} : null; }});
  if (tab === 'huong-dan'){ view.innerHTML = viewGuide(); try{ localStorage.setItem('khkt-guide','1'); }catch(e){} }
  else if (!guideSeen() && !(tab === 'de-thi' && S.exam)) view.insertAdjacentHTML('afterbegin', welcomeHTML());
  bind(tab);
  if (S.focus){ const el = document.getElementById('le-' + S.focus); S.focus = null; if (el) setTimeout(() => el.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'}), 30); }
}
// Nếu dựng màn hình bị lỗi (dữ liệu đã lưu hỏng, hoặc lỗi của app), hiện cách khôi phục thay vì để trang trắng.
function route(){
  try { routeInner(); }
  catch (e) {
    view.innerHTML = `<div class="page"><div class="panel"><h1>Không hiển thị được trang này</h1><p class="muted measure">Có thể dữ liệu đã lưu trên máy bị hỏng. Hãy xuất tệp sao lưu để giữ lại, rồi xóa dữ liệu và bắt đầu lại.</p><p class="small err" id="crash-msg"></p><h2>Dữ liệu của bạn</h2>${dataPanelHTML()}<div class="actions"><a class="btn primary" href="#chan-doan">Về trang chính</a></div></div></div>`;
    document.getElementById('crash-msg').textContent = 'Chi tiết lỗi: ' + String(e && e.message || e).slice(0, 200);
    try { bindData(); } catch (e2) { /* bảng dữ liệu không dựng được thì vẫn giữ thông báo */ }
  }
}
let ready = false;   // chưa nạp xong dữ liệu đã lưu thì chưa vẽ trang
window.addEventListener('hashchange', () => { if (!ready) return; route(); if (!S.focus) window.scrollTo(0,0); });
async function boot(){ let d = null; try { d = await window.KHKT_DB.init(); } catch(e){} applyState(d); ready = true; route(); }
const guideSeen = () => { try{ return !!localStorage.getItem('khkt-guide'); }catch(e){ return true; } };
const welcomeHTML = () => `<div class="welcome" id="welcome" role="note"><p>Lần đầu dùng Sổ tay Toán? Xem hướng dẫn 1 phút để biết nên bắt đầu từ đâu.</p>
  <div class="btn-row"><a class="btn sm primary" href="#huong-dan">Xem hướng dẫn</a><button type="button" class="btn sm" id="b-welcome-x">Để sau</button></div></div>`;
const STEP_GUIDE = [
  ['Chẩn đoán', '15–20 phút', 'Tìm đúng bài đang hổng', ['Chọn bộ sách, lớp và các chương đã học xong.', 'Trả lời 10 câu ngắn về cách học.', 'Mỗi bài học làm 1 câu. Không biết thì chọn “Chưa biết cách làm”, đừng đoán.'], '#chan-doan', 'Bắt đầu chẩn đoán'],
  ['Sổ tay', '2 phút đọc', 'Biết cần ôn gì, theo thứ tự nào', ['Bản đồ lỗ hổng: ô đỏ là bài cần ôn.', 'Lộ trình 4 tuần, mỗi tuần 3 buổi, mỗi buổi 1 bài.', 'Gợi ý riêng theo thói quen học và sổ lỗi sai.'], '#so-tay', 'Mở sổ tay'],
  ['Ôn tập', '20–30 phút mỗi buổi', 'Ôn đúng bài đang hổng', ['Đọc “Kiến thức cần nhớ”, xem video gợi ý nếu cần.', 'Làm từ Nhận biết đến Thông hiểu rồi Vận dụng; bấm Kiểm tra để chấm.', 'Bí thì bấm Gợi ý để xem hướng đi; câu sai tự vào mục Ôn lại sau 1, 3, 7 ngày.'], '#on-tap', 'Vào ôn tập'],
  ['Đề thi', '90 phút', 'Tự kiểm tra như thi thật', ['Học xong chương nào, làm đề của chương đó.', 'Đề tốt nghiệp có 4 mức: chuẩn, dễ, khó, mục tiêu.', 'Nộp bài để chấm theo cách của Bộ, xem lời giải và bài cần ôn.'], '#de-thi', 'Làm đề thi'],
];
function viewGuide(){
  return `<div class="page"><div class="page-head"><h1>Hướng dẫn sử dụng</h1>
    <p class="lead measure muted">Sổ tay Toán giúp bạn tìm đúng bài đang hổng, ôn đúng bài đó rồi kiểm tra bằng đề thi. Làm lần lượt 4 bước dưới đây.</p></div>
    <div class="guide-steps">${STEP_GUIDE.map(([t, time, goal, items, href, cta], i) => `<section class="gstep" aria-labelledby="g-${i}"><div class="gn"><b>${i+1}</b><span>${time}</span></div>
      <h2 id="g-${i}">${t}: ${goal.toLowerCase()}</h2><ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul><a class="btn ${i===0?'primary':''}" href="${href}">${cta}${i===0?' '+ARROW:''}</a></section>`).join('')}</div>
    <section class="panel" aria-labelledby="g-tip"><h2 id="g-tip">Mẹo học hiệu quả</h2><ul>
      <li>Tự làm ít nhất 5 phút rồi mới bấm Gợi ý; đọc hướng đi trước, lời giải sau.</li>
      <li>Câu sai thì chọn loại lỗi (tính nhầm, sai công thức, hiểu sai đề, chưa biết hướng) để sổ lỗi nhắc bạn.</li>
      <li>Ôn đều 3 buổi mỗi tuần thay vì dồn trước ngày kiểm tra; sau 4 tuần làm lại bài chẩn đoán.</li>
      <li>Quên công thức thì mở mục <a class="link" href="#cong-thuc">Công thức</a>: có đủ công thức theo từng chương và một phần nâng cao riêng.</li></ul></section>
    <section class="stack" aria-labelledby="g-inst"><h2 id="g-inst">Cài lên điện thoại và máy tính</h2>
      <div class="install-grid">
        <div><h3>Android</h3><p>Mở trang bằng Chrome, bấm menu ⋮ rồi chọn <b>Cài đặt ứng dụng</b> hoặc <b>Thêm vào màn hình chính</b>.</p></div>
        <div><h3>iPhone, iPad</h3><p>Mở trang bằng Safari, bấm nút Chia sẻ rồi chọn <b>Thêm vào MH chính</b>.</p></div>
        <div><h3>Máy tính</h3><p>Mở bằng Chrome hoặc Edge, bấm nút <b>Cài app</b> ở góc trên hoặc biểu tượng cài đặt trên thanh địa chỉ.</p></div>
      </div>
      <p class="muted small measure">Sau lần mở đầu tiên, app dùng được cả khi không có mạng. Kết quả chỉ lưu trên máy của bạn, không cần tài khoản; xóa dữ liệu trình duyệt sẽ mất tiến độ.</p></section>
    <section class="panel" aria-labelledby="g-data"><h2 id="g-data">Dữ liệu của bạn</h2>${dataPanelHTML()}</section>
  </div>`;
}
function go(hash){ if (location.hash === '#' + hash) route(); else location.hash = hash; }
const rerender = () => { const y = window.scrollY; route(); window.scrollTo(0, y); };
const errLine = () => S.err ? `<p class="err" role="alert">${esc(S.err)}</p>` : '';

// ---------- 1. Chẩn đoán ----------
function previewFrame(){
  const wrong = new Set(SAMPLE_WRONG);
  const ids = ['10-III','10-VI','11-I','11-II','11-IV'].filter(id => ALLCH[id]);
  const rows = ids.map(id => { const ch = ALLCH[id]; const nw = ch.lessons.filter(l => wrong.has(l.id)).length;
    return `<div class="pv-row"><div><b>Lớp ${ch.g} · Chương ${esc(ch.so)}</b><span class="t">${esc(ch.ten)}</span><div class="dots">${ch.lessons.map(l => `<i class="${wrong.has(l.id)?'no':'ok'}"></i>`).join('')}</div></div><span class="tag ${nw?'warn':'good'}">${nw?`Ôn ${nw} bài`:'Ổn'}</span></div>`; }).join('');
  const weak = ids.flatMap(id => ALLCH[id].lessons.filter(l => wrong.has(l.id)));
  const plan = [0,1,2,3].map(w => { const s = weak.slice(w*2, w*2+2); return `<div><b>Tuần ${w+1}</b>${s.length ? s.map(l => esc(l.ten.split('.')[0])).join(', ') : 'Đề thi thử'}</div>`; }).join('');
  return `<div class="app-frame"><div class="af-bar"><span>Sổ tay học Toán của bạn</span><span class="tag">Lớp 11 · Đúng ${ids.reduce((n,id)=>n+ALLCH[id].lessons.length,0)-weak.length}/${ids.reduce((n,id)=>n+ALLCH[id].lessons.length,0)}</span></div>
    <div class="af-body"><span class="label">Bản đồ lỗ hổng theo bài học</span>${rows}<span class="label" style="margin-top:12px">Lộ trình ôn 4 tuần</span><div class="af-plan">${plan}</div></div></div>`;
}
function hero(){
  const nLe = Object.keys(ALLLE).length;
  return `<section class="hero" aria-labelledby="h-hero"><div class="hero-text">
    <h1 id="h-hero">Sổ tay học Toán cho học sinh <em>lớp 11 và 12</em></h1>
    <p class="lead">Chẩn đoán đúng bài đang hổng, ôn theo lộ trình 4 tuần, luyện đề thi thử.</p>
    <p class="fact">${nLe} bài học lớp 10–12 · đề thi thử 22 câu theo cấu trúc mới</p>
    <div class="btn-row"><button class="btn primary" type="button" id="b-start">Bắt đầu chẩn đoán ${ARROW}</button><button class="btn" type="button" id="b-sample">Xem sổ tay mẫu</button></div>
    <div class="how" aria-label="Cách dùng"><div><b>1</b>Làm 1 câu cho mỗi bài đã học</div><div><b>2</b>Nhận bản đồ lỗ hổng, lộ trình</div><div><b>3</b>Ôn đúng bài, làm đề thi</div></div>
  </div><div class="hero-visual" aria-hidden="true">${previewFrame()}</div></section>`;
}
// Hình minh họa tự vẽ (hinh.js), gắn theo khóa câu.
const figHTML = key => { const s = (window.KHKT_HINH || {})[key]; return s ? `<figure class="fig">${s}</figure>` : ''; };
// Video: mở kết quả tìm kiếm YouTube đúng tên bài theo bộ sách đang chọn (không gắn cứng một video, tránh link chết).
const YT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="M10 9l5 3-5 3z" fill="#fff"/></svg>';
const ytUrl = (l, ch) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`Toán ${(ALLCH[l.ch]||{}).g || ''} ${leT(l, ch)} ${BOOKS[bookOf()].ngan}`.replace(/\s+/g, ' ').trim());
function stepper(){
  const steps = ['Chọn chương đã học','Thói quen học','Bài chẩn đoán'];
  return `<ol class="stepper" aria-label="Các bước chẩn đoán">${steps.map((s,i) => `<li class="${i<S.step?'done':i===S.step?'now':''}" ${i===S.step?'aria-current="step"':''}><span class="n">${i<S.step?'✓':i+1}</span><span>${s}</span></li>`).join('')}</ol>`;
}
function viewDiag(){
  if (S.step === 0) return hero() + `<section class="page" id="chon-chuong" style="padding-top:0">${stepper()}<div class="panel">${stepChoose()}</div></section>`;
  if (S.step === 1) return `<section class="page">${stepper()}<div class="panel">${stepHabits()}</div></section>`;
  return `<section class="page">${stepper()}<div class="panel">${stepQuiz()}</div></section>`;
}
function stepChoose(){
  const chs = chaptersOf(S.grade); const ids = diagChapters(); const nq = ids.reduce((s,id) => s + ALLCH[id].lessons.length, 0);
  return `<div class="stack"><h2>Các chương bạn đã học xong</h2>
</div>
  <div class="grid2">
    <div class="field"><label for="f-book">Bộ sách</label><select id="f-book">${bookOptions()}</select></div>
    <div class="field"><label for="f-grade">Lớp</label><select id="f-grade"><option value="11" ${S.grade===11?'selected':''}>Lớp 11</option><option value="12" ${S.grade===12?'selected':''}>Lớp 12</option></select></div>
  </div>
  <div class="checks">${chs.map(c => `<label class="choice ${S.done.has(c.id)?'sel':''}"><input type="checkbox" id="ck-${c.id}" data-ch="${c.id}" ${S.done.has(c.id)?'checked':''}><span>Chương ${c.so}. ${esc(c.ten)} <span class="muted small">· ${c.lessons.length} bài</span></span></label>`).join('')}</div>
  <label class="choice ${S.found?'sel':''}"><input type="checkbox" id="ck-found" ${S.found?'checked':''}><span>Kiểm tra cả kiến thức nền của lớp dưới: ${FOUND[S.grade].map(id => esc(chName(ALLCH[id]))).join('; ')}</span></label>
  <div class="summary"><b>Bài chẩn đoán: ${nq} câu, khoảng ${Math.max(5, Math.round(nq*0.8))} phút</b><span class="muted small">${ids.length ? ids.map(id => esc(chName(ALLCH[id]))).join(' · ') : 'Chưa chọn chương nào'}</span></div>
  ${errLine()}
  <div class="actions"><button class="btn primary end" type="button" id="b-next0">Tiếp tục ${ARROW}</button></div>`;
}
const bookOptions = () => Object.entries(BOOKS).map(([k,b]) => `<option value="${k}" ${k===bookOf()?'selected':''}>${esc(b.ten)}</option>`).join('');
const habitVisible = h => !h.showIf || h.showIf(S);
function habitInput(h){
  const v = S.h[h.id];
  if (h.type==='scale') return `<div class="scale" role="radiogroup" aria-label="${esc(h.t)}">${[1,2,3,4,5].map(n => `<label class="${v===n?'sel':''}"><input type="radio" name="h-${h.id}" id="h-${h.id}-${n}" value="${n}" ${v===n?'checked':''} data-h="${h.id}" data-t="scale">${n}</label>`).join('')}</div><div class="scale-ends"><span>${esc(h.ends[0])}</span><span>${esc(h.ends[1])}</span></div>`;
  const multi = h.type==='many';
  return `<div class="choices">${h.o.map((o,i) => { const on = multi ? (v||[]).includes(i) : v===i; return `<label class="choice ${on?'sel':''}"><input type="${multi?'checkbox':'radio'}" name="h-${h.id}" id="h-${h.id}-${i}" value="${i}" ${on?'checked':''} data-h="${h.id}" data-t="${h.type}"><span>${esc(o)}</span></label>`; }).join('')}</div>`;
}
function stepHabits(){
  return `<div class="stack"><h2>Thói quen học Toán của bạn</h2><p class="muted">10 câu · không có đúng sai.</p></div>
  ${HABITS.filter(habitVisible).map(h => `<div class="q"><div class="qtitle">${esc(h.t)}</div>${habitInput(h)}</div>`).join('')}
  ${errLine()}
  <div class="actions"><button class="btn" type="button" id="b-back1">Quay lại</button><button class="btn primary" type="button" id="b-next1">Làm bài chẩn đoán ${ARROW}</button></div>`;
}
function stepQuiz(){
  const ids = diagChapters();
  return `<div class="stack"><h2>Bài chẩn đoán</h2><p class="muted measure">Mỗi câu ứng với một bài. Không chắc thì chọn <b>Chưa biết cách làm</b>, đừng đoán.</p></div>
  ${ids.map(id => { const ch = ALLCH[id]; return `<div class="group-head"><h3>${esc(chName(ch))}</h3>${FOUND[S.grade].includes(id)?'<span class="label">Kiến thức nền của lớp dưới</span>':''}</div>
    ${ch.lessons.map(l => { const q = l.d, v = S.ans[l.id], key = l.id + '#d'; return `<div class="q"><div class="row"><span class="tag">${esc(leT(l, ch).split('.')[0])}</span><span class="muted small">${esc(shortLe(l))}</span></div><div class="qtitle">${mt(q.q)}</div>${figHTML(key)}
      <div class="choices">${order(key, q).map((oi,pos) => `<label class="choice ${v===oi?'sel':''}"><input type="radio" name="a-${l.id}" id="a-${l.id}-${oi}" value="${oi}" ${v===oi?'checked':''} data-a="${l.id}"><span>${LETTER(pos)}. ${mt(q.o[oi])}</span></label>`).join('')}<label class="choice idk ${v===-1?'sel':''}"><input type="radio" name="a-${l.id}" id="a-${l.id}-x" value="-1" ${v===-1?'checked':''} data-a="${l.id}"><span>Chưa biết cách làm</span></label></div></div>`; }).join('')}`; }).join('')}
  ${errLine()}
  <div class="actions"><button class="btn" type="button" id="b-back2">Quay lại</button><button class="btn primary" type="button" id="b-next2">Tạo sổ tay của tôi ${ARROW}</button></div>`;
}
function finishDiag(){
  const ids = diagChapters();
  const lessons = {};
  ids.forEach(id => ALLCH[id].lessons.forEach(l => { lessons[l.id] = S.ans[l.id] === l.d.a; }));
  S.result = {grade:S.grade, chapters:ids, lessons, h:{...S.h}, date:new Date().toLocaleDateString('vi-VN')};
  save();
}

// ---------- 2. Ôn theo chương ----------
function pracStat(ch){ let done=0, ok=0, tot=0, mast=0; ch.lessons.forEach(l => { if (lessonProg(l).mastered) mast++; l.ex.forEach((e,i) => { tot++; const r = S.prac[l.id+'#'+i]; if (r){ done++; if (r.ok) ok++; } }); }); return {done, ok, tot, mast}; }
function reviewBanner(){
  const n = dueKeys().length, tot = Object.keys(S.rv).length;
  if (!tot) return '';
  return `<a class="rv-banner ${n?'due':''}" href="#on-lai"><b>${n ? `${n} câu cần ôn lại hôm nay` : `Ôn lại · ${tot} câu đang chờ`}</b>${ARROW}</a>`;
}
function viewChapters(){
  const w = weakSet();
  const block = (g, label) => `<section class="grade-block" aria-labelledby="g-${g}"><h2 id="g-${g}">${label}</h2><div class="cards">${chaptersOf(g).map(ch => { const st = pracStat(ch); const nw = ch.lessons.filter(l => w.has(l.id)).length;
    return `<a class="card" href="#on-tap-${ch.id}"><span class="row"><span class="tag">Chương ${ch.so}</span>${nw?`<span class="tag warn">${nw} bài cần ôn</span>`:''}${st.mast?`<span class="tag good">Vững ${st.mast}/${ch.lessons.length} bài</span>`:''}</span><span class="ct">${esc(ch.ten)}</span><span class="meta">${ch.lessons.length} bài · đã làm ${st.done}/${st.tot}</span><span class="bar" aria-hidden="true"><i style="width:${Math.round(st.done/st.tot*100)}%"></i></span></a>`; }).join('')}</div></section>`;
  return `<div class="page"><div class="page-head"><h1>Ôn tập theo chương</h1><label class="tg-pick"><span class="muted">Bộ sách</span><select id="f-book2">${bookOptions()}</select></label></div>
    ${reviewBanner()}${block(11, 'Lớp 11')}${block(12, 'Lớp 12')}${block(10, 'Kiến thức nền lớp 10')}</div>`;
}
// Câu thực tế: dòng nhỏ ghi đề thi thử của trường gợi ý dạng bài.
const srcHTML = e => e.tt ? `<div class="qsrc muted small">Thực tế${e.src ? ' · cùng dạng: ' + esc(e.src) : ''}</div>` : e.src ? `<div class="qsrc muted small">Cùng dạng: ${esc(e.src)}</div>` : '';
function exHTML(key, label, link){
  const R = resolveKey(key); if (!R) return '';
  const e = R.it, st = S.prac[key], q = S.rv[key];
  let body = '';
  if (e.t === 'mc') body = `<div class="choices">${order(key, e).map((oi,pos) => `<label class="choice"><input type="radio" name="p-${esc(key)}" value="${oi}"><span>${LETTER(pos)}. ${mt(e.o[oi])}</span></label>`).join('')}</div>`;
  if (e.t === 'tf') body = `<div>${e.s.map((s,si) => `<div class="tfrow" data-row="${si}"><span class="ix">${'abcd'[si]})<i class="lvm" title="${['Nhận biết','Thông hiểu','Thông hiểu','Vận dụng'][si]}">${TF_TAG[si]}</i></span><span>${mt(s[0])}</span><span class="tfbtn"><label><input type="radio" name="p-${esc(key)}-${si}" value="1">Đúng</label><label><input type="radio" name="p-${esc(key)}-${si}" value="0">Sai</label></span></div>`).join('')}</div>`;
  if (e.t === 'sa') body = `<div class="row"><input type="text" inputmode="decimal" id="p-${esc(key)}" placeholder="Ví dụ 2,5" aria-label="Đáp án"> ${e.r?`<span class="muted small">${esc(e.r)}</span>`:''}</div>`;
  const stTag = st ? `<span class="tag ${st.ok && !st.hint ? 'good' : 'warn'}">${st.ok ? (st.hint ? 'Đúng nhờ gợi ý' : 'Đúng') : 'Chưa đúng'}</span>` : '';
  const qTag = q ? `<span class="tag">${q.due <= Date.now() ? 'Ôn lại hôm nay' : 'Ôn lại ' + fmtShort(q.due)}</span>` : '';
  const head = label || stTag || qTag ? `<div class="row">${label ? `<span class="tag">${esc(label)}</span>` : ''}${stTag}${qTag}</div>` : '';
  const lk = link && R.l ? `<a class="lk small" style="align-self:flex-start" href="#on-tap-${chOf(R.l)}" data-jump="${R.l.id}">Xem lại bài: ${esc(shortLe(R.l))}</a>` : '';
  return `<div class="ex" data-key="${esc(key)}">${head}<div class="qtitle">${mt(e.q)}</div>${figHTML(key)}${srcHTML(e)}${body}${hintHTML(key)}<div class="row"><button type="button" class="btn sm" data-check>Kiểm tra</button>${LG[key]?'<button type="button" class="btn sm" data-hint>Gợi ý</button>':''}<span class="res" aria-live="polite"></span></div><div class="solbox" hidden></div>${lk}</div>`;
}
function leTags(l){
  const st = leStatus(l.id), p = lessonProg(l);
  const a = st === 'no' ? '<span class="tag warn">Cần ôn: câu chẩn đoán sai</span>' : st === 'sus' ? `<span class="tag warn">Cần ôn: tự làm đúng ${p.ok}/${p.tot}</span>` : st === 'fix' ? '<span class="tag good">Đã vững sau khi ôn</span>' : '';
  const b = p.done && st !== 'sus' && st !== 'fix' ? `<span class="tag ${p.mastered ? 'good' : ''}">${p.mastered ? 'Đã vững' : `Đúng ${p.ok}/${p.tot} · cần ${p.need}`}</span>` : '';
  return a || b ? `<span class="row">${a}${b}</span>` : '';
}
// Câu của một bài theo mức độ: câu chẩn đoán và bài tập; câu đúng/sai xếp vào Thông hiểu.
function levelGroups(l){
  const items = [[l.id + '#d', l.d], ...l.ex.map((e,i) => [l.id + '#' + i, e])];
  return LEVELS.map(([m, ten]) => { const list = items.filter(([,e]) => e.m === m || (m === 'T' && e.m === 'TF')); if (!list.length) return '';
    const ok = list.filter(([k]) => S.prac[k] && S.prac[k].ok && !S.prac[k].hint).length;
    return `<div class="ex-list lv-${m}"><h4 class="lv-head"><span class="lv-dot" aria-hidden="true"></span>${ten}<span class="muted small">${ok}/${list.length}</span></h4>${list.map(([k]) => exHTML(k, '')).join('')}</div>`; }).join('');
}
function viewChapter(ch){
  const w = weakSet();
  return `<div class="page"><div class="chapter-head"><a class="lk small" href="#on-tap" style="align-self:flex-start">← Danh sách chương</a><h1>${esc(chName(ch))}</h1>${ch.book ? `<span class="muted small">${esc(BOOKS[ch.book].ten)}</span>` : ''}
  <div class="row">${ch.lessons.map(l => `<a class="tag ${w.has(l.id)?'warn':lessonProg(l).mastered?'good':''}" href="#on-tap-${ch.id}" data-jump="${l.id}">${esc(leT(l, ch).split('.')[0])}</a>`).join('')}</div></div>
  ${ch.lessons.map(l => `<article class="lesson" id="le-${l.id}"><div class="lesson-title"><h2>${esc(leT(l, ch))}</h2>${leTags(l)}</div>
    <div class="lesson-meta"><a class="vid" href="${ytUrl(l, ch)}" target="_blank" rel="noopener noreferrer">${YT_ICON}Video bài giảng trên YouTube</a></div>
    <div class="kt"><h4>Kiến thức cần nhớ</h4><ul>${l.kt.map(k => `<li>${esc(k)}</li>`).join('')}</ul></div>
    <details class="review"><summary>Yêu cầu cần đạt</summary><ul class="small">${l.ycc.map(y => `<li>${esc(y)}</li>`).join('')}</ul></details>
    ${levelGroups(l)}
  </article>`).join('')}
  <div class="actions"><a class="btn" href="#on-tap">← Danh sách chương</a><a class="btn primary" href="#de-thi">Luyện đề thi thử ${ARROW}</a></div></div>`;
}
function checkEx(box){
  const key = box.dataset.key, e = resolveKey(key).it, res = box.querySelector('.res'); let ok = false, msg = '';
  if (e.t === 'mc'){ const sel = box.querySelector('input:checked'); if (!sel){ res.innerHTML = '<span class="err">Chọn một đáp án.</span>'; return; }
    ok = +sel.value === e.a; box.querySelectorAll('.choice').forEach(c => { const v = +c.querySelector('input').value; c.classList.remove('sel'); c.classList.toggle('right', v === e.a); c.classList.toggle('wrong', v === +sel.value && !ok); }); msg = ok ? 'Đúng.' : `Chưa đúng. Đáp án: ${letterOf(key, e)}.`; }
  if (e.t === 'tf'){ let n = 0, miss = 0; box.querySelectorAll('.tfrow').forEach((row, si) => { const sel = row.querySelector('input:checked'); if (!sel){ miss++; return; } const good = (sel.value==='1') === e.s[si][1]; if (good) n++; row.classList.toggle('right', good); row.classList.toggle('wrong', !good); });
    if (miss){ res.innerHTML = '<span class="err">Chọn Đúng hoặc Sai cho cả 4 ý.</span>'; return; }
    ok = n === 4; msg = `Đúng ${n}/4 ý. Đáp án: ${e.s.map((s,si) => 'abcd'[si] + ') ' + (s[1]?'Đ':'S')).join(', ')}.`; }
  if (e.t === 'sa'){ const inp = box.querySelector('input[type=text]'); if (!inp.value.trim()){ res.innerHTML = '<span class="err">Nhập đáp án.</span>'; return; } ok = saCorrect(inp.value, e.a); msg = ok ? 'Đúng.' : `Chưa đúng. Đáp án: ${e.a}.`; }
  // Chỉ lần kiểm tra đầu tiên trong ngày được ghi: sửa đáp án sau khi đã thấy lời giải không biến câu sai thành đúng.
  const now = Date.now(), rec = S.prac[key], hint = box.dataset.hint === '1'; let note = '';
  if (box.dataset.done) note = 'Lần này không tính.';
  else if (rec && dayStart(rec.at) === dayStart(now)) note = 'Hôm nay đã tính lần đầu.';
  else { S.prac[key] = {ok, hint, at:now}; note = reviewAfter(key, ok && !hint); if (ok && hint) note = 'Có xem gợi ý nên chưa tính. ' + note; save(); window.KHKT_DB.log('practice', {key, ok, hint}); }
  box.dataset.done = '1'; if (!ok) box.dataset.wrong = '1';
  res.innerHTML = `<span class="${ok?'ok':'no'}">${esc(msg)}</span>${note ? ` <span class="muted small">${esc(note)}</span>` : ''}`;
  const sol = box.querySelector('.solbox'); sol.hidden = false; sol.innerHTML = solHTML(key, e) + (box.dataset.wrong ? errPick(key) : '');
  const hb = box.querySelector('[data-hint]'); if (hb) hb.remove(); const hn = box.querySelector('.hint'); if (hn) hn.hidden = true;
}
function srcLabel(k){ const r = resolveKey(k); return r.slot ? `Đề thi thử · câu ${r.slot.id}` : `${r.l.ten.split('.')[0]} lớp ${ALLCH[r.l.ch].g}${k.endsWith('#d') ? ' · câu chẩn đoán' : ''}`; }
function viewReview(){
  const due = dueKeys(), wait = Object.entries(S.rv).filter(([k,q]) => q.due > Date.now() && resolveKey(k)).sort((a,b) => a[1].due - b[1].due);
  return `<div class="page"><div class="page-head"><a class="lk small" href="#on-tap" style="align-self:flex-start">← Ôn tập theo chương</a><h1>Ôn lại câu đã sai</h1><p class="muted">Hẹn lại sau 1, 3 rồi 7 ngày.</p></div>
  ${due.length ? `<div class="ex-list">${due.map(k => exHTML(k, srcLabel(k), true)).join('')}</div>` : `<div class="panel empty"><h2>Hôm nay không có câu đến hạn</h2><p class="muted">${wait.length ? `${wait.length} câu đang chờ. Câu gần nhất đến hạn vào ${fmtDay(wait[0][1].due)}.` : 'Khi bạn làm sai một bài tập hoặc một câu trong đề thi thử, câu đó sẽ xuất hiện ở đây từ ngày hôm sau.'}</p><a class="btn" href="#on-tap">Ôn theo chương</a></div>`}
  ${wait.length ? `<details><summary><b>Lịch ôn sắp tới</b> <span class="muted small">· ${wait.length} câu</span></summary><ul class="prose small" style="margin-top:12px">${wait.map(([k,q]) => `<li>${esc(srcLabel(k))}: ${fmtDay(q.due)}, lần ôn ${(+q.box || 0) + 1}/3</li>`).join('')}</ul></details>` : ''}</div>`;
}

// ---------- 3. Đề thi thử ----------
// Đề theo chương: cùng khung đề thi THPT. Phần I: 8 câu Nhận biết, 4 câu Thông hiểu; Phần II: 4 câu đúng/sai
// (ý a Nhận biết, ý b, c Thông hiểu, ý d Vận dụng); Phần III: 6 câu trả lời ngắn mức Vận dụng.
// Kho câu của chương: câu của các bài trong chương và câu đề thi thử thuộc các bài đó (chuong.js bảo đảm đủ số câu).
const CH_PLAN = {N:8, T:4, tf:4, V:6};
function chapterPool(ch){
  const ids = new Set(ch.lessons.map(l => l.id)), P = {N:[], T:[], tf:[], V:[], sT:[]};
  const put = (x, lv) => { const t = typeOf(x.it);
    if (t === 'tf') P.tf.push(x); else if (t === 'mc'){ if (lv === 'N' || lv === 'T') P[lv].push(x); } else (lv === 'V' ? P.V : P.sT).push(x); };
  ch.lessons.forEach(l => [[l.id + '#d', l.d], ...l.ex.map((e,i) => [l.id + '#' + i, e])].forEach(([key, it]) => put({l, it, key}, it.m)));
  SLOTS.forEach(sl => sl.items.forEach((it, i) => { const l = ALLLE[it.le || sl.lessons[0]]; if (!l || !ids.has(l.id)) return;
    put({slot:sl, it, key:sl.id + '#' + i, l}, it.lv === 'kho' ? 'V' : it.muc === 'B' ? 'N' : it.muc === 'H' ? 'T' : typeOf(it) === 'sa' ? 'V' : 'T'); }));
  return P;
}
// Lấy k câu: ưu tiên câu chưa làm, rải đều các bài của chương, không lặp câu trong cùng một đề.
function drawFresh(list, k, rnd, used){
  const out = [], free = list.filter(x => !used.has(x.key));
  const take = arr => { const a = arr.slice().sort(() => rnd() - 0.5), seen = new Set(out.map(x => x.l.id));
    for (const x of a){ if (out.length >= k) break; if (!seen.has(x.l.id) && !out.includes(x)){ out.push(x); seen.add(x.l.id); } }
    for (const x of a){ if (out.length >= k) break; if (!out.includes(x)) out.push(x); } };
  take(free.filter(x => !S.prac[x.key])); if (out.length < k) take(free.filter(x => S.prac[x.key]));
  out.forEach(x => used.add(x.key)); return out;
}
function chapterExam(ch, rnd){
  const P = chapterPool(ch), used = new Set();
  let p1 = [...drawFresh(P.N, CH_PLAN.N, rnd, used), ...drawFresh(P.T, CH_PLAN.T, rnd, used)];
  if (p1.length < 12) p1 = p1.concat(drawFresh([...P.N, ...P.T], 12 - p1.length, rnd, used));
  const p2 = drawFresh(P.tf, CH_PLAN.tf, rnd, used);
  let p3 = drawFresh(P.V, CH_PLAN.V, rnd, used);
  if (p3.length < 6) p3 = p3.concat(drawFresh(P.sT, 6 - p3.length, rnd, used));
  return {p1, p2, p3};
}
// Mức đề: de (Dễ), tn (Chuẩn), kho (Khó), mt (Mục tiêu). Mỗi vị trí câu giữ đúng chủ đề của ma trận đề thật.
const MODE_NAME = {de:'Đề dễ', tn:'Đề chuẩn', kho:'Đề khó', mt:'Đề mục tiêu', ch:'Đề theo chương'};
// Đề mục tiêu: tỉ lệ câu dễ và câu khó theo điểm mục tiêu; điểm cần đạt ở từng phần (tổng bằng mục tiêu).
const TARGET = {5:{e:.5, h:0, plan:[2.25,1.75,1]}, 6:{e:.3, h:.1, plan:[2.5,2,1.5]}, 7:{e:.15, h:.25, plan:[2.75,2.5,1.75]}, 8:{e:0, h:.45, plan:[3,3,2]}, 9:{e:0, h:.65, plan:[3,3.5,2.5]}};
const typeOf = e => e.t || (isMC(e) ? 'mc' : 'sa');
// Câu ứng viên của một vị trí ở một mức: câu riêng của vị trí theo mức, cộng câu cùng dạng trong bài học của vị trí
// (đề dễ: câu Nhận biết, Thông hiểu và câu đúng/sai của bài; đề khó: câu Vận dụng).
function slotPool(sl, lv){
  const t = sl.part === 1 ? 'mc' : sl.part === 2 ? 'tf' : 'sa';
  const own = sl.items.map((it,i) => ({slot:sl, it, key:sl.id + '#' + i, l:ALLLE[it.le || sl.lessons[0]]}));
  const std = own.filter(x => !x.it.lv);
  if (lv === 'tn') return std;
  const fromLe = sl.lessons.filter(id => ALLLE[id]).flatMap(id => { const l = ALLLE[id];
    return [[l.id + '#d', l.d], ...l.ex.map((e,i) => [l.id + '#' + i, e])]
      .filter(([,e]) => typeOf(e) === t && (lv === 'de' ? (t === 'tf' || e.m === 'N' || e.m === 'T') : e.m === 'V'))
      .map(([key, it]) => ({slot:sl, it, key, l})); });
  const list = [...own.filter(x => x.it.lv === lv), ...fromLe];
  return list.length ? list : std;
}
function makeExam(mode, target, chId){
  const seed = Math.floor(Math.random()*1e9) + 1, rnd = seeded(seed);
  // Ưu tiên câu chưa làm lần nào để mỗi đề mới có nhiều câu mới.
  const pickFrom = list => { const fresh = list.filter(x => !S.prac[x.key]), L = fresh.length ? fresh : list; return L[Math.floor(rnd()*L.length)]; };
  let p1, p2, p3;
  let ch = null;
  if (mode === 'ch'){ ch = ALLCH[chId] || chaptersOf(S.grade)[0]; ({p1, p2, p3} = chapterExam(ch, rnd)); }
  else {
    const T = TARGET[target] || TARGET[7], weak = mode === 'mt' ? weakSet() : null;
    const lvOf = sl => { if (mode !== 'mt') return mode;
      // Vị trí rơi vào bài đang hổng: lấy câu vừa sức để gỡ điểm, không lấy câu khó.
      if (sl.lessons.some(id => weak.has(id))) return target <= 6 ? 'de' : 'tn';
      const r = rnd(); return r < T.e ? 'de' : r < T.e + T.h ? 'kho' : 'tn'; };
    const pick = sl => pickFrom(slotPool(sl, lvOf(sl)));
    p1 = SLOTS.filter(x => x.part===1).map(pick); p2 = SLOTS.filter(x => x.part===2).map(pick); p3 = SLOTS.filter(x => x.part===3).map(pick);
  }
  S.exam = {mode, target: mode === 'mt' ? (TARGET[target] ? target : 7) : undefined, ch: ch ? ch.id : undefined, seed, p1, p2, p3, ans:{}, submitted:false, start:null, score:null};
}
const chLabel = id => { const c = ALLCH[id]; return c ? `Chương ${c.so} lớp ${c.g}` : 'Đề theo chương'; };
function examTitle(E){ const c = ALLCH[E.ch]; return E.mode === 'mt' ? `Đề mục tiêu ${E.target} điểm` : E.mode === 'ch' ? (c ? `${chLabel(E.ch)}: ${c.ten}` : 'Đề theo chương') : `${has(MODE_NAME, E.mode) ? MODE_NAME[E.mode] : 'Đề chuẩn'} · thi thử tốt nghiệp THPT`; }
// Đối chiếu điểm từng phần với kế hoạch điểm của mục tiêu.
function targetHTML(E){
  const T = TARGET[E.target]; if (!T || !E.score) return '';
  const sc = E.score, got = [sc.p1, sc.p2, sc.p3], f = v => v.toLocaleString('vi-VN', {maximumFractionDigits:2});
  const ok = sc.total >= E.target, gap = Math.round((E.target - sc.total)*100)/100;
  const worst = got.map((g,i) => [i, T.plan[i] - g]).filter(([,d]) => d > 0).sort((a,b) => b[1] - a[1])[0];
  return `<section class="panel" aria-labelledby="h-tg"><div class="stack"><h2 id="h-tg">${ok ? `Đạt mục tiêu ${+E.target} điểm` : `Chưa đạt mục tiêu ${+E.target} điểm · thiếu ${f(gap)}`}</h2>
    ${worst ? `<p class="muted">Cần gỡ điểm nhất ở Phần ${['I','II','III'][worst[0]]}.</p>` : ''}</div>
    <div class="tablebox"><table><thead><tr><th>Phần</th><th>Cần đạt</th><th>Đạt được</th></tr></thead><tbody>${['I','II','III'].map((p,i) => `<tr><td class="wk">${p}</td><td class="num">${f(T.plan[i])}</td><td class="num ${got[i] >= T.plan[i] ? 'ok' : 'no'}"><b>${f(got[i])}</b></td></tr>`).join('')}</tbody></table></div></section>`;
}
function examStructure(){
  const SL = window.KHKT_EXAM || [];
  const rows = SL.map(sl => `<tr><td class="wk">${sl.id}</td><td>${esc(sl.ten)}</td><td class="small muted">${esc(sl.ref)}</td></tr>`).join('');
  return `<div class="tablebox"><table><thead><tr><th>Phần</th><th>Dạng câu hỏi</th><th>Số câu</th><th>Cách tính điểm</th></tr></thead><tbody>
  <tr><td class="wk">I</td><td>Trắc nghiệm nhiều phương án, chọn 1 đáp án đúng</td><td class="num">12</td><td>0,25 điểm/câu (3 điểm)</td></tr>
  <tr><td class="wk">II</td><td>Trắc nghiệm đúng/sai, mỗi câu 4 ý khó dần</td><td class="num">4</td><td>Đúng 1 ý: 0,1; 2 ý: 0,25; 3 ý: 0,5; 4 ý: 1 điểm (4 điểm)</td></tr>
  <tr><td class="wk">III</td><td>Trả lời ngắn, điền số (tối đa 4 ký tự)</td><td class="num">6</td><td>0,5 điểm/câu (3 điểm)</td></tr></tbody></table></div>
  <details><summary><b>Ma trận 22 vị trí câu của đề thi thử</b> <span class="muted small">· dựng từ đề tham khảo 2025, đề chính thức 2025 và đề 2026</span></summary>
  <div class="tablebox" style="margin-top:12px"><table><thead><tr><th>Câu</th><th>Chủ đề</th><th>Xuất hiện ở</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="small muted" style="margin-top:12px">ĐTK: đề tham khảo của Bộ GD&amp;ĐT; ĐCT: đề chính thức. Mỗi vị trí có 4–6 câu tự soạn cùng dạng ở mức chuẩn, thêm câu mức khó và mức dễ; mỗi lần tạo đề, web app chọn 1 câu cho mỗi vị trí theo mức đề.</p></details>`;
}
function viewExam(){
  const E = S.exam;
  if (!E){ const g = exG || S.grade, best = id => { const r = S.hist.filter(x => x.ch === id); return r.length ? {n:r.length, max:Math.max(...r.map(x => x.total))} : null; };
    return `<div class="page"><div class="page-head"><h1>Đề thi thử</h1></div>
    <section class="stack" aria-labelledby="h-thpt"><div class="page-head-row"><h2 id="h-thpt">Đề thi tốt nghiệp THPT</h2><span class="muted small">22 câu · 90 phút · chấm theo cách tính của Bộ</span></div>
    <div class="mode-cards lv4">
      <div class="mode"><span class="ct">Đề chuẩn</span><p class="muted">Ngang đề thi thật.</p><button class="btn primary" type="button" data-mk="tn">Làm đề chuẩn ${ARROW}</button></div>
      <div class="mode"><span class="ct">Đề dễ</span><p class="muted">Nhận biết, thông hiểu. Khởi động, lấy lại gốc.</p><button class="btn" type="button" data-mk="de">Làm đề dễ</button></div>
      <div class="mode"><span class="ct">Đề khó</span><p class="muted">Vận dụng ở mọi vị trí câu.</p><button class="btn" type="button" data-mk="kho">Làm đề khó</button></div>
      <div class="mode"><span class="ct">Đề mục tiêu</span><label class="tg-pick"><span class="muted">Mục tiêu</span><select id="f-target">${[5,6,7,8,9].map(v => `<option value="${v}" ${v===(S.target||7)?'selected':''}>${v} điểm</option>`).join('')}</select></label><p class="muted small">Độ khó theo mục tiêu; bài đang hổng lấy câu vừa sức.</p><button class="btn" type="button" data-mk="mt">Làm đề mục tiêu</button></div>
    </div></section>
    <section class="stack" aria-labelledby="h-chx"><div class="page-head-row"><h2 id="h-chx">Đề theo chương</h2><label class="tg-pick"><span class="muted">Lớp</span><select id="f-exg">${[10,11,12].map(v => `<option value="${v}" ${v===g?'selected':''}>Lớp ${v}</option>`).join('')}</select></label></div>
    <p class="muted small measure">Mỗi đề 22 câu, 90 phút, cùng khung đề THPT. Phần I: 8 câu nhận biết, 4 câu thông hiểu. Phần II: 4 câu đúng/sai, ý a nhận biết, ý b, c thông hiểu, ý d vận dụng. Phần III: 6 câu vận dụng.</p>
    <div class="mode-cards ch-cards">${chaptersOf(g).map(c => { const r = best(c.id);
      return `<div class="mode"><span class="tag" style="align-self:flex-start">Chương ${c.so}</span><span class="ct">${esc(c.ten)}</span><p class="muted small">${c.lessons.length} bài${r ? ` · đã làm ${r.n} đề · cao nhất ${r.max.toLocaleString('vi-VN')} điểm` : ''}</p><button class="btn" type="button" data-mk="ch" data-ch="${c.id}">Làm đề chương ${c.so}</button></div>`; }).join('')}</div></section>
    ${histHTML()}
    <section class="stack" aria-labelledby="h-struct"><h2 id="h-struct">Cấu trúc đề và cách tính điểm</h2>${examStructure()}</section></div>`; }
  const part = (title, list, kind) => `<section class="panel" id="part-${kind[1]}"><h2>${title}</h2>${list.map((x,qi) => { const k = kind+qi, e = x.it, v = E.ans[k]; const res = E.submitted ? examMark(kind, e, v) : null;
    let body = '';
    if (kind==='p1') body = `<div class="choices">${order(x.key, e).map((oi,pos) => `<label class="choice ${E.submitted ? (oi===e.a?'right':(v===oi?'wrong':'')) : (v===oi?'sel':'')}"><input type="radio" name="x-${k}" value="${oi}" ${v===oi?'checked':''} ${E.submitted?'disabled':''} data-x="${k}"><span>${LETTER(pos)}. ${mt(e.o[oi])}</span></label>`).join('')}</div>`;
    if (kind==='p2') body = `<div>${e.s.map((s,si) => { const vv = (v||{})[si]; const cls = E.submitted ? (vv===undefined?'wrong':((vv===1)===s[1]?'right':'wrong')) : ''; return `<div class="tfrow ${cls}"><span class="ix">${'abcd'[si]})</span><span>${mt(s[0])}${E.submitted?` <span class="muted small">(${s[1]?'Đúng':'Sai'})</span>`:''}</span><span class="tfbtn"><label class="${vv===1?'sel':''}"><input type="radio" name="x-${k}-${si}" value="1" ${vv===1?'checked':''} ${E.submitted?'disabled':''} data-x="${k}" data-si="${si}">Đúng</label><label class="${vv===0?'sel':''}"><input type="radio" name="x-${k}-${si}" value="0" ${vv===0?'checked':''} ${E.submitted?'disabled':''} data-x="${k}" data-si="${si}">Sai</label></span></div>`; }).join('')}</div>`;
    if (kind==='p3') body = `<div class="row"><input type="text" inputmode="decimal" id="x-${k}" value="${esc(v||'')}" ${E.submitted?'disabled':''} data-x="${k}" aria-label="Đáp án câu ${qi+1}"> ${e.r?`<span class="muted small">${esc(e.r)}</span>`:''}${E.submitted?` <span class="${res.full?'ok':'no'}">Đáp án: ${mt(e.a)}</span>`:''}</div>`;
    const cr = critOf(x, kind);
    return `<div class="q"><div class="row"><span class="tag">Câu ${qi+1}</span><span class="muted small">${x.slot ? esc(x.slot.ten) : esc(chName(ALLCH[x.l.ch]).split(' · ')[0]) + ' · ' + esc(shortLe(x.l))}</span>${E.submitted?`<span class="tag ${res.full?'good':'warn'}">${res.pts.toLocaleString('vi-VN')} điểm</span><span class="tag">${kind==='p2'?'Biết → Vận dụng':esc((AN.chuan.mucDo[cr.muc]||{}).ten||'')} · ${esc(cr.nl)}</span>`:''}</div><div class="qtitle">${mt(e.q)}</div>${figHTML(x.key)}${body}${E.submitted?`${srcHTML(e)}${solHTML(x.key, e)}${res.full ? '' : errPick(x.key)}<a class="lk small" style="align-self:flex-start" href="#on-tap-${chOf(x.l)}" data-jump="${x.l.id}">Ôn ${esc(leNo(x.l).toLowerCase())}: ${esc(shortLe(x.l))}</a>`:''}</div>`; }).join('')}</section>`;
  const sc = E.submitted ? E.score : null;
  const pr = examProgress(E), fmt = v => v.toLocaleString('vi-VN', {maximumFractionDigits:2});
  const bar = `<div class="exam-bar" id="exam-bar" role="region" aria-label="Thời gian và tiến độ làm bài">
    ${E.submitted ? `<span class="timer">Đã nộp</span><span class="eb-prog"><b>${fmt(sc.total)}</b>/10 điểm</span>` : `<span class="timer" id="timer" role="timer" aria-label="Thời gian còn lại">${fmtLeft(E)}</span><span class="eb-prog" id="exam-prog"><span class="eb-lbl">Đã làm </span>${pr.n}/${pr.tot} câu</span>`}
    <span class="eb-parts" aria-label="Chuyển nhanh đến phần">${['I','II','III'].map((p,i) => `<button type="button" data-part="${i+1}" aria-label="Đến Phần ${p}">${p}</button>`).join('')}</span>
    <span class="eb-act"><button type="button" class="btn sm" data-close aria-label="Về trang đề thi"><span class="eb-lg">Về trang đề thi</span><span class="eb-sm" aria-hidden="true">← Thoát</span></button>${E.submitted ? '<button type="button" class="btn sm primary" id="b-newexam">Làm đề khác</button>' : '<button type="button" class="btn primary sm" data-submit>Nộp bài</button>'}</span></div>`;
  return `<div class="page">${bar}<div class="panel"><div class="exam-head"><h1 style="font-size:clamp(28px,1.4vw + 20px,40px)">${esc(examTitle(E))}</h1></div>
    ${sc?`<div class="score"><span class="big">${sc.total.toLocaleString('vi-VN', {maximumFractionDigits:2})}</span><span class="muted">/ 10 điểm · Phần I: ${sc.p1.toLocaleString('vi-VN')} · Phần II: ${sc.p2.toLocaleString('vi-VN')} · Phần III: ${sc.p3.toLocaleString('vi-VN')}</span></div>
      ${sc.weak.length?`<p class="prose">Bài nên ôn lại: ${sc.weak.map(id => `<a href="#on-tap-${chOf(ALLLE[id])}" data-jump="${id}">${esc(leTitle(ALLLE[id]))}</a>`).join(' · ')}</p>`:''}`:''}</div>
    ${sc && E.mode === 'mt' ? targetHTML(E) : ''}${sc && E.report ? reportHTML(E.report) : ''}
    ${part('Phần I. Trắc nghiệm nhiều phương án lựa chọn', E.p1, 'p1')}${part('Phần II. Trắc nghiệm đúng/sai', E.p2, 'p2')}${part('Phần III. Trả lời ngắn', E.p3, 'p3')}
    <div class="actions"><button type="button" class="btn" data-close>Về trang đề thi</button>${E.submitted?'':'<button type="button" class="btn primary" data-submit>Nộp bài</button>'}</div></div>`;
}
function examMark(kind, e, v){
  if (kind==='p1'){ const ok = v===e.a; return {pts: ok?0.25:0, full: ok}; }
  if (kind==='p2'){ let n = 0; e.s.forEach((s,si) => { if ((v||{})[si]!==undefined && ((v||{})[si]===1)===s[1]) n++; }); return {pts:[0,0.1,0.25,0.5,1][n], full: n===4}; }
  const ok = v!==undefined && saCorrect(v, e.a); return {pts: ok?0.5:0, full: ok};
}
function submitExam(){
  const E = S.exam, now = Date.now(); let p1=0,p2=0,p3=0; const weak = new Set();
  // Câu chưa trọn điểm vào lịch ôn lại; kết quả từng câu được ghi như một lần làm độc lập (đề thi không có hướng đi).
  const mark = (kind, x, i) => { const r = examMark(kind, x.it, E.ans[kind+i]); if (!r.full) weak.add(x.l.id);
    const rec = S.prac[x.key]; if (!rec || dayStart(rec.at) < dayStart(now)) S.prac[x.key] = {ok:r.full, hint:false, at:now};
    reviewAfter(x.key, r.full); return r.pts; };
  E.p1.forEach((x,i) => { p1 += mark('p1', x, i); });
  E.p2.forEach((x,i) => { p2 += mark('p2', x, i); });
  E.p3.forEach((x,i) => { p3 += mark('p3', x, i); });
  const rnd = v => Math.round(v*100)/100;
  E.score = {p1:rnd(p1), p2:rnd(p2), p3:rnd(p3), total:rnd(p1+p2+p3), weak:[...weak]}; E.submitted = true;
  E.report = buildReport(E);
  const weakT = Object.entries(E.report.topic).filter(([,p]) => p[0]/p[1] < .5).sort((a,b) => a[1][0]/a[1][1] - b[1][0]/b[1][1]).slice(0,3).map(([t]) => t);
  S.hist.push({at:now, mode:E.mode, target:E.target, ch:E.ch, total:E.score.total, p1:E.score.p1, p2:E.score.p2, p3:E.score.p3, weak:weakT});
  if (S.hist.length > 30) S.hist.shift();
  save(); window.KHKT_DB.log('exam', {mode:E.mode, score:E.score.total, n:E.p1.length + E.p2.length + E.p3.length});
}
function histHTML(){
  const hs = histSummary(); if (!hs) return '';
  return `<section class="panel" aria-labelledby="h-hist"><div class="stack"><h2 id="h-hist">Kết quả các lần làm đề</h2><p class="measure">${esc(hs.line)}</p></div>
    <div class="tablebox"><table><thead><tr><th>Ngày</th><th>Loại đề</th><th>Tổng</th><th>Phần I</th><th>Phần II</th><th>Phần III</th><th>Mặt kiến thức yếu nhất</th></tr></thead><tbody>${S.hist.slice(-8).reverse().map(r => `<tr><td>${new Date(r.at).toLocaleDateString('vi-VN')}</td><td>${esc(histMode(r))}</td><td class="num"><b>${hs.f(r.total)}</b></td><td class="num">${hs.f(r.p1)}</td><td class="num">${hs.f(r.p2)}</td><td class="num">${hs.f(r.p3)}</td><td class="small">${r.weak.length ? r.weak.map(t => esc(topicName(t))).join('; ') : '—'}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function critOf(x, kind){
  const sl = x.slot, it = x.it;
  const topic = it.tp || (sl && sl.topics ? sl.topics[0] : null) || LESSON_TOPIC[x.l.id] || ('ch:' + x.l.ch);
  return {topic, muc: it.muc || ({N:'B', T:'H', V:'VD'})[it.m] || (sl && sl.muc) || (kind==='p1' ? 'H' : 'VD'), nl: it.nl || (sl && sl.nl) || (kind==='p1' ? 'TD' : 'GQ')};
}
function buildReport(E){
  const R = {muc:{B:[0,0],H:[0,0],VD:[0,0]}, nl:{TD:[0,0],GQ:[0,0],MH:[0,0]}, topic:{}};
  const add = (o, k, ok) => { if (!o[k]) o[k] = [0,0]; o[k][1]++; if (ok) o[k][0]++; };
  [['p1',E.p1],['p2',E.p2],['p3',E.p3]].forEach(([kind, list]) => list.forEach((x,i) => {
    const c = critOf(x, kind), v = E.ans[kind+i];
    if (kind === 'p2') x.it.s.forEach((s,si) => { const vv = (v||{})[si]; const ok = vv !== undefined && (vv===1) === s[1]; add(R.muc, TF_LEVEL[si], ok); add(R.nl, c.nl, ok); add(R.topic, c.topic, ok); });
    else { const ok = examMark(kind, x.it, v).full; add(R.muc, c.muc, ok); add(R.nl, c.nl, ok); add(R.topic, c.topic, ok); }
  }));
  return R;
}
function grade(r){ return AN.chuan.xepLoai.find(g => r >= g.tu) || {ten:'', mota:''}; }
function statRow(label, sub, pair, href){
  const r = pair[1] ? pair[0]/pair[1] : 0, g = grade(r), cls = r >= .8 ? 'good' : r < .5 ? 'warn' : '';
  return `<div class="stat-row"><div class="lb">${href?`<a class="lk" href="${href}">${esc(label)}</a>`:esc(label)}${sub?`<small>${esc(sub)}</small>`:''}</div><div class="meter ${cls}" aria-hidden="true"><i style="width:${Math.round(r*100)}%"></i></div><div class="val">${pair[0]}/${pair[1]}<span class="tag ${cls}">${esc(g.ten)}</span></div></div>`;
}
function topicName(t){ if (AN.topics[t]) return AN.topics[t].ten; if (t.startsWith('ch:') && ALLCH[t.slice(3)]) return chName(ALLCH[t.slice(3)]); return t; }
function topicHref(t){ const tp = AN.topics[t]; const lid = tp ? tp.lessons.find(id => ALLLE[id]) : null; if (lid) return `#on-tap-${chOf(ALLLE[lid])}`; if (t.startsWith('ch:')) return `#on-tap-${t.slice(3)}`; return ''; }
function reportHTML(R){
  const C = AN.chuan;
  const topics = Object.entries(R.topic).sort((a,b) => a[1][0]/a[1][1] - b[1][0]/b[1][1]);
  return `<section class="panel" aria-labelledby="h-rep"><div class="stack"><h2 id="h-rep">Đánh giá theo tiêu chí</h2><p class="muted small">Tốt ≥ 80% · Đạt ≥ 50%</p></div>
    <div class="grid2"><div><h4>Theo mức độ tư duy</h4>${['B','H','VD'].filter(k => R.muc[k][1]).map(k => statRow(C.mucDo[k].ten, C.mucDo[k].mota, R.muc[k])).join('')}</div>
    <div><h4>Theo năng lực toán học</h4>${['TD','GQ','MH'].filter(k => R.nl[k][1]).map(k => statRow(C.nangLuc[k].ten, '', R.nl[k])).join('')}</div></div>
    <div><h4>Theo mặt kiến thức, yếu nhất trước</h4>${topics.map(([t,p]) => statRow(topicName(t), '', p, topicHref(t))).join('')}</div></section>`;
}
let timerId = null, exG = 0;
const EXAM_SEC = 5400;
function leftSec(E){ return Math.max(0, EXAM_SEC - Math.floor((Date.now() - E.start)/1000)); }
function fmtLeft(E){ const left = E.start ? leftSec(E) : EXAM_SEC; return `${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`; }
function examProgress(E){
  let n = 0;
  E.p1.forEach((x,i) => { if (E.ans['p1'+i] !== undefined) n++; });
  E.p2.forEach((x,i) => { const v = E.ans['p2'+i] || {}; if (x.it.s.every((s,si) => v[si] !== undefined)) n++; });
  E.p3.forEach((x,i) => { if (String(E.ans['p3'+i] || '').trim()) n++; });
  return {n, tot: E.p1.length + E.p2.length + E.p3.length};
}
function paintProgress(){ const el = document.getElementById('exam-prog'); if (el && S.exam){ const p = examProgress(S.exam); el.innerHTML = `<span class="eb-lbl">Đã làm </span>${p.n}/${p.tot} câu`; } }
function tick(){ const el = document.getElementById('timer'); if (!el || !S.exam || S.exam.submitted) { clearInterval(timerId); timerId = null; return; } const left = leftSec(S.exam); el.textContent = fmtLeft(S.exam); const bar = el.closest('.exam-bar'); if (bar) bar.classList.toggle('low', left <= 300); if (left === 0){ submitExam(); rerender(); } }

// ---------- 3b. Phân tích đề ----------
function topicStats(){
  const st = {};
  Object.keys(AN.topics).forEach(k => st[k] = {k, n:0, bo:0, so:0, ex:0, pos:{I:0,II:0,III:0}, per:{}});
  AN.exams.forEach(e => { const seen = new Set();
    [['I',e.p1],['II',e.p2],['III',e.p3]].forEach(([p, arr]) => arr.forEach(t => { if (!t || !st[t]) return; const s = st[t]; s.n++; s.pos[p]++; s[e.loai==='Bộ'?'bo':'so']++; s.per[e.id] = (s.per[e.id]||0) + 1; seen.add(t); }));
    seen.forEach(t => st[t].ex++); });
  return Object.values(st).sort((a,b) => b.ex - a.ex || b.n - a.n);
}
const prioOf = s => { const r = s.ex / Math.max(1, AN.exams.length); return r >= .75 ? {c:'p3', t:'Ưu tiên rất cao'} : r >= .44 ? {c:'p2', t:'Ưu tiên cao'} : {c:'p1', t:'Nên biết'}; };
function viewAnalysis(){
  const C = AN.chuan, S2 = topicStats(), N = AN.exams.length;
  const total = AN.exams.reduce((s,e) => s + [...e.p1,...e.p2,...e.p3].filter(Boolean).length, 0);
  const groups = {}; const grades = {};
  S2.forEach(s => { const t = AN.topics[s.k]; groups[t.nhom] = (groups[t.nhom]||0) + s.n; grades[t.lop] = (grades[t.lop]||0) + s.n; });
  const pct = v => Math.round(v/total*100) + '%';
  const shortName = e => e.ten.replace('Sở GD&ĐT ','').replace('Đề chính thức','ĐCT').replace('Đề tham khảo','ĐTK').replace(/,? ?(khảo sát )?lần /,' L').replace(' (đề gốc thứ nhất)',' (1)').replace(', mã đề 101',' (101)');
  const lessonTags = t => t.lessons.filter(id => ALLLE[id]).map(id => `<a class="tag" href="#on-tap-${chOf(ALLLE[id])}" data-jump="${id}">${esc(ALLLE[id].ten.split('.')[0])} · lớp ${ALLCH[ALLLE[id].ch].g}</a>`).join('');
  return `<div class="page"><div class="page-head"><a class="lk small" href="#de-thi" style="align-self:flex-start">← Đề thi thử</a><h1>Phân tích ${N} đề thi: mặt kiến thức cần học</h1>
    <p class="muted measure">${total} câu từ ${AN.exams.filter(e=>e.loai==='Bộ').length} đề của Bộ GD&amp;ĐT và ${AN.exams.filter(e=>e.loai==='Sở').length} đề khảo sát của các Sở được gán vào ${Object.keys(AN.topics).length} mặt kiến thức. Mặt kiến thức có trong càng nhiều đề thì càng nên học trước.</p></div>

  <section class="stack" aria-labelledby="h-chuan"><h2 id="h-chuan">Chuẩn đánh giá chung</h2>
    <p class="muted measure">Mỗi câu gắn mức độ, năng lực và mặt kiến thức; bài nộp được chấm theo cả ba.</p>
    <div class="crit">
      <div class="mode"><span class="ct">Mức độ tư duy</span><dl>${Object.values(C.mucDo).map(m => `<div><dt>${esc(m.ten)}</dt><dd>${esc(m.mota)}</dd></div>`).join('')}</dl></div>
      <div class="mode"><span class="ct">Năng lực toán học</span><dl>${Object.values(C.nangLuc).map(m => `<div><dt>${esc(m.ten)}</dt><dd>${esc(m.mota)}</dd></div>`).join('')}</dl></div>
      <div class="mode"><span class="ct">Khung theo phần của đề</span><dl>${Object.entries(C.phan).map(([k,m]) => `<div><dt>Phần ${'I'.repeat(+k)} · ${esc(m.muc)} · ${esc(m.nl)}</dt><dd>${esc(m.note)}</dd></div>`).join('')}</dl></div>
    </div>
    <ul class="small muted">${C.canCu.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>

  <section class="panel" aria-labelledby="h-rank"><div class="stack"><h2 id="h-rank">Thứ tự ưu tiên ôn tập</h2><p class="muted measure">Ưu tiên rất cao: có trong ít nhất 7/${N} đề. Ưu tiên cao: 4 đến 6 đề. Bấm vào bài học để ôn.</p></div>
    <div class="rank-list">${S2.filter(s => s.n).map((s,i) => { const t = AN.topics[s.k], p = prioOf(s); const pos = Object.entries(s.pos).filter(([,v]) => v).map(([k,v]) => `Phần ${k}: ${v}`).join(' · ');
      return `<div class="rank"><span class="no-r">${i+1}</span><div><div class="t">${esc(t.ten)}</div><div class="m">${esc(t.nhom)} · lớp ${t.lop} · có trong ${s.ex}/${N} đề · ${s.n} câu (${pos})</div><div class="ls">${lessonTags(t) || '<span class="small muted">Chưa có bài trong web app</span>'}</div></div><span class="prio ${p.c}">${p.t}</span></div>`; }).join('')}</div></section>

  <section class="grid2" aria-label="Tỉ lệ theo nhóm và theo lớp">
    <div class="panel"><h3>Theo nhóm kiến thức</h3><div>${Object.entries(groups).sort((a,b)=>b[1]-a[1]).map(([g,v]) => `<div class="stat-row"><div class="lb">${esc(g)}</div><div class="meter"><i style="width:${Math.round(v/total*100)}%"></i></div><div class="val">${v} câu · ${pct(v)}</div></div>`).join('')}</div></div>
    <div class="panel"><h3>Theo lớp</h3><div>${Object.entries(grades).sort((a,b)=>b[0]-a[0]).map(([g,v]) => `<div class="stat-row"><div class="lb">Lớp ${g}</div><div class="meter"><i style="width:${Math.round(v/total*100)}%"></i></div><div class="val">${v} câu · ${pct(v)}</div></div>`).join('')}</div></div>
  </section>

  <section class="stack" aria-labelledby="h-heat"><h2 id="h-heat">Ma trận mặt kiến thức theo từng đề</h2><p class="muted measure">Mỗi ô là số câu của mặt kiến thức đó trong đề. Dấu * là đề có câu phân loại chưa chắc chắn do file đề mất công thức.</p>
    <div class="tablebox"><table class="heat"><thead><tr><th>Mặt kiến thức</th>${AN.exams.map(e => `<th title="${esc(e.ten)}">${esc(shortName(e))}${e.c.length?'*':''}</th>`).join('')}<th>Tổng</th></tr></thead><tbody>
    ${S2.filter(s => s.n).map(s => `<tr><td>${esc(AN.topics[s.k].ten)}</td>${AN.exams.map(e => { const v = s.per[e.id]||0; return `<td class="c${Math.min(v,3)}">${v||'·'}</td>`; }).join('')}<td><b>${s.n}</b></td></tr>`).join('')}
    </tbody></table></div></section>

  <section class="stack" aria-labelledby="h-src"><h2 id="h-src">Nguồn đề</h2><ul class="prose small">${AN.exams.map(e => `<li>${esc(e.ten)} · ${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.nguon)}</a>`:esc(e.nguon)}${e.c.length?` · phân loại chưa chắc: câu ${e.c.join(', ')}`:''}${[...e.p1,...e.p2,...e.p3].includes(null)?' · có câu chưa phân loại được':''}</li>`).join('')}</ul></section>
  <div class="actions"><a class="btn" href="#de-thi">← Đề thi thử</a><a class="btn primary" href="#on-tap">Ôn theo chương ${ARROW}</a></div></div>`;
}

// ---------- 4. Sổ tay ----------
function rules(h, nWeak){
  const r = []; const add = (code, why, tip) => r.push({code, why, tip});
  if ([1,2,3].includes(h.on)) add('R1','Bạn thường ôn sát ngày kiểm tra.','Câu làm sai được tự hẹn làm lại sau 1, 3 và 7 ngày. Mở mục Ôn lại mỗi ngày, khoảng 10 phút.');
  if (h.kehoach <= 3) add('R2','Bạn chưa có kế hoạch học rõ ràng.','Dùng lộ trình bên trên làm kế hoạch: chọn sẵn 3 buổi cố định mỗi tuần, ví dụ tối thứ Hai, thứ Tư, thứ Sáu.');
  if (h.muc === 1) add('R3','Bạn giải được bài cơ bản nhưng bài vận dụng còn khó.','Ở mỗi bài ôn, làm kỹ 2 câu trả lời ngắn (mức vận dụng); đọc lời giải từng bước khi đã thử 5 phút.');
  if ((h.hoi||[]).includes(3)) add('R4','Bạn có dùng AI khi không hiểu bài.','Hỏi AI để được gợi ý bước đầu tiên, đừng để AI giải hộ; tự làm tiếp rồi mới xem lời giải.');
  if (nWeak) add('R5', `Bài chẩn đoán cho thấy ${nWeak} bài học cần ôn lại.`, 'Ôn đúng các bài này trước khi học tiếp bài mới. Mỗi bài có kiến thức cần nhớ và bài tập theo 3 mức.');
  if (h.apluc >= 4) add('R6','Bạn thấy áp lực với môn Toán.','Mỗi buổi chỉ một bài học. Bắt đầu bằng 2 câu trắc nghiệm dễ trước khi làm câu khó.');
  if ((h.kho||[]).includes(2)) add('R7','Bạn hay mất điểm vì sai sót, tính nhầm.','Sau mỗi câu sai, chọn lỗi do đâu để sổ lỗi sai tự đếm. Dành 2 phút cuối mỗi bài để kiểm tra lại phép tính.');
  if (h.tuhoc === 0) add('R8','Bạn tự học dưới 1 giờ mỗi tuần.','Bắt đầu với 3 buổi × 20 phút mỗi tuần, từ tuần 3 tăng lên 25–30 phút.');
  if (h.hocthem === 0 && h.phuthuoc >= 4) add('R9','Bạn thấy khó tự học nếu không có lớp học thêm.','Mỗi tuần làm 1 đề luyện theo chương mà không xem lời giải trước khi nộp.');
  if ([2,3].includes(h.btvn)) add('R10','Bạn ít làm bài tập về nhà hoặc hay chép lời giải.','Quy tắc 10 phút: tự làm đủ 10 phút rồi mới được xem lời giải.');
  return r;
}
function errLogHTML(){
  const cnt = [0,0,0,0], items = [[],[],[],[]];
  Object.entries(S.errT).sort((a,b) => b[1].at - a[1].at).forEach(([k,v]) => { const r = resolveKey(k); if (!r || !ERRT[v.t]) return; cnt[v.t]++; items[v.t].push([k, r]); });
  const un = Object.entries(S.prac).filter(([k,r]) => !r.ok && !S.errT[k] && resolveKey(k)).length;
  const max = Math.max(...cnt), tops = max ? cnt.map((c,i) => c === max ? i : -1).filter(i => i >= 0) : [];
  const lbl = ([k, r]) => r.slot ? `Đề · câu ${r.slot.id}` : `${r.l.ten.split('.')[0]} lớp ${ALLCH[r.l.ch].g}`;
  return `<div class="errlog">${ERRT.map((x,i) => `<div class="${tops.includes(i) ? 'top' : ''}"><b>${x.t}</b><span class="n">${cnt[i]}</span><span class="muted">${cnt[i] ? items[i].slice(0,3).map(it => `<a href="#on-tap-${it[1].l.ch}" data-jump="${it[1].l.id}">${esc(lbl(it))}</a>`).join(', ') + (cnt[i] > 3 ? '…' : '') : 'Ví dụ: ' + x.vd}</span></div>`).join('')}</div>
    ${tops.length ? `<div class="summary"><b>Lỗi bạn hay mắc nhất: ${tops.map(i => ERRT[i].t).join(' và ')} (${max} câu${tops.length > 1 ? ' mỗi loại' : ''})</b>${tops.map(i => `<span>${esc(ERRT[i].tip)}</span>`).join('')}</div>` : ''}${un ? `<p class="small muted">${un} câu sai chưa phân loại.</p>` : ''}`;
}
function viewBook(){
  const R = S.result;
  if (!R) return `<div class="page"><div class="panel empty"><h1 style="font-size:clamp(30px,1.6vw + 22px,44px)">Sổ tay của bạn chưa được lập</h1><p class="muted">Làm bài chẩn đoán để có lộ trình 4 tuần.</p><div class="btn-row" style="justify-content:center"><a class="btn primary" href="#chan-doan">Bắt đầu chẩn đoán ${ARROW}</a><button type="button" class="btn" id="b-sample2">Xem sổ tay mẫu</button></div></div></div>`;
  const stOf = l => leStatus(l.id);
  const plan = R.chapters.flatMap(id => ALLCH[id].lessons.filter(l => R.lessons[l.id] === false || stOf(l) === 'sus'));
  const open = plan.filter(l => ['no','sus'].includes(stOf(l))), fixed = plan.filter(l => stOf(l) === 'fix');
  const h = R.h, short = h.tuhoc === 0, spaced = [1,2,3].includes(h.on);
  const weeks = [];
  for (let w = 0; w < Math.max(4, Math.ceil(plan.length/3)); w++) weeks.push(plan.slice(w*3, w*3+3));
  const len = w => short ? (w < 2 ? '20 phút' : '25–30 phút') : '30 phút';
  const rs = rules(h, open.length);
  const okN = Object.values(R.lessons).filter(Boolean).length, totN = Object.keys(R.lessons).length;
  const H = (n, t) => `<h3><span class="no-h">${n}.</span>${t}</h3>`;
  const dotTip = l => { const st = stOf(l), p = lessonProg(l); return st === 'fix' ? 'đã vững sau khi ôn' : st === 'no' ? 'câu chẩn đoán sai' : st === 'sus' ? `tự làm đúng ${p.ok}/${p.tot} bài tập` : 'đúng'; };
  const dotCls = l => ({no:'no', sus:'no', fix:'fix'})[stOf(l)] || 'ok';
  const due = dueKeys().length, rvN = Object.keys(S.rv).length, hs = histSummary();
  return `<div class="page"><article class="notebook" aria-label="Sổ tay học Toán cá nhân">
   <div class="nb-head"><span class="label">Lập ngày ${esc(R.date)}</span><h2>Sổ tay học Toán của bạn</h2>
     <div class="row"><span class="tag">${esc(BOOKS[bookOf()].ngan)}</span><span class="tag">Lớp ${+R.grade}</span><span class="tag ${okN===totN?'good':''}">Chẩn đoán đúng ${okN}/${totN} câu</span></div>
     <p class="measure">${open.length ? `Bạn cần ôn lại <b>${open.length} bài học</b>. Mỗi buổi 1 bài.` : plan.length ? `Bạn đã ôn vững cả ${plan.length} bài từng hổng. Lộ trình chuyển sang luyện đề và ôn lại câu sai.` : 'Bạn làm đúng toàn bộ bài chẩn đoán. Lộ trình tập trung vào luyện đề.'}</p></div>
   <section class="nb">${H(1,'Bản đồ lỗ hổng theo bài học')}<div class="legend"><span><i style="background:var(--good)"></i>Làm đúng</span><span><i style="background:var(--warn)"></i>Cần ôn</span><span><i class="fix"></i>Đã vững sau khi ôn</span><span>Bấm vào tên bài để ôn</span></div>
     <div>${R.chapters.map(id => { const ch = ALLCH[id]; const wr = ch.lessons.filter(l => ['no','sus'].includes(stOf(l))), fx = ch.lessons.filter(l => stOf(l) === 'fix').length;
       return `<div class="maprow"><div><b>${esc(chName(ch))}</b><div class="dots">${ch.lessons.map(l => `<span class="${dotCls(l)}" title="${esc(l.ten)}: ${dotTip(l)}"></span>`).join('')}</div>${wr.length?`<ul class="prose small" style="margin-top:8px">${wr.map(l => `<li><a href="#on-tap-${ch.id}" data-jump="${l.id}">${esc(l.ten)}</a>${stOf(l)==='sus'?` <span class="muted">(${dotTip(l)})</span>`:''}</li>`).join('')}</ul>`:''}</div><span class="tag ${wr.length?'warn':'good'}">${wr.length?`Ôn ${wr.length} bài`:fx?'Đã ôn vững':'Ổn'}</span></div>`; }).join('')}</div></section>
   <section class="nb">${H(2,'Tiến độ')}<div class="kpis">
     <div><span class="big">${plan.length ? `${fixed.length}/${plan.length}` : '—'}</span><span class="muted small">bài hổng đã vững</span></div>
     <a href="#on-lai"><span class="big">${due}</span><span class="muted small">câu ôn lại hôm nay · ${rvN} đang chờ</span></a>
     <a href="#de-thi"><span class="big">${hs ? hs.n : 0}</span><span class="muted small">${hs ? `lần làm đề · ${esc(hs.line)}` : 'lần làm đề thi thử'}</span></a></div></section>
   <section class="nb">${H(3,'Lộ trình ôn tập')}<p class="muted small">3 buổi/tuần · tuần 1–2: ${len(0)} · từ tuần 3: ${len(2)} · ✓ đã vững</p>
     <div class="tablebox"><table><thead><tr><th>Tuần</th><th>Buổi học, mỗi buổi 1 bài</th><th>Ôn lại</th><th>Cuối tuần</th></tr></thead><tbody>
     ${weeks.map((s,w) => `<tr><td class="wk">Tuần ${w+1}</td><td>${s.length ? s.map(l => `${['fix','ok'].includes(stOf(l)) ? '<span class="ok" title="Đã vững">✓</span> ' : ''}<a href="#on-tap-${chOf(l)}" data-jump="${l.id}">${esc(leTitle(l))}</a> <span class="muted small">(Lớp ${ALLCH[l.ch].g})</span>`).join('<br>') : 'Ôn chương đang học trên lớp, mỗi buổi 1 bài'}</td><td>${spaced ? 'Mỗi ngày: mục Ôn lại' : 'Cuối tuần: mục Ôn lại'}</td><td>${w === weeks.length-1 ? '1 đề thi thử' : 'Làm lại câu chẩn đoán của bài vừa ôn'}</td></tr>`).join('')}
     </tbody></table></div></section>
   <section class="nb">${H(4,'Gợi ý dành riêng cho bạn')}<div class="rules">${rs.length ? rs.map(x => `<div class="rule"><div class="code">${x.code}</div><div><div>${esc(x.tip)}</div><div class="why">Vì: ${esc(x.why)}</div></div></div>`).join('') : '<p class="muted">Thói quen học của bạn đang tốt. Giữ nhịp tự học đều đặn.</p>'}</div></section>
   <section class="nb">${H(5,'Sổ lỗi sai')}${errLogHTML()}</section>
   <section class="nb">${H(6,'Dữ liệu của bạn')}${dataPanelHTML()}</section>
   <div class="actions"><button type="button" class="btn" id="b-redo">Làm lại bài chẩn đoán</button><a class="btn primary" href="#de-thi">Luyện đề thi thử ${ARROW}</a></div>
  </article></div>`;
}

// ---------- dữ liệu của người dùng: thống kê 7 ngày, sao lưu, khôi phục, xóa ----------
const byId = id => document.getElementById(id);
function dataPanelHTML(){
  return `<div class="data-panel" id="du-lieu">
    <p class="muted measure">Kết quả của bạn chỉ lưu trên máy này, không gửi đi đâu. Xuất tệp sao lưu để chuyển sang máy khác, hoặc để phòng khi xóa dữ liệu trình duyệt.</p>
    <div class="act7" id="act7" role="img" aria-label="Số câu đã làm trong 7 ngày gần nhất"></div>
    <p class="small muted" id="db-info">Đang đọc dữ liệu…</p>
    <div class="btn-row"><button type="button" class="btn sm" id="b-export">Xuất tệp sao lưu</button><button type="button" class="btn sm" id="b-import">Nhập tệp sao lưu</button><button type="button" class="btn sm" id="b-wipe">Xóa toàn bộ dữ liệu</button></div>
    <input type="file" id="f-import" accept="application/json,.json" hidden>
    <p class="small" id="db-msg" role="status" aria-live="polite"></p></div>`;
}
const STORE_NAME = {indexeddb:'cơ sở dữ liệu của trình duyệt (IndexedDB)', localstorage:'bộ nhớ trình duyệt (localStorage)', memory:'bộ nhớ tạm, sẽ mất khi đóng trang vì trình duyệt đang chặn lưu trữ'};
const WEEKDAY = ['CN','T2','T3','T4','T5','T6','T7'];
async function paintData(){
  const DB = window.KHKT_DB; if (!byId('act7')) return;
  const [st, info] = await Promise.all([DB.stats(7), DB.info()]); const box = byId('act7'); if (!box) return;
  const max = Math.max(1, ...st.map(d => d.n)), W = 36, HT = 56, total = st.reduce((a,d) => a + d.n, 0), right = st.reduce((a,d) => a + d.ok, 0);
  box.innerHTML = `<svg viewBox="0 0 ${W*7} ${HT+22}" class="act7-svg" aria-hidden="true">${st.map((d,i) => { const h = Math.round(d.n/max*HT), k = Math.round(d.ok/max*HT), x = i*W + 6;
      return `<rect class="a-bg" x="${x}" y="0" width="${W-12}" height="${HT}" rx="4"/><rect class="a-all" x="${x}" y="${HT-h}" width="${W-12}" height="${h}" rx="4"/><rect class="a-ok" x="${x}" y="${HT-k}" width="${W-12}" height="${k}" rx="4"/><text x="${x + (W-12)/2}" y="${HT+16}" text-anchor="middle">${WEEKDAY[new Date(d.day).getDay()]}</text>`; }).join('')}</svg>
    <p class="small"><b>${total}</b> câu ôn tập trong 7 ngày, đúng <b>${right}</b>${total ? ` (${Math.round(right/total*100)}%)` : ''}.</p>`;
  const c = info.counts;
  byId('db-info').textContent = `Lưu ở: ${STORE_NAME[info.backend] || 'không rõ'}.` + (info.backend === 'indexeddb' ? ` Đã ghi ${c.practice} câu ôn tập, ${c.review} lịch ôn lại, ${c.exams} lần nộp đề, ${c.events} dòng nhật ký.` : '') + (info.persisted ? ' Trình duyệt cam kết không tự xóa.' : '');
}
function bindData(){
  if (!byId('du-lieu')) return;
  const DB = window.KHKT_DB;
  const msg = (t, bad) => { const m = byId('db-msg'); if (m){ m.textContent = t; m.className = 'small ' + (bad ? 'err' : 'ok'); m.scrollIntoView({block:'nearest'}); } };
  paintData().catch(() => { if (byId('db-info')) byId('db-info').textContent = 'Không đọc được thông tin lưu trữ.'; });
  byId('b-export').onclick = async () => {
    try { const data = await DB.exportAll(snapshot()), url = URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'application/json'})), a = document.createElement('a');
      a.href = url; a.download = `so-tay-toan-sao-luu-${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      msg('Đã xuất tệp sao lưu. Giữ tệp này ở nơi an toàn.'); } catch(e){ msg('Không xuất được tệp sao lưu.', true); } };
  byId('b-import').onclick = () => byId('f-import').click();
  byId('f-import').onchange = async ev => { const f = ev.target.files[0]; ev.target.value = ''; if (!f) return;
    if (f.size > 5e6) return msg('Tệp quá lớn, không phải tệp sao lưu của Sổ tay Toán.', true);
    try { const st = await DB.importAll(JSON.parse(await f.text())); applyState(st); route(); msg('Đã nhập dữ liệu từ tệp sao lưu.'); }
    catch(e){ msg(e instanceof SyntaxError ? 'Tệp không đọc được (không phải JSON).' : (e.message || 'Không nhập được tệp.'), true); } };
  // Xóa dữ liệu: bấm lần đầu chỉ hỏi lại, bấm lần hai trong 5 giây mới xóa.
  let armed = 0; byId('b-wipe').onclick = async () => { const b = byId('b-wipe');
    if (Date.now() - armed > 5000){ armed = Date.now(); b.textContent = 'Bấm lần nữa để xóa hẳn'; msg('Xóa xong không khôi phục được, trừ khi bạn có tệp sao lưu.', true);
      setTimeout(() => { if (byId('b-wipe') === b && Date.now() - armed >= 5000) b.textContent = 'Xóa toàn bộ dữ liệu'; }, 5100); return; }
    try { await DB.clear(); } catch(e){ return msg('Không xóa được dữ liệu.', true); }
    Object.assign(S, {grade:11, done:new Set(DEFAULT_DONE[11]), found:true, step:0, h:{}, ans:{}, result:null, prac:{}, rv:{}, errT:{}, hist:[], exam:null, target:7, book:'kntt'});
    route(); msg('Đã xóa toàn bộ dữ liệu trên máy này.'); };
}

// ---------- sample ----------
function loadSample(){
  S.grade = 11; S.book = 'kntt'; S.done = new Set(['11-I','11-II','11-IV']); S.found = true;
  S.h = {tuhoc:0, on:2, kehoach:2, btvn:1, muc:1, hoi:[1,3], apluc:4, kho:[0,2], hocthem:1};
  const wrong = new Set(SAMPLE_WRONG);
  S.ans = {}; diagChapters().forEach(id => ALLCH[id].lessons.forEach(l => { S.ans[l.id] = wrong.has(l.id) ? (l.d.a+1)%4 : l.d.a; }));
  finishDiag(); S.step = 0; go('so-tay');
}

// ---------- events ----------
function bind(tab){
  const $ = id => document.getElementById(id);
  if ($('b-welcome-x')) $('b-welcome-x').onclick = () => { try{ localStorage.setItem('khkt-guide','1'); }catch(e){} $('welcome').remove(); };
  document.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', () => { S.focus = a.dataset.jump; }));
  if (tab === 'chan-doan'){
    if (S.step === 0){
      $('b-start').onclick = () => { const el = $('chon-chuong'); el.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'}); setTimeout(() => $('f-grade').focus({preventScroll:true}), reduced() ? 0 : 450); };
      $('f-book').onchange = e => { S.book = e.target.value; S.done = new Set(defaultDone()); save(); rerender(); };
      $('f-grade').onchange = e => { S.grade = +e.target.value; S.done = new Set(defaultDone()); S.ans = {}; save(); rerender(); };
      view.querySelectorAll('input[data-ch]').forEach(c => c.onchange = () => { c.checked ? S.done.add(c.dataset.ch) : S.done.delete(c.dataset.ch); save(); rerender(); });
      $('ck-found').onchange = e => { S.found = e.target.checked; save(); rerender(); };
      $('b-next0').onclick = () => { if (!diagChapters().length){ S.err = 'Chọn ít nhất một chương.'; rerender(); return; } S.err=''; S.step = 1; route(); window.scrollTo(0,0); };
      $('b-sample').onclick = loadSample;
    }
    if (S.step === 1){
      view.querySelectorAll('input[data-h]').forEach(inp => inp.onchange = () => { const id = inp.dataset.h, t = inp.dataset.t, v = +inp.value;
        if (t==='many'){ const a = new Set(S.h[id]||[]); inp.checked ? a.add(v) : a.delete(v); S.h[id] = [...a]; } else S.h[id] = v; rerender(); });
      $('b-back1').onclick = () => { S.err=''; S.step = 0; route(); window.scrollTo(0,0); };
      $('b-next1').onclick = () => { const miss = HABITS.filter(habitVisible).filter(h => h.type==='many' ? !(S.h[h.id]||[]).length : S.h[h.id]===undefined);
        if (miss.length){ S.err = `Còn ${miss.length} câu chưa trả lời.`; rerender(); return; } S.err=''; S.step = 2; route(); window.scrollTo(0,0); };
    }
    if (S.step === 2){
      view.querySelectorAll('input[data-a]').forEach(inp => inp.onchange = () => { S.ans[inp.dataset.a] = +inp.value; rerender(); });
      $('b-back2').onclick = () => { S.err=''; S.step = 1; route(); window.scrollTo(0,0); };
      $('b-next2').onclick = () => { const all = diagChapters().flatMap(id => ALLCH[id].lessons.map(l => l.id)); const miss = all.filter(id => S.ans[id]===undefined).length;
        if (miss){ S.err = `Còn ${miss} câu chưa chọn đáp án.`; rerender(); return; } S.err=''; finishDiag(); window.KHKT_DB.log('diagnose', {n:all.length}); window.KHKT_DB.persist(); S.step = 0; go('so-tay'); };
    }
  }
  if (tab === 'on-tap'){
    if ($('f-book2')) $('f-book2').onchange = e => { S.book = e.target.value; S.done = new Set(defaultDone()); save(); rerender(); };
    view.querySelectorAll('[data-check]').forEach(b => b.onclick = () => checkEx(b.closest('.ex')));
    view.querySelectorAll('[data-hint]').forEach(b => b.onclick = () => { const box = b.closest('.ex'), h = box.querySelector('.hint'); h.hidden = !h.hidden; if (!h.hidden) box.dataset.hint = '1'; b.textContent = h.hidden ? 'Gợi ý' : 'Ẩn gợi ý'; });
    view.querySelectorAll('.tfbtn input').forEach(inp => inp.onchange = () => { inp.closest('.tfbtn').querySelectorAll('label').forEach(l => l.classList.toggle('sel', l.contains(inp))); });
    view.querySelectorAll('.ex .choice input').forEach(inp => inp.onchange = () => { inp.closest('.choices').querySelectorAll('.choice').forEach(c => { c.classList.remove('right','wrong'); c.classList.toggle('sel', c.contains(inp)); }); });
    view.querySelectorAll('a[data-jump]').forEach(a => a.addEventListener('click', ev => { const el = document.getElementById('le-' + a.dataset.jump); if (el && location.hash === a.getAttribute('href')){ ev.preventDefault(); el.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'}); } }));
  }
  if (tab === 'de-thi'){
    if ($('f-target')) $('f-target').onchange = () => { S.target = +$('f-target').value; save(); };
    if ($('f-exg')) $('f-exg').onchange = () => { exG = +$('f-exg').value; rerender(); };
    view.querySelectorAll('[data-mk]').forEach(b => b.onclick = () => { makeExam(b.dataset.mk, $('f-target') ? +$('f-target').value : S.target, b.dataset.ch); S.exam.start = Date.now(); save(); route(); window.scrollTo(0,0); if (!timerId) timerId = setInterval(tick, 1000); tick(); });
    if (S.exam && $('exam-bar')){
      view.querySelectorAll('input[data-x]').forEach(inp => {
        const k = inp.dataset.x;
        if (inp.type === 'text') inp.oninput = () => { S.exam.ans[k] = inp.value; save(); paintProgress(); };
        else inp.onchange = () => { if (inp.dataset.si !== undefined){ const o = S.exam.ans[k] || {}; o[+inp.dataset.si] = +inp.value; S.exam.ans[k] = o; } else S.exam.ans[k] = +inp.value; save(); rerender(); };
      });
      // Nộp khi còn câu trống: bấm lần đầu chỉ nhắc, bấm lần hai mới nộp.
      view.querySelectorAll('[data-submit]').forEach(b => b.onclick = () => { const p = examProgress(S.exam);
        if (p.n < p.tot && b.dataset.armed !== '1'){ view.querySelectorAll('[data-submit]').forEach(x => { x.dataset.armed = '1'; x.textContent = `Còn ${p.tot - p.n} câu trống. Vẫn nộp?`; }); return; }
        submitExam(); route(); window.scrollTo(0,0); });
      view.querySelectorAll('[data-part]').forEach(b => b.onclick = () => { const el = document.getElementById('part-' + b.dataset.part); if (el) el.scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'}); });
      if ($('b-newexam')) $('b-newexam').onclick = () => { const m = S.exam.mode; makeExam(m, S.exam.target, S.exam.ch); S.exam.start = Date.now(); save(); route(); window.scrollTo(0,0); if (!timerId) timerId = setInterval(tick, 1000); tick(); };
      view.querySelectorAll('[data-close]').forEach(b => b.onclick = () => {
        if (!S.exam.submitted && Object.keys(S.exam.ans).length && !confirm('Thoát đề đang làm? Các câu đã chọn sẽ không được lưu.')) return;
        S.exam = null; save(); route(); window.scrollTo(0,0); });
      if (!S.exam.submitted && !timerId){ timerId = setInterval(tick, 1000); tick(); }
    }
  }
  if (tab === 'so-tay'){
    if ($('b-sample2')) $('b-sample2').onclick = loadSample;
    if ($('b-redo')) $('b-redo').onclick = () => { S.ans = {}; S.step = 0; go('chan-doan'); };
  }
  if (tab === 'cong-thuc') window.KHKT_CT_VIEW.bind(view);
  bindData();
}
// Giao diện sáng/tối: mặc định theo máy; bấm nút thì ghi nhớ lựa chọn.
const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>';
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
function paintTheme(){
  const d = isDark(), b = document.getElementById('b-theme');
  if (b){ b.innerHTML = d ? SUN : MOON; const lb = d ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'; b.setAttribute('aria-label', lb); b.title = lb; }
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
}
document.getElementById('b-theme').onclick = () => { const t = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try{ localStorage.setItem('khkt-theme', t); }catch(e){} paintTheme(); };
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintTheme);
paintTheme();

// App cài được (PWA): lưu file để dùng khi không có mạng; hiện nút Cài app khi trình duyệt cho phép.
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
let installEv = null;
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEv = e; if (!standalone) document.getElementById('b-install').hidden = false; });
window.addEventListener('appinstalled', () => { installEv = null; document.getElementById('b-install').hidden = true; });
document.getElementById('b-install').onclick = async () => { if (!installEv) return; installEv.prompt(); await installEv.userChoice; installEv = null; document.getElementById('b-install').hidden = true; };
if (!standalone && /iPhone|iPad|iPod/.test(navigator.userAgent)) document.getElementById('ios-hint').hidden = false;
if (!Object.keys(DATA).length) view.innerHTML = '<div class="page"><div class="panel"><p class="err">Không tải được dữ liệu bài học (data.js). Đặt file data.js cùng thư mục với trang này.</p></div></div>';
else {
  // Phân loại lỗi: nút được chèn sau khi kiểm tra nên bắt sự kiện ở cấp trang.
  view.addEventListener('click', ev => { const b = ev.target.closest('[data-et]'); if (!b) return; const t = +b.dataset.et;
    S.errT[b.dataset.ek] = {t, at:Date.now()}; save();
    const g = b.closest('.errpick'); g.querySelectorAll('[data-et]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); g.querySelector('.et-tip').textContent = ERRT[t].tip; });
  boot();
}
