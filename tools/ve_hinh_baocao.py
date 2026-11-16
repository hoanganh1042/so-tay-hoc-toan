"""Vẽ lại hai hình minh họa trong báo cáo: Value Proposition Canvas (Hình 2) và quy trình dùng web app (Hình 3).

Bố cục theo khung Value Proposition Canvas chuẩn (bản đồ giá trị hình vuông, hồ sơ khách hàng hình tròn);
hình vẽ, biểu tượng và màu sắc do nhóm tự thiết kế bằng SVG. Kết quả là file HTML, chụp ra PNG bằng Edge chạy ẩn:
  py -I tools/ve_hinh_baocao.py <thư mục tạm>
rồi chụp mỗi file HTML (xem hàm main) thành Hinh/Hinh2_value_proposition_canvas.png và Hinh/Hinh3_quy_trinh_web_app.png.
"""
import math, pathlib, subprocess, sys

FONT = "'Segoe UI', Arial, sans-serif"
INK, MUTED = "#1b2733", "#4a5868"
TEAL, TEAL_D, TEAL_L = "#0a7c88", "#075a63", "#e3f3f4"
BLUE, BLUE_L = "#2f6fd6", "#e6eefb"
ORANGE, ORANGE_D, ORANGE_L = "#e07a2e", "#a9561a", "#fdf0e6"
RED_L, GREEN_L = "#fbe9e7", "#e8f5ec"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def wrap(text, width, fs):
    """Ngắt dòng theo bề rộng ước lượng (chữ Segoe UI rộng trung bình khoảng 0,53 cỡ chữ)."""
    cw = fs*0.5; out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if len(t)*cw > width and cur:
            out.append(cur); cur = w
        else:
            cur = t
    if cur: out.append(cur)
    return out


# ---------------- biểu tượng (vẽ trắng trên nền tròn màu), tâm (0, 0), bán kính khoảng 18 ----------------
def icon(name, x, y, color, r=34):
    g = {
        "gift": '<rect x="-17" y="-6" width="34" height="22" rx="3"/><rect x="-20" y="-14" width="40" height="9" rx="2"/>'
                '<line x1="0" y1="-14" x2="0" y2="16"/><path d="M0,-14 C-4,-24 -16,-22 -11,-14 M0,-14 C4,-24 16,-22 11,-14"/>',
        "up": '<polyline points="-18,12 -6,0 3,7 18,-10"/><polyline points="7,-10 18,-10 18,1"/><line x1="-19" y1="17" x2="19" y2="17"/>',
        "aid": '<rect x="-18" y="-12" width="36" height="24" rx="6"/><line x1="0" y1="-6" x2="0" y2="6"/><line x1="-6" y1="0" x2="6" y2="0"/>',
        "star": '<polygon points="0,-18 5,-6 18,-5 8,3 11,16 0,9 -11,16 -8,3 -18,-5 -5,-6"/>',
        "bolt": '<polygon points="4,-19 -12,3 -1,3 -5,19 12,-4 1,-4"/>',
        "list": '<rect x="-14" y="-17" width="28" height="34" rx="4"/><polyline points="-8,-6 -4,-2 3,-9"/><line x1="-8" y1="6" x2="8" y2="6"/><line x1="-8" y1="11" x2="4" y2="11"/>',
        "book": '<path d="M0,-12 C-6,-16 -14,-16 -18,-14 L-18,14 C-14,12 -6,12 0,16 C6,12 14,12 18,14 L18,-14 C14,-16 6,-16 0,-12 Z"/><line x1="0" y1="-12" x2="0" y2="16"/>',
        "form": '<rect x="-14" y="-17" width="28" height="34" rx="4"/><line x1="-8" y1="-8" x2="8" y2="-8"/><line x1="-8" y1="-1" x2="8" y2="-1"/><line x1="-8" y1="6" x2="3" y2="6"/>',
        "search": '<circle cx="-4" cy="-4" r="11"/><line x1="4" y1="4" x2="16" y2="16"/>',
        "gear": '<circle cx="0" cy="0" r="7"/>' + "".join(
            f'<line x1="{11*math.cos(a):.1f}" y1="{11*math.sin(a):.1f}" x2="{17*math.cos(a):.1f}" y2="{17*math.sin(a):.1f}"/>' for a in [i*math.pi/4 for i in range(8)]),
        "note": '<rect x="-15" y="-17" width="30" height="34" rx="4"/><line x1="-15" y1="-9" x2="15" y2="-9"/><circle cx="-6" cy="3" r="2.5"/><line x1="-1" y1="3" x2="9" y2="3"/><circle cx="-6" cy="10" r="2.5"/><line x1="-1" y1="10" x2="9" y2="10"/>',
        "layers": '<polygon points="0,-16 18,-7 0,2 -18,-7"/><polyline points="-18,1 0,10 18,1"/><polyline points="-18,8 0,17 18,8"/>',
        "flag": '<line x1="-12" y1="-18" x2="-12" y2="18"/><path d="M-12,-16 L14,-16 L7,-8 L14,0 L-12,0"/>',
        "user": '<circle cx="0" cy="-7" r="8"/><path d="M-15,17 C-15,4 15,4 15,17"/>',
    }[name]
    return (f'<g transform="translate({x},{y})"><circle r="{r}" fill="{color}"/>'
            f'<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="scale({r/34:.2f})">{g}</g></g>')


def items(x, y, width, rows, color, fs=23, gap=12, lh=1.32):
    """Danh sách: mỗi dòng có nhãn mã (F1, G1...) trong ô màu, nội dung tự ngắt dòng."""
    out = []; cmax = max(len(c) for c, _ in rows)
    for code, text in rows:
        cw = 0
        if code:
            cw = max(46, cmax*fs*0.62 + 18)
            out.append(f'<rect x="{x}" y="{y - fs*0.86:.0f}" width="{cw:.0f}" height="{fs*1.24:.0f}" rx="{fs*0.62:.0f}" fill="{color}"/>'
                       f'<text x="{x + cw/2:.0f}" y="{y:.0f}" font-size="{fs*0.82:.0f}" font-weight="700" fill="#fff" text-anchor="middle">{code}</text>')
        tx = x + (cw + 12 if code else 0)
        for i, line in enumerate(wrap(text, width - (tx - x), fs)):
            out.append(f'<text x="{tx:.0f}" y="{y + i*fs*lh:.0f}" font-size="{fs}" fill="{INK}">{esc(line)}</text>')
        y += len(wrap(text, width - (tx - x), fs))*fs*lh + gap
    return "".join(out), y


def head(x, y, ic, color, title, sub=None):
    s = icon(ic, x + 30, y, color, 30) + f'<text x="{x + 74}" y="{y + 9}" font-size="31" font-weight="700" fill="{color}">{esc(title)}</text>'
    if sub: s += f'<text x="{x + 74}" y="{y + 40}" font-size="20" fill="{MUTED}" font-style="italic">{esc(sub)}</text>'
    return s


def vpc():
    W, H = 2240, 1180
    S0, S1, top = 60, 1030, 110; mid = 545; half = (top + top + 970) // 2   # hình vuông 970 x 970
    CX, CY, R = 1720, 585, 485; cut = 1810
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="{FONT}">',
         '<defs><filter id="sh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0b2533" flood-opacity=".14"/></filter>'
         f'<clipPath id="cc"><circle cx="{CX}" cy="{CY}" r="{R}"/></clipPath>'
         f'<clipPath id="sq"><rect x="{S0}" y="{top}" width="970" height="970" rx="28"/></clipPath></defs>',
         f'<rect width="{W}" height="{H}" fill="#ffffff"/>']
    # ----- bản đồ giá trị -----
    o.append(f'<g filter="url(#sh)"><rect x="{S0}" y="{top}" width="970" height="970" rx="28" fill="#fff"/></g>')
    o.append(f'<g clip-path="url(#sq)"><rect x="{S0}" y="{top}" width="{mid - S0}" height="970" fill="{TEAL_L}"/>'
             f'<rect x="{mid}" y="{top}" width="{S1 - mid}" height="{half - top}" fill="{GREEN_L}"/>'
             f'<rect x="{mid}" y="{half}" width="{S1 - mid}" height="{top + 970 - half}" fill="{BLUE_L}"/></g>')
    o.append(f'<g stroke="#fff" stroke-width="8"><line x1="{mid}" y1="{top}" x2="{mid}" y2="{top + 970}"/><line x1="{mid}" y1="{half}" x2="{S1}" y2="{half}"/></g>')
    o.append(f'<rect x="{S0}" y="{top}" width="970" height="970" rx="28" fill="none" stroke="{TEAL}" stroke-width="4"/>')
    o.append(head(S0 + 26, top + 56, "gift", TEAL, "Sản phẩm, dịch vụ", "Web app “Sổ tay học Toán cá nhân”"))
    s, _ = items(S0 + 30, top + 172, mid - S0 - 50, [
        ("F1", "Chọn bộ sách, các chương đã học"), ("F2", "Phiếu thói quen học (10 câu)"), ("F3", "Chẩn đoán lỗ hổng kiến thức"),
        ("F4", "Bản đồ lỗ hổng theo bài"), ("F5", "Lộ trình 4 tuần, ôn lại sau 1, 3, 7 ngày"), ("F6", "Gợi ý cá nhân theo 10 luật R1–R10"),
        ("F7", "Ôn tập theo độ khó: nhận biết, thông hiểu, vận dụng"), ("F8", "Đề thi thử THPT và đề thi từng chương"),
        ("F9", "Sổ lỗi sai theo 4 loại")], TEAL, 25, 15)
    o.append(s)
    o.append(head(mid + 26, top + 56, "up", "#2f8a4c", "Tạo lợi ích"))
    s, _ = items(mid + 34, top + 150, S1 - mid - 60, [
        ("", "Thấy rõ tiến bộ qua bản đồ lỗ hổng và điểm đề thử (F4, F8)"), ("", "Bài từ dễ đến khó, chấm ngay, có hướng đi giải (F7)"),
        ("", "Luyện đúng dạng đề thi mới (F8)")], "#2f8a4c", 25, 20)
    o.append(s.replace(f'<text x="{mid + 34}', f'<text x="{mid + 34}'))
    o.append(head(mid + 26, half + 56, "aid", BLUE, "Giảm nỗi đau"))
    s, _ = items(mid + 34, half + 150, S1 - mid - 60, [
        ("", "Chỉ đúng bài đang hổng (F3, F4)"), ("", "Thay vai trò dẫn dắt của lớp học thêm (F5, F7)"),
        ("", "Lịch ôn đều đặn thay cho ôn dồn (F5)"), ("", "Sửa lỗi có hệ thống (F9)"), ("", "Gợi ý trước, lời giải sau (F6, F7)")], BLUE, 25, 18)
    o.append(s)
    # ----- hồ sơ khách hàng -----
    o.append(f'<g filter="url(#sh)"><circle cx="{CX}" cy="{CY}" r="{R}" fill="#fff"/></g>')
    o.append(f'<g clip-path="url(#cc)"><rect x="{CX - R}" y="{CY - R}" width="{cut - CX + R}" height="{R}" fill="#fff4dc"/>'
             f'<rect x="{CX - R}" y="{CY}" width="{cut - CX + R}" height="{R}" fill="{RED_L}"/>'
             f'<rect x="{cut}" y="{CY - R}" width="{CX + R - cut}" height="{2*R}" fill="{ORANGE_L}"/></g>')
    o.append(f'<g stroke="#fff" stroke-width="8"><line x1="{cut}" y1="{CY - R}" x2="{cut}" y2="{CY + R}"/><line x1="{CX - R}" y1="{CY}" x2="{cut}" y2="{CY}"/></g>')
    o.append(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="none" stroke="{ORANGE}" stroke-width="4"/>')
    gx = 1385
    o.append(head(gx - 20, 235, "star", "#c48a00", "Lợi ích mong muốn"))
    s, _ = items(gx, 320, 400, [("G1", "Thấy mình tiến bộ"), ("G2", "Tự tin hơn (hiện 15%)"), ("G3", "Tự học, bớt phụ thuộc học thêm"), ("G4", "Vừa sức, miễn phí")], "#c48a00", 24, 10)
    o.append(s)
    o.append(head(gx - 20, CY + 62, "bolt", "#c2412d", "Nỗi đau"))
    s, _ = items(gx, CY + 128, 400, [("P1", "Không biết hổng từ đâu (40%)"), ("P2", "Không học thêm (59%)"), ("P3", "Ôn dồn, thiếu kế hoạch (79%)"),
                                     ("P4", "Mất điểm vì sai sót"), ("P5", "Ngại hỏi giáo viên (18%), áp lực"), ("P6", "Dùng AI chép đáp án")], "#c2412d", 23, 6)
    o.append(s)
    o.append(head(cut + 14, 330, "list", ORANGE_D, "Công việc"))
    s, _ = items(cut + 26, 420, 270, [("J1", "Điểm Toán ổn định, thi tốt nghiệp"), ("J2", "Lấp lỗ hổng lớp dưới"), ("J3", "Làm được bài vận dụng"), ("J4", "Tự học ở nhà")], ORANGE_D, 24, 14)
    o.append(s)
    # ----- khớp (fit) -----
    fx = (S1 + CX - R)//2
    for dy in (-46, 46):
        o.append(f'<g stroke="{MUTED}" stroke-width="4" fill="{MUTED}"><line x1="{S1 + 28}" y1="{CY + dy}" x2="{CX - R - 28}" y2="{CY + dy}"/>'
                 f'<polygon points="{S1 + 14},{CY + dy} {S1 + 34},{CY + dy - 10} {S1 + 34},{CY + dy + 10}"/>'
                 f'<polygon points="{CX - R - 14},{CY + dy} {CX - R - 34},{CY + dy - 10} {CX - R - 34},{CY + dy + 10}"/></g>')
    o.append(f'<rect x="{fx - 46}" y="{CY - 24}" width="92" height="48" rx="24" fill="{INK}"/><text x="{fx}" y="{CY + 9}" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">FIT</text>')
    # ----- tiêu đề hai khối -----
    o.append(f'<text x="{(S0 + S1)//2}" y="64" font-size="32" font-weight="700" fill="{TEAL_D}" text-anchor="middle">BẢN ĐỒ GIÁ TRỊ (Value Map)</text>')
    o.append(f'<text x="{CX}" y="64" font-size="32" font-weight="700" fill="{ORANGE_D}" text-anchor="middle">HỒ SƠ KHÁCH HÀNG (Customer Profile)</text>')
    o.append(icon("user", CX - 300, CY + R + 52, ORANGE, 26))
    o.append(f'<text x="{CX - 262}" y="{CY + R + 61}" font-size="25" fill="{INK}">Persona Minh: lớp 12, điểm Toán dưới 6,5</text>')
    o.append(f'<text x="{(S0 + S1)//2}" y="{CY + R + 61}" font-size="25" fill="{INK}" text-anchor="middle">Mã F1–F9 là tính năng của web app</text>')
    o.append("</svg>")
    return W, H, "".join(o)


def flow():
    W, H = 1700, 830
    cw, ch, gx = 360, 215, 52
    xs = [60 + i*(cw + gx) for i in range(4)]
    y1, y2 = 110, 545
    steps = [
        (1, "Chọn chương đã học", ["Bộ sách, lớp, các chương"], "book"),
        (2, "Phiếu thói quen", ["10 câu, khoảng 5 phút"], "form"),
        (3, "Bài chẩn đoán", ["1 câu cho mỗi bài học"], "search"),
        (4, "Chấm và áp luật", ["Đúng/sai theo từng bài", "Áp 10 luật R1–R10"], "gear"),
        (5, "Sổ tay cá nhân", ["Bản đồ lỗ hổng, lộ trình,", "gợi ý, sổ lỗi sai"], "note"),
        (6, "Ôn theo chương", ["Nhận biết, thông hiểu, vận dụng", "Hướng đi và lời giải từng câu"], "layers"),
        (7, "Đề thi thử", ["Đề THPT: chuẩn, dễ, khó, mục tiêu", "Đề theo từng chương, 22 câu"], "flag"),
    ]
    pos = {1: (xs[0], y1), 2: (xs[1], y1), 3: (xs[2], y1), 4: (xs[3], y1), 5: (xs[3], y2), 6: (xs[2], y2), 7: (xs[1], y2)}
    col = {1: TEAL, 2: TEAL, 3: TEAL, 4: TEAL, 5: BLUE, 6: BLUE, 7: ORANGE}
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="{FONT}">',
         '<defs><filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="#0b2533" flood-opacity=".13"/></filter>'
         f'<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{MUTED}"/></marker>'
         f'<marker id="ao" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{ORANGE}"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#fff"/>']
    # dải giai đoạn
    def band(x0, x1, y, color, fill, label):
        o.append(f'<rect x="{x0}" y="{y}" width="{x1 - x0}" height="{ch + 110}" rx="26" fill="{fill}"/>'
                 f'<text x="{x0 + 24}" y="{y + 38}" font-size="23" font-weight="700" fill="{color}" letter-spacing="1">{esc(label)}</text>')
    band(36, xs[3] + cw + 24, y1 - 72, TEAL_D, TEAL_L, "GIAI ĐOẠN 1 · CHẨN ĐOÁN")
    band(xs[2] - 24, xs[3] + cw + 24, y2 - 72, BLUE, BLUE_L, "GIAI ĐOẠN 2 · HỌC THEO SỔ TAY")
    band(xs[1] - 24, xs[1] + cw + 24, y2 - 72, ORANGE_D, ORANGE_L, "GIAI ĐOẠN 3 · KIỂM TRA")
    # mũi tên nối
    A = lambda p, m="ar", c=MUTED, d="": o.append(f'<path d="{p}" fill="none" stroke="{c}" stroke-width="4" {d} marker-end="url(#{m})"/>')
    for i in range(3):
        A(f"M{xs[i] + cw + 6},{y1 + ch/2} L{xs[i + 1] - 8},{y1 + ch/2}")
    A(f"M{xs[3] + cw/2},{y1 + ch + 6} L{xs[3] + cw/2},{y2 - 8}")
    A(f"M{xs[3] - 6},{y2 + ch/2} L{xs[2] + cw + 8},{y2 + ch/2}")
    A(f"M{xs[2] - 6},{y2 + ch/2} L{xs[1] + cw + 8},{y2 + ch/2}")
    ym = (y1 + ch + 38 + y2 - 72)/2; vx = xs[1] + cw - 50; tx = xs[2] + 50
    A(f"M{vx},{y2 - 6} L{vx},{ym} L{tx},{ym} L{tx},{y1 + ch + 8}", "ao", ORANGE, 'stroke-dasharray="12 9"')
    o.append(f'<rect x="{vx - 350}" y="{ym - 23}" width="330" height="46" rx="23" fill="#fff" stroke="{ORANGE}" stroke-width="2.5"/>'
             f'<text x="{vx - 185}" y="{ym + 8}" font-size="22" font-weight="600" fill="{ORANGE_D}" text-anchor="middle">Sau 4 tuần: chẩn đoán lại</text>')
    # thẻ bước
    for n, title, lines, ic in steps:
        x, y = pos[n]; c = col[n]
        o.append(f'<g filter="url(#sh)"><rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="20" fill="#fff"/></g>'
                 f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="20" fill="none" stroke="{c}" stroke-opacity=".35" stroke-width="2"/>'
                 f'<path d="M{x},{y + 20} a20,20 0 0 1 20,-20 h{cw - 40} a20,20 0 0 1 20,20 v20 h-{cw} z" fill="{c}"/>'
                 f'<text x="{x + 24}" y="{y + 27}" font-size="18" font-weight="700" fill="#fff" letter-spacing="2">BƯỚC {n}</text>')
        o.append(icon(ic, x + 54, y + 96, c, 30))
        o.append(f'<text x="{x + 98}" y="{y + 105}" font-size="26" font-weight="700" fill="{INK}">{esc(title)}</text>')
        for i, l in enumerate(lines):
            o.append(f'<text x="{x + 26}" y="{y + 156 + i*32}" font-size="21" fill="{MUTED}">{esc(l)}</text>')
    # chú thích kết quả
    o.append(f'<text x="{xs[0]}" y="{y2 + 40}" font-size="22" fill="{MUTED}">Dữ liệu chỉ lưu trên máy học sinh;</text>'
             f'<text x="{xs[0]}" y="{y2 + 72}" font-size="22" fill="{MUTED}">dùng được cả khi không có mạng.</text>')
    o.append("</svg>")
    return W, H, "".join(o)


def main():
    tmp = pathlib.Path(sys.argv[1]); tmp.mkdir(parents=True, exist_ok=True)
    root = pathlib.Path(__file__).resolve().parent.parent
    edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    for name, fn in [("Hinh2_value_proposition_canvas", vpc), ("Hinh3_quy_trinh_web_app", flow)]:
        W, H, svg = fn()
        html = tmp / f"{name}.html"
        html.write_text(f'<!doctype html><meta charset="utf-8"><style>html,body{{margin:0;background:#fff}}svg{{display:block}}</style>{svg}', encoding="utf-8")
        out = tmp / f"{name}.png"
        subprocess.run([edge, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        f"--window-size={W},{H}", f"--screenshot={out}", html.as_uri()], check=True, capture_output=True)
        print(out)


if __name__ == "__main__":
    main()
