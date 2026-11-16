# Nguồn câu vận dụng, câu thực tế bổ sung cho ôn tập từng bài và đề thi thử.
# Mỗi câu tự soạn (số liệu, bối cảnh mới), chỉ lấy DẠNG bài từ đề thi thử 2026 của các trường;
# trường "src" ghi đề và câu gợi ý dạng. Câu không có src là bối cảnh thực tế tự soạn.
# Chạy: py -I content/thucte_nguon.py  (từ D:\KHKT). Tệp sinh ra:
#   thucte.js                             dữ liệu câu (nối vào KHKT_EX_ADD và KHKT_EXAM_LV)
#   content/1xd_thucte.txt, dethi_thucte.txt   lời giải (sau đó chạy build.py)
# Mọi đáp án được tính lại bằng máy ngay trong tệp này (trường "v"); sai là dừng.
import json, math, pathlib, subprocess, sys
from math import sqrt, sin, cos, tan, atan, acos, radians, degrees, log, log10, exp, pi, comb
sys.stdout.reconfigure(encoding="utf-8")
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent / "web"

SRC = {
    'KHTN': 'THPT Chuyên KHTN (Hà Nội), thi thử lần 1 năm 2026',
    'VINH': 'THPT Chuyên ĐH Vinh, thi thử lần 1 năm 2026',
    'NA': 'Liên trường THPT Nghệ An, khảo sát lần 1 năm 2026',
    'HP13': 'Cụm 13 trường THPT Hải Phòng, thi thử năm 2026',
    'TH': 'Cụm trường THPT Thanh Hóa, thi thử năm 2026',
}

def fmt(v, nd):
    s = f"{v:.{nd}f}".replace('.', ',').replace('-', '−')
    return s

R1, R2, R0 = 'Làm tròn đến hàng phần mười', 'Làm tròn đến hàng phần trăm', 'Làm tròn đến hàng đơn vị'

# ---------------------------------------------------------------- ôn tập từng bài
# k: mã bài; src: (đề, câu) hoặc None; v: giá trị máy tính; nd: số chữ số thập phân của đáp án.
LE = []
def le(k, q, a, h, y, b, v, nd=0, r='', src=None, t='sa', o=None, g=''):
    LE.append(dict(k=k, q=q, a=a, h=h, y=y, b=b, v=v, nd=nd, r=r, src=src, t=t, o=o, g=g))

# ===== Lớp 10 =====
le('10-II-3', 'Lan có 120 nghìn đồng để mua bút (8 nghìn đồng/chiếc) và vở (12 nghìn đồng/quyển). Lan cần mua ít nhất 3 quyển vở. Hỏi Lan mua được nhiều nhất bao nhiêu chiếc bút?', '10',
   'Gọi số bút, số vở là x, y; viết bất phương trình về số tiền rồi tìm x lớn nhất trên miền nghiệm.',
   ['Tổng tiền mua: 8x + 12y ≤ 120 (bất phương trình bậc nhất hai ẩn).', 'Với y cố định, x lớn nhất khi y nhỏ nhất có thể.'],
   ['Điều kiện: x, y nguyên, x ≥ 0, y ≥ 3, 8x + 12y ≤ 120.', 'y nhỏ nhất bằng 3 nên 8x ≤ 120 − 36 = 84, tức x ≤ 10,5.', 'x nguyên nên x lớn nhất bằng 10.'],
   v=max(x for x in range(20) if 8*x + 12*3 <= 120), src=('VINH', 'II.1'))
le('10-II-4', 'Một xưởng may áo sơ mi và quần âu. Mỗi ngày xưởng có tối đa 60 giờ công cắt và 48 giờ công may. Một áo cần 1 giờ cắt, 2 giờ may, lãi 80 nghìn đồng; một quần cần 2 giờ cắt, 1 giờ may, lãi 100 nghìn đồng. Tiền lãi lớn nhất mỗi ngày là bao nhiêu nghìn đồng?', '3360',
   'Lập hệ bất phương trình cho số áo x, số quần y; lãi lớn nhất đạt tại một đỉnh của miền nghiệm.',
   ['Bài toán quy hoạch tuyến tính: giá trị lớn nhất của F = ax + by trên miền đa giác đạt tại đỉnh.'],
   ['Hệ: x ≥ 0, y ≥ 0, x + 2y ≤ 60 (giờ cắt), 2x + y ≤ 48 (giờ may). Lãi F = 80x + 100y.',
    'Các đỉnh: O(0; 0), (24; 0), (0; 30) và giao điểm của x + 2y = 60 với 2x + y = 48 là (12; 24).',
    'F(24; 0) = 1920, F(0; 30) = 3000, F(12; 24) = 960 + 2400 = 3360.', 'Lãi lớn nhất 3360 nghìn đồng khi may 12 áo, 24 quần.'],
   v=max(80*x + 100*y for x in range(61) for y in range(61) if x + 2*y <= 60 and 2*x + y <= 48), src=('HP13', 'III.2'))
le('10-III-5', 'Một vòng đu quay có tâm O cao 55 m so với mặt đất, bán kính 50 m. Cabin M ở vị trí mà tia OM tạo với tia nằm ngang hướng sang phải góc 135° (ngược chiều kim đồng hồ). Cabin M cao bao nhiêu mét so với mặt đất?', '90,4',
   'Đặt hệ trục gốc O; tung độ của M bằng R·sin 135°, rồi cộng độ cao của tâm.',
   ['Điểm M trên đường tròn tâm O bán kính R, góc xOM = α thì M(R cos α; R sin α).', 'sin 135° = sin 45° = √2/2.'],
   ['Tung độ của M so với tâm: 50·sin 135° = 25√2 ≈ 35,36 m.', 'Độ cao so với mặt đất: 55 + 35,36 ≈ 90,36 m.'],
   v=55 + 50*sin(radians(135)), nd=1, r=R1)
le('10-III-6', 'Hai trạm quan sát A, B trên bờ biển cách nhau 500 m cùng nhìn thấy một hòn đảo C, đo được góc CAB = 70° và góc CBA = 60°. Khoảng cách từ trạm A đến hòn đảo là bao nhiêu mét?', '565',
   'Biết một cạnh và hai góc kề: tính góc còn lại rồi dùng định lí sin.',
   ['Định lí sin: a/sin A = b/sin B = c/sin C.', 'Tổng ba góc của tam giác bằng 180°.'],
   ['Góc C = 180° − 70° − 60° = 50°.', 'AC/sin B = AB/sin C nên AC = 500·sin 60°/sin 50° ≈ 500·0,8660/0,7660 ≈ 565,3 m.'],
   v=500*sin(radians(60))/sin(radians(50)), r=R0, src=('TH', 'III.5'))
le('10-IV-7', 'Trên mặt hồ có bốn ca nô chuyển động: A đi về hướng Bắc với tốc độ 20 km/h, B đi về hướng Nam 20 km/h, C đi về hướng Bắc 20 km/h, D đi về hướng Bắc 30 km/h. Có bao nhiêu cặp ca nô (không kể thứ tự) có vectơ vận tốc cùng hướng?', '3',
   'Vectơ vận tốc cùng hướng khi cùng phương và cùng chiều chuyển động, không cần cùng độ dài.',
   ['Hai vectơ cùng hướng: cùng phương, cùng chiều; độ dài có thể khác nhau.', 'Hai vectơ bằng nhau: cùng hướng và cùng độ dài.'],
   ['A, C, D cùng đi về hướng Bắc nên vectơ vận tốc đôi một cùng hướng; B ngược hướng với cả ba.', 'Số cặp cùng hướng: AC, AD, CD, tức C(3, 2) = 3 cặp.'],
   v=comb(3, 2), src=('HP13', 'III.5'))
le('10-IV-8', 'Hai sợi dây cáp cùng kéo một vật với hai lực có cùng độ lớn 320 N, góc giữa hai dây là 60°. Độ lớn của hợp lực tác dụng lên vật là bao nhiêu newton?', '554',
   'Hợp lực là tổng hai vectơ lực; dựng hình bình hành (ở đây là hình thoi) rồi tính đường chéo.',
   ['Quy tắc hình bình hành: F = F₁ + F₂ là đường chéo hình bình hành dựng trên F₁, F₂.', 'Hình thoi cạnh a, góc 60° có đường chéo dài a√3.'],
   ['Hai lực cùng độ lớn nên hình bình hành là hình thoi cạnh 320, góc 60°.', 'Đường chéo ứng với tổng: |F| = 2·320·cos 30° = 320√3 ≈ 554,3 N.'],
   v=2*320*cos(radians(30)), r=R0, src=('NA', 'II.4'))
le('10-IV-9', 'Ba cột đèn A, B, C tạo thành tam giác có AB = AC = 50 m, BC = 60 m. Một cột phát sóng đặt tại điểm G thỏa mãn GA + GB + GC = 0 (tổng ba vectơ). Khoảng cách từ G đến cột A là bao nhiêu mét?', '26,7',
   'Nhận ra G là trọng tâm tam giác, rồi dùng AG = (2/3)·AM với M là trung điểm BC.',
   ['GA + GB + GC = 0 ⇔ G là trọng tâm tam giác ABC.', 'Trọng tâm nằm trên trung tuyến AM và AG = (2/3)AM.'],
   ['Tam giác cân tại A nên trung tuyến AM cũng là đường cao: AM = √(50² − 30²) = 40 m.', 'AG = (2/3)·40 ≈ 26,67 m.'],
   v=2/3*40, nd=1, r=R1)
le('10-IV-10', 'Trên bản đồ có hệ tọa độ Oxy (đơn vị km), một tàu xuất phát từ O với vectơ vận tốc v = (12; 5) (km/h). Sau 2 giờ tàu cách đảo I(30; 4) bao nhiêu kilômét?', '8,5',
   'Tọa độ tàu sau t giờ bằng tọa độ ban đầu cộng t lần vectơ vận tốc; sau đó tính độ dài vectơ.',
   ['Chuyển động thẳng đều: M(t) = O + t·v.', 'AB = √((x₂ − x₁)² + (y₂ − y₁)²).'],
   ['Sau 2 giờ tàu ở M = (24; 10).', 'MI = √((30 − 24)² + (4 − 10)²) = √72 ≈ 8,49 km.'],
   v=sqrt(72), nd=1, r=R1, src=('HP13', 'III.5'))
le('10-IV-11', 'Tay cầm D của một máy tập có tọa độ D(0; 1), hai sợi dây cáp nối D với hai ròng rọc A(−3; 5) và B(4; 5) (đơn vị dm). Góc giữa hai sợi dây DA và DB bằng bao nhiêu độ?', '82',
   'Góc giữa hai dây là góc giữa hai vectơ DA, DB; tính bằng tích vô hướng.',
   ['cos(u, v) = (u·v)/(|u|·|v|), với u·v = x₁x₂ + y₁y₂.'],
   ['DA = (−3; 4), DB = (4; 4).', 'DA·DB = −12 + 16 = 4; |DA| = 5, |DB| = 4√2.', 'cos ADB = 4/(20√2) ≈ 0,1414 nên góc ADB ≈ 81,87°.'],
   v=degrees(acos(4/(5*sqrt(32)))), r=R0, src=('NA', 'II.4'))
le('10-VI-15', 'Giá cước một hãng taxi: 1 km đầu 12 nghìn đồng; từ km thứ 2 đến km thứ 30 là 15 nghìn đồng/km; từ km thứ 31 trở đi là 11 nghìn đồng/km. Một khách đi 40 km phải trả bao nhiêu nghìn đồng?', '557',
   'Viết hàm cước theo từng khoảng quãng đường rồi thay x = 40 vào đúng công thức.',
   ['Hàm số cho bởi nhiều công thức: xác định x thuộc khoảng nào rồi dùng công thức tương ứng.'],
   ['1 km đầu: 12; 29 km tiếp theo (km 2 đến 30): 29·15 = 435.', '10 km còn lại (km 31 đến 40): 10·11 = 110.', 'Tổng: 12 + 435 + 110 = 557 nghìn đồng.'],
   v=12 + 29*15 + 10*11)
le('10-VI-16', 'Một cửa hàng nhập quạt với giá 400 nghìn đồng/chiếc. Nếu bán 600 nghìn đồng/chiếc thì mỗi tháng bán được 80 chiếc; cứ giảm giá 20 nghìn đồng thì bán thêm được 10 chiếc. Cửa hàng nên bán giá bao nhiêu nghìn đồng/chiếc để lợi nhuận mỗi tháng lớn nhất?', '580',
   'Biểu diễn số quạt bán được theo giá p (hàm bậc nhất), lợi nhuận là hàm bậc hai của p; tìm đỉnh parabol.',
   ['Hàm bậc hai y = ax² + bx + c với a < 0 đạt lớn nhất tại x = −b/(2a).'],
   ['Giảm (600 − p) nghìn thì bán thêm (600 − p)/2 chiếc: số bán q = 80 + (600 − p)/2 = 380 − p/2.',
    'Lợi nhuận L(p) = (p − 400)(380 − p/2) = −p²/2 + 580p − 152000.', 'L đạt lớn nhất tại p = 580/(2·1/2) = 580.'],
   v=max(range(400, 761), key=lambda p: (p - 400)*(380 - p/2)), src=('TH', 'III.1'))
le('10-VI-17', 'Lợi nhuận của một xưởng khi sản xuất x trăm sản phẩm là P(x) = −x² + 30x − 200 (triệu đồng). Có bao nhiêu giá trị nguyên của x để lợi nhuận đạt ít nhất 21 triệu đồng?', '5',
   'Đưa về bất phương trình bậc hai, xét dấu tam thức để tìm tập nghiệm rồi đếm số nguyên.',
   ['Tam thức ax² + bx + c (a > 0) không dương giữa hai nghiệm.'],
   ['−x² + 30x − 200 ≥ 21 ⇔ x² − 30x + 221 ≤ 0.', 'Tam thức có hai nghiệm 13 và 17 nên 13 ≤ x ≤ 17.', 'Các giá trị nguyên: 13, 14, 15, 16, 17.'],
   v=sum(1 for x in range(100) if -x*x + 30*x - 200 >= 21), src=('VINH', 'III.6'))
le('10-VI-18', 'Đảo A cách bờ biển thẳng 3 km, H là hình chiếu của A trên bờ, trạm điện B trên bờ cách H 8 km. Người ta kéo cáp từ A đến điểm C nằm giữa H và B rồi kéo dọc bờ đến B, tổng chiều dài cáp là 10 km. Tính HC (km).', '1,25',
   'Đặt HC = x, lập phương trình chứa căn từ tổng độ dài, bình phương hai vế khi vế phải không âm.',
   ['AC = √(x² + 9) theo định lí Pythagore.', '√f(x) = g(x) ⇔ g(x) ≥ 0 và f(x) = g(x)².'],
   ['AC + CB = 10 ⇔ √(x² + 9) + (8 − x) = 10 ⇔ √(x² + 9) = x + 2.', 'Với x + 2 ≥ 0: x² + 9 = x² + 4x + 4 ⇔ x = 1,25.', 'x = 1,25 thuộc [0; 8], thỏa mãn.'],
   v=1.25, nd=2, src=('TH', 'III.5'))
le('10-VII-19', 'Trong hệ tọa độ Oxy (đơn vị km), một con tàu đi thẳng từ A(−3; 10) đến B(9; 1). Ngọn hải đăng đặt tại I(4; 3). Trên hành trình, tàu đi qua vị trí gần hải đăng nhất cách hải đăng bao nhiêu kilômét?', '1,4',
   'Lập phương trình đường thẳng AB, tính khoảng cách từ I đến AB và kiểm tra chân đường vuông góc nằm trên đoạn AB.',
   ['Khoảng cách từ M(x₀; y₀) đến ax + by + c = 0 là |ax₀ + by₀ + c|/√(a² + b²).'],
   ['AB = (12; −9) cùng phương (4; −3), vectơ pháp tuyến (3; 4): AB: 3x + 4y − 31 = 0.', 'd(I, AB) = |12 + 12 − 31|/5 = 7/5 = 1,4.',
    'Hình chiếu của I lên AB ứng với tham số 9,8/15 ∈ [0; 1] nên nằm trên đoạn AB.'],
   v=abs(3*4 + 4*3 - 31)/5, nd=1, src=('NA', 'III.3'))
le('10-VII-21', 'Một trạm phát sóng đặt tại I(2; 1) phủ sóng trong bán kính 5 km (đơn vị trên trục là km). Một con đường thẳng có phương trình x − y + 4 = 0. Đoạn đường nằm trong vùng phủ sóng dài bao nhiêu kilômét?', '7,1',
   'Đoạn đường trong vùng phủ sóng là dây cung của đường tròn; tính khoảng cách từ tâm đến đường thẳng rồi dùng Pythagore.',
   ['Dây cung: độ dài 2√(R² − d²), d là khoảng cách từ tâm đến đường thẳng.'],
   ['d = |2 − 1 + 4|/√2 = 5/√2.', 'Độ dài dây: 2√(25 − 12,5) = 2√12,5 ≈ 7,07 km.'],
   v=2*sqrt(25 - 12.5), nd=1, r=R1)
le('10-VII-22', 'Một cổng hầm có mặt cắt là nửa elip rộng 8 m, cao 3 m. Một xe tải rộng 2,4 m đi chính giữa đường. Chiều cao tối đa của xe (m) để xe qua được cổng là bao nhiêu?', '2,86',
   'Đặt elip x²/16 + y²/9 = 1 với trục lớn trên mặt đường; xe chạm cổng tại hoành độ x = 1,2.',
   ['Elip x²/a² + y²/b² = 1 có trục lớn 2a, trục nhỏ 2b.'],
   ['a = 4, b = 3. Mép xe ở x = 1,2.', 'y = 3√(1 − 1,2²/16) = 3√0,91 ≈ 2,862 m.'],
   v=3*sqrt(1 - 1.44/16), nd=2, r=R2, src=('TH', 'III.3'))
le('10-VIII-23', 'Mã đơn hàng gồm 2 chữ cái khác nhau lấy từ {A, B, C} rồi đến 3 chữ số đôi một khác nhau, chữ số đầu tiên khác 0. Có bao nhiêu mã đơn hàng khác nhau?', '3888',
   'Chia việc lập mã thành các bước liên tiếp rồi dùng quy tắc nhân.',
   ['Quy tắc nhân: công việc gồm các bước liên tiếp thì số cách bằng tích số cách của từng bước.'],
   ['Hai chữ cái khác nhau có thứ tự: 3·2 = 6 cách.', 'Chữ số đầu: 9 cách (khác 0); thứ hai: 9 cách; thứ ba: 8 cách, tổng 648.', 'Số mã: 6·648 = 3888.'],
   v=3*2*9*9*8)
le('10-VIII-24', 'Trên sân khấu có 12 bóng đèn đặt cách đều trên một đường tròn. Có bao nhiêu cách bật đúng 4 bóng đèn sao cho 4 bóng đó là 4 đỉnh của một hình chữ nhật?', '15',
   'Hình chữ nhật nội tiếp đường tròn có hai đường chéo là hai đường kính; đếm số cách chọn 2 đường kính.',
   ['Tứ giác nội tiếp là hình chữ nhật ⇔ hai đường chéo là hai đường kính.', 'Số tổ hợp chập k của n: C(n, k).'],
   ['12 điểm chia đều tạo thành 6 đường kính.', 'Mỗi cách chọn 2 đường kính cho 1 hình chữ nhật: C(6, 2) = 15.'],
   v=comb(6, 2), src=('VINH', 'III.2'))
le('10-VIII-25', 'Gửi 100 triệu đồng với lãi suất 6%/năm (lãi nhập gốc). Dùng 3 số hạng đầu trong khai triển (1 + 0,06)⁵ để ước lượng số tiền sau 5 năm. Kết quả ước lượng là bao nhiêu triệu đồng?', '134',
   'Khai triển nhị thức Newton, giữ 3 số hạng đầu rồi nhân với 100.',
   ['(1 + x)⁵ = 1 + 5x + 10x² + 10x³ + 5x⁴ + x⁵.'],
   ['(1,06)⁵ ≈ 1 + 5·0,06 + 10·0,06² = 1 + 0,3 + 0,036 = 1,336.', 'Số tiền ≈ 100·1,336 = 133,6 triệu đồng.'],
   v=100*(1 + 5*0.06 + 10*0.06**2), r=R0)
le('10-IX-26', 'Ở hội trại, hộp bốc thăm có 25 lá thăm đánh số từ 1 đến 25. Một bạn bốc ngẫu nhiên đồng thời 3 lá. Bạn trúng thưởng nếu tích ba số chia hết cho 5. Tính xác suất trúng thưởng.', '0,50',
   'Dùng biến cố đối: tích không chia hết cho 5 khi cả ba số đều không là bội của 5.',
   ['P(A) = 1 − P(Ā).', 'Từ 1 đến 25 có 5 bội của 5.'],
   ['|Ω| = C(25, 3) = 2300. Ā: ba số đều thuộc 20 số không chia hết cho 5: C(20, 3) = 1140.', 'P = 1 − 1140/2300 ≈ 0,504.'],
   v=1 - comb(20, 3)/comb(25, 3), nd=2, r=R2, src=('NA', 'III.1'))
le('10-IX-27', 'Có 10 bao lì xì giống nhau, trong đó 3 bao chứa 50 nghìn đồng và 7 bao chứa 10 nghìn đồng. An bốc ngẫu nhiên 2 bao. Tính xác suất An được ít nhất 60 nghìn đồng.', '0,53',
   'Ít nhất 60 nghìn đồng xảy ra khi có ít nhất một bao 50 nghìn; dùng biến cố đối.',
   ['P(A) = 1 − P(Ā).'],
   ['Ā: cả hai bao đều 10 nghìn (chỉ được 20 nghìn): C(7, 2) = 21 cách trên C(10, 2) = 45.', 'P = 1 − 21/45 = 24/45 ≈ 0,53.'],
   v=1 - comb(7, 2)/comb(10, 2), nd=2, r=R2, src=('VINH', 'II.2'))
le('10-CD-1', 'Một rạp bán 200 vé gồm ba loại: người lớn 100 nghìn đồng, sinh viên 60 nghìn đồng, trẻ em 40 nghìn đồng, thu được 15,6 triệu đồng. Số vé người lớn bằng tổng số vé hai loại còn lại. Rạp bán được bao nhiêu vé sinh viên?', '80',
   'Gọi số vé ba loại là x, y, z; lập hệ ba phương trình bậc nhất ba ẩn và giải bằng phép thế.',
   ['Hệ ba phương trình bậc nhất ba ẩn: khử dần ẩn bằng phép thế hoặc cộng đại số.'],
   ['x + y + z = 200; 100x + 60y + 40z = 15600; x = y + z.', 'Từ phương trình 1 và 3: x = 100, y + z = 100.', '60y + 40z = 5600 và z = 100 − y ⇒ 20y = 1600 ⇒ y = 80.'],
   v=80)

# ===== Lớp 11 =====
le('11-I-1', 'Một vòng đu quay bán kính 40 m quay đều, mỗi vòng hết 20 phút. Sau 25 phút, một cabin đi được quãng đường bao nhiêu mét?', '314',
   'Đổi thời gian ra số vòng, số vòng ra góc quay (radian), rồi dùng công thức độ dài cung.',
   ['Một vòng ứng với 2π rad.', 'Độ dài cung: l = Rα (α tính bằng radian).'],
   ['25 phút ứng với 25/20 = 1,25 vòng, tức α = 2,5π rad.', 'l = 40·2,5π = 100π ≈ 314,2 m.'],
   v=40*2.5*pi, r=R0)
le('11-I-2', 'Một biển quảng cáo cao 4 m treo trên tường, mép dưới cao hơn mắt người xem 2 m. Người đứng cách tường 4 m. Gọi α là góc nhìn từ mắt đến mép trên, β là góc nhìn đến mép dưới (so với phương nằm ngang). Tính tan(α − β) (góc nhìn cả biển).', '0,57',
   'Tính tan α, tan β từ tam giác vuông rồi dùng công thức tan của hiệu.',
   ['tan(α − β) = (tan α − tan β)/(1 + tan α·tan β).'],
   ['tan α = 6/4 = 1,5; tan β = 2/4 = 0,5.', 'tan(α − β) = (1,5 − 0,5)/(1 + 0,75) = 1/1,75 ≈ 0,571.'],
   v=(1.5 - 0.5)/(1 + 1.5*0.5), nd=2, r=R2)
le('11-I-3', 'Độ sâu mực nước tại một cảng là h(t) = 3 + 2cos(πt/6) (m), t tính bằng giờ, 0 ≤ t ≤ 12. Tàu chỉ vào cảng được khi h ≥ 4 m. Trong 12 giờ đó, tổng thời gian tàu vào cảng được là bao nhiêu giờ?', '4',
   'Đưa về bất phương trình cos(πt/6) ≥ 1/2, giải trên đúng khoảng của u = πt/6.',
   ['cos u ≥ 1/2 với u ∈ [0; 2π] ⇔ u ∈ [0; π/3] ∪ [5π/3; 2π].'],
   ['h ≥ 4 ⇔ cos(πt/6) ≥ 1/2, với u = πt/6 ∈ [0; 2π].', 'u ∈ [0; π/3] ⇔ t ∈ [0; 2]; u ∈ [5π/3; 2π] ⇔ t ∈ [10; 12].', 'Tổng thời gian: 2 + 2 = 4 giờ.'],
   v=sum(1 for i in range(120000) if 3 + 2*cos(pi*(i + 0.5)/10000/6) >= 4)/10000)
le('11-I-4', 'Độ cao của một cabin đu quay so với mặt đất là h(t) = 50 − 40cos(πt/15) (m), t tính bằng phút kể từ lúc cabin ở vị trí thấp nhất. Lần đầu tiên cabin đạt độ cao 70 m là ở phút thứ mấy?', '10',
   'Giải phương trình cos(πt/15) = −1/2, chọn nghiệm dương nhỏ nhất.',
   ['cos u = −1/2 ⇔ u = ±2π/3 + k2π.'],
   ['50 − 40cos(πt/15) = 70 ⇔ cos(πt/15) = −1/2.', 'Nghiệm dương nhỏ nhất: πt/15 = 2π/3 ⇔ t = 10.'],
   v=10)
le('11-II-5', 'Một bể chứa 1000 lít nước. Mỗi ngày người ta dùng 20% lượng nước đang có rồi bơm thêm 100 lít. Gọi uₙ là lượng nước (lít) sau n ngày. Tính u₃.', '756',
   'Lập công thức truy hồi uₙ₊₁ = 0,8uₙ + 100 rồi tính lần lượt.',
   ['Dãy số cho bởi hệ thức truy hồi: tính từng số hạng từ số hạng trước.'],
   ['u₀ = 1000, uₙ₊₁ = 0,8uₙ + 100.', 'u₁ = 900, u₂ = 820, u₃ = 0,8·820 + 100 = 756.'],
   v=(lambda: (lambda f: f(f(f(1000))))(lambda u: 0.8*u + 100))())
le('11-II-6', 'Một khán đài có hàng ghế đầu 20 ghế, mỗi hàng sau nhiều hơn hàng trước 3 ghế. Cần ít nhất bao nhiêu hàng để khán đài có từ 1000 ghế trở lên?', '21',
   'Số ghế các hàng lập cấp số cộng; giải bất phương trình Sₙ ≥ 1000 với n nguyên dương.',
   ['Sₙ = n[2u₁ + (n − 1)d]/2.'],
   ['Sₙ = n(40 + 3(n − 1))/2 ≥ 1000 ⇔ 3n² + 37n − 2000 ≥ 0.', 'Nghiệm dương của 3n² + 37n − 2000 = 0 là n ≈ 20,4.', 'Kiểm tra: S₂₀ = 970 < 1000, S₂₁ = 1050 ≥ 1000. Vậy cần 21 hàng.'],
   v=min(n for n in range(1, 100) if n*(40 + 3*(n - 1))/2 >= 1000), src=('KHTN', 'III.4'))
le('11-II-7', 'Một máy móc giá 500 triệu đồng, mỗi năm giá trị giảm 12% so với năm trước. Sau ít nhất bao nhiêu năm thì giá trị máy còn dưới 200 triệu đồng?', '8',
   'Giá trị sau n năm là cấp số nhân công bội 0,88; giải bất phương trình mũ.',
   ['Cấp số nhân: uₙ = u₁·qⁿ⁻¹; giá trị sau n năm: 500·0,88ⁿ.'],
   ['500·0,88ⁿ < 200 ⇔ 0,88ⁿ < 0,4 ⇔ n > ln 0,4/ln 0,88 ≈ 7,17.', 'Kiểm tra: 0,88⁷ ≈ 0,409; 0,88⁸ ≈ 0,360. Vậy n = 8.'],
   v=min(n for n in range(1, 50) if 500*0.88**n < 200), src=('HP13', 'I.11'))
le('11-III-8', 'Đường kính thân (cm) của 50 cây gỗ được ghi theo nhóm: [40; 45): 6 cây; [45; 50): 14 cây; [50; 55): 18 cây; [55; 60): 9 cây; [60; 65): 3 cây. Bao nhiêu phần trăm số cây có đường kính từ 50 cm trở lên?', '60',
   'Cộng tần số các nhóm có đầu mút trái từ 50 trở lên rồi chia cho cỡ mẫu.',
   ['Tần số tương đối của một nhóm = tần số/cỡ mẫu.'],
   ['Số cây có đường kính ≥ 50 cm: 18 + 9 + 3 = 30.', 'Tỉ lệ: 30/50 = 60%.'],
   v=30/50*100, src=('NA', 'I.9'))
le('11-III-9', 'Nhiệt độ trung bình (°C) trong 30 ngày tại một thành phố: [26; 28): 4 ngày; [28; 30): 9 ngày; [30; 32): 11 ngày; [32; 34): 6 ngày. Tìm mốt của mẫu số liệu ghép nhóm.', '30,6',
   'Nhóm chứa mốt là nhóm có tần số lớn nhất; áp dụng công thức mốt với tần số hai nhóm kề.',
   ['Mₒ = a + (mₖ − mₖ₋₁)/((mₖ − mₖ₋₁) + (mₖ − mₖ₊₁))·h.'],
   ['Nhóm chứa mốt [30; 32): a = 30, h = 2, mₖ = 11, mₖ₋₁ = 9, mₖ₊₁ = 6.', 'Mₒ = 30 + 2/(2 + 5)·2 ≈ 30,57.'],
   v=30 + 2/7*2, nd=1, r=R1, src=('HP13', 'I.8'))
le('11-IV-10', 'Người ta cắm 6 cột mốc trong không gian sao cho không có 4 cột mốc nào cùng nằm trên một mặt phẳng. Mỗi mặt phẳng đi qua đúng 3 cột mốc. Có bao nhiêu mặt phẳng như vậy?', '20',
   'Ba điểm không thẳng hàng xác định duy nhất một mặt phẳng; không có 4 điểm đồng phẳng nên mỗi bộ 3 điểm cho một mặt phẳng khác nhau.',
   ['Qua ba điểm không thẳng hàng có đúng một mặt phẳng.'],
   ['Không có 4 điểm đồng phẳng nên cũng không có 3 điểm thẳng hàng, và hai bộ 3 điểm khác nhau cho hai mặt phẳng khác nhau.', 'Số mặt phẳng: C(6, 3) = 20.'],
   v=comb(6, 3))
le('11-IV-11', 'Một khung thép hình hộp chữ nhật gồm 12 thanh nằm trên 12 cạnh. Có bao nhiêu cặp thanh (không kể thứ tự) nằm trên hai đường thẳng chéo nhau?', '24',
   'Với mỗi cạnh, phân loại 11 cạnh còn lại: song song, cắt nhau, chéo nhau.',
   ['Hai đường thẳng chéo nhau khi không cùng nằm trong một mặt phẳng.', 'Mỗi cạnh của hình hộp song song với 3 cạnh, cắt 4 cạnh.'],
   ['Mỗi cạnh chéo nhau với 11 − 3 − 4 = 4 cạnh.', 'Số cặp: 12·4/2 = 24 (mỗi cặp được đếm hai lần).'],
   v=12*4//2)
le('11-IV-12', 'Một khung tứ diện ABCD có AC = 90 cm, BD = 60 cm. Một tấm kính phẳng đi qua điểm M trên cạnh AB với AM = AB/3, song song với AC và BD, cắt khung theo một hình bình hành. Chu vi hình bình hành đó là bao nhiêu xentimét?', '160',
   'Mặt phẳng song song với một đường thẳng cắt các mặt chứa đường thẳng đó theo giao tuyến song song; dùng định lí Thalès trong từng mặt.',
   ['(P) ∥ a, a ⊂ (Q) thì giao tuyến của (P) và (Q) song song với a.', 'Định lí Thalès trong tam giác.'],
   ['Trong (ABC): MN ∥ AC (N ∈ BC), MN/AC = BM/BA = 2/3 ⇒ MN = 60.', 'Trong (ABD): MQ ∥ BD (Q ∈ AD), MQ/BD = AM/AB = 1/3 ⇒ MQ = 20.', 'Chu vi: 2(60 + 20) = 160 cm.'],
   v=2*(90*2/3 + 60/3))
le('11-IV-13', 'Một kim tự tháp kính dạng hình chóp tứ giác đều cao 9 m, cạnh đáy 12 m. Sàn tầng quan sát là thiết diện của khối chóp với mặt phẳng song song với đáy, cách đáy 3 m. Diện tích sàn là bao nhiêu mét vuông?', '64',
   'Mặt phẳng song song với đáy cắt hình chóp theo đa giác đồng dạng với đáy, tỉ số bằng tỉ số khoảng cách tới đỉnh.',
   ['Thiết diện song song với đáy đồng dạng với đáy, tỉ số k = h′/h (h′ là khoảng cách từ đỉnh).', 'Diện tích tỉ lệ k².'],
   ['Khoảng cách từ đỉnh đến sàn: 9 − 3 = 6 m, k = 6/9 = 2/3.', 'Cạnh sàn: 12·2/3 = 8 m, diện tích 64 m².'],
   v=(12*6/9)**2)
le('11-IV-14', 'Cùng một thời điểm, cột cờ cao 6 m có bóng nắng trên mặt đất dài 4 m, còn bóng của một tòa nhà dài 18 m. Coi tia nắng song song, cột cờ và tòa nhà cùng vuông góc với mặt đất. Tòa nhà cao bao nhiêu mét?', '27',
   'Bóng nắng là hình chiếu song song theo phương tia nắng; hai đoạn thẳng song song có tỉ số độ dài được giữ nguyên.',
   ['Phép chiếu song song giữ nguyên tỉ số độ dài của hai đoạn thẳng song song (hoặc cùng nằm trên một đường thẳng).'],
   ['Cột cờ và tòa nhà song song nên chiều cao/bóng như nhau: 6/4 = H/18.', 'H = 18·1,5 = 27 m.'],
   v=18*6/4)
le('11-V-15', 'Mỗi sáng một người uống 100 mg thuốc; sau 24 giờ cơ thể chỉ còn giữ 25% lượng thuốc đang có. Về lâu dài, lượng thuốc trong cơ thể ngay sau mỗi lần uống tiến dần tới bao nhiêu miligam?', '133',
   'Lượng thuốc sau lần uống thứ n là tổng của một cấp số nhân; tính giới hạn khi n → +∞.',
   ['Cấp số nhân lùi vô hạn |q| < 1: S = u₁/(1 − q).'],
   ['Sau lần uống thứ n: 100 + 100·0,25 + … + 100·0,25ⁿ⁻¹.', 'Giới hạn: 100/(1 − 0,25) ≈ 133,3 mg.'],
   v=100/(1 - 0.25), r=R0)
le('11-V-16', 'Một bể chứa 5000 lít nước ngọt. Người ta bơm nước muối nồng độ 30 g/lít vào bể với tốc độ 25 lít/phút. Nồng độ muối trong bể sau t phút là C(t) (g/lít). Khi t rất lớn, C(t) tiến tới giá trị nào?', '30',
   'Lập C(t) = lượng muối/thể tích nước, rồi tính giới hạn khi t → +∞.',
   ['Giới hạn của phân thức bậc nhất khi t → +∞ bằng tỉ số hệ số của t.'],
   ['Sau t phút: muối 30·25t = 750t (g), nước 5000 + 25t (lít).', 'C(t) = 750t/(5000 + 25t) = 30t/(200 + t) → 30 khi t → +∞.'],
   v=30)
le('11-V-17', 'Cước gửi hàng f(x) (nghìn đồng) theo khối lượng x (kg): f(x) = 20 + 8x khi 0 < x ≤ 10 và f(x) = a + 5x khi x > 10. Tìm a để hàm cước liên tục tại x = 10.', '50',
   'Liên tục tại x = 10 khi giới hạn bên phải bằng giá trị f(10).',
   ['f liên tục tại x₀ ⇔ lim f(x) khi x → x₀ bằng f(x₀).'],
   ['f(10) = 20 + 80 = 100 và giới hạn bên trái cũng bằng 100.', 'Giới hạn bên phải: a + 50. Cần a + 50 = 100 ⇒ a = 50.'],
   v=100 - 50)
le('11-VI-18', 'Chất phóng xạ C-14 có chu kì bán rã 5730 năm: lượng còn lại sau t năm là m(t) = m₀·(1/2)^(t/5730). Sau 2000 năm, lượng C-14 còn lại bằng bao nhiêu phần trăm lượng ban đầu?', '78,5',
   'Thay t = 2000 vào công thức lũy thừa với số mũ thực rồi đổi ra phần trăm.',
   ['aˣ với a > 0 xác định với mọi số thực x; dùng máy tính để tính giá trị.'],
   ['m(2000)/m₀ = (1/2)^(2000/5730) = 2^(−0,349…).', '≈ 0,785, tức khoảng 78,5%.'],
   v=0.5**(2000/5730)*100, nd=1, r=R1)
le('11-VI-19', 'Mức cường độ âm L = 10·log(I/I₀) (dB). Một loa phát ra âm 70 dB. Nếu 25 loa giống hệt nhau cùng phát (cường độ cộng lại) thì mức cường độ âm là bao nhiêu dB?', '84',
   'Cường độ tăng 25 lần; dùng log(ab) = log a + log b.',
   ['log(ab) = log a + log b.'],
   ['L′ = 10·log(25I/I₀) = 10·log 25 + 10·log(I/I₀) = 70 + 10·log 25.', '10·log 25 ≈ 13,98 nên L′ ≈ 83,98 dB.'],
   v=70 + 10*log10(25), r=R0)
le('11-VI-20', 'Số sản phẩm bán được của một hãng là n(x) = 200 + 40·ln(1 + x) khi chi x triệu đồng cho quảng cáo. Để bán được ít nhất 300 sản phẩm, hãng phải chi tối thiểu bao nhiêu triệu đồng?', '11,2',
   'Giải bất phương trình lôgarit ln(1 + x) ≥ 2,5 bằng cách mũ hóa (hàm eˣ đồng biến).',
   ['ln u ≥ c ⇔ u ≥ eᶜ (u > 0).'],
   ['200 + 40·ln(1 + x) ≥ 300 ⇔ ln(1 + x) ≥ 2,5.', '1 + x ≥ e^2,5 ≈ 12,18 ⇔ x ≥ 11,18.'],
   v=exp(2.5) - 1, nd=1, r=R1, src=('NA', 'II.3'))
le('11-VI-21', 'Dân số một tỉnh là 1,2 triệu người, tăng đều 1,5% mỗi năm. Sau ít nhất bao nhiêu năm dân số vượt 1,5 triệu người?', '15',
   'Lập bất phương trình mũ 1,2·1,015ⁿ > 1,5 rồi lôgarit hóa hai vế.',
   ['aⁿ > b (a > 1) ⇔ n > logₐ b.'],
   ['1,015ⁿ > 1,25 ⇔ n > ln 1,25/ln 1,015 ≈ 14,99.', 'n nguyên nên n = 15 (kiểm tra 1,015¹⁵ ≈ 1,2502 > 1,25).'],
   v=min(n for n in range(1, 100) if 1.2*1.015**n > 1.5))
le('11-VII-22', 'Một căn phòng dạng hình hộp chữ nhật ABCD.A′B′C′D′ có AB = 8 m, AD = 6 m, AA′ = 4 m. Góc giữa hai đường thẳng BD và A′C′ bằng bao nhiêu độ?', '74',
   'A′C′ song song với AC nên góc cần tìm bằng góc giữa hai đường chéo AC, BD của đáy.',
   ['Góc giữa a và b bằng góc giữa a′ ∥ a và b.', 'Góc giữa hai đường thẳng thuộc [0°; 90°].'],
   ['A′C′ ∥ AC nên góc (BD, A′C′) = góc (BD, AC).', 'Đặt A(0; 0), C(8; 6), B(8; 0), D(0; 6): AC = (8; 6), BD = (−8; 6), cos = |−64 + 36|/100 = 0,28.', 'Góc ≈ 73,74°.'],
   v=degrees(acos(0.28)), r=R0, src=('TH', 'III.6'))
le('11-VII-23', 'Cột cờ SO vuông góc với mặt đất, cao 8 m. Ba dây néo dài 10 m nối S với ba điểm A, B, C trên mặt đất tạo thành tam giác đều. Cạnh của tam giác ABC dài bao nhiêu mét?', '10,4',
   'SO vuông góc mặt đất nên OA = OB = OC: O là tâm đường tròn ngoại tiếp tam giác đều ABC.',
   ['SO ⊥ (ABC) thì SO vuông góc với mọi đường thẳng trong (ABC).', 'Tam giác đều cạnh a có bán kính ngoại tiếp a/√3.'],
   ['OA = √(10² − 8²) = 6 m, tương tự OB = OC = 6.', 'Cạnh a = 6√3 ≈ 10,39 m.'],
   v=6*sqrt(3), nd=1, r=R1)
le('11-VII-24', 'Căn phòng hình hộp chữ nhật dài 8 m, rộng 6 m, cao 4 m. Một sợi dây đèn trang trí căng thẳng từ một góc sàn đến góc trần đối diện. Góc giữa sợi dây và mặt sàn bằng bao nhiêu độ?', '21,8',
   'Hình chiếu của sợi dây lên sàn là đường chéo sàn; góc cần tìm có tan bằng chiều cao/đường chéo sàn.',
   ['Góc giữa đường thẳng và mặt phẳng là góc giữa nó và hình chiếu của nó lên mặt phẳng.'],
   ['Đường chéo sàn: √(8² + 6²) = 10 m.', 'tan φ = 4/10 ⇒ φ ≈ 21,8°.'],
   v=degrees(atan(0.4)), nd=1, r=R1, src=('HP13', 'II.1'))
le('11-VII-25', 'Mái nhà gồm hai mặt phẳng nghiêng đối xứng, nóc mái cao hơn mặt phẳng trần 1,5 m, bề ngang nhà 8 m. Số đo góc nhị diện tạo bởi hai mặt mái (cạnh là đường nóc) bằng bao nhiêu độ?', '139',
   'Dựng mặt cắt vuông góc với đường nóc: được tam giác cân, góc ở đỉnh là góc phẳng nhị diện.',
   ['Góc phẳng nhị diện: hai tia cùng vuông góc với cạnh tại một điểm, mỗi tia nằm trên một mặt.'],
   ['Mặt cắt là tam giác cân đáy 8 m, cao 1,5 m.', 'Nửa góc ở đỉnh: tan = 4/1,5 ⇒ ≈ 69,44°.', 'Góc nhị diện ≈ 138,9°.'],
   v=2*degrees(atan(4/1.5)), r=R0, src=('HP13', 'II.1'))
le('11-VII-26', 'Một chiếc lều dạng hình chóp tứ giác đều có cạnh đáy 4 m, chiều cao 3 m. Khoảng cách từ tâm O của đáy đến một mặt bên của lều là bao nhiêu mét?', '1,66',
   'Hạ OH vuông góc với trung đoạn SM của mặt bên; OH là đường cao của tam giác vuông SOM.',
   ['Trong tam giác vuông: 1/OH² = 1/OS² + 1/OM².'],
   ['M là trung điểm cạnh đáy: OM = 2, SO = 3.', 'OH = OS·OM/√(OS² + OM²) = 6/√13 ≈ 1,664 m.'],
   v=6/sqrt(13), nd=2, r=R2, src=('VINH', 'III.3'))
le('11-VII-27', 'Chân một tháp đèn đổ bê tông dạng khối chóp cụt tứ giác đều, cạnh đáy lớn 4 m, cạnh đáy nhỏ 2 m, cạnh bên 2,5 m. Bê tông giá 1,6 triệu đồng/m³. Tiền mua bê tông là bao nhiêu triệu đồng?', '31',
   'Tính chiều cao từ cạnh bên qua hình thang chứa hai nửa đường chéo đáy, rồi dùng công thức thể tích chóp cụt.',
   ['V = h(S + S′ + √(SS′))/3.', 'Hình chiếu cạnh bên trên đáy lớn dài (nửa đường chéo đáy lớn − nửa đường chéo đáy nhỏ).'],
   ['Nửa đường chéo: 2√2 và √2, hiệu √2. h = √(2,5² − 2) = √4,25 ≈ 2,062 m.', 'V = h(16 + 4 + 8)/3 ≈ 19,24 m³.', 'Chi phí ≈ 1,6·19,24 ≈ 30,8 triệu đồng.'],
   v=1.6*sqrt(4.25)*28/3, r=R0, src=('HP13', 'III.3'))
le('11-VIII-28', 'Một tòa nhà có ba hệ thống báo cháy hoạt động độc lập, xác suất phát hiện đám cháy lần lượt là 0,9; 0,8; 0,7. Tính xác suất có đúng hai hệ thống phát hiện đám cháy.', '0,40',
   'Chia thành ba trường hợp xung khắc (hệ thống nào không phát hiện), mỗi trường hợp là giao của các biến cố độc lập.',
   ['A, B độc lập thì P(AB) = P(A)P(B).', 'Các biến cố xung khắc: P(A ∪ B) = P(A) + P(B).'],
   ['Chỉ hệ thống 3 bỏ sót: 0,9·0,8·0,3 = 0,216; chỉ hệ thống 2 bỏ sót: 0,9·0,2·0,7 = 0,126; chỉ hệ thống 1 bỏ sót: 0,1·0,8·0,7 = 0,056.', 'Tổng: 0,398 ≈ 0,40.'],
   v=0.9*0.8*0.3 + 0.9*0.2*0.7 + 0.1*0.8*0.7, nd=2, r=R2, src=('TH', 'II.1'))
le('11-VIII-29', 'Một lớp có 40 học sinh, 25 em thích bóng đá, 18 em thích bóng rổ, 9 em thích cả hai môn. Chọn ngẫu nhiên một em. Tính xác suất em đó thích ít nhất một trong hai môn.', '0,85',
   'Dùng công thức cộng xác suất cho hai biến cố không xung khắc.',
   ['P(A ∪ B) = P(A) + P(B) − P(AB).'],
   ['P = 25/40 + 18/40 − 9/40 = 34/40 = 0,85.'],
   v=(25 + 18 - 9)/40, nd=2)
le('11-VIII-30', 'Một đàn ngỗng con gồm 3 con, mỗi con sống sót qua mùa đông với xác suất 0,7, độc lập với nhau. Tính xác suất có ít nhất 2 con sống sót.', '0,78',
   'Tách thành hai trường hợp xung khắc: đúng 2 con và cả 3 con, rồi dùng quy tắc nhân cho các biến cố độc lập.',
   ['A, B, C độc lập thì P(ABC) = P(A)P(B)P(C).'],
   ['Đúng 2 con: 3·0,7²·0,3 = 0,441.', 'Cả 3 con: 0,7³ = 0,343.', 'Tổng: 0,784 ≈ 0,78.'],
   v=3*0.49*0.3 + 0.343, nd=2, r=R2, src=('TH', 'II.1'))
le('11-IX-31', 'Một vật rơi tự do có quãng đường s(t) = 4,9t² (m), t tính bằng giây. Vận tốc tức thời của vật tại thời điểm t = 3 giây là bao nhiêu m/s?', '29,4',
   'Vận tốc tức thời là đạo hàm của quãng đường; tính bằng định nghĩa (giới hạn tỉ số gia số) hoặc công thức.',
   ['v(t₀) = s′(t₀) = lim (s(t) − s(t₀))/(t − t₀) khi t → t₀.'],
   ['(s(t) − s(3))/(t − 3) = 4,9(t² − 9)/(t − 3) = 4,9(t + 3).', 'Khi t → 3: v(3) = 4,9·6 = 29,4 m/s.'],
   v=4.9*6, nd=1)
le('11-IX-32', 'Mức ô nhiễm của một hồ sau t tháng xử lý là P(t) = t³/3 − 10t² + 75t + 200 (0 ≤ t ≤ 15). Tốc độ giảm ô nhiễm là v(t) = −P′(t). Tốc độ giảm ô nhiễm lớn nhất tại tháng thứ mấy?', '10',
   'Tính đạo hàm P′(t), khi đó v(t) là hàm bậc hai; tìm đỉnh parabol.',
   ['(tⁿ)′ = n·tⁿ⁻¹.', 'Hàm bậc hai at² + bt + c (a < 0) lớn nhất tại t = −b/(2a).'],
   ['P′(t) = t² − 20t + 75 ⇒ v(t) = −t² + 20t − 75.', 'v lớn nhất tại t = 10 (v(10) = 25).'],
   v=max(range(0, 16), key=lambda t: -t*t + 20*t - 75), src=('NA', 'III.6'))
le('11-IX-33', 'Chiều cao một cây lúa là h(t) = −t⁴/32 + t³/2 + 20 (cm) sau t tuần. Tốc độ tăng chiều cao là v(t) = h′(t). Cây tăng chiều cao nhanh nhất vào tuần thứ mấy?', '8',
   'v lớn nhất khi v′(t) = h″(t) đổi dấu từ dương sang âm.',
   ['h″(t) = (h′(t))′.'],
   ['v(t) = h′(t) = −t³/8 + 3t²/2.', 'v′(t) = h″(t) = −3t²/8 + 3t = 0 ⇔ t = 0 hoặc t = 8; v′ > 0 trên (0; 8), v′ < 0 khi t > 8.', 'Cây tăng nhanh nhất tại t = 8.'],
   v=max(range(0, 13), key=lambda t: -t**3/8 + 1.5*t*t), src=('HP13', 'II.4'))

# ===== Lớp 12 =====
le('12-I-1', 'Doanh thu (triệu đồng) của một cửa hàng sau t tháng là R(t) = −t³ + 12t² + 60t, 0 ≤ t ≤ 15. Doanh thu tăng trên khoảng (0; a) và giảm trên (a; 15). Tìm a.', '10',
   'Xét dấu R′(t) trên [0; 15].',
   ['R′ > 0 trên khoảng thì R đồng biến; R′ < 0 thì R nghịch biến.'],
   ['R′(t) = −3t² + 24t + 60 = −3(t − 10)(t + 2).', 'Trên [0; 15]: R′ > 0 khi t < 10, R′ < 0 khi t > 10. Vậy a = 10.'],
   v=10, src=('HP13', 'II.4'))
le('12-I-2', 'Một doanh nghiệp sản xuất và bán x nghìn sản phẩm (x nguyên, 0 < x ≤ 40) với giá p(x) = 150 − 2x (nghìn đồng/sản phẩm). Chi phí sản xuất là C(x) = 400 + 54x + 0,5x² + 0,01x³ (triệu đồng). Tìm x để lợi nhuận lớn nhất.', '17',
   'Lợi nhuận = doanh thu − chi phí; khảo sát hàm bậc ba trên [1; 40], so sánh hai số nguyên kề điểm cực đại.',
   ['Doanh thu x nghìn sản phẩm với giá p nghìn đồng là x·p triệu đồng.', 'Giá trị lớn nhất trên đoạn đạt tại điểm cực trị hoặc đầu mút.'],
   ['L(x) = x(150 − 2x) − C(x) = −0,01x³ − 2,5x² + 96x − 400.', 'L′(x) = −0,03x² − 5x + 96 = 0 ⇒ x ≈ 17,39 (nghiệm dương), L′ đổi dấu từ + sang −.',
    'x nguyên: L(17) ≈ 460,37; L(18) ≈ 459,68. Vậy x = 17.'],
   v=max(range(1, 41), key=lambda x: -0.01*x**3 - 2.5*x*x + 96*x - 400), src=('VINH', 'III.6'))
le('12-I-3', 'Số cá trong một hồ sau t tháng thả nuôi được ước tính bởi N(t) = (500t + 300)/(t + 2) (con). Theo thời gian, số cá tiến dần tới giá trị giới hạn (tiệm cận ngang). Sau bao nhiêu tháng số cá đạt 90% giá trị giới hạn đó?', '12',
   'Tìm tiệm cận ngang y = 500, rồi giải N(t) = 450.',
   ['Đồ thị y = (ax + b)/(cx + d) có tiệm cận ngang y = a/c.'],
   ['lim N(t) = 500 khi t → +∞, 90% là 450.', '(500t + 300)/(t + 2) = 450 ⇔ 500t + 300 = 450t + 900 ⇔ t = 12.'],
   v=12)
le('12-I-4', 'Cho hàm số y = x³ − 3x + 2. Khoảng cách giữa hai điểm cực trị của đồ thị hàm số bằng bao nhiêu?', '4,47',
   'Giải y′ = 0 để tìm hai điểm cực trị, rồi tính độ dài đoạn nối.',
   ['Điểm cực trị: y′ đổi dấu.', 'AB = √((x₂ − x₁)² + (y₂ − y₁)²).'],
   ['y′ = 3x² − 3 = 0 ⇔ x = ±1: hai điểm A(−1; 4), B(1; 0).', 'AB = √(4 + 16) = √20 ≈ 4,47.'],
   v=sqrt(20), nd=2, r=R2, src=('HP13', 'II.2'))
le('12-I-5', 'Một tuyến xe khách dài 300 km chạy với vận tốc v (km/h), 60 ≤ v ≤ 100. Chi phí nhiên liệu mỗi giờ là 0,05v² (nghìn đồng), chi phí cố định (tài xế, khấu hao) là 320 nghìn đồng mỗi giờ. Vận tốc bao nhiêu thì tổng chi phí chuyến đi nhỏ nhất?', '80',
   'Tổng chi phí = (chi phí mỗi giờ)·(số giờ = 300/v); khảo sát hàm theo v.',
   ['Hàm T(v) = av + b/v (a, b > 0) nhỏ nhất tại v = √(b/a) (bất đẳng thức Cô-si hoặc đạo hàm).'],
   ['T(v) = (300/v)(0,05v² + 320) = 15v + 96000/v.', 'T′(v) = 15 − 96000/v² = 0 ⇔ v = 80 ∈ [60; 100].'],
   v=sqrt(320/0.05), src=('NA', 'III.2'))
le('12-II-6', 'Một đèn chùm nặng 60 N được treo bởi 3 sợi xích giống nhau, mỗi sợi tạo với phương thẳng đứng góc 30°, các lực căng có độ lớn bằng nhau. Độ lớn lực căng mỗi sợi xích là bao nhiêu newton?', '23,1',
   'Đèn cân bằng: tổng ba lực căng cân bằng với trọng lực; thành phần nằm ngang triệt tiêu, thành phần thẳng đứng cộng lại bằng 60 N.',
   ['Vật cân bằng: tổng các vectơ lực bằng 0.', 'Thành phần thẳng đứng của lực F tạo với phương thẳng đứng góc α là F·cos α.'],
   ['3·T·cos 30° = 60.', 'T = 20/cos 30° = 40/√3 ≈ 23,09 N.'],
   v=20/cos(radians(30)), nd=1, r=R1, src=('NA', 'II.4'))
le('12-II-7', 'Đặt hệ trục Oxyz tại một góc sàn của căn phòng hình hộp chữ nhật: Ox dọc tường dài 6 m, Oy dọc tường dài 5 m, Oz hướng lên trần cao 3 m (đơn vị mét). Một bóng đèn treo thẳng dưới tâm trần nhà, thấp hơn trần 0,5 m, có tọa độ (a; b; c). Tính a + b + c.', '8',
   'Tâm trần là tâm hình chữ nhật trần ở độ cao 3 m; hạ xuống 0,5 m theo phương Oz.',
   ['Trung điểm/tâm: trung bình cộng tọa độ.'],
   ['Tâm trần: (3; 2,5; 3). Bóng đèn: (3; 2,5; 2,5).', 'a + b + c = 3 + 2,5 + 2,5 = 8.'],
   v=3 + 2.5 + 2.5, src=('HP13', 'II.1'))
le('12-II-8', 'Trong không gian Oxyz (đơn vị mét), tay cầm của máy kéo cáp ở D(0; 0,7; 1,2), hai sợi cáp nối D với hai ròng rọc A(−1,5; 0; 2) và B(1,5; 0; 2). Góc giữa hai sợi cáp DA và DB bằng bao nhiêu độ?', '109',
   'Tính hai vectơ DA, DB theo tọa độ rồi dùng công thức cos góc giữa hai vectơ.',
   ['cos(u, v) = (x₁x₂ + y₁y₂ + z₁z₂)/(|u|·|v|).'],
   ['DA = (−1,5; −0,7; 0,8), DB = (1,5; −0,7; 0,8).', 'DA·DB = −2,25 + 0,49 + 0,64 = −1,12; |DA|² = |DB|² = 3,38.', 'cos = −1,12/3,38 ≈ −0,331 ⇒ góc ≈ 109,4°.'],
   v=degrees(acos(-1.12/3.38)), r=R0, src=('NA', 'II.4'))
le('12-III-9', 'Tuổi thọ (năm) của 40 con rùa trong một vườn thú: [10; 20): 5; [20; 30): 12; [30; 40): 14; [40; 50): 6; [50; 60): 3. Tính khoảng tứ phân vị của mẫu số liệu ghép nhóm.', '15,1',
   'Tìm Q₁ (vị trí n/4 = 10) và Q₃ (vị trí 3n/4 = 30) bằng công thức nội suy trong nhóm chứa chúng.',
   ['Qₖ = a + (kn/4 − C)/m·h, C là tần số tích lũy trước nhóm.', 'ΔQ = Q₃ − Q₁.'],
   ['Q₁ thuộc [20; 30): Q₁ = 20 + (10 − 5)/12·10 ≈ 24,17.', 'Q₃ thuộc [30; 40): Q₃ = 30 + (30 − 17)/14·10 ≈ 39,29.', 'ΔQ ≈ 15,12.'],
   v=(30 + 13/14*10) - (20 + 5/12*10), nd=1, r=R1, src=('HP13', 'I.9'))
le('12-III-10', 'Thời gian tập luyện mỗi ngày (phút) của 20 thành viên một câu lạc bộ: [30; 50): 3; [50; 70): 5; [70; 90): 8; [90; 110): 4. Tính độ lệch chuẩn của mẫu số liệu ghép nhóm.', '19,3',
   'Dùng giá trị đại diện là trung điểm nhóm, tính số trung bình, trung bình bình phương rồi phương sai.',
   ['s² = (Σmᵢxᵢ²)/n − x̄²; s = √s².'],
   ['Giá trị đại diện 40, 60, 80, 100. x̄ = (120 + 300 + 640 + 400)/20 = 73.', 'Trung bình bình phương: (4800 + 18000 + 51200 + 40000)/20 = 5700.', 's² = 5700 − 73² = 371 ⇒ s ≈ 19,26.'],
   v=sqrt(5700 - 73**2), nd=1, r=R1, src=('NA', 'II.1'))
le('12-IV-11', 'Tốc độ tăng chiều cao của một cây là v(t) = 0,3t² − 0,02t³ (cm/tuần), t tính bằng tuần. Lúc trồng cây cao 10 cm. Sau 10 tuần cây cao bao nhiêu xentimét?', '60',
   'Chiều cao h(t) là một nguyên hàm của v(t); tìm hằng số C từ h(0) = 10.',
   ['∫tⁿdt = tⁿ⁺¹/(n + 1) + C.'],
   ['h(t) = 0,1t³ − 0,005t⁴ + C, h(0) = 10 ⇒ C = 10.', 'h(10) = 100 − 50 + 10 = 60 cm.'],
   v=0.1*1000 - 0.005*10**4 + 10, src=('HP13', 'II.4'))
le('12-IV-12', 'Một ô tô đang chạy 72 km/h thì phanh, chuyển động chậm dần đều với gia tốc −4 m/s² cho đến khi tốc độ còn 36 km/h. Quãng đường ô tô đi được trong thời gian phanh đó là bao nhiêu mét?', '37,5',
   'Đổi đơn vị, lập v(t) = v₀ + at, tìm thời gian phanh rồi tích phân vận tốc.',
   ['Quãng đường từ t = a đến t = b: s = ∫ₐᵇ v(t)dt (v ≥ 0).', '1 m/s = 3,6 km/h.'],
   ['72 km/h = 20 m/s, 36 km/h = 10 m/s; v(t) = 20 − 4t = 10 ⇔ t = 2,5 s.', 's = ∫₀^2,5 (20 − 4t)dt = 50 − 12,5 = 37,5 m.'],
   v=20*2.5 - 2*2.5**2, nd=1, src=('TH', 'II.2'))
le('12-IV-13', 'Một cánh cửa hình chữ nhật rộng 1,5 m, cao 2 m. Phần kính giới hạn bởi một parabol có đỉnh ở giữa mép trên, hai chân ở hai góc dưới của cửa, giá 0,8 triệu đồng/m²; phần còn lại làm bằng gỗ giá 1,2 triệu đồng/m². Tổng chi phí làm cánh cửa là bao nhiêu triệu đồng?', '2,8',
   'Diện tích hình parabol tính bằng tích phân (bằng 2/3 diện tích hình chữ nhật bao quanh); phần gỗ là phần còn lại.',
   ['Đặt parabol y = 2 − (32/9)x² trên [−0,75; 0,75]: S = ∫ y dx.', 'Kết quả quen thuộc: S = (2/3)·đáy·chiều cao.'],
   ['S kính = (2/3)·1,5·2 = 2 m²; S gỗ = 3 − 2 = 1 m².', 'Chi phí: 2·0,8 + 1·1,2 = 2,8 triệu đồng.'],
   v=2*0.8 + 1*1.2, nd=1, src=('KHTN', 'III.2'))
le('12-V-14', 'Trong không gian Oxyz (đơn vị mét), một mặt mái nhà nằm trong mặt phẳng (P): 3x + 4z − 40 = 0. Một bóng đèn treo tại I(4; 5; 2). Khoảng cách từ bóng đèn đến mặt phẳng mái là bao nhiêu mét?', '4',
   'Áp dụng công thức khoảng cách từ một điểm đến mặt phẳng.',
   ['d(M, (P)) = |ax₀ + by₀ + cz₀ + d|/√(a² + b² + c²).'],
   ['d = |3·4 + 4·2 − 40|/√(9 + 16) = 20/5 = 4.'],
   v=abs(12 + 8 - 40)/5, src=('HP13', 'II.1'))
le('12-V-15', 'Trong không gian Oxyz (đơn vị km), một khinh khí cầu bay thẳng từ A(0; 0; 1) theo hướng đi qua B(4; 2; 3). Trạm quan sát đặt tại gốc O. Khoảng cách gần nhất từ trạm đến đường bay là bao nhiêu kilômét?', '0,91',
   'Khoảng cách từ O đến đường thẳng AB tính bằng tích có hướng.',
   ['d(M, Δ) = |[AM, u]|/|u|, u là vectơ chỉ phương của Δ.'],
   ['u = AB = (4; 2; 2), AO = (0; 0; −1).', '[AO, u] = (2; −4; 0), độ dài √20.', 'd = √20/√24 ≈ 0,913 km.'],
   v=sqrt(20)/sqrt(24), nd=2, r=R2, src=('NA', 'III.3'))
le('12-V-16', 'Trong không gian Oxyz, mặt đất là mặt phẳng (Oxy), một tấm pin mặt trời nằm trong mặt phẳng (P): 2x + y + 2z − 8 = 0. Góc nghiêng của tấm pin so với mặt đất bằng bao nhiêu độ?', '48,2',
   'Góc giữa hai mặt phẳng tính qua hai vectơ pháp tuyến.',
   ['cos((P), (Q)) = |n₁·n₂|/(|n₁|·|n₂|).'],
   ['n(P) = (2; 1; 2), n(Oxy) = (0; 0; 1).', 'cos φ = 2/3 ⇒ φ ≈ 48,19°.'],
   v=degrees(acos(2/3)), nd=1, r=R1)
le('12-V-17', 'Trong không gian Oxyz (đơn vị km), mặt đất là mặt phẳng (Oxy). Vùng phủ sóng của một trạm phát đặt trên đỉnh tháp là khối cầu tâm I(0; 0; 5), bán kính 13. Vùng phủ sóng trên mặt đất là hình tròn có bán kính bao nhiêu kilômét?', '12',
   'Giao của mặt cầu với mặt phẳng là đường tròn có bán kính r = √(R² − d²).',
   ['Mặt phẳng cách tâm d < R cắt mặt cầu theo đường tròn bán kính √(R² − d²).'],
   ['d(I, (Oxy)) = 5.', 'r = √(169 − 25) = 12 km.'],
   v=sqrt(169 - 25))
le('12-VI-18', 'Có 12 bao lì xì: 4 bao 50 nghìn đồng và 8 bao 20 nghìn đồng. An bốc ngẫu nhiên 1 bao, sau đó Bình bốc ngẫu nhiên 1 bao trong số còn lại. Biết Bình bốc được bao 50 nghìn đồng, tính xác suất An cũng bốc được bao 50 nghìn đồng.', '0,27',
   'Dùng định nghĩa xác suất có điều kiện P(A|B) = P(AB)/P(B), tính từng xác suất theo thứ tự bốc.',
   ['P(A|B) = P(AB)/P(B).', 'Bốc không hoàn lại: P(B) không phụ thuộc thứ tự bốc, bằng 4/12.'],
   ['P(AB) = (4/12)(3/11) = 1/11; P(B) = 4/12 = 1/3.', 'P(A|B) = (1/11)/(1/3) = 3/11 ≈ 0,27.'],
   v=3/11, nd=2, r=R2, src=('VINH', 'II.2'))
le('12-VI-19', 'Chuồng A có 6 con thỏ trắng và 4 con thỏ đen; chuồng B có 3 con trắng và 5 con đen. Bắt ngẫu nhiên 2 con từ chuồng A thả sang chuồng B, rồi bắt ngẫu nhiên 1 con từ chuồng B. Biết con bắt ra là thỏ trắng, tính xác suất đó là con vừa được chuyển từ chuồng A sang.', '0,29',
   'Dùng công thức Bayes: H là biến cố “con bắt ra là một trong hai con được chuyển sang”, T là “con bắt ra màu trắng”.',
   ['P(H|T) = P(H)P(T|H)/P(T).', 'Mỗi con chuyển sang là trắng với xác suất 6/10.'],
   ['Chuồng B lúc sau có 10 con: P(H) = 2/10, P(T|H) = 0,6 ⇒ P(HT) = 0,12.', 'Xác suất toàn phần: P(T) = P(H̄)·3/8 + P(H)·0,6 = 0,8·3/8 + 0,12 = 0,42.', 'P(H|T) = 0,12/0,42 ≈ 0,286.'],
   v=0.12/0.42, nd=2, r=R2, src=('VINH', 'III.1'))

# ---------------------------------------------------------------- đề thi: thêm một câu mức khó mỗi vị trí
EX = []
def ex(k, t, q, h, y, b, a=None, o=None, s=None, v=None, nd=0, r='', g='', src=None):
    EX.append(dict(k=k, t=t, q=q, h=h, y=y, b=b, a=a, o=o, s=s, v=v, nd=nd, r=r, g=g, src=src))

ex('I-1', 'mc', 'Số vi khuẩn trong một mẫu nuôi cấy tăng với tốc độ N′(t) = 200e^(0,1t) (con/giờ), lúc đầu có 2000 con. Sau 10 giờ số vi khuẩn gần nhất với giá trị nào?',
   'Số vi khuẩn N(t) là nguyên hàm của N′(t); dùng N(0) = 2000 để tìm hằng số.',
   ['∫e^(kt)dt = e^(kt)/k + C.'],
   ['N(t) = 2000e^(0,1t) + C; N(0) = 2000 ⇒ C = 0.', 'N(10) = 2000e ≈ 5437.'],
   o=['5437', '5000', '7437', '2718'], a=0, v=2000*math.e, g='N(t) = 2000e^(0,1t).', src=('HP13', 'II.4'))
ex('I-2', 'mc', 'Một cổng chào có dạng parabol, khoảng cách hai chân cổng 6 m, chiều cao 4,5 m. Diện tích mặt phẳng giới hạn bởi cổng và mặt đất bằng',
   'Đặt parabol y = 4,5 − x²/2 (hai chân tại x = ±3) rồi tích phân.',
   ['S = ∫ₐᵇ f(x)dx với f ≥ 0.'],
   ['S = ∫₋₃³ (4,5 − x²/2)dx = 27 − 9 = 18 m².'],
   o=['12 m²', '18 m²', '27 m²', '9 m²'], a=1, v=18, g='S = (2/3)·6·4,5.', src=('KHTN', 'II.3'))
ex('I-3', 'mc', 'Chiều cao (m) của 30 cây keo: [8; 10): 6 cây; [10; 12): 12 cây; [12; 14): 9 cây; [14; 16): 3 cây. Khoảng tứ phân vị của mẫu số liệu ghép nhóm bằng',
   'Tìm Q₁ ở vị trí 7,5 và Q₃ ở vị trí 22,5 bằng công thức nội suy.',
   ['Qₖ = a + (kn/4 − C)/m·h.'],
   ['Q₁ thuộc [10; 12): 10 + (7,5 − 6)/12·2 = 10,25.', 'Q₃ thuộc [12; 14): 12 + (22,5 − 18)/9·2 = 13.', 'ΔQ = 2,75.'],
   o=['3', '2,5', '2,75', '3,25'], a=2, v=13 - 10.25, g='Q₁ = 10,25; Q₃ = 13.', src=('HP13', 'I.9'))
ex('I-4', 'mc', 'Lượng mưa (mm) trong 30 ngày tại một trạm: [0; 20): 8 ngày; [20; 40): 12 ngày; [40; 60): 7 ngày; [60; 80): 3 ngày. Số trung bình của mẫu số liệu ghép nhóm gần nhất với',
   'Dùng giá trị đại diện là trung điểm mỗi nhóm.',
   ['x̄ = Σmᵢxᵢ/n.'],
   ['x̄ = (8·10 + 12·30 + 7·50 + 3·70)/30 = 1000/30 ≈ 33,3.'],
   o=['30', '35', '31,7', '33,3'], a=3, v=1000/30, g='Tổng 1000, chia 30.', src=('HP13', 'I.8'))
ex('I-5', 'mc', 'Trong không gian Oxyz (đơn vị mét), một tia laser phát ra từ A(1; 2; 3) theo hướng u = (2; −1; −3). Tia laser chạm sàn nhà (mặt phẳng Oxy) tại điểm',
   'Viết phương trình tham số của tia, tìm t để z = 0.',
   ['Đường thẳng qua A, chỉ phương u: M = A + t·u.'],
   ['z = 3 − 3t = 0 ⇔ t = 1.', 'Điểm chạm: (1 + 2; 2 − 1; 0) = (3; 1; 0).'],
   o=['(3; 1; 0)', '(−1; 3; 6)', '(3; 1; 6)', '(1; 2; 0)'], a=0, v=None, g='t = 1.', src=('NA', 'III.3'))
ex('I-6', 'mc', 'Trong không gian Oxyz (đơn vị mét), một tấm che nắng nằm trong mặt phẳng đi qua A(2; 0; 0), B(0; 3; 0), C(0; 0; 1,5). Khoảng cách từ gốc O đến mặt phẳng đó bằng',
   'Viết phương trình mặt phẳng theo đoạn chắn rồi dùng công thức khoảng cách.',
   ['Mặt phẳng đoạn chắn: x/a + y/b + z/c = 1.'],
   ['(ABC): x/2 + y/3 + z/1,5 = 1 ⇔ 3x + 2y + 4z − 6 = 0.', 'd(O) = 6/√29 ≈ 1,11 m.'],
   o=['6/29', '6/√29', '√29/6', '6/√13'], a=1, v=None, g='3x + 2y + 4z − 6 = 0.', src=('HP13', 'II.1'))
ex('I-7', 'mc', 'Số người truy cập một trang web t giờ sau 6 giờ sáng là N(t) = −t³ + 9t² + 48t + 100 (0 ≤ t ≤ 12). Số người truy cập tăng trong khoảng thời gian nào?',
   'Xét dấu N′(t) trên [0; 12].',
   ['N′ > 0 trên khoảng thì N đồng biến.'],
   ['N′(t) = −3t² + 18t + 48 = −3(t − 8)(t + 2).', 'Trên [0; 12]: N′ > 0 khi 0 < t < 8.'],
   o=['(8; 12)', '(0; 2)', '(0; 8)', '(2; 8)'], a=2, v=None, g='N′ = −3(t − 8)(t + 2).', src=('HP13', 'II.4'))
ex('I-8', 'mc', 'Chi phí trung bình mỗi chuyến của một xe tải khi chạy x chuyến là A(x) = 0,4x + 3 + 360/x (triệu đồng), x > 0. Giá trị của x để A′(x) = 0 là',
   'Tính đạo hàm A′(x) rồi giải phương trình với x > 0.',
   ['(1/x)′ = −1/x².'],
   ['A′(x) = 0,4 − 360/x².', 'A′(x) = 0 ⇔ x² = 900 ⇔ x = 30 (x > 0).'],
   o=['9', '60', '900', '30'], a=3, v=sqrt(360/0.4), g='x² = 900.', src=('KHTN', 'II.2'))
ex('I-9', 'mc', 'Số người dùng của một ứng dụng sau t tháng là N(t) = 5000·e^(0,2t). Sau ít nhất bao nhiêu tháng số người dùng vượt 40 000?',
   'Giải bất phương trình mũ e^(0,2t) > 8 bằng cách lấy ln hai vế.',
   ['e^u > c ⇔ u > ln c (c > 0).'],
   ['e^(0,2t) > 8 ⇔ t > 5·ln 8 ≈ 10,4.', 't nguyên nhỏ nhất là 11.'],
   o=['11', '10', '8', '40'], a=0, v=min(t for t in range(1, 50) if 5000*exp(0.2*t) > 40000), g='t > 5 ln 8.')
ex('I-10', 'mc', 'Giá khoan giếng: mét đầu tiên 100 nghìn đồng, mỗi mét sau đắt hơn mét trước 7%. Chi phí khoan một giếng sâu 20 m gần nhất với',
   'Giá các mét lập cấp số nhân u₁ = 100, q = 1,07; tính tổng 20 số hạng đầu.',
   ['Sₙ = u₁(qⁿ − 1)/(q − 1).'],
   ['S₂₀ = 100(1,07²⁰ − 1)/0,07 ≈ 100·(3,8697 − 1)/0,07 ≈ 4099,5 nghìn đồng.', 'Khoảng 4,1 triệu đồng.'],
   o=['3,9 triệu đồng', '4,1 triệu đồng', '2,8 triệu đồng', '4,4 triệu đồng'], a=1, v=100*(1.07**20 - 1)/0.07/1000, g='q = 1,07.', src=('HP13', 'I.11'))
ex('I-11', 'mc', 'Độ cao một cabin đu quay là h(t) = 20 − 15cos(πt/6) (m), t tính bằng phút. Trong 24 phút đầu (0 ≤ t ≤ 24), cabin ở độ cao đúng 27,5 m bao nhiêu lần?',
   'Giải phương trình cos(πt/6) = −1/2 rồi đếm nghiệm trên [0; 24].',
   ['cos u = −1/2 ⇔ u = ±2π/3 + k2π.'],
   ['πt/6 = 2π/3 + k2π ⇒ t = 4 + 12k; πt/6 = 4π/3 + k2π ⇒ t = 8 + 12k.', 'Trên [0; 24]: t = 4, 8, 16, 20.'],
   o=['2', '3', '4', '6'], a=2, v=sum(1 for t in [4, 8, 16, 20, 28] if 0 <= t <= 24), g='t = 4, 8, 16, 20.')
ex('I-12', 'mc', 'Một chiếc lều dạng hình chóp tứ giác đều có thể tích 12 m³ và chiều cao 2 m. Cạnh đáy của lều bằng',
   'Từ V = (1/3)·a²·h tìm a².',
   ['V chóp = (1/3)·S đáy·h.'],
   ['a²·2/3 = 12 ⇔ a² = 18.', 'a = 3√2 m.'],
   o=['6 m', '3 m', '3√2 m', '2√3 m'], a=2, v=None, g='a² = 18.', src=('VINH', 'III.3'))

ex('II-1', 'tf', 'Nồng độ chất ô nhiễm (mg/l) trong một hồ sau t tháng xử lý được mô hình hóa bởi P(t) = t³/3 − 9t² + 72t + 50, với 0 ≤ t ≤ 12.',
   'Tính P′(t), xét dấu để biết tăng giảm, tìm giá trị lớn nhất; tốc độ giảm v = −P′ là hàm bậc hai.',
   ['Hàm số đồng biến khi đạo hàm dương, nghịch biến khi đạo hàm âm.', 'Hàm bậc hai at² + bt + c (a < 0) lớn nhất tại đỉnh.'],
   ['a) P′(t) = t² − 18t + 72: đúng.', 'b) P′(t) = (t − 6)(t − 12) < 0 trên (6; 12) nên P nghịch biến, không đồng biến: sai.',
    'c) P lớn nhất trên [0; 12] tại t = 6: P(6) = 72 − 324 + 432 + 50 = 230: đúng.', 'd) v(t) = −t² + 18t − 72 lớn nhất tại t = 9: đúng.'],
   s=[['P′(t) = t² − 18t + 72.', True], ['Nồng độ chất ô nhiễm tăng trong khoảng (6; 12).', False],
      ['Nồng độ chất ô nhiễm cao nhất trong 12 tháng là 230 mg/l.', True], ['Tốc độ giảm nồng độ v(t) = −P′(t) đạt lớn nhất tại t = 9.', True]],
   v=(max(range(13), key=lambda t: t**3/3 - 9*t*t + 72*t + 50), round(6**3/3 - 9*36 + 72*6 + 50, 6)), src=('NA', 'III.6'))
ex('II-2', 'tf', 'Một ô tô chạy 72 km/h, khi cách trạm thu phí 200 m thì người lái nhìn thấy biển báo; sau 2 giây phản xạ (xe vẫn giữ tốc độ), xe phanh chậm dần đều với gia tốc −2,5 m/s² cho đến khi tốc độ còn 18 km/h. Gọi t (giây) là thời gian tính từ lúc bắt đầu phanh.',
   'Đổi đơn vị, lập v(t), tìm thời điểm còn 5 m/s, tích phân vận tốc; cộng quãng đường phản xạ.',
   ['s = ∫ v(t)dt; 1 m/s = 3,6 km/h.'],
   ['a) 72 km/h = 20 m/s nên v(t) = 20 − 2,5t: đúng.', 'b) 20 − 2,5t = 5 ⇔ t = 6 giây: đúng.',
    'c) s = ∫₀⁶ (20 − 2,5t)dt = 120 − 45 = 75 m, không phải 80 m: sai.', 'd) Tổng quãng đường 2·20 + 75 = 115 m, còn cách trạm 85 m, không phải 95 m: sai.'],
   s=[['Vận tốc của xe khi phanh là v(t) = 20 − 2,5t (m/s).', True], ['Thời gian phanh đến khi tốc độ còn 18 km/h là 6 giây.', True],
      ['Quãng đường xe đi được trong thời gian phanh là 80 m.', False], ['Khi tốc độ còn 18 km/h, xe cách trạm thu phí 95 m.', False]],
   v=(20*6 - 1.25*36, 200 - 40 - (20*6 - 1.25*36)), src=('TH', 'II.2'))
ex('II-3', 'tf', 'Ở một vùng, xác suất một ngày có mưa là 0,3. Một ứng dụng dự báo báo mưa đúng 85% số ngày có mưa, và báo mưa nhầm 10% số ngày không mưa.',
   'Lập sơ đồ cây: M (mưa), B (báo mưa); dùng công thức xác suất toàn phần và Bayes.',
   ['P(B) = P(M)P(B|M) + P(M̄)P(B|M̄).', 'P(M|B) = P(M)P(B|M)/P(B).'],
   ['a) P(B) = 0,3·0,85 + 0,7·0,1 = 0,325, không phải 0,255: sai.', 'b) P(M|B) = 0,255/0,325 ≈ 0,785: đúng.',
    'c) P(B̄) = 0,675, P(M ∩ B̄) = 0,3·0,15 = 0,045, P(M|B̄) ≈ 0,067 < 0,07: đúng.', 'd) Dự báo đúng: 0,255 + 0,7·0,9 = 0,885, không phải 0,9: sai.'],
   s=[['Xác suất ứng dụng báo mưa trong một ngày là 0,255.', False], ['Biết ứng dụng báo mưa, xác suất trời mưa thật xấp xỉ 0,78.', True],
      ['Biết ứng dụng báo không mưa, xác suất trời vẫn mưa nhỏ hơn 0,07.', True], ['Xác suất ứng dụng dự báo đúng trong một ngày là 0,9.', False]],
   v=(0.3*0.85 + 0.07, 0.255/0.325, 0.045/0.675, 0.255 + 0.63), src=('KHTN', 'II.1'))
ex('II-4', 'tf', 'Trong không gian Oxyz (đơn vị km), máy bay A xuất phát từ M(0; 0; 8), mỗi phút dịch chuyển theo vectơ (12; 9; 0); cùng lúc máy bay B xuất phát từ N(150; 0; 10), mỗi phút dịch chuyển theo vectơ (−6; 8; 0). Hai máy bay bay thẳng đều.',
   'Viết tọa độ hai máy bay theo t (phút), lập AB² là hàm bậc hai của t rồi tìm giá trị nhỏ nhất.',
   ['Tốc độ = độ dài vectơ dịch chuyển mỗi đơn vị thời gian.', 'Hàm bậc hai at² + bt + c (a > 0) nhỏ nhất tại t = −b/(2a).'],
   ['a) Tốc độ A: √(144 + 81) = 15 km/phút = 900 km/h: đúng.', 'b) Tốc độ B: √(36 + 64) = 10 km/phút = 600 km/h, nhỏ hơn A: sai.',
    'c) A(12t; 9t; 8), B(150 − 6t; 8t; 10): AB² = (18t − 150)² + t² + 4, nhỏ nhất tại t = 5400/650 ≈ 8,31: đúng.', 'd) AB nhỏ nhất ≈ √73,23 ≈ 8,56 km, không nhỏ hơn 8 km: sai.'],
   s=[['Tốc độ của máy bay A là 900 km/h.', True], ['Tốc độ của máy bay B lớn hơn tốc độ của máy bay A.', False],
      ['Khoảng cách giữa hai máy bay nhỏ nhất vào thời điểm giữa phút thứ 8 và phút thứ 9.', True], ['Khoảng cách nhỏ nhất giữa hai máy bay nhỏ hơn 8 km.', False]],
   v=(5400/650, sqrt(min((18*t - 150)**2 + t*t + 4 for t in [i/10000 for i in range(0, 200000)]))), src=('NA', 'III.3'))

ex('III-1', 'sa', 'Một công ty đặt may lều dạng hình chóp tứ giác đều có thể tích 12 m³ (không may đáy), vải bạt giá 400 nghìn đồng/m². Chi phí vải nhỏ nhất cho một chiếc lều là bao nhiêu triệu đồng?',
   'Biểu diễn chiều cao theo cạnh đáy a từ thể tích, viết diện tích xung quanh theo a, tìm giá trị nhỏ nhất.',
   ['V = a²h/3; diện tích xung quanh S = 4·(1/2)·a·d với trung đoạn d = √(h² + a²/4).', 'Cô-si cho ba số dương: x + y + z ≥ 3∛(xyz).'],
   ['h = 36/a², S = 2a√(1296/a⁴ + a²/4) = 2√(1296/a² + a⁴/4).', '1296/a² + a⁴/4 = 648/a² + 648/a² + a⁴/4 ≥ 3∛(648²/4) ≈ 141,5, dấu bằng khi a⁶ = 2592 (a ≈ 3,71 m).',
    'S nhỏ nhất ≈ 2√141,5 ≈ 23,79 m², chi phí ≈ 0,4·23,79 ≈ 9,5 triệu đồng.'],
   v=0.4*min(2*sqrt(1296/(a/1000)**2 + (a/1000)**4/4) for a in range(1000, 8000)), nd=1, r=R1, a='9,5', src=('VINH', 'III.3'))
ex('III-2', 'sa', 'Một chiếc phao bơi dạng hình xuyến (khối tạo khi quay một hình tròn quanh một trục nằm ngoài nó). Mặt cắt qua trục cho thấy đường kính ngoài 60 cm, đường kính trong 36 cm. Phao làm bằng vật liệu đặc có khối lượng riêng 0,04 g/cm³. Khối lượng phao là bao nhiêu kilôgam?',
   'Thể tích khối xuyến = (diện tích hình tròn mặt cắt)·(độ dài đường tròn do tâm hình tròn vạch ra) (Pappus), hoặc tích phân thể tích khối tròn xoay.',
   ['Hình tròn bán kính r, tâm cách trục R quay quanh trục: V = 2π²Rr².', 'Tích phân: V = π∫[(R + √(r² − y²))² − (R − √(r² − y²))²]dy = 2π²Rr².'],
   ['Bán kính ngoài 30, trong 18: r = (30 − 18)/2 = 6 cm, R = 24 cm.', 'V = 2π²·24·36 = 1728π² ≈ 17 054,6 cm³.', 'Khối lượng ≈ 0,04·17 054,6 ≈ 682 g ≈ 0,68 kg.'],
   v=0.04*2*pi**2*24*36/1000, nd=2, r=R2, a='0,68', src=('VINH', 'III.4'))
ex('III-3', 'sa', 'Một trung tâm cần xử lý 12 000 hồ sơ trong ngày bằng x máy chạy song song, mỗi máy xử lý 200 hồ sơ/giờ. Chi phí lắp đặt 10 triệu đồng/máy; chi phí vận hành 80 nghìn đồng/giờ/máy; nhân viên giám sát 6 triệu đồng/giờ (trả theo số giờ chạy). Chi phí nhỏ nhất là bao nhiêu triệu đồng?',
   'Thời gian chạy t = 12000/(200x) = 60/x giờ; lập C(x) rồi tìm giá trị nhỏ nhất với x nguyên dương.',
   ['Hàm ax + b/x (a, b > 0) nhỏ nhất tại x = √(b/a).'],
   ['C(x) = 10x + 0,08·x·(60/x) + 6·(60/x) = 10x + 4,8 + 360/x.', 'Nhỏ nhất tại x = √36 = 6 (nguyên): C(6) = 60 + 4,8 + 60 = 124,8 triệu đồng.'],
   v=min(10*x + 4.8 + 360/x for x in range(1, 100)), r=R0, a='125', src=('HP13', 'III.6'))
ex('III-4', 'sa', 'Một trang trại trồng ngô và đậu trên tổng diện tích tối đa 12 ha. Mỗi ha ngô cần 15 công lao động, 25 triệu đồng vốn, lãi 40 triệu đồng; mỗi ha đậu cần 30 công, 15 triệu đồng vốn, lãi 50 triệu đồng. Trang trại có tối đa 270 công và 255 triệu đồng vốn. Lợi nhuận lớn nhất là bao nhiêu triệu đồng?',
   'Lập hệ bất phương trình cho x ha ngô, y ha đậu; lợi nhuận lớn nhất tại một đỉnh của miền nghiệm.',
   ['Giá trị lớn nhất của F = ax + by trên miền đa giác đạt tại đỉnh.'],
   ['Hệ: x, y ≥ 0; x + y ≤ 12; 15x + 30y ≤ 270 ⇔ x + 2y ≤ 18; 25x + 15y ≤ 255 ⇔ 5x + 3y ≤ 51.',
    'Các đỉnh: (0; 0), (10,2; 0), (7,5; 4,5), (6; 6), (0; 9).', 'F = 40x + 50y: 0; 408; 525; 540; 450. Lớn nhất 540 triệu đồng tại (6; 6).'],
   v=max(40*x/10 + 50*y/10 for x in range(0, 121) for y in range(0, 121) if x + y <= 120 and x + 2*y <= 180 and 5*x + 3*y <= 510), a='540', src=('NA', 'III.5'))
ex('III-5', 'sa', 'Một đài phun nước có 20 vòi đặt cách đều trên một đường tròn. Người ta chọn 3 vòi để chiếu đèn sao cho 3 vòi là 3 đỉnh của một tam giác nhọn (tâm đường tròn nằm trong tam giác). Có bao nhiêu cách chọn?',
   'Đếm phần bù: tổng số tam giác trừ tam giác vuông và tam giác tù.',
   ['Tam giác nội tiếp vuông khi có một cạnh là đường kính; tù khi ba đỉnh nằm trên một nửa đường tròn mở.'],
   ['Tổng: C(20, 3) = 1140. Vuông: 10 đường kính × 18 đỉnh còn lại = 180.',
    'Tù: chọn đỉnh góc “đầu tiên” theo chiều kim đồng hồ (20 cách), hai đỉnh còn lại trong 9 đỉnh kế tiếp: C(9, 2) = 36, tổng 720.', 'Nhọn: 1140 − 180 − 720 = 240.'],
   v=sum(1 for i in range(20) for j in range(i + 1, 20) for k in range(j + 1, 20) if max(j - i, k - j, 20 - k + i) < 10), a='240', src=('VINH', 'III.2'))
ex('III-6', 'sa', 'Trong một hộp có 20 quả bóng đánh số từ 1 đến 20. Lấy ngẫu nhiên đồng thời 3 quả. Tính xác suất ba số trên ba quả bóng (sắp theo thứ tự tăng dần) lập thành một cấp số cộng.',
   'Đếm số bộ (a; a + d; a + 2d) trong {1; …; 20} theo từng công sai d.',
   ['Ba số a < b < c lập cấp số cộng ⇔ a + c = 2b.'],
   ['Với công sai d (1 ≤ d ≤ 9), a nhận 20 − 2d giá trị: tổng Σ(20 − 2d) = 180 − 90 = 90.', '|Ω| = C(20, 3) = 1140, P = 90/1140 ≈ 0,079.'],
   v=sum(1 for a in range(1, 21) for b in range(a + 1, 21) for c in range(b + 1, 21) if a + c == 2*b)/comb(20, 3), nd=2, r=R2, a='0,08', src=('TH', 'III.4'))

# ---------------------------------------------------------------- kiểm tra và xuất
def num(a):
    return float(a.replace('−', '-').replace(',', '.'))

def check(it):
    if it['t'] == 'sa':
        got = fmt(it['v'], it['nd'])
        assert got == it['a'], (it['k'], it['q'][:50], it['v'], got, it['a'])
    elif it['t'] == 'mc' and it['v'] is not None:
        opt = it['o'][it['a']].split(' ')[0]
        assert abs(num(opt) - it['v']) <= max(0.051, 1e-4*abs(it['v'])), (it['k'], opt, it['v'])
    if it['t'] == 'sa':
        assert len(it['a']) <= 4, (it['k'], it['a'])

for it in LE + EX:
    check(it)
# Câu đúng/sai: kiểm từng ý bằng giá trị máy tính.
V = {x['k']: x['v'] for x in EX if x['t'] == 'tf'}
assert V['II-1'][0] == 6 and abs(V['II-1'][1] - 230) < 1e-9
assert abs(V['II-2'][0] - 75) < 1e-9 and abs(V['II-2'][1] - 85) < 1e-9
a, b, c, d = V['II-3']; assert abs(a - 0.325) < 1e-9 and abs(b - 0.785) < 0.005 and c < 0.07 and abs(d - 0.885) < 1e-9
t0, dmin = V['II-4']; assert 8 < t0 < 9 and 8 < dmin < 8.6 and abs(sqrt(144 + 81)*60 - 900) < 1e-9 and sqrt(36 + 64) < 15
assert len({x['k'] for x in LE}) == len(LE) == 74, len(LE)
assert len({x['k'] for x in EX}) == len(EX) == 22, len(EX)

# Chỉ số khóa: câu nối sau các câu sẵn có của bài (5 câu + KHKT_EX_ADD) và của vị trí đề (+ EXAM_ADD + EXAM_LV).
cnt = json.loads(subprocess.run(['node', '-e', r'''
global.window = {}; for (const f of ["data.js","data_them.js","dethi_them.js","mucdo.js","dethi_mucdo.js"]) require("./" + f);
const L = {}, S = {};
for (const g of [10, 11, 12]) for (const c of window.KHKT_DATA[g]) for (const l of c.lessons) L[l.id] = l.ex.length + (window.KHKT_EX_ADD[l.id] || []).length;
for (const s of window.KHKT_EXAM) S[s.id] = s.items.length + (window.KHKT_EXAM_ADD[s.id] || []).length + (window.KHKT_EXAM_LV[s.id] || []).length;
console.log(JSON.stringify({L, S}));'''], cwd=ROOT, capture_output=True, text=True, encoding='utf-8', check=True).stdout)
assert set(cnt['L']) == {x['k'] for x in LE}, set(cnt['L']) ^ {x['k'] for x in LE}
assert set(cnt['S']) == {x['k'] for x in EX}

def srcText(src):
    return f"{SRC[src[0]]}, câu {src[1]}" if src else ''

def item_js(it, exam):
    d = {}
    if exam:
        d['lv'] = 'kho'
        if it['t'] != 'tf': d['muc'] = 'VD'
    else:
        d['m'] = 'V'
    d['t'] = it['t']; d['q'] = it['q']
    if it['t'] == 'mc':
        d['o'] = it['o']; d['a'] = it['a']
        if it.get('g'): d['g'] = it['g']
    elif it['t'] == 'sa':
        d['a'] = it['a']; d['r'] = it['r']
    else:
        d['s'] = it['s']
    d['tt'] = 1
    if it['src']: d['src'] = srcText(it['src'])
    return d

def last_line(it):
    if it['t'] == 'mc': return 'Đáp án: ' + it['o'][it['a']]
    if it['t'] == 'sa': return 'Đáp án: ' + it['a']
    return 'Kết luận: ' + ', '.join('abcd'[i] + ' ' + ('Đúng' if x[1] else 'Sai') for i, x in enumerate(it['s'])) + '.'

def sol(key, it):
    out = [f'# {key}', 'h ' + it['h']] + ['y ' + y for y in it['y']] + ['b ' + b for b in it['b']] + ['b ' + last_line(it), '']
    return '\n'.join(out)

lines = {'10': [], '11': [], '12': [], 'dethi': []}
le_js, ex_js = {}, {}
for it in LE:
    key = f"{it['k']}#{cnt['L'][it['k']]}"
    lines[it['k'].split('-')[0]].append(sol(key, it))
    le_js.setdefault(it['k'], []).append(item_js(it, False))
for it in EX:
    key = f"{it['k']}#{cnt['S'][it['k']]}"
    lines['dethi'].append(sol(key, it))
    ex_js.setdefault(it['k'], []).append(item_js(it, True))

head = ''  # build.py không có cú pháp chú thích: mọi dòng "# " đều là khóa lời giải
for g, name in [('10', '10d_thucte.txt'), ('11', '11d_thucte.txt'), ('12', '12d_thucte.txt'), ('dethi', 'dethi_thucte.txt')]:
    (HERE / name).write_text(head + '\n'.join(lines[g]), encoding='utf-8')

def dump(d):
    return '{\n' + ',\n'.join(f'  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}' for k, v in d.items()) + '\n}'

js = f'''// Tệp sinh tự động từ content/thucte_nguon.py. Sửa nội dung ở tệp nguồn đó.
// Câu vận dụng, câu toán thực tế: mỗi bài ôn tập thêm một câu, mỗi vị trí đề thêm một câu mức khó.
// Câu tự soạn (số liệu, bối cảnh mới); "src" ghi đề thi thử của trường gợi ý dạng bài.
window.KHKT_EX_TT = {dump(le_js)};
window.KHKT_EXAM_TT = {dump(ex_js)};
(function(){{
  const add = window.KHKT_EX_ADD = window.KHKT_EX_ADD || {{}}, lv = window.KHKT_EXAM_LV = window.KHKT_EXAM_LV || {{}};
  Object.entries(window.KHKT_EX_TT).forEach(([id, a]) => {{ (add[id] = add[id] || []).push(...a); }});
  Object.entries(window.KHKT_EXAM_TT).forEach(([id, a]) => {{ (lv[id] = lv[id] || []).push(...a); }});
}})();
'''
(ROOT / 'thucte.js').write_text(js, encoding='utf-8')
n_src = sum(1 for x in LE + EX if x['src'])
print('ok: bài', len(LE), '| đề', len(EX), '| có nguồn trường', n_src, '/', len(LE) + len(EX))
