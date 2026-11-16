# Nguồn câu bổ sung để mỗi chương (bộ Kết nối tri thức) đủ dựng một đề theo đúng khung đề thi THPT:
#   Phần I: 12 câu nhiều lựa chọn (8 Nhận biết, 4 Thông hiểu); Phần II: 4 câu đúng/sai (ý a Nhận biết,
#   ý b, c Thông hiểu, ý d Vận dụng); Phần III: 6 câu trả lời ngắn mức Vận dụng.
# Câu tự soạn. Chạy: py -I content/chuong_nguon.py (từ D:\KHKT), rồi build.py.
# Sinh ra chuong.js (nối vào KHKT_EX_ADD sau thucte.js) và content/1xe_chuong.txt.
import json, pathlib, subprocess, sys
from math import comb, sqrt, cos, tan, radians, isclose
sys.stdout.reconfigure(encoding="utf-8")
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent / "web"
IT = []

def mc(k, m, q, o, a, h, y, b, g='', chk=True):
    assert chk, (k, q)
    IT.append(dict(k=k, t='mc', m=m, q=q, o=o, a=a, h=h, y=y, b=b, g=g))

def tf(k, q, s, h, y, b, chk=None):
    if chk is not None:
        assert [x[1] for x in s] == chk, (k, q, chk)
    IT.append(dict(k=k, t='tf', q=q, s=s, h=h, y=y, b=b))

def sa(k, q, a, r, h, y, b, v, nd):
    got = f"{v:.{nd}f}".replace('.', ',')
    assert got == a, (k, v, got, a)
    IT.append(dict(k=k, t='sa', m='V', q=q, a=a, r=r, h=h, y=y, b=b))

R0, R1, R2 = 'Làm tròn đến hàng đơn vị', 'Làm tròn đến hàng phần mười', 'Làm tròn đến hàng phần trăm'
def solve3(A, B):
    # Giải hệ 3×3 bằng quy tắc Cramer (để kiểm tra đáp án).
    det = lambda M: (M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1]) - M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0]) + M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]))
    D = det(A); assert D
    return [det([[B[r] if c == j else A[r][c] for c in range(3)] for r in range(3)])/D for j in range(3)]

# ===================== Lớp 10 =====================
# --- Chương II. Bất phương trình, hệ bất phương trình bậc nhất hai ẩn
mc('10-II-3', 'N', 'Miền nghiệm của bất phương trình x − 2y ≥ 4 là nửa mặt phẳng có bờ là đường thẳng', ['x − 2y = 4', 'x + 2y = 4', 'x − 2y = 0', '2x − y = 4'], 0,
   'Bờ của miền nghiệm ax + by ≥ c là đường thẳng ax + by = c.', ['Miền nghiệm của bất phương trình bậc nhất hai ẩn là nửa mặt phẳng có bờ ax + by = c.'], ['Thay dấu ≥ bằng dấu = được đường bờ x − 2y = 4.'])
mc('10-II-3', 'N', 'Điểm nào sau đây thuộc miền nghiệm của bất phương trình 3x + y < 6?', ['(2; 1)', '(0; 6)', '(1; 2)', '(3; 0)'], 2,
   'Thay tọa độ từng điểm vào vế trái, kiểm tra có nhỏ hơn 6 không.', ['Điểm M(x₀; y₀) thuộc miền nghiệm khi tọa độ thỏa mãn bất phương trình.'], ['(2; 1): 7; (0; 6): 6; (1; 2): 5 < 6; (3; 0): 9.', 'Chỉ (1; 2) thỏa mãn.'],
   chk=3*1 + 2 < 6 and not 3*2 + 1 < 6 and not 6 < 6 and not 9 < 6)
mc('10-II-3', 'N', 'Bất phương trình nào sau đây nhận (0; 0) là một nghiệm?', ['2x − y > 1', 'x + 3y ≥ 2', 'x − y < 3', '−x + 2y > 0'], 2,
   'Thay x = 0, y = 0 vào từng bất phương trình.', ['(0; 0) là nghiệm khi 0 thỏa mãn bất đẳng thức với hằng số ở vế phải.'], ['0 > 1 sai; 0 ≥ 2 sai; 0 < 3 đúng; 0 > 0 sai.'])
mc('10-II-4', 'N', 'Hệ nào sau đây là hệ bất phương trình bậc nhất hai ẩn?', ['x² + y ≤ 1 và x ≥ 0', 'x + y ≤ 3 và x − y > 1', 'xy > 2 và x + y < 5', 'x + y ≤ 3 và y ≥ x³'], 1,
   'Mỗi bất phương trình trong hệ phải là bậc nhất đối với x và y.', ['Bất phương trình bậc nhất hai ẩn có dạng ax + by < c (hoặc ≤, >, ≥).'], ['Các hệ còn lại chứa x², xy hoặc x³.', 'Chỉ hệ x + y ≤ 3, x − y > 1 gồm hai bất phương trình bậc nhất.'])
mc('10-II-4', 'N', 'Điểm nào sau đây thuộc miền nghiệm của hệ x ≥ 0, y ≥ 0, x + y ≤ 4?', ['(1; 2)', '(−1; 2)', '(3; 2)', '(2; −1)'], 0,
   'Kiểm tra điểm thỏa mãn đồng thời cả ba bất phương trình.', ['Điểm thuộc miền nghiệm của hệ khi thỏa mãn mọi bất phương trình của hệ.'], ['(−1; 2) và (2; −1) có tọa độ âm; (3; 2) có x + y = 5 > 4.', '(1; 2) thỏa mãn cả ba.'])
mc('10-II-4', 'T', 'Giá trị lớn nhất của F = 2x + y trên miền nghiệm của hệ x ≥ 0, y ≥ 0, x + y ≤ 3, x ≤ 2 là', ['5', '6', '4', '3'], 0,
   'Xác định các đỉnh của miền nghiệm rồi tính F tại các đỉnh.', ['Giá trị lớn nhất của F = ax + by trên miền đa giác đạt tại một đỉnh.'], ['Các đỉnh: (0; 0), (2; 0), (2; 1), (0; 3).', 'F lần lượt bằng 0, 4, 5, 3. Lớn nhất là 5.'],
   chk=max(2*x + y for x, y in [(0, 0), (2, 0), (2, 1), (0, 3)]) == 5)
mc('10-II-4', 'T', 'Miền nghiệm của hệ x ≥ 0, y ≥ 0, 2x + y ≤ 4 là một tam giác có diện tích bằng', ['8', '4', '2', '6'], 1,
   'Tìm ba đỉnh của tam giác rồi tính diện tích tam giác vuông.', ['Đường 2x + y = 4 cắt các trục tại (2; 0) và (0; 4).'], ['Tam giác vuông tại O với hai cạnh góc vuông 2 và 4.', 'Diện tích: (1/2)·2·4 = 4.'])
tf('10-II-3', 'Cho bất phương trình 2x − 3y ≤ 6.',
   [['(0; 0) là một nghiệm của bất phương trình.', True], ['Điểm (3; 0) nằm trên đường bờ của miền nghiệm.', True],
    ['Miền nghiệm chứa điểm (6; 1).', False], ['Có đúng 4 cặp số nguyên dương (x; y) với x ≤ 3, y ≤ 1 thỏa mãn bất phương trình.', False]],
   'Thay tọa độ vào vế trái và so sánh với 6; đếm các cặp nguyên dương thỏa mãn.', ['Điểm nằm trên bờ khi 2x − 3y = 6.'],
   ['a) 0 ≤ 6: đúng.', 'b) 2·3 − 0 = 6: đúng.', 'c) 12 − 3 = 9 > 6: sai.', 'd) y = 1, x ∈ {1; 2; 3}: 2x − 3 ≤ 6 luôn đúng, chỉ có 3 cặp: sai.'],
   chk=[0 <= 6, 2*3 == 6, 12 - 3 <= 6, sum(1 for x in range(1, 4) for y in range(1, 2) if 2*x - 3*y <= 6) == 4])
tf('10-II-4', 'Một tiệm làm x mẻ bánh A và y mẻ bánh B mỗi ngày (x, y ≥ 0). Mỗi mẻ A cần 1 kg bột và 2 giờ nướng, mỗi mẻ B cần 2 kg bột và 1 giờ nướng; tiệm có tối đa 10 kg bột và 12 giờ nướng. Mỗi mẻ A lãi 300 nghìn đồng, mỗi mẻ B lãi 400 nghìn đồng.',
   [['Cặp (2; 3) thỏa mãn các điều kiện của bài toán.', True], ['Miền nghiệm có một đỉnh là (4; 3).', False],
    ['Miền nghiệm của hệ là một tứ giác.', True], ['Nếu số mẻ là số nguyên thì tiền lãi lớn nhất mỗi ngày là 2,4 triệu đồng.', True]],
   'Lập hệ x + 2y ≤ 10, 2x + y ≤ 12, x, y ≥ 0; tìm đỉnh, rồi xét các điểm nguyên gần đỉnh tối ưu.', ['Giá trị lớn nhất của F trên miền đa giác đạt tại đỉnh; với nghiệm nguyên phải xét các điểm nguyên trong miền.'],
   ['a) 2 + 6 = 8 ≤ 10, 4 + 3 = 7 ≤ 12: đúng.', 'b) Giao của x + 2y = 10 và 2x + y = 12 là (14/3; 8/3), không phải (4; 3): sai.',
    'c) Đỉnh: (0; 0), (6; 0), (14/3; 8/3), (0; 5): tứ giác, đúng.', 'd) Các điểm nguyên: F(4; 3) = 1200 + 1200 = 2400 nghìn đồng là lớn nhất: đúng.'],
   chk=[2 + 6 <= 10 and 4 + 3 <= 12, 4 + 6 == 10 and 8 + 3 == 12, True,
        max(300*x + 400*y for x in range(13) for y in range(13) if x + 2*y <= 10 and 2*x + y <= 12) == 2400])

# --- Chương III. Hệ thức lượng trong tam giác
mc('10-III-5', 'N', 'Giá trị cos 120° bằng', ['1/2', '−1/2', '−√3/2', '√3/2'], 1,
   'Dùng công thức góc bù: cos(180° − α) = −cos α.', ['cos(180° − α) = −cos α; cos 60° = 1/2.'], ['cos 120° = −cos 60° = −1/2.'], chk=isclose(cos(radians(120)), -0.5))
mc('10-III-5', 'N', 'Với 0° < α < 180°, khẳng định nào sau đây đúng?', ['cos(180° − α) = cos α', 'tan(180° − α) = tan α (α ≠ 90°)', 'sin(180° − α) = sin α', 'sin(180° − α) = −sin α'], 2,
   'Nhớ cặp góc bù: sin bằng nhau, cos và tan đối nhau.', ['Hai góc bù nhau có sin bằng nhau, côsin đối nhau.'], ['sin(180° − α) = sin α.'])
mc('10-III-6', 'N', 'Trong tam giác ABC với BC = a, CA = b, AB = c, theo định lí côsin, a² bằng', ['b² + c² + 2bc·cos A', 'b² + c² − 2bc·cos A', 'b² + c² − bc·cos A', 'b² − c² − 2bc·cos A'], 1,
   'Nhớ định lí côsin cho cạnh đối diện góc A.', ['a² = b² + c² − 2bc·cos A.'], ['Đáp án là b² + c² − 2bc·cos A.'])
mc('10-III-6', 'N', 'Diện tích tam giác ABC (BC = a, CA = b) bằng', ['(1/2)·ab·cos C', 'ab·sin C', '(1/2)·ab·sin C', '(1/2)·a·b'], 2,
   'Công thức diện tích theo hai cạnh và góc xen giữa.', ['S = (1/2)·ab·sin C.'], ['Góc C xen giữa hai cạnh a và b nên S = (1/2)ab·sin C.'])
mc('10-III-6', 'N', 'Trong tam giác ABC có R là bán kính đường tròn ngoại tiếp. Tỉ số a/sin A bằng', ['R', '2R', 'R/2', '4R'], 1,
   'Nhớ định lí sin.', ['a/sin A = b/sin B = c/sin C = 2R.'], ['a/sin A = 2R.'])
mc('10-III-6', 'T', 'Tam giác ABC có AC = 5, AB = 8 và góc A = 60°. Độ dài cạnh BC bằng', ['√89', '7', '49', '√129'], 1,
   'Biết hai cạnh và góc xen giữa: dùng định lí côsin.', ['BC² = AB² + AC² − 2·AB·AC·cos A.'], ['BC² = 64 + 25 − 2·8·5·(1/2) = 49.', 'BC = 7.'], chk=isclose(64 + 25 - 80*0.5, 49))
tf('10-III-5', 'Cho góc α thỏa mãn 90° < α < 180° và sin α = 4/5.',
   [['cos α < 0.', True], ['cos α = −3/5.', True], ['tan α = 4/3.', False], ['sin α + cos α + tan α = −17/15.', True]],
   'Dùng sin²α + cos²α = 1 và dấu của cos α với góc tù.', ['Góc tù có cos α < 0, tan α < 0.', 'tan α = sin α/cos α.'],
   ['a) Góc tù nên cos α < 0: đúng.', 'b) cos²α = 1 − 16/25 = 9/25, cos α = −3/5: đúng.', 'c) tan α = (4/5)/(−3/5) = −4/3: sai.', 'd) 4/5 − 3/5 − 4/3 = 1/5 − 4/3 = −17/15: đúng.'],
   chk=[True, True, False, isclose(0.8 - 0.6 - 4/3, -17/15)])
tf('10-III-6', 'Cho tam giác ABC có AB = 6, AC = 10 và góc A = 120°.',
   [['BC = 14.', True], ['Diện tích tam giác ABC bằng 15√3.', True], ['Bán kính đường tròn ngoại tiếp tam giác bằng 7.', False], ['Đường cao kẻ từ A dài hơn 4.', False]],
   'Tính BC bằng định lí côsin, diện tích bằng công thức sin, rồi suy ra R và đường cao.', ['a² = b² + c² − 2bc·cos A; S = (1/2)bc·sin A; a = 2R·sin A; h = 2S/a.'],
   ['a) BC² = 36 + 100 + 60 = 196, BC = 14: đúng.', 'b) S = (1/2)·6·10·(√3/2) = 15√3: đúng.', 'c) R = 14/(2·sin 120°) = 14/√3 ≈ 8,08: sai.', 'd) h = 30√3/14 ≈ 3,71 < 4: sai.'],
   chk=[isclose(36 + 100 + 60, 196), True, isclose(14/sqrt(3), 7), 30*sqrt(3)/14 > 4])
sa('10-III-6', 'Hai tàu rời cảng cùng lúc theo hai hướng hợp với nhau góc 70°, tốc độ lần lượt 20 km/h và 30 km/h. Sau 2 giờ hai tàu cách nhau bao nhiêu kilômét?', '59,7', R1,
   'Quãng đường hai tàu là hai cạnh, góc giữa hai hướng là góc xen giữa: dùng định lí côsin.', ['c² = a² + b² − 2ab·cos C.'],
   ['Sau 2 giờ: 40 km và 60 km.', 'd² = 1600 + 3600 − 2·40·60·cos 70° ≈ 3558,3 ⇒ d ≈ 59,65 km.'], sqrt(1600 + 3600 - 4800*cos(radians(70))), 1)
sa('10-III-6', 'Từ sân thượng tòa nhà cao 30 m, một người nhìn đỉnh cột ăng-ten với góc nâng 40° và nhìn chân cột (cùng mặt đất với chân tòa nhà) với góc hạ 25°. Cột ăng-ten cao bao nhiêu mét?', '84', R0,
   'Tính khoảng cách nằm ngang từ góc hạ, rồi tính phần cột cao hơn tầm mắt từ góc nâng.', ['Trong tam giác vuông: cạnh đối = cạnh kề·tan góc.'],
   ['Khoảng cách ngang: d = 30/tan 25° ≈ 64,34 m.', 'Phần cột cao hơn tầm mắt: d·tan 40° ≈ 53,98 m.', 'Chiều cao cột ≈ 30 + 53,98 ≈ 83,98 m.'],
   30 + 30/tan(radians(25))*tan(radians(40)), 0)

# --- Chương VI. Hàm số, đồ thị và ứng dụng
mc('10-VI-16', 'N', 'Đồ thị hàm số y = x² − 4x + 3 có trục đối xứng là đường thẳng', ['x = −2', 'y = 2', 'x = 2', 'x = 4'], 2,
   'Trục đối xứng của parabol y = ax² + bx + c là x = −b/(2a).', ['Trục đối xứng: x = −b/(2a).'], ['x = 4/2 = 2.'])

# --- Chương VII. Phương pháp tọa độ trong mặt phẳng
mc('10-VII-19', 'N', 'Đường thẳng 2x − 3y + 5 = 0 có một vectơ pháp tuyến là', ['(3; 2)', '(2; −3)', '(−3; 2)', '(2; 3)'], 1,
   'Hệ số của x và y là tọa độ một vectơ pháp tuyến.', ['ax + by + c = 0 có vectơ pháp tuyến n = (a; b).'], ['n = (2; −3).'])
mc('10-VII-21', 'N', 'Đường tròn (x − 1)² + (y + 2)² = 9 có tâm I và bán kính R là', ['I(−1; 2), R = 3', 'I(1; −2), R = 9', 'I(1; −2), R = 3', 'I(−1; 2), R = 9'], 2,
   'So sánh với dạng (x − a)² + (y − b)² = R².', ['Tâm I(a; b), bán kính R.'], ['a = 1, b = −2, R² = 9 nên R = 3.'])
mc('10-VII-22', 'N', 'Elip x²/25 + y²/9 = 1 có độ dài trục lớn bằng', ['5', '6', '25', '10'], 3,
   'Elip x²/a² + y²/b² = 1 (a > b > 0) có trục lớn 2a.', ['Độ dài trục lớn 2a, trục nhỏ 2b.'], ['a = 5 nên trục lớn dài 10.'])
tf('10-VII-21', 'Cho đường tròn (C): x² + y² − 4x + 2y − 4 = 0.',
   [['(C) có tâm I(2; −1).', True], ['(C) có bán kính bằng 3.', True], ['Điểm A(5; −1) nằm trên (C).', True], ['Đường thẳng 3x + 4y + 8 = 0 tiếp xúc với (C).', False]],
   'Đưa về dạng chính tắc để đọc tâm, bán kính; so sánh khoảng cách từ tâm đến đường thẳng với bán kính.', ['x² + y² − 2ax − 2by + c = 0 có tâm (a; b), R² = a² + b² − c.', 'Tiếp xúc ⇔ d(I, Δ) = R.'],
   ['a) a = 2, b = −1: đúng.', 'b) R² = 4 + 1 + 4 = 9: đúng.', 'c) (5 − 2)² + 0² = 9: đúng.', 'd) d = |6 − 4 + 8|/5 = 2 < 3 nên cắt, không tiếp xúc: sai.'],
   chk=[True, 4 + 1 + 4 == 9, (5 - 2)**2 == 9, abs(6 - 4 + 8)/5 == 3])

# --- Chương VIII. Đại số tổ hợp
mc('10-VIII-24', 'N', 'Số hoán vị của 5 phần tử là', ['25', '60', '120', '24'], 2,
   'Số hoán vị của n phần tử là n!.', ['Pₙ = n!.'], ['5! = 120.'], chk=1*2*3*4*5 == 120)
mc('10-VIII-25', 'N', 'Khai triển (a + b)⁴ có bao nhiêu số hạng?', ['4', '5', '6', '8'], 1,
   'Khai triển (a + b)ⁿ có n + 1 số hạng.', ['Công thức nhị thức Newton với n = 4.'], ['4 + 1 = 5 số hạng.'])
mc('10-VIII-24', 'T', 'Số cách chọn 3 học sinh từ 10 học sinh để đi trực nhật (không phân biệt vai trò) là', ['720', '30', '1000', '120'], 3,
   'Chọn không phân biệt thứ tự: dùng tổ hợp.', ['C(n, k) = n!/(k!(n − k)!).'], ['C(10, 3) = 120.'], chk=comb(10, 3) == 120)
tf('10-VIII-24', 'Một lớp có 15 bạn nam và 10 bạn nữ.',
   [['Có 25 cách chọn một bạn làm lớp trưởng.', True], ['Có 150 cách chọn một bạn nam và một bạn nữ.', True],
    ['Có 300 cách chọn một lớp trưởng và một lớp phó.', False], ['Có 1725 cách chọn 3 bạn có cả nam và nữ.', True]],
   'Dùng quy tắc cộng, quy tắc nhân, chỉnh hợp (có thứ tự) và phần bù cho tổ hợp.', ['Chọn có phân biệt vai trò: A(n, k); không phân biệt: C(n, k).'],
   ['a) 15 + 10 = 25: đúng.', 'b) 15·10 = 150: đúng.', 'c) A(25, 2) = 600: sai.', 'd) C(25, 3) − C(15, 3) − C(10, 3) = 2300 − 455 − 120 = 1725: đúng.'],
   chk=[True, 15*10 == 150, 25*24 == 300, comb(25, 3) - comb(15, 3) - comb(10, 3) == 1725])

# --- Chương IX. Tính xác suất theo định nghĩa cổ điển
mc('10-IX-26', 'N', 'Gieo một con xúc xắc cân đối một lần. Số phần tử của không gian mẫu là', ['36', '6', '12', '1'], 1,
   'Liệt kê các kết quả có thể.', ['Không gian mẫu Ω là tập mọi kết quả có thể.'], ['Ω = {1; 2; 3; 4; 5; 6}, có 6 phần tử.'])
mc('10-IX-26', 'N', 'Xác suất của biến cố đối Ā của biến cố A bằng', ['P(A) − 1', '1 + P(A)', '1 − P(A)', '1/P(A)'], 2,
   'Hai biến cố đối có tổng xác suất bằng 1.', ['P(A) + P(Ā) = 1.'], ['P(Ā) = 1 − P(A).'])
mc('10-IX-27', 'N', 'Gieo hai đồng xu cân đối. Xác suất cả hai đồng xu xuất hiện mặt sấp là', ['1/2', '3/4', '1/3', '1/4'], 3,
   'Đếm số kết quả của không gian mẫu và số kết quả thuận lợi.', ['P(A) = n(A)/n(Ω).'], ['Ω = {SS; SN; NS; NN}, chỉ SS thuận lợi.', 'P = 1/4.'])
mc('10-IX-26', 'N', 'Với mọi biến cố A, xác suất P(A) luôn thỏa mãn', ['0 ≤ P(A) ≤ 1', 'P(A) > 0', '0 < P(A) < 1', 'P(A) ≤ 1/2'], 0,
   'Nhớ tính chất của xác suất.', ['P(∅) = 0, P(Ω) = 1, 0 ≤ P(A) ≤ 1.'], ['0 ≤ P(A) ≤ 1.'])
mc('10-IX-27', 'T', 'Một hộp có 4 bi đỏ và 6 bi xanh. Lấy ngẫu nhiên đồng thời 2 bi. Xác suất lấy được 2 bi đỏ là', ['4/25', '2/15', '2/5', '1/15'], 1,
   'Đếm bằng tổ hợp.', ['P = C(4, 2)/C(10, 2).'], ['C(4, 2) = 6, C(10, 2) = 45.', 'P = 6/45 = 2/15.'], chk=isclose(comb(4, 2)/comb(10, 2), 2/15))
tf('10-IX-26', 'Gieo một con xúc xắc cân đối hai lần.',
   [['Không gian mẫu có 36 phần tử.', True], ['Xác suất tổng số chấm bằng 7 là 1/6.', True],
    ['Xác suất tổng số chấm lớn hơn 9 là 1/6.', True], ['Xác suất có ít nhất một lần ra mặt 6 chấm là 1/3.', False]],
   'Liệt kê các cặp (i; j) thuận lợi; dùng biến cố đối cho "ít nhất một lần".', ['P(A) = n(A)/36; P(A) = 1 − P(Ā).'],
   ['a) 6·6 = 36: đúng.', 'b) 6 cặp có tổng 7: P = 6/36: đúng.', 'c) Tổng 10, 11, 12 có 3 + 2 + 1 = 6 cặp: đúng.', 'd) 1 − 25/36 = 11/36 ≠ 1/3: sai.'],
   chk=[True, sum(1 for i in range(1, 7) for j in range(1, 7) if i + j == 7) == 6, sum(1 for i in range(1, 7) for j in range(1, 7) if i + j > 9) == 6, isclose(11/36, 1/3)])
tf('10-IX-27', 'Một hộp có 10 thẻ đánh số từ 1 đến 10. Rút ngẫu nhiên đồng thời 3 thẻ.',
   [['Không gian mẫu có 120 phần tử.', True], ['Xác suất ba thẻ đều mang số chẵn là 1/12.', True],
    ['Xác suất tổng ba số trên thẻ là số lẻ lớn hơn 1/2.', False], ['Xác suất trong ba thẻ có thẻ số 10 là 0,3.', True]],
   'Đếm theo tính chẵn lẻ của các thẻ được chọn.', ['Tổng ba số lẻ khi có 1 hoặc 3 số lẻ.'],
   ['a) C(10, 3) = 120: đúng.', 'b) C(5, 3)/120 = 10/120 = 1/12: đúng.', 'c) C(5, 3) + 5·C(5, 2) = 60, P = 1/2, không lớn hơn 1/2: sai.', 'd) C(9, 2)/120 = 36/120 = 0,3: đúng.'],
   chk=[comb(10, 3) == 120, isclose(comb(5, 3)/120, 1/12), (comb(5, 3) + 5*comb(5, 2))/120 > 0.5, isclose(comb(9, 2)/120, 0.3)])

# --- Chuyên đề: Hệ phương trình bậc nhất ba ẩn
mc('10-CD-1', 'N', 'Hệ nào sau đây là hệ ba phương trình bậc nhất ba ẩn?', ['x² + y + z = 1; x − y = 2; z = 3', 'x + y + z = 1; 2x − y = 3; x + 3z = 0', 'xy + z = 2; x − z = 1; y = 4', 'x + y = 1; x − y = 2'], 1,
   'Mỗi phương trình phải là bậc nhất đối với x, y, z và hệ có 3 phương trình.', ['Phương trình bậc nhất ba ẩn: ax + by + cz = d (a, b, c không đồng thời bằng 0).'], ['Chỉ hệ thứ hai gồm 3 phương trình bậc nhất ba ẩn.'])
mc('10-CD-1', 'N', 'Bộ số nào là nghiệm của hệ x + y + z = 6, x − y = −1, z = 3?', ['(2; 1; 3)', '(3; 2; 1)', '(1; 2; 3)', '(1; 3; 2)'], 2,
   'Thay z = 3 rồi giải hệ hai ẩn còn lại.', ['Phép thế.'], ['z = 3 ⇒ x + y = 3, x − y = −1 ⇒ x = 1, y = 2.'], chk=1 + 2 + 3 == 6 and 1 - 2 == -1)
mc('10-CD-1', 'N', 'Nghiệm của hệ dạng tam giác x + y + z = 4, y + z = 3, z = 1 là', ['(2; 1; 1)', '(1; 1; 2)', '(0; 3; 1)', '(1; 2; 1)'], 3,
   'Giải ngược từ phương trình cuối lên.', ['Hệ dạng tam giác: tìm z, rồi y, rồi x.'], ['z = 1, y = 2, x = 4 − 3 = 1.'])
mc('10-CD-1', 'N', 'Phương pháp Gauss giải hệ phương trình bậc nhất ba ẩn là', ['Đưa hệ về dạng tam giác bằng cách khử dần ẩn', 'Bình phương hai vế các phương trình', 'Đặt ẩn phụ t = x + y + z', 'Vẽ đồ thị các phương trình'], 0,
   'Nhớ ý tưởng của phương pháp Gauss.', ['Khử dần ẩn để được hệ tam giác tương đương.'], ['Đưa hệ về dạng tam giác bằng cách khử dần ẩn.'])
mc('10-CD-1', 'N', 'Bộ số (1; −1; 2) là nghiệm của phương trình nào sau đây?', ['x + y + z = 3', 'x − y + z = 2', '2x + y + z = 3', '3x + y − z = 1'], 2,
   'Thay x = 1, y = −1, z = 2 vào từng phương trình.', ['Bộ số là nghiệm khi thay vào được đẳng thức đúng.'], ['Các vế trái lần lượt bằng 2, 4, 3, 0; chỉ 2x + y + z = 3 đúng.'], chk=2 - 1 + 2 == 3)
mc('10-CD-1', 'N', 'Khi biến đổi hệ ba phương trình bậc nhất ba ẩn, nếu xuất hiện phương trình 0x + 0y + 0z = 5 thì hệ', ['có vô số nghiệm', 'có nghiệm duy nhất', 'vô nghiệm', 'có đúng hai nghiệm'], 2,
   'Phương trình 0 = 5 không có nghiệm.', ['Hệ tương đương chứa phương trình vô nghiệm thì vô nghiệm.'], ['0 = 5 vô lí nên hệ vô nghiệm.'])
mc('10-CD-1', 'T', 'Nghiệm của hệ x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2 là', ['(3; 2; 1)', '(1; 2; 3)', '(2; 1; 3)', '(1; 3; 2)'], 1,
   'Khử dần ẩn bằng phương pháp Gauss.', ['Cộng, trừ các phương trình để khử ẩn.'], ['Cộng phương trình 1 và 3: 2x + 3y = 8; cộng 2 và 3: 3x + y = 5.', 'Giải: x = 1, y = 2, z = 3.'],
   chk=solve3([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [6, 3, 2]) == [1, 2, 3])
mc('10-CD-1', 'T', 'Mua 2 kg táo, 1 kg cam, 1 kg lê hết 110 nghìn đồng; 1 kg táo, 2 kg cam, 1 kg lê hết 105 nghìn đồng; mỗi loại 1 kg hết 80 nghìn đồng. Giá 1 kg táo là', ['25 nghìn đồng', '35 nghìn đồng', '40 nghìn đồng', '30 nghìn đồng'], 3,
   'Gọi giá ba loại là t, c, l; lập hệ ba phương trình rồi trừ vế để khử nhanh.', ['Trừ hai phương trình có cùng hệ số để khử ẩn.'], ['(2t + c + l) − (t + c + l) = 110 − 80 ⇒ t = 30.'],
   chk=solve3([[2, 1, 1], [1, 2, 1], [1, 1, 1]], [110, 105, 80])[0] == 30)
mc('10-CD-1', 'T', 'Hệ phương trình x + y + z = 3, x + y + z = 5, x − y = 0', ['có nghiệm duy nhất', 'vô nghiệm', 'có vô số nghiệm', 'có nghiệm (1; 1; 1)'], 1,
   'Hai phương trình đầu mâu thuẫn nhau.', ['Trừ hai phương trình được 0 = 2.'], ['Trừ phương trình 2 cho phương trình 1: 0 = 2, vô lí.', 'Hệ vô nghiệm.'])
tf('10-CD-1', 'Cho hệ phương trình x + y + z = 2, x − y + 2z = 6, 2x + y − z = −1.',
   [['(1; −1; 2) là một nghiệm của hệ.', True], ['Hệ có nghiệm duy nhất.', True], ['Với (x; y; z) là nghiệm của hệ, xyz = 2.', False], ['Với (x; y; z) là nghiệm của hệ, x² + y² + z² = 6.', True]],
   'Kiểm tra bộ số bằng cách thay vào, giải hệ bằng phương pháp Gauss để biết nghiệm duy nhất.', ['Hệ có nghiệm duy nhất khi khử được về dạng tam giác với hệ số chéo khác 0.'],
   ['a) 1 − 1 + 2 = 2; 1 + 1 + 4 = 6; 2 − 1 − 2 = −1: đúng.', 'b) Khử ẩn được hệ tam giác, nghiệm duy nhất (1; −1; 2): đúng.', 'c) xyz = −2: sai.', 'd) 1 + 1 + 4 = 6: đúng.'],
   chk=[True, solve3([[1, 1, 1], [1, -1, 2], [2, 1, -1]], [2, 6, -1]) == [1, -1, 2], 1*(-1)*2 == 2, 1 + 1 + 4 == 6])
tf('10-CD-1', 'Một rạp phim bán ba loại vé A, B, C với giá lần lượt a, b, c (nghìn đồng). Ngày 1 bán 10 vé A, 20 vé B, 30 vé C thu 2200 nghìn đồng; ngày 2 bán 20 vé A, 10 vé B, 20 vé C thu 2000 nghìn đồng; ngày 3 bán 15 vé A, 15 vé B, 10 vé C thu 1650 nghìn đồng.',
   [['10a + 20b + 30c = 2200.', True], ['Giá vé A là 50 nghìn đồng.', True], ['Giá vé C cao hơn giá vé B.', False], ['Ngày 4 bán 12 vé A, 8 vé B, 25 vé C thì thu được 1,7 triệu đồng.', False]],
   'Lập hệ ba phương trình bậc nhất ba ẩn, giải bằng phương pháp Gauss.', ['Chia mỗi phương trình cho ước chung để số nhỏ hơn.'],
   ['a) Viết đúng phương trình ngày 1: đúng.', 'b) Giải hệ được a = 50, b = 40, c = 30: đúng.', 'c) c = 30 < b = 40: sai.', 'd) 600 + 320 + 750 = 1670 nghìn đồng, không phải 1,7 triệu: sai.'],
   chk=[True, solve3([[10, 20, 30], [20, 10, 20], [15, 15, 10]], [2200, 2000, 1650]) == [50, 40, 30], 30 > 40, 12*50 + 8*40 + 25*30 == 1700])
tf('10-CD-1', 'Cho hệ phương trình x + 2y − z = 1, 2x + 4y − 2z = 2, x − y + z = 4.',
   [['Phương trình thứ hai bằng 2 lần phương trình thứ nhất.', True], ['Hệ có nghiệm duy nhất.', False], ['(2; 1; 3) là một nghiệm của hệ.', True], ['Hệ có vô số nghiệm.', True]],
   'Nhận ra hai phương trình tương đương nên hệ chỉ còn 2 phương trình độc lập cho 3 ẩn.', ['Hệ có ít phương trình độc lập hơn số ẩn và có nghiệm thì có vô số nghiệm.'],
   ['a) Nhân phương trình 1 với 2 được phương trình 2: đúng.', 'b) Chỉ còn 2 phương trình độc lập: không có nghiệm duy nhất, sai.', 'c) 2 + 2 − 3 = 1; 2 − 1 + 3 = 4: đúng.', 'd) Có nghiệm và còn một ẩn tự do: vô số nghiệm, đúng.'],
   chk=[True, False, 2 + 2 - 3 == 1 and 2 - 1 + 3 == 4, True])
sa('10-CD-1', 'Một quán bán trà sữa, cà phê và nước ép với giá x, y, z (nghìn đồng/ly). Ngày 1 bán 20, 30, 10 ly thu 1750 nghìn đồng; ngày 2 bán 25, 20, 15 ly thu 1850 nghìn đồng; ngày 3 bán 10, 40, 20 ly thu 2100 nghìn đồng. Giá một ly nước ép là bao nhiêu nghìn đồng?', '40', '',
   'Lập hệ ba phương trình bậc nhất ba ẩn rồi giải bằng phương pháp Gauss.', ['Khử dần ẩn để đưa về hệ tam giác.'],
   ['20x + 30y + 10z = 1750; 25x + 20y + 15z = 1850; 10x + 40y + 20z = 2100.', 'Giải hệ được x = 30, y = 25, z = 40.'],
   solve3([[20, 30, 10], [25, 20, 15], [10, 40, 20]], [1750, 1850, 2100])[2], 0)
sa('10-CD-1', 'Quỹ đạo một quả bóng là parabol y = ax² + bx + c (đơn vị mét) đi qua các điểm (0; 1), (2; 3,4) và (4; 3,8). Độ cao lớn nhất của quả bóng là bao nhiêu mét?', '3,89', R2,
   'Lập hệ ba phương trình theo a, b, c từ ba điểm, giải rồi tìm đỉnh parabol.', ['Đỉnh parabol: x = −b/(2a).'],
   ['c = 1; 4a + 2b = 2,4; 16a + 4b = 2,8 ⇒ a = −0,25, b = 1,7.', 'Đỉnh tại x = 3,4: y = 1 + 1,7·3,4 − 0,25·3,4² = 3,89 m.'],
   1 + 1.7*3.4 - 0.25*3.4**2, 2)

# ===================== Lớp 11 =====================
mc('11-II-5', 'N', 'Cho dãy số uₙ = 2n + 1. Số hạng u₃ bằng', ['5', '9', '7', '6'], 2, 'Thay n = 3 vào công thức số hạng tổng quát.', ['uₙ cho bởi công thức theo n.'], ['u₃ = 2·3 + 1 = 7.'])
mc('11-II-6', 'N', 'Dãy số nào sau đây là cấp số cộng?', ['1; 2; 4; 8', '1; 3; 6; 10', '2; 4; 8; 16', '1; 4; 7; 10'], 3, 'Kiểm tra hiệu hai số hạng liên tiếp có không đổi.', ['Cấp số cộng: uₙ₊₁ − uₙ = d không đổi.'], ['1; 4; 7; 10 có hiệu không đổi bằng 3.'])
mc('11-II-7', 'N', 'Cấp số nhân (uₙ) có u₁ = 3 và công bội q = 2. Số hạng u₄ bằng', ['12', '24', '48', '9'], 1, 'Dùng uₙ = u₁·qⁿ⁻¹.', ['uₙ = u₁qⁿ⁻¹.'], ['u₄ = 3·2³ = 24.'])
tf('11-II-6', 'Cho cấp số cộng (uₙ) có u₁ = 2 và công sai d = 3.',
   [['u₂ = 5.', True], ['Số hạng tổng quát uₙ = 3n − 1.', True], ['Tổng 10 số hạng đầu S₁₀ = 155.', True], ['Số 2026 là một số hạng của cấp số cộng.', False]],
   'Dùng công thức số hạng tổng quát và công thức tổng.', ['uₙ = u₁ + (n − 1)d; Sₙ = n(u₁ + uₙ)/2.'],
   ['a) 2 + 3 = 5: đúng.', 'b) uₙ = 2 + 3(n − 1) = 3n − 1: đúng.', 'c) u₁₀ = 29, S₁₀ = 10·31/2 = 155: đúng.', 'd) 3n − 1 = 2026 ⇒ n = 2027/3 không nguyên: sai.'],
   chk=[True, True, 10*(2 + 29)//2 == 155, 2027 % 3 == 0])
mc('11-III-8', 'N', 'Mẫu số liệu ghép nhóm có các nhóm [10; 20), [20; 30), [30; 40). Độ dài mỗi nhóm bằng', ['20', '10', '30', '40'], 1, 'Độ dài nhóm [a; b) là b − a.', ['Độ dài nhóm: b − a.'], ['20 − 10 = 10.'])
mc('11-III-8', 'N', 'Giá trị đại diện của nhóm [a; b) trong mẫu số liệu ghép nhóm là', ['b − a', '(a + b)/2', 'a', 'b'], 1, 'Giá trị đại diện là trung điểm của nhóm.', ['xᵢ = (a + b)/2.'], ['Giá trị đại diện là (a + b)/2.'])
mc('11-III-9', 'N', 'Số trung bình của mẫu số liệu ghép nhóm (các nhóm có giá trị đại diện xᵢ, tần số mᵢ, cỡ mẫu n) là', ['(x₁ + x₂ + … + xₖ)/k', '(m₁ + m₂ + … + mₖ)/k', '(m₁x₁ + m₂x₂ + … + mₖxₖ)/n', 'xₖ − x₁'], 2, 'Nhớ công thức số trung bình có trọng số.', ['x̄ = Σmᵢxᵢ/n.'], ['x̄ = (m₁x₁ + … + mₖxₖ)/n.'])
mc('11-III-9', 'N', 'Nhóm chứa mốt của mẫu số liệu ghép nhóm là nhóm', ['có tần số lớn nhất', 'đứng giữa bảng', 'có giá trị đại diện lớn nhất', 'đầu tiên'], 0, 'Mốt gắn với tần số lớn nhất.', ['Mốt ở nhóm có tần số lớn nhất.'], ['Nhóm chứa mốt là nhóm có tần số lớn nhất.'])
tf('11-III-9', 'Thời gian đọc sách mỗi ngày (phút) của 40 học sinh: [0; 20): 6; [20; 40): 14; [40; 60): 12; [60; 80): 8.',
   [['Cỡ mẫu bằng 40.', True], ['Số trung bình của mẫu số liệu bằng 42 phút.', False], ['Nhóm chứa mốt là [20; 40).', True], ['Mốt của mẫu số liệu bằng 36 phút.', True]],
   'Dùng giá trị đại diện để tính số trung bình; công thức mốt với nhóm có tần số lớn nhất.', ['x̄ = Σmᵢxᵢ/n; Mₒ = a + (mₖ − mₖ₋₁)/((mₖ − mₖ₋₁) + (mₖ − mₖ₊₁))·h.'],
   ['a) 6 + 14 + 12 + 8 = 40: đúng.', 'b) x̄ = (60 + 420 + 600 + 560)/40 = 41: sai.', 'c) Tần số 14 lớn nhất: đúng.', 'd) Mₒ = 20 + 8/(8 + 2)·20 = 36: đúng.'],
   chk=[True, (60 + 420 + 600 + 560)/40 == 42, True, 20 + 8/10*20 == 36])
tf('11-III-9', 'Cân nặng (kg) của 30 học sinh: [40; 45): 5; [45; 50): 10; [50; 55): 9; [55; 60): 6.',
   [['Nhóm [45; 50) có tần số lớn nhất.', True], ['Có 50% số học sinh nặng từ 50 kg trở lên.', True], ['Số trung bình của mẫu số liệu bằng 50,25 kg.', False], ['Trung vị của mẫu số liệu bằng 50 kg.', True]],
   'Đọc tần số, tính số trung bình bằng giá trị đại diện, trung vị bằng công thức nội suy.', ['Mₑ = a + (n/2 − C)/m·h.'],
   ['a) Tần số 10 lớn nhất: đúng.', 'b) (9 + 6)/30 = 50%: đúng.', 'c) x̄ = (212,5 + 475 + 472,5 + 345)/30 ≈ 50,17: sai.', 'd) n/2 = 15 thuộc nhóm [45; 50): 45 + (15 − 5)/10·5 = 50: đúng.'],
   chk=[True, (9 + 6)/30 == 0.5, isclose((212.5 + 475 + 472.5 + 345)/30, 50.25), 45 + (15 - 5)/10*5 == 50])
sa('11-III-9', 'Doanh thu mỗi ngày (triệu đồng) của một quán trong 30 ngày: [2; 4): 5 ngày; [4; 6): 9 ngày; [6; 8): 12 ngày; [8; 10): 4 ngày. Tính trung vị của mẫu số liệu ghép nhóm.', '6,17', R2,
   'n/2 = 15 rơi vào nhóm [6; 8); áp dụng công thức trung vị.', ['Mₑ = a + (n/2 − C)/m·h, C là tần số tích lũy trước nhóm.'],
   ['Tần số tích lũy: 5, 14, 26, 30 ⇒ nhóm chứa trung vị [6; 8).', 'Mₑ = 6 + (15 − 14)/12·2 ≈ 6,17.'], 6 + 1/12*2, 2)
sa('11-III-9', 'Chiều cao (cm) của 40 cây giống: [30; 40): 6; [40; 50): 12; [50; 60): 15; [60; 70): 7. Tính tứ phân vị thứ ba Q₃.', '58', '',
   '3n/4 = 30 rơi vào nhóm [50; 60); áp dụng công thức tứ phân vị.', ['Q₃ = a + (3n/4 − C)/m·h.'],
   ['Tần số tích lũy: 6, 18, 33, 40 ⇒ Q₃ thuộc [50; 60).', 'Q₃ = 50 + (30 − 18)/15·10 = 58.'], 50 + 12/15*10, 0)
mc('11-V-15', 'N', 'Giới hạn lim (1/n) bằng', ['1', '0', '+∞', 'không tồn tại'], 1, 'Nhớ giới hạn cơ bản.', ['lim 1/n = 0.'], ['lim 1/n = 0.'])
mc('11-V-16', 'N', 'Giới hạn lim (x → 2) (3x + 1) bằng', ['6', '5', '7', '+∞'], 2, 'Hàm đa thức liên tục: thay trực tiếp x = 2.', ['lim (x → x₀) f(x) = f(x₀) với f liên tục.'], ['3·2 + 1 = 7.'])
mc('11-V-17', 'N', 'Hàm số nào sau đây liên tục trên ℝ?', ['y = 1/x', 'y = tan x', 'y = √x', 'y = x³ − 2x + 1'], 3, 'Hàm đa thức liên tục trên ℝ.', ['Đa thức liên tục trên ℝ; phân thức, tan x, √x chỉ liên tục trên tập xác định.'], ['Chỉ y = x³ − 2x + 1 xác định và liên tục trên ℝ.'])
tf('11-V-17', 'Cho hàm số f(x) = (x² − 4)/(x − 2) khi x ≠ 2 và f(2) = m.',
   [['lim (x → 2) f(x) = 4.', True], ['f liên tục tại x = 2 khi m = 4.', True], ['Với m = 3, f liên tục trên ℝ.', False], ['lim (x → +∞) f(x)/x = 1.', True]],
   'Rút gọn f(x) = x + 2 với x ≠ 2, so sánh giới hạn với f(2).', ['f liên tục tại x₀ ⇔ lim f(x) = f(x₀).'],
   ['a) f(x) = x + 2 → 4: đúng.', 'b) Cần m = 4: đúng.', 'c) m = 3 ≠ 4 nên gián đoạn tại 2: sai.', 'd) (x + 2)/x → 1: đúng.'], chk=[True, True, False, True])
mc('11-VIII-28', 'N', 'Hai biến cố A và B xung khắc khi', ['P(A) = P(B)', 'A ∩ B = ∅', 'A ∪ B = Ω', 'P(AB) = P(A)P(B)'], 1, 'Nhớ định nghĩa hai biến cố xung khắc.', ['A, B xung khắc khi không thể cùng xảy ra.'], ['A ∩ B = ∅.'])
mc('11-VIII-29', 'N', 'Nếu A và B là hai biến cố xung khắc thì P(A ∪ B) bằng', ['P(A)·P(B)', 'P(A) + P(B) − 1', 'P(A) + P(B)', 'P(A) − P(B)'], 2, 'Công thức cộng cho biến cố xung khắc.', ['A, B xung khắc: P(A ∪ B) = P(A) + P(B).'], ['P(A ∪ B) = P(A) + P(B).'])
mc('11-VIII-30', 'N', 'A, B là hai biến cố độc lập với P(A) = 0,5 và P(B) = 0,4. Khi đó P(AB) bằng', ['0,9', '0,1', '0,45', '0,2'], 3, 'Công thức nhân cho hai biến cố độc lập.', ['P(AB) = P(A)P(B).'], ['0,5·0,4 = 0,2.'])
mc('11-VIII-29', 'T', 'Cho P(A) = 0,6, P(B) = 0,5 và P(AB) = 0,3. Khi đó P(A ∪ B) bằng', ['0,8', '1,1', '0,3', '0,9'], 0, 'Dùng công thức cộng tổng quát.', ['P(A ∪ B) = P(A) + P(B) − P(AB).'], ['0,6 + 0,5 − 0,3 = 0,8.'], chk=isclose(0.6 + 0.5 - 0.3, 0.8))
tf('11-VIII-30', 'Hai xạ thủ bắn độc lập mỗi người một viên vào bia, xác suất trúng lần lượt là 0,8 và 0,6.',
   [['Xác suất cả hai cùng trúng là 0,48.', True], ['Xác suất cả hai cùng trượt là 0,08.', True], ['Xác suất có đúng một người bắn trúng là 0,4.', False], ['Xác suất bia trúng ít nhất một viên là 0,92.', True]],
   'Dùng quy tắc nhân cho các biến cố độc lập và biến cố đối.', ['P(AB) = P(A)P(B) khi A, B độc lập.'],
   ['a) 0,8·0,6 = 0,48: đúng.', 'b) 0,2·0,4 = 0,08: đúng.', 'c) 0,8·0,4 + 0,2·0,6 = 0,44: sai.', 'd) 1 − 0,08 = 0,92: đúng.'],
   chk=[isclose(0.48, 0.8*0.6), isclose(0.2*0.4, 0.08), isclose(0.8*0.4 + 0.2*0.6, 0.4), isclose(1 - 0.08, 0.92)])
sa('11-VIII-29', 'Lớp 11A có 40 học sinh, trong đó 24 em học thêm tiếng Anh, 15 em học thêm tiếng Nhật và 9 em học cả hai. Chọn ngẫu nhiên một em. Tính xác suất em đó không học thêm ngoại ngữ nào.', '0,25', '',
   'Tính xác suất học ít nhất một ngoại ngữ bằng công thức cộng, rồi lấy phần bù.', ['P(A ∪ B) = P(A) + P(B) − P(AB); P(không) = 1 − P(A ∪ B).'],
   ['Số em học ít nhất một ngoại ngữ: 24 + 15 − 9 = 30.', 'P = 1 − 30/40 = 0,25.'], 1 - 30/40, 2)
mc('11-IX-32', 'N', 'Đạo hàm của hàm số y = x³ là', ['x²', '3x', '3x²', 'x³/3'], 2, 'Công thức (xⁿ)′ = n·xⁿ⁻¹.', ['(xⁿ)′ = nxⁿ⁻¹.'], ['(x³)′ = 3x².'])
mc('11-IX-32', 'N', 'Đạo hàm của hàm số y = sin x là', ['−cos x', 'cos x', 'sin x', '−sin x'], 1, 'Nhớ bảng đạo hàm lượng giác.', ['(sin x)′ = cos x.'], ['y′ = cos x.'])
mc('11-IX-31', 'N', 'Nếu s(t) là quãng đường vật đi được sau thời gian t thì s′(t₀) là', ['gia tốc tức thời tại t₀', 'quãng đường đi được đến t₀', 'vận tốc trung bình', 'vận tốc tức thời tại t₀'], 3, 'Nhớ ý nghĩa vật lí của đạo hàm.', ['v(t₀) = s′(t₀).'], ['s′(t₀) là vận tốc tức thời tại thời điểm t₀.'])
tf('11-IX-33', 'Cho hàm số f(x) = x³ − 3x² + 2.',
   [['f′(x) = 3x² − 6x.', True], ['f′(1) = −3.', True], ['f″(2) = 8.', False], ['Tiếp tuyến của đồ thị tại điểm có hoành độ 1 là y = −3x + 3.', True]],
   'Tính đạo hàm cấp một, cấp hai; tiếp tuyến y = f′(x₀)(x − x₀) + f(x₀).', ['(xⁿ)′ = nxⁿ⁻¹; f″ = (f′)′.'],
   ['a) Đúng theo công thức.', 'b) f′(1) = 3 − 6 = −3: đúng.', 'c) f″(x) = 6x − 6, f″(2) = 6: sai.', 'd) f(1) = 0, y = −3(x − 1) = −3x + 3: đúng.'],
   chk=[True, 3 - 6 == -3, 6*2 - 6 == 8, 1 - 3 + 2 == 0])

# ===================== Lớp 12 =====================
mc('12-I-3', 'N', 'Đồ thị hàm số y = (x + 1)/(x − 3) có tiệm cận đứng là đường thẳng', ['x = −1', 'x = 3', 'y = 1', 'y = 3'], 1, 'Tiệm cận đứng tại nghiệm của mẫu (không là nghiệm của tử).', ['y = (ax + b)/(cx + d) có tiệm cận đứng x = −d/c.'], ['Mẫu bằng 0 khi x = 3, tử khác 0: tiệm cận đứng x = 3.'])
mc('12-II-7', 'N', 'Trong không gian Oxyz, tọa độ của vectơ u = i + 2j − k là', ['(1; −2; 1)', '(2; 1; −1)', '(1; 2; −1)', '(−1; 2; 1)'], 2, 'Hệ số của i, j, k là tọa độ của vectơ.', ['u = xi + yj + zk ⇔ u = (x; y; z).'], ['u = (1; 2; −1).'])
tf('12-II-8', 'Trong không gian Oxyz, cho a = (1; 2; −2), b = (2; 0; 1) và d = (2; 2; 1).',
   [['a + b = (3; 2; −1).', True], ['|a| = 3.', True], ['a·b = 1.', False], ['cos(a, d) = 4/9.', True]],
   'Áp dụng biểu thức tọa độ của tổng, độ dài, tích vô hướng và côsin góc.', ['a·b = x₁x₂ + y₁y₂ + z₁z₂; cos(a, b) = a·b/(|a||b|).'],
   ['a) Cộng từng tọa độ: đúng.', 'b) |a| = √(1 + 4 + 4) = 3: đúng.', 'c) a·b = 2 + 0 − 2 = 0: sai.', 'd) a·d = 2 + 4 − 2 = 4, |d| = 3: cos = 4/9, đúng.'],
   chk=[True, sqrt(9) == 3, 2 + 0 - 2 == 1, isclose(4/(3*3), 4/9)])
mc('12-III-9', 'N', 'Mẫu số liệu ghép nhóm có nhóm đầu tiên [10; 15) và nhóm cuối cùng [30; 35). Khoảng biến thiên của mẫu là', ['20', '25', '35', '10'], 1, 'R = đầu mút phải nhóm cuối − đầu mút trái nhóm đầu.', ['R = aₖ₊₁ − a₁.'], ['R = 35 − 10 = 25.'])
mc('12-III-10', 'N', 'Độ lệch chuẩn của một mẫu số liệu bằng', ['bình phương của phương sai', 'phương sai chia 2', 'căn bậc hai số học của phương sai', 'nghịch đảo của phương sai'], 2, 'Nhớ định nghĩa độ lệch chuẩn.', ['s = √s².'], ['Độ lệch chuẩn là căn bậc hai số học của phương sai.'])
mc('12-III-9', 'N', 'Khoảng tứ phân vị ΔQ của mẫu số liệu được tính bởi', ['Q₃ + Q₁', 'Q₂ − Q₁', '(Q₃ − Q₁)/2', 'Q₃ − Q₁'], 3, 'Nhớ định nghĩa khoảng tứ phân vị.', ['ΔQ = Q₃ − Q₁.'], ['ΔQ = Q₃ − Q₁.'])
tf('12-III-10', 'Điểm kiểm tra của 20 học sinh: [5; 6): 2; [6; 7): 6; [7; 8): 8; [8; 9): 4.',
   [['Khoảng biến thiên của mẫu số liệu bằng 4.', True], ['Số trung bình bằng 7,2.', True], ['Phương sai bằng 0,81.', True], ['Độ lệch chuẩn bằng 0,8.', False]],
   'Dùng giá trị đại diện 5,5; 6,5; 7,5; 8,5 để tính trung bình, phương sai.', ['s² = Σmᵢxᵢ²/n − x̄²; s = √s².'],
   ['a) 9 − 5 = 4: đúng.', 'b) (11 + 39 + 60 + 34)/20 = 7,2: đúng.', 'c) Σmᵢxᵢ²/n = 52,65; s² = 52,65 − 51,84 = 0,81: đúng.', 'd) s = 0,9: sai.'],
   chk=[True, isclose(144/20, 7.2), isclose(1053/20 - 7.2**2, 0.81), isclose(sqrt(0.81), 0.8)])
tf('12-III-9', 'Thời gian chờ (phút) của 40 khách tại một quầy: [0; 5): 8; [5; 10): 14; [10; 15): 12; [15; 20): 6.',
   [['Khoảng biến thiên của mẫu số liệu bằng 20 phút.', True], ['Tứ phân vị thứ nhất Q₁ ≈ 5,71 phút.', True], ['Tứ phân vị thứ ba Q₃ = 13,5 phút.', False], ['Khoảng tứ phân vị lớn hơn 8 phút.', False]],
   'Dùng công thức tứ phân vị cho mẫu ghép nhóm.', ['Qₖ = a + (kn/4 − C)/m·h.'],
   ['a) 20 − 0 = 20: đúng.', 'b) Q₁ = 5 + (10 − 8)/14·5 ≈ 5,71: đúng.', 'c) Q₃ = 10 + (30 − 22)/12·5 ≈ 13,33: sai.', 'd) ΔQ ≈ 7,62 < 8: sai.'],
   chk=[True, round(5 + 2/14*5, 2) == 5.71, isclose(10 + 8/12*5, 13.5), (10 + 8/12*5) - (5 + 2/14*5) > 8])
mc('12-IV-11', 'N', '∫2x dx bằng', ['2x² + C', 'x²/2 + C', 'x² + C', '2 + C'], 2, 'Dùng ∫xⁿdx = xⁿ⁺¹/(n + 1) + C.', ['∫k·f(x)dx = k∫f(x)dx.'], ['∫2x dx = 2·x²/2 + C = x² + C.'])
mc('12-IV-12', 'N', 'Với f liên tục, tích phân ∫ₐᵃ f(x)dx bằng', ['2f(a)', '0', 'f(a)', '1'], 1, 'Tích phân có hai cận bằng nhau.', ['∫ₐᵃ f(x)dx = F(a) − F(a) = 0.'], ['Bằng 0.'])
mc('12-IV-13', 'N', 'Diện tích hình phẳng giới hạn bởi đồ thị y = f(x) liên tục, trục Ox và hai đường thẳng x = a, x = b (a < b) là', ['π∫ₐᵇ f²(x)dx', '∫ₐᵇ f²(x)dx', '∫ᵦᵃ f(x)dx', '∫ₐᵇ |f(x)|dx'], 3, 'Diện tích luôn dương: lấy trị tuyệt đối của f.', ['S = ∫ₐᵇ |f(x)|dx.'], ['S = ∫ₐᵇ |f(x)|dx.'])
mc('12-V-14', 'N', 'Mặt phẳng (P): x − 2y + 3z − 1 = 0 đi qua điểm nào sau đây?', ['(0; 1; 0)', '(1; 0; 0)', '(1; 1; 1)', '(0; 0; 1)'], 1, 'Thay tọa độ từng điểm vào phương trình.', ['M ∈ (P) khi tọa độ thỏa mãn phương trình.'], ['(1; 0; 0): 1 − 1 = 0, thỏa mãn.'], chk=1 - 0 + 0 - 1 == 0)
mc('12-V-15', 'N', 'Đường thẳng x = 1 + 2t, y = −t, z = 3 + t có một vectơ chỉ phương là', ['(1; 0; 3)', '(1; −1; 1)', '(2; 1; 1)', '(2; −1; 1)'], 3, 'Hệ số của t là tọa độ vectơ chỉ phương.', ['x = x₀ + at, y = y₀ + bt, z = z₀ + ct có u = (a; b; c).'], ['u = (2; −1; 1).'])
mc('12-V-17', 'N', 'Mặt cầu x² + y² + z² = 16 có bán kính bằng', ['16', '8', '4', '2'], 2, 'Dạng x² + y² + z² = R².', ['R = √16.'], ['R = 4.'])
mc('12-VI-18', 'N', 'Với P(B) > 0, xác suất của A với điều kiện B là', ['P(AB)/P(A)', 'P(AB)/P(B)', 'P(A)·P(B)', 'P(A)/P(B)'], 1, 'Nhớ định nghĩa xác suất có điều kiện.', ['P(A|B) = P(AB)/P(B).'], ['P(A|B) = P(AB)/P(B).'])
mc('12-VI-18', 'N', 'Nếu A, B độc lập và P(B) > 0 thì P(A|B) bằng', ['P(B)', 'P(AB)', 'P(A)', '1'], 2, 'Độc lập: P(AB) = P(A)P(B).', ['P(A|B) = P(A)P(B)/P(B).'], ['P(A|B) = P(A).'])
mc('12-VI-19', 'N', 'Với 0 < P(B) < 1, công thức xác suất toàn phần là', ['P(A) = P(B)P(A|B)', 'P(A) = P(A|B) + P(A|B̄)', 'P(A) = P(AB) + P(B)', 'P(A) = P(B)P(A|B) + P(B̄)P(A|B̄)'], 3, 'Chia A theo B và B̄.', ['A = AB ∪ AB̄ (xung khắc).'], ['P(A) = P(B)P(A|B) + P(B̄)P(A|B̄).'])
mc('12-VI-19', 'N', 'Công thức Bayes cho P(B|A) (P(A) > 0) là', ['P(A)P(B|A)/P(B)', 'P(B)P(A|B)/P(A)', 'P(A|B)/P(B)', 'P(AB)/P(B)'], 1, 'Viết P(AB) theo hai cách.', ['P(AB) = P(B)P(A|B) = P(A)P(B|A).'], ['P(B|A) = P(B)P(A|B)/P(A).'])
mc('12-VI-18', 'N', 'Biết P(AB) = 0,12 và P(B) = 0,4. Khi đó P(A|B) bằng', ['0,3', '0,048', '0,52', '0,28'], 0, 'Áp dụng định nghĩa.', ['P(A|B) = P(AB)/P(B).'], ['0,12/0,4 = 0,3.'], chk=isclose(0.12/0.4, 0.3))
mc('12-VI-19', 'T', 'Máy I làm 70% sản phẩm với tỉ lệ lỗi 2%; máy II làm 30% với tỉ lệ lỗi 5%. Chọn ngẫu nhiên một sản phẩm, xác suất sản phẩm bị lỗi là', ['0,035', '0,07', '0,029', '0,0145'], 2, 'Dùng công thức xác suất toàn phần.', ['P(L) = P(I)P(L|I) + P(II)P(L|II).'], ['0,7·0,02 + 0,3·0,05 = 0,014 + 0,015 = 0,029.'], chk=isclose(0.7*0.02 + 0.3*0.05, 0.029))
mc('12-I-3', 'N', 'Đồ thị hàm số y = (2x − 1)/(x + 1) có tiệm cận ngang là đường thẳng', ['y = −1', 'x = −1', 'y = 2', 'y = 1/2'], 2, 'Tiệm cận ngang y = a/c của hàm phân thức bậc nhất.', ['y = (ax + b)/(cx + d) có tiệm cận ngang y = a/c.'], ['y = 2/1 = 2.'])

# --- Bổ sung cho chương ghép theo bộ Chân trời sáng tạo (Hàm số bậc hai; Bất phương trình bậc hai; Vectơ)
mc('10-VI-15', 'N', 'Tập xác định của hàm số y = √(x − 2) là', ['(2; +∞)', '[2; +∞)', 'ℝ', '(−∞; 2]'], 1, 'Biểu thức dưới căn phải không âm.', ['√A xác định khi A ≥ 0.'], ['x − 2 ≥ 0 ⇔ x ≥ 2.'])
mc('10-VI-15', 'T', 'Tập xác định của hàm số y = (x + 1)/(x² − 4) là', ['ℝ \\ {2}', 'ℝ \\ {4}', 'ℝ \\ {−2; 2}', '(−2; 2)'], 2, 'Mẫu phải khác 0.', ['Phân thức xác định khi mẫu khác 0.'], ['x² − 4 ≠ 0 ⇔ x ≠ ±2.'])
mc('10-VI-15', 'T', 'Cho hàm số f(x) = −2x + 5. Giá trị f(−1) − f(1) bằng', ['−4', '4', '2', '0'], 1, 'Tính từng giá trị rồi trừ.', ['Thay x vào công thức hàm số.'], ['f(−1) = 7, f(1) = 3.', 'f(−1) − f(1) = 4.'], chk=(2 + 5) - (-2 + 5) == 4)
tf('10-VI-15', 'Cho hàm số f(x) = 2x − 1 khi x ≥ 1 và f(x) = x² khi x < 1.',
   [['f(2) = 3.', True], ['f(−2) = 4.', True], ['f(0) = −1.', False], ['Phương trình f(x) = 4 có đúng hai nghiệm.', True]],
   'Xác định x thuộc khoảng nào rồi dùng đúng công thức; giải phương trình trên từng khoảng.', ['Hàm số cho bởi nhiều công thức.'],
   ['a) 2 ≥ 1: f(2) = 3, đúng.', 'b) −2 < 1: f(−2) = 4, đúng.', 'c) 0 < 1: f(0) = 0, sai.', 'd) x ≥ 1: 2x − 1 = 4 ⇒ x = 2,5; x < 1: x² = 4 ⇒ x = −2. Hai nghiệm: đúng.'], chk=[True, True, False, True])
mc('10-VI-16', 'N', 'Parabol y = x² − 2x + 3 có đỉnh là', ['(−1; 6)', '(1; 3)', '(2; 3)', '(1; 2)'], 3, 'Đỉnh I(−b/(2a); f(−b/(2a))).', ['x đỉnh = −b/(2a).'], ['x = 1, y = 1 − 2 + 3 = 2.'])
mc('10-VI-16', 'T', 'Hàm số y = −x² + 4x − 1 đồng biến trên khoảng', ['(2; +∞)', '(−∞; 2)', '(−∞; −2)', '(−1; +∞)'], 1, 'a < 0: hàm số đồng biến bên trái đỉnh.', ['a < 0: đồng biến trên (−∞; −b/(2a)).'], ['−b/(2a) = 2 nên đồng biến trên (−∞; 2).'])
tf('10-VI-16', 'Cho hàm số y = x² − 4x + 3 có đồ thị (P).',
   [['(P) có trục đối xứng x = 2.', True], ['Đỉnh của (P) là (2; −1).', True], ['(P) cắt trục hoành tại hai điểm có hoành độ 1 và 3.', True], ['Giá trị nhỏ nhất của hàm số trên đoạn [3; 5] bằng −1.', False]],
   'Tìm đỉnh, nghiệm; xét chiều biến thiên trên đoạn đã cho.', ['a > 0: hàm số đồng biến trên (−b/(2a); +∞).'],
   ['a) x = 4/2 = 2: đúng.', 'b) y(2) = −1: đúng.', 'c) x² − 4x + 3 = 0 ⇔ x = 1 hoặc 3: đúng.', 'd) Trên [3; 5] hàm số đồng biến, nhỏ nhất y(3) = 0: sai.'], chk=[True, 4 - 8 + 3 == -1, True, 9 - 12 + 3 == -1])
sa('10-VI-16', 'Một quả bóng được ném lên có độ cao h(t) = −4,9t² + 19,6t + 1,5 (m) sau t giây. Độ cao lớn nhất của quả bóng là bao nhiêu mét?', '21,1', R1,
   'h là hàm bậc hai với a < 0: lớn nhất tại đỉnh.', ['Đỉnh tại t = −b/(2a).'], ['t = 19,6/9,8 = 2.', 'h(2) = −19,6 + 39,2 + 1,5 = 21,1 m.'], -4.9*4 + 19.6*2 + 1.5, 1)
mc('10-VI-17', 'N', 'Tam thức f(x) = x² − 5x + 6 nhận giá trị âm khi và chỉ khi', ['x < 2', 'x > 3', '2 < x < 3', 'x < 2 hoặc x > 3'], 2, 'a > 0: tam thức âm giữa hai nghiệm.', ['Hai nghiệm 2 và 3.'], ['f(x) < 0 ⇔ 2 < x < 3.'])
mc('10-VI-17', 'N', 'Tam thức nào sau đây dương với mọi x ∈ ℝ?', ['x² − 4', '−x² + 1', 'x² − 2x + 1', 'x² + x + 1'], 3, 'Cần a > 0 và Δ < 0.', ['Δ < 0 thì f(x) cùng dấu a với mọi x.'], ['x² + x + 1 có Δ = −3 < 0, a = 1 > 0.'])
mc('10-VI-17', 'N', 'Tập nghiệm của bất phương trình x² − 9 ≥ 0 là', ['[−3; 3]', '(−∞; −3] ∪ [3; +∞)', '(−3; 3)', '[3; +∞)'], 1, 'a > 0: tam thức không âm ngoài khoảng hai nghiệm.', ['Nghiệm ±3.'], ['x ≤ −3 hoặc x ≥ 3.'])
tf('10-VI-17', 'Cho tam thức f(x) = −x² + 2x + 3.',
   [['f(x) có hai nghiệm −1 và 3.', True], ['f(x) > 0 khi −1 < x < 3.', True], ['f(x) < 0 với mọi x > 2.', False], ['Có 5 số nguyên x thỏa mãn f(x) > 0.', False]],
   'Tìm nghiệm, lập bảng xét dấu (a < 0: dương giữa hai nghiệm).', ['a < 0: f(x) > 0 giữa hai nghiệm, âm ngoài.'],
   ['a) −1 − 2 + 3 = 0; −9 + 6 + 3 = 0: đúng.', 'b) Dương giữa hai nghiệm: đúng.', 'c) f(2,5) = 1,75 > 0: sai.', 'd) x ∈ {0; 1; 2}: chỉ 3 số: sai.'],
   chk=[True, True, -6.25 + 5 + 3 < 0, sum(1 for x in range(-5, 6) if -x*x + 2*x + 3 > 0) == 5])
sa('10-VI-17', 'Một rạp chiếu bán vé giá p nghìn đồng thì bán được 500 − 5p vé mỗi suất. Giá vé cao nhất là bao nhiêu nghìn đồng để doanh thu mỗi suất không dưới 12 triệu đồng?', '60', '',
   'Lập bất phương trình bậc hai p(500 − 5p) ≥ 12000 rồi xét dấu tam thức.', ['Tam thức a > 0 không dương giữa hai nghiệm.'],
   ['p(500 − 5p) ≥ 12000 ⇔ p² − 100p + 2400 ≤ 0 ⇔ 40 ≤ p ≤ 60.', 'Giá cao nhất 60 nghìn đồng.'], max(p for p in range(0, 101) if p*(500 - 5*p) >= 12000), 0)
mc('10-VI-18', 'N', 'Bình phương hai vế phương trình √(2x + 3) = x ta được phương trình', ['2x + 3 = x', '2x + 3 = x²', '4x² + 9 = x²', '2x + 3 = 2x²'], 1, 'Bình phương hai vế.', ['(√A)² = A.'], ['2x + 3 = x² (kèm điều kiện x ≥ 0).'])
mc('10-VI-18', 'N', 'Nghiệm của phương trình √(x + 1) = 3 là', ['2', '10', '8', '9'], 2, 'Bình phương hai vế.', ['√A = b (b ≥ 0) ⇔ A = b².'], ['x + 1 = 9 ⇔ x = 8.'])
mc('10-VI-18', 'N', 'Phương trình √(x² − 1) = √(2x − 1) tương đương với', ['x² − 2x = 0 với mọi x', 'x² = 2x + 2', 'x² + 2x − 2 = 0', 'x² − 2x = 0 với x ≥ 1/2'], 3, '√A = √B ⇔ A = B và B ≥ 0.', ['√A = √B ⇔ B ≥ 0, A = B.'], ['x² − 1 = 2x − 1 ⇔ x² − 2x = 0, cùng điều kiện 2x − 1 ≥ 0.'])
tf('10-VI-18', 'Cho phương trình √(x + 7) = x + 1.',
   [['Điều kiện x + 1 ≥ 0 là cần thiết.', True], ['Bình phương hai vế được x² + x − 6 = 0.', True], ['Phương trình có hai nghiệm x = 2 và x = −3.', False], ['Tổng các nghiệm của phương trình bằng 2.', True]],
   'Đặt điều kiện vế phải không âm, bình phương, đối chiếu điều kiện.', ['√A = B ⇔ B ≥ 0 và A = B².'],
   ['a) Vế trái không âm nên cần x + 1 ≥ 0: đúng.', 'b) x + 7 = x² + 2x + 1 ⇔ x² + x − 6 = 0: đúng.', 'c) x = −3 không thỏa x ≥ −1, chỉ x = 2: sai.', 'd) Chỉ có nghiệm 2: đúng.'], chk=[True, True, False, True])
sa('10-VI-18', 'Một mảnh vườn hình chữ nhật có chiều dài hơn chiều rộng 7 m và đường chéo dài 13 m, tức là √(x² + (x + 7)²) = 13 với x là chiều rộng. Chiều rộng mảnh vườn là bao nhiêu mét?', '5', '',
   'Bình phương hai vế phương trình chứa căn, chọn nghiệm dương.', ['√A = b (b > 0) ⇔ A = b².'],
   ['x² + (x + 7)² = 169 ⇔ x² + 7x − 60 = 0 ⇔ x = 5 hoặc x = −12.', 'x > 0 nên x = 5.'], 5, 0)
mc('10-IV-9', 'N', 'Cho M là trung điểm đoạn AB và O là điểm bất kì. Khi đó OA + OB (tổng hai vectơ) bằng', ['OM', 'AB', '2OM', '0'], 2, 'Tính chất trung điểm.', ['M là trung điểm AB ⇔ OA + OB = 2OM với mọi O.'], ['OA + OB = 2OM.'])

# ---------------------------------------------------------------- xuất
for x in IT:
    if x['t'] == 'mc':
        assert len(set(x['o'])) == 4 and 0 <= x['a'] < 4, x['q']
    if x['t'] == 'sa':
        assert len(x['a']) <= 4, x['a']

cnt = json.loads(subprocess.run(['node', '-e', r'''
global.window = {}; for (const f of ["data.js","data_them.js","dethi_them.js","mucdo.js","dethi_mucdo.js","thucte.js"]) require("./" + f);
const L = {}; for (const g of [10, 11, 12]) for (const c of window.KHKT_DATA[g]) for (const l of c.lessons) L[l.id] = l.ex.length + (window.KHKT_EX_ADD[l.id] || []).length;
console.log(JSON.stringify(L));'''], cwd=ROOT, capture_output=True, text=True, encoding='utf-8', check=True).stdout)

def item_js(x):
    d = {'t': x['t']}
    if x['t'] != 'tf': d['m'] = x['m']
    d['q'] = x['q']
    if x['t'] == 'mc': d['o'] = x['o']; d['a'] = x['a']
    elif x['t'] == 'sa': d['a'] = x['a']; d['r'] = x['r']
    else: d['s'] = x['s']
    return d

def last_line(x):
    if x['t'] == 'mc': return 'Đáp án: ' + x['o'][x['a']]
    if x['t'] == 'sa': return 'Đáp án: ' + x['a']
    return 'Kết luận: ' + ', '.join('abcd'[i] + ' ' + ('Đúng' if s[1] else 'Sai') for i, s in enumerate(x['s'])) + '.'

js, lines, nxt = {}, {'10': [], '11': [], '12': []}, dict(cnt)
for x in IT:
    k = x['k']; key = f"{k}#{nxt[k]}"; nxt[k] += 1
    js.setdefault(k, []).append(item_js(x))
    lines[k.split('-')[0]].append('\n'.join([f'# {key}', 'h ' + x['h']] + ['y ' + y for y in x['y']] + ['b ' + b for b in x['b']] + ['b ' + last_line(x), '']))
for g in lines:
    (HERE / f'{g}e_chuong.txt').write_text('\n'.join(lines[g]), encoding='utf-8')
body = ',\n'.join(f'  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}' for k, v in js.items())
(ROOT / 'chuong.js').write_text(f'''// Tệp sinh tự động từ content/chuong_nguon.py. Sửa nội dung ở tệp nguồn đó.
// Câu bổ sung để mỗi chương đủ dựng một đề theo khung đề thi THPT (12 trắc nghiệm, 4 đúng/sai, 6 trả lời ngắn).
window.KHKT_EX_CH = {{
{body}
}};
(function(){{ const add = window.KHKT_EX_ADD = window.KHKT_EX_ADD || {{}};
  Object.entries(window.KHKT_EX_CH).forEach(([id, a]) => {{ (add[id] = add[id] || []).push(...a); }}); }})();
''', encoding='utf-8')
from collections import Counter
print('ok', len(IT), Counter(x['t'] + (x.get('m') or '') for x in IT))
