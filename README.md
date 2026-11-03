# Hành Khách Trùng Sinh · Prototype 02

Prototype UI/UX và gameplay cốt lõi theo yêu cầu ngày 03/11/2026. Toàn bộ mã chạy nằm trong **index.html**: HTML5, CSS3, Vanilla JavaScript và SVG inline. Không cần thư viện, CDN, mạng, cài đặt hoặc build.

## Mở và chơi

Mở `index.html` bằng trình duyệt. Bấm **Vào Hành Trình / Chiến Đấu** tại Trang chủ.

Nếu muốn dùng localhost, chạy từ thư mục dự án:

```sh
python3 -m http.server 5173 --bind 127.0.0.1
```

Mở <http://127.0.0.1:5173>. Mỗi địa chỉ và trình duyệt lưu tiến trình riêng.

## Cách thao tác

- **Chạm vật phẩm:** xem chi tiết, xoay 90°, đưa về khay, bán hoặc chọn ô đích bằng nút.
- **Kéo từ 6 px:** kéo thả bằng chuột hoặc cảm ứng. Đồ từ khay dùng ô trên trái làm mốc đặt.
- **Preview xanh:** vị trí trống hợp lệ. **Hổ phách:** cùng loại và cùng Tier I/II, thả để ghép. **Đỏ:** va chạm, vượt biên hoặc không thể ghép, thả để trả về.
- **Hợp nhất:** tối đa Tier III, giữ hướng của món đích, kế thừa tiến độ hồi chiêu thấp hơn.
- **Shop:** ba ô mua bằng Bạc, đổi hàng giá 10 Bạc. Khóa Shop giữ các ô hàng qua vòng tiếp theo, kể cả ô đã bán hết.
- **Bán:** kéo món từ lưới hoặc khay vào vùng bán. Có nút bán trong bảng chi tiết làm cách thao tác thay thế.
- **Xuất phát:** khóa chỉnh sửa lưới, khay và Shop; trang bị tự gây sát thương, tạo giáp, hồi máu hoặc tăng tốc. Nút ×1/×2 điều khiển tốc độ mô phỏng.
- **Kết quả:** thắng nhận thưởng, tiếp tế và chuẩn bị vòng sau; thua được sắp xếp lại và chơi lại đúng vòng đó. Boss xuất hiện ở vòng 5.

## Giao diện

- Desktop: khung 390×844, tối đa chiều cao cửa sổ.
- Mobile: khớp chiều rộng và 100dvh. Màn chiến đấu không cuộn.
- Năm vùng ở 390×844: HUD 48 px, sân đấu 210 px, lưới 280 px, khay/Shop 190 px, hành động 116 px.
- Tất cả con số dùng `tabular-nums`.
- Sáu loại: Linh kiếm, Xuyên Vân Nỏ, Huyền Thiết Thuẫn, Bình Hồi Xuân, Tật Phong Phù và Thanh Tâm Đỉnh.
- Năm tab ngoài trận: Trang chủ, Thương lộ, Hòm tiêu, Luyện khí, Bảo rương.
- Nâng cấp chỉ số gốc, đột phá bằng Linh thạch và ba loại rương đều tương tác được; số liệu đang dùng để thử nghiệm.

## Dev Drawer

Bấm **⚙ Dev** để mở bảng điều khiển. Có chuyển chế độ, +500 Bạc, sinh đồ vào khay, tăng Tier toàn bộ đồ trên lưới, thắng/thua ngay, mô phỏng Auto Farm thêm một giờ và reset lưới.

Reset lưới chuyển vật phẩm về khay và trả vòng về pha chuẩn bị; không xóa tài nguyên. Đặt lại toàn bộ demo có xác nhận riêng. Các thao tác Dev có thể bỏ qua giới hạn thông thường của giao chiến.

## Lưu tiến trình và Auto Farm

Tự lưu Bạc, Linh thạch, Linh sa, mảnh, cấu hình Loadout, cấp nâng, đột phá, stage đã vượt và Auto Farm trong localStorage. Bản lưu mới dùng khóa `hanh-khach-ui-v2`, giữ nguyên bản lưu prototype cũ.

Auto Farm chỉ chạy stage đã thắng boss, thưởng Bạc/nguyên liệu/mảnh, tối đa 12 giờ, tích lũy cả online và offline. Đổi cấu hình chốt thưởng theo hiệu suất cũ trước khi áp dụng cấu hình mới. Nhận quà không phát lại thưởng cũ.

Lượt đang chơi, Tier ghép, vật phẩm trong khay, hàng Shop và kết quả rương đưa vào khay được đặt lại khi tải trang. Đây là prototype cục bộ, chưa có backend hoặc đồng bộ nhiều tab/thiết bị. Auto Farm dùng đồng hồ thiết bị. Bối cảnh chiến trường dùng chung; boss có hình dạng khác nhau theo vùng. Âm thanh và bộ animation sản xuất chưa nằm trong bản này.

## Kiểm thử

```sh
node --test tests/game.test.cjs
```

23 kiểm thử đọc trực tiếp engine trong `index.html`: diện tích/va chạm, ghép, xoay, biên lưới, khóa chiến đấu, Shop, bán, giáp/hồi máu/tăng tốc, thắng/thua, phần thưởng, Auto Farm và đột phá.
