// Mức độ tư duy của từng câu trong bài học: N (Nhận biết), T (Thông hiểu), V (Vận dụng).
// Chuỗi 5 ký tự theo thứ tự: câu chẩn đoán, bài tập 1, bài tập 2, bài tập 4, bài tập 5.
// Bài tập 3 là câu đúng/sai: ý a Nhận biết, ý b và c Thông hiểu, ý d Vận dụng (như đề thi THPT).
window.KHKT_MUC = {
  '10-II-3':'NNTVV', '10-II-4':'VNTVV', '10-III-5':'NNTTT', '10-III-6':'TTNTV', '10-IV-7':'NTNTT',
  '10-IV-8':'TNNVT', '10-IV-9':'TNNTT', '10-IV-10':'NNTTT', '10-IV-11':'TTNTT', '10-VI-15':'NNNNV',
  '10-VI-16':'NNTVV', '10-VI-17':'TTTTV', '10-VI-18':'TTTTV', '10-VII-19':'NNTTV', '10-VII-21':'NNTVV',
  '10-VII-22':'TNTTV', '10-VIII-23':'NNNTV', '10-VIII-24':'TNNTV', '10-VIII-25':'NTTTV', '10-IX-26':'NNNTT',
  '10-IX-27':'TTTVT', '10-CD-1':'NNTVV',
  '11-I-1':'NNNTT', '11-I-2':'NNTTT', '11-I-3':'NNTTT', '11-I-4':'TNNVV', '11-II-5':'NTTNT',
  '11-II-6':'NNTTV', '11-II-7':'NNTVV', '11-III-8':'NNNTT', '11-III-9':'TNTVT', '11-IV-10':'NNTTT',
  '11-IV-11':'NTNTT', '11-IV-12':'NNTVV', '11-IV-13':'NNNNT', '11-IV-14':'NNTTT', '11-V-15':'NTNTT',
  '11-V-16':'TNTTV', '11-V-17':'NNTTT', '11-VI-18':'NTNTV', '11-VI-19':'NNNTV', '11-VI-20':'NNNVN',
  '11-VI-21':'NNTTV', '11-VII-22':'NTTTV', '11-VII-23':'NTNTT', '11-VII-24':'TNTVT', '11-VII-25':'NTNVT',
  '11-VII-26':'NNTVV', '11-VII-27':'NNTTV', '11-VIII-28':'NNTTT', '11-VIII-29':'NNTNV', '11-VIII-30':'NTVTT',
  '11-IX-31':'TTNTV', '11-IX-32':'NNTTT', '11-IX-33':'NNTTT',
  '12-I-1':'NTTTV', '12-I-2':'TTTVV', '12-I-3':'NNTTV', '12-I-4':'NNTTV', '12-I-5':'TTTVV',
  '12-II-6':'NNTVT', '12-II-7':'NNNTT', '12-II-8':'NTNNT', '12-III-9':'NNNVV', '12-III-10':'NNTVV',
  '12-IV-11':'NNNVT', '12-IV-12':'NTTTV', '12-IV-13':'NTTVV', '12-V-14':'TNTTV', '12-V-15':'NTTTV',
  '12-V-16':'NTTVV', '12-V-17':'NNTTV', '12-VI-18':'NNTVV', '12-VI-19':'NTTVV'
};

// Bài tập bổ sung để bài nào cũng có đủ ba mức (nối vào sau 5 bài tập sẵn có, khóa bài#5).
window.KHKT_EX_ADD = {
  // Vận dụng
  '10-III-5': [{t:'sa', m:'V', q:'Cho sin α = 3/5 với 90° < α < 180°. Tính tan α − cos α.', a:'0,05', r:''}],
  '10-IV-7': [{t:'sa', m:'V', q:'Cho lục giác đều ABCDEF tâm O. Có bao nhiêu vectơ khác vectơ-không, cùng phương với vectơ OA, có điểm đầu và điểm cuối là hai trong bảy điểm A, B, C, D, E, F, O?', a:'10', r:''}],
  '10-IV-9': [{t:'sa', m:'V', q:'Cho tam giác ABC, điểm M thuộc cạnh BC sao cho BM = 2MC. Biết vectơ AM = x·vectơ AB + y·vectơ AC. Tính 3x + 6y.', a:'5', r:''}],
  '10-IV-10': [{t:'sa', m:'V', q:'Cho A(1; 2), B(3; −1), C(−2; 4). Điểm D(a; b) làm cho ABCD là hình bình hành. Tính a + b.', a:'3', r:''}],
  '10-IV-11': [{t:'sa', m:'V', q:'Một người kéo thùng hàng bằng một lực có độ lớn 50 N, hướng hợp với phương ngang góc 30°, làm thùng dịch chuyển 20 m theo phương ngang. Tính công của lực (J).', a:'866', r:'Làm tròn đến hàng đơn vị'}],
  '10-IX-26': [{t:'sa', m:'V', q:'Hộp có 10 thẻ đánh số từ 1 đến 10. Rút ngẫu nhiên đồng thời 2 thẻ. Tính xác suất tích hai số trên thẻ là số chẵn.', a:'0,78', r:'Làm tròn đến hàng phần trăm'}],
  '11-I-1': [{t:'sa', m:'V', q:'Một bánh xe bán kính 25 cm quay được 2/5 vòng mỗi giây. Tính quãng đường (m) một điểm trên vành bánh xe đi được trong 10 giây.', a:'6,3', r:'Làm tròn đến hàng phần mười'}],
  '11-I-2': [{t:'sa', m:'V', q:'Cho cos 2a = 1/3 với 0 < a < π/2. Tính sin a.', a:'0,58', r:'Làm tròn đến hàng phần trăm'}],
  '11-I-3': [{t:'sa', m:'V', q:'Nhiệt độ ngoài trời một ngày là T(t) = 25 + 4sin(πt/12) (°C), với t là số giờ tính từ 6 giờ sáng, 0 ≤ t ≤ 24. Trong ngày có bao nhiêu giờ nhiệt độ không thấp hơn 27 °C?', a:'8', r:''}],
  '11-II-5': [{t:'sa', m:'V', q:'Cho dãy số uₙ = (2n + 1)/(n + 3). Dãy có bao nhiêu số hạng nhỏ hơn 1,8?', a:'21', r:''}],
  '11-III-8': [{t:'sa', m:'V', q:'Điểm kiểm tra của 40 học sinh: [5; 6): 4; [6; 7): 10; [7; 8): 14; [8; 9): 8; [9; 10]: 4. Coi điểm trong mỗi nhóm phân bố đều, ước lượng số học sinh đạt từ 7,5 điểm trở lên.', a:'19', r:''}],
  '11-IV-10': [{t:'sa', m:'V', q:'Cho hình chóp S.ABCD có đáy là hình bình hành tâm O, M là trung điểm SC. Gọi I là giao điểm của AM với mặt phẳng (SBD). Tính tỉ số AI/AM.', a:'0,67', r:'Làm tròn đến hàng phần trăm'}],
  '11-IV-11': [{t:'sa', m:'V', q:'Cho tứ diện ABCD có AC = 6, BD = 8. Gọi M, N, P, Q lần lượt là trung điểm AB, BC, CD, DA. Tính chu vi tứ giác MNPQ.', a:'14', r:''}],
  '11-IV-13': [{t:'sa', m:'V', q:'Hình chóp S.ABC có SA = 9 và diện tích tam giác ABC bằng 27. Mặt phẳng (P) song song với (ABC) cắt SA, SB, SC lần lượt tại M, N, P với SM = 6. Tính diện tích tam giác MNP.', a:'12', r:''}],
  '11-IV-14': [{t:'sa', m:'V', q:'Tam giác ABC có trọng tâm G, M là trung điểm BC. Qua một phép chiếu song song, ảnh của A, G, M lần lượt là A\', G\', M\' với A\'M\' = 9 cm. Tính A\'G\' (cm).', a:'6', r:''}],
  '11-V-15': [{t:'sa', m:'V', q:'Thả một quả bóng từ độ cao 10 m. Mỗi lần chạm đất, bóng nảy lên bằng 3/4 độ cao lần rơi trước. Tính tổng quãng đường (m) bóng đi được cho đến khi dừng hẳn.', a:'70', r:''}],
  '11-V-17': [{t:'sa', m:'V', q:'Cho f(x) = (x² − 3x + 2)/(x − 1) khi x ≠ 1 và f(1) = 2m + 1. Tìm m để hàm số liên tục tại x = 1.', a:'−1', r:''}],
  '11-VII-23': [{t:'sa', m:'V', q:'Hình chóp S.ABC có SA ⊥ (ABC), tam giác ABC vuông tại B, SA = 4, AB = 3, BC = 12. Tính SC.', a:'13', r:''}],
  '11-VIII-28': [{t:'sa', m:'V', q:'Gieo hai con xúc xắc cân đối. A: "tổng số chấm bằng 7"; B: "có ít nhất một con xuất hiện mặt 1 chấm". Biến cố A ∪ B có bao nhiêu kết quả thuận lợi?', a:'15', r:''}],
  '11-IX-32': [{t:'sa', m:'V', q:'Một vật dao động có li độ x(t) = 4cos 2t (cm), t tính bằng giây. Tính vận tốc của vật (cm/s) tại thời điểm t = π/4.', a:'−8', r:''}],
  '11-IX-33': [{t:'sa', m:'V', q:'Một vật chuyển động theo phương trình s(t) = t³ − 6t² + 9t (m), t tính bằng giây. Tính gia tốc (m/s²) tại thời điểm đầu tiên vận tốc bằng 0.', a:'−6', r:''}],
  '12-II-7': [{t:'sa', m:'V', q:'Trong không gian Oxyz, cho A(1; 2; 3). Gọi A₁, A₂, A₃ lần lượt là hình chiếu vuông góc của A trên các mặt phẳng (Oxy), (Oyz), (Ozx). Tính thể tích tứ diện OA₁A₂A₃.', a:'2', r:''}],
  '12-II-8': [{t:'sa', m:'V', q:'Trong không gian Oxyz (đơn vị mét), một drone bay thẳng từ A(0; 0; 50) đến B(120; 160; 50) với tốc độ không đổi 10 m/s. Drone bay hết bao nhiêu giây?', a:'20', r:''}],
  // Nhận biết
  '10-VI-17': [{t:'mc', m:'N', q:'Tam thức f(x) = ax² + bx + c (a ≠ 0) có Δ < 0. Khẳng định nào đúng?', o:['f(x) cùng dấu với hệ số a với mọi x ∈ ℝ', 'f(x) trái dấu với hệ số a với mọi x ∈ ℝ', 'Phương trình f(x) = 0 có hai nghiệm phân biệt', 'f(x) đổi dấu khi x đi qua −b/(2a)'], a:0}],
  '10-VI-18': [{t:'mc', m:'N', q:'Phương trình √f(x) = g(x) tương đương với', o:['g(x) ≥ 0 và f(x) = g²(x)', 'f(x) ≥ 0 và f(x) = g(x)', 'f(x) = g²(x)', 'g(x) ≤ 0 và f(x) = g²(x)'], a:0}],
  '10-IX-27': [{t:'mc', m:'N', q:'Với không gian mẫu Ω gồm các kết quả đồng khả năng, xác suất của biến cố A là', o:['P(A) = n(A)/n(Ω)', 'P(A) = n(Ω)/n(A)', 'P(A) = n(A)·n(Ω)', 'P(A) = 1 − n(A)'], a:0}],
  '12-I-2': [{t:'mc', m:'N', q:'Hàm số y = f(x) liên tục trên đoạn [1; 3], có f(1) = 2, f(2) = 5, f(3) = −1 và đạt cực trị duy nhất tại x = 2. Giá trị lớn nhất của f(x) trên [1; 3] là', o:['5', '2', '−1', '3'], a:0}],
  '12-I-5': [{t:'mc', m:'N', q:'Nếu s(t) là quãng đường vật đi được sau thời gian t thì vận tốc tức thời của vật tại thời điểm t₀ là', o:['s\'(t₀)', 's\'\'(t₀)', 's(t₀)/t₀', 's(t₀)'], a:0}]
};
