// Bổ sung bài học lớp 10 theo phân tích đề: tọa độ trong mặt phẳng (đường tròn, conic)
// và hệ phương trình bậc nhất ba ẩn (chuyên đề học tập), hai mặt kiến thức đề Sở đã ra.
(function(){
  const D = window.KHKT_DATA;
  if (!D || !D[10]) return;

  const toaDo = {
    id: '10-VII', so: 'VII', ten: 'Phương pháp tọa độ trong mặt phẳng', hk: 2,
    lessons: [
      {
        id: '10-VII-19', ten: 'Bài 19. Phương trình đường thẳng',
        ycc: [
          'Lập phương trình tổng quát, phương trình tham số của đường thẳng khi biết một điểm và một vectơ pháp tuyến hoặc vectơ chỉ phương.',
          'Chuyển đổi giữa hai dạng phương trình; vận dụng vào bài toán thực tế có quan hệ bậc nhất.'
        ],
        kt: [
          'Vectơ pháp tuyến n = (a; b) ≠ 0 vuông góc với đường thẳng; vectơ chỉ phương u = (u₁; u₂) ≠ 0 song song hoặc nằm trên đường thẳng.',
          'Nếu n = (a; b) thì u = (−b; a) là một vectơ chỉ phương, và ngược lại.',
          'Đi qua M(x₀; y₀), có pháp tuyến n = (a; b): a(x − x₀) + b(y − y₀) = 0, đưa về ax + by + c = 0.',
          'Đi qua M(x₀; y₀), có chỉ phương u = (u₁; u₂): x = x₀ + u₁t, y = y₀ + u₂t (t ∈ ℝ).',
          'Đường thẳng qua hai điểm A, B nhận AB làm vectơ chỉ phương.'
        ],
        d: {t: 'mc', q: 'Đường thẳng Δ: 2x − 3y + 1 = 0 có một vectơ pháp tuyến là', o: ['n = (2; −3)', 'n = (3; 2)', 'n = (2; 3)', 'n = (−3; 2)'], a: 0, g: 'Hệ số của x và y.'},
        ex: [
          {t: 'mc', q: 'Phương trình tổng quát của đường thẳng đi qua A(1; 2) và có vectơ pháp tuyến n = (3; −1) là', o: ['3x − y − 1 = 0', '3x − y + 1 = 0', 'x + 2y − 5 = 0', '3x + y − 5 = 0'], a: 0, g: '3(x − 1) − (y − 2) = 0.'},
          {t: 'mc', q: 'Đường thẳng đi qua hai điểm A(1; 1) và B(3; 5) có phương trình tham số là', o: ['x = 1 + t, y = 1 + 2t', 'x = 1 + 2t, y = 1 − t', 'x = 3 + t, y = 1 + 2t', 'x = 1 + 2t, y = 5 + t'], a: 0, g: 'AB = (2; 4) cùng phương với (1; 2).'},
          {t: 'tf', q: 'Cho đường thẳng d: x = 2 + t, y = −1 + 3t (t ∈ ℝ).', s: [['d có một vectơ chỉ phương là u = (1; 3)', true], ['Điểm M(3; 2) thuộc d', true], ['d có một vectơ pháp tuyến là n = (1; 3)', false], ['Phương trình tổng quát của d là 3x − y − 7 = 0', true]], g: 'Pháp tuyến là (3; −1).'},
          {t: 'sa', q: 'Đường thẳng d: 2x + y − 6 = 0 cắt trục Ox, Oy lần lượt tại A và B. Tính diện tích tam giác OAB.', a: '9', g: 'A(3; 0), B(0; 6).', r: ''},
          {t: 'sa', q: 'Cước taxi gồm 12 nghìn đồng phí mở cửa và 15 nghìn đồng cho mỗi km. Số tiền y (nghìn đồng) khi đi x km có đồ thị là một đường thẳng. Đi bao nhiêu km thì phải trả 192 nghìn đồng?', a: '12', g: 'y = 15x + 12.', r: ''}
        ]
      },
      {
        id: '10-VII-21', ten: 'Bài 21. Đường tròn trong mặt phẳng tọa độ',
        ycc: [
          'Lập phương trình đường tròn khi biết tâm và bán kính; xác định tâm, bán kính từ phương trình.',
          'Lập phương trình tiếp tuyến của đường tròn; vận dụng vào bài toán thực tế (chuyển động tròn, vòng quay).'
        ],
        kt: [
          'Đường tròn tâm I(a; b), bán kính R: (x − a)² + (y − b)² = R².',
          'Phương trình x² + y² − 2ax − 2by + c = 0 là đường tròn khi a² + b² − c > 0; khi đó tâm I(a; b), R = √(a² + b² − c).',
          'Vị trí điểm M: IM < R (trong), IM = R (trên), IM > R (ngoài) đường tròn.',
          'Tiếp tuyến tại M thuộc đường tròn nhận IM làm vectơ pháp tuyến; đường thẳng Δ tiếp xúc đường tròn ⇔ d(I, Δ) = R.'
        ],
        d: {t: 'mc', q: 'Đường tròn (C): (x − 2)² + (y + 1)² = 16 có tâm I và bán kính R là', o: ['I(2; −1), R = 4', 'I(−2; 1), R = 4', 'I(2; −1), R = 16', 'I(2; 1), R = 4'], a: 0, g: 'a = 2, b = −1, R² = 16.'},
        ex: [
          {t: 'mc', q: 'Phương trình nào sau đây là phương trình của một đường tròn?', o: ['x² + y² − 2x + 4y + 1 = 0', 'x² + 2y² − 2x + 1 = 0', 'x² + y² + 2xy − 1 = 0', 'x² + y² − 2x + 4y + 6 = 0'], a: 0, g: 'a² + b² − c = 1 + 4 − 1 = 4 > 0.'},
          {t: 'mc', q: 'Đường tròn tâm I(1; 3) và đi qua điểm A(4; 7) có phương trình là', o: ['(x − 1)² + (y − 3)² = 25', '(x + 1)² + (y + 3)² = 25', '(x − 1)² + (y − 3)² = 5', '(x − 4)² + (y − 7)² = 25'], a: 0, g: 'R = IA = 5.'},
          {t: 'tf', q: 'Cho đường tròn (C): x² + y² − 4x + 6y − 12 = 0.', s: [['Tâm của (C) là I(2; −3)', true], ['Bán kính của (C) bằng 5', true], ['Điểm A(5; 1) nằm ngoài (C)', false], ['Tiếp tuyến của (C) tại A(5; 1) có phương trình 3x + 4y − 19 = 0', true]], g: 'IA = 5 = R nên A thuộc (C).'},
          {t: 'sa', q: 'Tìm số thực dương m để đường thẳng Δ: 3x − 4y + m = 0 tiếp xúc với đường tròn (C): x² + y² = 4.', a: '10', g: 'd(O, Δ) = m/5 = 2.', r: ''},
          {t: 'sa', q: 'Trong hệ trục có trục Ox là mặt đất (đơn vị mét), vòng quay của một chiếc đu quay là đường tròn tâm I(0; 20), bán kính 18. Một cabin ở nửa trên vòng quay và có hoành độ x = 10,8. Cabin cách mặt đất bao nhiêu mét?', a: '34,4', g: '(y − 20)² = 324 − 116,64 = 207,36.', r: 'Làm tròn đến hàng phần mười'}
        ]
      },
      {
        id: '10-VII-22', ten: 'Bài 22. Ba đường conic',
        ycc: [
          'Nhận biết phương trình chính tắc của elip, hypebol, parabol; xác định tiêu điểm, tiêu cự, độ dài các trục.',
          'Vận dụng tính chất các đường conic vào bài toán thực tế (mái vòm, cổng, gương parabol).'
        ],
        kt: [
          'Elip: x²/a² + y²/b² = 1 (a > b > 0), c² = a² − b²; tiêu điểm F₁(−c; 0), F₂(c; 0); MF₁ + MF₂ = 2a; trục lớn 2a, trục nhỏ 2b, tiêu cự 2c.',
          'Hypebol: x²/a² − y²/b² = 1 (a, b > 0), c² = a² + b²; |MF₁ − MF₂| = 2a.',
          'Parabol: y² = 2px (p > 0); tiêu điểm F(p/2; 0), đường chuẩn x = −p/2; mọi điểm M thuộc parabol có MF = d(M, đường chuẩn) = x + p/2.'
        ],
        d: {t: 'mc', q: 'Elip (E): x²/25 + y²/9 = 1 có tiêu cự bằng', o: ['8', '4', '10', '16'], a: 0, g: 'c² = 25 − 9 = 16, 2c = 8.'},
        ex: [
          {t: 'mc', q: 'Phương trình nào sau đây là phương trình chính tắc của một parabol?', o: ['y² = 6x', 'y² = −6x', 'x² = 6y', 'y = 6x²'], a: 0, g: 'Dạng y² = 2px với p > 0.'},
          {t: 'mc', q: 'Hypebol (H): x²/16 − y²/9 = 1 có hai tiêu điểm là', o: ['F₁(−5; 0), F₂(5; 0)', 'F₁(−√7; 0), F₂(√7; 0)', 'F₁(0; −5), F₂(0; 5)', 'F₁(−4; 0), F₂(4; 0)'], a: 0, g: 'c² = 16 + 9 = 25.'},
          {t: 'tf', q: 'Cho parabol (P): y² = 8x.', s: [['Tiêu điểm của (P) là F(2; 0)', true], ['Đường chuẩn của (P) là x = −4', false], ['Điểm M(2; 4) thuộc (P)', true], ['Khoảng cách từ M(2; 4) đến tiêu điểm F bằng 4', true]], g: '2p = 8 nên p = 4; đường chuẩn x = −2.'},
          {t: 'sa', q: 'Elip (E) có độ dài trục lớn bằng 10 và tiêu cự bằng 6. Tính độ dài trục nhỏ của (E).', a: '8', g: 'a = 5, c = 3, b = 4.', r: ''},
          {t: 'sa', q: 'Mặt cắt của một mái vòm là nửa elip có chân vòm rộng 40 m và đỉnh vòm cao 15 m. Tại vị trí cách tâm chân vòm 12 m theo phương ngang, mái vòm cao bao nhiêu mét?', a: '12', g: 'x²/400 + y²/225 = 1 với x = 12.', r: ''}
        ]
      }
    ]
  };

  const chuyenDe = {
    id: '10-CD', so: 'CĐ 1', ten: 'Hệ phương trình bậc nhất ba ẩn (chuyên đề học tập)', hk: 1,
    lessons: [
      {
        id: '10-CD-1', ten: 'Bài 1. Hệ phương trình bậc nhất ba ẩn và ứng dụng',
        ycc: [
          'Nhận biết hệ phương trình bậc nhất ba ẩn; giải hệ bằng phương pháp Gauss và bằng máy tính cầm tay.',
          'Lập hệ phương trình bậc nhất ba ẩn từ bài toán thực tế (giá tiền, pha trộn, xác định parabol qua ba điểm).'
        ],
        kt: [
          'Dạng: a₁x + b₁y + c₁z = d₁; a₂x + b₂y + c₂z = d₂; a₃x + b₃y + c₃z = d₃, với các hệ số của ẩn không đồng thời bằng 0 trong mỗi phương trình.',
          'Phương pháp Gauss: dùng phép cộng (trừ) các phương trình để khử dần ẩn, đưa về dạng tam giác, rồi giải ngược từ phương trình cuối lên.',
          'Bài toán thực tế: gọi ba ẩn, mỗi dữ kiện cho một phương trình; nhớ đặt điều kiện cho ẩn và thử lại.',
          'Parabol y = ax² + bx + c đi qua ba điểm cho ba phương trình bậc nhất với ẩn a, b, c.'
        ],
        d: {t: 'mc', q: 'Nghiệm của hệ phương trình {x + y + z = 6; y + z = 5; z = 3} là', o: ['(1; 2; 3)', '(3; 2; 1)', '(1; 3; 2)', '(2; 1; 3)'], a: 0, g: 'Giải ngược: z = 3, y = 2, x = 1.'},
        ex: [
          {t: 'mc', q: 'Hệ nào sau đây là hệ phương trình bậc nhất ba ẩn?', o: ['{x + y − z = 1; 2x − y + z = 3; x + 3y = 2}', '{x² + y + z = 1; x − y = 0; z = 2}', '{xy + z = 1; x + y = 2; z = 0}', '{x + y + z = 1; √x − y = 0; z = 1}'], a: 0, g: 'Mọi ẩn đều có bậc một.'},
          {t: 'mc', q: 'Nghiệm của hệ phương trình {x + y + z = 2; 2x − y + z = 5; x + 2y − z = −3} là', o: ['(1; −1; 2)', '(2; −1; 1)', '(1; 1; 0)', '(−1; 1; 2)'], a: 0, g: 'Cộng để khử z: 2x + 3y = −1 và 3x + y = 2.'},
          {t: 'tf', q: 'Parabol (P): y = ax² + bx + c đi qua ba điểm A(0; 1), B(1; 2), C(2; 5).', s: [['c = 1', true], ['a + b = 1', true], ['(P) có phương trình y = x² + 2x + 1', false], ['(P) đi qua điểm D(3; 10)', true]], g: 'a = 1, b = 0, c = 1.'},
          {t: 'sa', q: 'An mua 2 bút, 3 quyển vở, 1 thước hết 42 nghìn đồng; Bình mua 1 bút, 2 quyển vở, 2 thước hết 29 nghìn đồng; Chi mua 3 bút, 1 quyển vở, 1 thước hết 27 nghìn đồng (cùng loại, cùng giá). Giá một quyển vở là bao nhiêu nghìn đồng?', a: '10', g: 'Bút 5, vở 10, thước 2 (nghìn đồng).', r: ''},
          {t: 'sa', q: 'Ba lớp 10A, 10B, 10C có tổng cộng 120 học sinh. Lớp 10A nhiều hơn lớp 10B 2 học sinh; tổng số học sinh của 10A và 10C bằng hai lần số học sinh 10B cộng thêm 6. Lớp 10C có bao nhiêu học sinh?', a: '42', g: 'a = b + 2, c = b + 4, 3b + 6 = 120.', r: ''}
        ]
      }
    ]
  };

  const i = D[10].findIndex(c => c.id === '10-VI');
  if (!D[10].some(c => c.id === '10-VII')) D[10].splice(i >= 0 ? i + 1 : D[10].length, 0, toaDo);
  if (!D[10].some(c => c.id === '10-CD')) D[10].push(chuyenDe);
})();
