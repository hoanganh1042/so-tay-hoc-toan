"""Sinh hinh.js: hình minh họa SVG cho các câu hình học, đồ thị và toán thực tế.

Hình do nhóm tự vẽ bằng mã (không lấy từ sách hay đề thi), chỉ thể hiện dữ kiện đã cho trong đề,
không vẽ thêm yếu tố làm lộ đáp án. Màu theo giao diện: nét dùng currentColor, vùng tô dùng lớp .sh.
Khóa giống khóa câu trong web app: <mã bài>#<số thứ tự>, <mã bài>#d, <mã vị trí đề>#<số thứ tự>.
Chạy:  py -I content/hinh_nguon.py
"""
import json, math, pathlib, re, sys
sys.stdout.reconfigure(encoding="utf-8")

OUT = pathlib.Path(__file__).resolve().parent.parent / "web" / "hinh.js"


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


class Fig:
    """Khung hình SVG. Nhãn chữ được lưu riêng rồi tự dời chỗ nếu đè lên nét, chấm hoặc nhãn khác;
    khung nhìn (viewBox) tự co giãn theo mọi phần tử nên không bị cắt mép."""
    CW = 7.3  # bề rộng trung bình một ký tự ở cỡ chữ 13px

    def __init__(self, w, h, fw=None):
        self.w, self.h, self.fw, self.el = w, h, fw or w, []
        self.pts, self.segs, self.dots, self.texts = [], [], [], []

    def _seg(self, p, q, cls):
        self.pts += [p, q]
        if cls not in ("sh", "dot", "grid"): self.segs.append((p, q))

    def line(self, p, q, cls="ln"):
        self._seg(p, q, cls)
        self.el.append(f'<line class="{cls}" x1="{f(p[0])}" y1="{f(p[1])}" x2="{f(q[0])}" y2="{f(q[1])}"/>')

    def poly(self, pts, cls="ln", close=True):
        tag = "polygon" if close else "polyline"
        ring = list(pts) + ([pts[0]] if close else [])
        for a, b in zip(ring, ring[1:]): self._seg(a, b, cls)
        self.el.append(f'<{tag} class="{cls}" points="{" ".join(f(x)+","+f(y) for x, y in pts)}"/>')

    def path(self, d, cls="ln"):
        nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", d)]
        if d.startswith("M") and len(nums) >= 2: self.pts.append((nums[0], nums[1]))
        if " A" in d and len(nums) >= 9: self.pts.append((nums[-2], nums[-1]))
        self.el.append(f'<path class="{cls}" d="{d}"/>')

    def circle(self, c, r, cls="ln"):
        self.pts += [(c[0]-r, c[1]-r), (c[0]+r, c[1]+r)]
        if cls == "dot": self.dots.append((c, r))
        elif cls != "sh":
            n = 48; ring = [(c[0]+r*math.cos(2*math.pi*i/n), c[1]+r*math.sin(2*math.pi*i/n)) for i in range(n+1)]
            self.segs += list(zip(ring, ring[1:]))
        self.el.append(f'<circle class="{cls}" cx="{f(c[0])}" cy="{f(c[1])}" r="{f(r)}"/>')

    def dot(self, p, r=3):
        self.circle(p, r, "dot")

    def text(self, p, s, anchor="middle", dx=0, dy=0, cls="", ref=None, fixed=False):
        """Nhãn tại p + (dx, dy). ref là điểm nhãn mô tả (mặc định p): khi phải dời, nhãn xoay quanh ref."""
        w = self.CW*len(s) + 2; x = p[0]+dx
        cx = x + (0 if anchor == "middle" else (-w/2 if anchor == "end" else w/2))
        self.texts.append({"c": (cx, p[1]+dy), "w": w, "s": s, "cls": cls, "ref": ref or p, "fixed": fixed})

    def label_mid(self, p, q, s, off=12, side=1):
        """Nhãn ở giữa đoạn pq, lệch vuông góc một khoảng off (side đổi phía)."""
        mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2
        dx, dy = q[0]-p[0], q[1]-p[1]; L = math.hypot(dx, dy) or 1
        nx, ny = -dy/L*side, dx/L*side
        self.text((mx+nx*off, my+ny*off), s, ref=(mx, my))

    def arrow(self, p, q, cls="acc", h=9):
        """Vectơ pq: đoạn thẳng có mũi tên ở q."""
        u = unit(p, q); n = (-u[1], u[0]); e = (q[0]-u[0]*h*0.7, q[1]-u[1]*h*0.7)
        self.line(p, e, cls); self.pts.append(q); self.segs.append((e, q))
        tip = [q, (q[0]-u[0]*h+n[0]*h*.42, q[1]-u[1]*h+n[1]*h*.42), (q[0]-u[0]*h-n[0]*h*.42, q[1]-u[1]*h-n[1]*h*.42)]
        self.el.append(f'<polygon class="{"ah" if cls.startswith("acc") else "dot"}" points="{" ".join(f(x)+","+f(y) for x, y in tip)}"/>')

    def vlab(self, p, s, center, off=12):
        """Nhãn đỉnh đặt hướng ra ngoài, tính từ tâm hình."""
        u = unit(center, p); self.text((p[0]+u[0]*off, p[1]+u[1]*off), s, ref=p)

    def side(self, p, q, s, center, off=12):
        """Nhãn cạnh pq đặt phía ngoài hình (ngược phía tâm)."""
        mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2; dx, dy = q[0]-p[0], q[1]-p[1]; L = math.hypot(dx, dy) or 1
        nx, ny = -dy/L, dx/L
        if nx*(center[0]-mx) + ny*(center[1]-my) > 0: nx, ny = -nx, -ny
        self.text((mx+nx*off, my+ny*off), s, ref=(mx, my))

    def right_angle(self, v, a, b, s=9):
        ua = unit(v, a); ub = unit(v, b)
        p1 = (v[0]+ua[0]*s, v[1]+ua[1]*s); p3 = (v[0]+ub[0]*s, v[1]+ub[1]*s)
        p2 = (p1[0]+ub[0]*s, p1[1]+ub[1]*s)
        self.poly([p1, p2, p3], "thin", close=False)

    def arc(self, v, a, b, r=18, label=None, lr=None):
        a1 = math.atan2(a[1]-v[1], a[0]-v[0]); a2 = math.atan2(b[1]-v[1], b[0]-v[0])
        d = (a2-a1) % (2*math.pi)
        if d > math.pi: a1, a2, d = a2, a1, 2*math.pi-d
        p = (v[0]+r*math.cos(a1), v[1]+r*math.sin(a1)); q = (v[0]+r*math.cos(a1+d), v[1]+r*math.sin(a1+d))
        self.path(f"M{f(p[0])},{f(p[1])} A{f(r)},{f(r)} 0 0 1 {f(q[0])},{f(q[1])}", "thin")
        n = 12; pts = [(v[0]+r*math.cos(a1+d*i/n), v[1]+r*math.sin(a1+d*i/n)) for i in range(n+1)]
        self.segs += list(zip(pts, pts[1:])); self.pts += pts
        if label:
            m = a1 + d/2; rr = lr or r + 12
            self.text((v[0]+rr*math.cos(m), v[1]+rr*math.sin(m)), label, ref=(v[0]+r*math.cos(m), v[1]+r*math.sin(m)))

    # ----- đặt nhãn -----
    @staticmethod
    def _box(t, c=None):
        cx, cy = c or t["c"]; return (cx-t["w"]/2, cy-8, cx+t["w"]/2, cy+8)

    def _hits(self, t, c, others):
        x0, y0, x1, y1 = self._box(t, c); r = (x0-1, y0+2, x1+1, y1-2)
        n = 0
        for o in others:
            a = self._box(o)
            if x0 < a[2]-1 and a[0] < x1-1 and y0 < a[3]-2 and a[1] < y1-2: n += 1
        for p, q in self.segs:
            if seg_rect(p, q, r): n += 1
        for (dx, dy), rr in self.dots:
            if r[0]-rr < dx < r[2]+rr and r[1]-rr < dy < r[3]+rr: n += 1
        return n

    def place(self, key=""):
        for i, t in enumerate(self.texts):
            others = self.texts[:i] + self.texts[i+1:]
            if t["fixed"] or not self._hits(t, t["c"], others): continue
            rx, ry = t["ref"]; best = None
            for g in (5, 8, 12, 17, 23, 30):
                for k in range(32):
                    th = 2*math.pi*k/32
                    c = (rx + math.cos(th)*(t["w"]/2 + g), ry + math.sin(th)*(8 + g))
                    h = self._hits(t, c, others)
                    d = math.hypot(c[0]-t["c"][0], c[1]-t["c"][1])
                    if best is None or (h, d) < best[:2]: best = (h, d, c)
                if best[0] == 0: break
            if best[0]: print(f"  [{key}] nhãn '{t['s']}' vẫn chạm {best[0]} chỗ")
            t["c"] = best[2]

    def bbox(self, pad=6):
        bx = [self._box(t) for t in self.texts]
        xs = [x for x, _ in self.pts] + [b[0] for b in bx] + [b[2] for b in bx]
        ys = [y for _, y in self.pts] + [b[1] for b in bx] + [b[3] for b in bx]
        return min(xs)-pad, min(ys)-pad, max(xs)+pad, max(ys)+pad

    def svg(self):
        x0, y0, x1, y1 = self.bbox()
        w, h = x1-x0, y1-y0; fw = min(340, round(w*self.fw/self.w))
        tx = "".join(f'<text{" class=" + chr(34) + t["cls"] + chr(34) if t["cls"] else ""} x="{f(t["c"][0])}" y="{f(t["c"][1])}" '
                     f'text-anchor="middle" dominant-baseline="middle">{t["s"]}</text>' for t in self.texts)
        return (f'<svg viewBox="{f(x0)} {f(y0)} {f(w)} {f(h)}" style="--fw:{fw}px" role="img" aria-label="Hình minh họa cho câu hỏi">'
                + "".join(self.el) + tx + "</svg>")


def seg_rect(p, q, r):
    """Đoạn pq có cắt hình chữ nhật r = (x0, y0, x1, y1) không (lấy mẫu dày)."""
    for i in range(41):
        t = i/40; x = p[0]+(q[0]-p[0])*t; y = p[1]+(q[1]-p[1])*t
        if r[0] < x < r[2] and r[1] < y < r[3]: return True
    return False


def unit(v, a):
    dx, dy = a[0]-v[0], a[1]-v[1]; L = math.hypot(dx, dy) or 1
    return dx/L, dy/L


def proj(ox, oy, s, k=0.45, ang=35):
    """Phép chiếu xiên: x sang phải, y vào sâu (lệch lên phải), z lên trên."""
    c, sn = math.cos(math.radians(ang))*k, math.sin(math.radians(ang))*k
    return lambda x, y, z: (ox + s*(x + y*c), oy - s*(z + y*sn))


def plot_map(x0, x1, y0, y1, W, H, pad=28):
    sx = (W-2*pad)/(x1-x0); sy = (H-2*pad)/(y1-y0)
    return lambda x, y: (pad + (x-x0)*sx, H - pad - (y-y0)*sy)


def axes(F, M, x0, x1, y0, y1, ox="x", oy="y"):
    F.line(M(x0, 0), M(x1, 0), "ax"); F.line(M(0, y0), M(0, y1), "ax")
    F.text(M(x1, 0), ox, "start", 6, -8); F.text(M(0, y1), oy, "start", 8, 2); F.text(M(0, 0), "O", "end", -5, 10)


def curve(M, fn, a, b, n=60):
    return [M(a+(b-a)*i/n, fn(a+(b-a)*i/n)) for i in range(n+1)]


H = {}

# ---------------- hình phẳng, đồ thị ----------------
def tri_100():
    F = Fig(300, 200, 300); s = 1.25
    AC = 100*math.sin(math.radians(75))/math.sin(math.radians(45))
    A = (50, 180); B = (A[0]+100*s, 180)
    C = (A[0]+s*AC*math.cos(math.radians(60)), A[1]-s*AC*math.sin(math.radians(60)))
    F.poly([A, B, C]); [F.dot(p) for p in (A, B, C)]
    F.text(A, "A", "end", -6, 6); F.text(B, "B", "start", 6, 6); F.text(C, "C", "middle", 0, -12)
    F.label_mid(A, B, "100 m", 14, 1)
    F.arc(A, B, C, 22, "60°", 38); F.arc(B, C, A, 22, "75°", 38)
    return F
H["10-III-6#4"] = tri_100()

def antenna():
    F = Fig(320, 230, 320); g = 205; s = 2.0
    d = 30/math.tan(math.radians(25)); Hh = 30 + d*math.tan(math.radians(40))
    T = (60, g-30*s); bx = 60 + d*s*0.95
    F.line((20, g), (300, g), "ax")
    F.poly([(30, g), (60, g), T, (30, T[1])], "ln")
    top = (bx, g-Hh*s*0.95 if g-Hh*s*0.95 > 12 else 12); base = (bx, g)
    F.line(base, top, "acc"); F.dot(top); F.dot(base); F.dot(T)
    F.line(T, top, "thin"); F.line(T, base, "thin"); F.line(T, (bx, T[1]), "hid")
    F.arc(T, (bx, T[1]), top, 30, "40°", 46); F.arc(T, base, (bx, T[1]), 30, "25°", 46)
    F.text((22, (g+T[1])/2), "30 m", "end", 6)
    F.text(top, "đỉnh cột", "start", 8, 0); F.text(base, "chân cột", "start", 8, -10)
    return F
H["10-III-6#12"] = antenna()

def iso_g():
    F = Fig(280, 210, 280); B, C, A = (40, 180), (240, 180), (140, 180-40*100/30)
    G = (140, 180-(40*100/30)/3)
    F.poly([A, B, C]); [F.dot(p) for p in (A, B, C, G)]
    F.text(A, "A", "middle", 0, -12); F.text(B, "B", "end", -6, 6); F.text(C, "C", "start", 6, 6); F.text(G, "G", "start", 8, 0)
    F.label_mid(A, B, "50 m", 14, 1); F.label_mid(A, C, "50 m", 14, -1); F.label_mid(B, C, "60 m", 14, -1)
    return F
H["10-IV-9#6"] = iso_g()

def cable_2d():
    F = Fig(300, 230, 300); M = plot_map(-4.5, 5.5, -0.8, 6.3, 300, 230, 24)
    axes(F, M, -4.5, 5.5, -0.8, 6.3)
    D, A, B = M(0, 1), M(-3, 5), M(4, 5)
    F.line(D, A, "acc"); F.line(D, B, "acc"); [F.dot(p) for p in (A, B, D)]
    F.text(A, "A(−3; 5)", "middle", 0, -12); F.text(B, "B(4; 5)", "middle", 0, -12); F.text(D, "D(0; 1)", "start", 8, 10)
    F.arc(D, A, B, 20)
    return F
H["10-IV-11#6"] = cable_2d()

def ship_light():
    F = Fig(320, 250, 320); M = plot_map(-4.5, 10.5, -0.8, 11.3, 320, 250, 24)
    axes(F, M, -4.5, 10.5, -0.8, 11.3)
    A, B, I = M(-3, 10), M(9, 1), M(4, 3)
    F.line(A, B, "acc"); F.path(f"M{f(B[0])},{f(B[1])} l-10,-1 l4,-7z", "dot")
    [F.dot(p) for p in (A, B)]; F.dot(I, 4)
    F.text(A, "A(−3; 10)", "start", 8, -6); F.text(B, "B(9; 1)", "end", -6, 14); F.text(I, "I(4; 3)", "end", -8, 4)
    return F
H["10-VII-19#5"] = ship_light()

def ferris():
    F = Fig(260, 260, 260); M = plot_map(-21, 21, -2, 40, 260, 260, 20)
    F.line(M(-21, 0), M(21, 0), "ax"); F.text(M(21, 0), "mặt đất", "end", 0, 12)
    I = M(0, 20); F.circle(I, (M(18, 0)[0]-M(0, 0)[0]), "ln"); F.dot(I)
    F.text(I, "I(0; 20)", "start", 6, 12)
    P = M(10.8, 20+math.sqrt(18**2-10.8**2)); F.dot(P, 5)
    F.line(P, M(10.8, 0), "hid"); F.text(M(10.8, 0), "x = 10,8", "middle", 0, 12)
    F.line(I, P, "thin"); F.label_mid(I, P, "18", 10, -1)
    F.text(P, "cabin", "start", 8, -6)
    return F
H["10-VII-21#4"] = ferris()

def half_ellipse(a, b, labels, mark=None, truck=None, fw=300):
    F = Fig(300, 190, fw); M = plot_map(-a*1.15, a*1.15, -b*0.12, b*1.25, 300, 190, 22)
    F.line(M(-a*1.15, 0), M(a*1.15, 0), "ax")
    pts = curve(M, lambda x: b*math.sqrt(max(0, 1-(x/a)**2)), -a, a, 80); F.poly(pts, "ln", close=False)
    F.poly(pts + [M(a, 0), M(-a, 0)], "sh")
    F.line(M(0, 0), M(0, b), "hid"); F.text(M(0, b/2), labels[1], "start", 6)
    F.text(M(0, 0), labels[0], "middle", 0, 30 if (truck or mark) else 12)
    if mark:
        y = b*math.sqrt(1-(mark/a)**2); F.line(M(mark, 0), M(mark, y), "acc"); F.dot(M(mark, y))
        F.text(M(mark/2, 0), labels[2], "middle", 0, 12); F.text(M(mark, y/2), "?", "start", 6)
    if truck:
        y = b*math.sqrt(1-(truck/2/a)**2)
        F.poly([M(-truck/2, 0), M(truck/2, 0), M(truck/2, y), M(-truck/2, y)], "acc")
        F.text(M(0, 0), "xe " + labels[2], "middle", 0, 12)
    return F
H["10-VII-22#4"] = half_ellipse(20, 15, ["rộng 40 m", "15 m", "12 m"], mark=12)
H["10-VII-22#5"] = half_ellipse(4, 3, ["rộng 8 m", "3 m", "2,4 m"], truck=2.4)

def region(lines, verts, xmax, ymax, labels):
    F = Fig(260, 240, 260); M = plot_map(-0.8, xmax, -0.8, ymax, 260, 240, 22)
    F.poly([M(*v) for v in verts], "sh")
    axes(F, M, -0.8, xmax, -0.8, ymax)
    for (p, q), lb in zip(lines, labels):
        F.line(M(*p), M(*q), "ln"); F.text(M(*q), lb, "start", 4, -6)
    return F
H["10-II-4#3"] = region([((-0.5, 5.5), (5.6, -0.6)), ((-0.8, 0.2), (4.2, 5.2))], [(0, 0), (5, 0), (2, 3), (0, 1)], 6.5, 6.5, ["x + y = 5", "x − y = −1"])
H["III-4#6"] = region([((-0.5, 4.5), (4.6, -0.6))], [(0, 0), (4, 0), (0, 4)], 5.5, 5.5, ["x + y = 4"])

def wall_fence():
    F = Fig(280, 170, 280)
    F.line((30, 30), (250, 30), "thick"); F.text((140, 16), "bức tường", "middle")
    for x in range(36, 250, 14): F.line((x, 30), (x-8, 22), "thin")
    F.poly([(70, 30), (70, 130), (210, 130), (210, 30)], "acc", close=False)
    F.text((60, 80), "x", "end"); F.text((220, 80), "x", "start")
    F.text((140, 150), "40 m lưới rào ba cạnh", "middle")
    return F
H["12-I-5#4"] = wall_fence()

def sheet(side):
    F = Fig(240, 230, 240); a, x0, y0, c = 170, 35, 25, 34
    F.poly([(x0, y0), (x0+a, y0), (x0+a, y0+a), (x0, y0+a)])
    for cx, cy in [(x0, y0), (x0+a-c, y0), (x0, y0+a-c), (x0+a-c, y0+a-c)]:
        F.poly([(cx, cy), (cx+c, cy), (cx+c, cy+c), (cx, cy+c)], "sh")
    for p, q in [((x0+c, y0+c), (x0+a-c, y0+c)), ((x0+a-c, y0+c), (x0+a-c, y0+a-c)), ((x0+a-c, y0+a-c), (x0+c, y0+a-c)), ((x0+c, y0+a-c), (x0+c, y0+c))]:
        F.line(p, q, "hid")
    F.text((x0+c/2, y0+c/2), "x"); F.text((x0+a/2, y0+a+14), side)
    F.text((x0+a/2, y0+a/2), "gập lên", "middle", cls="mut")
    return F
H["12-I-2#3"] = sheet("12 cm"); H["III-3#4"] = sheet("6 dm"); H["III-3#5"] = sheet("60 cm")

def shadow():
    F = Fig(340, 200, 340); g = 175
    F.line((10, g), (330, g), "ax")
    F.line((40, g), (40, g-60), "thick"); F.line((40, g-60), (80, g), "hid")
    F.text((34, g-30), "6 m", "end"); F.text((60, g+12), "4 m")
    F.poly([(170, g), (200, g), (200, g-150), (170, g-150)], "ln")
    F.line((200, g-150), (300, g), "hid"); F.line((200, g), (300, g), "acc")
    F.text((250, g+12), "bóng 18 m"); F.text((164, g-75), "?", "end")
    for k in range(3): F.line((62+k*30, 14), (98+k*30, 68), "thin")
    F.text((60, 20), "tia nắng", "end", -6)
    return F
H["11-IV-14#6"] = shadow()

def roof():
    F = Fig(300, 150, 300); L, R, T = (30, 120), (270, 120), (150, 58)
    F.line((20, 120), (280, 120), "ax"); F.poly([L, T, R], "ln", close=False)
    F.line(T, (150, 120), "hid"); F.text((144, 98), "1,5 m", "end")
    F.text((150, 136), "bề ngang 8 m"); F.arc(T, L, R, 18)
    F.text((162, 84), "?", fixed=True); F.text((40, 136), "trần", "middle", cls="mut")
    return F
H["11-VII-25#5"] = roof()

def door():
    F = Fig(220, 260, 200); M = plot_map(-0.95, 0.95, -0.1, 2.2, 220, 260, 18)
    F.poly([M(-0.75, 0), M(0.75, 0), M(0.75, 2), M(-0.75, 2)])
    pts = curve(M, lambda x: 2*(1-(x/0.75)**2), -0.75, 0.75, 60); F.poly(pts, "sh"); F.poly(pts, "ln", close=False)
    F.text(M(0, 0), "1,5 m", "middle", 0, 12); F.text(M(0.75, 1), "2 m", "start", 6)
    F.text(M(0, 0.7), "kính"); F.text(M(-0.6, 1.75), "gỗ", cls="mut")
    return F
H["12-IV-13#5"] = door()

def gate(w, h, lw, lh):
    F = Fig(260, 200, 260); M = plot_map(-w*0.65, w*0.65, -h*0.1, h*1.2, 260, 200, 20)
    F.line(M(-w*0.65, 0), M(w*0.65, 0), "ax")
    pts = curve(M, lambda x: h*(1-(2*x/w)**2), -w/2, w/2, 60); F.poly(pts, "sh"); F.poly(pts, "ln", close=False)
    F.line(M(0, 0), M(0, h), "hid"); F.text(M(0, h/2), lh, "start", 6)
    F.text(M(0, 0), lw, "middle", 0, 12)
    return F
H["I-2#6"] = gate(6, 4.5, "6 m", "4,5 m"); H["III-2#1"] = gate(4, 4, "4 m", "4 m")

def plot_fx(F, M, fn, a, b, cls="ln"):
    pts = [(x, fn(x)) for x in [a+(b-a)*i/80 for i in range(81)]]
    F.poly([M(x, y) for x, y in pts], cls, close=False)

def lake():
    F = Fig(260, 220, 260); M = plot_map(-1, 5, -4.8, 1.6, 260, 220, 22)
    fn = lambda x: x*x-4*x
    F.poly(curve(M, fn, 0, 4) + [M(0, 0)], "sh"); axes(F, M, -1, 5, -4.8, 1.6)
    plot_fx(F, M, fn, -0.3, 4.3); F.text(M(4.3, fn(4.3)), "y = x² − 4x", "start", 4, 0)
    return F
H["III-2#2"] = lake()

def p_x2_line():
    xr, yr = (-2.2, 3), (-0.6, 5.2)
    F = Fig(260, 240, 260); M = plot_map(*xr, *yr, 260, 240, 22)
    F.poly(curve(M, lambda x: x+2, -1, 2) + curve(M, lambda x: x*x, 2, -1), "sh"); axes(F, M, *xr, *yr)
    plot_fx(F, M, lambda x: x*x, -2.2, 2.25); plot_fx(F, M, lambda x: x+2, -2.2, 3, "acc")
    F.text(M(2.25, 5.06), "y = x²", "end", -6, 0); F.text(M(3, 5), "y = x + 2", "end", 0, 14)
    return F
H["III-2#4"] = p_x2_line()

def p_x2_03():
    xr, yr = (-0.8, 3.8), (-0.8, 10)
    F = Fig(240, 240, 240); M = plot_map(*xr, *yr, 240, 240, 22)
    F.poly(curve(M, lambda x: x*x, 0, 3) + [M(3, 0), M(0, 0)], "sh"); axes(F, M, *xr, *yr)
    plot_fx(F, M, lambda x: x*x, -0.6, 3.15); F.line(M(3, 0), M(3, 9), "hid")
    F.text(M(3, 0), "3", "middle", 0, 12); F.text(M(3.15, 9.9), "y = x²", "end", -8, 0)
    return F
H["III-2#6"] = p_x2_03()

def p_x2_2x():
    xr, yr = (-0.8, 3), (-0.8, 5.4)
    F = Fig(240, 240, 240); M = plot_map(*xr, *yr, 240, 240, 22)
    F.poly(curve(M, lambda x: 2*x, 0, 2) + curve(M, lambda x: x*x, 2, 0), "sh"); axes(F, M, *xr, *yr)
    plot_fx(F, M, lambda x: x*x, -0.5, 2.3); plot_fx(F, M, lambda x: 2*x, -0.3, 2.6, "acc")
    F.text(M(2.3, 5.29), "y = x²", "end", -6, 0); F.text(M(2.6, 5.2), "y = 2x", "start", 4, 8)
    return F
H["I-2#5"] = p_x2_2x()

def cover(zc, r, unit, center_lb):
    F = Fig(300, 220, 300); M = plot_map(-r*1.2, r*1.2, zc-r-0.5, zc+r+0.5, 300, 220, 14)
    F.line(M(-r*1.2, 0), M(r*1.2, 0), "ax"); F.text(M(r*1.2, 0), "mặt đất", "end", 0, -10)
    I = M(0, zc); rp = M(r, 0)[0]-M(0, 0)[0]
    F.circle(I, rp, "ln"); F.dot(I); F.text(I, center_lb, "start", 8, -2)
    a = math.sqrt(r*r-zc*zc); F.line(M(-a, 0), M(a, 0), "acc"); F.dot(M(-a, 0)); F.dot(M(a, 0))
    F.line(I, M(0, 0), "hid"); F.text(M(0, zc/2), f"{zc} {unit}", "end", -6)
    F.line(I, M(a, 0), "thin"); F.label_mid(I, M(a, 0), f"R = {r}", 12, -1)
    F.text(M(a/2, 0), "?", "middle", 0, 12)
    return F
H["12-V-17#5"] = cover(5, 13, "km", "I")
H["12-V-17#4"] = cover(3, 5, "", "tâm")

# ---------------- hình không gian ----------------
def solid(points, edges, hidden, labels, W, Hh, fw, extra=None, shade=None, acc=()):
    F = Fig(W, Hh, fw)
    if shade: F.poly([points[k] for k in shade], "sh")
    for a, b in edges:
        cls = "hid" if (a, b) in hidden or (b, a) in hidden else ("acc" if (a, b) in acc or (b, a) in acc else "ln")
        F.line(points[a], points[b], cls)
    for k, (dx, dy) in labels.items():
        F.dot(points[k], 2.4); F.text(points[k], k, "middle", dx, dy)
    if extra: extra(F, points)
    return F

def pyr_sa(a_lb, sa_lb, key):
    P = proj(70, 190, 52)
    pts = {"A": P(0, 0, 0), "B": P(2.6, 0, 0), "C": P(2.6, 2.6, 0), "D": P(0, 2.6, 0), "S": P(0, 0, 2.9)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")]
    hid = {("A", "D"), ("D", "C"), ("S", "D")}
    lab = {"A": (-10, 8), "B": (10, 8), "C": (10, 4), "D": (-8, -10), "S": (0, -12)}
    def ex(F, p):
        F.right_angle(p["A"], p["S"], p["B"]); F.label_mid(p["A"], p["B"], a_lb, 12, 1); F.label_mid(p["S"], p["A"], sa_lb, 14, 1)
    return solid(pts, E, hid, lab, 280, 220, 260, ex)
H["III-1#0"] = pyr_sa("2", "2", 0); H["III-1#6"] = pyr_sa("2", "2", 0); H["11-VII-25#3"] = pyr_sa("2", "2√3", 0)

def prism():
    P = proj(60, 205, 26)
    pts = {"A": P(0, 0, 0), "B": P(3*1.6, 0, 0), "C": P(0, 4*1.6, 0)}
    pts.update({k + "'": (v[0], v[1]-6*26) for k, v in list(pts.items())})
    E = [("A", "B"), ("B", "C"), ("C", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'")]
    lab = {"A": (-10, 8), "B": (10, 8), "C": (10, 4), "A'": (-10, -6), "B'": (10, -6), "C'": (10, -8)}
    def ex(F, p):
        F.right_angle(p["A"], p["B"], p["C"], 8); F.label_mid(p["A"], p["B"], "3", 12, 1); F.label_mid(p["A"], p["C"], "4", 10, 1)
        F.label_mid(p["A"], p["A'"], "6", 10, 1)
    return solid(pts, E, {("C", "A"), ("C", "B"), ("C", "C'")}, lab, 240, 230, 220, ex)
H["III-1#1"] = prism()

def tetra_o():
    P = proj(70, 200, 26)
    pts = {"O": P(0, 0, 0), "A": P(2*2.6, 0, 0), "B": P(0, 3*2.4, 0), "C": P(0, 0, 6*0.95)}
    E = [("O", "A"), ("O", "B"), ("O", "C"), ("A", "B"), ("B", "C"), ("C", "A")]
    lab = {"O": (-10, 8), "A": (10, 8), "B": (10, 0), "C": (0, -12)}
    def ex(F, p):
        F.right_angle(p["O"], p["A"], p["C"], 8)
        F.label_mid(p["O"], p["A"], "2", 12, 1); F.label_mid(p["O"], p["B"], "3", 10, -1); F.label_mid(p["O"], p["C"], "6", 12, 1)
    return solid(pts, E, {("O", "B")}, lab, 240, 220, 220, ex)
H["III-1#2"] = tetra_o()

def cube(a_lb, shade=None, acc=(), extra_lines=(), W=250, key=None):
    P = proj(60, 200, 110)
    base = {"A": (0, 0), "B": (1, 0), "C": (1, 1), "D": (0, 1)}
    pts = {k: P(x, y, 0) for k, (x, y) in base.items()}; pts.update({k + "'": P(x, y, 1) for k, (x, y) in base.items()})
    E = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "D'"), ("D'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'"), ("D", "D'")] + list(extra_lines)
    hid = {("C", "D"), ("D", "A"), ("D", "D'")} | {e for e in extra_lines if "D" in e and "D'" not in e}
    lab = {"A": (-10, 8), "B": (10, 8), "C": (10, 6), "D": (-10, -8), "A'": (-10, -6), "B'": (10, 6), "C'": (10, -8), "D'": (-8, -10)}
    def ex(F, p): F.label_mid(p["A"], p["B"], a_lb, 12, 1)
    return solid(pts, E, hid, lab, W, 230, 230, ex, shade, acc)
H["III-1#4"] = cube("6", shade=["A'", "B", "D"], extra_lines=[("A'", "B"), ("B", "D"), ("D", "A'")])

def pyr_reg(base_lb, side_lb=None, h_lb=None, sect=None, W=260, fw=240):
    P = proj(50, 205, 44)
    a = 3.6; c = a/2
    pts = {"A": P(0, 0, 0), "B": P(a, 0, 0), "C": P(a, a, 0), "D": P(0, a, 0), "S": P(c, c, 3.4), "O": P(c, c, 0)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A", "C"), ("B", "D"), ("S", "O")]
    hid = {("C", "D"), ("D", "A"), ("S", "D"), ("A", "C"), ("B", "D"), ("S", "O")}
    lab = {"A": (-10, 8), "B": (10, 8), "C": (10, 4), "D": (-8, -10), "S": (0, -12), "O": (8, 10)}
    def ex(F, p):
        F.label_mid(p["A"], p["B"], base_lb, 12, 1)
        if side_lb: F.label_mid(p["S"], p["B"], side_lb, 12, 1)
        if h_lb: F.text(((p["S"][0]+p["O"][0])/2, (p["S"][1]+p["O"][1])/2), h_lb, "start", 6)
        if sect:
            t = sect; q = [((1-t)*p[k][0]+t*p["S"][0], (1-t)*p[k][1]+t*p["S"][1]) for k in "ABCD"]
            F.poly(q, "sh"); F.poly(q, "acc")
    return solid(pts, E, hid, lab, W, 230, fw, ex)
H["III-1#5"] = pyr_reg("6", "5")
H["11-VII-26#5"] = pyr_reg("4 m", h_lb="3 m")
H["11-IV-13#6"] = pyr_reg("12 m", h_lb="9 m", sect=1/3)

def flagpole():
    P = proj(40, 200, 40)
    import math as m
    r = 2.4; cx, cy = 2.8, 2.6
    pts = {"A": P(cx + r*m.cos(m.radians(250)), cy + r*m.sin(m.radians(250)), 0), "B": P(cx + r*m.cos(m.radians(10)), cy + r*m.sin(m.radians(10)), 0),
           "C": P(cx + r*m.cos(m.radians(130)), cy + r*m.sin(m.radians(130)), 0), "O": P(cx, cy, 0), "S": P(cx, cy, 3.6)}
    E = [("A", "B"), ("B", "C"), ("C", "A"), ("S", "A"), ("S", "B"), ("S", "C"), ("S", "O")]
    lab = {"A": (-4, 12), "B": (10, 6), "C": (-10, -4), "O": (8, 8), "S": (0, -12)}
    def ex(F, p):
        F.text(((p["S"][0]+p["O"][0])/2, (p["S"][1]+p["O"][1])/2), "8 m", "end", -6)
        F.label_mid(p["S"], p["B"], "10 m", 12, -1)
    return solid(pts, E, set(), lab, 260, 220, 240, ex, acc={("S", "O")})
H["11-VII-23#6"] = flagpole()

def room(dims, lbl, acc_lines=(), extra=None, lab_override=None, s=22, oy=None, k=0.45, ang=35):
    a, b, c = dims
    oy = oy or int(30 + s*(c + b*0.26) + 20)
    P = proj(40, oy, s, k, ang)
    base = {"A": (0, 0), "B": (a, 0), "C": (a, b), "D": (0, b)}
    pts = {k: P(x, y, 0) for k, (x, y) in base.items()}; pts.update({k + "'": P(x, y, c) for k, (x, y) in base.items()})
    E = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "D'"), ("D'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'"), ("D", "D'")] + list(acc_lines)
    hid = {("C", "D"), ("D", "A"), ("D", "D'")}
    lab = lab_override if lab_override is not None else {"A": (-10, 8), "B": (10, 8), "C": (10, 6), "D": (-10, -8), "A'": (-10, -6), "B'": (10, 6), "C'": (10, -8), "D'": (-8, -10)}
    def ex(F, p):
        F.label_mid(p["A"], p["B"], lbl[0], 12, 1); F.label_mid(p["B"], p["C"], lbl[1], 12, 1); F.label_mid(p["B"], p["B'"], lbl[2], 12, 1)
        if extra: extra(F, p, P)
    W = int(40 + s*(a + b*0.37) + 50); Hh = oy + 30
    return solid(pts, E, hid, lab, W, max(Hh, 200), min(W, 300), ex, acc=set(acc_lines))
H["11-VII-24#5"] = room((8, 6, 4), ["8 m", "6 m", "4 m"], acc_lines=[("A", "C'")])
H["11-VII-22#5"] = room((8, 6, 4), ["8", "6", "4"], acc_lines=[("B", "D"), ("A'", "C'")])

def room_oxyz():
    a, b, c = 6, 5, 3
    def ex(F, p, P):
        lamp = P(a/2, b/2, c-0.5); top = P(a/2, b/2, c)
        F.line(p["A'"], p["C'"], "hid"); F.line(p["B'"], p["D'"], "hid")
        F.line(top, lamp, "thin"); F.dot(lamp, 4.5); F.text(lamp, "đèn", "start", 8, 6)
        F.text(p["A"], "O", "end", -6, 8)
        F.text(P(a+0.9, 0, 0), "x", "start"); F.text(P(0, b+1.2, 0), "y", "start"); F.text(P(0, 0, c+0.8), "z", "middle", 0, -4)
        F.line(P(a, 0, 0), P(a+0.8, 0, 0), "ax"); F.line(P(0, b, 0), P(0, b+1.1, 0), "ax"); F.line(P(0, 0, c), P(0, 0, c+0.7), "ax")
    F = room((a, b, c), ["6 m", "5 m", "3 m"], extra=ex, lab_override={}, s=26, k=0.6, ang=45)
    return F
H["12-II-7#6"] = room_oxyz()

def frustum():
    P = proj(40, 200, 46)
    a, t, h = 4, 2, 2.0
    o = (a-t)/2
    pts = {"A": P(0, 0, 0), "B": P(a, 0, 0), "C": P(a, a, 0), "D": P(0, a, 0),
           "A'": P(o, o, h), "B'": P(o+t, o, h), "C'": P(o+t, o+t, h), "D'": P(o, o+t, h)}
    E = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "D'"), ("D'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'"), ("D", "D'")]
    lab = {"A": (-10, 8), "B": (10, 8), "C": (10, 4), "D": (-10, -8), "A'": (-10, -6), "B'": (10, -6), "C'": (10, -8), "D'": (-8, -10)}
    def ex(F, p):
        F.label_mid(p["A"], p["B"], "4 m", 12, 1); F.label_mid(p["A'"], p["B'"], "2 m", 10, -1); F.label_mid(p["B"], p["B'"], "2,5 m", 18, 1)
    return solid(pts, E, {("C", "D"), ("D", "A"), ("D", "D'")}, lab, 250, 220, 230, ex)
H["11-VII-27#5"] = frustum()

def pyr_b(ab, bc, sa, depth):
    P = proj(60, 200, 40)
    pts = {"A": P(0, 0, 0), "B": P(3.2, 0, 0), "C": P(3.2, depth, 0), "S": P(0, 0, 3.4)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("A", "B"), ("B", "C"), ("C", "A")]
    lab = {"A": (-10, 8), "B": (10, 8), "C": (10, -4), "S": (0, -12)}
    def ex(F, p):
        F.right_angle(p["A"], p["S"], p["B"], 8); F.right_angle(p["B"], p["A"], p["C"], 8)
        F.label_mid(p["A"], p["B"], ab, 12, 1); F.label_mid(p["B"], p["C"], bc, 12, 1); F.label_mid(p["S"], p["A"], sa, 12, 1)
    return solid(pts, E, {("C", "A")}, lab, 260, 220, 240, ex)
H["11-VII-27#3"] = pyr_b("2", "2", "3", 3.2)
H["11-VII-23#5"] = pyr_b("3", "12", "4", 6.5)

# =====================================================================
# Đợt 2: thêm hình cho các bài hình học phẳng, vectơ, hình không gian, tọa độ, khối tròn xoay.
# Nguyên tắc như trên: chỉ vẽ dữ kiện đề cho, không vẽ yếu tố là đáp án
# (ví dụ không vẽ giao tuyến SO khi đề hỏi giao tuyến, không đánh dấu góc khi đề hỏi góc nào).
# =====================================================================

def mid2(p, q, t=0.5):
    return tuple(p[i] + (q[i]-p[i])*t for i in range(len(p)))


def centroid(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return sum(xs)/len(xs), sum(ys)/len(ys)


# ---------- hình phẳng (tọa độ toán, trục y hướng lên) ----------
def plane(P, edges=(), sides=(), angles=(), arrows=(), acc=(), hid=(), label=None, size=(230, 170), extra=None, dots=True):
    """P: tên điểm -> (x, y). edges: cặp điểm vẽ nét liền; acc/hid: nét nhấn / nét đứt;
    sides: (P, Q, nhãn); angles: (đỉnh, P, Q, nhãn); arrows: (P, Q) vectơ nhấn."""
    xs = [v[0] for v in P.values()]; ys = [v[1] for v in P.values()]
    w = (max(xs)-min(xs)) or 1; h = (max(ys)-min(ys)) or 1
    s = min(size[0]/w, size[1]/h)
    S = {k: (v[0]*s, -v[1]*s) for k, v in P.items()}
    F = Fig(300, 240, 300); c = centroid(list(S.values()))
    for a, b in edges: F.line(S[a], S[b], "ln")
    for a, b in hid: F.line(S[a], S[b], "hid")
    for a, b in acc: F.line(S[a], S[b], "acc")
    for a, b in arrows: F.arrow(S[a], S[b], "acc")
    for v, a, b, lb in angles:
        t = abs(math.atan2(*unit(S[v], S[a])[::-1]) - math.atan2(*unit(S[v], S[b])[::-1])) % (2*math.pi)
        t = min(t, 2*math.pi - t); F.arc(S[v], S[a], S[b], 20, lb, 34 if t > math.radians(50) else 50)
    for a, b, lb in sides: F.side(S[a], S[b], lb, c)
    names = P.keys() if label is None else label
    for k in names:
        if dots: F.dot(S[k], 2.6)
        F.vlab(S[k], k, c)
    if extra: extra(F, S, c, s)
    return F


def tri_pts(b, c, A_deg):
    """Tam giác có AB = c nằm ngang, AC = b, góc A."""
    t = math.radians(A_deg)
    return {"A": (0, 0), "B": (c, 0), "C": (b*math.cos(t), b*math.sin(t))}


T = ("A", "B"), ("B", "C"), ("C", "A")
H["10-III-6#d"] = plane(tri_pts(5, 3, 60), edges=T[:2] + (("C", "A"),), sides=[("A", "B", "3"), ("A", "C", "5"), ("B", "C", "?")], angles=[("A", "B", "C", "60°")])
H["10-III-6#9"] = plane(tri_pts(5, 8, 60), edges=T, sides=[("A", "B", "8"), ("A", "C", "5"), ("B", "C", "?")], angles=[("A", "B", "C", "60°")])
H["10-III-6#1"] = plane(tri_pts(6, 4, 30), edges=T, sides=[("A", "B", "4"), ("A", "C", "6")], angles=[("A", "B", "C", "30°")])
H["10-III-6#10"] = plane(tri_pts(10, 6, 120), edges=T, sides=[("A", "B", "6"), ("A", "C", "10")], angles=[("A", "B", "C", "120°")])
_cx = (49+9-25)/14
H["10-III-6#0"] = plane({"A": (0, 0), "B": (7, 0), "C": (_cx, math.sqrt(9-_cx*_cx))}, edges=T,
                        sides=[("A", "B", "c = 7"), ("C", "A", "b = 3"), ("B", "C", "a = 5")], angles=[("C", "A", "B", "?")])


def island():
    AC = 500*math.sin(math.radians(60))/math.sin(math.radians(50))
    P = {"A": (0, 0), "B": (500, 0), "C": (AC*math.cos(math.radians(70)), AC*math.sin(math.radians(70)))}
    def ex(F, S, c, s):
        F.text((S["A"][0]-30, S["A"][1]+8), "bờ biển", "end", cls="mut")
        F.line((S["A"][0]-40, S["A"][1]), (S["B"][0]+40, S["B"][1]), "ax")
        F.text(S["C"], "đảo", "start", 12, -2, cls="mut")
    return plane(P, edges=[("A", "B"), ("B", "C")], hid=[("A", "C")], sides=[("A", "B", "500 m"), ("A", "C", "?")],
                 angles=[("A", "B", "C", "70°"), ("B", "C", "A", "60°")], extra=ex)
H["10-III-6#5"] = island()


def two_ships():
    t = math.radians(70)
    P = {"O": (0, 0), "A": (60, 0), "B": (40*math.cos(t), 40*math.sin(t))}
    def ex(F, S, c, s):
        F.text(S["O"], "cảng", "end", -12, 10, cls="mut")
    return plane(P, arrows=[("O", "A"), ("O", "B")], hid=[("A", "B")], label=["O"],
                 sides=[("O", "A", "30 km/h"), ("O", "B", "20 km/h"), ("A", "B", "?")], angles=[("O", "A", "B", "70°")], extra=ex)
H["10-III-6#11"] = two_ships()

PAR = {"A": (0, 0), "B": (4, 0), "C": (5.2, 2.4), "D": (1.2, 2.4)}
SQ4 = ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")
H["10-IV-7#d"] = plane(PAR, edges=SQ4)
H["10-IV-7#3"] = plane({"A": (0, 0), "B": (4, 0), "C": (4, 4), "D": (0, 4)}, edges=SQ4, arrows=[("A", "C")], sides=[("A", "B", "4")], size=(150, 150))
H["10-IV-7#4"] = plane({"A": (0, 0), "B": (3, 0), "C": (3, 4), "D": (0, 4)}, edges=SQ4, arrows=[("B", "D")], sides=[("A", "B", "3"), ("B", "C", "4")], size=(150, 170))
_hx = {n: (math.cos(math.radians(180+60*i)), math.sin(math.radians(180+60*i))) for i, n in enumerate("ABCDEF")}
_hx["O"] = (0, 0)
H["10-IV-7#5"] = plane(_hx, edges=[("A", "B"), ("B", "C"), ("C", "D"), ("D", "E"), ("E", "F"), ("F", "A")], arrows=[("O", "A")], size=(190, 160))
_tm = {"A": (1.4, 3), "B": (0, 0), "C": (4.4, 0)}; _tm["M"] = mid2(_tm["B"], _tm["C"])
H["10-IV-8#d"] = plane(_tm, edges=[("B", "C")], arrows=[("A", "B"), ("A", "C")], size=(220, 150))
H["10-IV-8#2"] = plane({"A": (0, 0), "B": (2, 0), "C": (2, 2), "D": (0, 2)}, edges=[("B", "C"), ("C", "D")], arrows=[("A", "B"), ("A", "D")], sides=[("A", "B", "2")], size=(150, 150))


def eq_vec(a):
    P = {"A": (a/2, a*math.sqrt(3)/2), "B": (0, 0), "C": (a, 0)}
    return plane(P, edges=[("B", "C")], arrows=[("A", "B"), ("A", "C")], sides=[("B", "C", str(a))], size=(170, 150))
H["10-IV-8#3"] = eq_vec(3); H["10-IV-8#4"] = eq_vec(3); H["10-IV-11#3"] = eq_vec(2)


def two_cables():
    P = {"O": (0, 0), "A": (-math.sin(math.radians(30))*3, math.cos(math.radians(30))*3), "B": (math.sin(math.radians(30))*3, math.cos(math.radians(30))*3)}
    def ex(F, S, c, s):
        o = S["O"]; F.poly([(o[0]-12, o[1]), (o[0]+12, o[1]), (o[0]+12, o[1]+20), (o[0]-12, o[1]+20)], "ln"); F.text((o[0], o[1]+10), "vật", cls="mut")
        F.side(S["O"], S["A"], "320 N", (o[0]+40, o[1])); F.side(S["O"], S["B"], "320 N", (o[0]-40, o[1]))
    return plane(P, arrows=[("O", "A"), ("O", "B")], angles=[("O", "A", "B", "60°")], label=[], dots=False, extra=ex, size=(160, 150))
H["10-IV-8#5"] = two_cables()

_bm = {"A": (1.2, 3), "B": (0, 0), "C": (4.5, 0)}; _bm["M"] = mid2(_bm["B"], _bm["C"], 2/3)
H["10-IV-9#5"] = plane(_bm, edges=[("A", "B"), ("B", "C"), ("C", "A")], arrows=[("A", "M")],
                       extra=lambda F, S, c, s: F.text(((S["B"][0]+S["C"][0])/2, S["B"][1]+28), "BM = 2MC", cls="mut"), size=(220, 150))


def box_pull():
    F = Fig(320, 160, 320); g = 120
    F.line((10, g), (310, g), "ax")
    F.poly([(40, g), (90, g), (90, g-40), (40, g-40)], "ln"); F.text((65, g-20), "thùng", cls="mut")
    o = (90, g-20); t = math.radians(30); q = (o[0]+90*math.cos(t), o[1]-90*math.sin(t))
    F.arrow(o, q, "acc"); F.line(o, (o[0]+100, o[1]), "hid"); F.arc(o, (o[0]+60, o[1]), q, 34, "30°", 50)
    F.text(q, "F = 50 N", "start", 8, -4)
    F.arrow((40, g+22), (260, g+22), "ln"); F.text((150, g+36), "dịch chuyển 20 m")
    return F
H["10-IV-11#5"] = box_pull()


def boats():
    F = Fig(320, 190, 300); base = 140
    for i, (n, d, v) in enumerate([("A", -1, 20), ("B", 1, 20), ("C", -1, 20), ("D", -1, 30)]):
        x = 50 + i*68; y0 = base - 45 if d > 0 else base; L = v*2.6
        F.dot((x, y0), 4); F.arrow((x, y0), (x, y0 + d*L), "acc")
        F.text((x, y0), n, "end", -8, 0); F.text((x, base + 22), f"{v} km/h", cls="mut")
    F.arrow((300, 120), (300, 70), "ln"); F.text((300, 58), "Bắc")
    return F
H["10-IV-7#6"] = boats()


def grid_plot(x0, x1, y0, y1, W=260, H_=220, step=1):
    F = Fig(W, H_, W); M = plot_map(x0, x1, y0, y1, W, H_, 22)
    x = math.ceil(x0/step)*step
    while x <= x1:
        if x != 0: F.line(M(x, y0), M(x, y1), "grid")
        x += step
    y = math.ceil(y0/step)*step
    while y <= y1:
        if y != 0: F.line(M(x0, y), M(x1, y), "grid")
        y += step
    axes(F, M, x0, x1, y0, y1)
    return F, M


def peri_grid():
    F, M = grid_plot(-0.6, 5.4, -0.6, 5.8)
    A, B, C = M(1, 1), M(4, 1), M(1, 5); F.poly([A, B, C], "acc")
    for p, n in [(A, "A(1; 1)"), (B, "B(4; 1)"), (C, "C(1; 5)")]: F.dot(p)
    F.text(A, "A(1; 1)", "end", -6, 10); F.text(B, "B(4; 1)", "start", 6, 10); F.text(C, "C(1; 5)", "start", 8, 0)
    return F
H["10-IV-10#3"] = peri_grid()


def ship_island():
    F, M = grid_plot(-2, 33, -2, 13, 320, 200, 5)
    O, Mp, I = M(0, 0), M(24, 10), M(30, 4)
    F.line(O, M(30, 12.5), "hid"); F.arrow(O, M(12, 5), "acc"); F.text(M(6, 2.5), "v", "start", 4, -12)
    F.dot(Mp); F.text(Mp, "vị trí sau 2 giờ", "end", -8, -8); F.dot(I, 4); F.text(I, "đảo I(30; 4)", "end", -4, 14)
    F.line(Mp, I, "hid"); F.label_mid(Mp, I, "?", 10, -1)
    return F
H["10-IV-10#6"] = ship_island()


def work_grid():
    F, M = grid_plot(-0.6, 5.8, -0.6, 4.6, 260, 200)
    F.arrow(M(0, 0), M(3, 4), "acc"); F.text(M(3, 4), "F = (3; 4)", "start", 6, 0)
    F.arrow(M(0, 0), M(5, 0), "ln"); F.text(M(5, 0), "d = (5; 0)", "middle", 0, 14)
    return F
H["10-IV-11#d"] = work_grid()


def ferris135():
    F = Fig(280, 260, 280); M = plot_map(-62, 62, -4, 112, 280, 260, 14)
    F.line(M(-62, 0), M(62, 0), "ax"); F.text(M(60, 0), "mặt đất", "end", 0, 12, cls="mut")
    O = M(0, 55); r = M(50, 0)[0]-M(0, 0)[0]; F.circle(O, r, "ln"); F.dot(O)
    F.text(O, "O", "start", 6, 12)
    t = math.radians(135); Mm = M(50*math.cos(t), 55+50*math.sin(t)); F.dot(Mm, 4.5); F.text(Mm, "M", "end", -8, -6)
    F.line(O, Mm, "acc"); F.label_mid(O, Mm, "50 m", 12, 1)
    F.line(O, M(0, 0), "hid"); F.text(M(0, 27), "55 m", "start", 6)
    F.line(O, M(40, 55), "thin"); F.arc(O, M(40, 55), Mm, 16, "135°", 30)
    F.line(Mm, M(50*math.cos(t), 0), "hid"); F.text(M(50*math.cos(t), 45), "?", "end", -6)
    return F
H["10-III-5#6"] = ferris135()


def coverage():
    F, M = grid_plot(-4.5, 8.5, -5, 7.5, 260, 250, 1)
    I = M(2, 1); r = M(5, 0)[0]-M(0, 0)[0]; F.circle(I, r, "ln"); F.dot(I); F.text(I, "I(2; 1)", "start", 6, 10)
    F.line(M(-4.5, -0.5), M(3.5, 7.5), "acc"); F.text(M(3.5, 7.5), "x − y + 4 = 0", "start", 4, 4)
    d = abs(2-1+4)/math.sqrt(2); h = math.sqrt(25-d*d)
    # chân đường vuông góc từ I tới đường thẳng: H = I - d*n, n = (1, -1)/√2
    Hx, Hy = 2 - 5/2, 1 + 5/2
    P1, P2 = M(Hx - h/math.sqrt(2), Hy - h/math.sqrt(2)), M(Hx + h/math.sqrt(2), Hy + h/math.sqrt(2))
    F.dot(P1); F.dot(P2); F.label_mid(P1, P2, "?", 12, 1)
    F.text(M(6.4, -3.8), "R = 5", cls="mut")
    return F
H["10-VII-21#5"] = coverage()


def ellipse_axes():
    F = Fig(300, 200, 280); M = plot_map(-6.2, 6.2, -4.4, 4.4, 300, 200, 18)
    pts = [M(5*math.cos(2*math.pi*i/90), 3*math.sin(2*math.pi*i/90)) for i in range(91)]; F.poly(pts, "ln", close=False)
    F.line(M(-5, 0), M(5, 0), "thin"); F.line(M(0, -3), M(0, 3), "hid")
    for x in (-4, 4): F.dot(M(x, 0), 3.4)
    F.text(M(-4, 0), "F₁", "middle", 0, -12); F.text(M(4, 0), "F₂", "middle", 0, -12)
    F.text(M(0, 0), "trục lớn 10", "middle", 0, 14); F.text(M(0, 1.6), "trục nhỏ ?", "start", 6)
    F.line(M(-4, -3.8), M(4, -3.8), "acc"); F.text(M(0, -3.8), "tiêu cự 6", "middle", 0, 13)
    return F
H["10-VII-22#3"] = ellipse_axes()


# ---------- hình không gian ----------
def solid3(pts3, edges, hidden=(), acc=(), acch=(), label=None, extra=None, shade=None, k=0.5, ang=35, s=40, fw=260):
    """pts3: tên -> (x, y, z); x sang phải, y vào sâu, z lên trên. Nhãn đỉnh tự đặt ra phía ngoài."""
    P = proj(0, 0, s, k, ang)
    pts = {n: P(*v) for n, v in pts3.items()}
    F = Fig(300, 240, fw); c = centroid(list(pts.values()))
    H_ = {frozenset(e) for e in hidden}; A_ = {frozenset(e) for e in acc}; AH = {frozenset(e) for e in acch}
    if shade:
        for poly in (shade if isinstance(shade[0], (list, tuple)) else [shade]): F.poly([pts[n] for n in poly], "sh")
    for a, b in edges:
        e = frozenset((a, b)); cls = "acch" if e in AH else ("acc" if e in A_ else ("hid" if e in H_ else "ln"))
        F.line(pts[a], pts[b], cls)
    for a, b in acc:
        if (a, b) not in edges and (b, a) not in edges: F.line(pts[a], pts[b], "acc")
    for a, b in acch:
        if (a, b) not in edges and (b, a) not in edges: F.line(pts[a], pts[b], "acch")
    for n in (pts3.keys() if label is None else label):
        F.dot(pts[n], 2.4); F.vlab(pts[n], n, c, 11)
    if extra: extra(F, pts, c, P)
    return F


def on(p, q, t):
    return mid2(p, q, t)


# hình chóp S.ABCD đáy hình bình hành (D ở phía sau bên trái)
def pyr_par(add=None, edges_add=(), hid_add=(), acc=(), acch=(), shade=None, extra=None):
    P = {"A": (0, 0, 0), "B": (4, 0, 0), "C": (5.4, 3, 0), "D": (1.4, 3, 0), "S": (2.2, 1.2, 3.6)}
    if add: add(P)
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")] + list(edges_add)
    hid = [("S", "D"), ("C", "D"), ("D", "A")] + list(hid_add)
    return solid3(P, E, hid, acc, acch, extra=extra, shade=shade)


def _o(P): P["O"] = on(P["A"], P["C"], 0.5)
H["11-IV-11#0"] = pyr_par()
H["11-IV-10#1"] = pyr_par(add=_o, edges_add=[("A", "C"), ("B", "D")], hid_add=[("A", "C"), ("B", "D")])


def _ami(P):
    _o(P); P["M"] = on(P["S"], P["C"], 0.5); P["I"] = tuple((P["S"][i]+P["A"][i]+P["C"][i])/3 for i in range(3))
H["11-IV-10#5"] = pyr_par(add=_ami, edges_add=[("A", "C"), ("B", "D"), ("S", "O")], hid_add=[("A", "C"), ("B", "D"), ("S", "O")], acch=[("A", "M")])


def _mn(P): P["M"] = on(P["S"], P["A"], 0.5); P["N"] = on(P["S"], P["D"], 0.5)
H["11-IV-12#2"] = pyr_par(add=_mn, edges_add=[("M", "B"), ("M", "N"), ("N", "C")], hid_add=[("M", "N"), ("N", "C")], acc=[("M", "B")], shade=["M", "B", "C", "N"])
H["11-IV-12#4"] = pyr_par(add=_mn, edges_add=[("M", "B"), ("M", "N"), ("N", "C")], hid_add=[("M", "N"), ("N", "C")], acc=[("M", "B")], shade=["M", "B", "C", "N"],
                          extra=lambda F, p, c, P: F.side(p["A"], p["D"], "8", c))


# tứ diện: đỉnh trên và ba đỉnh đáy (trái, trước, phải-sau); cạnh đáy trái–phải-sau khuất
def tetra(names="ABCD", add=None, edges_add=(), hid_add=(), acc=(), acch=(), shade=None, extra=None, label=None):
    t, l, fr, r = names
    P = {t: (2.0, 1.3, 3.4), l: (-0.4, 2.4, 0), fr: (2.0, 0, 0), r: (4.6, 1.8, 0)}
    if add: add(P)
    E = [(t, l), (t, fr), (t, r), (l, fr), (fr, r), (l, r)] + list(edges_add)
    return solid3(P, E, [(l, r)] + list(hid_add), acc, acch, extra=extra, shade=shade, label=label, k=0.7)


H["11-IV-10#2"] = tetra()
H["11-IV-11#1"] = tetra(acc=[("A", "B"), ("C", "D")])
H["11-VII-22#3"] = tetra(acc=[("A", "B"), ("C", "D")])


def _mn_t(P): P["M"] = on(P["A"], P["B"], 0.5); P["N"] = on(P["A"], P["C"], 0.5)
H["11-IV-11#2"] = tetra(add=_mn_t, acc=[("M", "N")])
H["11-IV-11#3"] = tetra(add=_mn_t, acc=[("M", "N")], extra=lambda F, p, c, P: (F.side(p["B"], p["C"], "6", c), F.label_mid(p["M"], p["N"], "?", 10, 1)))


def _mnpq(P):
    P["M"] = on(P["A"], P["B"], .5); P["N"] = on(P["B"], P["C"], .5); P["P"] = on(P["C"], P["D"], .5); P["Q"] = on(P["D"], P["A"], .5)
H["11-IV-11#5"] = tetra(add=_mnpq, edges_add=[("M", "N"), ("N", "P"), ("P", "Q"), ("Q", "M")], acc=[("M", "N"), ("N", "P"), ("P", "Q"), ("Q", "M")],
                        shade=["M", "N", "P", "Q"], extra=lambda F, p, c, P: F.text((c[0], max(v[1] for v in p.values()) + 26), "AC = 6, BD = 8", fixed=True))


def _sec(t):
    def add(P):
        P["M"] = on(P["S"], P["A"], t); P["N"] = on(P["S"], P["B"], t); P["P"] = on(P["S"], P["C"], t)
    return add
H["11-IV-12#3"] = tetra("SABC", add=_sec(2/3), edges_add=[("M", "N"), ("N", "P"), ("P", "M")], hid_add=[("P", "M")], acc=[("M", "N"), ("N", "P")], shade=["M", "N", "P"],
                        label=["S", "A", "B", "C", "M", "N"])
H["11-IV-13#5"] = tetra("SABC", add=_sec(2/3), edges_add=[("M", "N"), ("N", "P"), ("P", "M")], hid_add=[("P", "M")], acc=[("M", "N"), ("N", "P")], shade=["M", "N", "P"],
                        extra=lambda F, p, c, P: (F.side(p["S"], p["M"], "6", c), F.side(p["M"], p["A"], "3", c)))


def _glass(P):
    P["M"] = on(P["A"], P["B"], 1/3); P["N"] = on(P["B"], P["C"], 2/3); P["P"] = on(P["D"], P["C"], 2/3); P["Q"] = on(P["A"], P["D"], 1/3)
H["11-IV-12#5"] = tetra(add=_glass, edges_add=[("M", "N"), ("N", "P"), ("P", "Q"), ("Q", "M")], acc=[("M", "N"), ("N", "P"), ("P", "Q"), ("Q", "M")], shade=["M", "N", "P", "Q"],
                        extra=lambda F, p, c, P: F.text((c[0], max(v[1] for v in p.values()) + 26), "AC = 90 cm, BD = 60 cm", fixed=True))


def planes3():
    F = Fig(320, 250, 300)
    rows = [40, 120, 200]; d1 = [(70, 10), (120, 235)]; d2 = [(250, 12), (215, 238)]
    def at(line, y):
        (x0, y0), (x1, y1) = line; return (x0 + (x1-x0)*(y-y0)/(y1-y0), y)
    for i, y in enumerate(rows):
        F.poly([(30, y+14), (230, y+14), (290, y-14), (90, y-14)], "sh"); F.poly([(30, y+14), (230, y+14), (290, y-14), (90, y-14)], "thin")
        F.text((300, y), ["(P)", "(Q)", "(R)"][i], "start", cls="mut")
    F.line(*d1, "acc"); F.line(*d2, "acc"); F.text(d1[0], "d₁", "end", -6, 4); F.text(d2[0], "d₂", "start", 6, 4)
    A, B, C = (at(d1, y) for y in rows); A2, B2, C2 = (at(d2, y) for y in rows)
    for p, n in [(A, "A"), (B, "B"), (C, "C")]: F.dot(p); F.text(p, n, "end", -8, -6)
    for p, n in [(A2, "A'"), (B2, "B'"), (C2, "C'")]: F.dot(p); F.text(p, n, "start", 8, -6)
    F.text(((A[0]+B[0])/2, 80), "2", "end", -14); F.text(((B[0]+C[0])/2, 160), "3", "end", -16)
    F.text(((A2[0]+B2[0])/2, 80), "4", "start", 12); F.text(((B2[0]+C2[0])/2, 160), "?", "start", 12)
    return F
H["11-IV-13#4"] = planes3()


# hộp và lập phương ABCD.A'B'C'D'
def box(dims=(1, 1, 1), slant=(0, 0), add=None, edges_add=(), hid_add=(), acc=(), acch=(), shade=None, extra=None, label=None, s=None):
    a, b, c = dims; ox, oy = slant
    base = {"A": (0, 0), "B": (a, 0), "C": (a, b), "D": (0, b)}
    P = {k: (x, y, 0) for k, (x, y) in base.items()}; P.update({k + "'": (x+ox, y+oy, c) for k, (x, y) in base.items()})
    if add: add(P)
    E = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "D'"), ("D'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'"), ("D", "D'")] + list(edges_add)
    hid = [("C", "D"), ("D", "A"), ("D", "D'")] + list(hid_add)
    sc = s or 200/max(a + b*0.4, c + b*0.3)
    return solid3(P, E, hid, acc, acch, extra=extra, shade=shade, label=label, s=sc)


def cube2(a_lb=None, **kw):
    ex0 = kw.pop("extra", None)
    def ex(F, p, c, P):
        if a_lb: F.side(p["A"], p["B"], a_lb, c)
        if ex0: ex0(F, p, c, P)
    return box((1, 1, 1), extra=ex, **kw)


H["11-VII-22#0"] = cube2(acc=[("A", "B"), ("B'", "C'")])
H["11-VII-22#1"] = cube2(edges_add=[("A", "C")], acch=[("A", "C")], acc=[("A'", "D'")])
H["11-VII-22#2"] = cube2()
H["11-VII-22#4"] = cube2(edges_add=[("A'", "C'"), ("B", "C'")], acc=[("A'", "C'"), ("B", "C'")])
H["11-VII-23#4"] = cube2("2", edges_add=[("A", "C'")], acch=[("A", "C'")])
H["11-VII-24#3"] = cube2(edges_add=[("A", "C"), ("A", "C'")], hid_add=[("A", "C")], acch=[("A", "C'")])
H["11-VII-26#2"] = cube2("2")
H["11-VII-26#4"] = cube2("3", edges_add=[("B", "D"), ("B'", "D'")], hid_add=[("B", "D")], shade=["B", "D", "D'", "B'"])
H["12-II-6#3"] = cube2("2", edges_add=[("A", "C'")], acc=[("A", "B")], acch=[("A", "C'")])
H["12-II-6#4"] = cube2("1", edges_add=[("A", "C'")], acch=[("A", "C'")])
H["12-II-6#1"] = H["12-II-6#4"]
SL = (0.5, 0.25)
H["11-IV-13#2"] = box((1.6, 1, 1.1), slant=SL)
H["I-12#1"] = box((1.6, 1, 1.1), slant=SL)
H["12-II-6#d"] = box((1.6, 1, 1.1), slant=SL, acc=[("A", "B"), ("A", "A'")], acch=[("A", "D")])
H["12-II-6#2"] = box((1.6, 1, 1.1), slant=SL)
H["11-VII-27#2"] = box((4, 3, 2), extra=lambda F, p, c, P: (F.side(p["A"], p["B"], "4", c), F.side(p["B"], p["C"], "3", c), F.side(p["B"], p["B'"], "2", c)), label=[], s=36)


def open_box():
    def ex(F, p, c, P):
        F.side(p["A"], p["B"], "x", c); F.side(p["B"], p["C"], "x", c); F.side(p["B"], p["B'"], "h", c)
        F.text(centroid([p["A'"], p["B'"], p["C'"], p["D'"]]), "không nắp", cls="mut")
    return box((3, 3, 1.6), extra=ex, label=[])
H["III-3#1"] = open_box()


# hình chóp S.ABCD đáy hình vuông, SA ⊥ đáy (S ngay trên A)
def pyr_sq(a_lb=None, sa_lb=None, acc=(), acch=(), edges_add=(), hid_add=(), extra=None):
    P = {"A": (0, 0, 0), "B": (3, 0, 0), "C": (3, 3, 0), "D": (0, 3, 0), "S": (0, 0, 3.4)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")] + list(edges_add)
    def ex(F, p, c, P_):
        F.right_angle(p["A"], p["S"], p["B"], 8)
        if a_lb: F.side(p["A"], p["B"], a_lb, c)
        if sa_lb: F.side(p["S"], p["A"], sa_lb, c)
        if extra: extra(F, p, c, P_)
    return solid3(P, E, [("A", "D"), ("D", "C"), ("S", "D")] + list(hid_add), acc, acch, extra=ex, s=42)


H["11-VII-23#0"] = pyr_sq(acc=[("B", "C")])
H["11-VII-23#2"] = pyr_sq(edges_add=[("A", "C"), ("B", "D")], hid_add=[("A", "C"), ("B", "D")])
H["I-12#0"] = pyr_sq(edges_add=[("A", "C"), ("B", "D")], hid_add=[("A", "C"), ("B", "D")])
H["11-VII-24#d"] = pyr_sq(edges_add=[("A", "C")], hid_add=[("A", "C")], acc=[("S", "C")])
H["11-VII-24#1"] = pyr_sq("a", "a√2", edges_add=[("A", "C")], hid_add=[("A", "C")], acc=[("S", "C")])
H["11-VII-25#2"] = pyr_sq("2", "2")
H["I-12#6"] = pyr_sq("a", edges_add=[("A", "C")], hid_add=[("A", "C")], acc=[("S", "C")],
                     extra=lambda F, p, c, P: F.arc(p["C"], p["S"], p["A"], 22, "60°", 38))


# hình chóp S.ABC, SA ⊥ (ABC)
def pyr_t(sa_lb=None, ab_lb=None, right_B=False, acc=()):
    C = (3.8, 2.9, 0) if right_B else (4.2, 1.8, 0)
    P = {"A": (0, 1.2, 0), "B": (2.2, 0, 0), "C": C, "S": (0, 1.2, 3.3)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("A", "B"), ("B", "C"), ("A", "C")]
    def ex(F, p, c, P_):
        F.right_angle(p["A"], p["S"], p["B"], 8)
        if right_B: F.right_angle(p["B"], p["A"], p["C"], 8)
        if sa_lb: F.side(p["S"], p["A"], sa_lb, c)
        if ab_lb: F.side(p["A"], p["B"], ab_lb, c)
    return solid3(P, E, [("A", "C")], acc, extra=ex, s=44)


H["11-VII-24#2"] = pyr_t("2", "2", acc=[("S", "B")])
H["11-VII-24#4"] = pyr_t("1", "√3", acc=[("S", "B")])
H["11-VII-26#1"] = pyr_t(right_B=True)


# hình chóp tứ giác đều
def pyr_regular(base_lb=None, h_lb=None):
    a = 3.6; c = a/2
    P = {"A": (0, 0, 0), "B": (a, 0, 0), "C": (a, a, 0), "D": (0, a, 0), "S": (c, c, 3.4), "O": (c, c, 0)}
    E = [("S", "A"), ("S", "B"), ("S", "C"), ("S", "D"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A", "C"), ("B", "D"), ("S", "O")]
    hid = [("C", "D"), ("D", "A"), ("S", "D"), ("A", "C"), ("B", "D"), ("S", "O")]
    def ex(F, p, c_, P_):
        if base_lb: F.side(p["A"], p["B"], base_lb, c_)
        if h_lb: F.text(on(p["S"], p["O"], .5), h_lb, "start", 6)
    return solid3(P, E, hid, extra=ex, s=40)


H["III-1#3"] = pyr_regular("230 m", "146 m")
H["III-1#7"] = pyr_regular("3", "4")
H["11-VII-27#1"] = pyr_regular("2", "3")
H["I-12#7"] = pyr_regular("?", "2 m")


# lăng trụ tam giác
def prism_tri(base_lb=None, side_lb=None, acc=(), acch=(), edges_add=()):
    P = {"A": (0, 1.8, 0), "B": (2.0, 0, 0), "C": (3.8, 2.8, 0)}
    P.update({k + "'": (x, y, 3.0) for k, (x, y, z) in list(P.items())})
    E = [("A", "B"), ("B", "C"), ("C", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'")] + list(edges_add)
    def ex(F, p, c, P_):
        if base_lb: F.side(p["A"], p["B"], base_lb, c)
        if side_lb: F.side(p["C"], p["C'"], side_lb, c)
    return solid3(P, E, [("A", "C")], acc, acch, extra=ex, s=42)


H["11-VII-25#4"] = prism_tri("2", "3")
H["I-12#2"] = prism_tri(edges_add=[("B", "C'")], acc=[("A", "B"), ("B", "C'")])


def frustum2():
    a, t, h = 4, 2, 2.4; o = (a-t)/2
    P = {"A": (0, 0, 0), "B": (a, 0, 0), "C": (a, a, 0), "D": (0, a, 0),
         "A'": (o, o, h), "B'": (o+t, o, h), "C'": (o+t, o+t, h), "D'": (o, o+t, h), "O": (a/2, a/2, 0), "O'": (a/2, a/2, h)}
    E = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A'", "B'"), ("B'", "C'"), ("C'", "D'"), ("D'", "A'"), ("A", "A'"), ("B", "B'"), ("C", "C'"), ("D", "D'"), ("O", "O'")]
    def ex(F, p, c, P_):
        F.text(on(p["O"], p["O'"], .5), "h = 3", "start", 6)
        F.text(p["A"], "S đáy lớn = 16", "start", 0, 22, cls="mut"); F.text(p["D'"], "S đáy nhỏ = 4", "end", -10, -12, cls="mut")
    return solid3(P, E, [("C", "D"), ("D", "A"), ("D", "D'"), ("O", "O'")], extra=ex, label=[], s=40)
H["11-VII-27#4"] = frustum2()


def chandelier():
    F = Fig(280, 250, 260)
    S = (140, 26); F.line((90, 14), (190, 14), "thick"); F.line((140, 14), S, "ln"); F.dot(S)
    cy = 170; rx, ry = 70, 18
    pts = [(140 + rx*math.cos(2*math.pi*i/60), cy + ry*math.sin(2*math.pi*i/60)) for i in range(61)]; F.poly(pts, "ln", close=False)
    A, B, C = (140 + rx*math.cos(math.radians(160)), cy + ry*math.sin(math.radians(160))), (140 + rx*math.cos(math.radians(20)), cy + ry*math.sin(math.radians(20))), (140 + rx*math.cos(math.radians(270)), cy + ry*math.sin(math.radians(270)))
    for P_ in (A, B): F.line(S, P_, "acc")
    F.line(S, C, "hid"); O = (140, cy); F.line(S, O, "hid"); F.dot(O)
    F.arc(S, O, B, 34, "30°", 50)
    F.arrow(O, (140, cy + 60), "ln"); F.text((140, cy + 72), "P = 60 N")
    F.text(on(S, A, .55), "xích", "end", -8, cls="mut")
    return F
H["12-II-6#5"] = chandelier()


def axes3_tetra():
    # quy ước SGK: Ox hướng về phía người xem (chéo xuống trái), Oy sang phải, Oz lên trên
    s = 40; P = lambda x, y, z: (120 + s*(y - 0.55*x*math.cos(math.radians(40))), 150 - s*(z - 0.55*x*math.sin(math.radians(40))))
    F = Fig(300, 260, 260); O = P(0, 0, 0)
    for end, lb in [(P(3.4, 0, 0), "x"), (P(0, 3.8, 0), "y"), (P(0, 0, 3.2), "z")]:
        F.arrow(O, end, "ln", 7); F.text(end, lb, "middle", 0, -10 if lb == "z" else 12)
    A, B, C = P(2.6, 0, 0), P(0, 2.9, 0), P(0, 0, 2.6)
    F.poly([A, B, C], "sh"); F.poly([A, B, C], "acc")
    for p_, n in [(A, "A"), (B, "B"), (C, "C")]: F.dot(p_); F.vlab(p_, n, centroid([A, B, C, O]), 12)
    F.text(O, "O", "end", -6, 10)
    return F
H["12-V-14#4"] = axes3_tetra()


def solar_panel():
    s = 42; P = proj(0, 0, s, 0.55, 30)
    F = Fig(300, 230, 280)
    g = [P(-0.6, -0.4, 0), P(5, -0.4, 0), P(5, 4, 0), P(-0.6, 4, 0)]
    F.poly(g, "thin"); F.text(g[1], "mặt đất (Oxy)", "start", 4, 8, cls="mut")
    t = math.radians(48); L = 2.6
    q = [P(0.5, 0.6, 0), P(4, 0.6, 0), P(4, 0.6 + L*math.cos(t), L*math.sin(t)), P(0.5, 0.6 + L*math.cos(t), L*math.sin(t))]
    F.poly(q, "sh"); F.poly(q, "acc")
    foot = P(4, 0.6 + L*math.cos(t), 0); F.line(q[2], foot, "hid"); F.line(q[1], foot, "hid")
    F.arc(q[1], foot, q[2], 22, "?", 36)
    F.text(centroid(q), "tấm pin", cls="mut")
    return F
H["12-V-16#5"] = solar_panel()


# ---------- tích phân: miền phẳng và khối tròn xoay ----------
def revolve(fn, a, b, lbl, ymax, W=300):
    F = Fig(W, 230, 290); M = plot_map(-0.6, b + 0.9, -ymax*1.25, ymax*1.25, W, 230, 20)
    F.poly(curve(M, fn, a, b) + [M(b, 0), M(a, 0)], "sh")
    axes(F, M, -0.6, b + 0.9, -ymax*1.25, ymax*1.25)
    F.poly(curve(M, fn, a, b), "ln", close=False); F.poly(curve(M, lambda x: -fn(x), a, b), "hid", close=False)
    for x in ([a, b] if fn(a) > 1e-9 else [b]):
        cx, cy = M(x, 0); ry = M(0, 0)[1] - M(0, fn(x))[1]; rx = max(6, ry*0.28)
        pts = [(cx + rx*math.cos(2*math.pi*i/48), cy + ry*math.sin(2*math.pi*i/48)) for i in range(49)]; F.poly(pts, "thin", close=False)
    F.line(M(b, 0), M(b, fn(b)), "ln"); F.text(M(b, 0), f(b), "start", 4, 12)
    F.text(M((a+b)/2, fn((a+b)/2)), lbl, "end", -6, -10)
    return F


H["III-2#0"] = revolve(math.sqrt, 0, 4, "y = √x", 2)
H["I-2#2"] = revolve(math.sqrt, 0, 4, "y = √x", 2)
H["III-2#5"] = revolve(math.sqrt, 0, 9, "y = √x", 3)
H["III-2#3"] = revolve(lambda x: math.sqrt(x + 1), 0, 3, "y = √(x + 1)", 2)


def area_fn(fn, a, b, x0, x1, y0, y1, lbl, lpos):
    F = Fig(260, 240, 250); M = plot_map(x0, x1, y0, y1, 260, 240, 22)
    F.poly([M(a, 0)] + curve(M, fn, a, b) + [M(b, 0)], "sh"); axes(F, M, x0, x1, y0, y1)
    xs = [x0 + 0.2 + (x1 - x0 - 0.5)*i/200 for i in range(201)]
    F.poly([M(x, fn(x)) for x in xs if y0 <= fn(x) <= y1], "ln", close=False)
    F.line(M(b, 0), M(b, fn(b)), "hid"); F.text(M(b, 0), f(b), "middle", 8, 12)
    F.text(M(*lpos), lbl, "start", 4)
    return F


H["I-2#1"] = area_fn(lambda x: x*x - 4, 0, 3, -1, 3.8, -4.8, 5.6, "y = x² − 4", (3.1, 5.2))
H["I-2#4"] = area_fn(lambda x: x**3, 0, 2, -1, 2.8, -1.4, 9, "y = x³", (2.08, 8.6))


CSS_NOTE = "// Hình minh họa tự vẽ (content/hinh_nguon.py). Khóa: khóa câu hỏi trong web app."
for k, v in H.items(): v.place(k)
js = CSS_NOTE + "\nwindow.KHKT_HINH = " + json.dumps({k: v.svg() for k, v in H.items()}, ensure_ascii=False, indent=0) + ";\n"
OUT.write_text(js, encoding="utf-8")
print(len(H), "hình ->", OUT)
