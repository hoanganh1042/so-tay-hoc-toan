# Chính sách bảo mật

## Báo lỗ hổng

Nếu bạn tìm thấy lỗ hổng bảo mật hoặc cách làm lộ dữ liệu của học sinh, vui lòng **không mở issue công khai**. Hãy dùng mục **Security → Report a vulnerability** của kho mã này trên GitHub (báo cáo riêng tư).

Trong báo cáo nên có: phiên bản hoặc địa chỉ trang bạn thử, các bước tái hiện, và tác động bạn thấy. Nhóm sẽ phản hồi trong vòng 7 ngày.

## Phạm vi

Trong phạm vi: mã trong `web/`, cấu hình triển khai (`.github/workflows/`, `netlify.toml`), công cụ trong `tools/` và `content/`.

Ngoài phạm vi: việc người có quyền dùng máy tự sửa dữ liệu trong trình duyệt của chính họ, và các dịch vụ bên thứ ba (GitHub Pages, Netlify).

## Thiết kế

Ứng dụng không có máy chủ và không thu thập dữ liệu cá nhân. Mô hình đe dọa và các lớp bảo vệ được mô tả ở [docs/SECURITY.md](docs/SECURITY.md).
