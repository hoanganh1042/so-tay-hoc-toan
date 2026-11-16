"""Sinh web/hinh_bosung.js: hình minh họa tự vẽ cho đợt bài tập bổ sung (content/bosung_nguon.py).

Dùng lại lớp Fig và các hàm dựng hình của hinh_nguon.py nhưng KHÔNG chạy phần ghi web/hinh.js của tệp đó:
mã nguồn hinh_nguon.py được nạp đến trước dòng "CSS_NOTE =" (phần chỉ định nghĩa hàm và dựng hình cũ trong bộ nhớ).
Hình vẽ mới theo số liệu của từng câu, chỉ thể hiện dữ kiện đề cho, không vẽ yếu tố là đáp án.
Khóa hình = khóa câu, lấy từ bosung_nguon.keys(). Tệp sinh ra nối vào window.KHKT_HINH nên phải nạp SAU hinh.js.
Chạy:  py -I content/hinh_bosung.py   (từ D:\\KHKT)
"""
import importlib.util, json, math, pathlib, sys
sys.stdout.reconfigure(encoding="utf-8")
HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "web" / "hinh_bosung.js"

# --- nạp thư viện vẽ từ hinh_nguon.py (không ghi tệp nào)
_src = (HERE / "hinh_nguon.py").read_text(encoding="utf-8")
_cut = _src.index("\nCSS_NOTE = ")
_lib = {"__name__": "hinh_nguon_lib", "__file__": str(HERE / "hinh_nguon.py")}
exec(compile(_src[:_cut], str(HERE / "hinh_nguon.py"), "exec"), _lib)
H_OLD = _lib["H"]
Fig, f, unit, proj, plot_map, axes, curve, centroid, on, mid2 = (_lib[k] for k in
    ("Fig", "f", "unit", "proj", "plot_map", "axes", "curve", "centroid", "on", "mid2"))
plane, solid3, tri_pts, tetra, pyr_par, box, revolve = (_lib[k] for k in
    ("plane", "solid3", "tri_pts", "tetra", "pyr_par", "box", "revolve"))

# --- khóa câu từ bosung_nguon.py
_spec = importlib.util.spec_from_file_location("bosung_nguon", HERE / "bosung_nguon.py")
BS = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(BS)
FK = BS.fig_keys()

H = {}
def fig(name):
    def deco(fn):
        assert name not in H, name
        H[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------- tiện ích
def emap(x0, x1, y0, y1, W, pad=22):
    """Hệ trục cùng tỉ lệ hai chiều; trả về (M, chiều cao)."""
    s = (W - 2*pad)/(x1 - x0); Hh = (y1 - y0)*s + 2*pad
    return plot_map(x0, x1, y0, y1, W, Hh, pad), Hh


def grid_eq(x0, x1, y0, y1, W=260, step=1, ox="x", oy="y"):
    M, Hh = emap(x0, x1, y0, y1, W)
    F = Fig(W, Hh, W)
    x = math.ceil(x0/step)*step
    while x <= x1:
        if x != 0: F.line(M(x, y0), M(x, y1), "grid")
        x += step
    y = math.ceil(y0/step)*step
    while y <= y1:
        if y != 0: F.line(M(x0, y), M(x1, y), "grid")
        y += step
    axes(F, M, x0, x1, y0, y1, ox, oy)
    return F, M


def num(v):
    s = f"{v:g}".replace("-", "−").replace(".", ",")
    return s


def xtick(F, M, x, lab=None, dy=13):
    p = M(x, 0); F.line((p[0], p[1] - 3), (p[0], p[1] + 3), "ax")
    F.text(p, lab if lab is not None else num(x), "middle", 0, dy, fixed=True)


def ytick(F, M, y, lab=None):
    p = M(0, y); F.line((p[0] - 3, p[1]), (p[0] + 3, p[1]), "ax")
    F.text(p, lab if lab is not None else num(y), "end", -6, 0, fixed=True)


def guides(F, M, x, y, lx=None, ly=None):
    """Đường gióng nét đứt từ (x; y) xuống trục hoành và sang trục tung, kèm nhãn."""
    F.line(M(x, y), M(x, 0), "hid"); F.line(M(x, y), M(0, y), "hid")
    if lx is not False: F.text(M(x, 0), lx or num(x), "middle", 0, 13 if y > 0 else -11, fixed=True)
    if ly is not False: F.text(M(0, y), ly or num(y), "end" if x > 0 else "start", -6 if x > 0 else 6, 0, fixed=True)


def plotf(F, M, fn, a, b, cls="ln", n=120):
    F.poly([M(x, fn(x)) for x in [a + (b - a)*i/n for i in range(n + 1)]], cls, close=False)


def hist(edges, freqs, xl, yl, W=310, Hh=210):
    step = edges[1] - edges[0]; fmax = max(freqs)
    xa = edges[0] - 0.55*step
    M = plot_map(xa, edges[-1] + 0.95*step, -fmax*0.06, fmax*1.22, W, Hh, 24)
    F = Fig(W, Hh, W)
    for a, b, m in zip(edges, edges[1:], freqs):
        pts = [M(a, 0), M(b, 0), M(b, m), M(a, m)]
        F.poly(pts, "sh"); F.poly(pts, "ln")
        F.text(M((a + b)/2, m), str(m), "middle", 0, -10, fixed=True)
    F.line(M(xa, 0), M(edges[-1] + 0.85*step, 0), "ax"); F.line(M(xa, 0), M(xa, fmax*1.16), "ax")
    for e in edges: F.text(M(e, 0), num(e), "middle", 0, 13, fixed=True)
    F.text(M(edges[-1] + 0.85*step, 0), xl, "end", 0, 29, fixed=True)
    F.text(M(xa, fmax*1.16), yl, "start", 6, -2, fixed=True)
    return F


def tree(l1, l2, heads, W=340):
    """Sơ đồ cây hai tầng. l1: [(nhãn, xs)]; l2: [[(nhãn, xs), (nhãn, xs)], ...]; heads: tiêu đề hai cột."""
    F = Fig(W, 236, W); CW = Fig.CW
    root = (14, 124); F.dot(root, 3.5); x1 = 128; x2 = 262; ys1 = [66, 182]
    F.text((x1, 14), heads[0], fixed=True, cls="mut"); F.text((x2 + 30, 14), heads[1], fixed=True, cls="mut")
    def branch(a, b, p):
        F.line(a, b, "ln"); m = ((a[0] + b[0])/2, (a[1] + b[1])/2)
        F.text(m, p, "end", -4, -9 if b[1] < a[1] else 11, fixed=True)
    for i, ((lb, p), kids) in enumerate(zip(l1, l2)):
        w = CW*len(lb) + 2; node = (x1, ys1[i])
        branch(root, (node[0] - w/2 - 5, node[1]), p); F.text(node, lb, fixed=True)
        for j, (lb2, p2) in enumerate(kids):
            leaf = (x2, ys1[i] + (-30 if j == 0 else 30))
            branch((node[0] + w/2 + 5, node[1]), (leaf[0] - 5, leaf[1]), p2); F.text(leaf, lb2, "start", fixed=True)
    return F


def table_frame(F, cols_x, rows_y, x_left, x_right):
    for y in rows_y: F.line((x_left, y), (x_right, y), "thin")
    F.line((x_left, rows_y[0]), (x_left, rows_y[-1]), "thin"); F.line((x_right, rows_y[0]), (x_right, rows_y[-1]), "thin")


# ================================================================ LỚP 10
@fig("thap_hai_goc")
def _():
    F = Fig(340, 200, 330); g = 172; s = 3.0
    h = 30*math.sin(math.radians(35))*math.sin(math.radians(50))/math.sin(math.radians(15))
    Hx = 305; Hp = (Hx, g); T = (Hx, g - h*s)
    B = (Hx - h/math.tan(math.radians(50))*s, g); A = (Hx - h/math.tan(math.radians(35))*s, g)
    F.line((A[0] - 30, g), (Hx + 25, g), "ax")
    F.line(Hp, T, "thick"); F.line(A, T, "ln"); F.line(B, T, "ln")
    for p in (A, B, T, Hp): F.dot(p)
    F.arc(A, Hp, T, 30, "35°", 46); F.arc(B, Hp, T, 22, "50°", 38)
    F.text(A, "A", "middle", 0, 14); F.text(B, "B", "middle", 0, 14); F.text(Hp, "H", "middle", 0, 14); F.text(T, "T", "end", -8, 0)
    F.text(((A[0] + B[0])/2, g), "30 m", "middle", 0, 30, fixed=True)
    F.text((Hx, (g + T[1])/2), "?", "start", 8, 0)
    return F


@fig("vuon_tam_giac")
def _():
    return plane(tri_pts(7, 15, 60), edges=(("A", "B"), ("B", "C"), ("C", "A")),
                 sides=[("A", "B", "15 m"), ("A", "C", "7 m"), ("B", "C", "13 m")], size=(250, 150))


@fig("nua_dtron_150")
def _():
    M, Hh = emap(-1.45, 1.45, -0.32, 1.32, 260)
    F = Fig(260, Hh, 250); axes(F, M, -1.45, 1.45, -0.32, 1.32)
    F.poly([M(math.cos(t), math.sin(t)) for t in [math.pi*i/90 for i in range(91)]], "ln", close=False)
    t = math.radians(150); P = M(math.cos(t), math.sin(t)); O = M(0, 0)
    F.line(O, P, "acc"); F.dot(P, 3.4); F.text(P, "M", "end", -8, -6)
    F.arc(O, M(1, 0), P, 18, None)
    F.text(M(0.38, 0.3), "150°", fixed=True)
    xtick(F, M, 1, "1"); xtick(F, M, -1, "−1")
    return F


@fig("hcn_vecto")
def _():
    P = {"A": (0, 0), "B": (6, 0), "C": (6, 8), "D": (0, 8)}
    return plane(P, edges=(("B", "C"), ("C", "D"), ("D", "A")), arrows=[("A", "B"), ("A", "C")],
                 sides=[("A", "B", "6"), ("A", "D", "8")], size=(150, 190))


@fig("tg_vecto_mn")
def _():
    P = {"A": (1.3, 3.2), "B": (0, 0), "C": (5, 0)}
    P["M"] = mid2(P["B"], P["C"]); P["N"] = mid2(P["A"], P["C"], 2/3)
    def ex(F, S, c, s):
        F.text(((S["B"][0] + S["C"][0])/2, S["B"][1] + 30), "M trung điểm BC, AN = 2NC", fixed=True, cls="mut")
    return plane(P, edges=(("A", "B"), ("B", "C"), ("C", "A")), arrows=[("M", "N")], size=(240, 150), extra=ex)


@fig("luoi_ab")
def _():
    F, M = grid_eq(-3.4, 5.4, -1.4, 4.4, 270)
    for x in (-2, 2, 4): xtick(F, M, x)
    for y in (1, 3): ytick(F, M, y)
    A, B = M(-2, 3), M(4, 1); F.dot(A, 3.4); F.dot(B, 3.4)
    F.text(A, "A", "end", -7, -8); F.text(B, "B", "start", 7, -8)
    return F


@fig("luoi_tam_giac")
def _():
    F, M = grid_eq(-0.8, 6.4, -0.8, 6.2, 250)
    A, B, C = M(1, 1), M(5, 2), M(2, 5)
    F.poly([A, B, C], "ln")
    for p in (A, B, C): F.dot(p, 3)
    F.text(A, "A(1; 1)", "end", -6, 10); F.text(B, "B(5; 2)", "start", 6, 8); F.text(C, "C(2; 5)", "start", 8, -6)
    return F


@fig("dt_doan_chan")
def _():
    F, M = grid_eq(-1.6, 4.8, -1.4, 3.4, 260)
    fn = lambda x: 2 - 2*x/3
    F.line(M(-1.05, fn(-1.05)), M(4.5, fn(4.5)), "acc")
    F.dot(M(3, 0), 3.2); F.dot(M(0, 2), 3.2)
    F.text(M(3, 0), "3", "middle", 4, 14, fixed=True); F.text(M(0, 2), "2", "end", -7, 10, fixed=True)
    F.text(M(4.5, fn(4.5)), "d", "start", 6, 0)
    return F


@fig("tram_bom")
def _():
    F, M = grid_eq(-0.8, 8.6, -1.6, 5.2, 290)
    F.line(M(-0.8, 0), M(8.6, 0), "thick")
    for x in range(0, 9): F.line(M(x + 0.15, -0.05), M(x - 0.25, -0.5), "thin")
    F.text(M(4, -1.1), "kênh (trục Ox)", fixed=True, cls="mut")
    A, B = M(1, 4), M(7, 2); F.dot(A, 3.6); F.dot(B, 3.6)
    F.text(A, "A(1; 4)", "start", 8, -4); F.text(B, "B(7; 2)", "start", 8, -4)
    return F


@fig("dtron_luoi")
def _():
    F, M = grid_eq(-1.8, 5.9, -4.7, 2.7, 270)
    r = M(3, 0)[0] - M(0, 0)[0]; I = M(2, -1)
    F.circle(I, r, "ln"); F.dot(I, 3.2); F.text(I, "I", "start", 6, -8)
    xtick(F, M, 2); xtick(F, M, 5, dy=-11)
    for y in (-4, -1, 2): ytick(F, M, y)
    return F


@fig("dtron_tiep_tuyen")
def _():
    M, Hh = emap(-7.3, 5.6, -3.8, 8.2, 260)
    F = Fig(260, Hh, 250); axes(F, M, -7.3, 5.6, -3.8, 8.2)
    r = M(5, 0)[0] - M(0, 0)[0]; I = M(-1, 2); A = M(2, 6)
    F.circle(I, r, "ln"); F.dot(I, 3.2); F.dot(A, 3.4)
    F.text(I, "I", "start", 6, 10); F.text(A, "A(2; 6)", "start", 8, -6)
    return F


@fig("elip_duong_chay")
def _():
    M, Hh = emap(-62, 62, -50, 38, 300)
    F = Fig(300, Hh, 300)
    F.poly([M(50*math.cos(2*math.pi*i/96), 30*math.sin(2*math.pi*i/96)) for i in range(97)], "ln", close=False)
    F.line(M(-50, 0), M(50, 0), "thin"); F.line(M(0, -30), M(0, 30), "hid")
    for x, n in ((-40, "F₁"), (40, "F₂")):
        F.dot(M(x, 0), 3.4); F.line(M(x, 0), M(x, 9), "ln"); F.poly([M(x, 9), M(x + 6, 7.5), M(x, 6)], "ah")
        F.text(M(x, 0), n, "middle", 0, 13)
    F.line(M(-50, -37), M(50, -37), "thin")
    for x in (-50, 50): F.line(M(x, -33), M(x, -41), "thin")
    F.text(M(0, -37), "100 m", "middle", 0, 14, fixed=True); F.text(M(0, 15), "60 m", "start", 6)
    return F


@fig("parabol_dinh")
def _():
    F, M = grid_eq(-1.3, 5.3, -1.8, 4.7, 250)
    plotf(F, M, lambda x: x*x - 4*x + 3, -0.32, 4.32)
    I = M(2, -1); F.dot(I, 3.2); F.text(I, "I(2; −1)", "start", 8, 6)
    F.dot(M(0, 3), 3.2); F.text(M(0, 3), "3", "end", -7, 0, fixed=True)
    return F


@fig("cong_parabol")
def _():
    M, Hh = emap(-5.4, 5.4, -1.2, 9.2, 270)
    F = Fig(270, Hh, 260); fn = lambda x: 8 - x*x/2
    F.line(M(-5.4, 0), M(5.4, 0), "ax")
    pts = curve(M, fn, -4, 4, 80); F.poly(pts, "sh"); F.poly(pts, "ln", close=False)
    F.line(M(0, 0), M(0, 8), "hid"); F.text(M(0, 5.2), "8 m", "start", 6)
    F.text(M(0, 0), "8 m", "middle", 0, 13, fixed=True)
    F.line(M(3, 0), M(3, fn(3)), "acc"); F.dot(M(3, fn(3)), 3); F.text(M(3, fn(3)/2), "?", "end", -6)
    F.text(M(3.5, 0), "1 m", "middle", 0, 13, fixed=True)
    for x in (-4, 3, 4): F.dot(M(x, 0), 2.6)
    return F


@fig("pho_luoi")
def _():
    F = Fig(300, 200, 280); c = 42; x0, y0 = 40, 160
    for i in range(6): F.line((x0 + i*c, y0), (x0 + i*c, y0 - 3*c), "ln")
    for j in range(4): F.line((x0, y0 - j*c), (x0 + 5*c, y0 - j*c), "ln")
    A, B = (x0, y0), (x0 + 5*c, y0 - 3*c); F.dot(A, 5); F.dot(B, 5)
    F.text(A, "A (nhà)", "end", -8, 12); F.text(B, "B (trường)", "start", 8, -10)
    return F


# ================================================================ LỚP 11
def unit_circle(W=240):
    M, Hh = emap(-1.5, 1.5, -1.42, 1.42, W)
    F = Fig(W, Hh, W - 10); axes(F, M, -1.5, 1.5, -1.42, 1.42)
    F.circle(M(0, 0), M(1, 0)[0] - M(0, 0)[0], "ln")
    F.text(M(1, 0), "1", "start", 5, 11, fixed=True)
    return F, M


@fig("dtlg_M")
def _():
    F, M = unit_circle()
    t = math.radians(120); P = M(math.cos(t), math.sin(t))
    F.dot(P, 3.4); F.text(P, "M", "end", -8, -6); F.line(M(0, 0), P, "thin")
    F.line(P, M(-0.5, 0), "hid"); F.text(M(-0.5, 0), "−1/2", "end", 6, 13, fixed=True)
    return F


@fig("do_thi_2cos")
def _():
    M = plot_map(-3.75, 7.1, -2.75, 2.75, 330, 170, 20)
    F = Fig(330, 170, 330); axes(F, M, -3.75, 7.1, -2.75, 2.75)
    plotf(F, M, lambda x: 2*math.cos(x), -3.6, 6.9, n=200)
    for x, lb in ((-math.pi, "−π"), (math.pi, "π"), (2*math.pi, "2π")): xtick(F, M, x, lb, -11 if x != 2*math.pi else -11)
    F.line(M(-3.6, 2), M(6.9, 2), "hid"); F.line(M(-3.6, -2), M(6.9, -2), "hid")
    F.text(M(0, 2), "2", "start", 6, -10, fixed=True); F.text(M(0, -2), "−2", "end", -6, 10, fixed=True)
    return F


@fig("dtlg_sin_half")
def _():
    F, M = unit_circle()
    F.line(M(-1.4, 0.5), M(1.4, 0.5), "acc"); F.text(M(1.4, 0.5), "y = 1/2", "start", 4, -6)
    for t in (math.pi/6, 5*math.pi/6): F.dot(M(math.cos(t), math.sin(t)), 3.2)
    return F


@fig("hist_dien_thoai")
def _(): return hist([0, 2, 4, 6, 8, 10], [5, 12, 18, 10, 5], "Thời gian (giờ)", "Số học sinh")


@fig("hist_the_duc")
def _(): return hist([10, 20, 30, 40, 50, 60], [6, 14, 20, 7, 3], "Thời gian (phút)", "Số người")


@fig("tdien_mn")
def _():
    def add(P): P["M"] = on(P["A"], P["B"], 0.5); P["N"] = on(P["A"], P["C"], 2/3)
    return tetra(add=add, edges_add=[("M", "N")], acc=[("M", "N")])


@fig("tdien_g1g2")
def _():
    def add(P):
        P["G₁"] = tuple((P["A"][i] + P["B"][i] + P["C"][i])/3 for i in range(3))
        P["G₂"] = tuple((P["A"][i] + P["B"][i] + P["D"][i])/3 for i in range(3))
    return tetra(add=add, edges_add=[("G₁", "G₂")], acch=[("G₁", "G₂")])


@fig("chop_mn")
def _():
    def add(P):
        P["M"] = on(P["S"], P["A"], 0.5); P["N"] = on(P["S"], P["B"], 0.5); P["O"] = on(P["A"], P["C"], 0.5)
    return pyr_par(add=add, edges_add=[("M", "N"), ("A", "C"), ("B", "D")], hid_add=[("A", "C"), ("B", "D")], acc=[("M", "N")])


@fig("tdien_goc")
def _():
    def add(P): P["M"] = on(P["B"], P["C"], 0.5); P["N"] = on(P["A"], P["D"], 0.5)
    def ex(F, p, c, P):
        F.side(p["A"], p["B"], "6", c); F.side(p["C"], p["D"], "6", c); F.text(on(p["M"], p["N"], 0.74), "3√3", "start", 8, 6)
    return tetra(add=add, edges_add=[("M", "N")], acch=[("M", "N")], extra=ex)


@fig("chop_vuong_B")
def _():
    A, B = (0, 0, 0), (math.sqrt(3), -1, 0); C = (B[0] + math.sqrt(2), B[1] + math.sqrt(6), 0); S = (0, 0, 2.0)
    sb = [B[i] - S[i] for i in range(3)]; t = sum((A[i] - S[i])*sb[i] for i in range(3))/sum(v*v for v in sb)
    Hh = tuple(S[i] + t*sb[i] for i in range(3))
    P = {"S": S, "A": A, "B": B, "C": C, "H": Hh}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("A", "B"), ("B", "C"), ("A", "C"), ("A", "H")]
    def ex(F, p, c, P_):
        F.right_angle(p["A"], p["S"], p["B"], 8); F.right_angle(p["B"], p["A"], p["C"], 8); F.right_angle(p["H"], p["A"], p["S"], 7)
        F.side(p["S"], p["A"], "2", c); F.side(p["A"], p["B"], "2", c); F.side(p["B"], p["C"], "2√2", c)
    return solid3(P, E, [("A", "C")], extra=ex, s=56)


def pyr_sq2(a, h, a_lb=None, h_lb=None, edges_add=(), hid_add=(), acc=(), acch=(), add=None, extra=None, s=None):
    """Hình chóp S.ABCD đáy vuông cạnh a, SA ⊥ đáy, SA = h (đúng tỉ lệ)."""
    P = {"A": (0, 0, 0), "B": (a, 0, 0), "C": (a, a, 0), "D": (0, a, 0), "S": (0, 0, h)}
    if add: add(P)
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")] + list(edges_add)
    def ex(F, p, c, P_):
        F.right_angle(p["A"], p["S"], p["B"], 8)
        if a_lb: F.side(p["A"], p["B"], a_lb, c)
        if h_lb: F.side(p["S"], p["A"], h_lb, c)
        if extra: extra(F, p, c, P_)
    return solid3(P, E, [("A", "D"), ("D", "C"), ("S", "D")] + list(hid_add), acc, acch, extra=ex, s=s or 165/max(a*1.4, h))


@fig("chop_vuong_34")
def _(): return pyr_sq2(3, 4, "3", "4", acc=[("S", "C")])


@fig("chop_bd_sc")
def _(): return pyr_sq2(2, 3, "2", "3", edges_add=[("B", "D")], hid_add=[("B", "D")], acc=[("S", "C"), ("B", "D")])


@fig("chop_deu_nhi_dien")
def _():
    a, h = 2, math.sqrt(3); c = a/2
    P = {"A": (0, 0, 0), "B": (a, 0, 0), "C": (a, a, 0), "D": (0, a, 0), "S": (c, c, h), "O": (c, c, 0)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A", "C"), ("B", "D"), ("S", "O")]
    hid = [("C", "D"), ("D", "A"), ("S", "D"), ("A", "C"), ("B", "D"), ("S", "O")]
    def ex(F, p, c_, P_):
        F.side(p["A"], p["B"], "2", c_); F.text(on(p["S"], p["O"], .5), "√3", "start", 6)
    return solid3(P, E, hid, extra=ex, s=78)


@fig("lt_deu_khoi_da")
def _():
    r3 = math.sqrt(3)
    t = math.radians(-40); u = t + math.pi/3
    P = {"A": (0, 0, 0), "B": (2*math.cos(t), 2*math.sin(t), 0), "C": (2*math.cos(u), 2*math.sin(u), 0)}
    P.update({k + "′": (x, y, 3) for k, (x, y, z) in list(P.items())})
    E = [("A", "B"), ("B", "C"), ("C", "A"), ("A′", "B′"), ("B′", "C′"), ("C′", "A′"), ("A", "A′"), ("B", "B′"), ("C", "C′"), ("A′", "B")]
    def ex(F, p, c, P_):
        F.side(p["A"], p["B"], "2 dm", c); F.side(p["C"], p["C′"], "3 dm", c)
    return solid3(P, E, [("A", "C")], acc=[("A′", "B")], acch=[("A′", "C")], shade=["A′", "B", "C"], extra=ex, k=0.6, ang=40, s=50)


@fig("chop_sab_deu")
def _():
    h = 2*math.sqrt(3)
    P = {"A": (0, 0, 0), "B": (4, 0, 0), "C": (4, 3, 0), "D": (0, 3, 0), "H": (2, 0, 0), "S": (2, 0, h)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("S", "H")]
    def ex(F, p, c, P_):
        F.right_angle(p["H"], p["S"], p["B"], 7)
        F.side(p["A"], p["B"], "4", c)
        F.side(p["B"], p["C"], "3", c)
    return solid3(P, E, [("A", "D"), ("D", "C"), ("S", "D")], extra=ex, s=46)


@fig("lt_dung_45")
def _():
    P = {"A": (0, 0, 0), "B": (3, 0, 0), "C": (3, 4, 0)}
    P.update({k + "′": (x, y, 5) for k, (x, y, z) in list(P.items())})
    E = [("A", "B"), ("B", "C"), ("C", "A"), ("A′", "B′"), ("B′", "C′"), ("C′", "A′"), ("A", "A′"), ("B", "B′"), ("C", "C′")]
    def ex(F, p, c, P_):
        F.right_angle(p["B"], p["A"], p["C"], 8); F.side(p["A"], p["B"], "3", c); F.side(p["B"], p["C"], "4", c)
    return solid3(P, E, [("A", "C")], acch=[("A′", "C")], extra=ex, s=32)


@fig("cay_den_do")
def _():
    return tree([("Đèn đỏ", "0,4"), ("Đèn xanh", "0,6")],
                [[("Đèn đỏ", "0,3"), ("Đèn xanh", "0,7")], [("Đèn đỏ", "0,3"), ("Đèn xanh", "0,7")]], ("Ngã tư 1", "Ngã tư 2"))


@fig("tiep_tuyen")
def _():
    F, M = grid_eq(-1.5, 3.2, -1.6, 4.6, 230)
    plotf(F, M, lambda x: x*x, -1.4, 2.12); F.text(M(-1.4, 1.96), "y = f(x)", "start", 8, -8)
    F.line(M(-0.3, -1.6), M(2.75, 4.5), "acc"); F.text(M(2.75, 4.5), "d", "start", 6, 4)
    F.dot(M(1, 1), 3.4); F.text(M(1, 1), "M", "start", 8, 6); F.dot(M(2, 3), 3)
    xtick(F, M, 1); xtick(F, M, 2); ytick(F, M, 1); ytick(F, M, 3)
    F.line(M(2, 3), M(2, 0), "hid"); F.line(M(2, 3), M(0, 3), "hid"); F.line(M(1, 1), M(1, 0), "hid")
    return F


@fig("thap_lon")
def _():
    F = Fig(300, 200, 260); r = 10; cx = 120
    for i, n in enumerate((3, 5, 7, 9)):
        y = 30 + i*2*r
        for j in range(n): F.circle((cx + (j - (n - 1)/2)*2*r, y), r - 0.8, "ln")
        F.text((cx + (n/2)*2*r + 8, y), f"{n} lon", "start", fixed=True, cls="mut")
    F.text((cx, 30 + 4*2*r + 2), "⋮", fixed=True)
    F.line((cx - 140, 30 + 5*2*r + 6), (cx + 140, 30 + 5*2*r + 6), "ax")
    F.text((cx, 30 + 5*2*r + 22), "tổng cộng 120 lon", fixed=True, cls="mut")
    return F


@fig("do_thi_mu")
def _():
    F, M = grid_eq(-2.4, 2.1, -0.7, 4.5, 220)
    plotf(F, M, lambda x: 3**x, -2.3, 1.36)
    F.dot(M(0, 1), 3); F.dot(M(1, 3), 3.2)
    F.line(M(1, 3), M(1, 0), "hid"); F.line(M(1, 3), M(0, 3), "hid")
    xtick(F, M, 1); ytick(F, M, 1); ytick(F, M, 3)
    return F


@fig("bong_nay")
def _():
    F = Fig(340, 210, 330); g = 185; s = 16.0; x = 34
    F.line((14, g), (330, g), "ax")
    F.line((x, g - 10*s), (x, g), "ln"); F.dot((x, g - 10*s), 4.5)
    F.text((x, g - 5*s), "10 m", "end", -6, fixed=True)
    hh, w = 7.5, 70
    for k in range(5):
        pts = [(x + w*i/30, g - hh*s*4*(i/30)*(1 - i/30)) for i in range(31)]
        F.poly(pts, "ln" if k < 4 else "thin", close=False)
        if k < 1:
            F.line((x + w/2, g), (x + w/2, g - hh*s), "hid")
            F.text((x + w/2, g - hh*s/2), "7,5 m", "start", 5, fixed=True)
        x += w; hh *= 0.75; w *= 0.8
    F.text((x + 6, g - 8), "…", "start", fixed=True)
    return F


# ================================================================ LỚP 12
@fig("bbt_nghich_bien")
def _():
    F = Fig(340, 150, 320); L, R = 6, 334; ys = [6, 34, 62, 142]; xs = [86, 160, 250, 320]
    table_frame(F, xs, ys, L, R); F.line((52, ys[0]), (52, ys[-1]), "thin")
    F.text((29, 20), "x", fixed=True); F.text((29, 48), "y′", fixed=True); F.text((29, 102), "y", fixed=True)
    for x, lb in zip(xs, ["−∞", "−1", "3", "+∞"]): F.text((x, 20), lb, fixed=True)
    for x, lb in zip([123, 160, 205, 250, 285], ["+", "0", "−", "0", "+"]): F.text((x, 48), lb, fixed=True)
    top, bot = 76, 128
    F.text((xs[0], bot), "−∞", fixed=True); F.text((xs[1], top), "4", fixed=True)
    F.text((xs[2], bot), "−2", fixed=True); F.text((xs[3], top), "+∞", fixed=True)
    F.arrow((xs[0] + 14, bot - 8), (xs[1] - 10, top + 8), "ln", 8)
    F.arrow((xs[1] + 10, top + 8), (xs[2] - 12, bot - 8), "ln", 8)
    F.arrow((xs[2] + 14, bot - 8), (xs[3] - 12, top + 8), "ln", 8)
    return F


@fig("do_thi_bac3")
def _():
    F, M = grid_eq(-2.4, 2.6, -1.8, 4.0, 240)
    plotf(F, M, lambda x: x**3 - 3*x + 1, -2.05, 2.08)
    guides(F, M, -1, 3); guides(F, M, 1, -1)
    F.dot(M(-1, 3), 3); F.dot(M(1, -1), 3)
    return F


@fig("bxd_dao_ham")
def _():
    F = Fig(350, 70, 330); ys = [6, 34, 62]; xs = [86, 146, 206, 266, 326]
    table_frame(F, xs, ys, 6, 344); F.line((52, ys[0]), (52, ys[-1]), "thin")
    F.text((29, 20), "x", fixed=True); F.text((29, 48), "f′(x)", fixed=True)
    for x, lb in zip(xs, ["−∞", "−2", "0", "3", "+∞"]): F.text((x, 20), lb, fixed=True)
    for x, lb in zip([116, 146, 176, 206, 236, 266, 296], ["+", "0", "−", "0", "−", "0", "+"]): F.text((x, 48), lb, fixed=True)
    return F


@fig("nha_kinh")
def _():
    M = plot_map(-4.3, 4.6, -1.3, 13.6, 250, 240, 22)
    F = Fig(250, 240, 240); axes(F, M, -4.3, 4.6, -1.3, 13.6)
    fn = lambda x: 12 - x*x; x0 = 1.7
    rect = [M(-x0, 0), M(x0, 0), M(x0, fn(x0)), M(-x0, fn(x0))]
    F.poly(rect, "sh"); F.poly(rect, "acc")
    plotf(F, M, fn, -math.sqrt(12), math.sqrt(12))
    F.dot(M(x0, fn(x0)), 3); F.text(M(2.6, fn(2.6)), "y = 12 − x²", "start", 8, -4)
    F.text(M(0.85, 5.6), "nhà", fixed=True, cls="mut"); F.text(M(0.85, 3.6), "kính", fixed=True, cls="mut")
    return F


@fig("do_thi_phan_thuc")
def _():
    M, Hh = emap(-5.6, 4.6, -3.6, 7.6, 250)
    F = Fig(250, Hh, 240); axes(F, M, -5.6, 4.6, -3.6, 7.6)
    fn = lambda x: (2*x - 1)/(x + 1)
    plotf(F, M, fn, -5.5, -1.55); plotf(F, M, fn, -0.42, 4.5)
    F.line(M(-1, -3.6), M(-1, 7.6), "hid"); F.line(M(-5.6, 2), M(4.6, 2), "hid")
    xtick(F, M, -1, ""); F.text(M(-1, 0), "−1", "end", -4, -10, fixed=True); F.text(M(0, 2), "2", "start", 6, -10, fixed=True)
    return F


@fig("nhan_dang_bac3")
def _():
    F, M = grid_eq(-1.6, 3.6, -1.8, 4.0, 240)
    plotf(F, M, lambda x: -x**3 + 3*x*x - 1, -0.9, 2.95)
    guides(F, M, 2, 3); F.dot(M(2, 3), 3); F.dot(M(0, -1), 3); F.text(M(0, -1), "−1", "start", 7, 11, fixed=True)
    return F


@fig("hop_vecto")
def _():
    def ex(F, p, c, P):
        for q in ("B", "D", "A'"): F.arrow(p["A"], p[q], "acc")
    return box((1.6, 1, 1.4), slant=(0.5, 0.25), extra=ex)


def sgk_proj(s=34, ox=120, oy=170, k=0.55, ang=40):
    """Quy ước SGK: Ox hướng về phía người xem (chéo xuống trái), Oy sang phải, Oz lên trên."""
    c, sn = k*math.cos(math.radians(ang)), k*math.sin(math.radians(ang))
    return lambda x, y, z: (ox + s*(y - c*x), oy - s*(z - sn*x))


def axes3(F, P, ends, labels=("x", "y", "z")):
    O = P(0, 0, 0)
    for end, lb in zip(ends, labels):
        e = P(*end); F.arrow(O, e, "ln", 7); F.text(e, lb, "middle", -8 if lb == "x" else (10 if lb == "y" else 0), 10 if lb != "z" else -10)


@fig("hop_oxyz")
def _():
    P = sgk_proj(34, 110, 150)
    F = Fig(300, 240, 260)
    pts = {"O": (0, 0, 0), "A": (3, 0, 0), "B": (3, 4, 0), "C": (0, 4, 0), "O′": (0, 0, 2), "A′": (3, 0, 2), "B′": (3, 4, 2), "C′": (0, 4, 2)}
    q = {n: P(*v) for n, v in pts.items()}
    axes3(F, P, [(5, 0, 0), (0, 5.6, 0), (0, 0, 3.4)])
    E = [("A", "B"), ("B", "C"), ("A", "A′"), ("B", "B′"), ("C", "C′"), ("O′", "A′"), ("A′", "B′"), ("B′", "C′"), ("C′", "O′")]
    for a, b in E: F.line(q[a], q[b], "ln")
    for a, b in [("O", "A"), ("O", "C"), ("O", "O′")]: F.line(q[a], q[b], "hid")
    c = centroid(list(q.values()))
    for n in pts:
        F.dot(q[n], 2.4)
        if n != "O": F.vlab(q[n], n, c, 11)
    F.text(q["O"], "O", "end", -6, -8)
    return F


@fig("leu_oxyz")
def _():
    P = sgk_proj(30, 100, 180)
    F = Fig(300, 250, 260)
    pts = {"A": (0, 0, 0), "B": (4, 0, 0), "C": (4, 4, 0), "D": (0, 4, 0), "S": (2, 2, 3)}
    q = {n: P(*v) for n, v in pts.items()}
    axes3(F, P, [(6.4, 0, 0), (0, 5.8, 0), (0, 0, 4.4)])
    for a, b in [("B", "C"), ("C", "D"), ("S", "B"), ("S", "C"), ("S", "D")]: F.line(q[a], q[b], "ln")
    for a, b in [("A", "B"), ("A", "D"), ("S", "A")]: F.line(q[a], q[b], "hid")
    c = centroid(list(q.values()))
    for n in pts: F.dot(q[n], 2.4); F.vlab(q[n], n, c, 11)
    return F


@fig("hist_cho_xe")
def _(): return hist([0, 10, 20, 30, 40, 50], [4, 10, 14, 8, 4], "Thời gian chờ (phút)", "Số hành khách")


@fig("hist_tu_hoc")
def _(): return hist([2, 4, 6, 8, 10], [3, 7, 6, 4], "Thời gian (giờ)", "Số học sinh", W=280)


@fig("bien_hieu")
def _():
    M, Hh = emap(-2.7, 2.7, -1.45, 1.65, 280)
    F = Fig(280, Hh, 280); fn = lambda x: 1.2 - 0.3*x*x
    shape = [M(-2, -1), M(2, -1)] + curve(M, fn, 2, -2, 60)
    F.poly(shape, "sh"); F.poly(shape, "ln")
    F.line(M(-2, 0), M(2, 0), "hid"); F.line(M(0, 0), M(0, 1.2), "hid")
    F.text(M(0, -1), "4 m", "middle", 0, 13, fixed=True); F.text(M(-2, -0.5), "1 m", "end", -6, fixed=True)
    F.text(M(0, 0.6), "1,2 m", "start", 6)
    return F


@fig("dt_hai_do_thi")
def _():
    F, M = grid_eq(-1.2, 4.2, -1.5, 4.4, 240)
    F.poly(curve(M, lambda x: x, 0, 3, 10) + curve(M, lambda x: x*x - 2*x, 3, 0, 60), "sh")
    plotf(F, M, lambda x: x*x - 2*x, -0.75, 3.25); plotf(F, M, lambda x: x, -1.2, 4.2, "acc", 4)
    F.text(M(3.25, 4.06), "y = x² − 2x", "end", -6, -2); F.text(M(4.2, 4.2), "y = x", "end", -4, 14)
    F.line(M(3, 3), M(3, 0), "hid"); xtick(F, M, 3)
    return F


@fig("khoi_tron_xoay")
def _(): return revolve(lambda x: math.sqrt(x) + 1, 0, 9, "y = √x + 1", 4)


@fig("do_thi_van_toc")
def _():
    M = plot_map(-1.2, 15.2, -1.6, 15.2, 310, 210, 24)
    F = Fig(310, 210, 310); axes(F, M, -1.2, 15.2, -1.6, 15.2, "t (s)", "v (m/s)")
    pts = [M(0, 0), M(4, 12), M(10, 12), M(13, 0)]
    F.poly(pts, "sh"); F.poly(pts, "acc", close=False)
    F.line(M(4, 12), M(4, 0), "hid"); F.line(M(10, 12), M(10, 0), "hid"); F.line(M(4, 12), M(0, 12), "hid")
    for x in (4, 10, 13): xtick(F, M, x)
    ytick(F, M, 12)
    return F


@fig("mp_doan_chan")
def _():
    P = sgk_proj(24, 110, 190)
    F = Fig(300, 260, 250)
    axes3(F, P, [(5.2, 0, 0), (0, 3.6, 0), (0, 0, 7.4)])
    A, B, C = P(3, 0, 0), P(0, 2, 0), P(0, 0, 6)
    F.poly([A, B, C], "sh"); F.poly([A, B, C], "acc")
    c = centroid([A, B, C, P(0, 0, 0)])
    for p_, n in ((A, "A"), (B, "B"), (C, "C")): F.dot(p_, 3); F.vlab(p_, n, c, 12)
    F.text(P(0, 0, 0), "O", "end", -6, -8)
    return F


@fig("den_san_khau")
def _():
    P = proj(40, 230, 28, 0.55, 30)
    F = Fig(320, 250, 300)
    floor = [P(-0.5, -0.5, 0), P(9.5, -0.5, 0), P(9.5, 5.5, 0), P(-0.5, 5.5, 0)]
    F.poly(floor, "thin"); F.text(floor[1], "sàn (Oxy)", "start", 6, 8, cls="mut")
    O, A, B, Mp = P(0, 0, 0), P(0, 0, 6), P(8, 0, 6), P(4, 3, 0)
    F.arrow(O, P(10.5, 0, 0), "ln", 7); F.text(P(10.5, 0, 0), "x", "start", 4, 8)
    F.arrow(O, P(0, 6.6, 0), "ln", 7); F.text(P(0, 6.6, 0), "y", "start", 4, -2)
    F.arrow(O, P(0, 0, 7.3), "ln", 7); F.text(P(0, 0, 7.3), "z", "middle", 0, -10)
    F.line(B, P(8, 0, 0), "hid"); F.dot(P(8, 0, 0), 2.2)
    F.line(A, Mp, "acc"); F.line(B, Mp, "acc")
    for p_, n, dx, dy in ((A, "A", -10, -4), (B, "B", 10, -6), (Mp, "M", 0, 14), (O, "O", -8, 8)):
        F.dot(p_, 3); F.text(p_, n, "middle", dx, dy)
    F.arc(Mp, A, B, 18, "?", 32)
    return F


@fig("bong_goc_phong")
def _():
    s = 34; P = sgk_proj(s, 110, 175)
    F = Fig(300, 240, 260)
    for poly in ([(0, 0, 0), (4, 0, 0), (4, 4.2, 0), (0, 4.2, 0)], [(0, 0, 0), (4, 0, 0), (4, 0, 3.6), (0, 0, 3.6)], [(0, 0, 0), (0, 4.2, 0), (0, 4.2, 3.6), (0, 0, 3.6)]):
        F.poly([P(*v) for v in poly], "thin")
    axes3(F, P, [(5.3, 0, 0), (0, 5.4, 0), (0, 0, 4.6)])
    I = P(1.5, 1.5, 1.5); r = 1.5*s
    F.circle(I, r, "sh"); F.circle(I, r, "ln"); F.dot(I, 3); F.text(I, "I", "end", -6, -6)
    F.line(I, (I[0] + r, I[1]), "thin"); F.text((I[0] + r/2, I[1]), "1,5", "middle", 0, -9)
    F.text(P(0, 0, 0), "O", "end", -8, 12)
    return F


@fig("cay_hai_ca")
def _():
    return tree([("Ca ngày", "0,55"), ("Ca đêm", "0,45")],
                [[("Phế phẩm", "0,02"), ("Đạt chuẩn", "0,98")], [("Phế phẩm", "0,06"), ("Đạt chuẩn", "0,94")]], ("Ca làm việc", "Chất lượng"))


# ================================================================ xuất
def main():
    assert set(H) == set(FK), ("hình thiếu:", set(FK) - set(H), "hình thừa:", set(H) - set(FK))
    out = {}
    for name in sorted(H, key=lambda n: list(FK).index(n)):
        F = H[name](); key = FK[name]
        assert key not in H_OLD, ("trùng khóa với hinh.js", key)
        F.place(key)
        svg = F.svg()
        assert "<svg" in svg and "fill=\"#" not in svg and "stroke=\"#" not in svg, name
        out[key] = svg
    js = ("// Tệp sinh tự động từ content/hinh_bosung.py (hình cho câu ở bosung.js). Nạp SAU hinh.js.\n"
          "Object.assign(window.KHKT_HINH = window.KHKT_HINH || {}, " + json.dumps(out, ensure_ascii=False, indent=0) + ");\n")
    OUT.write_text(js, encoding="utf-8")
    print(len(out), "hình ->", OUT)


if __name__ == "__main__":
    main()
