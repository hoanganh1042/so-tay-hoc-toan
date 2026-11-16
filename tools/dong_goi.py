"""Đóng gói Sổ tay học Toán thành bản phát hành cho điện thoại và máy tính.

Nguồn là thư mục web/. Tạo thư mục ban_phat_hanh/ gồm:
  web/                         bản sao của web/ để đưa lên một trang web tĩnh (Netlify, GitHub Pages...),
                               mở bằng điện thoại rồi "Thêm vào màn hình chính" là thành ứng dụng, dùng được khi mất mạng.
  So_tay_Toan_web.zip          thư mục web/ nén sẵn để tải lên hoặc gửi đi.
  So_tay_Toan_mot_file.html    MỘT file HTML duy nhất chứa toàn bộ dữ liệu, gửi qua Zalo/Drive/USB,
                               mở bằng Chrome/Edge trên máy tính hoặc Chrome trên Android, không cần mạng.
  HUONG_DAN_CAI_DAT.txt        cách dùng từng bản.

Chạy:  py -I tools/dong_goi.py
"""
import base64, hashlib, pathlib, re, shutil, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "web"
OUT = ROOT / "ban_phat_hanh"
WEB = OUT / "web"
APP = "WebApp_So_tay_hoc_Toan.html"
NL = chr(10)

html = (SRC / APP).read_text(encoding="utf-8")
scripts = re.findall(r'<script src="([^"]+)"></script>', html)
assert scripts, "không tìm thấy thẻ script"
missing = [n for n in scripts + ["app.css"] if not (SRC / n).is_file()]
assert not missing, f"thiếu tệp trong web/: {missing}"

# ---------- bản web (để đưa lên mạng) ----------
if OUT.exists():
    shutil.rmtree(OUT)
shutil.copytree(SRC, WEB)
(WEB / ".nojekyll").write_text("", encoding="utf-8")  # để GitHub Pages phục vụ nguyên trạng

with zipfile.ZipFile(OUT / "So_tay_Toan_web.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(WEB.rglob("*")):
        if p.is_file():
            z.write(p, p.relative_to(WEB).as_posix())


# ---------- bản một file ----------
# Mã và kiểu dáng được nhúng thẳng vào trang. Chính sách bảo mật nội dung (CSP) của bản này liệt kê
# mã băm SHA-256 của từng khối nhúng, nên trình duyệt vẫn chặn mọi đoạn mã lạ bị chèn vào.
def sha(text):
    return "'sha256-" + base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode() + "'"


one, script_hashes = html, []
for name in scripts:
    body = "/* " + name + " */" + NL + (SRC / name).read_text(encoding="utf-8").replace("</script", "<" + chr(92) + "/script") + NL
    script_hashes.append(sha(body))
    one = one.replace(f'<script src="{name}"></script>', "<script>" + body + "</script>", 1)
css = (SRC / "app.css").read_text(encoding="utf-8")


# Phông chữ tự lưu: bản một file không có thư mục fonts/, nên nhúng thẳng dạng data: URL (trước khi tính mã băm).
def font_data_url(m):
    data = (SRC / "fonts" / m.group(1)).read_bytes()
    return 'url("data:font/woff2;base64,' + base64.b64encode(data).decode() + '")'


css = re.sub(r'url\("fonts/([^"]+\.woff2)"\)', font_data_url, css)
assert 'url("fonts/' not in css
one = one.replace('<link rel="stylesheet" href="app.css">', "<style>" + css + "</style>", 1)
icon = base64.b64encode((SRC / "app" / "icon-192.png").read_bytes()).decode()
one = one.replace('<link rel="manifest" href="manifest.webmanifest">' + NL, "")
one = one.replace('href="app/icon-192.png"', f'href="data:image/png;base64,{icon}"')
one = one.replace('<link rel="apple-touch-icon" href="app/apple-touch-icon.png">' + NL, "")
m = re.search(r'<meta http-equiv="Content-Security-Policy" content="([^"]*)">', one)
assert m, "không tìm thấy thẻ CSP trong trang"
csp = m.group(1)
assert "script-src 'self'" in csp and "style-src 'self'" in csp and "font-src 'self'" in csp
csp = csp.replace("script-src 'self'", "script-src " + " ".join(script_hashes)).replace("style-src 'self'", "style-src " + sha(css)).replace("font-src 'self'", "font-src data:")
one = one.replace(m.group(0), f'<meta http-equiv="Content-Security-Policy" content="{csp}">')
assert "<script src=" not in one and 'href="app.css"' not in one
(OUT / "So_tay_Toan_mot_file.html").write_text(one, encoding="utf-8", newline=NL)

# ---------- hướng dẫn ----------
GUIDE = """SỔ TAY HỌC TOÁN – CÁCH DÙNG TRÊN MÁY TÍNH VÀ ĐIỆN THOẠI
==========================================================

Có hai cách. Cách 1 nhanh nhất, không cần mạng. Cách 2 cho mọi điện thoại (kể cả iPhone)
và tự cập nhật khi nhóm sửa nội dung.


CÁCH 1. GỬI MỘT FILE: So_tay_Toan_mot_file.html
----------------------------------------------
File này chứa toàn bộ câu hỏi, lời giải và đề thi. Gửi qua Zalo, Messenger, Google Drive, email hoặc USB.

  Máy tính (Windows, macOS):
    Nhấp đúp vào file. File mở bằng Chrome, Edge hoặc Cốc Cốc và dùng được ngay, không cần mạng.

  Điện thoại Android:
    1. Tải file về máy (trong Zalo: nhấn giữ file, chọn Lưu về máy / Tải về).
    2. Mở ứng dụng Chrome, nhấn dấu ba chấm, chọn "Tệp đã tải xuống" (Downloads), chạm vào file.
    3. Muốn mở nhanh lần sau: trong Chrome nhấn dấu ba chấm, chọn "Thêm vào màn hình chính".

  iPhone, iPad:
    iOS không chạy được file HTML lưu trong máy. Hãy dùng Cách 2.

  Lưu ý: kết quả chẩn đoán, sổ tay và bài làm được lưu trong trình duyệt đang dùng.
  Mở file bằng trình duyệt khác hoặc đổi tên, chuyển file sang thư mục khác thì sẽ bắt đầu lại từ đầu.
  Muốn giữ tiến độ thì luôn mở cùng một file, bằng cùng một trình duyệt; hoặc vào mục Sổ tay,
  phần "Dữ liệu của bạn", bấm "Xuất tệp sao lưu" rồi "Nhập tệp sao lưu" ở nơi mới.


CÁCH 2. ĐƯA LÊN MẠNG, CÀI NHƯ ỨNG DỤNG (mọi điện thoại, kể cả iPhone)
--------------------------------------------------------------------
Thư mục web/ (hoặc file nén So_tay_Toan_web.zip) là trang web hoàn chỉnh. Đưa lên một dịch vụ
lưu trữ trang tĩnh miễn phí, ví dụ:

  Netlify Drop (dễ nhất, khoảng 2 phút):
    1. Vào https://app.netlify.com/drop, đăng nhập (miễn phí, có thể dùng tài khoản Google hoặc GitHub).
    2. Kéo thả cả thư mục web/ vào trang. Netlify trả về một địa chỉ dạng https://ten-ngau-nhien.netlify.app
    3. Có thể đổi tên trang trong Site settings để địa chỉ dễ nhớ hơn.

  GitHub Pages:
    1. Tạo kho (repository) mới trên GitHub, tải toàn bộ nội dung bên trong thư mục web/ lên.
    2. Vào Settings > Pages, chọn nhánh main, thư mục / (root), bấm Save.
    3. Sau khoảng một phút trang có địa chỉ https://<tên-tài-khoản>.github.io/<tên-kho>/

  Sau khi có địa chỉ, gửi đường link cho học sinh (có thể làm mã QR):
    Android (Chrome): mở link, nhấn nút "Cài app" ở đầu trang hoặc dấu ba chấm > "Cài đặt ứng dụng".
    iPhone (Safari):  mở link, nhấn nút Chia sẻ > "Thêm vào MH chính".
    Máy tính (Chrome/Edge): mở link, bấm biểu tượng cài đặt ở cuối thanh địa chỉ.
  Mở một lần khi có mạng, sau đó ứng dụng dùng được cả khi mất mạng.
  Khi nhóm sửa nội dung, chỉ cần tải lại thư mục web/ mới lên; ứng dụng trên máy học sinh tự cập nhật.


ĐÓNG GÓI LẠI SAU KHI SỬA
------------------------
Chạy lệnh:  py -I tools/dong_goi.py
Nhớ tăng số phiên bản VER trong web/sw.js mỗi lần phát hành bản web mới.
"""
(OUT / "HUONG_DAN_CAI_DAT.txt").write_text(GUIDE, encoding="utf-8-sig")

for p in sorted(OUT.iterdir()):
    size = sum(f.stat().st_size for f in p.rglob("*")) if p.is_dir() else p.stat().st_size
    print(f"{p.name:32s} {size/1024:8.0f} KB")
