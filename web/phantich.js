// Phân tích đề thi tốt nghiệp THPT môn Toán (định dạng từ 2025) và khung tiêu chí đánh giá.
// Mỗi đề: 22 vị trí câu (I.1–I.12, II.1–II.4, III.1–III.6) gán vào một "mặt kiến thức" (topic).
// null = chưa phân loại được từ nguồn; c = danh sách vị trí phân loại chưa chắc chắn (đề gốc dạng MathType, mất công thức).
window.KHKT_ANALYSIS = {
  capnhat: '11/2026',
  // ---------- chuẩn chung để đánh giá ----------
  chuan: {
    canCu: [
      'Chương trình giáo dục phổ thông môn Toán 2018 (Thông tư 32/2018/TT-BGDĐT): yêu cầu cần đạt từng bài và năm thành phần năng lực toán học.',
      'Quyết định 764/QĐ-BGDĐT ngày 08/03/2024 về cấu trúc định dạng đề thi tốt nghiệp THPT từ năm 2025: ba dạng câu hỏi, 22 câu, 90 phút.',
      'Đề tham khảo 2025, đề chính thức 2025 và 2026 của Bộ GD&ĐT; đề khảo sát năm học 2025–2026 của 9 Sở GD&ĐT (bảng bên dưới).'
    ],
    mucDo: {
      B: {ten: 'Biết', mota: 'Nhận ra, nhắc lại công thức, định nghĩa; áp dụng trực tiếp một bước.'},
      H: {ten: 'Hiểu', mota: 'Giải thích, so sánh, biến đổi qua 2–3 bước theo cách quen thuộc.'},
      VD: {ten: 'Vận dụng', mota: 'Kết hợp nhiều kiến thức, chọn cách giải, giải bài toán thực tế hoặc tình huống mới.'}
    },
    nangLuc: {
      TD: {ten: 'Tư duy và lập luận toán học', mota: 'Lập luận, suy luận đúng; chọn và dùng đúng công thức, tính chất.'},
      GQ: {ten: 'Giải quyết vấn đề toán học', mota: 'Phát hiện vấn đề, lập kế hoạch giải, thực hiện và kiểm tra kết quả.'},
      MH: {ten: 'Mô hình hóa toán học', mota: 'Chuyển tình huống thực tế thành hàm số, phương trình, hình học; giải và đối chiếu thực tế.'}
    },
    // Khung theo phần của đề: dùng để gán mức độ, năng lực mặc định cho từng câu
    phan: {
      1: {muc: 'B/H', nl: 'TD', note: '12 câu nhiều lựa chọn ở mức Biết và Hiểu, mỗi câu 0,25 điểm.'},
      2: {muc: 'B→VD', nl: 'TD, GQ, MH', note: '4 câu đúng/sai, 4 ý mỗi câu khó dần: ý a Biết, ý b Hiểu, ý c Hiểu hoặc Vận dụng, ý d Vận dụng.'},
      3: {muc: 'VD', nl: 'GQ, MH', note: '6 câu trả lời ngắn ở mức Vận dụng, phần lớn có bối cảnh thực tế, mỗi câu 0,5 điểm.'}
    },
    // Thang xếp loại dùng trong web app (do nhóm đề xuất, không phải quy định của Bộ)
    xepLoai: [
      {tu: 0.8, ten: 'Tốt', mota: 'Làm đúng phần lớn câu ở mức này; giữ nhịp luyện đề.'},
      {tu: 0.5, ten: 'Đạt', mota: 'Nắm được cách làm nhưng còn sai sót; ôn lại các bài được gợi ý.'},
      {tu: 0, ten: 'Chưa đạt', mota: 'Cần ôn lại kiến thức nền của các bài được gợi ý trước khi luyện đề tiếp.'}
    ]
  },
  // ---------- mặt kiến thức ----------
  topics: {
    'nguyen-ham':   {ten: 'Nguyên hàm', nhom: 'Giải tích', lop: 12, lessons: ['12-IV-11']},
    'tich-phan':    {ten: 'Tích phân và tính chất', nhom: 'Giải tích', lop: 12, lessons: ['12-IV-12']},
    'ud-tich-phan': {ten: 'Ứng dụng tích phân: diện tích, thể tích', nhom: 'Giải tích', lop: 12, lessons: ['12-IV-13']},
    'tp-thuc-te':   {ten: 'Nguyên hàm, tích phân trong bài toán thực tế (vận tốc, công suất, tốc độ thay đổi)', nhom: 'Giải tích', lop: 12, lessons: ['12-IV-11', '12-IV-12']},
    'don-dieu':     {ten: 'Đơn điệu, cực trị (đọc bảng biến thiên, đồ thị)', nhom: 'Giải tích', lop: 12, lessons: ['12-I-1']},
    'gtln':         {ten: 'Giá trị lớn nhất, nhỏ nhất', nhom: 'Giải tích', lop: 12, lessons: ['12-I-2']},
    'tiem-can':     {ten: 'Tiệm cận của đồ thị hàm số', nhom: 'Giải tích', lop: 12, lessons: ['12-I-3']},
    'khao-sat':     {ten: 'Khảo sát hàm số tổng hợp (câu đúng/sai)', nhom: 'Giải tích', lop: 12, lessons: ['12-I-4', '12-I-1', '12-I-2']},
    'toi-uu':       {ten: 'Bài toán tối ưu thực tế', nhom: 'Giải tích', lop: 12, lessons: ['12-I-5']},
    'dao-ham':      {ten: 'Đạo hàm, tiếp tuyến', nhom: 'Giải tích', lop: 11, lessons: ['11-IX-31', '11-IX-32', '11-IX-33']},
    'mu-log':       {ten: 'Mũ, lôgarit: phương trình, bất phương trình, lãi kép', nhom: 'Đại số', lop: 11, lessons: ['11-VI-18', '11-VI-19', '11-VI-20', '11-VI-21']},
    'csc-csn':      {ten: 'Cấp số cộng, cấp số nhân', nhom: 'Đại số', lop: 11, lessons: ['11-II-5', '11-II-6', '11-II-7']},
    'luong-giac':   {ten: 'Công thức và phương trình lượng giác', nhom: 'Đại số', lop: 11, lessons: ['11-I-1', '11-I-2', '11-I-3', '11-I-4']},
    'he-pt-3an':    {ten: 'Hệ phương trình bậc nhất ba ẩn trong bài toán thực tế', nhom: 'Đại số', lop: 10, lessons: ['10-CD-1']},
    'pt-can':       {ten: 'Phương trình quy về bậc hai (chứa căn)', nhom: 'Đại số', lop: 10, lessons: ['10-VI-18']},
    'qhtt':         {ten: 'Hệ bất phương trình bậc nhất hai ẩn, quy hoạch tuyến tính', nhom: 'Đại số', lop: 10, lessons: ['10-II-3', '10-II-4']},
    'thong-ke-tt':  {ten: 'Số đặc trưng đo xu thế trung tâm (mẫu ghép nhóm)', nhom: 'Thống kê, xác suất', lop: 11, lessons: ['11-III-8', '11-III-9']},
    'thong-ke-pt':  {ten: 'Số đặc trưng đo mức độ phân tán (mẫu ghép nhóm)', nhom: 'Thống kê, xác suất', lop: 12, lessons: ['12-III-9', '12-III-10']},
    'xs-dk':        {ten: 'Xác suất có điều kiện, xác suất toàn phần, Bayes', nhom: 'Thống kê, xác suất', lop: 12, lessons: ['12-VI-18', '12-VI-19']},
    'xac-suat':     {ten: 'Xác suất cổ điển, quy tắc cộng và nhân xác suất', nhom: 'Thống kê, xác suất', lop: 11, lessons: ['10-IX-27', '11-VIII-28', '11-VIII-29', '11-VIII-30']},
    'to-hop':       {ten: 'Quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp', nhom: 'Thống kê, xác suất', lop: 10, lessons: ['10-VIII-23', '10-VIII-24']},
    'vecto-oxyz':   {ten: 'Tọa độ điểm, vectơ trong không gian Oxyz', nhom: 'Hình học', lop: 12, lessons: ['12-II-7', '12-II-8']},
    'mat-phang':    {ten: 'Phương trình mặt phẳng', nhom: 'Hình học', lop: 12, lessons: ['12-V-14']},
    'duong-thang':  {ten: 'Phương trình đường thẳng, góc trong không gian', nhom: 'Hình học', lop: 12, lessons: ['12-V-15', '12-V-16']},
    'mat-cau':      {ten: 'Phương trình mặt cầu', nhom: 'Hình học', lop: 12, lessons: ['12-V-17']},
    'oxyz-thuc-te': {ten: 'Tọa độ Oxyz trong bài toán thực tế (radar, đường bay, công trình)', nhom: 'Hình học', lop: 12, lessons: ['12-V-15', '12-V-16', '12-V-17']},
    'hhkg-co-ban':  {ten: 'Hình không gian cơ bản: song song, vuông góc, góc, vectơ', nhom: 'Hình học', lop: 11, lessons: ['11-IV-12', '11-VII-23', '11-VII-25', '12-II-6']},
    'khoang-cach':  {ten: 'Khoảng cách trong không gian', nhom: 'Hình học', lop: 11, lessons: ['11-VII-26']},
    'the-tich':     {ten: 'Thể tích khối chóp, lăng trụ, chóp cụt', nhom: 'Hình học', lop: 11, lessons: ['11-VII-27']},
    'toa-do-phang': {ten: 'Đường tròn, ba đường conic trong mặt phẳng tọa độ', nhom: 'Hình học', lop: 10, lessons: ['10-VII-21', '10-VII-22']}
  },
  // ---------- các đề đã phân tích ----------
  exams: [
    {id: 'dtk25', ten: 'Đề tham khảo 2025', loai: 'Bộ', nguon: 'Bộ GD&ĐT',
      p1: ['nguyen-ham','tich-phan','thong-ke-pt','duong-thang','tiem-can','mu-log','mat-phang','hhkg-co-ban','mu-log','csc-csn','hhkg-co-ban','don-dieu'],
      p2: ['khao-sat','tp-thuc-te','xs-dk','oxyz-thuc-te'],
      p3: ['khoang-cach',null,null,'ud-tich-phan','toi-uu','xac-suat'], c: []},
    {id: 'dct25', ten: 'Đề chính thức 2025', loai: 'Bộ', nguon: 'Bộ GD&ĐT',
      p1: ['hhkg-co-ban','mu-log','hhkg-co-ban','nguyen-ham','duong-thang','csc-csn','mat-phang','luong-giac','hhkg-co-ban','tiem-can','tich-phan','thong-ke-pt'],
      p2: ['khao-sat','xs-dk','oxyz-thuc-te','tp-thuc-te'],
      p3: ['to-hop','ud-tich-phan','khoang-cach','qhtt','xac-suat','toi-uu'], c: ['II.3']},
    {id: 'dct26a', ten: 'Đề chính thức 2026 (đề gốc thứ nhất)', loai: 'Bộ', nguon: 'Bộ GD&ĐT',
      p1: ['hhkg-co-ban','nguyen-ham','thong-ke-pt','thong-ke-tt','csc-csn','luong-giac','duong-thang','nguyen-ham','tich-phan','don-dieu','hhkg-co-ban','tiem-can'],
      p2: ['tp-thuc-te','khao-sat','xs-dk','oxyz-thuc-te'],
      p3: ['xac-suat','qhtt','toi-uu','to-hop','ud-tich-phan','khoang-cach'], c: []},
    {id: 'dct26b', ten: 'Đề chính thức 2026, mã đề 101', loai: 'Bộ', nguon: 'Bộ GD&ĐT; lời giải: loigiaihay.com',
      url: 'https://loigiaihay.com/de-thi-toan-thpt-nam-2026-ma-101-co-loi-giai-chi-tiet-a194992.html',
      p1: ['csc-csn','dao-ham','nguyen-ham','mu-log','vecto-oxyz','xac-suat','hhkg-co-ban','qhtt','nguyen-ham','tiem-can','csc-csn','thong-ke-tt'],
      p2: ['xs-dk','khao-sat','tp-thuc-te','oxyz-thuc-te'],
      p3: ['khoang-cach','to-hop','ud-tich-phan','xac-suat','he-pt-3an','toi-uu'], c: []},
    {id: 'thanhhoa', ten: 'Sở GD&ĐT Thanh Hóa, khảo sát lần 2', loai: 'Sở', nguon: 'mathvn.com (file Word)', url: 'https://www.mathvn.com/2026/04/05-e-thi-thu-mon-toan-tot-nghiep-thpt.html',
      p1: ['mat-phang','hhkg-co-ban','csc-csn','vecto-oxyz','nguyen-ham','tiem-can','don-dieu','thong-ke-tt','the-tich','mu-log','luong-giac','ud-tich-phan'],
      p2: ['xs-dk','khao-sat','tp-thuc-te','oxyz-thuc-te'],
      p3: ['the-tich','dao-ham','mat-cau','xac-suat','toi-uu','ud-tich-phan'], c: ['III.6']},
    {id: 'thainguyen', ten: 'Sở GD&ĐT Thái Nguyên, lần 2', loai: 'Sở', nguon: 'mathvn.com (file Word)', url: 'https://www.mathvn.com/2026/04/05-e-thi-thu-mon-toan-tot-nghiep-thpt.html',
      p1: ['hhkg-co-ban','mu-log','mat-phang','tiem-can','the-tich','thong-ke-tt','nguyen-ham','luong-giac','ud-tich-phan','hhkg-co-ban','csc-csn','vecto-oxyz'],
      p2: ['khao-sat','oxyz-thuc-te','khao-sat','xs-dk'],
      p3: ['the-tich','ud-tich-phan','xac-suat','csc-csn','to-hop','toi-uu'], c: ['II.1']},
    {id: 'camau', ten: 'Sở GD&ĐT Cà Mau, lần 1', loai: 'Sở', nguon: 'mathvn.com (file Word)', url: 'https://www.mathvn.com/2026/04/05-e-thi-thu-mon-toan-tot-nghiep-thpt.html',
      p1: ['gtln','don-dieu','thong-ke-tt','vecto-oxyz','mu-log','mu-log','csc-csn','ud-tich-phan','vecto-oxyz','ud-tich-phan','toa-do-phang','don-dieu'],
      p2: ['xs-dk','toa-do-phang','tp-thuc-te','khao-sat'],
      p3: ['xac-suat','toi-uu','khoang-cach','oxyz-thuc-te','ud-tich-phan','qhtt'], c: ['I.5','I.6']},
    {id: 'danang', ten: 'Sở GD&ĐT Đà Nẵng, lần 1', loai: 'Sở', nguon: 'mathvn.com (file Word)', url: 'https://www.mathvn.com/2026/04/05-e-thi-thu-mon-toan-tot-nghiep-thpt.html',
      p1: ['duong-thang','thong-ke-tt','csc-csn','luong-giac','hhkg-co-ban','mu-log','hhkg-co-ban','tiem-can','nguyen-ham','mat-phang','the-tich','mu-log'],
      p2: ['khao-sat','tp-thuc-te','xs-dk','oxyz-thuc-te'],
      p3: ['ud-tich-phan','xac-suat','qhtt','khoang-cach','toi-uu','ud-tich-phan'], c: []},
    {id: 'nghean', ten: 'Sở GD&ĐT Nghệ An, lần 2', loai: 'Sở', nguon: 'mathvn.com (file Word)', url: 'https://www.mathvn.com/2026/04/05-e-thi-thu-mon-toan-tot-nghiep-thpt.html',
      p1: ['duong-thang','toa-do-phang','mat-phang','don-dieu','the-tich','mat-cau','nguyen-ham','tich-phan','tich-phan','tiem-can','thong-ke-pt','luong-giac'],
      p2: ['oxyz-thuc-te','xs-dk','khao-sat','tp-thuc-te'],
      p3: ['toi-uu','the-tich','xac-suat','ud-tich-phan','oxyz-thuc-te','mu-log'], c: ['I.11','I.12']},
    {id: 'haiphong', ten: 'Sở GD&ĐT Hải Phòng, khảo sát lần 2', loai: 'Sở', nguon: 'VietJack (ảnh đề gốc)', url: 'https://vietjack.com/de-thi-tot-nghiep/de-thi-thu-2026-toan-so-gddt-hai-phong-lan2.jsp',
      p1: ['hhkg-co-ban','vecto-oxyz','duong-thang','tiem-can','mu-log','khao-sat','mat-phang','mu-log','luong-giac','csc-csn','tich-phan','thong-ke-tt'],
      p2: ['tp-thuc-te','khoang-cach','xs-dk','gtln'],
      p3: ['toi-uu','qhtt','ud-tich-phan','the-tich','mat-phang','xac-suat'], c: []},
    {id: 'ninhbinh', ten: 'Sở GD&ĐT Ninh Bình, khảo sát lần 3', loai: 'Sở', nguon: 'VietJack (ảnh đề gốc)', url: 'https://vietjack.com/de-thi-tot-nghiep/de-thi-thu-2026-toan-so-gddt-ninh-binh-lan3.jsp',
      p1: ['nguyen-ham','luong-giac','tich-phan','mu-log','gtln','duong-thang','csc-csn','hhkg-co-ban','xac-suat','mat-cau','vecto-oxyz','don-dieu'],
      p2: ['mu-log','mat-phang','thong-ke-tt','tp-thuc-te'],
      p3: ['csc-csn','xs-dk','toi-uu','oxyz-thuc-te','ud-tich-phan','toa-do-phang'], c: []},
    {id: 'phutho', ten: 'Sở GD&ĐT Phú Thọ, khảo sát lần 2', loai: 'Sở', nguon: 'VietJack (ảnh đề gốc)', url: 'https://vietjack.com/de-thi-tot-nghiep/de-thi-thu-2026-toan-so-gddt-phu-tho-lan2.jsp',
      p1: ['thong-ke-tt','xac-suat','duong-thang','tich-phan','pt-can','csc-csn','dao-ham','mu-log','don-dieu','gtln','luong-giac','vecto-oxyz'],
      p2: ['mat-cau','tp-thuc-te','xs-dk','khao-sat'],
      p3: ['toi-uu','the-tich','vecto-oxyz','toi-uu','oxyz-thuc-te','ud-tich-phan'], c: []},
    {id: 'hatinh', ten: 'Sở GD&ĐT Hà Tĩnh, thi thử mã 0101', loai: 'Sở', nguon: 'VietJack (ảnh đề gốc)', url: 'https://vietjack.com/on-thi-dai-hoc/de-thi-thu-2026-toan-so-gddt-ha-tinh.jsp',
      p1: ['the-tich','mat-cau','mu-log','tiem-can','thong-ke-pt','dao-ham','luong-giac','mat-phang','vecto-oxyz','hhkg-co-ban','don-dieu','csc-csn'],
      p2: ['khao-sat','xs-dk','tp-thuc-te','oxyz-thuc-te'],
      p3: ['qhtt','toi-uu','the-tich','xac-suat','ud-tich-phan','to-hop'], c: ['III.6']}
  ]
};
