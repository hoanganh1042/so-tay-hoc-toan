// Câu đề thi thử theo mức: lv 'kho' (khó hơn đề chuẩn, mức Vận dụng) hoặc 'de' (dễ hơn đề chuẩn).
// Nối vào sau các câu sẵn có của mỗi vị trí (sau KHKT_EXAM_ADD), nên khóa câu là "vị trí#chỉ số" như cũ.
// Đề Dễ lấy thêm câu Nhận biết, Thông hiểu từ bài học của vị trí; đề Khó lấy thêm câu Vận dụng.
// Mọi câu đều tự soạn; số liệu và bối cảnh không chép từ đề của Bộ, Sở hay sách.
window.KHKT_EXAM_LV = {
  // ---------- Phần I, mức khó ----------
  'I-1': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Cho F(x) là một nguyên hàm của f(x) = (x² + 1)/x² trên (0; +∞) thỏa mãn F(1) = 2. Giá trị F(2) bằng', o: ['7/2', '5/2', '3', '9/2'], a: 0, g: 'F(x) = x − 1/x + 2.'}],
  'I-2': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Diện tích hình phẳng giới hạn bởi hai đồ thị y = x² và y = 2x bằng', o: ['4/3', '8/3', '4', '2/3'], a: 0, g: '∫₀²(2x − x²)dx = 4/3.', tp: 'ud-tich-phan', le: '12-IV-13'}],
  'I-3': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Thời gian tự học mỗi ngày (phút) của 20 học sinh: [0; 10): 4 em; [10; 20): 10 em; [20; 30): 6 em. Phương sai của mẫu số liệu ghép nhóm này bằng', o: ['49', '7', '16', '305'], a: 0, g: 'Trung bình 16; trung bình bình phương 305; phương sai 305 − 256 = 49.'}],
  'I-4': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Cân nặng (kg) của 40 học sinh: [40; 50): 5 em; [50; 60): 12 em; [60; 70): 15 em; [70; 80): 8 em. Trung vị của mẫu số liệu ghép nhóm này bằng', o: ['62', '65', '60', '63,5'], a: 0, g: 'Nhóm chứa trung vị [60; 70): 60 + (20 − 17)/15·10 = 62.'}],
  'I-5': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Trong không gian Oxyz, đường thẳng đi qua A(1; 2; 3) và vuông góc với mặt phẳng (P): x + 2y + 2z − 2 = 0 cắt (P) tại H(a; b; c). Giá trị a + b + c bằng', o: ['1', '3', '6', '−1'], a: 0, g: 'H = (0; 0; 1).'}],
  'I-6': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Trong không gian Oxyz, cho A(1; 0; 0), B(0; 2; 0), C(0; 0; 3). Khoảng cách từ gốc O đến mặt phẳng (ABC) bằng', o: ['6/7', '7/6', '6/49', '√6/7'], a: 0, g: '(ABC): 6x + 3y + 2z − 6 = 0, d = 6/7.'}],
  'I-7': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Có bao nhiêu giá trị nguyên của m thuộc đoạn [−10; 10] để hàm số y = x³ − 3x² + mx + 2 đồng biến trên ℝ?', o: ['8', '7', '10', '18'], a: 0, g: 'y\' ≥ 0 với mọi x ⇔ m ≥ 3.'}],
  'I-8': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Đồ thị hàm số y = (x − 1)/(x² − 3x + 2) có tất cả bao nhiêu đường tiệm cận đứng và tiệm cận ngang?', o: ['2', '3', '1', '4'], a: 0, g: 'Rút gọn được 1/(x − 2) với x ≠ 1: tiệm cận đứng x = 2, tiệm cận ngang y = 0.'}],
  'I-9': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Số nghiệm nguyên của bất phương trình log₂(x − 1) + log₂(x + 1) ≤ 3 là', o: ['2', '3', '1', '4'], a: 0, g: 'x > 1 và x² − 1 ≤ 8, nên x ∈ {2; 3}.'}],
  'I-10': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Cho cấp số nhân (uₙ) có u₂ = 6 và u₅ = 162. Tổng 5 số hạng đầu của cấp số nhân bằng', o: ['242', '364', '162', '240'], a: 0, g: 'q = 3, u₁ = 2, S₅ = 2(3⁵ − 1)/2 = 242.'}],
  'I-11': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Số nghiệm của phương trình sin 2x = 1/2 trên đoạn [0; 2π] là', o: ['4', '2', '3', '6'], a: 0, g: 'x = π/12, 5π/12, 13π/12, 17π/12.'}],
  'I-12': [{lv: 'kho', muc: 'VD', t: 'mc', q: 'Cho hình chóp S.ABCD có đáy là hình vuông cạnh a, SA vuông góc với đáy và SC tạo với mặt phẳng đáy góc 60°. Thể tích khối chóp S.ABCD bằng', o: ['a³√6/3', 'a³√6', 'a³√6/9', 'a³√3/3'], a: 0, g: 'SA = a√2·tan 60° = a√6.', tp: 'the-tich', le: '11-VII-27'}],
  // ---------- Phần II, mức khó ----------
  'II-1': [{lv: 'kho', t: 'tf', q: 'Lợi nhuận (triệu đồng) của một xưởng khi sản xuất x tấn sản phẩm mỗi tháng được mô hình hóa bởi P(x) = −x³ + 9x² + 21x − 50, với 0 ≤ x ≤ 10.',
    s: [['P\'(x) = −3x² + 18x + 21.', true], ['Hàm số P(x) đồng biến trên khoảng (0; 8).', false], ['Lợi nhuận lớn nhất mỗi tháng là 205 triệu đồng.', false], ['Có đúng 9 giá trị nguyên của x thuộc [0; 10] để xưởng có lãi (P(x) > 0).', true]]}],
  'II-2': [{lv: 'kho', t: 'tf', q: 'Một vật xuất phát từ trạng thái đứng yên, chuyển động thẳng với gia tốc a(t) = 6 − 2t (m/s²), trong đó t (giây) là thời gian tính từ lúc xuất phát, 0 ≤ t ≤ 6.',
    s: [['Vận tốc của vật là v(t) = 6t − t² (m/s).', true], ['Vận tốc lớn nhất của vật bằng 9 m/s.', true], ['Quãng đường vật đi được trong 3 giây đầu là 27 m.', false], ['Quãng đường vật đi được từ t = 5 đến t = 6 nhỏ hơn 3 m.', true]]}],
  'II-3': [{lv: 'kho', t: 'tf', q: 'Một nhà máy có hai dây chuyền. Dây chuyền I làm ra 60% sản phẩm với tỉ lệ phế phẩm 3%; dây chuyền II làm ra 40% sản phẩm với tỉ lệ phế phẩm 5%. Lấy ngẫu nhiên một sản phẩm của nhà máy.',
    s: [['Xác suất sản phẩm do dây chuyền I làm ra là 0,6.', true], ['Xác suất sản phẩm là phế phẩm, biết nó do dây chuyền II làm ra, là 0,05.', true], ['Xác suất sản phẩm là phế phẩm bằng 0,038.', true], ['Biết sản phẩm lấy ra là phế phẩm, xác suất nó do dây chuyền I làm ra lớn hơn 0,5.', false]]}],
  'II-4': [{lv: 'kho', t: 'tf', q: 'Trong không gian Oxyz (đơn vị km), một trạm radar đặt tại gốc O, phát hiện được vật thể cách nó không quá 50 km. Một máy bay bay thẳng từ A(−40; 30; 10) đến B(60; 30; 10).',
    s: [['Vectơ AB = (100; 0; 0).', true], ['Đường bay AB có phương trình x = −40 + t, y = 30, z = 10 (t ∈ ℝ).', true], ['Khoảng cách ngắn nhất từ máy bay đến trạm radar bằng 30 km.', false], ['Quãng đường máy bay bay trong vùng radar phát hiện được dài hơn 80 km.', false]]}],
  // ---------- Phần III: mức khó và mức dễ ----------
  'III-1': [
    {lv: 'kho', muc: 'VD', t: 'sa', q: 'Cho hình chóp S.ABCD có đáy là hình vuông cạnh 2, SA vuông góc với đáy và SA = 2. Tính khoảng cách từ B đến mặt phẳng (SCD).', a: '1,41', r: 'Làm tròn đến hàng phần trăm'},
    {lv: 'de', muc: 'B', t: 'sa', q: 'Một khối chóp có đáy là hình vuông cạnh 3 và chiều cao bằng 4. Tính thể tích khối chóp.', a: '12', r: ''}
  ],
  'III-2': [
    {lv: 'kho', muc: 'VD', t: 'sa', q: 'Một chiếc bình có dạng khối tròn xoay tạo thành khi quay hình phẳng giới hạn bởi y = √x, trục Ox và đường thẳng x = 9 quanh trục Ox (đơn vị dm). Tính thể tích bình (lít).', a: '127', r: 'Làm tròn đến hàng đơn vị'},
    {lv: 'de', muc: 'H', t: 'sa', q: 'Tính diện tích hình phẳng giới hạn bởi đồ thị y = x², trục hoành và hai đường thẳng x = 0, x = 3.', a: '9', r: ''}
  ],
  'III-3': [
    {lv: 'kho', muc: 'VD', t: 'sa', q: 'Từ một tấm tôn hình vuông cạnh 60 cm, người ta cắt ở bốn góc bốn hình vuông bằng nhau rồi gập lại thành một chiếc hộp không nắp. Thể tích lớn nhất của chiếc hộp bằng bao nhiêu lít?', a: '16', r: ''},
    {lv: 'de', muc: 'H', t: 'sa', q: 'Khi bán một sản phẩm với giá p (nghìn đồng) thì cửa hàng bán được 100 − 2p sản phẩm (0 < p < 50). Doanh thu lớn nhất khi giá bán p bằng bao nhiêu nghìn đồng?', a: '25', r: ''}
  ],
  'III-4': [
    {lv: 'kho', muc: 'VD', t: 'sa', q: 'Một xưởng làm bàn và ghế. Mỗi chiếc bàn cần 2 giờ đóng và 1 giờ sơn, lãi 600 nghìn đồng; mỗi chiếc ghế cần 1 giờ đóng và 1 giờ sơn, lãi 400 nghìn đồng. Mỗi tuần xưởng có tối đa 100 giờ đóng và 80 giờ sơn. Tiền lãi lớn nhất mỗi tuần là bao nhiêu triệu đồng?', a: '36', r: ''},
    {lv: 'de', muc: 'H', t: 'sa', q: 'Tìm giá trị lớn nhất của F = x + 2y trên miền nghiệm của hệ x ≥ 0, y ≥ 0, x + y ≤ 4.', a: '8', r: ''}
  ],
  'III-5': [
    {lv: 'kho', muc: 'VD', t: 'sa', q: 'Từ các chữ số 0, 1, 2, 3, 4, 5, 6 lập được bao nhiêu số tự nhiên có 4 chữ số đôi một khác nhau và chia hết cho 5?', a: '220', r: ''},
    {lv: 'de', muc: 'B', t: 'sa', q: 'Lớp có 10 bạn được đề cử. Có bao nhiêu cách chọn 1 lớp trưởng và 1 lớp phó từ 10 bạn đó?', a: '90', r: ''}
  ],
  'III-6': [
    {lv: 'kho', muc: 'VD', t: 'sa', q: 'Một hộp có 5 viên bi đỏ và 4 viên bi xanh. Lấy ngẫu nhiên lần lượt 2 viên bi, không hoàn lại. Biết viên thứ hai màu đỏ, tính xác suất viên thứ nhất màu xanh.', a: '0,5', r: ''},
    {lv: 'de', muc: 'H', t: 'sa', q: 'Gieo một con xúc xắc cân đối hai lần. Tính xác suất tổng số chấm hai lần gieo bằng 8.', a: '0,14', r: 'Làm tròn đến hàng phần trăm'}
  ]
};
