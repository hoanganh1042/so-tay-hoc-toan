"""Tạo icon PNG cho app (không cần thư viện ngoài).

Vẽ chữ Σ trắng trên nền xanh #0d7480 bằng tô quét dòng có lấy mẫu dày (4×4) để khử răng cưa.
Chạy:  py -I app/tao_icon.py
"""
import math, pathlib, struct, zlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "web" / "app"
BG = (13, 116, 128)
FG = (255, 255, 255)
SS = 4  # số mẫu mỗi chiều trên một điểm ảnh

# Đường viền chữ Σ trong hộp đơn vị (x sang phải, y xuống dưới); nét dày khoảng 0,12.
SIGMA = [(0.18, 0.14), (0.82, 0.14), (0.82, 0.30), (0.74, 0.30), (0.74, 0.26), (0.40, 0.26),
         (0.60, 0.50), (0.40, 0.74), (0.74, 0.74), (0.74, 0.70), (0.82, 0.70), (0.82, 0.86),
         (0.18, 0.86), (0.18, 0.80), (0.44, 0.50), (0.18, 0.20)]


def rounded_rect(n, r, steps=24):
    """Đa giác xấp xỉ hình vuông bo góc cạnh n, bán kính r."""
    pts = []
    for cx, cy, a0 in ((n - r, r, -90), (n - r, n - r, 0), (r, n - r, 90), (r, r, 180)):
        for k in range(steps + 1):
            a = math.radians(a0 + 90 * k / steps)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def coverage(polys, n):
    """Tỉ lệ phủ (0..1) của hợp các đa giác trên lưới n×n, tô theo quy tắc chẵn lẻ từng đa giác."""
    N = n * SS
    acc = [[0] * n for _ in range(n)]
    for poly in polys:
        P = [(x * SS, y * SS) for x, y in poly]
        edges = list(zip(P, P[1:] + P[:1]))
        for row in range(N):
            y = row + 0.5
            xs = []
            for (x0, y0), (x1, y1) in edges:
                if (y0 <= y < y1) or (y1 <= y < y0):
                    xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            line = acc[row // SS]
            for a, b in zip(xs[0::2], xs[1::2]):
                c0, c1 = max(0, math.ceil(a - 0.5)), min(N - 1, math.floor(b - 0.5))
                for col in range(c0, c1 + 1):
                    line[col // SS] += 1
    return [[v / (SS * SS) for v in r] for r in acc]


def png(path, n, rows_rgba):
    raw = b"".join(b"\x00" + bytes(px for p in row for px in p) for row in rows_rgba)
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", n, n, 8, 6, 0, 0, 0)) \
        + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    path.write_bytes(data)


def make(name, n, maskable):
    # maskable: nền phủ kín, chữ nằm trong vùng an toàn 80% ở giữa.
    bg = [[(0, 0), (n, 0), (n, n), (0, n)]] if maskable else [rounded_rect(n, n * 0.22)]
    scale = n * (0.56 if maskable else 0.72)
    off = (n - scale) / 2
    glyph = [[(off + x * scale, off + y * scale) for x, y in SIGMA]]
    cb, cg = coverage(bg, n), coverage(glyph, n)
    rows = []
    for j in range(n):
        row = []
        for i in range(n):
            a_bg, a_g = cb[j][i], min(cg[j][i], cb[j][i])
            if a_bg == 0:
                row.append((0, 0, 0, 0)); continue
            # chữ trắng phủ lên nền, rồi cả khối có độ phủ a_bg
            col = tuple(round(FG[k] * (a_g / a_bg) + BG[k] * (1 - a_g / a_bg)) for k in range(3))
            row.append(col + (round(255 * a_bg),))
        rows.append(row)
    png(OUT / name, n, rows)
    print(name, n)


if __name__ == "__main__":
    make("icon-192.png", 192, False)
    make("icon-512.png", 512, False)
    make("icon-maskable-512.png", 512, True)
    make("apple-touch-icon.png", 180, True)
