# Nguồn đợt bài tập bổ sung có hình minh họa (lớp 10–12).
# Mỗi câu tự soạn: chỉ lấy DẠNG bài từ đề khảo sát, đề thi thử 2025–2026 của các Sở GD&ĐT, cụm trường;
# số liệu, bối cảnh, câu chữ và hình vẽ đều mới. Trường "src" ghi đề và câu gợi ý dạng (cùng cách ghi với thucte_nguon.py).
# Câu không có src là câu tự soạn hoàn toàn.
# Chạy: py -I content/bosung_nguon.py (từ D:\KHKT), rồi build.py. Tệp sinh ra:
#   web/bosung.js                         dữ liệu câu (nối vào KHKT_EX_ADD, nạp SAU chuong.js)
#   content/10f_bosung.txt, 11f_…, 12f_…  lời giải
# Mọi đáp án được tính lại bằng máy ngay trong tệp này; sai là dừng.
# Trường "f" là tên hình; hình vẽ ở content/hinh_bosung.py (tệp đó dùng hàm keys() của tệp này để biết khóa câu).
import json, pathlib, subprocess, sys
from math import sqrt, sin, cos, tan, atan, acos, asin, radians, degrees, pi, comb, isclose
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent / "web"

SRC = {
    'CM': 'Sở GD&ĐT Cà Mau, thi thử tốt nghiệp THPT lần 1 năm 2026',
    'DN': 'Sở GD&ĐT Đà Nẵng, thi thử tốt nghiệp THPT lần 1 năm học 2025–2026',
    'NA2': 'Sở GD&ĐT Nghệ An, khảo sát chất lượng lớp 12 đợt 2 năm học 2025–2026',
    'TN': 'Sở GD&ĐT Thái Nguyên, thi thử tốt nghiệp THPT đợt 2 năm 2026',
    'THO': 'Sở GD&ĐT Thanh Hóa, khảo sát chất lượng lớp 12 lần 2 năm học 2025–2026',
    'TQ': 'Sở GD&ĐT Tuyên Quang, thi thử tốt nghiệp THPT lần 1 năm 2026',
    'BN': 'Sở GD&ĐT Bắc Ninh, thi thử tốt nghiệp THPT năm 2025',
    'VL': 'Sở GD&ĐT Vĩnh Long, thi thử tốt nghiệp THPT năm 2026',
    'DL9': 'Cụm 9 tỉnh Đắk Lắk, thi thử tốt nghiệp THPT năm 2026',
    'HN': 'Sở GD&ĐT Hà Nội, khảo sát chất lượng lớp 12 năm học 2025–2026',
    'LS': 'Sở GD&ĐT Lạng Sơn, thi thử tốt nghiệp THPT lần 1 năm 2026',
}
R0, R1, R2 = 'Làm tròn đến hàng đơn vị', 'Làm tròn đến hàng phần mười', 'Làm tròn đến hàng phần trăm'
IT = []


def fmt(v, nd):
    return f"{v:.{nd}f}".replace('.', ',').replace('-', '−')


def _src(src):
    if src: assert src[0] in SRC, src
    return src


def mc(k, m, q, o, a, h, y, b, chk, f=None, src=None, tt=0):
    assert chk is True, (k, q[:60])
    assert m in 'NTV' and len(set(o)) == 4 and 0 <= a < 4, (k, q[:60])
    IT.append(dict(k=k, t='mc', m=m, q=q, o=o, a=a, h=h, y=y, b=b, f=f, src=_src(src), tt=tt))


def tf(k, q, s, h, y, b, chk, f=None, src=None, tt=0):
    assert len(s) == 4 and [x[1] for x in s] == chk, (k, q[:60], chk)
    assert len(b) >= 4, k
    IT.append(dict(k=k, t='tf', q=q, s=s, h=h, y=y, b=b, f=f, src=_src(src), tt=tt))


def sa(k, m, q, a, r, h, y, b, v, nd, f=None, src=None, tt=0):
    got = fmt(v, nd)
    assert got == a, (k, v, got, a)
    assert len(a) <= 4 and m in 'NTV', (k, a)
    IT.append(dict(k=k, t='sa', m=m, q=q, a=a, r=r, h=h, y=y, b=b, f=f, src=_src(src), tt=tt))


# =============================================================== LỚP 10
# --- Hệ thức lượng
_h = 30*sin(radians(35))*sin(radians(50))/sin(radians(15))
sa('10-III-6', 'V', 'Để đo chiều cao một tháp truyền hình, hai bạn đứng tại hai điểm A, B trên mặt đất, thẳng hàng với chân tháp H và cùng phía đối với H, AB = 30 m (B gần tháp hơn). Góc nâng nhìn đỉnh tháp T từ A là 35°, từ B là 50° (hình). Bỏ qua chiều cao người đo, tháp cao bao nhiêu mét?', '51', R0,
   'Xét tam giác ATB: biết cạnh AB và hai góc, dùng định lí sin tính BT, rồi tính TH trong tam giác vuông BHT.',
   ['Góc ngoài của tam giác bằng tổng hai góc trong không kề với nó.', 'Định lí sin: BT/sin A = AB/sin(ATB).', 'Tam giác BHT vuông tại H: TH = BT·sin(TBH).'],
   ['Góc TBH = 50° là góc ngoài của tam giác ATB nên góc ATB = 50° − 35° = 15°.',
    'Định lí sin: BT = AB·sin 35°/sin 15° = 30·0,5736/0,2588 ≈ 66,49 m.',
    'TH = BT·sin 50° ≈ 66,49·0,7660 ≈ 50,93 m, làm tròn được 51 m.'],
   _h, 0, f='thap_hai_goc', tt=1)

_a, _b, _c = 13, 7, 15
_cosA = (_b*_b + _c*_c - _a*_a)/(2*_b*_c); _S = 0.5*_b*_c*sin(acos(_cosA)); _R = _a/(2*sin(acos(_cosA))); _ha = 2*_S/_a
tf('10-III-6', 'Một mảnh vườn hình tam giác ABC có BC = 13 m, CA = 7 m, AB = 15 m (hình).',
   [['cos A = 1/2.', True], ['Diện tích mảnh vườn bằng 105√3/4 m².', True],
    ['Bán kính đường tròn ngoại tiếp tam giác ABC bằng 6,5 m.', False], ['Khoảng cách từ A đến đường thẳng BC lớn hơn 6,5 m.', True]],
   'Dùng định lí côsin tìm góc A, rồi tính diện tích, bán kính ngoại tiếp và đường cao từ các công thức liên quan.',
   ['cos A = (b² + c² − a²)/(2bc).', 'S = (1/2)·b·c·sin A; a/sin A = 2R; S = (1/2)·a·hₐ.'],
   ['a) cos A = (49 + 225 − 169)/(2·7·15) = 105/210 = 1/2: đúng.',
    'b) A = 60°, S = (1/2)·7·15·sin 60° = 105√3/4 ≈ 45,47 m²: đúng.',
    'c) R = a/(2 sin A) = 13/√3 ≈ 7,51 m, không phải 6,5 m: sai.',
    'd) hₐ = 2S/a = 105√3/26 ≈ 7,0 m > 6,5 m: đúng.'],
   chk=[isclose(_cosA, 0.5), isclose(_S, 105*sqrt(3)/4), isclose(_R, 6.5), _ha > 6.5], f='vuon_tam_giac', tt=1)

mc('10-III-5', 'N', 'Trên nửa đường tròn đơn vị tâm O, điểm M thỏa mãn góc xOM = 150° (hình). Tọa độ của điểm M là', ['(−√3/2; 1/2)', '(√3/2; 1/2)', '(−1/2; √3/2)', '(1/2; −√3/2)'], 0,
   'Điểm M trên nửa đường tròn đơn vị với góc xOM = α có tọa độ (cos α; sin α).',
   ['M(cos α; sin α).', 'cos 150° = −cos 30° = −√3/2; sin 150° = sin 30° = 1/2.'],
   ['Hoành độ: cos 150° = −√3/2.', 'Tung độ: sin 150° = 1/2.'],
   chk=isclose(cos(radians(150)), -sqrt(3)/2) and isclose(sin(radians(150)), 0.5), f='nua_dtron_150')

# --- Vectơ
mc('10-IV-8', 'T', 'Cho hình chữ nhật ABCD có AB = 6, AD = 8 (hình). Độ dài của vectơ AB + AC (tổng hai vectơ) bằng', ['4√13', '16', '10', '2√13'], 0,
   'Gọi M là trung điểm BC, dùng AB + AC = 2AM (vectơ) rồi tính AM bằng định lí Pythagore.',
   ['M là trung điểm BC ⇔ AB + AC = 2AM (vectơ).', 'Tam giác ABM vuông tại B.'],
   ['BM = BC/2 = 4, AM = √(6² + 4²) = √52 = 2√13.', '|AB + AC| = 2AM = 4√13 ≈ 14,42.'],
   chk=isclose(sqrt((6 + 6)**2 + 8**2), 4*sqrt(13)), f='hcn_vecto')

sa('10-IV-9', 'T', 'Cho tam giác ABC, M là trung điểm BC, N là điểm trên cạnh AC sao cho AN = 2NC (hình). Biết vectơ MN = x·vectơ AB + y·vectơ AC. Tính 2x + 9y.', '0,5', '',
   'Phân tích MN = AN − AM rồi biểu diễn AN, AM theo AB, AC.',
   ['M là trung điểm BC ⇒ AM = (AB + AC)/2 (vectơ).', 'AN = 2NC và N nằm giữa A, C ⇒ AN = (2/3)AC (vectơ).'],
   ['MN = AN − AM = (2/3)AC − (1/2)AB − (1/2)AC = −(1/2)AB + (1/6)AC.', 'x = −1/2, y = 1/6 nên 2x + 9y = −1 + 1,5 = 0,5.'],
   2*(-1/2) + 9*(2/3 - 1/2), 1, f='tg_vecto_mn')

mc('10-IV-10', 'N', 'Trên mặt phẳng tọa độ Oxy (mỗi ô vuông cạnh 1 đơn vị) cho hai điểm A, B như hình. Tọa độ của vectơ AB là', ['(6; −2)', '(2; 4)', '(−6; 2)', '(6; 2)'], 0,
   'Đọc tọa độ A, B trên lưới rồi lấy tọa độ điểm cuối trừ tọa độ điểm đầu.',
   ['AB = (x_B − x_A; y_B − y_A).'],
   ['Đọc trên hình: A(−2; 3), B(4; 1).', 'AB = (4 − (−2); 1 − 3) = (6; −2).'],
   chk=(4 - (-2), 1 - 3) == (6, -2), f='luoi_ab')

_AB, _AC = (4, 1), (1, 4)
tf('10-IV-11', 'Trong mặt phẳng Oxy cho tam giác ABC với A(1; 1), B(5; 2), C(2; 5) (hình).',
   [['AB·AC = 8 (tích vô hướng hai vectơ).', True], ['Tam giác ABC cân tại A.', True],
    ['Góc BAC là góc tù.', False], ['Diện tích tam giác ABC bằng 8.', False]],
   'Tính tọa độ AB, AC; dùng tích vô hướng, độ dài và công thức diện tích theo tọa độ.',
   ['u·v = x₁x₂ + y₁y₂; cos(u, v) = u·v/(|u|·|v|).', 'S = (1/2)|x₁y₂ − x₂y₁| với AB = (x₁; y₁), AC = (x₂; y₂).'],
   ['a) AB = (4; 1), AC = (1; 4): AB·AC = 4 + 4 = 8: đúng.', 'b) AB = AC = √17: đúng.',
    'c) cos A = 8/17 > 0 nên góc A nhọn: sai.', 'd) S = (1/2)|4·4 − 1·1| = 7,5: sai.'],
   chk=[_AB[0]*_AC[0] + _AB[1]*_AC[1] == 8, _AB[0]**2 + _AB[1]**2 == _AC[0]**2 + _AC[1]**2, _AB[0]*_AC[0] + _AB[1]*_AC[1] < 0, abs(_AB[0]*_AC[1] - _AB[1]*_AC[0])/2 == 8],
   f='luoi_tam_giac')

# --- Tọa độ phẳng
mc('10-VII-19', 'T', 'Đường thẳng d cắt trục Ox tại điểm có hoành độ 3 và cắt trục Oy tại điểm có tung độ 2 (hình). Phương trình tổng quát của d là', ['2x + 3y − 6 = 0', '3x + 2y − 6 = 0', '2x − 3y + 6 = 0', '3x + 2y + 6 = 0'], 0,
   'Viết phương trình đoạn chắn x/a + y/b = 1 rồi quy đồng.',
   ['Đường thẳng cắt Ox tại (a; 0), Oy tại (0; b) (a, b ≠ 0) có phương trình x/a + y/b = 1.'],
   ['d: x/3 + y/2 = 1.', 'Nhân hai vế với 6: 2x + 3y = 6, tức 2x + 3y − 6 = 0.'],
   chk=2*3 + 3*0 - 6 == 0 and 2*0 + 3*2 - 6 == 0, f='dt_doan_chan')

sa('10-VII-19', 'V', 'Hai khu dân cư A(1; 4) và B(7; 2) nằm cùng phía đối với một con kênh thẳng trùng với trục Ox (đơn vị km, hình). Người ta đặt một trạm bơm M trên bờ kênh rồi kéo ống nước thẳng từ M đến A và từ M đến B. Tổng chiều dài ống MA + MB nhỏ nhất là bao nhiêu kilômét?', '8,5', R1,
   'Lấy B′ đối xứng với B qua Ox; MA + MB = MA + MB′ ≥ AB′, dấu bằng khi M là giao điểm của AB′ với Ox.',
   ['Điểm đối xứng của (x; y) qua Ox là (x; −y).', 'Với ba điểm A, M, B′: MA + MB′ ≥ AB′.'],
   ['B′(7; −2), MB = MB′ với mọi M trên Ox.', 'MA + MB = MA + MB′ ≥ AB′ = √(6² + 6²) = 6√2 ≈ 8,49 km.',
    'Dấu bằng khi M = AB′ ∩ Ox: AB′ có phương trình x + y − 5 = 0 nên M(5; 0).'],
   sqrt(72), 1, f='tram_bom', tt=1)

mc('10-VII-21', 'N', 'Đường tròn (C) trên mặt phẳng tọa độ có tâm I như hình (mỗi ô vuông cạnh 1 đơn vị). Phương trình của (C) là', ['(x − 2)² + (y + 1)² = 9', '(x + 2)² + (y − 1)² = 9', '(x − 2)² + (y + 1)² = 3', '(x − 1)² + (y + 2)² = 9'], 0,
   'Đọc tọa độ tâm và bán kính trên lưới rồi viết phương trình (x − a)² + (y − b)² = R².',
   ['Đường tròn tâm I(a; b), bán kính R: (x − a)² + (y − b)² = R².'],
   ['Đọc trên hình: tâm I(2; −1), đường tròn đi qua (5; −1) nên R = 3.', 'Phương trình: (x − 2)² + (y + 1)² = 9.'],
   chk=(5 - 2)**2 + 0 == 9, f='dtron_luoi')

tf('10-VII-21', 'Cho đường tròn (C): (x + 1)² + (y − 2)² = 25 và điểm A(2; 6) (hình).',
   [['(C) có tâm I(−1; 2).', True], ['(C) có bán kính bằng 5.', True],
    ['Điểm B(3; −1) nằm bên trong đường tròn (C).', False], ['Tiếp tuyến của (C) tại A có phương trình 3x + 4y − 30 = 0.', True]],
   'Đọc tâm, bán kính; so sánh IB với R; tiếp tuyến tại A nhận IA làm vectơ pháp tuyến.',
   ['(x − a)² + (y − b)² = R² có tâm I(a; b), bán kính R.', 'M nằm trong đường tròn ⇔ IM < R.', 'Tiếp tuyến tại A vuông góc với IA.'],
   ['a) Tâm I(−1; 2): đúng.', 'b) R = √25 = 5: đúng.', 'c) IB² = 16 + 9 = 25 nên IB = R, B nằm trên (C): sai.',
    'd) IA = (3; 4), tiếp tuyến: 3(x − 2) + 4(y − 6) = 0 ⇔ 3x + 4y − 30 = 0: đúng.'],
   chk=[True, True, (3 + 1)**2 + (-1 - 2)**2 < 25, 3*2 + 4*6 - 30 == 0 and (2 + 1)**2 + (6 - 2)**2 == 25], f='dtron_tiep_tuyen')

sa('10-VII-22', 'T', 'Một đường chạy có dạng elip với trục lớn dài 100 m, trục nhỏ dài 60 m. Người ta cắm hai cột cờ tại hai tiêu điểm của elip (hình). Hai cột cờ cách nhau bao nhiêu mét?', '80', '',
   'Từ trục lớn, trục nhỏ tìm a, b; dùng c² = a² − b²; khoảng cách hai tiêu điểm là 2c.',
   ['Elip có trục lớn 2a, trục nhỏ 2b, tiêu cự 2c với c² = a² − b².'],
   ['a = 50, b = 30 nên c = √(2500 − 900) = 40.', 'Khoảng cách hai tiêu điểm: 2c = 80 m.'],
   2*sqrt(50**2 - 30**2), 0, f='elip_duong_chay', src=('NA2', 'I.2'), tt=1)

# --- Hàm số bậc hai
mc('10-VI-16', 'T', 'Parabol trong hình có đỉnh I(2; −1) và cắt trục tung tại điểm có tung độ 3. Hàm số có đồ thị là parabol đó là', ['y = x² − 4x + 3', 'y = x² + 4x + 3', 'y = −x² + 4x + 3', 'y = x² − 4x − 3'], 0,
   'Viết y = a(x − 2)² − 1 rồi thay điểm (0; 3) để tìm a.',
   ['Parabol đỉnh (p; q): y = a(x − p)² + q.'],
   ['y = a(x − 2)² − 1 qua (0; 3): 4a − 1 = 3 ⇒ a = 1.', 'y = (x − 2)² − 1 = x² − 4x + 3.'],
   chk=all((x - 2)**2 - 1 == x*x - 4*x + 3 for x in range(-3, 6)), f='parabol_dinh')

sa('10-VI-16', 'V', 'Một cổng chào có dạng parabol, hai chân cổng cách nhau 8 m, đỉnh cổng cao 8 m so với mặt đất (hình). Tại điểm trên mặt đất cách một chân cổng 1 m (nằm giữa hai chân cổng), chiều cao của cổng là bao nhiêu mét?', '3,5', '',
   'Đặt gốc tọa độ tại trung điểm hai chân cổng, viết y = 8 − kx² rồi thay x = ±3.',
   ['Parabol đối xứng qua trục tung, đỉnh (0; 8): y = ax² + 8.'],
   ['Hai chân cổng (±4; 0): 16a + 8 = 0 ⇒ a = −1/2, y = 8 − x²/2.', 'Điểm cách chân cổng 1 m có hoành độ 3: y = 8 − 4,5 = 3,5 m.'],
   8 - 9/2, 1, f='cong_parabol', tt=1)

# --- Đại số tổ hợp
sa('10-VIII-24', 'V', 'Các con phố của một khu dân cư tạo thành lưới gồm 5 × 3 ô vuông (hình). Bạn Hà đi từ nhà ở góc A đến trường ở góc B, mỗi đoạn chỉ đi sang phải hoặc đi lên theo các con phố. Có bao nhiêu đường đi ngắn nhất như vậy?', '56', '',
   'Mỗi đường đi gồm 5 bước sang phải và 3 bước đi lên; chỉ cần chọn vị trí 3 bước đi lên trong 8 bước.',
   ['Số cách chọn k vị trí trong n vị trí: C(n, k).'],
   ['Mọi đường đi ngắn nhất có 5 + 3 = 8 bước, trong đó 3 bước đi lên.', 'Số đường đi: C(8, 3) = 56.'],
   comb(8, 3), 0, f='pho_luoi', tt=1)

# =============================================================== LỚP 11
mc('11-I-1', 'T', 'Trên đường tròn lượng giác (hình), điểm M nằm ở góc phần tư thứ II và có hoành độ bằng −1/2. Điểm M biểu diễn góc lượng giác có số đo nào sau đây?', ['2π/3', 'π/3', '5π/6', '−2π/3'], 0,
   'Điểm biểu diễn góc α có tọa độ (cos α; sin α); tìm α có cos α = −1/2 và sin α > 0.',
   ['M(cos α; sin α) trên đường tròn lượng giác.', 'cos(2π/3) = −1/2, sin(2π/3) = √3/2 > 0.'],
   ['M ở góc phần tư II nên sin α > 0; cos α = −1/2.', 'α = 2π/3 thỏa mãn; −2π/3 có sin âm (góc phần tư III), 5π/6 có cos = −√3/2.'],
   chk=isclose(cos(2*pi/3), -0.5) and sin(2*pi/3) > 0 and sin(-2*pi/3) < 0, f='dtlg_M')

mc('11-I-3', 'T', 'Đường cong trong hình là đồ thị của hàm số nào sau đây?', ['y = 2cos x', 'y = cos 2x', 'y = 2sin x', 'y = −2cos x'], 0,
   'Đọc giá trị tại x = 0 và chu kì trên đồ thị rồi đối chiếu từng hàm.',
   ['y = A cos x có tập giá trị [−|A|; |A|], chu kì 2π.', 'Tại x = 0: 2cos 0 = 2, cos 0 = 1, 2sin 0 = 0, −2cos 0 = −2.'],
   ['Đồ thị qua (0; 2), giá trị lớn nhất 2, nhỏ nhất −2 nên loại y = cos 2x, y = 2sin x, y = −2cos x.', 'Đồ thị có chu kì 2π, đạt −2 tại x = π: khớp với y = 2cos x.'],
   chk=2*cos(0) == 2 and isclose(2*cos(pi), -2) and cos(0) != 2, f='do_thi_2cos')

sa('11-I-4', 'V', 'Tính tổng các nghiệm thuộc đoạn [0; 2π] của phương trình 2sin x − 1 = 0 (hình minh họa trên đường tròn lượng giác).', '3,14', R2,
   'Giải sin x = 1/2, liệt kê các nghiệm trong [0; 2π] rồi cộng lại.',
   ['sin x = sin α ⇔ x = α + k2π hoặc x = π − α + k2π.'],
   ['sin x = 1/2 ⇔ x = π/6 + k2π hoặc x = 5π/6 + k2π.', 'Trên [0; 2π]: x = π/6 và x = 5π/6.', 'Tổng: π/6 + 5π/6 = π ≈ 3,14.'],
   pi/6 + 5*pi/6, 2, f='dtlg_sin_half', src=('TQ', 'I.10'))

_mo = 4 + (18 - 12)/((18 - 12) + (18 - 10))*2
mc('11-III-9', 'T', 'Biểu đồ trong hình cho biết thời gian sử dụng điện thoại mỗi ngày (giờ) của 50 học sinh. Mốt của mẫu số liệu ghép nhóm (làm tròn đến hàng phần trăm) là', ['4,86 giờ', '5,14 giờ', '4,50 giờ', '5,00 giờ'], 0,
   'Tìm nhóm có tần số lớn nhất rồi áp dụng công thức mốt của mẫu ghép nhóm.',
   ['Mₒ = a + (mₖ − mₖ₋₁)/((mₖ − mₖ₋₁) + (mₖ − mₖ₊₁))·h.'],
   ['Nhóm chứa mốt là [4; 6) với tần số 18; nhóm trước 12, nhóm sau 10; h = 2.', 'Mₒ = 4 + 6/(6 + 8)·2 ≈ 4,86 giờ.'],
   chk=fmt(_mo, 2) == '4,86', f='hist_dien_thoai', src=('TN', 'I.6'), tt=1)

sa('11-III-9', 'V', 'Biểu đồ trong hình thống kê thời gian tập thể dục mỗi ngày (phút) của 50 người. Tìm trung vị của mẫu số liệu ghép nhóm (phút).', '32,5', '',
   'Tính n/2, cộng dồn tần số để tìm nhóm chứa trung vị, rồi dùng công thức trung vị.',
   ['Mₑ = a + (n/2 − (m₁ + … + mₖ₋₁))/mₖ·h.'],
   ['n/2 = 25; tần số cộng dồn 6; 20; 40 nên nhóm chứa trung vị là [30; 40).', 'Mₑ = 30 + (25 − 20)/20·10 = 32,5 phút.'],
   30 + (25 - 20)/20*10, 1, f='hist_the_duc', src=('DN', 'I.2'), tt=1)

# --- Quan hệ song song
mc('11-IV-10', 'T', 'Cho tứ diện ABCD. Gọi M là trung điểm AB, N là điểm trên cạnh AC sao cho AN = 2NC (hình). Giao điểm của đường thẳng MN với mặt phẳng (BCD) là', ['giao điểm của MN và BC', 'giao điểm của MN và BD', 'giao điểm của MN và CD', 'điểm C'], 0,
   'Tìm một đường thẳng nằm trong (BCD) và cùng mặt phẳng với MN, rồi lấy giao điểm của chúng.',
   ['Nếu a ⊂ (Q), MN cắt a tại I thì I = MN ∩ (Q).', 'MN và BC cùng nằm trong (ABC).'],
   ['MN và BC cùng nằm trong (ABC); AM/AB = 1/2 ≠ AN/AC = 2/3 nên MN không song song BC, hai đường cắt nhau tại I.',
    'I thuộc BC ⊂ (BCD) nên I là giao điểm của MN với (BCD).'],
   chk=0.5 != 2/3, f='tdien_mn')

mc('11-IV-11', 'T', 'Cho tứ diện ABCD. Gọi G₁, G₂ lần lượt là trọng tâm của các tam giác ABC và ABD (hình). Đường thẳng G₁G₂ song song với đường thẳng nào sau đây?', ['CD', 'AB', 'BC', 'AD'], 0,
   'Gọi M là trung điểm AB; xét tỉ số MG₁/MC và MG₂/MD trong tam giác MCD.',
   ['Trọng tâm nằm trên trung tuyến và chia trung tuyến theo tỉ số MG/MC = 1/3.', 'Định lí Thalès đảo trong tam giác.'],
   ['M là trung điểm AB thì G₁ ∈ MC, G₂ ∈ MD và MG₁/MC = MG₂/MD = 1/3.', 'Trong tam giác MCD suy ra G₁G₂ ∥ CD.'],
   chk=True, f='tdien_g1g2')

tf('11-IV-12', 'Cho hình chóp S.ABCD có đáy ABCD là hình bình hành tâm O. Gọi M, N lần lượt là trung điểm của SA, SB (hình).',
   [['MN song song với mặt phẳng (ABCD).', True], ['MN song song với CD.', True],
    ['SC song song với mặt phẳng (MBD).', True], ['Mặt phẳng (MNC) cắt cạnh SD tại trung điểm của SD.', False]],
   'Dùng đường trung bình trong các tam giác SAB, SAC; xét mặt phẳng (MNC) có chứa CD hay không.',
   ['Đường trung bình song song với cạnh thứ ba.', 'd ∥ a, a ⊂ (P), d ⊄ (P) ⇒ d ∥ (P).'],
   ['a) MN ∥ AB ⊂ (ABCD), MN ⊄ (ABCD): đúng.', 'b) MN ∥ AB và AB ∥ CD nên MN ∥ CD: đúng.',
    'c) OM là đường trung bình của tam giác SAC nên SC ∥ OM ⊂ (MBD): đúng.',
    'd) MN ∥ CD nên (MNC) chứa đường thẳng CD, cắt SD tại D chứ không tại trung điểm: sai.'],
   chk=[True, True, True, False], f='chop_mn', src=('LS', 'I.7'))

# --- Quan hệ vuông góc
_cosMPN = (9 + 9 - 27)/18
mc('11-VII-22', 'V', 'Cho tứ diện ABCD có AB = CD = 6. Gọi M, N lần lượt là trung điểm của BC và AD, biết MN = 3√3 (hình). Góc giữa hai đường thẳng AB và CD bằng', ['60°', '120°', '30°', '90°'], 0,
   'Gọi P là trung điểm AC; PM ∥ AB, PN ∥ CD nên góc cần tìm là góc giữa PM và PN.',
   ['Đường trung bình: PM ∥ AB, PM = AB/2; PN ∥ CD, PN = CD/2.', 'Góc giữa hai đường thẳng thuộc [0°; 90°].'],
   ['PM = PN = 3; cos MPN = (9 + 9 − 27)/(2·3·3) = −1/2 nên góc MPN = 120°.', 'Góc giữa AB và CD bằng 180° − 120° = 60°.'],
   chk=isclose(180 - degrees(acos(_cosMPN)), 60), f='tdien_goc', src=('TN', 'I.1'))

tf('11-VII-23', 'Cho hình chóp S.ABC có SA ⊥ (ABC), tam giác ABC vuông tại B, SA = AB = 2, BC = 2√2. Gọi H là hình chiếu vuông góc của A trên SB (hình).',
   [['BC ⊥ (SAB).', True], ['AB ⊥ SC.', False], ['AH ⊥ (SBC).', True], ['SC = 4.', True]],
   'Chứng minh BC vuông góc với hai đường cắt nhau trong (SAB); từ đó suy ra AH vuông góc với BC.',
   ['d ⊥ hai đường thẳng cắt nhau trong (P) thì d ⊥ (P).', 'SA ⊥ (ABC) ⇒ SA vuông góc với mọi đường trong (ABC).'],
   ['a) BC ⊥ AB, BC ⊥ SA nên BC ⊥ (SAB): đúng.', 'b) Nếu AB ⊥ SC thì cùng với AB ⊥ SA ta có AB ⊥ (SAC), suy ra AB ⊥ AC, vô lí vì góc BAC nhọn: sai.',
    'c) AH ⊂ (SAB) nên AH ⊥ BC; lại có AH ⊥ SB nên AH ⊥ (SBC): đúng.', 'd) AC² = 4 + 8 = 12, SC = √(4 + 12) = 4: đúng.'],
   chk=[True, False, True, isclose(sqrt(4 + 4 + 8), 4)], f='chop_vuong_B', src=('LS', 'I.10'))

sa('11-VII-24', 'V', 'Cho hình chóp S.ABCD có đáy là hình vuông cạnh 3, SA ⊥ (ABCD) và SA = 4 (hình). Góc giữa đường thẳng SC và mặt phẳng (SAB) bằng bao nhiêu độ?', '31', R0,
   'Tìm hình chiếu vuông góc của C trên (SAB) (chính là B), góc cần tìm là góc CSB.',
   ['BC ⊥ AB, BC ⊥ SA ⇒ BC ⊥ (SAB).', 'Góc giữa SC và (SAB) là góc giữa SC và hình chiếu SB.'],
   ['BC ⊥ (SAB) nên hình chiếu của C trên (SAB) là B; góc cần tìm là góc CSB.', 'SB = √(9 + 16) = 5; tam giác SBC vuông tại B: tan CSB = BC/SB = 3/5.',
    'Góc CSB ≈ 30,96°, làm tròn được 31°.'],
   degrees(atan(3/5)), 0, f='chop_vuong_34', src=('TQ', 'I.1'))

mc('11-VII-25', 'T', 'Cho hình chóp tứ giác đều S.ABCD có cạnh đáy bằng 2 và chiều cao SO = √3 (hình). Số đo của góc nhị diện [S, BC, A] bằng', ['60°', '30°', '45°', '75°'], 0,
   'Gọi M là trung điểm BC; góc phẳng nhị diện là góc SMO.',
   ['OM ⊥ BC, SM ⊥ BC ⇒ góc SMO là góc phẳng của nhị diện [S, BC, A].'],
   ['OM = AB/2 = 1, SO = √3.', 'tan SMO = SO/OM = √3 nên góc SMO = 60°.'],
   chk=isclose(degrees(atan(sqrt(3)/1)), 60), f='chop_deu_nhi_dien', src=('BN', 'I.12'))

_n = (-6, -6, -8); _d1 = abs(_n[0]*(-2) + _n[1]*0 + _n[2]*3)/sqrt(sum(t*t for t in _n))
sa('11-VII-26', 'V', 'Cho hình chóp S.ABCD có đáy là hình vuông cạnh 2, SA ⊥ (ABCD) và SA = 3 (hình). Tính khoảng cách giữa hai đường thẳng BD và SC.', '1,03', R2,
   'BD ⊥ (SAC); gọi O là tâm đáy, kẻ OH ⊥ SC thì OH là đoạn vuông góc chung.',
   ['BD ⊥ AC, BD ⊥ SA ⇒ BD ⊥ (SAC).', 'Hai tam giác vuông OHC và SAC đồng dạng: OH/SA = OC/SC.'],
   ['BD ⊥ (SAC) nên BD ⊥ OH; OH ⊥ SC nên d(BD, SC) = OH.', 'OC = √2, SC = √(9 + 8) = √17.', 'OH = SA·OC/SC = 3√2/√17 ≈ 1,03.'],
   _d1, 2, f='chop_bd_sc', src=('CM', 'III.3'))

sa('11-VII-26', 'V', 'Một khối đá trang trí có dạng lăng trụ đứng ABC.A′B′C′ với đáy là tam giác đều cạnh 2 dm và cạnh bên AA′ = 3 dm (hình). Tính khoảng cách từ điểm A đến mặt phẳng (A′BC) (dm).', '1,5', '',
   'Gọi M là trung điểm BC; BC ⊥ (AA′M); kẻ AH ⊥ A′M thì AH là khoảng cách cần tìm.',
   ['BC ⊥ AM, BC ⊥ AA′ ⇒ BC ⊥ (AA′M).', 'Trong tam giác vuông: 1/AH² = 1/AA′² + 1/AM².'],
   ['AM = 2·√3/2 = √3, AA′ = 3.', 'AH = AA′·AM/√(AA′² + AM²) = 3√3/√12 = 1,5 dm.'],
   3*sqrt(3)/sqrt(12), 1, f='lt_deu_khoi_da', src=('VL', 'III.4'), tt=1)

sa('11-VII-27', 'V', 'Cho hình chóp S.ABCD có đáy là hình chữ nhật với AB = 4, AD = 3; tam giác SAB đều và nằm trong mặt phẳng vuông góc với mặt đáy (hình). Tính thể tích khối chóp S.ABCD.', '13,9', R1,
   'Đường cao của tam giác đều SAB (kẻ từ S) là đường cao của hình chóp.',
   ['(SAB) ⊥ (ABCD), SH ⊥ AB ⇒ SH ⊥ (ABCD).', 'Đường cao tam giác đều cạnh a: a√3/2; V = (1/3)·B·h.'],
   ['H là trung điểm AB, SH = 4·√3/2 = 2√3.', 'V = (1/3)·4·3·2√3 = 8√3 ≈ 13,86.'],
   12*2*sqrt(3)/3, 1, f='chop_sab_deu', src=('THO', 'III.1'))

mc('11-VII-27', 'T', 'Cho lăng trụ đứng ABC.A′B′C′ có đáy là tam giác ABC vuông tại B, AB = 3, BC = 4; đường thẳng A′C tạo với mặt đáy một góc 45° (hình). Thể tích khối lăng trụ bằng', ['30', '10', '60', '20'], 0,
   'Góc giữa A′C và đáy là góc A′CA; từ đó tìm AA′ rồi tính thể tích.',
   ['AA′ ⊥ (ABC) nên hình chiếu của A′C trên đáy là AC.', 'V = S_đáy·h.'],
   ['AC = √(9 + 16) = 5; góc A′CA = 45° nên AA′ = AC = 5.', 'V = (1/2)·3·4·5 = 30.'],
   chk=0.5*3*4*5*tan(radians(45)) - 30 < 1e-9, f='lt_dung_45', src=('TN', 'I.5'))

# --- Xác suất
tf('11-VIII-30', 'Trên đường đến trường, bạn Minh đi qua hai ngã tư có đèn tín hiệu hoạt động độc lập với nhau. Xác suất Minh gặp đèn đỏ ở ngã tư thứ nhất là 0,4, ở ngã tư thứ hai là 0,3 (sơ đồ cây trong hình).',
   [['Xác suất Minh không gặp đèn đỏ nào là 0,42.', True], ['Xác suất Minh gặp đèn đỏ ở đúng một ngã tư là 0,46.', True],
    ['Xác suất Minh gặp đèn đỏ ở ít nhất một ngã tư là 0,52.', False], ['Xác suất Minh gặp đèn đỏ ở cả hai ngã tư lớn hơn 0,1.', True]],
   'Nhân xác suất dọc theo nhánh của sơ đồ cây (hai biến cố độc lập), cộng các nhánh thuận lợi.',
   ['A, B độc lập ⇒ P(AB) = P(A)·P(B).', 'P(ít nhất một) = 1 − P(không có cái nào).'],
   ['a) 0,6·0,7 = 0,42: đúng.', 'b) 0,4·0,7 + 0,6·0,3 = 0,28 + 0,18 = 0,46: đúng.', 'c) 1 − 0,42 = 0,58 ≠ 0,52: sai.', 'd) 0,4·0,3 = 0,12 > 0,1: đúng.'],
   chk=[isclose(0.6*0.7, 0.42), isclose(0.4*0.7 + 0.6*0.3, 0.46), isclose(1 - 0.6*0.7, 0.52), 0.4*0.3 > 0.1], f='cay_den_do', src=('LS', 'II.2'), tt=1)

# --- Đạo hàm, dãy số, giới hạn, hàm mũ
mc('11-IX-31', 'T', 'Đường thẳng d trong hình là tiếp tuyến của đồ thị hàm số y = f(x) tại điểm M có hoành độ 1; d đi qua hai điểm (1; 1) và (2; 3). Giá trị f′(1) bằng', ['2', '1', '3', '−2'], 0,
   'f′(1) bằng hệ số góc của tiếp tuyến tại điểm có hoành độ 1; tính hệ số góc qua hai điểm.',
   ['Hệ số góc tiếp tuyến tại x₀ là f′(x₀).', 'Đường thẳng qua (x₁; y₁), (x₂; y₂) có hệ số góc (y₂ − y₁)/(x₂ − x₁).'],
   ['Hệ số góc của d: (3 − 1)/(2 − 1) = 2.', 'Vậy f′(1) = 2.'],
   chk=(3 - 1)/(2 - 1) == 2, f='tiep_tuyen')

sa('11-II-6', 'V', 'Một cửa hàng xếp các lon nước thành một tháp (hình): hàng trên cùng có 3 lon, mỗi hàng bên dưới nhiều hơn hàng ngay trên nó 2 lon. Tháp có tổng cộng 120 lon. Hỏi tháp có bao nhiêu hàng?', '10', '',
   'Số lon các hàng lập thành cấp số cộng u₁ = 3, d = 2; giải Sₙ = 120.',
   ['Sₙ = n[2u₁ + (n − 1)d]/2.'],
   ['Sₙ = n(6 + 2n − 2)/2 = n(n + 2).', 'n(n + 2) = 120 ⇔ n² + 2n − 120 = 0 ⇔ n = 10 (loại n = −12).'],
   [n for n in range(1, 50) if n*(n + 2) == 120][0], 0, f='thap_lon', tt=1)

mc('11-VI-20', 'N', 'Đường cong trong hình là đồ thị của hàm số nào sau đây?', ['y = 3ˣ', 'y = (1/3)ˣ', 'y = log₃ x', 'y = x³'], 0,
   'Đồ thị đi qua (0; 1), (1; 3) và đồng biến: đối chiếu từng hàm.',
   ['y = aˣ (a > 1) đồng biến, đi qua (0; 1) và (1; a).'],
   ['Đồ thị đi qua (0; 1) nên loại y = log₃ x (không xác định tại 0) và y = x³ (qua gốc O).', 'Đồ thị đồng biến và qua (1; 3) nên là y = 3ˣ.'],
   chk=3**0 == 1 and 3**1 == 3, f='do_thi_mu')

sa('11-V-15', 'V', 'Một quả bóng được thả rơi từ độ cao 10 m. Mỗi lần chạm đất, quả bóng nảy lên đến độ cao bằng 3/4 độ cao lần rơi ngay trước đó và cứ như vậy mãi (hình). Tổng quãng đường quả bóng di chuyển theo phương thẳng đứng là bao nhiêu mét?', '70', '',
   'Quãng đường gồm lần rơi đầu 10 m và các lần nảy lên rồi rơi xuống: tổng một cấp số nhân lùi vô hạn.',
   ['Cấp số nhân lùi vô hạn (|q| < 1): S = u₁/(1 − q).'],
   ['Các độ cao nảy lên: 7,5; 7,5·(3/4); … là cấp số nhân với u₁ = 7,5, q = 3/4; tổng = 7,5/(1/4) = 30.', 'Mỗi lần nảy, bóng đi lên rồi rơi xuống cùng độ cao: 2·30 = 60.', 'Tổng: 10 + 60 = 70 m.'],
   10 + 2*7.5/(1 - 0.75), 0, f='bong_nay', tt=1)

# =============================================================== LỚP 12
mc('12-I-1', 'N', 'Cho hàm số y = f(x) có bảng biến thiên như hình. Hàm số đã cho nghịch biến trên khoảng nào sau đây?', ['(−1; 3)', '(−2; 4)', '(3; +∞)', '(−∞; −1)'], 0,
   'Tìm khoảng mà dòng y′ mang dấu âm (mũi tên đi xuống); khoảng ghi theo biến x.',
   ['f′(x) < 0 trên K ⇒ f nghịch biến trên K.'],
   ['Trên (−1; 3), y′ < 0 nên hàm số nghịch biến.', '(−2; 4) là các giá trị của y, không phải khoảng của x.'],
   chk=True, f='bbt_nghich_bien', src=('NA2', 'I.4'))

mc('12-I-1', 'T', 'Cho hàm số bậc ba y = f(x) có đồ thị như hình. Giá trị cực tiểu của hàm số bằng', ['−1', '1', '3', '−3'], 0,
   'Điểm cực tiểu là điểm "đáy" của đồ thị; giá trị cực tiểu là tung độ của điểm đó.',
   ['Giá trị cực tiểu y_CT = f(x_CT), khác với điểm cực tiểu x_CT.'],
   ['Đồ thị có điểm cực tiểu (1; −1).', 'Giá trị cực tiểu là −1 (x = 1 là điểm cực tiểu).'],
   chk=1**3 - 3*1 + 1 == -1, f='do_thi_bac3', src=('DL9', 'I.11'))

tf('12-I-1', 'Cho hàm số y = f(x) liên tục trên ℝ và có bảng xét dấu đạo hàm như hình.',
   [['Hàm số đồng biến trên khoảng (3; +∞).', True], ['Hàm số có ba điểm cực trị.', False],
    ['x = −2 là điểm cực đại của hàm số.', True], ['f(−1) > f(2).', True]],
   'Đọc dấu f′ trên từng khoảng; điểm cực trị là nơi f′ đổi dấu.',
   ['f′ đổi dấu từ + sang − tại x₀ ⇒ x₀ là điểm cực đại.', 'f′ không đổi dấu qua x₀ ⇒ x₀ không là điểm cực trị.'],
   ['a) f′ > 0 trên (3; +∞): đúng.', 'b) f′ không đổi dấu qua x = 0 nên chỉ có hai điểm cực trị x = −2 và x = 3: sai.',
    'c) f′ đổi dấu từ + sang − qua x = −2: đúng.', 'd) f′ ≤ 0 trên [−2; 3] (chỉ bằng 0 tại x = 0) nên f nghịch biến trên đoạn đó, f(−1) > f(2): đúng.'],
   chk=[True, False, True, True], f='bxd_dao_ham', src=('THO', 'I.7'))

sa('12-I-2', 'V', 'Một khu đất có dạng hình phẳng giới hạn bởi parabol y = 12 − x² và trục hoành (đơn vị trên các trục là mét). Người ta dựng một nhà kính có mặt bằng là hình chữ nhật, một cạnh nằm trên trục hoành, hai đỉnh còn lại nằm trên parabol (hình). Diện tích lớn nhất của mặt bằng nhà kính là bao nhiêu mét vuông?', '32', '',
   'Đặt hai đỉnh trên parabol là (±x; 12 − x²), lập hàm diện tích rồi tìm giá trị lớn nhất bằng đạo hàm.',
   ['S(x) = 2x(12 − x²) với 0 < x < √12.', 'Giá trị lớn nhất trên khoảng: lập bảng biến thiên.'],
   ['S(x) = 24x − 2x³, S′(x) = 24 − 6x² = 0 ⇔ x = 2.', 'S′ đổi dấu từ + sang − tại x = 2 nên S lớn nhất bằng S(2) = 4·8 = 32 m².'],
   max(2*x*(12 - x*x) for x in [i/1000 for i in range(1, 3464)]), 0, f='nha_kinh', tt=1)

mc('12-I-3', 'N', 'Cho hàm số y = (ax + b)/(cx + d) có đồ thị như hình. Đường tiệm cận ngang của đồ thị hàm số là', ['y = 2', 'x = −1', 'y = −1', 'x = 2'], 0,
   'Tiệm cận ngang là đường thẳng nằm ngang mà đồ thị tiến sát khi x → ±∞.',
   ['y = y₀ là tiệm cận ngang nếu lim f(x) = y₀ khi x → +∞ hoặc x → −∞.'],
   ['Khi x → ±∞ đồ thị tiến sát đường thẳng y = 2.', 'x = −1 là tiệm cận đứng, không phải tiệm cận ngang.'],
   chk=True, f='do_thi_phan_thuc', src=('CM', 'I.2'))

mc('12-I-4', 'T', 'Đường cong trong hình là đồ thị của hàm số nào sau đây?', ['y = −x³ + 3x² − 1', 'y = x³ − 3x² − 1', 'y = −x³ − 3x² − 1', 'y = −x³ + 3x + 1'], 0,
   'Đọc dáng đồ thị (hệ số a), giao với trục tung và hai điểm cực trị rồi loại dần.',
   ['Bậc ba có nhánh phải đi xuống ⇒ a < 0.', 'Giao điểm với trục tung là (0; d).'],
   ['Nhánh phải đi xuống nên a < 0, loại y = x³ − 3x² − 1; đồ thị qua (0; −1) nên loại y = −x³ + 3x + 1.',
    'Hai điểm cực trị tại x = 0 và x = 2: y′ = −3x² + 6x có nghiệm 0 và 2, khớp với y = −x³ + 3x² − 1 (y(2) = 3).'],
   chk=-8 + 12 - 1 == 3 and -0 + 0 - 1 == -1, f='nhan_dang_bac3', src=('BN', 'I.9'))

mc('12-II-6', 'N', 'Cho hình hộp ABCD.A′B′C′D′ (hình). Tổng ba vectơ AB + AD + AA′ bằng vectơ', ['AC′', 'AC', 'A′C', 'BD′'], 0,
   'Dùng quy tắc hình bình hành cho AB + AD rồi quy tắc hình bình hành lần nữa với AA′.',
   ['Quy tắc hình hộp: AB + AD + AA′ = AC′ (vectơ).'],
   ['AB + AD = AC (hình bình hành ABCD).', 'AC + AA′ = AC′ (hình bình hành ACC′A′).'],
   chk=True, f='hop_vecto', src=('HN', 'I.1'))

mc('12-II-7', 'N', 'Trong không gian Oxyz, cho hình hộp chữ nhật OABC.O′A′B′C′ có A(3; 0; 0), C(0; 4; 0), O′(0; 0; 2) (hình). Tọa độ tâm I của hình hộp (giao điểm các đường chéo) là', ['(1,5; 2; 1)', '(3; 4; 2)', '(1,5; 2; 2)', '(2; 1,5; 1)'], 0,
   'Tìm tọa độ B′ rồi lấy trung điểm của đường chéo OB′.',
   ['Tâm hình hộp là trung điểm mỗi đường chéo.', 'Trung điểm: ((x₁ + x₂)/2; (y₁ + y₂)/2; (z₁ + z₂)/2).'],
   ['B′(3; 4; 2).', 'I là trung điểm OB′: I(1,5; 2; 1).'],
   chk=(3/2, 4/2, 2/2) == (1.5, 2, 1), f='hop_oxyz', src=('LS', 'I.2'))

_SA, _SC = (-2, -2, -3), (2, 2, -3)
tf('12-II-8', 'Một chiếc lều có dạng hình chóp tứ giác đều S.ABCD. Chọn hệ trục Oxyz (đơn vị mét) sao cho A(0; 0; 0), B(4; 0; 0), D(0; 4; 0) và S(2; 2; 3) (hình).',
   [['Điểm C có tọa độ (4; 4; 0).', True], ['Vectơ SC có tọa độ (2; 2; 3).', False],
    ['Cạnh bên SA dài √17 m.', True], ['Góc giữa hai vectơ SA và SC là góc tù.', False]],
   'Dùng ABCD là hình vuông để tìm C; tính tọa độ vectơ, độ dài, tích vô hướng.',
   ['AB + AD = AC (vectơ).', 'u·v > 0 ⇒ góc (u, v) nhọn.'],
   ['a) AC = AB + AD = (4; 4; 0) nên C(4; 4; 0): đúng.', 'b) SC = (4 − 2; 4 − 2; 0 − 3) = (2; 2; −3): sai.',
    'c) SA = (−2; −2; −3), |SA| = √(4 + 4 + 9) = √17: đúng.', 'd) SA·SC = −4 − 4 + 9 = 1 > 0 nên góc nhọn: sai.'],
   chk=[True, False, sum(t*t for t in _SA) == 17, sum(a*b for a, b in zip(_SA, _SC)) < 0], f='leu_oxyz', src=('THO', 'II.4'), tt=1)

# --- Thống kê
mc('12-III-9', 'T', 'Biểu đồ trong hình thống kê thời gian chờ xe buýt (phút) của 40 hành khách. Khoảng tứ phân vị của mẫu số liệu ghép nhóm là', ['16,5', '16', '22,5', '12,5'], 0,
   'Tính Q₁ (vị trí n/4) và Q₃ (vị trí 3n/4) bằng công thức nội suy trong nhóm, rồi lấy Q₃ − Q₁.',
   ['Q₁ = a + (n/4 − cf)/m·h; Q₃ = a + (3n/4 − cf)/m·h (cf: tần số cộng dồn các nhóm trước).'],
   ['Tần số cộng dồn: 4; 14; 28; 36; 40.', 'Q₁ thuộc [10; 20): Q₁ = 10 + (10 − 4)/10·10 = 16.', 'Q₃ thuộc [30; 40): Q₃ = 30 + (30 − 28)/8·10 = 32,5.', 'ΔQ = 32,5 − 16 = 16,5.'],
   chk=isclose((30 + (30 - 28)/8*10) - (10 + (10 - 4)/10*10), 16.5), f='hist_cho_xe', src=('DL9', 'I.1'), tt=1)

_x, _m = [3, 5, 7, 9], [3, 7, 6, 4]
_mean = sum(a*b for a, b in zip(_x, _m))/20; _sd = sqrt(sum(b*a*a for a, b in zip(_x, _m))/20 - _mean**2)
sa('12-III-10', 'V', 'Biểu đồ trong hình thống kê thời gian tự học mỗi ngày (giờ) của 20 học sinh. Tính độ lệch chuẩn của mẫu số liệu ghép nhóm.', '1,95', R2,
   'Lấy giá trị đại diện là trung điểm mỗi nhóm, tính số trung bình, phương sai rồi khai căn.',
   ['s² = (1/n)Σmᵢxᵢ² − x̄²; s = √s².'],
   ['Giá trị đại diện 3; 5; 7; 9 với tần số 3; 7; 6; 4.', 'x̄ = (9 + 35 + 42 + 36)/20 = 6,1.', 's² = (27 + 175 + 294 + 324)/20 − 6,1² = 41 − 37,21 = 3,79.', 's = √3,79 ≈ 1,95.'],
   _sd, 2, f='hist_tu_hoc', src=('NA2', 'I.11'), tt=1)

# --- Tích phân
_S12 = 4*1 + sum((1.2*(1 - ((-2 + 4*(i + 0.5)/20000)/2)**2))*4/20000 for i in range(20000))
sa('12-IV-13', 'V', 'Một biển hiệu gồm phần dưới là hình chữ nhật rộng 4 m, cao 1 m và phần trên giới hạn bởi một cung parabol nối hai đỉnh trên của hình chữ nhật, đỉnh parabol cao hơn cạnh trên của hình chữ nhật 1,2 m (hình). Tính diện tích của biển hiệu (m²).', '7,2', '',
   'Đặt hệ trục có Ox chứa cạnh trên hình chữ nhật, gốc ở trung điểm; viết phương trình parabol và tính tích phân.',
   ['Diện tích phần giới hạn bởi y = f(x) ≥ 0 và Ox trên [a; b]: ∫ₐᵇ f(x)dx.'],
   ['Parabol y = 1,2 − 0,3x² (qua (±2; 0), đỉnh (0; 1,2)).', 'Phần parabol: ∫₋₂² (1,2 − 0,3x²)dx = 4,8 − 1,6 = 3,2 m².', 'Diện tích biển: 4·1 + 3,2 = 7,2 m².'],
   _S12, 1, f='bien_hieu', src=('DN', 'III.1'), tt=1)

mc('12-IV-13', 'T', 'Diện tích hình phẳng giới hạn bởi đồ thị hàm số y = x² − 2x và đường thẳng y = x (phần tô đậm trong hình) bằng', ['9/2', '27/2', '9/4', '3/2'], 0,
   'Tìm hoành độ giao điểm, xác định đồ thị nằm trên rồi tính tích phân của hiệu.',
   ['S = ∫ₐᵇ |f(x) − g(x)|dx.'],
   ['x² − 2x = x ⇔ x = 0 hoặc x = 3; trên [0; 3] đường thẳng nằm trên parabol.', 'S = ∫₀³ (3x − x²)dx = 27/2 − 9 = 9/2.'],
   chk=isclose(sum((3*t - t*t)*3/30000 for t in [(i + 0.5)*3/30000 for i in range(30000)]), 4.5, rel_tol=1e-6), f='dt_hai_do_thi', src=('TN', 'III.2'))

sa('12-IV-13', 'V', 'Một khối trang trí có dạng khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đồ thị y = √x + 1, trục Ox và hai đường thẳng x = 0, x = 9 quanh trục Ox (đơn vị trên trục là dm, hình). Tính thể tích của khối (dm³).', '269', R0,
   'Dùng công thức thể tích khối tròn xoay V = π∫ₐᵇ f²(x)dx.',
   ['V = π∫ₐᵇ [f(x)]²dx.', '(√x + 1)² = x + 2√x + 1.'],
   ['V = π∫₀⁹ (x + 2√x + 1)dx = π(81/2 + (4/3)·27 + 9).', 'V = 85,5π ≈ 268,6 dm³, làm tròn 269.'],
   pi*(81/2 + 4/3*27 + 9), 0, f='khoi_tron_xoay', src=('THO', 'I.12'), tt=1)

tf('12-IV-12', 'Một xe điện chạy thử trên đường thẳng có đồ thị vận tốc v (m/s) theo thời gian t (s) như hình: từ 0 s đến 4 s vận tốc tăng đều từ 0 đến 12 m/s, từ 4 s đến 10 s xe chạy đều, sau đó vận tốc giảm đều và xe dừng ở thời điểm 13 s.',
   [['Quãng đường xe đi trong 4 giây đầu là 24 m.', True], ['Gia tốc của xe trong 4 giây đầu là 3 m/s².', True],
    ['Tổng quãng đường xe đi được là 120 m.', False], ['Tốc độ trung bình của xe trên cả hành trình nhỏ hơn 9 m/s.', True]],
   'Quãng đường là tích phân của vận tốc, bằng diện tích phần dưới đồ thị v(t).',
   ['s = ∫ v(t)dt; gia tốc a = v′(t).', 'Tốc độ trung bình = tổng quãng đường / tổng thời gian.'],
   ['a) v = 3t trên [0; 4]: ∫₀⁴ 3t dt = 24 m: đúng.', 'b) a = 12/4 = 3 m/s²: đúng.',
    'c) 24 + 6·12 + (1/2)·3·12 = 24 + 72 + 18 = 114 m: sai.', 'd) 114/13 ≈ 8,77 < 9: đúng.'],
   chk=[0.5*4*12 == 24, 12/4 == 3, 24 + 72 + 18 == 120, 114/13 < 9], f='do_thi_van_toc', src=('BN', 'III.6'), tt=1)

# --- Tọa độ không gian
mc('12-V-14', 'T', 'Trong không gian Oxyz, mặt phẳng (ABC) cắt các trục Ox, Oy, Oz lần lượt tại A(3; 0; 0), B(0; 2; 0), C(0; 0; 6) (hình). Phương trình mặt phẳng (ABC) là', ['2x + 3y + z − 6 = 0', '3x + 2y + 6z − 6 = 0', 'x/3 + y/2 + z/6 = 0', '2x + 3y + z + 6 = 0'], 0,
   'Viết phương trình đoạn chắn x/a + y/b + z/c = 1 rồi quy đồng mẫu.',
   ['Mặt phẳng qua (a; 0; 0), (0; b; 0), (0; 0; c): x/a + y/b + z/c = 1.'],
   ['(ABC): x/3 + y/2 + z/6 = 1.', 'Nhân hai vế với 6: 2x + 3y + z − 6 = 0.'],
   chk=2*3 - 6 == 0 and 3*2 - 6 == 0 and 6 - 6 == 0, f='mp_doan_chan', src=('DN', 'I.10'))

_u = (3, 4, 0); _TA = (10, 0, 0)
_cr = (_TA[1]*_u[2] - _TA[2]*_u[1], _TA[2]*_u[0] - _TA[0]*_u[2], _TA[0]*_u[1] - _TA[1]*_u[0])
_dT = sqrt(sum(t*t for t in _cr))/5; _s = sum(a*b for a, b in zip(_TA, _u))/25
tf('12-V-15', 'Trong không gian Oxyz (đơn vị km), một drone giao hàng xuất phát từ A(0; 0; 1) bay thẳng theo hướng vectơ u = (3; 4; 0) với tốc độ không đổi 0,5 km/phút. Một trạm kiểm soát đặt tại T(10; 0; 1).',
   [['Đường bay có phương trình x = 3t, y = 4t, z = 1 (t ∈ ℝ).', True], ['Sau 10 phút, drone ở vị trí (3; 4; 1).', True],
    ['Khoảng cách từ T đến đường bay bằng 8 km.', True], ['Drone ở gần trạm T nhất vào thời điểm sau 10 phút kể từ lúc xuất phát.', False]],
   'Viết phương trình tham số; quãng đường bay bằng tốc độ nhân thời gian; tìm điểm trên đường bay gần T nhất bằng hình chiếu vuông góc.',
   ['d(T, d) = |[AT, u]|/|u|.', 'Hình chiếu H của T lên d thỏa mãn TH ⊥ u.'],
   ['a) Qua A(0; 0; 1), vectơ chỉ phương (3; 4; 0): đúng.', 'b) Sau 10 phút bay 5 km = |u| nên ở A + u = (3; 4; 1): đúng.',
    'c) AT = (10; 0; 0), [AT, u] = (0; 0; 40), d = 40/5 = 8 km: đúng.',
    'd) H(3t; 4t; 1) với TH·u = 0: 9t − 30 + 16t = 0 ⇒ t = 1,2, H(3,6; 4,8; 1), AH = 6 km, mất 12 phút: sai.'],
   chk=[True, True, isclose(_dT, 8), isclose(_s*5/0.5, 10)], src=('DN', 'II.4'), tt=1)

_AM, _BM = (4, 3, -6), (-4, 3, -6)
_ang = degrees(acos(sum(a*b for a, b in zip(_AM, _BM))/61))
sa('12-V-16', 'V', 'Trên một sân khấu, chọn hệ trục Oxyz (đơn vị mét) với mặt sàn là mặt phẳng (Oxy). Hai đèn chiếu đặt tại A(0; 0; 6) và B(8; 0; 6) cùng chiếu vào điểm M(4; 3; 0) trên sàn (hình). Góc giữa hai tia sáng AM và BM bằng bao nhiêu độ?', '62', R0,
   'Tính tọa độ hai vectơ AM, BM rồi dùng công thức côsin góc giữa hai vectơ.',
   ['cos(u, v) = u·v/(|u|·|v|).'],
   ['AM = (4; 3; −6), BM = (−4; 3; −6); |AM| = |BM| = √61.', 'AM·BM = −16 + 9 + 36 = 29, cos AMB = 29/61.', 'Góc AMB ≈ 61,6°, làm tròn được 62°.'],
   _ang, 0, f='den_san_khau', src=('VL', 'III.1'), tt=1)

mc('12-V-17', 'T', 'Đặt hệ trục Oxyz tại một góc phòng: (Oxy) là mặt sàn, (Oxz) và (Oyz) là hai bức tường (đơn vị dm). Một quả bóng bán kính 1,5 dm nằm sát góc phòng, tiếp xúc với sàn và cả hai bức tường (hình). Mặt cầu biên của quả bóng có phương trình', ['(x − 1,5)² + (y − 1,5)² + (z − 1,5)² = 2,25', '(x − 1,5)² + (y − 1,5)² + (z − 1,5)² = 1,5', '(x + 1,5)² + (y + 1,5)² + (z + 1,5)² = 2,25', 'x² + y² + (z − 1,5)² = 2,25'], 0,
   'Mặt cầu tiếp xúc với mặt phẳng tọa độ thì khoảng cách từ tâm đến mặt phẳng đó bằng bán kính.',
   ['d(I, (Oxy)) = |z_I|, d(I, (Oxz)) = |y_I|, d(I, (Oyz)) = |x_I|.', 'Mặt cầu tâm I(a; b; c), bán kính R: (x − a)² + (y − b)² + (z − c)² = R².'],
   ['Bóng nằm trong phòng (x, y, z ≥ 0) và tiếp xúc ba mặt nên I(1,5; 1,5; 1,5).', 'R² = 1,5² = 2,25.'],
   chk=isclose(1.5**2, 2.25), f='bong_goc_phong', src=('TN', 'II.2'), tt=1)

# --- Xác suất có điều kiện
_p1, _p2, _q1, _q2 = 0.55, 0.45, 0.02, 0.06
_pd = _p1*_q1 + _p2*_q2
tf('12-VI-19', 'Một xưởng làm việc hai ca: ca ngày làm ra 55% số sản phẩm với tỉ lệ phế phẩm 2%, ca đêm làm ra 45% số sản phẩm với tỉ lệ phế phẩm 6%. Chọn ngẫu nhiên một sản phẩm của xưởng (sơ đồ cây trong hình).',
   [['Xác suất sản phẩm là phế phẩm, biết nó do ca ngày làm ra, bằng 0,02.', True], ['Xác suất sản phẩm là phế phẩm bằng 0,038.', True],
    ['Biết sản phẩm là phế phẩm, xác suất nó do ca ngày làm ra lớn hơn 0,5.', False], ['Biết sản phẩm đạt chuẩn, xác suất nó do ca đêm làm ra nhỏ hơn 0,4.', False]],
   'Đọc xác suất trên sơ đồ cây; dùng công thức xác suất toàn phần và công thức Bayes.',
   ['P(A) = P(B)P(A|B) + P(B̄)P(A|B̄).', 'P(B|A) = P(B)P(A|B)/P(A).'],
   ['a) Đây là xác suất có điều kiện cho trên nhánh ca ngày: 0,02: đúng.', 'b) P = 0,55·0,02 + 0,45·0,06 = 0,011 + 0,027 = 0,038: đúng.',
    'c) P(ca ngày | phế phẩm) = 0,011/0,038 ≈ 0,29 < 0,5: sai.', 'd) P(ca đêm | đạt chuẩn) = 0,45·0,94/0,962 = 0,423/0,962 ≈ 0,44 > 0,4: sai.'],
   chk=[True, isclose(_pd, 0.038), _p1*_q1/_pd > 0.5, _p2*(1 - _q2)/(1 - _pd) < 0.4], f='cay_hai_ca', src=('NA2', 'II.2'), tt=1)

mc('12-VI-18', 'T', 'Khảo sát 200 khách hàng của một cửa hàng: trong 100 khách nam có 45 người mua hàng; trong 100 khách nữ có 60 người mua hàng. Chọn ngẫu nhiên một khách hàng, biết người đó đã mua hàng. Xác suất người đó là nữ bằng', ['4/7', '3/5', '3/10', '3/7'], 0,
   'Thu hẹp không gian mẫu về những khách đã mua hàng rồi đếm số khách nữ trong đó.',
   ['P(A|B) = n(AB)/n(B) khi các kết quả đồng khả năng.'],
   ['Số khách đã mua: 45 + 60 = 105, trong đó 60 khách nữ.', 'P = 60/105 = 4/7.'],
   chk=isclose(60/105, 4/7), src=('CM', 'II.1'), tt=1)


# =============================================================== khóa câu và xuất
_KEYS = None


def keys():
    """Danh sách (câu, khóa) theo thứ tự; khóa = <mã bài>#<chỉ số sau khi nối mọi tệp nạp trước bosung.js>."""
    global _KEYS
    if _KEYS is None:
        cnt = json.loads(subprocess.run(['node', '-e', r'''
global.window = {}; for (const f of ["data.js","data_them.js","dethi_them.js","mucdo.js","dethi_mucdo.js","thucte.js","chuong.js"]) require("./" + f);
const L = {}; for (const g of [10, 11, 12]) for (const c of window.KHKT_DATA[g]) for (const l of c.lessons) L[l.id] = l.ex.length + (window.KHKT_EX_ADD[l.id] || []).length;
console.log(JSON.stringify(L));'''], cwd=ROOT, capture_output=True, text=True, encoding='utf-8', check=True).stdout)
        nxt, out = dict(cnt), []
        for x in IT:
            k = x['k']; assert k in nxt, k
            out.append((x, f"{k}#{nxt[k]}")); nxt[k] += 1
        _KEYS = out
    return _KEYS


def fig_keys():
    """Tên hình -> khóa câu."""
    d = {}
    for x, key in keys():
        if x['f']:
            assert x['f'] not in d, x['f']
            d[x['f']] = key
    return d


def item_js(x):
    d = {'t': x['t']}
    if x['t'] != 'tf': d['m'] = x['m']
    d['q'] = x['q']
    if x['t'] == 'mc': d['o'] = x['o']; d['a'] = x['a']
    elif x['t'] == 'sa': d['a'] = x['a']; d['r'] = x['r']
    else: d['s'] = x['s']
    if x['tt']: d['tt'] = 1
    if x['src']: d['src'] = f"{SRC[x['src'][0]]}, câu {x['src'][1]}"
    return d


def last_line(x):
    if x['t'] == 'mc': return 'Đáp án: ' + x['o'][x['a']]
    if x['t'] == 'sa': return 'Đáp án: ' + x['a']
    return 'Kết luận: ' + ', '.join('abcd'[i] + ' ' + ('Đúng' if s[1] else 'Sai') for i, s in enumerate(x['s'])) + '.'


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    js, lines = {}, {'10': [], '11': [], '12': []}
    for x, key in keys():
        js.setdefault(x['k'], []).append(item_js(x))
        sol = [f'# {key}', 'h ' + x['h']] + ['y ' + y for y in x['y']] + ['b ' + b for b in x['b']] + ['b ' + last_line(x), '']
        lines[x['k'].split('-')[0]].append('\n'.join(sol))
    for g in lines:
        (HERE / f'{g}f_bosung.txt').write_text('\n'.join(lines[g]), encoding='utf-8')
    body = ',\n'.join(f'  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}' for k, v in js.items())
    (ROOT / 'bosung.js').write_text(f'''// Tệp sinh tự động từ content/bosung_nguon.py. Sửa nội dung ở tệp nguồn đó.
// Đợt bài tập bổ sung có hình minh họa (hình ở hinh_bosung.js). Câu tự soạn; "src" ghi đề gợi ý dạng bài.
// Nạp SAU chuong.js: khóa câu là <mã bài>#<chỉ số sau khi đã nối các tệp trước>.
window.KHKT_EX_BS = {{
{body}
}};
(function(){{ const add = window.KHKT_EX_ADD = window.KHKT_EX_ADD || {{}};
  Object.entries(window.KHKT_EX_BS).forEach(([id, a]) => {{ (add[id] = add[id] || []).push(...a); }}); }})();
''', encoding='utf-8')
    from collections import Counter
    n_fig = sum(1 for x in IT if x['f'])
    print('ok', len(IT), 'câu |', 'có hình', n_fig, '| có nguồn', sum(1 for x in IT if x['src']))
    print(' theo lớp:', dict(Counter(x['k'].split('-')[0] for x in IT)))
    print(' theo kiểu:', dict(Counter(x['t'] for x in IT)))
    print(' theo mức:', dict(Counter(x.get('m', 'tf') for x in IT)))


if __name__ == '__main__':
    main()
