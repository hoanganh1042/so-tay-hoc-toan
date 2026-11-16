# Hướng dẫn soạn nội dung

Mọi lệnh dưới đây chạy từ thư mục gốc của kho mã. Trên Windows dùng `py -I` thay cho `python`.

## Nguyên tắc

1. **Tự soạn.** Không chép nguyên văn sách giáo khoa, sách bài tập hay đề thi. Được xem đề để lấy dạng bài, sau đó đổi số liệu, đổi bối cảnh, tự viết lời văn và ghi tên nguồn gợi ý dạng bài.
2. **Tự vẽ hình.** Hình minh họa là SVG do mã sinh ra (`content/hinh_nguon.py`), không dùng ảnh chụp hay hình sao chép.
3. **Đáp án do chương trình tính.** Bài tập mới viết trong bộ sinh Python, đáp án lấy từ phép tính, không gõ tay.
4. **Toán viết bằng ký tự Unicode**: `x²`, `√(a² + b²)`, `∫ₐᵇ`, dấu trừ `−`, dấu thập phân là dấu phẩy. Không dùng LaTeX, không dùng HTML.
5. **Không xóa, không đổi chỗ câu đã phát hành.** Khóa câu phụ thuộc vị trí; đổi chỗ sẽ gắn nhầm kết quả cũ của học sinh. Xem [DATA_MODEL.md](DATA_MODEL.md).

## Thêm bài tập

| Việc | Sửa ở đâu | Lệnh |
|---|---|---|
| Bài toán thực tế | `content/thucte_nguon.py` | `python content/thucte_nguon.py` |
| Bài cho đề theo chương | `content/chuong_nguon.py` | `python content/chuong_nguon.py` |
| Bài bổ sung có hình | `content/bosung_nguon.py`, `content/hinh_bosung.py` | chạy lần lượt hai tệp |
| Lời giải viết tay | `content/<lớp>*.txt` | (không cần lệnh riêng) |

Sau khi sửa, luôn chạy:

```bash
python content/build.py     # gom lời giải thành web/loigiai_*.js
npm run check               # mọi câu có lời giải, bước cuối khớp đáp án; công thức đúng
npm test                    # cấu trúc nội dung, bảo mật, lớp lưu trữ
```

### Cú pháp tệp lời giải

```text
# 12-I-1#3
h Tìm cực tiểu bằng bảng biến thiên.
y y' đổi dấu từ − sang + tại điểm cực tiểu.
b y' = 3x² − 6x = 0 ⇔ x = 0 hoặc x = 2.
b Đáp án: −2
```

`#` mở lời giải cho một khóa câu; `h` là hướng đi; `y` là ý kiến thức (một hoặc nhiều dòng); `b` là các bước. Dòng `b` cuối phải đúng dạng `Đáp án: <đáp án>` với trắc nghiệm và trả lời ngắn, `Kết luận: a Đúng, b Sai, c Đúng, d Sai.` với câu đúng/sai.

## Thêm hình

Trong bộ sinh hình, mỗi hình là một hàm trả về SVG gắn với khóa câu. Lớp `Fig` tự né nhãn đè lên nét và tự co khung. Hình chỉ dùng các lớp CSS có sẵn của app và không có mã chạy được. Sau khi sinh, mở app và xem hình ở cả giao diện sáng và tối.

## Thêm công thức

Sửa `web/congthuc.js`. Mỗi chương là một phần tử của `cb`, mỗi chủ đề nâng cao là một phần tử của `nc`. Mục nâng cao bắt buộc có `dk` (điều kiện) hoặc `gc` (ghi chú áp dụng). Công thức nào tính được bằng số thì thêm phép thử vào `tools/kiemtra_congthuc.js`.

## Phát hành

1. Tăng `VER` trong `web/sw.js`.
2. `python tools/dong_goi.py` tạo `ban_phat_hanh/` (bản web, tệp nén, bản một tệp).
3. Triển khai thư mục `web/`.
