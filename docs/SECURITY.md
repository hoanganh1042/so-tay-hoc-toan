# Bảo mật và quyền riêng tư

Tài liệu này mô tả những gì ứng dụng bảo vệ, bảo vệ bằng cách nào, và những gì nằm ngoài phạm vi. Cách báo lỗ hổng xem [SECURITY.md](../SECURITY.md) ở thư mục gốc.

## Dữ liệu cần bảo vệ

Người dùng là học sinh THPT, phần lớn dưới 18 tuổi. Ứng dụng lưu:

- lớp, bộ sách, các chương đã học;
- câu trả lời phiếu thói quen học (giờ tự học, cách ôn, áp lực, học thêm, dùng AI);
- kết quả từng câu, lịch ôn lại, sổ lỗi sai, điểm các lần làm đề, nhật ký thời điểm làm bài.

Ứng dụng **không** hỏi và không lưu họ tên, lớp cụ thể, trường, thư điện tử, số điện thoại hay bất kỳ mã định danh nào. Tất cả nằm trong trình duyệt của học sinh (IndexedDB và localStorage). Ứng dụng không có mã nào gửi dữ liệu ra ngoài: không `fetch` tới máy chủ khác, không công cụ đo lường, không cookie.

Phông chữ (Be Vietnam Pro, giấy phép OFL) được phát từ chính ứng dụng, nên khi mở trang ứng dụng không gửi yêu cầu nào tới bên thứ ba. Liên kết YouTube và liên kết nguồn đề chỉ mở khi học sinh bấm, và trang đặt `Referrer-Policy: no-referrer`.

## Mô hình đe dọa

| Tình huống | Đánh giá | Biện pháp |
|---|---|---|
| Kẻ tấn công từ xa gửi liên kết độc hại | Phần `#...` của địa chỉ chỉ dùng để chọn màn hình và tra mã chương bằng kiểm tra sở hữu; không bao giờ được chèn vào trang | Kiểm thử, CSP |
| Dữ liệu trong máy bị sửa (tiện ích trình duyệt, trang khác cùng nguồn gốc, máy dùng chung) | Rủi ro chính. Giao diện dựng bằng chuỗi HTML nên dữ liệu bẩn có thể thành mã chạy được nếu không chặn | `sanitize()` trong `db.js`, đối chiếu nội dung trong `checkState()`, ép kiểu tại chỗ chèn, CSP chặn mã nội tuyến |
| Tệp sao lưu độc hại do người khác gửi | Tương tự dòng trên, đi qua cùng một đường làm sạch | Giới hạn 5 MB, kiểm tra `app` và `schema`, `sanitize()` |
| Dữ liệu hỏng làm app không mở được | Từng xảy ra khi rà soát | `route()` bắt lỗi và hiện màn hình khôi phục có nút xuất tệp và xóa dữ liệu |
| Nội dung bị sửa trên đường truyền | Máy chủ chỉ phục vụ qua HTTPS, có HSTS | Cấu hình máy chủ |
| Trang khác nhúng app vào khung để lừa bấm | Trên GitHub Pages không đặt được `frame-ancestors`; nút xóa dữ liệu cần bấm hai lần nên lừa bấm một lần không xóa được gì | Nút hai bước; `netlify.toml` nếu triển khai trên Netlify |
| Người đóng góp chèn mã vào tệp dữ liệu hoặc hình SVG | Tệp dữ liệu là mã JavaScript và hình được chèn nguyên văn, nên phải duyệt kỹ mọi thay đổi | Kiểm thử chặn `<script>`, `on...=`, `javascript:`, `<foreignObject>` trong hình; duyệt mã trước khi gộp |

Ngoài phạm vi: người có quyền dùng máy và mở công cụ lập trình của trình duyệt luôn đọc và sửa được dữ liệu của chính trình duyệt đó. Ứng dụng không mã hóa dữ liệu lưu trên máy.

## Các lớp bảo vệ

### 1. Chính sách bảo mật nội dung (CSP)

```
default-src 'self'; script-src 'self'; style-src 'self';
style-src-attr 'unsafe-inline'; font-src 'self'; img-src 'self' data:;
connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
```

- Chỉ chạy mã từ các tệp của chính trang. Không có mã nội tuyến, không có `on...=`, không `eval`. Vì vậy kể cả khi một chuỗi bẩn lọt vào trang, trình duyệt không chạy nó.
- `style-src-attr 'unsafe-inline'` là thỏa hiệp duy nhất: thanh tiến độ và độ rộng hình vẽ dùng thuộc tính `style`. Thuộc tính kiểu dáng không chạy được mã.
- Chính sách có ở hai nơi: thẻ `<meta>` trong trang (áp dụng ở mọi máy chủ) và tiêu đề HTTP trong `netlify.toml` (thêm `frame-ancestors`). Kiểm thử bảo đảm hai nơi trùng nhau.
- Bản một tệp nhúng mã vào trang; `tools/dong_goi.py` thay `'self'` bằng mã băm SHA-256 của từng khối, nên bản đó cũng không cần `unsafe-inline` cho mã.

### 2. Không tin dữ liệu đã lưu

1. `sanitize()` (`web/db.js`): danh sách trắng theo trường, kiểu, khoảng giá trị và khuôn khóa. Chạy với mọi dữ liệu đọc từ IndexedDB, localStorage và tệp sao lưu.
2. `checkState()` (`web/app.js`): mã chương, mã bài, khóa câu, loại lỗi, kiểu đề phải tồn tại trong nội dung của app.
3. Tại chỗ chèn vào trang: văn bản qua `esc()`, số được ép kiểu trước khi định dạng.
4. Tra bảng theo khóa từ bên ngoài dùng kiểm tra sở hữu, không dính thuộc tính kế thừa như `constructor`.

### 3. Tiêu đề HTTP (chỉ khi triển khai trên Netlify)

`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy` tắt camera, micro, vị trí, thanh toán, `Cross-Origin-Opener-Policy: same-origin`, `Strict-Transport-Security`.

### 4. Service worker

Chỉ xử lý yêu cầu GET cùng nguồn gốc (kể cả phông chữ tự lưu); yêu cầu tới nguồn khác được bỏ qua; chỉ lưu phản hồi thành công, không lưu phản hồi chuyển hướng; không có `importScripts`, không nhận thông điệp từ trang.

### 5. Kho mã

- `.gitignore` loại báo cáo, dữ liệu khảo sát, đề tham khảo, tệp cấu hình cục bộ.
- `tests/static.test.js` quét kho tìm token, khóa bí mật, thư điện tử cá nhân, đường dẫn thư mục người dùng.
- GitHub Actions chạy với quyền chỉ đọc và không giữ thông tin đăng nhập sau bước lấy mã.
- Dự án không có phụ thuộc bên thứ ba nào (không `node_modules`), nên không có rủi ro chuỗi cung ứng từ gói ngoài.

## Giới hạn còn lại

- **Phông chữ bên thứ ba.** Đã xử lý: phông Be Vietnam Pro được lưu trong `web/fonts/` và CSP đặt `font-src 'self'`, nên ứng dụng không còn kết nối nào ra ngoài khi mở trang.
- **Nguồn gốc dùng chung.** Nếu đặt app ở `ten.github.io/kho/`, mọi trang khác của cùng tài khoản GitHub dùng chung nguồn gốc và đọc, ghi được dữ liệu của app. Nên dùng tên miền con riêng (như bản Netlify hiện tại).
- **GitHub Pages không đặt được tiêu đề HTTP**, nên bản chính chỉ có lớp CSP trong thẻ `<meta>`, không có `frame-ancestors`, `X-Frame-Options`, `Permissions-Policy`. GitHub Pages vẫn bắt buộc HTTPS.
- **Nguồn gốc của bản chính** là `hoanganh1042.github.io`. Hiện tài khoản này không có trang Pages nào khác; nếu sau này thêm, các trang đó dùng chung nguồn gốc với app (xem dòng trên).
- **Dữ liệu không mã hóa** trên máy và trong tệp sao lưu. Tệp sao lưu chứa câu trả lời phiếu thói quen; học sinh nên giữ tệp cho riêng mình.
- **Chưa có kiểm thử tự động trên trình duyệt thật** cho IndexedDB; phần này được kiểm tra bằng tay.
