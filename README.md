# Sổ tay học Toán

Web app giúp học sinh lớp 11 và 12 tự tìm ra bài học mình đang hổng, ôn đúng bài đó, rồi tự kiểm tra bằng đề thi thử tốt nghiệp THPT theo cấu trúc mới. Sản phẩm của đề tài nghiên cứu khoa học học sinh, Trường THPT Lagi, năm 2026.

**Dùng thử:** <https://so-tay-hoc-toan-lagi.netlify.app>

Ứng dụng chạy hoàn toàn trên trình duyệt: không cần tài khoản, không có máy chủ, không thu thập họ tên. Mở một lần khi có mạng, sau đó dùng được cả khi mất mạng.

## Tính năng

| Mục | Làm gì |
|---|---|
| **Chẩn đoán** | Chọn bộ sách, lớp và các chương đã học; trả lời phiếu thói quen học; mỗi bài học làm 1 câu để tìm bài đang hổng |
| **Sổ tay** | Bản đồ lỗ hổng theo bài, lộ trình ôn 4 tuần, gợi ý cá nhân theo 10 luật, sổ lỗi sai, thống kê 7 ngày, sao lưu dữ liệu |
| **Ôn tập** | Bài tập theo ba mức nhận biết, thông hiểu, vận dụng; chấm ngay; lời giải ba lớp (hướng đi, ý kiến thức, các bước); ôn lại giãn cách sau 1, 3, 7 ngày |
| **Công thức** | Công thức trong chương trình theo từng chương lớp 10–12 và một phần nâng cao riêng; tìm kiếm không cần gõ dấu |
| **Đề thi** | Đề tốt nghiệp 22 câu theo ma trận đề thật ở bốn mức, đề riêng cho từng chương, chấm theo cách tính điểm của Bộ GD&ĐT |

Nội dung theo Chương trình giáo dục phổ thông 2018, đối chiếu được với ba bộ sách: Kết nối tri thức với cuộc sống, Chân trời sáng tạo, Cánh diều.

## Chạy trên máy

Cần Python 3 (để chạy máy chủ tệp tĩnh và các bộ sinh) và Node.js 20 trở lên (để kiểm thử). Không cần cài thêm gói nào.

```bash
git clone <địa chỉ kho mã>
cd so-tay-hoc-toan
npm run serve          # mở http://localhost:8765
```

```bash
npm test               # kiểm thử tự động
npm run check          # kiểm tra lời giải và công thức
npm run package        # tạo thư mục ban_phat_hanh/
```

## Cấu trúc kho mã

```text
web/        ứng dụng (đưa nguyên thư mục này lên máy chủ tệp tĩnh là chạy)
content/    nguồn nội dung: lời giải dạng văn bản, bộ sinh bài tập và hình vẽ
tools/      kiểm tra nội dung, đóng gói bản phát hành
tests/      kiểm thử tự động
docs/       tài liệu thiết kế
```

## Tài liệu

- [Kiến trúc hệ thống](docs/ARCHITECTURE.md): các thành phần, luồng chạy, chiến lược ngoại tuyến, hướng mở rộng.
- [Mô hình dữ liệu](docs/DATA_MODEL.md): cấu trúc nội dung, lược đồ IndexedDB, định dạng tệp sao lưu.
- [Bảo mật và quyền riêng tư](docs/SECURITY.md): mô hình đe dọa, CSP, làm sạch dữ liệu, giới hạn còn lại.
- [Hướng dẫn soạn nội dung](docs/CONTENT.md): thêm bài tập, lời giải, hình, công thức.

## Triển khai

Trang là web tĩnh, không có bước build. `netlify.toml` khai báo thư mục phát hành là `web/` cùng các tiêu đề bảo mật. Với máy chủ khác, chỉ cần phục vụ thư mục `web/` qua HTTPS.

Mỗi lần phát hành, tăng hằng số `VER` trong `web/sw.js` để máy học sinh nhận bản mới.

## Đóng góp

Báo lỗi nội dung (đáp án sai, lời giải khó hiểu, hình không khớp đề) hoặc lỗi ứng dụng bằng cách mở issue. Nếu gửi thay đổi, hãy chạy `npm test` và `npm run check` trước. Lỗ hổng bảo mật xin báo riêng theo [SECURITY.md](SECURITY.md).

Lưu ý: câu hỏi và bài tập do học sinh tự soạn, **chưa được giáo viên thẩm định**.

## Giấy phép

- Mã nguồn: [MIT](LICENSE).
- Nội dung học tập (câu hỏi, lời giải, hình, công thức): [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).
