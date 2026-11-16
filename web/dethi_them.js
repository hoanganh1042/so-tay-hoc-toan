// Bổ sung cho ngân hàng đề thi thử: tiêu chí từng vị trí câu và câu hỏi mới.
// muc: B (Biết) | H (Hiểu) | VD (Vận dụng); nl: TD (tư duy, lập luận) | GQ (giải quyết vấn đề) | MH (mô hình hóa).
// Phần II: mức độ theo từng ý a, b, c, d là Biết, Hiểu, Hiểu, Vận dụng.
// tp: mặt kiến thức của riêng câu (khi khác mặt kiến thức chính của vị trí); le: bài học để ôn lại.
window.KHKT_EXAM_META = {
  'I-1':  {topics: ['nguyen-ham'], muc: 'B', nl: 'TD'},
  'I-2':  {topics: ['tich-phan'], muc: 'H', nl: 'TD'},
  'I-3':  {topics: ['thong-ke-pt'], muc: 'H', nl: 'TD'},
  'I-4':  {topics: ['thong-ke-tt'], muc: 'H', nl: 'TD'},
  'I-5':  {topics: ['duong-thang'], muc: 'B', nl: 'TD'},
  'I-6':  {topics: ['mat-phang'], muc: 'B', nl: 'TD', ten: 'Phương trình mặt phẳng, mặt cầu'},
  'I-7':  {topics: ['don-dieu'], muc: 'B', nl: 'TD'},
  'I-8':  {topics: ['tiem-can'], muc: 'B', nl: 'TD'},
  'I-9':  {topics: ['mu-log'], muc: 'H', nl: 'TD'},
  'I-10': {topics: ['csc-csn'], muc: 'B', nl: 'TD'},
  'I-11': {topics: ['luong-giac'], muc: 'H', nl: 'TD', ten: 'Công thức và phương trình lượng giác'},
  'I-12': {topics: ['hhkg-co-ban'], muc: 'H', nl: 'TD', ten: 'Quan hệ song song, vuông góc; vectơ, tọa độ vectơ; thể tích'},
  'II-1': {topics: ['khao-sat'], nl: 'TD'},
  'II-2': {topics: ['tp-thuc-te'], nl: 'MH'},
  'II-3': {topics: ['xs-dk'], nl: 'MH'},
  'II-4': {topics: ['oxyz-thuc-te'], nl: 'MH'},
  'III-1': {topics: ['khoang-cach'], muc: 'VD', nl: 'GQ'},
  'III-2': {topics: ['ud-tich-phan'], muc: 'VD', nl: 'MH'},
  'III-3': {topics: ['toi-uu'], muc: 'VD', nl: 'MH'},
  'III-4': {topics: ['qhtt'], muc: 'VD', nl: 'MH', ten: 'Hệ bất phương trình bậc nhất hai ẩn; hệ phương trình bậc nhất ba ẩn'},
  'III-5': {topics: ['to-hop'], muc: 'VD', nl: 'GQ'},
  'III-6': {topics: ['xac-suat'], muc: 'VD', nl: 'GQ'}
};

// Gắn mặt kiến thức riêng cho một số câu có sẵn
(function(){
  const tag = {
    'I-2': {1: {tp: 'ud-tich-phan', le: '12-IV-13'}, 2: {tp: 'ud-tich-phan', le: '12-IV-13'}},
    'I-8': {2: {tp: 'dao-ham', le: '11-IX-32'}},
    'I-12': {2: {tp: 'vecto-oxyz', le: '12-II-6'}, 3: {tp: 'the-tich', le: '11-VII-27'}},
    'III-1': {3: {tp: 'the-tich', le: '11-VII-27'}},
    'III-6': {2: {tp: 'xs-dk', le: '12-VI-18'}}
  };
  (window.KHKT_EXAM || []).forEach(sl => { const t = tag[sl.id]; if (t) Object.entries(t).forEach(([i, v]) => Object.assign(sl.items[+i], v)); });
})();

window.KHKT_EXAM_ADD = {
  'I-1': [
    {t: 'mc', q: 'Họ nguyên hàm của hàm số f(x) = e²ˣ là', o: ['2e²ˣ + C', '½e²ˣ + C', 'e²ˣ + C', 'e²ˣ⁺¹/(2x + 1) + C'], a: 1, g: '(½e²ˣ)\' = e²ˣ.'},
    {t: 'mc', q: 'Biết F(x) là một nguyên hàm của f(x) = 2x + 1 trên ℝ và F(0) = 3. Giá trị F(2) bằng', o: ['9', '6', '5', '3'], a: 0, g: 'F(x) = x² + x + 3.'}
  ],
  'I-2': [
    {t: 'mc', q: 'Nếu ∫₀² f(x)dx = 3 và ∫₂⁵ f(x)dx = −1 thì ∫₀⁵ f(x)dx bằng', o: ['4', '−3', '2', '−2'], a: 2, g: 'Cộng hai tích phân liền khoảng.'},
    {t: 'mc', q: 'Diện tích hình phẳng giới hạn bởi đồ thị y = x³, trục hoành và hai đường thẳng x = 0, x = 2 bằng', o: ['8', '4', '16', '2'], a: 1, g: '∫₀² x³dx = 4.', tp: 'ud-tich-phan', le: '12-IV-13'}
  ],
  'I-3': [
    {t: 'mc', q: 'Một mẫu số liệu ghép nhóm có tứ phân vị thứ nhất Q₁ = 12,5 và tứ phân vị thứ ba Q₃ = 20. Khoảng tứ phân vị của mẫu số liệu là', o: ['32,5', '7,5', '16,25', '8,5'], a: 1, g: 'Δ_Q = Q₃ − Q₁.'},
    {t: 'mc', q: 'Một mẫu số liệu ghép nhóm có phương sai bằng 6,25. Độ lệch chuẩn của mẫu số liệu là', o: ['2,5', '39,0625', '3,125', '12,5'], a: 0, g: 's = √6,25.', le: '12-III-10'}
  ],
  'I-4': [
    {t: 'mc', q: 'Thời gian (phút) chạy 1 km của 40 học sinh: [5; 6): 4; [6; 7): 10; [7; 8): 16; [8; 9): 7; [9; 10): 3. Mốt của mẫu số liệu ghép nhóm (làm tròn đến hàng phần trăm) là', o: ['7,40', '7,60', '7,25', '8,00'], a: 0, g: 'M₀ = 7 + 6/(6 + 9)·1.'},
    {t: 'mc', q: 'Điểm kiểm tra của 40 học sinh: [4; 5): 3; [5; 6): 7; [6; 7): 12; [7; 8): 10; [8; 9): 8. Trung vị của mẫu số liệu ghép nhóm (làm tròn đến hàng phần trăm) là', o: ['6,83', '6,50', '7,20', '6,92'], a: 0, g: 'Mₑ = 6 + (20 − 10)/12·1.'}
  ],
  'I-5': [
    {t: 'mc', q: 'Trong không gian Oxyz, đường thẳng đi qua hai điểm A(1; 2; −1) và B(3; 1; 2) có một vectơ chỉ phương là', o: ['u = (2; −1; 3)', 'u = (4; 3; 1)', 'u = (1; 2; −1)', 'u = (2; 1; 3)'], a: 0, g: 'u = AB.'},
    {t: 'mc', q: 'Trong không gian Oxyz, điểm nào sau đây thuộc đường thẳng d: x = 2 − t, y = 1 + 2t, z = 3 + t?', o: ['(2; 1; 4)', '(1; 3; 4)', '(1; 2; 3)', '(3; −1; 3)'], a: 1, g: 't = 1.'}
  ],
  'I-6': [
    {t: 'mc', q: 'Trong không gian Oxyz, mặt cầu (S): (x + 3)² + y² + (z − 2)² = 16 có tâm I và bán kính R là', o: ['I(3; 0; −2), R = 4', 'I(−3; 0; 2), R = 16', 'I(−3; 0; 2), R = 4', 'I(3; 0; 2), R = 4'], a: 2, g: 'Dạng (x − a)² + (y − b)² + (z − c)² = R².', tp: 'mat-cau', le: '12-V-17'},
    {t: 'mc', q: 'Trong không gian Oxyz, khoảng cách từ điểm M(1; 2; 3) đến mặt phẳng (P): 2x − y + 2z + 3 = 0 bằng', o: ['3', '9', '1', '5/3'], a: 0, g: '|2 − 2 + 6 + 3|/3 = 3.'}
  ],
  'I-7': [
    {t: 'mc', q: 'Hàm số y = x³ − 3x² + 2 đồng biến trên khoảng nào sau đây?', o: ['(0; 2)', '(2; +∞)', '(−1; 1)', '(−∞; 2)'], a: 1, g: 'y\' = 3x(x − 2) > 0 khi x < 0 hoặc x > 2.'},
    {t: 'mc', q: 'Hàm số y = f(x) có đạo hàm f\'(x) = x(x − 1)(x + 3) với mọi x. Số điểm cực đại của hàm số là', o: ['1', '2', '3', '0'], a: 0, g: 'f\' đổi dấu từ + sang − chỉ tại x = 0.'}
  ],
  'I-8': [
    {t: 'mc', q: 'Đồ thị hàm số y = (x² + 1)/(x − 1) có đường tiệm cận xiên là', o: ['y = x + 1', 'y = x − 1', 'y = x', 'x = 1'], a: 0, g: 'y = x + 1 + 2/(x − 1).'},
    {t: 'mc', q: 'Đạo hàm của hàm số y = x·ln x trên khoảng (0; +∞) là', o: ['y\' = 1/x', 'y\' = ln x + 1', 'y\' = ln x', 'y\' = x + ln x'], a: 1, g: '(uv)\' = u\'v + uv\'.', tp: 'dao-ham', le: '11-IX-32'}
  ],
  'I-9': [
    {t: 'mc', q: 'Tập nghiệm của bất phương trình 2ˣ > 8 là', o: ['(−∞; 3)', '(3; +∞)', '[3; +∞)', '(4; +∞)'], a: 1, g: '2ˣ > 2³ ⇔ x > 3.'},
    {t: 'mc', q: 'Với a là số thực dương tùy ý, log₂(8a) bằng', o: ['3 + log₂a', '3log₂a', '8 + log₂a', '8log₂a'], a: 0, g: 'log₂8 + log₂a.', le: '11-VI-19'}
  ],
  'I-10': [
    {t: 'mc', q: 'Cấp số cộng (uₙ) có u₁ = 2 và u₄ = 11. Công sai của cấp số cộng là', o: ['3', '9', '4', '13/3'], a: 0, g: 'u₄ = u₁ + 3d.'},
    {t: 'mc', q: 'Tổng 10 số hạng đầu của cấp số nhân (uₙ) có u₁ = 1 và công bội q = 2 bằng', o: ['1024', '512', '1023', '2047'], a: 2, g: 'S₁₀ = (2¹⁰ − 1)/(2 − 1).', le: '11-II-7'}
  ],
  'I-11': [
    {t: 'mc', q: 'Nghiệm của phương trình sin x = √3/2 là', o: ['x = π/3 + k2π hoặc x = 2π/3 + k2π (k ∈ ℤ)', 'x = ±π/3 + k2π (k ∈ ℤ)', 'x = π/6 + k2π hoặc x = 5π/6 + k2π (k ∈ ℤ)', 'x = π/3 + kπ (k ∈ ℤ)'], a: 0, g: 'sin x = sin(π/3).'},
    {t: 'mc', q: 'Với mọi số thực a, b, khẳng định nào sau đây đúng?', o: ['cos(a − b) = cos a cos b − sin a sin b', 'cos(a − b) = cos a cos b + sin a sin b', 'sin(a − b) = sin a cos b + cos a sin b', 'sin 2a = 2sin a'], a: 1, g: 'Công thức cộng.', le: '11-I-2'}
  ],
  'I-12': [
    {t: 'mc', q: 'Trong không gian Oxyz, cho a = (1; −2; 3) và b = (2; 0; −1). Tọa độ của vectơ 2a − b là', o: ['(0; −4; 7)', '(3; −2; 2)', '(0; −4; 5)', '(4; −4; 5)'], a: 0, g: '2a = (2; −4; 6).', tp: 'vecto-oxyz', le: '12-II-8'},
    {t: 'mc', q: 'Khối lăng trụ đứng có đáy là hình vuông cạnh 3 và chiều cao 4 có thể tích bằng', o: ['12', '36', '48', '24'], a: 1, g: 'V = B·h.', tp: 'the-tich', le: '11-VII-27'}
  ],
  'II-1': [
    {t: 'tf', q: 'Cho hàm số y = (2x + 1)/(x − 1).', s: [['Tập xác định của hàm số là D = ℝ \\ {1}', true], ['y\' = −3/(x − 1)²', true], ['Hàm số đồng biến trên từng khoảng xác định', false], ['Đồ thị hàm số có tâm đối xứng là điểm I(1; 2)', true]], g: 'y\' < 0 nên hàm số nghịch biến trên từng khoảng; tâm đối xứng là giao hai tiệm cận x = 1, y = 2.', le: '12-I-4'},
    {t: 'tf', q: 'Cho hàm số f(x) = x⁴ − 2x² + 3.', s: [['f\'(x) = 4x³ − 4x', true], ['Hàm số có ba điểm cực trị', true], ['Giá trị cực đại của hàm số bằng 2', false], ['Giá trị nhỏ nhất của f(x) trên đoạn [0; 2] bằng 2', true]], g: 'f\'(x) = 0 ⇔ x = 0, x = ±1; f(0) = 3 là cực đại, f(±1) = 2; f(2) = 11.'}
  ],
  'II-2': [
    {t: 'tf', q: 'Công suất sạc (kW) của một xe điện sau t giờ kể từ lúc cắm sạc là P(t) = 60 − 20t, với 0 ≤ t ≤ 2. Điện năng nạp vào pin từ thời điểm t = a đến t = b là ∫ₐᵇ P(t)dt (kWh).', s: [['Công suất lúc bắt đầu sạc là 60 kW', true], ['Sau 1 giờ, công suất sạc còn 40 kW', true], ['Điện năng nạp vào pin trong 2 giờ là 100 kWh', false], ['Điện năng nạp trong giờ thứ hai ít hơn giờ thứ nhất 20 kWh', true]], g: '∫₀² P(t)dt = 80; giờ đầu 50 kWh, giờ thứ hai 30 kWh.'},
    {t: 'tf', q: 'Một bể chứa ban đầu có 500 lít nước. Từ thời điểm t = 0 (phút), nước chảy ra khỏi bể với tốc độ r(t) = 20 − 0,5t (lít/phút), với 0 ≤ t ≤ 40.', s: [['Tốc độ nước chảy ra giảm dần theo thời gian', true], ['Lượng nước chảy ra trong 10 phút đầu bằng ∫₀¹⁰ r(t)dt', true], ['Lượng nước chảy ra trong 10 phút đầu là 175 lít', true], ['Sau 40 phút, trong bể còn 200 lít nước', false]], g: '∫₀⁴⁰ r(t)dt = 400 nên còn 100 lít.'}
  ],
  'II-3': [
    {t: 'tf', q: 'Một trường có 40% học sinh là nam. Tỉ lệ học sinh đi xe buýt đến trường là 30% trong số học sinh nam và 20% trong số học sinh nữ. Chọn ngẫu nhiên một học sinh của trường.', s: [['Xác suất chọn được học sinh nữ là 0,6', true], ['Xác suất học sinh đi xe buýt, biết học sinh đó là nam, bằng 0,3', true], ['Xác suất học sinh đi xe buýt bằng 0,24', true], ['Biết học sinh đi xe buýt, xác suất học sinh đó là nam bằng 0,6', false]], g: 'P(buýt) = 0,12 + 0,12 = 0,24; P(nam | buýt) = 0,5.'},
    {t: 'tf', q: 'Hộp I có 3 bi đỏ và 2 bi xanh; hộp II có 4 bi đỏ và 1 bi xanh. Lấy ngẫu nhiên 1 bi từ hộp I bỏ sang hộp II, rồi lấy ngẫu nhiên 1 bi từ hộp II.', s: [['Xác suất bi chuyển sang hộp II là bi đỏ bằng 0,6', true], ['Biết bi chuyển sang là bi đỏ, xác suất lấy được bi đỏ từ hộp II bằng 5/6', true], ['Xác suất lấy được bi đỏ từ hộp II bằng 23/30', true], ['Biết bi lấy từ hộp II là bi đỏ, xác suất bi chuyển sang là bi xanh lớn hơn 0,4', false]], g: 'P(đỏ) = 0,6·5/6 + 0,4·4/6 = 23/30; P(xanh chuyển | đỏ) = 8/23 ≈ 0,35.'}
  ],
  'II-4': [
    {t: 'tf', q: 'Trong không gian Oxyz (đơn vị mét), mặt đất là mặt phẳng (Oxy). Một chiếc đèn treo tại điểm D(2; 3; 6), một camera đặt tại điểm C(6; 0; 4).', s: [['Hình chiếu vuông góc của D lên mặt đất là điểm (2; 3; 0)', true], ['CD = (−4; 3; 2)', true], ['Khoảng cách từ camera đến đèn bằng √29 m', true], ['Góc giữa đường thẳng CD và mặt đất lớn hơn 30°', false]], g: 'sin φ = 2/√29 ≈ 0,37 nên φ ≈ 21,8°.'},
    {t: 'tf', q: 'Trong không gian Oxyz (đơn vị km), mặt đất là mặt phẳng (Oxy). Một khinh khí cầu bay thẳng đều từ A(1; 2; 1); sau t giờ nó ở vị trí M(1 + 2t; 2 + 2t; 1 + t).', s: [['Sau 1 giờ, khinh khí cầu ở độ cao 2 km', true], ['Tốc độ của khinh khí cầu là 3 km/h', true], ['Khinh khí cầu đi qua điểm (5; 6; 3)', true], ['Khi ở độ cao 4 km, khinh khí cầu cách A đúng 6 km', false]], g: 'Mỗi giờ dời theo u = (2; 2; 1), |u| = 3; độ cao 4 km khi t = 3, AM = 9 km.'}
  ],
  'III-1': [
    {t: 'sa', q: 'Cho hình lập phương ABCD.A\'B\'C\'D\' có cạnh bằng 6. Tính khoảng cách từ điểm A đến mặt phẳng (A\'BD).', a: '3,46', g: 'Tứ diện AA\'BD có ba cạnh đôi một vuông góc tại A: 1/d² = 3/36.', r: 'Làm tròn đến hàng phần trăm'},
    {t: 'sa', q: 'Cho hình chóp tứ giác đều S.ABCD có cạnh đáy bằng 6 và cạnh bên bằng 5. Tính thể tích khối chóp.', a: '31,7', g: 'h = √(25 − 18) = √7; V = ⅓·36·√7 = 12√7.', r: 'Làm tròn đến hàng phần mười', tp: 'the-tich', le: '11-VII-27'}
  ],
  'III-2': [
    {t: 'sa', q: 'Một chiếc lu có dạng khối tròn xoay tạo thành khi quay hình phẳng giới hạn bởi đồ thị y = √(x + 1), trục Ox và hai đường thẳng x = 0, x = 3 quanh trục Ox (đơn vị dm). Tính thể tích chiếc lu (dm³).', a: '23,6', g: 'V = π∫₀³ (x + 1)dx = 7,5π.', r: 'Làm tròn đến hàng phần mười'},
    {t: 'sa', q: 'Tính diện tích hình phẳng giới hạn bởi parabol y = x² và đường thẳng y = x + 2.', a: '4,5', g: 'Giao điểm x = −1, x = 2; S = ∫₋₁² (x + 2 − x²)dx = 9/2.', r: ''}
  ],
  'III-3': [
    {t: 'sa', q: 'Một con tàu đi quãng đường 400 km với vận tốc không đổi v (km/h). Chi phí nhiên liệu mỗi giờ là 0,01v³ (nghìn đồng), các chi phí khác là 540 nghìn đồng mỗi giờ. Tàu nên đi với vận tốc bao nhiêu km/h để tổng chi phí của chuyến đi nhỏ nhất?', a: '30', g: 'T(v) = (400/v)(0,01v³ + 540) = 4v² + 216 000/v; T\'(v) = 0 ⇔ v³ = 27 000.', r: ''},
    {t: 'sa', q: 'Từ một tấm tôn hình vuông cạnh 6 dm, người ta cắt bỏ ở bốn góc bốn hình vuông bằng nhau cạnh x dm rồi gập lại thành một chiếc hộp không nắp. Thể tích lớn nhất của chiếc hộp là bao nhiêu dm³?', a: '16', g: 'V(x) = x(6 − 2x)², 0 < x < 3; V\'(x) = 0 ⇔ x = 1.', r: ''}
  ],
  'III-4': [
    {t: 'sa', q: 'Một xưởng làm hai loại bánh. Mỗi hộp loại A cần 2 kg bột và 1 kg đường, lãi 50 nghìn đồng; mỗi hộp loại B cần 1 kg bột và 1 kg đường, lãi 40 nghìn đồng. Xưởng có 60 kg bột và 40 kg đường. Tiền lãi lớn nhất là bao nhiêu nghìn đồng?', a: '1800', g: '2x + y ≤ 60, x + y ≤ 40; các đỉnh (30; 0), (20; 20), (0; 40).', r: ''},
    {t: 'sa', q: 'Một quán bán ba loại đồ uống: trà, cà phê và nước cam. Ngày thứ nhất quán bán 10 ly trà, 20 ly cà phê, 10 ly nước cam, thu 700 nghìn đồng; ngày thứ hai bán 20 ly trà, 10 ly cà phê, 10 ly nước cam, thu 650 nghìn đồng; ngày thứ ba bán 10 ly trà, 10 ly cà phê, 20 ly nước cam, thu 750 nghìn đồng. Giá một ly nước cam là bao nhiêu nghìn đồng?', a: '22,5', g: 'x + 2y + z = 70; 2x + y + z = 65; x + y + 2z = 75.', r: '', tp: 'he-pt-3an', le: '10-CD-1'}
  ],
  'III-5': [
    {t: 'sa', q: 'Có bao nhiêu cách chọn từ 10 học sinh một ban cán sự gồm 1 lớp trưởng, 1 lớp phó và 2 ủy viên?', a: '2520', g: '10·9·C₈².', r: ''},
    {t: 'sa', q: 'Từ các chữ số 1, 2, 3, 4, 5, 6 lập được bao nhiêu số tự nhiên có 3 chữ số khác nhau và lớn hơn 400?', a: '60', g: 'Chữ số hàng trăm là 4, 5 hoặc 6: 3·5·4.', r: ''}
  ],
  'III-6': [
    {t: 'sa', q: 'Một hộp có 5 bi đỏ và 7 bi xanh. Lấy ngẫu nhiên đồng thời 3 bi. Tính xác suất lấy được ít nhất 1 bi đỏ.', a: '0,84', g: '1 − C₇³/C₁₂³ = 1 − 35/220.', r: 'Làm tròn đến hàng phần trăm'},
    {t: 'sa', q: 'Hai xạ thủ bắn độc lập, mỗi người một viên vào bia, xác suất bắn trúng lần lượt là 0,8 và 0,7. Biết bia bị trúng đúng một viên, tính xác suất viên trúng đó là của xạ thủ thứ nhất.', a: '0,63', g: 'P(đúng một viên) = 0,8·0,3 + 0,2·0,7 = 0,38; P = 0,24/0,38.', r: 'Làm tròn đến hàng phần trăm', tp: 'xs-dk', le: '12-VI-18'}
  ]
};
