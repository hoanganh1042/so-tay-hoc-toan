// Tổng hợp công thức. cb: trong chương trình (theo chương của bộ Kết nối tri thức). nc: nâng cao, ngoài sách giáo khoa.
// Toán viết bằng chữ Unicode thuần. Kiểm tra cấu trúc và phép thử số: node tools/kiemtra_congthuc.js
window.KHKT_CT = {
  cb: [
    { g: 10, ch: "10-II", ten: "Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
      muc: [
        { ten: "Bất phương trình bậc nhất hai ẩn", ct: ["Dạng ax + by + c < 0 (hoặc ≤, >, ≥), a và b không đồng thời bằng 0", "Miền nghiệm là một nửa mặt phẳng có bờ là đường thẳng ax + by + c = 0", "M(x₀; y₀) thuộc miền nghiệm ⇔ ax₀ + by₀ + c < 0 (thay tọa độ để kiểm tra)"], gc: "Thường thử điểm O(0; 0) nếu O không nằm trên bờ. Dấu ≤ hoặc ≥ thì miền nghiệm lấy cả đường bờ." },
        { ten: "Hệ bất phương trình bậc nhất hai ẩn", ct: ["Miền nghiệm của hệ là phần giao các miền nghiệm của từng bất phương trình", "Cách vẽ: vẽ từng đường bờ, gạch bỏ phần không thỏa mãn; phần không bị gạch là miền nghiệm"] },
        { ten: "Giá trị lớn nhất, nhỏ nhất của F = ax + by", ct: ["Miền nghiệm là đa giác (kể cả biên) thì F = ax + by đạt giá trị lớn nhất, nhỏ nhất tại các đỉnh của đa giác", "Các bước: vẽ miền nghiệm → tìm tọa độ các đỉnh → tính F tại từng đỉnh → so sánh"], gc: "Bài toán thực tế: gọi ẩn và viết đủ điều kiện (thường có x ≥ 0, y ≥ 0) trước khi vẽ." }
      ] },
    { g: 10, ch: "10-III", ten: "Hệ thức lượng trong tam giác",
      muc: [
        { ten: "Giá trị lượng giác của góc từ 0° đến 180°", ct: ["M(x₀; y₀) trên nửa đường tròn đơn vị ứng với góc α: sin α = y₀, cos α = x₀", "tan α = sin α/cos α (α ≠ 90°); cot α = cos α/sin α (0° < α < 180°)", "sin²α + cos²α = 1", "1 + tan²α = 1/cos²α (α ≠ 90°); 1 + cot²α = 1/sin²α (0° < α < 180°)", "90° < α < 180° thì sin α > 0, cos α < 0, tan α < 0"] },
        { ten: "Góc bù nhau, góc phụ nhau", ct: ["sin(180° − α) = sin α; cos(180° − α) = −cos α", "tan(180° − α) = −tan α; cot(180° − α) = −cot α", "sin(90° − α) = cos α; cos(90° − α) = sin α; tan(90° − α) = cot α"] },
        { ten: "Giá trị lượng giác đặc biệt", ct: ["sin: 0° → 0; 30° → 1/2; 45° → √2/2; 60° → √3/2; 90° → 1", "cos: 0° → 1; 30° → √3/2; 45° → √2/2; 60° → 1/2; 90° → 0", "tan: 0° → 0; 30° → √3/3; 45° → 1; 60° → √3", "120°: sin = √3/2, cos = −1/2; 135°: sin = √2/2, cos = −√2/2; 150°: sin = 1/2, cos = −√3/2; 180°: sin = 0, cos = −1"] },
        { ten: "Định lí côsin", ct: ["a² = b² + c² − 2bc·cos A", "b² = c² + a² − 2ca·cos B; c² = a² + b² − 2ab·cos C", "cos A = (b² + c² − a²)/(2bc)"], gc: "Dùng khi biết hai cạnh và góc xen giữa, hoặc biết ba cạnh. Góc A tù ⇔ b² + c² < a²." },
        { ten: "Định lí sin", ct: ["a/sin A = b/sin B = c/sin C = 2R", "a = 2R·sin A; sin A = a/(2R)"], gc: "R là bán kính đường tròn ngoại tiếp tam giác. Dùng khi biết một cạnh và hai góc." },
        { ten: "Diện tích tam giác", ct: ["S = ½·a·hₐ (hₐ là đường cao ứng với cạnh a)", "S = ½·bc·sin A = ½·ca·sin B = ½·ab·sin C", "S = abc/(4R)", "S = p·r với p = (a + b + c)/2 là nửa chu vi, r là bán kính đường tròn nội tiếp", "Công thức Heron: S = √(p(p − a)(p − b)(p − c))"] }
      ] },
    { g: 10, ch: "10-IV", ten: "Vectơ",
      muc: [
        { ten: "Tổng và hiệu hai vectơ", ct: ["Quy tắc ba điểm: AB + BC = AC", "Quy tắc hình bình hành ABCD: AB + AD = AC", "Quy tắc hiệu: OB − OA = AB", "Vectơ đối: −AB = BA; a − b = a + (−b)"], gc: "Trong chương này AB, a, b, … là các vectơ; 0 là vectơ-không." },
        { ten: "Trung điểm, trọng tâm", ct: ["I là trung điểm AB ⇔ IA + IB = 0 ⇔ MA + MB = 2·MI (với mọi M)", "G là trọng tâm tam giác ABC ⇔ GA + GB + GC = 0 ⇔ MA + MB + MC = 3·MG (với mọi M)"] },
        { ten: "Tích của vectơ với một số", ct: ["k·a cùng hướng a nếu k > 0, ngược hướng a nếu k < 0; |k·a| = |k|·|a|", "b cùng phương a (a ≠ 0) ⇔ có số k để b = k·a", "A, B, C thẳng hàng ⇔ có số k ≠ 0 để AB = k·AC"] },
        { ten: "Tọa độ của vectơ", ct: ["A(x₁; y₁), B(x₂; y₂) ⇒ AB = (x₂ − x₁; y₂ − y₁), AB = √((x₂ − x₁)² + (y₂ − y₁)²)", "a ± b = (a₁ ± b₁; a₂ ± b₂); k·a = (ka₁; ka₂)", "Trung điểm I((x₁ + x₂)/2; (y₁ + y₂)/2)", "Trọng tâm G((x₁ + x₂ + x₃)/3; (y₁ + y₂ + y₃)/3)", "a = (a₁; a₂), b = (b₁; b₂) cùng phương ⇔ a₁b₂ − a₂b₁ = 0"] },
        { ten: "Tích vô hướng", ct: ["a·b = |a|·|b|·cos(a, b)", "a·b = a₁b₁ + a₂b₂; |a| = √(a₁² + a₂²)", "cos(a, b) = (a₁b₁ + a₂b₂)/(√(a₁² + a₂²)·√(b₁² + b₂²))", "a ⊥ b ⇔ a·b = 0 ⇔ a₁b₁ + a₂b₂ = 0", "a² = |a|²; (a + b)² = a² + 2a·b + b²", "Công của lực F làm vật dời theo vectơ d: A = F·d"] }
      ] },
    { g: 10, ch: "10-VI", ten: "Hàm số, đồ thị và ứng dụng",
      muc: [
        { ten: "Hàm số", ct: ["Tập xác định: mẫu số khác 0, biểu thức dưới căn bậc hai không âm", "Đồng biến trên K: x₁ < x₂ ⇒ f(x₁) < f(x₂); nghịch biến trên K: x₁ < x₂ ⇒ f(x₁) > f(x₂)", "Đồ thị là tập các điểm (x; f(x)) với x thuộc tập xác định"] },
        { ten: "Hàm số bậc hai", ct: ["y = ax² + bx + c (a ≠ 0), Δ = b² − 4ac", "Đỉnh I(−b/(2a); −Δ/(4a)), trục đối xứng x = −b/(2a)", "a > 0: nghịch biến trên (−∞; −b/(2a)), đồng biến trên (−b/(2a); +∞), giá trị nhỏ nhất −Δ/(4a)", "a < 0: đồng biến trên (−∞; −b/(2a)), nghịch biến trên (−b/(2a); +∞), giá trị lớn nhất −Δ/(4a)"] },
        { ten: "Phương trình bậc hai và định lí Viète", ct: ["ax² + bx + c = 0 (a ≠ 0): Δ > 0 có hai nghiệm x₁,₂ = (−b ± √Δ)/(2a); Δ = 0 có nghiệm kép x = −b/(2a); Δ < 0 vô nghiệm", "b = 2b′: Δ′ = b′² − ac, x₁,₂ = (−b′ ± √Δ′)/a", "x₁ + x₂ = −b/a; x₁·x₂ = c/a", "a + b + c = 0 ⇒ x₁ = 1, x₂ = c/a; a − b + c = 0 ⇒ x₁ = −1, x₂ = −c/a", "Hai nghiệm trái dấu ⇔ a·c < 0"] },
        { ten: "Dấu của tam thức bậc hai", ct: ["f(x) = ax² + bx + c (a ≠ 0), Δ = b² − 4ac", "Δ < 0: f(x) cùng dấu a với mọi x", "Δ = 0: f(x) cùng dấu a với mọi x ≠ −b/(2a)", "Δ > 0, hai nghiệm x₁ < x₂: f(x) trái dấu a khi x₁ < x < x₂, cùng dấu a khi x < x₁ hoặc x > x₂", "f(x) > 0 với mọi x ⇔ a > 0 và Δ < 0; f(x) < 0 với mọi x ⇔ a < 0 và Δ < 0"], gc: "Mẹo nhớ: trong trái, ngoài cùng (dấu so với a)." },
        { ten: "Phương trình quy về phương trình bậc hai", ct: ["√f(x) = √g(x) ⇔ f(x) = g(x) và g(x) ≥ 0 (hoặc f(x) ≥ 0)", "√f(x) = g(x) ⇔ g(x) ≥ 0 và f(x) = g²(x)"], gc: "Có thể bình phương rồi giải, sau đó thay nghiệm vào phương trình ban đầu để loại nghiệm ngoại lai." }
      ] },
    { g: 10, ch: "10-VII", ten: "Phương pháp tọa độ trong mặt phẳng",
      muc: [
        { ten: "Phương trình đường thẳng", ct: ["Qua M(x₀; y₀), pháp tuyến n = (a; b): a(x − x₀) + b(y − y₀) = 0; dạng tổng quát ax + by + c = 0", "Qua M(x₀; y₀), chỉ phương u = (u₁; u₂): x = x₀ + u₁t, y = y₀ + u₂t (t ∈ ℝ)", "Pháp tuyến n = (a; b) thì một chỉ phương là u = (−b; a), và ngược lại", "Qua A(a; 0), B(0; b) với ab ≠ 0 (đoạn chắn): x/a + y/b = 1", "Qua M(x₀; y₀), hệ số góc k: y = k(x − x₀) + y₀"] },
        { ten: "Vị trí tương đối của hai đường thẳng", ct: ["Δ₁: a₁x + b₁y + c₁ = 0 và Δ₂: a₂x + b₂y + c₂ = 0: số điểm chung bằng số nghiệm của hệ hai phương trình", "Δ₁ cắt Δ₂ ⇔ a₁b₂ − a₂b₁ ≠ 0", "Δ₁ ⊥ Δ₂ ⇔ a₁a₂ + b₁b₂ = 0", "y = k₁x + m₁ vuông góc y = k₂x + m₂ ⇔ k₁·k₂ = −1; song song ⇔ k₁ = k₂ và m₁ ≠ m₂"] },
        { ten: "Góc giữa hai đường thẳng", ct: ["cos(Δ₁, Δ₂) = |a₁a₂ + b₁b₂|/(√(a₁² + b₁²)·√(a₂² + b₂²))", "Theo chỉ phương: cos(Δ₁, Δ₂) = |u₁·u₂|/(|u₁|·|u₂|)"], gc: "Góc giữa hai đường thẳng luôn thuộc [0°; 90°] nên có dấu giá trị tuyệt đối." },
        { ten: "Khoảng cách từ điểm đến đường thẳng", ct: ["d(M, Δ) = |ax₀ + by₀ + c|/√(a² + b²) với M(x₀; y₀), Δ: ax + by + c = 0"] },
        { ten: "Đường tròn", ct: ["Tâm I(a; b), bán kính R: (x − a)² + (y − b)² = R²", "x² + y² − 2ax − 2by + c = 0 là đường tròn ⇔ a² + b² − c > 0; tâm I(a; b), R = √(a² + b² − c)", "Tiếp tuyến tại M₀(x₀; y₀) thuộc đường tròn: (x₀ − a)(x − x₀) + (y₀ − b)(y − y₀) = 0", "Δ tiếp xúc đường tròn ⇔ d(I, Δ) = R; Δ cắt đường tròn tại hai điểm ⇔ d(I, Δ) < R"] },
        { ten: "Elip", ct: ["x²/a² + y²/b² = 1 (a > b > 0), c² = a² − b²", "Tiêu điểm F₁(−c; 0), F₂(c; 0); M thuộc elip ⇔ MF₁ + MF₂ = 2a", "Đỉnh (±a; 0), (0; ±b); trục lớn 2a, trục nhỏ 2b, tiêu cự 2c"] },
        { ten: "Hypebol", ct: ["x²/a² − y²/b² = 1 (a, b > 0), c² = a² + b²", "Tiêu điểm F₁(−c; 0), F₂(c; 0); M thuộc hypebol ⇔ |MF₁ − MF₂| = 2a", "Đỉnh (±a; 0); trục thực 2a, trục ảo 2b, tiêu cự 2c"] },
        { ten: "Parabol", ct: ["y² = 2px (p > 0): tiêu điểm F(p/2; 0), đường chuẩn Δ: x = −p/2", "M(x; y) thuộc parabol ⇔ MF = d(M, Δ); khi đó MF = x + p/2"] }
      ] },
    { g: 10, ch: "10-VIII", ten: "Đại số tổ hợp",
      muc: [
        { ten: "Quy tắc cộng, quy tắc nhân", ct: ["Quy tắc cộng: làm theo phương án A (m cách) hoặc phương án B (n cách), không trùng nhau ⇒ m + n cách", "Quy tắc nhân: hai công đoạn liên tiếp, m cách rồi n cách ⇒ m·n cách"], gc: "Dùng sơ đồ hình cây để liệt kê; bài đếm phức tạp thường đếm phần bù (tổng trừ phần không thỏa mãn)." },
        { ten: "Hoán vị, chỉnh hợp, tổ hợp", ct: ["Pₙ = n! = 1·2·…·n; quy ước 0! = 1", "Aₙᵏ = n!/(n − k)! = n(n − 1)…(n − k + 1) (1 ≤ k ≤ n)", "Cₙᵏ = n!/(k!(n − k)!) (0 ≤ k ≤ n)", "Aₙᵏ = k!·Cₙᵏ"], gc: "Có thứ tự (xếp chỗ, phân vai) dùng chỉnh hợp; chỉ chọn nhóm dùng tổ hợp." },
        { ten: "Tính chất của số tổ hợp", ct: ["Cₙᵏ = Cₙⁿ⁻ᵏ", "Cₙᵏ⁻¹ + Cₙᵏ = Cₙ₊₁ᵏ (1 ≤ k ≤ n, hệ thức Pascal)", "Cₙ⁰ = Cₙⁿ = 1; Cₙ¹ = n"] },
        { ten: "Nhị thức Newton (n = 4, n = 5)", ct: ["(a + b)⁴ = a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴", "(a + b)⁵ = a⁵ + 5a⁴b + 10a³b² + 10a²b³ + 5ab⁴ + b⁵", "Hệ số các số hạng là C₄ᵏ (hoặc C₅ᵏ); số hạng chứa bᵏ là Cₙᵏ·aⁿ⁻ᵏ·bᵏ", "Tổng các hệ số: thay a = b = 1 (hoặc x = 1)"], gc: "Với (a − b)ⁿ các dấu đan xen +, −." }
      ] },
    { g: 10, ch: "10-IX", ten: "Tính xác suất theo định nghĩa cổ điển",
      muc: [
        { ten: "Không gian mẫu và biến cố", ct: ["Không gian mẫu Ω: tập mọi kết quả có thể của phép thử; n(Ω) là số phần tử", "Biến cố A là một tập con của Ω; biến cố đối Ā gồm các kết quả của Ω không thuộc A"] },
        { ten: "Định nghĩa cổ điển của xác suất", ct: ["P(A) = n(A)/n(Ω) (các kết quả đồng khả năng)", "0 ≤ P(A) ≤ 1; P(Ω) = 1; P(∅) = 0"] },
        { ten: "Biến cố đối", ct: ["P(Ā) = 1 − P(A)", "P(ít nhất một …) = 1 − P(không có … nào)"], gc: "Khi đếm trực tiếp A có nhiều trường hợp, hãy đếm biến cố đối." },
        { ten: "Đếm hay gặp", ct: ["Chọn ngẫu nhiên k phần tử từ n phần tử: n(Ω) = Cₙᵏ", "Chọn k từ nhóm m và phần còn lại từ nhóm n: tích các số tổ hợp tương ứng", "Xếp n người thành hàng: n(Ω) = n!; nhóm phải đứng cạnh nhau thì coi cả nhóm là một khối"] }
      ] },
    { g: 10, ch: "10-CD", ten: "Hệ phương trình bậc nhất ba ẩn (chuyên đề học tập)",
      muc: [
        { ten: "Dạng hệ", ct: ["a₁x + b₁y + c₁z = d₁; a₂x + b₂y + c₂z = d₂; a₃x + b₃y + c₃z = d₃", "Nghiệm là bộ ba (x; y; z) thỏa mãn cả ba phương trình"] },
        { ten: "Phương pháp Gauss", ct: ["Dùng phép nhân một phương trình với số khác 0 và cộng (trừ) các phương trình để khử dần ẩn", "Đưa về dạng tam giác: phương trình cuối chỉ còn z, phương trình giữa còn y, z", "Giải z từ phương trình cuối rồi thế ngược lên tìm y, x"] },
        { ten: "Nhận biết số nghiệm", ct: ["Khử được về dạng tam giác với hệ số khác 0 ⇒ hệ có nghiệm duy nhất", "Xuất hiện phương trình 0 = d với d ≠ 0 ⇒ hệ vô nghiệm", "Xuất hiện 0 = 0 và hệ còn lại có nghiệm ⇒ hệ có vô số nghiệm"] },
        { ten: "Ứng dụng", ct: ["Parabol y = ax² + bx + c đi qua ba điểm (xᵢ; yᵢ) cho hệ ba phương trình bậc nhất ẩn a, b, c", "Bài toán thực tế: gọi ba ẩn, mỗi dữ kiện cho một phương trình; nhớ điều kiện của ẩn"] }
      ] },
    { g: 11, ch: "11-I", ten: "Hàm số lượng giác và phương trình lượng giác",
      muc: [
        { ten: "Radian và hệ thức cơ bản", ct: ["π rad = 180°; 1° = π/180 rad", "Độ dài cung tròn bán kính R có số đo α rad: l = R·α", "Các góc lượng giác cùng tia đầu, tia cuối có số đo α + k2π (k ∈ ℤ)", "sin²α + cos²α = 1; tan α·cot α = 1", "1 + tan²α = 1/cos²α; 1 + cot²α = 1/sin²α", "sin(α + k2π) = sin α; cos(α + k2π) = cos α; tan(α + kπ) = tan α; cot(α + kπ) = cot α"] },
        { ten: "Giá trị lượng giác của các góc có liên quan đặc biệt", ct: ["Góc đối: cos(−α) = cos α; sin(−α) = −sin α; tan(−α) = −tan α", "Góc bù: sin(π − α) = sin α; cos(π − α) = −cos α; tan(π − α) = −tan α", "Góc phụ: sin(π/2 − α) = cos α; cos(π/2 − α) = sin α; tan(π/2 − α) = cot α", "Hơn kém π: sin(π + α) = −sin α; cos(π + α) = −cos α; tan(π + α) = tan α"], gc: "Mẹo nhớ: cos đối, sin bù, phụ chéo, hơn kém π thì tan, cot." },
        { ten: "Công thức cộng", ct: ["cos(a − b) = cos a cos b + sin a sin b; cos(a + b) = cos a cos b − sin a sin b", "sin(a − b) = sin a cos b − cos a sin b; sin(a + b) = sin a cos b + cos a sin b", "tan(a + b) = (tan a + tan b)/(1 − tan a tan b); tan(a − b) = (tan a − tan b)/(1 + tan a tan b)"] },
        { ten: "Công thức nhân đôi và hạ bậc", ct: ["sin 2a = 2 sin a cos a", "cos 2a = cos²a − sin²a = 2cos²a − 1 = 1 − 2sin²a", "tan 2a = 2tan a/(1 − tan²a)", "cos²a = (1 + cos 2a)/2; sin²a = (1 − cos 2a)/2"] },
        { ten: "Biến đổi tích thành tổng", ct: ["cos a cos b = ½[cos(a − b) + cos(a + b)]", "sin a sin b = ½[cos(a − b) − cos(a + b)]", "sin a cos b = ½[sin(a − b) + sin(a + b)]"] },
        { ten: "Biến đổi tổng thành tích", ct: ["cos a + cos b = 2cos((a + b)/2)·cos((a − b)/2)", "cos a − cos b = −2sin((a + b)/2)·sin((a − b)/2)", "sin a + sin b = 2sin((a + b)/2)·cos((a − b)/2)", "sin a − sin b = 2cos((a + b)/2)·sin((a − b)/2)"] },
        { ten: "Hàm số lượng giác", ct: ["y = sin x, y = cos x: tập xác định ℝ, tập giá trị [−1; 1], chu kì 2π", "y = tan x: x ≠ π/2 + kπ; y = cot x: x ≠ kπ; tập giá trị ℝ, chu kì π", "y = cos x là hàm chẵn; y = sin x, y = tan x, y = cot x là hàm lẻ", "y = sin(ax + b), y = cos(ax + b) có chu kì 2π/|a|; y = tan(ax + b) có chu kì π/|a|"] },
        { ten: "Phương trình lượng giác cơ bản", ct: ["sin x = m (|m| ≤ 1), sin α = m: x = α + k2π hoặc x = π − α + k2π", "cos x = m (|m| ≤ 1), cos α = m: x = α + k2π hoặc x = −α + k2π", "tan x = tan α ⇔ x = α + kπ; cot x = cot α ⇔ x = α + kπ", "sin x = 0 ⇔ x = kπ; sin x = 1 ⇔ x = π/2 + k2π; sin x = −1 ⇔ x = −π/2 + k2π", "cos x = 0 ⇔ x = π/2 + kπ; cos x = 1 ⇔ x = k2π; cos x = −1 ⇔ x = π + k2π"], gc: "|m| > 1 thì sin x = m và cos x = m vô nghiệm. Đơn vị độ: thay π bằng 180°, k2π bằng k360°." }
      ] },
    { g: 11, ch: "11-II", ten: "Dãy số. Cấp số cộng và cấp số nhân",
      muc: [
        { ten: "Dãy số", ct: ["Dãy tăng: uₙ₊₁ > uₙ với mọi n; dãy giảm: uₙ₊₁ < uₙ với mọi n", "Xét hiệu uₙ₊₁ − uₙ, hoặc tỉ số uₙ₊₁/uₙ so với 1 khi uₙ > 0", "Bị chặn trên: uₙ ≤ M; bị chặn dưới: uₙ ≥ m; bị chặn: cả hai"] },
        { ten: "Cấp số cộng", ct: ["uₙ₊₁ = uₙ + d (d là công sai)", "uₙ = u₁ + (n − 1)d", "uₖ = (uₖ₋₁ + uₖ₊₁)/2 (k ≥ 2); a, b, c lập cấp số cộng ⇔ a + c = 2b", "Sₙ = n(u₁ + uₙ)/2 = n[2u₁ + (n − 1)d]/2"] },
        { ten: "Cấp số nhân", ct: ["uₙ₊₁ = uₙ·q (q là công bội)", "uₙ = u₁·qⁿ⁻¹", "uₖ² = uₖ₋₁·uₖ₊₁ (k ≥ 2)", "Sₙ = u₁(1 − qⁿ)/(1 − q) với q ≠ 1; q = 1 thì Sₙ = n·u₁"] },
        { ten: "Tăng trưởng theo cấp số nhân", ct: ["Tăng r% mỗi kì: sau n kì giá trị là A(1 + r)ⁿ", "Giảm r% mỗi kì: sau n kì giá trị là A(1 − r)ⁿ"], gc: "r viết dạng thập phân, ví dụ 6% thì r = 0,06. Đây cũng là công thức lãi kép." }
      ] },
    { g: 11, ch: "11-III", ten: "Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm",
      muc: [
        { ten: "Mẫu số liệu ghép nhóm", ct: ["Nhóm [aᵢ; aᵢ₊₁) có giá trị đại diện xᵢ = (aᵢ + aᵢ₊₁)/2", "Tần số tương đối = tần số/cỡ mẫu", "Tần số tích lũy của một nhóm = tổng tần số của nhóm đó và các nhóm đứng trước"] },
        { ten: "Số trung bình", ct: ["x̄ = (n₁x₁ + n₂x₂ + … + nₖxₖ)/n với n = n₁ + n₂ + … + nₖ"] },
        { ten: "Trung vị", ct: ["Mₑ = uₘ + ((n/2 − C)/nₘ)·(uₘ₊₁ − uₘ)"], gc: "[uₘ; uₘ₊₁) là nhóm đầu tiên có tần số tích lũy ≥ n/2, nₘ là tần số nhóm đó, C là tổng tần số các nhóm đứng trước." },
        { ten: "Tứ phân vị", ct: ["Q₁ = uₘ + ((n/4 − C)/nₘ)·(uₘ₊₁ − uₘ), nhóm chứa Q₁ là nhóm đầu tiên có tần số tích lũy ≥ n/4", "Q₂ = Mₑ", "Q₃ = uⱼ + ((3n/4 − C)/nⱼ)·(uⱼ₊₁ − uⱼ), nhóm chứa Q₃ là nhóm đầu tiên có tần số tích lũy ≥ 3n/4"], gc: "C luôn là tổng tần số các nhóm đứng trước nhóm đang xét." },
        { ten: "Mốt", ct: ["M₀ = uₘ + ((nₘ − nₘ₋₁)/((nₘ − nₘ₋₁) + (nₘ − nₘ₊₁)))·(uₘ₊₁ − uₘ)"], gc: "[uₘ; uₘ₊₁) là nhóm có tần số lớn nhất; nhóm đầu thì nₘ₋₁ = 0, nhóm cuối thì nₘ₊₁ = 0." }
      ] },
    { g: 11, ch: "11-IV", ten: "Quan hệ song song trong không gian",
      muc: [
        { ten: "Xác định mặt phẳng, giao tuyến, giao điểm", ct: ["Mặt phẳng được xác định bởi: ba điểm không thẳng hàng; một đường thẳng và một điểm ngoài nó; hai đường thẳng cắt nhau; hai đường thẳng song song", "Giao tuyến của hai mặt phẳng: tìm hai điểm chung", "Giao điểm của d và (P): chọn mặt phẳng (Q) chứa d, tìm giao tuyến a của (P) và (Q); giao điểm của a và d là điểm cần tìm"] },
        { ten: "Hai đường thẳng song song", ct: ["Hai đường thẳng phân biệt cùng song song với đường thẳng thứ ba thì song song với nhau", "Ba mặt phẳng đôi một cắt nhau theo ba giao tuyến phân biệt thì ba giao tuyến đồng quy hoặc đôi một song song", "Hai mặt phẳng cắt nhau lần lượt chứa hai đường thẳng song song thì giao tuyến song song (hoặc trùng) với một trong hai đường thẳng đó"] },
        { ten: "Đường thẳng song song với mặt phẳng", ct: ["d không nằm trong (P) và d song song với một đường thẳng a nằm trong (P) ⇒ d // (P)", "d // (P), mặt phẳng (Q) chứa d cắt (P) theo giao tuyến a ⇒ a // d", "Hai mặt phẳng cắt nhau cùng song song với d thì giao tuyến song song với d"] },
        { ten: "Hai mặt phẳng song song", ct: ["(P) chứa hai đường thẳng cắt nhau cùng song song với (Q) ⇒ (P) // (Q)", "(P) // (Q) thì mọi đường thẳng nằm trong (P) đều song song với (Q)", "Mặt phẳng (R) cắt hai mặt phẳng song song theo hai giao tuyến song song", "Định lí Thalès: ba mặt phẳng song song chắn trên hai cát tuyến bất kì các đoạn thẳng tương ứng tỉ lệ"] },
        { ten: "Hình lăng trụ, hình hộp", ct: ["Lăng trụ: các cạnh bên song song và bằng nhau; các mặt bên là hình bình hành; hai đáy là hai đa giác bằng nhau nằm trên hai mặt phẳng song song", "Hình hộp: lăng trụ có đáy là hình bình hành; sáu mặt là hình bình hành; bốn đường chéo cắt nhau tại trung điểm mỗi đường"] },
        { ten: "Phép chiếu song song", ct: ["Biến ba điểm thẳng hàng thành ba điểm thẳng hàng và giữ thứ tự", "Biến hai đường thẳng song song thành hai đường thẳng song song hoặc trùng nhau", "Giữ tỉ số độ dài hai đoạn thẳng cùng nằm trên một đường thẳng hoặc trên hai đường thẳng song song", "Không giữ độ dài và độ lớn góc; biến trung điểm thành trung điểm, trọng tâm thành trọng tâm"] }
      ] },
    { g: 11, ch: "11-V", ten: "Giới hạn. Hàm số liên tục",
      muc: [
        { ten: "Giới hạn dãy số cơ bản", ct: ["lim 1/n = 0; lim 1/nᵏ = 0 (k nguyên dương); lim c = c", "lim qⁿ = 0 khi |q| < 1; lim qⁿ = +∞ khi q > 1", "lim nᵏ = +∞ (k nguyên dương)"] },
        { ten: "Quy tắc tính giới hạn", ct: ["lim uₙ = a, lim vₙ = b ⇒ lim(uₙ ± vₙ) = a ± b; lim uₙvₙ = ab; lim uₙ/vₙ = a/b (b ≠ 0)", "lim uₙ = a, lim vₙ = ±∞ ⇒ lim uₙ/vₙ = 0", "lim uₙ = a > 0, lim vₙ = 0 và vₙ > 0 ⇒ lim uₙ/vₙ = +∞", "lim uₙ = +∞, lim vₙ = a > 0 ⇒ lim uₙvₙ = +∞"], gc: "Các quy tắc tương tự cho giới hạn hàm số. Đổi dấu a hoặc dấu vₙ thì đổi +∞ thành −∞." },
        { ten: "Cấp số nhân lùi vô hạn", ct: ["S = u₁ + u₁q + u₁q² + … = u₁/(1 − q) với |q| < 1"], gc: "Hay dùng đổi số thập phân vô hạn tuần hoàn ra phân số, ví dụ 0,(3) = 3/10 + 3/100 + … = 1/3." },
        { ten: "Giới hạn hàm số cơ bản", ct: ["Đa thức, phân thức xác định tại x₀: lim f(x) khi x → x₀ bằng f(x₀)", "lim c/xᵏ = 0 khi x → ±∞ (k nguyên dương)", "Khi x → +∞: xᵏ → +∞; khi x → −∞: xᵏ → +∞ nếu k chẵn, → −∞ nếu k lẻ", "Khi x → 0⁺: 1/x → +∞; khi x → 0⁻: 1/x → −∞", "lim f(x) = L khi x → x₀ ⇔ giới hạn trái = giới hạn phải = L"] },
        { ten: "Khử dạng vô định", ct: ["Dạng 0/0 với đa thức: phân tích tử, mẫu thành nhân tử chứa (x − x₀) rồi rút gọn", "Dạng 0/0 có căn: nhân liên hợp, √A − B = (A − B²)/(√A + B)", "Dạng ∞/∞: chia tử và mẫu cho lũy thừa bậc cao nhất", "Phân thức khi x → ±∞: bậc tử < bậc mẫu ⇒ 0; bậc tử = bậc mẫu ⇒ tỉ số hai hệ số bậc cao nhất; bậc tử > bậc mẫu ⇒ ±∞"] },
        { ten: "Hàm số liên tục", ct: ["f liên tục tại x₀ ⇔ lim f(x) khi x → x₀ bằng f(x₀)", "Đa thức, phân thức, căn thức, hàm lượng giác liên tục trên từng khoảng của tập xác định", "f liên tục trên [a; b] và f(a)·f(b) < 0 ⇒ phương trình f(x) = 0 có ít nhất một nghiệm thuộc (a; b)"] }
      ] },
    { g: 11, ch: "11-VI", ten: "Hàm số mũ và hàm số lôgarit",
      muc: [
        { ten: "Lũy thừa", ct: ["a⁰ = 1; a⁻ⁿ = 1/aⁿ (a ≠ 0)", "a^(m/n) = ⁿ√(aᵐ) (a > 0, m nguyên, n nguyên dương)", "aᵐ·aⁿ = aᵐ⁺ⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ", "(ab)ⁿ = aⁿbⁿ; (a/b)ⁿ = aⁿ/bⁿ"], gc: "Với số mũ không nguyên, cơ số phải dương." },
        { ten: "So sánh lũy thừa", ct: ["a > 1: aᵐ > aⁿ ⇔ m > n", "0 < a < 1: aᵐ > aⁿ ⇔ m < n", "0 < a < b, m > 0: aᵐ < bᵐ"] },
        { ten: "Định nghĩa lôgarit", ct: ["logₐ b = α ⇔ a^α = b (a > 0, a ≠ 1, b > 0)", "logₐ 1 = 0; logₐ a = 1; logₐ(aᵅ) = α; a^(logₐ b) = b", "log b là lôgarit cơ số 10; ln b là lôgarit cơ số e (e ≈ 2,718)"] },
        { ten: "Quy tắc tính lôgarit", ct: ["logₐ(bc) = logₐ b + logₐ c (b, c > 0)", "logₐ(b/c) = logₐ b − logₐ c; logₐ(1/b) = −logₐ b", "logₐ(bᵅ) = α·logₐ b (b > 0)", "Đổi cơ số: logₐ b = logₘ b/logₘ a (m > 0, m ≠ 1); logₐ b = ln b/ln a", "logₐ m = 1/logₘ a (m > 0, m ≠ 1); logₐ m·logₘ b = logₐ b"] },
        { ten: "Hàm số mũ, hàm số lôgarit", ct: ["y = aˣ (a > 0, a ≠ 1): tập xác định ℝ, tập giá trị (0; +∞), đồ thị qua (0; 1)", "y = logₐ x: tập xác định (0; +∞), tập giá trị ℝ, đồ thị qua (1; 0)", "a > 1: cả hai hàm đồng biến; 0 < a < 1: cả hai hàm nghịch biến", "y = logₐ u(x) xác định ⇔ u(x) > 0"] },
        { ten: "Phương trình mũ, lôgarit", ct: ["aˣ = b: b > 0 ⇔ x = logₐ b; b ≤ 0 thì vô nghiệm", "logₐ x = b ⇔ x = aᵇ", "a^f(x) = a^g(x) ⇔ f(x) = g(x)", "logₐ f(x) = logₐ g(x) ⇔ f(x) = g(x) > 0"], gc: "Hay đặt ẩn phụ t = aˣ (t > 0) hoặc t = logₐ x để đưa về phương trình bậc hai." },
        { ten: "Bất phương trình mũ, lôgarit", ct: ["a > 1: a^f(x) > a^g(x) ⇔ f(x) > g(x); logₐ f(x) > logₐ g(x) ⇔ f(x) > g(x) > 0", "0 < a < 1: a^f(x) > a^g(x) ⇔ f(x) < g(x); logₐ f(x) > logₐ g(x) ⇔ 0 < f(x) < g(x)"], gc: "Cơ số lớn hơn 1 giữ chiều, cơ số trong (0; 1) đổi chiều. Luôn đặt điều kiện biểu thức dưới lôgarit dương." }
      ] },
    { g: 11, ch: "11-VII", ten: "Quan hệ vuông góc trong không gian",
      muc: [
        { ten: "Hai đường thẳng vuông góc", ct: ["Góc giữa a và b là góc giữa a′ và b′ cùng qua một điểm, lần lượt song song (hoặc trùng) với a và b; góc thuộc [0°; 90°]", "a ⊥ b ⇔ góc giữa a và b bằng 90°", "a // b và c ⊥ a ⇒ c ⊥ b"] },
        { ten: "Đường thẳng vuông góc với mặt phẳng", ct: ["d vuông góc với hai đường thẳng cắt nhau nằm trong (P) ⇒ d ⊥ (P)", "d ⊥ (P) ⇒ d vuông góc với mọi đường thẳng nằm trong (P)", "Hai đường thẳng phân biệt cùng vuông góc với một mặt phẳng thì song song", "Hai mặt phẳng phân biệt cùng vuông góc với một đường thẳng thì song song", "Định lí ba đường vuông góc: a nằm trong (P), b′ là hình chiếu của b trên (P): a ⊥ b ⇔ a ⊥ b′"] },
        { ten: "Góc giữa đường thẳng và mặt phẳng", ct: ["Góc giữa d và (P) là góc giữa d và hình chiếu d′ của d trên (P); d ⊥ (P) thì góc bằng 90°", "SA ⊥ (P), B thuộc (P): góc giữa SB và (P) là góc SBA, tan SBA = SA/AB"] },
        { ten: "Hai mặt phẳng vuông góc, góc nhị diện", ct: ["(P) chứa một đường thẳng vuông góc với (Q) ⇒ (P) ⊥ (Q)", "(P) ⊥ (Q), a nằm trong (P), a vuông góc với giao tuyến ⇒ a ⊥ (Q)", "Hai mặt phẳng cắt nhau cùng vuông góc với (R) thì giao tuyến của chúng vuông góc với (R)", "Góc phẳng nhị diện: từ một điểm trên cạnh, kẻ trong mỗi mặt một tia vuông góc với cạnh; góc giữa hai tia là góc phẳng nhị diện"] },
        { ten: "Khoảng cách", ct: ["d(M, (P)) = MH với H là hình chiếu vuông góc của M trên (P)", "a // (P): d(a, (P)) = d(M, (P)) với M bất kì thuộc a; (P) // (Q): d((P), (Q)) = d(M, (Q)) với M thuộc (P)", "Khoảng cách giữa hai đường thẳng chéo nhau là độ dài đoạn vuông góc chung", "Tam giác vuông tại A, đường cao AH: 1/AH² = 1/AB² + 1/AC²", "Đường thẳng MN cắt (P) tại I: d(M, (P))/d(N, (P)) = IM/IN"] },
        { ten: "Hình chóp đều, lăng trụ đứng", ct: ["Hình chóp đều: đáy là đa giác đều, chân đường cao trùng tâm đáy; các cạnh bên bằng nhau và tạo với đáy các góc bằng nhau", "Lăng trụ đứng: cạnh bên vuông góc với đáy; lăng trụ đều là lăng trụ đứng có đáy là đa giác đều"] },
        { ten: "Thể tích", ct: ["Khối chóp: V = ⅓·B·h", "Khối lăng trụ: V = B·h", "Khối hộp chữ nhật: V = abc; khối lập phương cạnh a: V = a³", "Khối chóp cụt đều: V = ⅓·h·(S + S′ + √(S·S′))"], gc: "B là diện tích đáy, h là chiều cao; S, S′ là diện tích hai đáy của chóp cụt." }
      ] },
    { g: 11, ch: "11-VIII", ten: "Các quy tắc tính xác suất",
      muc: [
        { ten: "Biến cố hợp, giao, xung khắc, độc lập", ct: ["A ∪ B xảy ra khi A hoặc B xảy ra; A ∩ B (viết AB) xảy ra khi cả A và B xảy ra", "A, B xung khắc ⇔ A ∩ B = ∅", "A, B độc lập: việc xảy ra hay không của biến cố này không làm thay đổi xác suất của biến cố kia"] },
        { ten: "Công thức cộng xác suất", ct: ["P(A ∪ B) = P(A) + P(B) − P(AB)", "A, B xung khắc: P(A ∪ B) = P(A) + P(B)", "P(Ā) = 1 − P(A)"] },
        { ten: "Công thức nhân cho biến cố độc lập", ct: ["A, B độc lập ⇔ P(AB) = P(A)·P(B)", "A, B độc lập thì các cặp Ā và B, A và B̄, Ā và B̄ cũng độc lập", "A₁, A₂, …, Aₖ độc lập: P(A₁A₂…Aₖ) = P(A₁)·P(A₂)·…·P(Aₖ)"] },
        { ten: "Xác suất “ít nhất một”", ct: ["A, B độc lập: P(A ∪ B) = 1 − P(Ā)·P(B̄)", "Lặp lại độc lập n lần, mỗi lần thành công với xác suất p: P(ít nhất một lần thành công) = 1 − (1 − p)ⁿ"] }
      ] },
    { g: 11, ch: "11-IX", ten: "Đạo hàm",
      muc: [
        { ten: "Định nghĩa và ý nghĩa", ct: ["f′(x₀) = lim (f(x) − f(x₀))/(x − x₀) khi x → x₀", "f′(x₀) là hệ số góc tiếp tuyến của đồ thị tại M(x₀; f(x₀))", "Vận tốc tức thời v(t) = s′(t)"] },
        { ten: "Phương trình tiếp tuyến", ct: ["Tại M(x₀; y₀): y = f′(x₀)(x − x₀) + y₀", "Tiếp tuyến có hệ số góc k: giải f′(x₀) = k để tìm x₀", "Tiếp tuyến song song y = kx + m thì có hệ số góc k; vuông góc với y = kx + m (k ≠ 0) thì có hệ số góc −1/k"] },
        { ten: "Đạo hàm các hàm số thường gặp", ct: ["c′ = 0; x′ = 1; (xⁿ)′ = n·xⁿ⁻¹", "(1/x)′ = −1/x²; (√x)′ = 1/(2√x)", "(sin x)′ = cos x; (cos x)′ = −sin x", "(tan x)′ = 1/cos²x; (cot x)′ = −1/sin²x", "(eˣ)′ = eˣ; (aˣ)′ = aˣ·ln a", "(ln x)′ = 1/x; (logₐ x)′ = 1/(x·ln a)"] },
        { ten: "Quy tắc tính đạo hàm", ct: ["(u ± v)′ = u′ ± v′; (k·u)′ = k·u′", "(uv)′ = u′v + uv′", "(u/v)′ = (u′v − uv′)/v²; (1/v)′ = −v′/v²", "Hàm hợp: [f(u(x))]′ = f′(u)·u′(x)"] },
        { ten: "Đạo hàm hàm hợp thường gặp", ct: ["(uⁿ)′ = n·uⁿ⁻¹·u′; (√u)′ = u′/(2√u)", "(sin u)′ = u′·cos u; (cos u)′ = −u′·sin u", "(tan u)′ = u′/cos²u; (cot u)′ = −u′/sin²u", "(eᵘ)′ = u′·eᵘ; (aᵘ)′ = u′·aᵘ·ln a", "(ln u)′ = u′/u; (logₐ u)′ = u′/(u·ln a)"] },
        { ten: "Đạo hàm cấp hai", ct: ["y″ = (y′)′", "Gia tốc tức thời a(t) = v′(t) = s″(t)"] }
      ] },
    { g: 12, ch: "12-I", ten: "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
      muc: [
        { ten: "Tính đơn điệu", ct: ["f′(x) > 0 trên K ⇒ f đồng biến trên K; f′(x) < 0 trên K ⇒ f nghịch biến trên K", "f′(x) ≥ 0 trên K, dấu bằng chỉ xảy ra tại hữu hạn điểm ⇒ f đồng biến trên K"], gc: "Các bước: tập xác định → f′ → nghiệm của f′ và điểm f′ không xác định → bảng biến thiên → kết luận." },
        { ten: "Cực trị", ct: ["f′ đổi dấu từ + sang − khi qua x₀ ⇒ x₀ là điểm cực đại", "f′ đổi dấu từ − sang + khi qua x₀ ⇒ x₀ là điểm cực tiểu", "f có đạo hàm tại x₀ và đạt cực trị tại x₀ ⇒ f′(x₀) = 0"], gc: "f′(x₀) = 0 chưa đủ để có cực trị, ví dụ y = x³ tại x = 0." },
        { ten: "Giá trị lớn nhất, nhỏ nhất", ct: ["Trên đoạn [a; b] (f liên tục): tính f tại a, b và tại các điểm trong (a; b) mà f′ bằng 0 hoặc không xác định; số lớn nhất là max, số nhỏ nhất là min", "f đồng biến trên [a; b]: max = f(b), min = f(a); nghịch biến thì ngược lại", "Trên khoảng: lập bảng biến thiên rồi đọc kết quả"] },
        { ten: "Đường tiệm cận", ct: ["x = x₀ là tiệm cận đứng nếu f(x) → +∞ hoặc −∞ khi x → x₀⁺ hoặc x → x₀⁻", "y = y₀ là tiệm cận ngang nếu f(x) → y₀ khi x → +∞ hoặc x → −∞", "y = ax + b (a ≠ 0) là tiệm cận xiên nếu f(x) − (ax + b) → 0 khi x → +∞ hoặc x → −∞", "Tìm tiệm cận xiên: a = lim f(x)/x, b = lim [f(x) − ax]"] },
        { ten: "Hàm bậc ba y = ax³ + bx² + cx + d", ct: ["y′ = 3ax² + 2bx + c", "Có hai điểm cực trị ⇔ b² − 3ac > 0; không có cực trị ⇔ b² − 3ac ≤ 0", "Tâm đối xứng của đồ thị là điểm có hoành độ x = −b/(3a) (nghiệm của y″ = 0)"] },
        { ten: "Hàm phân thức y = (ax + b)/(cx + d)", ct: ["Điều kiện c ≠ 0, ad − bc ≠ 0", "y′ = (ad − bc)/(cx + d)²: hàm luôn đồng biến (ad − bc > 0) hoặc luôn nghịch biến (ad − bc < 0) trên từng khoảng xác định", "Tiệm cận đứng x = −d/c, tiệm cận ngang y = a/c", "Tâm đối xứng là giao điểm hai tiệm cận I(−d/c; a/c)"] },
        { ten: "Hàm phân thức y = (ax² + bx + c)/(mx + n)", ct: ["Chia đa thức: y = px + q + r/(mx + n)", "r ≠ 0: tiệm cận đứng x = −n/m, tiệm cận xiên y = px + q", "Tâm đối xứng là giao điểm hai tiệm cận"], gc: "Điều kiện a ≠ 0, m ≠ 0 và tử không chia hết cho mẫu." },
        { ten: "Tương giao và số nghiệm", ct: ["Số nghiệm của f(x) = m bằng số giao điểm của đồ thị y = f(x) với đường thẳng y = m", "Hoành độ giao điểm của y = f(x) và y = g(x) là nghiệm của f(x) = g(x)"] }
      ] },
    { g: 12, ch: "12-II", ten: "Vectơ và hệ trục tọa độ trong không gian",
      muc: [
        { ten: "Quy tắc vectơ trong không gian", ct: ["Quy tắc hình hộp ABCD.A′B′C′D′: AB + AD + AA′ = AC′", "G là trọng tâm tứ diện ABCD ⇔ GA + GB + GC + GD = 0", "a·b = |a|·|b|·cos(a, b); a ⊥ b ⇔ a·b = 0"], gc: "AB, a, b, … là vectơ. Các quy tắc ba điểm, hình bình hành, trung điểm, trọng tâm tam giác vẫn đúng trong không gian." },
        { ten: "Tọa độ điểm và vectơ", ct: ["M(x; y; z) ⇔ OM = x·i + y·j + z·k", "A(x₁; y₁; z₁), B(x₂; y₂; z₂) ⇒ AB = (x₂ − x₁; y₂ − y₁; z₂ − z₁)", "Hình chiếu của M(x; y; z) lên (Oxy), (Oyz), (Ozx): (x; y; 0), (0; y; z), (x; 0; z); lên Ox, Oy, Oz: (x; 0; 0), (0; y; 0), (0; 0; z)", "Đối xứng qua O: (−x; −y; −z); qua (Oxy): (x; y; −z); qua trục Ox: (x; −y; −z)"] },
        { ten: "Biểu thức tọa độ các phép toán", ct: ["a ± b = (a₁ ± b₁; a₂ ± b₂; a₃ ± b₃); k·a = (ka₁; ka₂; ka₃)", "a·b = a₁b₁ + a₂b₂ + a₃b₃; |a| = √(a₁² + a₂² + a₃²)", "cos(a, b) = (a₁b₁ + a₂b₂ + a₃b₃)/(|a|·|b|)", "a ⊥ b ⇔ a₁b₁ + a₂b₂ + a₃b₃ = 0", "AB = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²)"] },
        { ten: "Trung điểm, trọng tâm", ct: ["Trung điểm AB: ((x₁ + x₂)/2; (y₁ + y₂)/2; (z₁ + z₂)/2)", "Trọng tâm tam giác: trung bình cộng tọa độ ba đỉnh", "Trọng tâm tứ diện: trung bình cộng tọa độ bốn đỉnh"] },
        { ten: "Hai vectơ cùng phương", ct: ["b cùng phương a (a ≠ 0) ⇔ có số k để b = k·a", "A, B, C thẳng hàng ⇔ AB và AC cùng phương"] }
      ] },
    { g: 12, ch: "12-III", ten: "Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm",
      muc: [
        { ten: "Khoảng biến thiên", ct: ["R = aₖ₊₁ − a₁ (đầu mút phải của nhóm cuối trừ đầu mút trái của nhóm đầu)"], gc: "Chỉ xét từ nhóm đầu tiên đến nhóm cuối cùng có tần số khác 0." },
        { ten: "Khoảng tứ phân vị", ct: ["ΔQ = Q₃ − Q₁", "Q₁, Q₃ tính như ở lớp 11: Q = uₘ + ((k·n/4 − C)/nₘ)·(uₘ₊₁ − uₘ) với k = 1 hoặc 3"], gc: "ΔQ đo độ phân tán của khoảng 50% số liệu ở giữa, ít bị ảnh hưởng bởi giá trị bất thường." },
        { ten: "Giá trị ngoại lệ", ct: ["x là giá trị ngoại lệ nếu x < Q₁ − 1,5·ΔQ hoặc x > Q₃ + 1,5·ΔQ"] },
        { ten: "Phương sai, độ lệch chuẩn", ct: ["s² = [n₁(x₁ − x̄)² + n₂(x₂ − x̄)² + … + nₖ(xₖ − x̄)²]/n", "s² = (n₁x₁² + n₂x₂² + … + nₖxₖ²)/n − x̄²", "Độ lệch chuẩn s = √(s²)"], gc: "xᵢ là giá trị đại diện của nhóm. s càng nhỏ thì số liệu càng tập trung quanh số trung bình." }
      ] },
    { g: 12, ch: "12-IV", ten: "Nguyên hàm và tích phân",
      muc: [
        { ten: "Nguyên hàm và tính chất", ct: ["F là một nguyên hàm của f trên K ⇔ F′(x) = f(x) với mọi x thuộc K", "∫f(x)dx = F(x) + C", "∫k·f(x)dx = k∫f(x)dx (k ≠ 0); ∫[f(x) ± g(x)]dx = ∫f(x)dx ± ∫g(x)dx", "∫f′(x)dx = f(x) + C"] },
        { ten: "Bảng nguyên hàm", ct: ["∫0dx = C; ∫dx = x + C", "∫xᵅdx = xᵅ⁺¹/(α + 1) + C (α ≠ −1)", "∫(1/x)dx = ln|x| + C", "∫eˣdx = eˣ + C; ∫aˣdx = aˣ/ln a + C (a > 0, a ≠ 1)", "∫sin x dx = −cos x + C; ∫cos x dx = sin x + C", "∫(1/cos²x)dx = tan x + C; ∫(1/sin²x)dx = −cot x + C"] },
        { ten: "Tích phân và tính chất", ct: ["∫ₐᵇ f(x)dx = F(b) − F(a) (F là một nguyên hàm của f)", "∫ₐᵃ f(x)dx = 0; đổi chỗ hai cận thì tích phân đổi dấu", "∫ₐᵇ k·f(x)dx = k∫ₐᵇ f(x)dx; ∫ₐᵇ [f ± g]dx = ∫ₐᵇ f dx ± ∫ₐᵇ g dx", "a < b < c: ∫ₐᶜ f(x)dx = ∫ₐᵇ f(x)dx + (tích phân của f từ b đến c)", "Tích phân không phụ thuộc tên biến: ∫ₐᵇ f(x)dx = ∫ₐᵇ f(t)dt"] },
        { ten: "Diện tích hình phẳng", ct: ["Giới hạn bởi y = f(x), trục Ox, x = a, x = b: S = ∫ₐᵇ |f(x)|dx", "Giới hạn bởi y = f(x), y = g(x), x = a, x = b: S = ∫ₐᵇ |f(x) − g(x)|dx", "f(x) − g(x) không đổi dấu trên [a; b] thì S = |∫ₐᵇ [f(x) − g(x)]dx|"], gc: "Tìm nghiệm của f(x) = g(x) trong [a; b] để tách tích phân và bỏ dấu giá trị tuyệt đối." },
        { ten: "Thể tích", ct: ["Vật thể có thiết diện vuông góc với Ox tại x có diện tích S(x): V = ∫ₐᵇ S(x)dx", "Quay hình phẳng giới hạn bởi y = f(x), Ox, x = a, x = b quanh Ox: V = π∫ₐᵇ f²(x)dx"] },
        { ten: "Ứng dụng trong chuyển động", ct: ["s′(t) = v(t), v′(t) = a(t)", "Quãng đường từ thời điểm a đến b khi v(t) ≥ 0: s = ∫ₐᵇ v(t)dt", "Độ dịch chuyển: ∫ₐᵇ v(t)dt = s(b) − s(a); vận tốc: v(b) − v(a) = ∫ₐᵇ a(t)dt"] }
      ] },
    { g: 12, ch: "12-V", ten: "Phương pháp tọa độ trong không gian",
      muc: [
        { ten: "Phương trình mặt phẳng", ct: ["Qua M(x₀; y₀; z₀), pháp tuyến n = (A; B; C): A(x − x₀) + B(y − y₀) + C(z − z₀) = 0", "Dạng tổng quát: Ax + By + Cz + D = 0 (A² + B² + C² > 0), pháp tuyến n = (A; B; C)", "Cặp chỉ phương a, b không cùng phương ⇒ pháp tuyến n = (a₂b₃ − a₃b₂; a₃b₁ − a₁b₃; a₁b₂ − a₂b₁) (tích có hướng [a, b])", "Đoạn chắn qua A(a; 0; 0), B(0; b; 0), C(0; 0; c) (abc ≠ 0): x/a + y/b + z/c = 1", "Mặt phẳng tọa độ: (Oxy): z = 0; (Oyz): x = 0; (Ozx): y = 0"] },
        { ten: "Vị trí tương đối của hai mặt phẳng", ct: ["(P): Ax + By + Cz + D = 0 và (Q): A′x + B′y + C′z + D′ = 0", "(P) // (Q) ⇔ (A; B; C) = k(A′; B′; C′) và D ≠ kD′; trùng nhau ⇔ thêm D = kD′", "(P) cắt (Q) ⇔ hai pháp tuyến không cùng phương", "(P) ⊥ (Q) ⇔ AA′ + BB′ + CC′ = 0"] },
        { ten: "Khoảng cách từ điểm đến mặt phẳng", ct: ["d(M, (P)) = |Ax₀ + By₀ + Cz₀ + D|/√(A² + B² + C²)", "Hai mặt phẳng song song Ax + By + Cz + D = 0 và Ax + By + Cz + D′ = 0: khoảng cách |D − D′|/√(A² + B² + C²)"] },
        { ten: "Phương trình đường thẳng", ct: ["Qua M(x₀; y₀; z₀), chỉ phương u = (a; b; c): x = x₀ + at, y = y₀ + bt, z = z₀ + ct (t ∈ ℝ)", "Chính tắc (abc ≠ 0): (x − x₀)/a = (y − y₀)/b = (z − z₀)/c", "Qua hai điểm A, B: chỉ phương u = AB"] },
        { ten: "Vị trí tương đối của đường thẳng", ct: ["d₁ (qua M₁, chỉ phương u₁), d₂ (qua M₂, chỉ phương u₂): u₁, u₂ cùng phương thì d₁ // d₂ (M₁ không thuộc d₂) hoặc trùng nhau (M₁ thuộc d₂)", "u₁, u₂ không cùng phương: hệ phương trình tham số có nghiệm thì d₁ cắt d₂, vô nghiệm thì d₁ và d₂ chéo nhau", "d₁ ⊥ d₂ ⇔ u₁·u₂ = 0", "d (qua M₀, chỉ phương u) và (P) (pháp tuyến n): u·n ≠ 0 ⇔ d cắt (P); u·n = 0 và M₀ không thuộc (P) ⇔ d // (P); u·n = 0 và M₀ thuộc (P) ⇔ d nằm trong (P)", "d ⊥ (P) ⇔ u cùng phương n"] },
        { ten: "Góc trong không gian", ct: ["Hai đường thẳng: cos φ = |u₁·u₂|/(|u₁|·|u₂|)", "Đường thẳng và mặt phẳng: sin φ = |u·n|/(|u|·|n|)", "Hai mặt phẳng: cos φ = |n₁·n₂|/(|n₁|·|n₂|)"], gc: "Các góc này đều thuộc [0°; 90°]. Chú ý góc giữa đường thẳng và mặt phẳng dùng sin." },
        { ten: "Mặt cầu", ct: ["Tâm I(a; b; c), bán kính R: (x − a)² + (y − b)² + (z − c)² = R²", "x² + y² + z² − 2ax − 2by − 2cz + d = 0 là mặt cầu ⇔ a² + b² + c² − d > 0; tâm I(a; b; c), R = √(a² + b² + c² − d)", "h = d(I, (P)): h > R thì không cắt; h = R thì (P) tiếp xúc mặt cầu tại hình chiếu của I; h < R thì cắt theo đường tròn bán kính r = √(R² − h²)"] }
      ] },
    { g: 12, ch: "12-VI", ten: "Xác suất có điều kiện",
      muc: [
        { ten: "Xác suất có điều kiện", ct: ["P(A | B) = P(AB)/P(B) (P(B) > 0)", "P(Ā | B) = 1 − P(A | B)", "A, B độc lập ⇔ P(A | B) = P(A) (P(B) > 0)"], gc: "Có thể tính bằng cách đếm trên không gian mẫu thu hẹp chỉ gồm các kết quả thuận lợi cho B." },
        { ten: "Công thức nhân xác suất", ct: ["P(AB) = P(B)·P(A | B) = P(A)·P(B | A)"] },
        { ten: "Công thức xác suất toàn phần", ct: ["P(A) = P(B)·P(A | B) + P(B̄)·P(A | B̄) (0 < P(B) < 1)"], gc: "Vẽ sơ đồ hình cây: tầng một là B, B̄; tầng hai là A, Ā; nhân xác suất dọc theo nhánh rồi cộng các nhánh dẫn tới A." },
        { ten: "Công thức Bayes", ct: ["P(B | A) = P(B)·P(A | B)/P(A) (P(A) > 0)", "P(B | A) = P(B)·P(A | B)/[P(B)·P(A | B) + P(B̄)·P(A | B̄)]"] }
      ] }
  ],
  nc: [
    { ten: "Hàm số và đồ thị",
      muc: [
        { ten: "Đường thẳng qua hai điểm cực trị của hàm bậc ba", ct: ["y = ax³ + bx² + cx + d có hai cực trị: đường thẳng qua hai điểm cực trị là y = (2c/3 − 2b²/(9a))x + d − bc/(9a)", "Cách nhớ: đó là phần dư khi chia y cho y′; hoặc y − y′·y″/(18a)"], dk: "a ≠ 0 và b² − 3ac > 0.", gc: "Dùng cho trắc nghiệm; tự luận nên chia đa thức y cho y′ để trình bày." },
        { ten: "Hai điểm cực trị của hàm bậc ba", ct: ["|x₁ − x₂| = 2√(b² − 3ac)/(3|a|)", "x₁ + x₂ = −2b/(3a); x₁·x₂ = c/(3a)", "Trung điểm hai điểm cực trị là tâm đối xứng của đồ thị (điểm có y″ = 0)"], dk: "a ≠ 0 và b² − 3ac > 0; x₁, x₂ là hoành độ hai điểm cực trị (nghiệm của y′ = 0)." },
        { ten: "Dấu hiệu cực trị bằng đạo hàm cấp hai", ct: ["f′(x₀) = 0 và f″(x₀) > 0 ⇒ x₀ là điểm cực tiểu", "f′(x₀) = 0 và f″(x₀) < 0 ⇒ x₀ là điểm cực đại" ], dk: "f có đạo hàm cấp hai liên tục quanh x₀.", gc: "f″(x₀) = 0 thì chưa kết luận được, phải xét dấu f′." },
        { ten: "Cực trị hàm trùng phương", ct: ["y = ax⁴ + bx² + c có ba điểm cực trị ⇔ ab < 0; có đúng một điểm cực trị ⇔ ab ≥ 0", "a > 0, b < 0: một cực đại tại x = 0, hai cực tiểu; a < 0, b > 0: một cực tiểu tại x = 0, hai cực đại", "Ba điểm cực trị: A(0; c), B(−√(−b/(2a)); c − b²/(4a)), C(√(−b/(2a)); c − b²/(4a))"], dk: "a ≠ 0." },
        { ten: "Tam giác ba điểm cực trị của hàm trùng phương", ct: ["Tam giác ABC vuông cân tại A ⇔ b³ = −8a", "Tam giác ABC đều ⇔ b³ = −24a", "Diện tích: S² = −b⁵/(32a³)"], dk: "y = ax⁴ + bx² + c với ab < 0; A(0; c) là điểm cực trị nằm trên trục tung.", gc: "Tự luận nên tính tọa độ ba điểm rồi lập điều kiện." },
        { ten: "Tiệm cận của hàm phân thức hữu tỉ", ct: ["y = P(x)/Q(x): bậc P < bậc Q ⇒ tiệm cận ngang y = 0", "Bậc P = bậc Q ⇒ tiệm cận ngang y = tỉ số hệ số bậc cao nhất của P và Q", "Bậc P = bậc Q + 1 ⇒ không có tiệm cận ngang, có tiệm cận xiên (thương của phép chia P cho Q)", "x₀ là nghiệm của Q nhưng không là nghiệm của P ⇒ x = x₀ là tiệm cận đứng"], dk: "P, Q là đa thức.", gc: "Nếu x₀ là nghiệm chung của P và Q thì rút gọn (x − x₀) rồi xét lại; có thể không còn tiệm cận đứng." },
        { ten: "Tiệm cận xiên của hàm chứa căn bậc hai", ct: ["y = √(ax² + bx + c): khi x → +∞ có tiệm cận xiên y = √a·(x + b/(2a))", "Khi x → −∞ có tiệm cận xiên y = −√a·(x + b/(2a))"], dk: "a > 0.", gc: "Gộp lại: y = √a·|x + b/(2a)|. Với a < 0 tập xác định bị chặn nên không có tiệm cận." },
        { ten: "Tiếp tuyến của đồ thị hàm phân thức bậc nhất", ct: ["Tiếp tuyến tại M của y = (ax + b)/(cx + d) cắt hai tiệm cận tại A, B thì M là trung điểm AB", "Tam giác IAB (I là giao hai tiệm cận) có diện tích không đổi: S = 2|ad − bc|/c²"], dk: "c ≠ 0, ad − bc ≠ 0." }
      ] },
    { ten: "Lượng giác",
      muc: [
        { ten: "Biểu thức a·sin x + b·cos x", ct: ["a·sin x + b·cos x = √(a² + b²)·sin(x + φ) với cos φ = a/√(a² + b²), sin φ = b/√(a² + b²)", "−√(a² + b²) ≤ a·sin x + b·cos x ≤ √(a² + b²)", "Phương trình a·sin x + b·cos x = c có nghiệm ⇔ a² + b² ≥ c²", "sin x + cos x = √2·sin(x + π/4); sin x − cos x = √2·sin(x − π/4)"], dk: "a² + b² > 0." },
        { ten: "Công thức nhân ba", ct: ["sin 3a = 3sin a − 4sin³a", "cos 3a = 4cos³a − 3cos a", "tan 3a = (3tan a − tan³a)/(1 − 3tan²a)"], dk: "Với tan 3a: cos a ≠ 0 và tan²a ≠ 1/3." },
        { ten: "Biểu diễn theo t = tan(x/2)", ct: ["sin x = 2t/(1 + t²)", "cos x = (1 − t²)/(1 + t²)", "tan x = 2t/(1 − t²) (t² ≠ 1)"], dk: "x ≠ π + k2π (để tan(x/2) xác định).", gc: "Khi đặt ẩn này cần thử riêng x = π + k2π xem có là nghiệm không." },
        { ten: "Tổng lũy thừa bậc bốn, bậc sáu của sin và cos", ct: ["sin⁴x + cos⁴x = 1 − ½sin²2x", "sin⁶x + cos⁶x = 1 − ¾sin²2x", "(sin x ± cos x)² = 1 ± sin 2x"], dk: "Đúng với mọi x.", gc: "Hay dùng tìm giá trị lớn nhất, nhỏ nhất: sin²2x thuộc [0; 1]." },
        { ten: "Hệ thức lượng giác trong tam giác", ct: ["sin 2A + sin 2B + sin 2C = 4sin A·sin B·sin C", "cos²A + cos²B + cos²C + 2cos A·cos B·cos C = 1", "tan A + tan B + tan C = tan A·tan B·tan C"], dk: "A + B + C = π; đẳng thức thứ ba cần thêm tam giác không có góc vuông." }
      ] },
    { ten: "Hệ thức trong tam giác",
      muc: [
        { ten: "Độ dài đường trung tuyến", ct: ["mₐ² = (2b² + 2c² − a²)/4", "Tổng bình phương ba trung tuyến bằng ¾(a² + b² + c²)"], dk: "mₐ là trung tuyến kẻ từ A tới trung điểm cạnh a; hai trung tuyến còn lại tính tương tự bằng cách hoán vị a, b, c.", gc: "Sách giáo khoa chỉ có định lí côsin; tự luận nên chứng minh lại từ định lí côsin." },
        { ten: "Công thức hình chiếu", ct: ["a = b·cos C + c·cos B", "b = c·cos A + a·cos C; c = a·cos B + b·cos A"], dk: "Mọi tam giác ABC (cạnh a đối diện góc A)." },
        { ten: "Độ dài đường phân giác trong", ct: ["lₐ = 2bc·cos(A/2)/(b + c)", "lₐ² = bc·[(b + c)² − a²]/(b + c)²", "Chân phân giác D chia cạnh BC: DB/DC = c/b"], dk: "lₐ là đoạn phân giác trong kẻ từ A." },
        { ten: "Bán kính nội tiếp theo nửa góc", ct: ["r = (p − a)·tan(A/2)", "Tiếp điểm của đường tròn nội tiếp trên cạnh AB, AC cách A một đoạn p − a", "Tam giác vuông tại A: r = (b + c − a)/2, R = a/2"], dk: "p là nửa chu vi; a là cạnh đối diện góc A (trong tam giác vuông, a là cạnh huyền)." }
      ] },
    { ten: "Tọa độ trong mặt phẳng và ba đường conic",
      muc: [
        { ten: "Diện tích tam giác theo tọa độ đỉnh", ct: ["A(x₁; y₁), B(x₂; y₂), C(x₃; y₃): S = ½·|(x₂ − x₁)(y₃ − y₁) − (x₃ − x₁)(y₂ − y₁)|"], dk: "Mọi tam giác trong mặt phẳng tọa độ; kết quả bằng 0 ⇔ A, B, C thẳng hàng." },
        { ten: "Khoảng cách giữa hai đường thẳng song song", ct: ["ax + by + c₁ = 0 và ax + by + c₂ = 0: d = |c₁ − c₂|/√(a² + b²)"], dk: "Hai phương trình phải có cùng hệ số a, b (nhân hệ số cho khớp trước khi dùng)." },
        { ten: "Điểm đối xứng qua một đường thẳng", ct: ["Hình chiếu của M(x₀; y₀) lên Δ: ax + by + c = 0 là H(x₀ − a·t; y₀ − b·t) với t = (ax₀ + by₀ + c)/(a² + b²)", "Điểm đối xứng của M qua Δ: M′(x₀ − 2a·t; y₀ − 2b·t)"], dk: "a² + b² > 0.", gc: "Tự luận: viết đường thẳng qua M vuông góc Δ, tìm giao điểm H, rồi lấy M′ đối xứng M qua H." },
        { ten: "Tâm sai, bán kính qua tiêu và đường chuẩn của elip", ct: ["Tâm sai e = c/a (0 < e < 1)", "M(x; y) thuộc elip: MF₁ = a + e·x, MF₂ = a − e·x", "Đường chuẩn Δ₁: x = −a/e ứng với F₁, Δ₂: x = a/e ứng với F₂; MF₁/d(M, Δ₁) = MF₂/d(M, Δ₂) = e"], dk: "Elip chính tắc x²/a² + y²/b² = 1, a > b > 0, F₁(−c; 0), F₂(c; 0).", gc: "Thuộc chuyên đề học tập lớp 10, không có trong sách chính." },
        { ten: "Tâm sai, tiệm cận và bán kính qua tiêu của hypebol", ct: ["Tâm sai e = c/a (e > 1)", "Hai tiệm cận y = (b/a)x và y = −(b/a)x", "M(x; y) thuộc hypebol: MF₁ = |a + e·x|, MF₂ = |a − e·x|"], dk: "Hypebol chính tắc x²/a² − y²/b² = 1, F₁(−c; 0), F₂(c; 0).", gc: "Thuộc chuyên đề học tập lớp 10." },
        { ten: "Tiếp tuyến của conic", ct: ["Elip tại M₀(x₀; y₀): x₀x/a² + y₀y/b² = 1", "Hypebol tại M₀(x₀; y₀): x₀x/a² − y₀y/b² = 1", "Parabol y² = 2px tại M₀(x₀; y₀): y₀y = p(x + x₀)", "Đường thẳng Ax + By + C = 0 tiếp xúc elip x²/a² + y²/b² = 1 ⇔ A²a² + B²b² = C²"], dk: "Conic ở dạng chính tắc; M₀ nằm trên conic." }
      ] },
    { ten: "Hình học không gian",
      muc: [
        { ten: "Tỉ số thể tích khối chóp tam giác", ct: ["V(S.A′B′C′)/V(S.ABC) = (SA′/SA)·(SB′/SB)·(SC′/SC)"], dk: "Chỉ dùng cho chóp tam giác; A′, B′, C′ lần lượt nằm trên các tia SA, SB, SC (khác S).", gc: "Chóp tứ giác thì chia thành hai chóp tam giác rồi cộng lại." },
        { ten: "Mặt phẳng cắt hình chóp có đáy là hình bình hành", ct: ["Mặt phẳng cắt SA, SB, SC, SD tại M, N, P, Q; đặt x = SA/SM, y = SB/SN, z = SC/SP, t = SD/SQ thì x + z = y + t", "V(S.MNPQ)/V(S.ABCD) = (x + y + z + t)/(4xyzt)"], dk: "Đáy ABCD là hình bình hành; M, N, P, Q nằm trên các cạnh bên (khác S) và đồng phẳng." },
        { ten: "Tứ diện vuông và tứ diện đều", ct: ["OA, OB, OC đôi một vuông góc: V = OA·OB·OC/6", "Khi đó h = d(O, (ABC)) thỏa mãn 1/h² = 1/OA² + 1/OB² + 1/OC²", "Tứ diện đều cạnh a: chiều cao a√6/3, thể tích a³√2/12", "Bán kính mặt cầu ngoại tiếp tứ diện đều cạnh a: R = a√6/4"], dk: "Đúng cho tứ diện có ba cạnh chung đỉnh O đôi một vuông góc (dòng 1, 2) và tứ diện đều (dòng 3, 4)." },
        { ten: "Diện tích hình chiếu", ct: ["S′ = S·cos φ"], dk: "S là diện tích đa giác nằm trong (P), S′ là diện tích hình chiếu vuông góc của nó lên (Q), φ là góc giữa (P) và (Q).", gc: "Dùng tính nhanh góc giữa hai mặt phẳng: cos φ = S′/S. Tự luận nên dựng góc nhị diện." },
        { ten: "Mặt cầu ngoại tiếp khi có cạnh vuông góc đáy", ct: ["Chóp có cạnh bên SA vuông góc đáy: R = √(r² + (SA/2)²)", "Lăng trụ đứng chiều cao h: R = √(r² + (h/2)²)", "Hình hộp chữ nhật ba kích thước a, b, c: R = √(a² + b² + c²)/2"], dk: "Đáy nội tiếp được đường tròn, r là bán kính đường tròn ngoại tiếp đáy." },
        { ten: "Mặt cầu ngoại tiếp hình chóp có các cạnh bên bằng nhau", ct: ["R = l²/(2h)"], dk: "Các cạnh bên bằng nhau và bằng l (ví dụ hình chóp đều); h là chiều cao (chân đường cao là tâm đường tròn ngoại tiếp đáy)." },
        { ten: "Mặt cầu ngoại tiếp hình chóp có mặt bên vuông góc đáy", ct: ["R² = R₁² + R₂² − m²/4"], dk: "Mặt bên vuông góc với đáy; R₁ là bán kính đường tròn ngoại tiếp mặt bên đó, R₂ là bán kính đường tròn ngoại tiếp đáy, m là độ dài giao tuyến (cạnh chung) của mặt bên và đáy." }
      ] },
    { ten: "Tọa độ trong không gian",
      muc: [
        { ten: "Diện tích tam giác, hình bình hành bằng tích có hướng", ct: ["S(ABC) = ½·|[AB, AC]|", "Hình bình hành ABCD: S = |[AB, AD]|"], dk: "[a, b] = (a₂b₃ − a₃b₂; a₃b₁ − a₁b₃; a₁b₂ − a₂b₁) là tích có hướng; AB, AC, AD là vectơ.", gc: "Tích có hướng chỉ được giới thiệu để tìm pháp tuyến; các ứng dụng này ngoài sách giáo khoa." },
        { ten: "Thể tích tứ diện, hình hộp bằng tích hỗn tạp", ct: ["V(ABCD) = (1/6)·|[AB, AC]·AD|", "Hình hộp ABCD.A′B′C′D′: V = |[AB, AD]·AA′|", "Ba vectơ a, b, c đồng phẳng ⇔ [a, b]·c = 0"], dk: "AB, AC, AD, AA′ là vectơ; [a, b] là tích có hướng." },
        { ten: "Khoảng cách từ điểm đến đường thẳng trong không gian", ct: ["d(M, Δ) = |[AM, u]|/|u|"], dk: "Δ đi qua A và có chỉ phương u ≠ 0." },
        { ten: "Khoảng cách giữa hai đường thẳng chéo nhau", ct: ["d(d₁, d₂) = |[u₁, u₂]·M₁M₂|/|[u₁, u₂]|"], dk: "d₁ qua M₁ có chỉ phương u₁; d₂ qua M₂ có chỉ phương u₂; u₁, u₂ không cùng phương.", gc: "Kết quả bằng 0 nghĩa là hai đường thẳng cắt nhau." },
        { ten: "Hình chiếu và điểm đối xứng qua mặt phẳng", ct: ["Hình chiếu của M(x₀; y₀; z₀) lên (P): Ax + By + Cz + D = 0 là H(x₀ − A·t; y₀ − B·t; z₀ − C·t) với t = (Ax₀ + By₀ + Cz₀ + D)/(A² + B² + C²)", "Điểm đối xứng của M qua (P): M′(x₀ − 2A·t; y₀ − 2B·t; z₀ − 2C·t)"], dk: "A² + B² + C² > 0." },
        { ten: "Giá trị nhỏ nhất của αMA² + βMB² trên mặt phẳng", ct: ["Lấy I với α·IA + β·IB = 0, tức I = (α·A + β·B)/(α + β) theo tọa độ", "αMA² + βMB² = (α + β)MI² + αIA² + βIB², nhỏ nhất khi M là hình chiếu của I lên (P)"], dk: "α + β > 0, M chạy trên mặt phẳng (P). Nếu α + β < 0 thì biểu thức đạt giá trị lớn nhất tại cùng điểm đó.", gc: "Trường hợp hay gặp α = β = 1: I là trung điểm AB." }
      ] },
    { ten: "Nguyên hàm và tích phân",
      muc: [
        { ten: "Nguyên hàm dạng f(ax + b)", ct: ["∫(ax + b)ᵅdx = (ax + b)ᵅ⁺¹/(a(α + 1)) + C (α ≠ −1)", "∫dx/(ax + b) = (1/a)·ln|ax + b| + C", "∫e^(ax + b)dx = (1/a)·e^(ax + b) + C", "∫sin(ax + b)dx = −(1/a)·cos(ax + b) + C; ∫cos(ax + b)dx = (1/a)·sin(ax + b) + C"], dk: "a ≠ 0.", gc: "Quy tắc chung: nếu ∫f(x)dx = F(x) + C thì ∫f(ax + b)dx = (1/a)·F(ax + b) + C." },
        { ten: "Nguyên hàm phân thức hay gặp", ct: ["∫dx/((x − α)(x − β)) = (1/(α − β))·ln|(x − α)/(x − β)| + C", "∫dx/(x² − m²) = (1/(2m))·ln|(x − m)/(x + m)| + C"], dk: "α ≠ β; m ≠ 0.", gc: "Gốc của công thức: 1/((x − α)(x − β)) = (1/(α − β))·[1/(x − α) − 1/(x − β)]." },
        { ten: "Tích phân từng phần", ct: ["∫ₐᵇ u·v′dx = [u·v] từ a đến b − ∫ₐᵇ u′·v dx", "∫ln x dx = x·ln x − x + C", "∫x·eˣdx = (x − 1)eˣ + C"], dk: "u, v có đạo hàm liên tục trên [a; b].", gc: "Thứ tự ưu tiên chọn u: lôgarit → đa thức → lượng giác → mũ." },
        { ten: "Tích phân hàm chẵn, hàm lẻ", ct: ["f lẻ: ∫₋ₐᵃ f(x)dx = 0", "f chẵn: ∫₋ₐᵃ f(x)dx = 2∫₀ᵃ f(x)dx", "f chẵn, m > 0: ∫₋ₐᵃ f(x)/(1 + mˣ) dx = ∫₀ᵃ f(x)dx"], dk: "f liên tục trên [−a; a] (a > 0)." },
        { ten: "Đổi biến x = a + b − x và hàm tuần hoàn", ct: ["∫ₐᵇ f(x)dx = ∫ₐᵇ f(a + b − x)dx", "∫₀^π x·f(sin x)dx = (π/2)·∫₀^π f(sin x)dx", "f tuần hoàn chu kì T: ∫ₐ^(a + T) f(x)dx = ∫₀ᵀ f(x)dx"], dk: "f liên tục trên đoạn lấy tích phân (dòng 2: f liên tục trên [0; 1])." },
        { ten: "Diện tích giới hạn bởi parabol và đường thẳng", ct: ["S = |a|·(x₂ − x₁)³/6", "Parabol y = ax² + bx + c và trục Ox (Δ > 0): S = Δ·√Δ/(6a²)"], dk: "f(x) − g(x) = ax² + bx + c (a ≠ 0) có hai nghiệm x₁ < x₂ là hoành độ giao điểm; tính trên [x₁; x₂].", gc: "Diện tích hình parabol bằng 2/3 diện tích hình chữ nhật bao quanh nó." },
        { ten: "Thể tích khối tròn xoay mở rộng", ct: ["Hình giới hạn bởi y = f(x), y = g(x), x = a, x = b quay quanh Ox: V = π∫ₐᵇ |f²(x) − g²(x)|dx", "Quay quanh Oy hình giới hạn bởi x = g(y), Oy, y = c, y = d (c < d): V = π·(tích phân của g²(y) theo y từ c đến d)", "Elip x²/a² + y²/b² = 1 có diện tích πab; quay quanh Ox được khối có thể tích (4/3)πab²"], dk: "Dòng 1: f(x), g(x) cùng dấu (cùng không âm hoặc cùng không dương) trên [a; b], tức hình phẳng không cắt trục Ox." }
      ] },
    { ten: "Bất đẳng thức",
      muc: [
        { ten: "Bất đẳng thức AM–GM (Cô-si)", ct: ["(a + b)/2 ≥ √(ab), dấu bằng ⇔ a = b", "(a + b + c)/3 ≥ ∛(abc), dấu bằng ⇔ a = b = c", "x + y = S không đổi thì xy ≤ S²/4; xy = P không đổi thì x + y ≥ 2√P"], dk: "Các số a, b, c, x, y không âm.", gc: "Luôn kiểm tra dấu bằng xảy ra được thì mới kết luận giá trị lớn nhất, nhỏ nhất." },
        { ten: "Bất đẳng thức Cauchy–Schwarz (Bu-nhi-a-cốp-xki)", ct: ["(a₁b₁ + a₂b₂)² ≤ (a₁² + a₂²)(b₁² + b₂²)", "(a₁b₁ + a₂b₂ + a₃b₃)² ≤ (a₁² + a₂² + a₃²)(b₁² + b₂² + b₃²)", "Dấu bằng ⇔ (a₁; a₂; a₃) và (b₁; b₂; b₃) tỉ lệ"], dk: "Đúng với mọi số thực.", gc: "Dạng vectơ: |u·v| ≤ |u|·|v|." },
        { ten: "Bất đẳng thức cộng mẫu (Engel)", ct: ["a²/x + b²/y ≥ (a + b)²/(x + y)", "a²/x + b²/y + c²/z ≥ (a + b + c)²/(x + y + z)", "1/x + 1/y ≥ 4/(x + y)"], dk: "x, y, z > 0; a, b, c thực.", gc: "Dấu bằng ⇔ a/x = b/y (= c/z)." },
        { ten: "Một số bất đẳng thức hay dùng", ct: ["a² + b² ≥ 2ab; (a + b)² ≥ 4ab", "a² + b² + c² ≥ ab + bc + ca; (a + b + c)² ≥ 3(ab + bc + ca)", "|a| + |b| ≥ |a + b|, dấu bằng ⇔ ab ≥ 0", "(1 + x)ⁿ ≥ 1 + nx (Bernoulli)"], dk: "Ba dòng đầu đúng với mọi số thực; Bernoulli cần x ≥ −1 và n nguyên dương." }
      ] },
    { ten: "Dãy số và toán tài chính",
      muc: [
        { ten: "Tổng các lũy thừa", ct: ["1 + 2 + … + n = n(n + 1)/2", "1² + 2² + … + n² = n(n + 1)(2n + 1)/6", "1³ + 2³ + … + n³ = [n(n + 1)/2]²", "1 + 3 + 5 + … + (2n − 1) = n²", "1/(1·2) + 1/(2·3) + … + 1/(n(n + 1)) = n/(n + 1)"], dk: "n nguyên dương.", gc: "Tự luận nên chứng minh bằng quy nạp hoặc tách 1/(k(k + 1)) = 1/k − 1/(k + 1)." },
        { ten: "Dãy truy hồi uₙ₊₁ = a·uₙ + b", ct: ["Đặt c = b/(1 − a): uₙ = (u₁ − c)·aⁿ⁻¹ + c", "Dãy vₙ = uₙ − c là cấp số nhân công bội a"], dk: "a ≠ 1 (a = 1 thì uₙ là cấp số cộng công sai b)." },
        { ten: "Lãi kép nhiều kì trong năm và lãi kép liên tục", ct: ["Lãi suất năm r, chia m kì mỗi năm: sau n năm có A(1 + r/m)^(m·n)", "Lãi kép liên tục: sau t năm có A·e^(r·t)", "Số kì tối thiểu để A(1 + r)ⁿ ≥ B: n là số nguyên nhỏ nhất ≥ ln(B/A)/ln(1 + r)"], dk: "r là lãi suất dạng thập phân, lãi nhập gốc mỗi kì, không rút tiền giữa chừng." },
        { ten: "Gửi tiền đều đặn mỗi kì", ct: ["Gửi a đồng vào đầu mỗi kì: cuối kì thứ n có T = a(1 + r)[(1 + r)ⁿ − 1]/r", "Gửi a đồng vào cuối mỗi kì: ngay sau lần gửi thứ n có T = a[(1 + r)ⁿ − 1]/r"], dk: "Lãi suất r mỗi kì không đổi, lãi kép, số tiền gửi mỗi kì bằng nhau.", gc: "Đề bài hay khác nhau ở mốc gửi (đầu hay cuối kì); đọc kĩ trước khi dùng." },
        { ten: "Vay trả góp", ct: ["Vay A, lãi r mỗi kì, cuối mỗi kì trả a: sau n kì còn nợ A(1 + r)ⁿ − a[(1 + r)ⁿ − 1]/r", "Trả hết đúng sau n kì: a = A·r(1 + r)ⁿ/[(1 + r)ⁿ − 1]"], dk: "Lãi tính trên dư nợ, kì trả đầu tiên cách thời điểm vay đúng một kì." },
        { ten: "Tăng trưởng mũ và phân rã phóng xạ", ct: ["N(t) = N₀·e^(r·t) (r > 0 tăng, r < 0 giảm)", "Chu kì bán rã T: m(t) = m₀·(1/2)^(t/T)", "Thời gian nhân đôi: t = ln 2/r"], dk: "Đại lượng thay đổi với tốc độ tỉ lệ với chính nó (mô hình mũ)." }
      ] },
    { ten: "Tổ hợp và xác suất",
      muc: [
        { ten: "Nhị thức Newton tổng quát", ct: ["(a + b)ⁿ = Cₙ⁰aⁿ + Cₙ¹aⁿ⁻¹b + … + Cₙᵏaⁿ⁻ᵏbᵏ + … + Cₙⁿbⁿ", "Số hạng thứ k + 1: Tₖ₊₁ = Cₙᵏ·aⁿ⁻ᵏ·bᵏ", "Khai triển có n + 1 số hạng; các hệ số cách đều hai đầu bằng nhau"], dk: "n nguyên dương; sách giáo khoa lớp 10 chỉ học n ≤ 5." },
        { ten: "Tổng các số tổ hợp", ct: ["Cₙ⁰ + Cₙ¹ + … + Cₙⁿ = 2ⁿ", "Cₙ⁰ − Cₙ¹ + Cₙ² − … + (−1)ⁿCₙⁿ = 0", "Cₙ⁰ + Cₙ² + Cₙ⁴ + … = Cₙ¹ + Cₙ³ + Cₙ⁵ + … = 2ⁿ⁻¹", "1·Cₙ¹ + 2·Cₙ² + … + n·Cₙⁿ = n·2ⁿ⁻¹"], dk: "n nguyên dương.", gc: "Có được bằng cách thay x = 1, x = −1 vào (1 + x)ⁿ, hoặc lấy đạo hàm rồi thay x = 1." },
        { ten: "Chia kẹo Euler", ct: ["Số nghiệm nguyên dương của x₁ + x₂ + … + xₖ = n là Cₙ₋₁ᵏ⁻¹", "Số nghiệm nguyên không âm của x₁ + x₂ + … + xₖ = n là Cₙ₊ₖ₋₁ᵏ⁻¹"], dk: "n, k nguyên dương; dòng 1 cần n ≥ k.", gc: "Ý tưởng: đặt k − 1 vách ngăn vào n − 1 khe giữa n viên kẹo." },
        { ten: "Hoán vị vòng quanh và hoán vị lặp", ct: ["Xếp n người quanh bàn tròn (chỉ tính vị trí tương đối): (n − 1)! cách", "Xếp n phần tử gồm n₁ phần tử loại 1, …, nₖ phần tử loại k (giống nhau trong mỗi loại): n!/(n₁!·n₂!·…·nₖ!) cách"], dk: "Bàn tròn: hai cách xếp chỉ khác nhau bởi phép xoay coi là một; n₁ + … + nₖ = n." },
        { ten: "Chọn các số không liên tiếp", ct: ["Số cách chọn k số từ {1; 2; …; n} sao cho không có hai số nào liên tiếp là Cₙ₋ₖ₊₁ᵏ"], dk: "n − k + 1 ≥ k.", gc: "Cùng ý tưởng: xếp k người không ai đứng cạnh nhau vào hàng n − k người còn lại có Cₙ₋ₖ₊₁ᵏ cách chọn chỗ (chưa tính hoán vị)." },
        { ten: "Phép thử lặp Bernoulli", ct: ["P(đúng k lần thành công trong n lần) = Cₙᵏ·pᵏ·(1 − p)ⁿ⁻ᵏ", "P(ít nhất k lần) = tổng các xác suất ứng với k, k + 1, …, n"], dk: "n lần thử độc lập, mỗi lần thành công với cùng xác suất p.", gc: "Hay gặp trong bài làm trắc nghiệm ngẫu nhiên, bắn bia nhiều lần." },
        { ten: "Xác suất toàn phần và Bayes với nhiều trường hợp", ct: ["P(A) = P(B₁)·P(A | B₁) + P(B₂)·P(A | B₂) + … + P(Bₙ)·P(A | Bₙ)", "P(Bₖ | A) = P(Bₖ)·P(A | Bₖ)/P(A)"], dk: "B₁, …, Bₙ đôi một xung khắc, hợp lại là Ω, P(Bᵢ) > 0; P(A) > 0.", gc: "Sách giáo khoa chỉ xét hai trường hợp B và B̄; cách làm với nhiều nhánh cây là như nhau." }
      ] }
  ]
};
