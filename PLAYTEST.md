# Chơi thử đợt 1 — Stage 2

Vào **Trang chủ → Chơi thử · 6 cấu hình stage 2**. Đây là sáu lượt do người chơi thực hiện, không phải sáu lượt đã hoàn thành bởi bộ mô phỏng.

## Điều kiện

| Cấu hình | Balo | Stage | Điều kiện chung |
| --- | --- | --- | --- |
| Tấn công | 3×3 | Phế Tích Cơ Quan | Seed 57241; không skin / luyện khí / đột phá |
| Tấn công | 5×5 | Phế Tích Cơ Quan | Như trên |
| Cân bằng | 3×3 | Phế Tích Cơ Quan | Như trên |
| Cân bằng | 5×5 | Phế Tích Cơ Quan | Như trên |
| Tăng tốc | 3×3 | Phế Tích Cơ Quan | Như trên |
| Tăng tốc | 5×5 | Phế Tích Cơ Quan | Như trên |

Mỗi lượt tạo hồ sơ thử riêng: 30 năng lượng, 320 Bạc, 25 Linh thạch, 12 Linh sa; Lộ phí đầu chuyến 60. Nâng cấp và skin của tài khoản thật không tham gia. Balo thử không cần mua. Không truy cập nâng cấp, rương, Dev hoặc đổi Loadout giữa lượt; vẫn được mua năng lượng bằng tài nguyên của hồ sơ thử. Giữ nguyên quy tắc tiêu 5 năng lượng mỗi lần xuất phát, Shop, khay 12 món, tiếp tế, hồi giữa vòng và ghép.

Seed giống nhau không bảo đảm mọi món nhận đều giống nhau: Loadout và các quyết định như đổi Shop làm chuỗi lấy số ngẫu nhiên khác nhau. Kết quả so sánh cần đọc cả nhật ký lựa chọn. Thử đảo thứ tự các cấu hình ở lần lặp để giảm ảnh hưởng của việc quen game; không suy ra cân bằng từ một lượt mỗi cấu hình.

## Cách chạy một lượt

1. Chọn cấu hình, đọc điều kiện rồi bấm **Bắt đầu đo**. Thời gian bắt đầu từ lúc vào chuẩn bị, không tính màn chọn cấu hình.
2. Chơi ở ×1, sắp xếp và chọn đồ theo phán đoán của mình. Không cần cố kéo dài chuyến để đạt 3–5 phút.
3. Trong giao chiến, bấm **Ⅱ Tạm dừng → Tiếp tục** để nghỉ rồi đánh tiếp; chọn **Về nhật ký lượt thử** nếu muốn ra trang chơi thử. Ở pha chuẩn bị, mũi tên về mở trang chơi thử. Chuyến dừng thật, giữ HP/cooldown/năng lượng; tiếp tục không thu thêm năng lượng.
4. Khi thua, có thể chuẩn bị lại và xuất phát tiếp hoặc **Kết thúc lượt thử sau thua**. Nhật ký giữ mọi lần đánh; thử lại không đặt thời gian chuyến về 0.
5. Khi thắng boss, thời gian dừng ngay. Bấm **Xem nhật ký toàn chuyến → Ghi nhận xét**, trả lời hai câu hỏi và bấm **Lưu nhận xét**. Nút **Xuất nhật ký JSON** xuất hiện ngay dưới nút lưu. Tài khoản cùng chuyến thật được trả lại.
6. Xuất JSON sau mỗi nhóm lượt nếu cần lưu lâu dài. Chỉ lưu 30 báo cáo gần nhất trong trình duyệt; không tự gửi đến máy chủ hoặc bên thứ ba.

Chế độ **Lượt kiểm tra kỹ thuật** dành cho QA: các báo cáo vẫn đọc/xuất được nhưng không tham gia tổng hợp. Không dùng QA như dữ liệu người chơi để kết luận độ vui.

## Bước 12 — Đợt thu thập đã chốt A/A/A

Người chơi thực hiện sáu cấu hình và gửi JSON. Ưu tiên phân tích nguồn tiếp tế và áp lực diện tích. Nếu dữ liệu cho thấy balo lớn thiếu lựa chọn đáng cân nhắc, thử điều chỉnh cấu trúc gói tiếp tế trước; giữ nguyên hệ số ghép trong đợt sửa đó. Hiện chưa thay thông số và chưa có kết luận cân bằng.

### Thứ tự chơi đề xuất

1. Tấn công · 3×3.
2. Tấn công · 5×5.
3. Cân bằng · 5×5.
4. Cân bằng · 3×3.
5. Tăng tốc · 3×3.
6. Tăng tốc · 5×5.

Đảo thứ tự kích thước ở cặp Cân bằng để giảm việc luôn thử balo lớn sau khi đã quen balo nhỏ; đây vẫn chỉ là đợt thăm dò, chưa loại hết ảnh hưởng học chơi. Nếu lặp cả đợt, đảo thứ tự sáu lượt. Không cần thắng đủ sáu chuyến: thua và chủ động dừng cũng là dữ liệu cần giữ. Có thể nghỉ giữa các lượt và xuất bản sao sau mỗi cặp.

### Ghi nhận tự nhiên

Chơi như bình thường ở ×1, để trống ô **Lượt kiểm tra kỹ thuật**. Không cố ghép, bán hay kéo dài thời gian cho đủ chỉ tiêu. Trong hai ô nhận xét có sẵn, ghi ngắn nếu nhớ được:

- Vòng nào khiến bạn phải cân nhắc; đã chọn gì và vì sao? Nếu không có quyết định khó, ghi đúng như vậy.
- Có món muốn dùng nhưng không đặt được không? Nếu có, nêu món và lý do: thiếu ô, hình dạng, hoặc phải bỏ món khác.
- Nếu chơi lại, bạn đổi gói tiếp tế/đội hình/cách ghép nào? Có thể ghi “chưa biết”.

Không cần dừng liên tục để ghi chép hoặc làm theo một chiến thuật được gợi sẵn. Thắng boss mở **Xem nhật ký toàn chuyến**; khi thua có thể thử lại hoặc chọn **Kết thúc lượt thử sau thua**. Muốn dừng ở pha khác: **Ⅱ → Kết thúc lượt thử → Kết thúc và ghi nhận xét**. Điền hai ô rồi bấm **Lưu nhận xét**. Cần nghỉ giữa chuyến thì dùng **Ⅱ**, không tải lại trang vì chuyến thử chưa được khôi phục sau reload.

### Xuất và gửi

Sau khi lưu nhận xét, bấm **Xuất nhật ký JSON** ngay trong báo cáo. Bạn cũng có thể dùng nút cùng tên ở mục **Nhật ký đã lưu** trên trang **Chơi thử · 6 cấu hình stage 2**. File có dạng `pack-brawler-playtest-YYYY-MM-DD.json`, nằm trong thư mục tải xuống của trình duyệt (thường là Downloads). Một file chứa toàn bộ nhật ký đang giữ, không chỉ báo cáo đang chọn; không phải xuất sáu file riêng. Các bản tải lặp có thể thêm `(1)`, `(2)` vào tên.

Sau khi lưu nhận xét của lượt cuối, xuất một file mới và đính kèm file đó vào cuộc trò chuyện này. Giữ nguyên nội dung JSON; các lượt QA cũ hoặc gián đoạn sẽ được phân loại khi phân tích. Dùng cùng trình duyệt và cùng địa chỉ trong cả đợt vì `localhost`, `127.0.0.1` và mở file trực tiếp có bộ nhớ riêng.

Khi nhận dữ liệu, đối chiếu từng cặp cùng Loadout: lựa chọn tiếp tế, giữ đôi/ghép, độ kín balo, đồ nằm khay, thao tác bán, kết quả, thời gian và nhận xét. Không suy ra thiếu chiều sâu chỉ từ ít thao tác hoặc ít ô sử dụng. Trước khi sửa, ghi bằng chứng, giả thuyết và cấu trúc gói trước/sau; sau sửa chơi lại cùng cấu hình. Nếu bằng chứng chưa đủ, chỉ yêu cầu bổ sung lượt liên quan. Tiến độ cơ chế vẫn khoảng 95%; đợt thu thập chưa hoàn tất chỉ vì đã chuẩn bị hướng dẫn.

## Thời gian và chỉ số

- **Hoạt động:** chuẩn bị/sắp xếp + đánh ×1/×2 + chọn tiếp tế + xem kết quả/nghĩ cách thử lại giữa vòng. Gồm các lần thử lại trong cùng lượt.
- **Loại trừ:** tạm dừng/xem ngoài trận, trang bị ẩn, xem/chờ/mua năng lượng và khoảng không nhận nhịp đo ở tiền cảnh trên 2 giây. Khoảng trống lớn được gắn cờ để tránh coi treo máy hoặc sleep là thời gian suy nghĩ.
- **Đánh theo mô phỏng:** tổng duration của các lần đánh đã kết thúc. Giữ riêng với thời gian thực; không nhân thời gian thực ×2 để giả định thành ×1. Lần đánh còn dang dở chưa có duration trong tổng mô phỏng, nhưng thời gian thực đã quan sát vẫn được giữ.
- **Mốc 3–5 phút:** chỉ đánh giá chuyến thắng boss, không QA, không đánh ×2 và không có khoảng gián đoạn chưa đo được. Thua/bỏ dở/tải lại vẫn xuất hiện trong số lượt, không lọc bỏ để tạo cảm giác tỉ lệ thắng cao.
- **Thao tác:** đặt, xoay, đưa về khay, thả không hợp lệ, ghép, mua, bán theo lần và số món, đổi Shop, chọn gói, thử lại, mua năng lượng. Thành công mới tăng bộ đếm tương ứng; hủy bán không tăng. Đặt lại đúng vị trí cũ không tăng bộ đếm đặt.
- **Mỗi xuất phát:** vòng/lần thử, HP, năng lượng trước khi thu phí, Lộ phí, số ô đã dùng, số món trong khay, từng loại/Tier/tọa độ/hướng và báo cáo giao chiến khi kết thúc. Độ kín balo một mình chưa chứng minh có áp lực diện tích.

Nhật ký sự kiện tối đa 2.000 sự kiện/lượt, có cờ khi chạm giới hạn; bộ đếm tổng vẫn tiếp tục. Mã nhận diện bộ luật được ghi trong JSON, bảng tổng hợp chỉ trộn cùng bộ luật hiện tại. Tên và giá trị kỹ thuật trong JSON phục vụ đối chiếu; UI dùng nhãn thao tác tiếng Việt.

## Gián đoạn và lưu trữ

Skin, tiền và tiến trình thật không bị ghi đè bằng hồ sơ thử. Nhận thưởng hoặc chi tiền trong lượt thử không chuyển về tài khoản thật.

Nhật ký được lưu khoảng mỗi giây, sau thao tác, khi ẩn/đóng trang và khi kết thúc. Nếu tải lại khi đang thử, bản đang lưu trở thành **Gián đoạn do tải lại / đóng trang**, dừng ở mốc lưu gần nhất; không đoán thời gian offline và không khôi phục hành trang thử. Mất trình duyệt đột ngột vẫn có thể mất phần chưa kịp lưu. Nếu localStorage đầy/không dùng được, UI báo lỗi và cho xuất dữ liệu trong phiên. Đây là công cụ local, chưa đồng bộ nhiều tab/thiết bị.

## Hai câu nhận xét

- Quyết định khó nhất là gì? Có thể ghi “không có”, đừng ép người chơi phải khen cơ chế.
- Nếu chơi lại, bạn sẽ đổi gì? Nếu chưa hiểu nguyên nhân thua, ghi “chưa biết”.

Nhận xét tối đa 500 ký tự/câu, lưu cục bộ và đưa vào JSON khi người chơi chủ động xuất. Số lần ghép, bán hoặc đổi Shop không tự động được coi là quyết định thú vị.

## Cách xử lý feedback sau đợt thử

1. **Nguồn đồ và ghép:** đọc lựa chọn tiếp tế, các tình huống giữ đôi/ghép, đồ có ích phải để khay và nhận xét. Đối chiếu 3×3 với 5×5 cùng Loadout. Chỉ sửa nhóm này nếu có bằng chứng cụ thể.
2. **Loadout:** sau khi giữ nguồn đồ ổn định, xem từng hướng thắng/thua ở đâu và người chơi có nghĩ ra cách đổi đội hình trước khi nâng chỉ số không. Mở đợt stage 3 khi cần kiểm tra khác biệt cơ chế.
3. **Kinh tế/skin:** đợt sau ở stage 4–5 với điều kiện skin rõ ràng; đo thời gian săn mảnh, số đồ đủ để ghép và giá trị thưởng chơi trực tiếp so với Auto Farm. Không trộn với đợt không skin này.

Mỗi đợt chỉ thay một nhóm, ghi giả thuyết, thông số trước/sau và chơi lại cùng cấu hình. Bước 11 hiện xây công cụ và quy trình; chưa có dữ liệu người chơi thật để tự điều chỉnh hoặc công bố hoàn tất cân bằng.
