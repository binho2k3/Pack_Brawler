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
- **Preview xanh:** vị trí trống hợp lệ. **Hổ phách:** cùng loại, cùng bậc và chưa chạm trần ghép của chuyến, thả để ghép. **Đỏ:** va chạm, vượt biên hoặc không thể ghép, thả để trả về.
- **Hợp nhất:** trần III khi chưa có skin, skin vũ khí mở đến VII; pháp bảo hỗ trợ giữ III, giữ hướng của món đích, kế thừa tiến độ hồi chiêu thấp hơn.
- **Shop:** ba ô mua bằng Lộ phí, đổi hàng giá 10 Lộ phí. Khóa Shop giữ các ô hàng qua vòng tiếp theo, kể cả ô đã bán hết.
- **Bán:** kéo món từ lưới hoặc khay vào vùng bán. Nhận Lộ phí trong chuyến; có nút bán trong bảng chi tiết làm cách thao tác thay thế.
- **Xuất phát:** khóa chỉnh sửa lưới, khay và Shop; trang bị tự gây sát thương, tạo giáp, hồi máu hoặc tăng tốc. Nút ×1/×2 điều khiển tốc độ mô phỏng.
- **Kết quả:** thắng round thường nhận thưởng và chọn 1 trong 3 gói tiếp tế rồi chuẩn bị vòng sau; thua được sắp xếp lại và chơi lại đúng vòng đó. Boss xuất hiện ở vòng 5.

## Kinh tế chuyến đi · Bước 1

- **Lộ phí:** mỗi chuyến mới bắt đầu với 60. Dùng mua đồ và đổi Shop; bán đồ nhận Lộ phí. Chưa có cấp thêm Lộ phí theo round.
- **Bạc tích lũy:** dùng cho nâng cấp và hệ thống ngoài trận. Thưởng Bạc/nguyên liệu khi thắng round, boss và Auto Farm giữ nguyên; bán đồ trong chuyến không tạo Bạc.
- Qua round hoặc thử lại sau khi thua giữ Lộ phí còn lại, không cấp lại 60. Bạc và nguyên liệu đã nhận từ các round thắng luôn được giữ; thua boss không nhận thưởng boss.
- Thắng boss hoặc chọn chuyến mới làm Lộ phí chuyến cũ hết hiệu lực, không quy đổi sang Bạc. Về ngoài trận rồi tiếp tục từ Trang chủ vẫn là chuyến hiện tại.
- Tải lại trang cũng bắt đầu chuyến mới theo giới hạn lưu của prototype. Lộ phí không được lưu vào hồ sơ lâu dài.

## Lựa chọn tiếp tế · Bước 2

Sau mỗi round thường, chọn **1 trong 3 gói**, mỗi gói **3 món Tier I**, trước khi chuẩn bị vòng tiếp theo. Xem trước loại, kích thước và nhãn trong/ngoài Loadout của từng món. Gói thiên về tấn công, phòng thủ hoặc hỗ trợ; hai món đầu ưu tiên vai trò tương ứng.

Luôn có ít nhất một gói hoàn toàn thuộc Loadout. Các gói khác ưu tiên loại trong Loadout khi chọn món theo vai trò, đồng thời có món ngoài Loadout nếu bộ sưu tập có loại phù hợp đã mở khóa. Gói được sinh một lần lúc thắng, không đổi danh sách và không mất Lộ phí khi chọn.

Chỉ gói được chọn vào khay, đúng một lần. Thua/thử lại không cấp tiếp tế. Boss giữ phần thưởng hiện có, không mở lựa chọn tiếp tế. HP, giáp, cooldown và tiền giữ quy tắc cũ; người chơi vẫn chủ động bấm xuất phát sau khi sắp xếp. Các gói khác nhau về công dụng và giá trị bán, chưa được chuẩn hóa tổng giá trị trong bản thử này.

## Địch, ngũ hành và năng lượng · Bước 3

Ba stage đầu có yêu cầu đội hình khác nhau:

| Stage | Quái thường | Boss |
| --- | --- | --- |
| Xích Sa | 3–4 quái nhỏ, ít HP | Yêu Hồ gọi thêm tối đa 2 quái con còn sống mỗi 8 giây; hạ boss rồi dọn quái còn lại |
| Phế Tích | 2 Khôi Lỗi có giáp giảm sát thương mỗi đòn | 6 giây giáp 18, 4 giây hở giáp, lặp chu kỳ |
| Phong Khiếu | 2–3 Phong Điểu, đòn mạnh mỗi 6 giây | Đòn mạnh mỗi 8 giây; báo tích lực trước 2 giây |

Nút **Xem cơ chế** ở sân đấu mở số lượng, hệ, cơ chế và gợi ý đối phó. Màn tiếp tế hiển thị thông tin **vòng kế tiếp**, kể cả boss. Trạng thái giáp/tích lực/gọi viện binh hiện dưới địch khi đánh. Stage 4–5 giữ cơ chế cũ và được gán hệ.

Ngũ hành: **Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim**. Vũ khí khắc hệ địch gây ×1,2 sát thương; chiều bị khắc ×0,9; cùng hệ hoặc quan hệ khác ×1. Ngũ hành tính trước giáp rồi đến khiên; giáp luôn để lọt ít nhất 20% sát thương (làm tròn, tối thiểu 1). Nhân vật, khiên và hồi phục chưa mang hệ trong bước này.

| Vũ khí | Hệ | Hướng đánh | Sát thương / hồi chiêu gốc |
| --- | --- | --- | --- |
| Linh kiếm | Kim | Cận nhanh, ưu tiên phía trước | 24 / 1,8 giây |
| Xích Diệm Trọng Đao | Hỏa | Cận đòn mạnh, ưu tiên phía trước | 48 / 3,4 giây |
| Thanh Trúc Phi Châm | Mộc | Xa nhanh, ưu tiên phía sau | 14 / 1,1 giây |
| Xuyên Vân Nỏ | Thủy | Xa đòn mạnh, ưu tiên phía sau | 37 / 2,8 giây |

Hệ Thổ hiện có ở địch; chưa có vũ khí Thổ. Phía trước là địch còn sống gần nhân vật nhất (bên trái đội hình địch); phía sau là bên phải. Không có tầm đánh theo ô balo. DPS ở HUD là DPS thô, chưa tính hệ, giáp và sát thương dư khi hạ mục tiêu.

**Năng lượng:** tối đa 30, hồi 1 điểm/5 phút cả offline. Mỗi lần bấm **Xuất phát** trừ 5, gồm mọi round và thử lại vòng thua. Chọn stage, sắp xếp hoặc chọn tiếp tế không trừ điểm. Thiếu năng lượng mở màn mua và không bắt đầu combat. Hết năng lượng trong trận không ngắt trận đang chạy. Auto Farm không tiêu năng lượng.

Mua 10 điểm bằng **100 Bạc** (tối đa 3 lần/ngày) hoặc **5 Linh thạch**; chỉ mua khi đang có tối đa 20 để không vượt trần. Lượt Bạc đặt lại lúc 00:00 UTC+7; Lộ phí không dùng mua năng lượng. Không cộng dồn thời gian hồi khi đầy. Bản lưu cũ tự bổ sung 30 năng lượng và hai vũ khí mới mà giữ tài nguyên/nâng cấp/tiến trình. Tải lại trang làm mất chuyến hiện tại như trước, không hoàn năng lượng đã tiêu. Dev thắng/thua ngay bỏ qua phí xuất phát; nút Xuất phát thật luôn thu phí.

Các chỉ số là thông số thử nghiệm, chưa phải cân bằng cuối cùng. Đồng hồ và giới hạn mua hiện được xử lý cục bộ, chưa có backend xác thực.

## Diện tích balo và đánh đổi ghép · Bước 4

Balo khởi đầu **3×3 (9 ô)** trong khung 5×5. Ô chưa mở hiện mờ và không thể đặt, xoay hoặc ghép vật phẩm xuyên vào đó. Bộ khởi đầu kiếm + khiên + bình máu dùng 7 ô; món Loadout không đặt vừa được đưa vào khay, không mất đồ.

Trong tab **Hòm tiêu**, xem trước vùng mở thêm rồi mua bằng **Bạc tích lũy**:

| Mốc | Giá | Điều kiện |
| --- | --- | --- |
| 3×3 → 4×4, thêm 7 ô | 500 Bạc | Thắng boss stage 1 |
| 4×4 → 5×5, thêm 9 ô | 1.500 Bạc | Thắng boss stage 3 |

Mở lần lượt, giữ vĩnh viễn và áp dụng cho chuyến hiện tại; không tiêu Lộ phí. Bản lưu trước bước 4 chưa có giao dịch mua balo được khởi tạo ở 3×3, giữ nguyên tài nguyên, nâng cấp và tiến trình boss. Auto Farm giữ công thức cũ trong bước này.

Khi kéo lên món ghép hợp lệ, bảng xem trước hiện phía trên lưới: Tier mới, diện tích hai món trước/sau, hiệu lực lý thuyết, số ô thực sự giải phóng và cooldown kế thừa. **Thả là ghép**, không thêm hộp xác nhận. Có thể dùng **Chọn ô đích**, rồi di chuột hoặc đưa tiêu điểm bàn phím đến món đích để xem cùng bảng trước khi chọn.

- Hai kiếm Tier I cùng trên lưới: 4 → 2 ô; DPS lý thuyết 26,7 → 22,7 (−15%); giải phóng ngay 2 ô.
- Kiếm từ khay ghép vào kiếm trên lưới: vẫn hiện phép so sánh hai món, nhưng ghi rõ không giải phóng ô hiện tại; DPS trên lưới tăng 13,3 → 22,7 vì món trong khay chưa hoạt động.
- Khiên/hồi máu hiển thị giáp hoặc HP mỗi giây lý thuyết, chưa tính trần khiên hoặc hồi dư. Tăng tốc hiển thị hiệu ứng mạnh nhất trước/sau vì hai phù không cộng dồn, không báo giảm 15% cho hiệu ứng này.
- Hệ số ghép vẫn 1,7; giữ hướng/vị trí món đích và mức tiến độ cooldown thấp hơn của hai món. Preview không thay đổi trạng thái.

Dev có ba nút thử **3×3 / 4×4 / 5×5** ở pha chuẩn bị. Thu nhỏ chuyển các món vượt vùng về khay, giữ Tier, hướng và cooldown; không đổi kích thước đã mua trong hồ sơ. Chuyến mới dùng lại kích thước vĩnh viễn.

## Kết quả giao chiến và gợi ý · Bước 5

Sau mỗi round, bảng tóm tắt hiển thị thời gian giao chiến, HP địch đã mất, HP nhân vật đã mất, khiên hấp thụ, HP hồi hữu ích và HP đầu/cuối trận. Khi thua, ghi rõ quái và loại đòn kết liễu, sát thương của đòn đó, lượng bị khiên chặn và HP thực sự mất.

**Xem thống kê từng món** mở số lần kích hoạt và đóng góp của từng món trên lưới: sát thương vào HP/khiên địch, phần bị giáp giảm, hồi hữu ích/hồi dư, khiên tạo/hấp thụ/vượt trần hoặc mức tăng tốc cao nhất. Món trong khay không tham gia. Khiên được quy cho nguồn tạo trước; phần mang từ round trước được ghi riêng. Sát thương dư khi hạ địch không tính vào DPS thực; DPS thực là HP địch mất chia thời gian round. Thời gian dùng đồng hồ mô phỏng, không gồm sắp xếp hay tạm dừng; tốc độ ×2 không làm thống kê thời gian giảm một nửa.

Tối đa **hai gợi ý có bằng chứng** được chọn từ: đòn tích lực kết liễu, tỷ lệ sát thương bị giáp giảm, bất lợi ngũ hành, hồi dư hoặc thiếu khiên. Không đủ bằng chứng thì không đưa gợi ý bắt buộc; không tự động khuyên nâng cấp. Phần tăng/giảm do ngũ hành và giáp là giá trị trước khiên, có thể chứa số lẻ trước làm tròn đòn đánh.

Mỗi stage/round lưu đúng kết quả hoàn tất gần nhất trong hồ sơ (tối đa 25 mục). Trận mới cùng stage/round so với lần trước về thời gian, DPS, lượng sát thương và HP; ghi rõ khi trang bị/Tier/bố trí, luyện khí/đột phá, diện tích balo hoặc trạng thái đầu trận khác nhau. Thời gian ngắn hơn khi thua có thể là chết sớm, không được tự xem là tốt hơn. Lưu thêm bảng so sánh gọn, không nối chuỗi toàn bộ lịch sử.

Trang chủ có **Nhật ký giao chiến** để chọn và xem lại kết quả sau khi tải trang. Xem lại không trao thưởng hay thay đổi vòng đang chơi. Round thắng tiếp tục bằng **Chọn tiếp tế**, boss thắng về thương lộ, thua về chuẩn bị; năng lượng vẫn chỉ trừ khi xuất phát.

Thống kê bắt đầu lại mỗi round/lần thử. Rời trận đang đánh không tạo kết quả hoàn tất. Ép thắng/thua bằng Dev hoặc sửa Tier bằng Dev trong lúc đánh được đánh dấu thử nghiệm, không ghi đè kết quả thật và không tạo gợi ý. Bản lưu trước bước 5 giữ tiến trình cũ, bắt đầu với nhật ký trống.

## Đội hình, hồi phục và cuồng nộ · Bước 7

Hòm tiêu có ba bộ gợi ý, dùng trang bị đã sở hữu và cho chỉnh từng món sau khi chọn:

| Bộ | Ba loại khởi đầu | Đánh đổi |
| --- | --- | --- |
| Tấn công | Linh kiếm, Xuyên Vân Nỏ, Bình Hồi Xuân | Hai hướng mục tiêu, có hồi phục; thiếu khiên |
| Cân bằng | Linh kiếm, Huyền Thiết Thuẫn, Bình Hồi Xuân | Duy trì tốt; chỉ một vũ khí |
| Tăng tốc | Trọng Đao, Huyền Thiết Thuẫn, Tật Phong Phù | Đòn mạnh và tăng tốc; không hồi HP trong trận |

Chọn bộ không cấp thêm đồ hay tiêu tiền; chỉ áp dụng cho chuyến mới. Chuyến đang chơi giữ ảnh chụp Loadout riêng, bao gồm nguồn tiếp tế ưu tiên. Không thay công thức Shop hoặc Auto Farm.

Thắng vòng thường, chọn tiếp tế rồi chuyển sang vòng sau sẽ hồi **20% HP tối đa** (hiện là 36 HP), giới hạn theo HP còn thiếu. Hồi đúng một lần khi chuyển vòng; mở lại kết quả, chọn gói hoặc chờ không tự hồi. Giữ khiên, tăng tốc và tiến độ hồi chiêu; không cộng phần hồi nghỉ vào thống kê món hồi máu của trận trước. Thắng boss không có bước hồi giữa vòng. Thử lại giữ quy tắc cũ: hồi đầy HP, bỏ khiên/tăng tốc, đặt hồi chiêu về 0; mỗi lần xuất phát tiếp tục tốn 5 năng lượng.

Mỗi lần đánh có đồng hồ riêng theo thời gian mô phỏng: báo trước cuồng nộ từ giây 55; giây 60 địch +10% sát thương gốc, giây 70 +20%, tiếp tục thêm 10% mỗi 10 giây (không nhân chồng). Áp dụng cho mọi đòn địch và quái gọi thêm. Không tăng tốc đánh hoặc HP. ×2 tăng tốc cả đồng hồ; tạm dừng/ẩn trang không tính giờ.

Tại **180 giây**, chưa hoàn tất vòng thì kết thúc với lý do **Hết thời gian**, không xử lý thêm đòn ở mốc này. Giữ đúng HP còn lại trong báo cáo, không bịa đòn kết liễu, không trao thưởng hay tiếp tế. Có thể chuẩn bị lại cùng vòng và trả năng lượng khi xuất phát. Bản báo cáo cũ vẫn đọc được; so sánh với quy tắc cũ có cảnh báo.

### Đối chiếu đội hình ban đầu

Chạy `node tests/loadout-benchmark.cjs` để tái lập 36 trận: ba đội hình × ba stage × vòng 1/boss × Tier I/II. Điều kiện cố định: balo 3×3, HP 180, chỉ ba món khởi đầu, không nâng cấp, không Shop/tiếp tế/đồ khay; bước mô phỏng 0,04 giây. Đây là đối chiếu từng trận riêng, chưa phải thử toàn chuyến.

Ảnh chụp số liệu bước 7, trước khi đổi Tật Phong Phù ở bước 8 (chạy lại script sẽ dùng thông số hiện hành): ở Tier II, boss Phế Tích: Tấn công thắng 18 giây/còn 104 HP; Cân bằng 36 giây/178 HP; Tăng tốc 21 giây/114 HP. Boss Phong Khiếu: chỉ Cân bằng thắng (32,4 giây/106 HP); hai bộ còn lại thua. Tăng tốc chưa thể hiện lợi thế đủ rõ trong các tình huống cố định này; cần kiểm chứng thêm khi có tiếp tế và bố trí thực tế, chưa khẳng định ba hướng đã cân bằng.

## Chơi thử toàn chuyến và cân bằng · Bước 8

Mục tiêu đã chốt: **3–5 phút cho toàn chuyến, gồm chọn tiếp tế và sắp xếp**, giữ các trận ngắn. Chưa đo được thời gian thao tác của người thật; không suy ra thời lượng toàn chuyến chỉ từ tổng thời gian mô phỏng chiến đấu.

**Thay đổi áp dụng:** Tật Phong Phù Tier I tăng từ **16% lên 30%** tốc độ hồi chiêu vũ khí; Tier II là 51%, Tier III làm tròn thành 87% khi kích hoạt, trước nâng cấp ngoài trận. Giữ hiệu lực 4 giây, hồi chiêu 6 giây, kích thước 2×1 và chỉ lấy hiệu lực mạnh nhất. Đây là mức cân bằng thử nghiệm. Phiên bản quy tắc giao chiến tăng lên 3 để cảnh báo khi so sánh với báo cáo cũ; giữ nguyên bản lưu và chỉ số lịch sử.

### Phương pháp và kết quả

Đã chạy **1.176 chuyến mô phỏng** để so sánh mức 16%/30%:

- 864 chuyến: 12 seed × 3 Loadout × 3 stage đầu × balo 3×3/5×5 × 2 cách chọn đồ × 2 mức tăng tốc.
- 288 chuyến: thêm stage 4–5 với balo 5×5, cùng 12 seed và hai mức tăng tốc.
- 24 chuyến: kiểm tra riêng Tăng tốc/Phong Khiếu/5×5 với bước mô phỏng nhỏ hơn 0,025 giây thay cho 0,05; kết quả thắng vẫn 4/12 và 11/12.

Các chuyến đi đủ luồng Shop → chiến đấu → chọn tiếp tế → ghép/sắp xếp → vòng sau. Có giữ HP/khiên/hồi chiêu, hồi nghỉ 20%, 60 Lộ phí, trả năng lượng đúng từng lần xuất phát. Mọi giao dịch dùng engine thật; không cấp Tier hoặc vật phẩm giữa chuyến, không xem trước kết quả giao chiến để chọn đồ. Cho sẵn kích thước balo là điều kiện thử có kiểm soát, không mô phỏng giá mua hay mở khóa. Giữ đồ khay khởi đầu của game.

Hai cách chọn đồ: **themed** chỉ dùng ba loại trong Loadout và bán đồ ngoài nhóm; **adaptive** dùng mọi loại đã mở. Bộ mô phỏng chọn theo chỉ số công/thủ dự kiến và bốn thứ tự xếp đơn giản; không chơi tối ưu, không reroll/thử lại, không nâng cấp ngoài trận hoặc farm. Đây không phải tỷ lệ thắng của người chơi.

| Tăng tốc, giữ ba loại đồ | Phù 16% | Phù 30% |
| --- | ---: | ---: |
| Phong Khiếu, 3×3 | 0/12 thắng | 1/12 thắng |
| Phong Khiếu, 5×5 | 4/12 thắng | 11/12 thắng |
| Thanh Đăng, 5×5 | 5/12 thắng | 7/12 thắng |
| Hắc Phong, 5×5 | 0/12 thắng | 1/12 thắng |

Không phải mọi nhóm đều cải thiện: khi chọn đồ linh hoạt tại Thanh Đăng, tổng số chuyến thắng giảm từ 13/36 xuống 9/36. Chỉ số mới cũng làm thay đổi thứ tự xếp/chọn đồ và trạng thái chuyển vòng, nên chưa tách được ảnh hưởng của quyết định tự động với tác dụng riêng của phù. Cần chơi thử thủ công trước khi coi mức 30% là chốt cuối.

Ở ba stage đầu sau điều chỉnh, diện tích dùng trung bình là 97,1% với 3×3 và 75,2% với 5×5. Các vòng còn đồ có ích theo mô hình nhưng không đặt vừa chiếm 785/1.037 và 180/1.077 vòng tương ứng. Chỉ số này cho biết hạn chế hình học theo bộ mô phỏng, không chứng minh lựa chọn đã thú vị. Stage thấp dễ hơn với balo lớn là điều cần phân biệt với áp lực ở stage cuối. Chưa đổi kích thước đồ, nguồn tiếp tế hoặc sức mạnh địch dựa trên riêng số liệu này.

Trung vị tổng thời gian đánh của các chuyến thắng ở ba stage đầu lần lượt là 31,6 giây (3×3) và 24,55 giây (5×5), chưa gồm sắp xếp. Số liệu loại các chuyến thua nên cần đọc cùng số vòng vượt được trong báo cáo, không dùng làm thời gian chơi trung bình chung.

Dữ liệu tổng hợp đã lưu tại `tests/balance-step8-results.json`, gồm điều kiện, số lần thắng, thời lượng, lấp đầy, đồ không vừa, số ghép và các lựa chọn tiếp tế bằng điểm. Chạy lại để lấy toàn bộ diễn biến từng vòng:

```sh
node tests/stage-benchmark.cjs --seeds=12 --rune-value=16 > /tmp/pack-before.json
node tests/stage-benchmark.cjs --seeds=12 --rune-value=30 > /tmp/pack-after.json
node tests/stage-benchmark.cjs --seeds=12 --stages=4,5 --bags=5 --rune-value=30 > /tmp/pack-late.json
node tests/stage-benchmark.cjs --seeds=12 --stages=3 --bags=5 --presets=haste --policies=themed --dt=.025 --rune-value=30 > /tmp/pack-fine.json
```

Các tùy chọn `--rune-value` chỉ đổi bản engine trong bộ mô phỏng, không sửa source hoặc bản lưu. JSON ghi đủ seed để tái lập; giá trị rơi ngẫu nhiên không tương ứng một mẫu người chơi thực tế.

### Chơi thử với người thật còn cần làm

Dùng tốc độ ×1, ghi thời điểm bắt đầu chuẩn bị và kết thúc boss, thời gian đánh, số lần đổi lựa chọn tiếp tế/giữ đôi hoặc ghép, và đồ có ích phải để khay. Thử cả đội hình Tăng tốc và Cân bằng; thử 5×5 ở stage 4–5 thay vì chỉ các stage đầu. Mục tiêu là kiểm tra tổng chuyến 3–5 phút, lý do thay đổi đội hình sau thua và liệu diện tích còn tạo lựa chọn. Chưa khẳng định các mục này đạt qua mô phỏng.

## Khay dự bị và bán nhiều món · Bước 9

Khay tối đa **12 vật phẩm**, đếm theo món, độc lập với balo 3×3/4×4/5×5. Tiếp tế luôn nhận đủ ba món; dỡ đồ khỏi lưới được phép làm khay tạm vượt giới hạn. Không tự bán hoặc xóa đồ. Khi dư, người chơi phải đặt lên lưới, ghép hoặc bán để còn tối đa 12 món trước khi xuất phát; lần xuất phát bị chặn không tiêu năng lượng.

Shop và cả ba bảo rương kiểm tra chỗ trước khi trừ tiền hoặc sinh thưởng. Bảo rương chỉ mở trong pha chuẩn bị, hiển thị dung lượng và lối quay lại dọn khay. Khi khay có đúng 12 món vẫn được giao chiến, nhưng không mua thêm đồ.

**Chọn bán** chỉ liệt kê đồ trong khay, không chọn sẵn món nào. Mỗi dòng có tên, bậc và giá; nút bán ghi số món và tổng Lộ phí. Chỉ xác nhận mới bán, cộng đúng Lộ phí của chuyến. Hủy hoặc Escape giữ nguyên đồ và tiền. Đồ đang trang bị không xuất hiện trong danh sách này. Engine kiểm tra lại toàn bộ danh sách và giá trước khi bán; nếu đồ bị di chuyển, ghép hoặc đổi bậc, toàn bộ giao dịch bị từ chối.

| Thành phần | Hành vi và lý do | Kiểm chứng |
| --- | --- | --- |
| Bộ đếm khay / xuất phát | Ghi số món dư và cách xử lý ngay nơi thao tác; không chỉ đổi màu | 11 + 3 → 14/12; khóa xuất phát, giữ năng lượng |
| Danh sách chọn bán | Chỉ mở khi cần; dòng có checkbox, tên, bậc và giá | Không chọn sẵn; hủy và mở lại không giữ lựa chọn |
| Chân hộp thoại | Danh sách cuộn riêng; tổng tiền, bán và quay lại luôn trong khung | Kiểm tra 390×844 và 360×640; hai nút cao 48 CSS px |
| Bàn phím / phản hồi | Tab nằm trong hộp thoại, Space chọn, Escape hủy; phản hồi bằng chữ | Thử trực tiếp; không phụ thuộc âm thanh hoặc màu |

Bố cục áp dụng hướng dẫn phân cấp, thông tin theo ngữ cảnh, phản hồi và khả năng tiếp cận trong handbook của `mobile-game-ui-ux-coach` (mục 2, 3, 5). Các kích thước trên là CSS px của web demo, không phải chứng nhận kích thước chạm native. Ảnh giao diện: [preview-step9.png](preview-step9.png).

Đã chạy 115 kiểm thử và kiểm tra 36 chuyến mô phỏng với luật mới. Bot mô phỏng tự chọn món dư có giá bán thấp nhất và ghi hành động bán; đây là chính sách của bot thử nghiệm, game không tự bán. Dữ liệu `balance-step8-results.json` giữ nguyên như ảnh chụp thí nghiệm bước 8 khi chưa giới hạn khay; chạy lại với engine hiện tại có thể cho kết quả khác. Chưa dùng thử với người chơi thật để kết luận giới hạn 12 món đã cân bằng hoặc tổng chuyến đạt 3–5 phút.

## Skin, mảnh và đột phá · Bước 10

Vào **Hòm tiêu → Bộ sưu tập skin** để chọn một trong bốn vũ khí. Mỗi vũ khí có năm skin, đổi màu/hoa văn/dấu ấn trên SVG hiện tại và cộng chỉ số; đây là tạo hình prototype. Các loại trang bị đã mở vẫn được giữ. Pháp bảo hỗ trợ chưa có skin và giữ trần ghép III.

| Phẩm chất | Skin | Cộng chỉ số gốc | Trần ghép | Mảnh đúng loại để chế tạo |
| --- | --- | ---: | --- | ---: |
| Thường | Hành Lữ | 5% | III | 3 |
| Hiếm | Ngọc Văn | 10% | IV | 4 |
| Quý | Tử Điện | 15% | V | 5 |
| Sử thi | Xích Long | 20% | VI | 6 |
| Truyền thuyết | Thiên Mệnh | 25% | VII | 8 |

Đây là thông số thử. Mỗi skin chỉ chế tạo một lần, thành công chắc chắn, không cần sở hữu bậc thấp hơn. Chỉ trừ mảnh đúng vũ khí/phẩm chất sau xác nhận; hủy không trừ. Không tự trang bị sau chế tạo. Mỗi vũ khí dùng một skin, không cộng dồn các skin đã sở hữu; mảnh dư vẫn được giữ, chưa có chức năng quy đổi.

Skin chọn áp dụng từ **chuyến mới**. Chuyến chụp cấu hình skin khi tạo; đồ khởi đầu, Shop, tiếp tế và rương dùng cấu hình đó. Đổi hoặc tháo skin ở bộ sưu tập không đổi sức mạnh hay trần ghép chuyến hiện tại. Khởi đầu vẫn Tier I, rương giữ Tier I/II/III; skin không tặng đồ bậc cao. Ghép chỉ cùng loại và bậc, kế thừa vị trí/hướng và cooldown thấp hơn, không vượt trần từng vũ khí hoặc VII.

Hệ số Tier I–III giữ `1, 1.7, 2.89`; mỗi bậc IV–VII nhân tiếp `1.5`, Tier VII khoảng `14.63×` Tier I trước thưởng ngoài trận. Hiệu lực = chỉ số gốc × hệ số Tier × `(1 + cấp luyện khí × 15% + lần đột phá × 30% + bonus skin)`. Hai món hoạt động đầy đủ ghép lên II/III giảm tổng hiệu lực 15%; lên IV–VII giảm 25% để tiết kiệm diện tích. Preview tính phần trăm từ hiệu lực thực tế; giá bán dùng cùng hệ số Tier. Trần cao là khả năng ghép, không bảo đảm đạt VII trong một chuyến năm vòng: nguồn đồ và kinh tế bậc cao còn cần thử nghiệm.

### Hai nguồn mảnh riêng

- **Mảnh chung:** giữ lượng đang có và nguồn Auto Farm. Mỗi lần thắng boss stage 1–5 nhận thêm 5/8/12/16/20 mảnh, kể cả thắng lại. Đột phá lần `n` yêu cầu luyện khí cấp `3n`, thanh toán **10n Linh thạch hoặc 20n mảnh chung**, do người chơi chọn; không trừ cả hai. Hiệu quả giữ +30% chỉ số gốc.
- **Mảnh skin:** khóa theo vũ khí và phẩm chất, chỉ từ boss chơi trực tiếp. Không đổi từ mảnh chung; không rơi từ vòng thường, thua, Auto Farm hoặc rương. Một chương gồm năm stage; demo hiện có một chương, boss stage 5 là boss kết chương.

| Mảnh skin | Boss stage 1–4 | Boss kết chương / stage 5 |
| --- | ---: | ---: |
| Thường | 60% | 40% |
| Hiếm | 20% | 30% |
| Quý | 0% | 18% |
| Sử thi | 0% | 9% |
| Truyền thuyết | 0% | 3% |
| Không rơi | 20% | 0% |

Mỗi lần thắng rơi tối đa **một mảnh**; trong mỗi phẩm chất chia đều bốn vũ khí. Ví dụ mảnh Truyền thuyết của riêng kiếm có xác suất 0,75% mỗi lần thắng boss kết chương. Không có bảo đảm sau một số lượt. Bảng tỷ lệ trước trận và kết quả thực nhận dùng chung dữ liệu engine; mở lại kết quả không trao thêm. Các tỷ lệ/giá này chưa được kiểm chứng bằng chơi dài hạn, có thể khiến săn skin rất lâu và cần điều chỉnh theo thời gian mục tiêu.

### Giao diện và kiểm chứng

| Luồng | Thiết kế / cơ sở | Kiểm tra |
| --- | --- | --- |
| Bộ sưu tập | Thông tin chiến lược mở theo yêu cầu, chọn vũ khí rồi xem năm phẩm chất; handbook UI/UX mục 2.1, 3.1 | Thiếu mảnh khóa chế tạo, ghi thiếu bao nhiêu; nguyên bản / sở hữu / đang chọn có nhãn chữ |
| Chế tạo | Một hành động chính trong hộp xác nhận; giá, hiệu lực, trần ghép, hủy rõ ràng; mục 5.1 | Hủy giữ 20 mảnh, chế tạo Truyền thuyết tiêu 8 còn 12; không tự trang bị |
| Đột phá | Chọn một loại thanh toán; ghi số đang có và điều kiện; mảnh chung khác mảnh skin | Tiêu 20 mảnh chung, giữ Linh thạch và toàn bộ mảnh skin; hủy không thay đổi |
| Ghép nâng cao | Preview thống nhất với hiệu lực engine, Tier IV–VII có số La Mã và viền riêng | Thử trực tiếp VI + VI → VII, preview −25%; unit test chặn ghép vượt mọi trần |
| Lưu / màn hình nhỏ | Skin lưu vĩnh viễn, chuyến chụp riêng; cuộn trong trang; nút skin/select 48 CSS px | Reload giữ skin và 12 mảnh dư; kiểm tra 390×844, 360×640, không có lỗi console |

Hình: [bộ sưu tập](preview-step10-skins.png), [Tier VII](preview-step10-tier7.png). Vùng chạm tính bằng CSS px, chưa kiểm chứng thiết bị vật lý, phóng chữ, tai thỏ, cầm trái/phải hoặc hiệu năng máy yếu. Hiệu ứng dùng SVG/CSS không cần âm thanh để đọc trạng thái; không thêm animation bắt buộc.

133 kiểm thử đã đạt, gồm chuyển bản lưu, mảnh đúng loại, chống chế tạo lặp, trần ghép, sức mạnh theo skin của chuyến, thưởng boss một lần, nguồn mảnh, thanh toán và báo cáo khác skin. Mô phỏng 36 chuyến không skin dùng để kiểm tra hồi quy; không chứng minh cân bằng skin hoặc tiến trình dài hạn. Dữ liệu bước 8 vẫn là thí nghiệm lịch sử.

Dev có thêm cấp mảnh skin/mảnh chung, tạo đôi kiếm dưới trần chuyến và chọn stage 4–5. Các nút này chỉ phục vụ kiểm thử, có thể bỏ qua nguồn rơi thông thường.

## Nhật ký toàn chuyến · Bước 11

Vào **Trang chủ → Chơi thử · 6 cấu hình stage 2**. Chọn 3 Loadout × 2 balo 3×3/5×5, cùng seed 57241, không nâng cấp hoặc skin. Mỗi lượt dùng hồ sơ riêng và giữ tài khoản/chuyến thật; Dev, rương, đổi đội hình và nâng cấp ngoài trận bị chặn trong lượt thử. Tài nguyên và thưởng thử không chuyển sang tài khoản thật.

Nhật ký tách chuẩn bị, đánh ×1/×2, chọn tiếp tế, xem kết quả, tạm dừng, ẩn trang, năng lượng và gián đoạn. Ghi thao tác mua/bán/ghép/đổi Shop/thử lại, đội hình từng lần xuất phát và báo cáo từng vòng. Thắng boss dừng đồng hồ; thất bại có thể thử lại trong cùng lượt hoặc kết thúc với dữ liệu chưa hoàn thành. Không đánh giá 3–5 phút bằng chuyến thua, ×2, QA hoặc khoảng thời gian không đo được.

Có hai câu nhận xét, lịch sử 30 lượt và **Xuất nhật ký JSON**. Dữ liệu chỉ lưu localStorage (`pack-brawler-playtest-v1`); không gửi mạng. Reload lượt đang thử sẽ ghi gián đoạn đến mốc lưu gần nhất, không khôi phục chuyến thử và không đoán thời gian offline. Dữ liệu JSON ghi phiên bản luật để tránh gộp các đợt khác nhau; UI tổng hợp cùng luật và giữ cả số lượt không hoàn thành.

Quy trình, định nghĩa chỉ số, giới hạn lưu trữ và thứ tự cân bằng theo bằng chứng nằm trong [PLAYTEST.md](PLAYTEST.md). `playtest.js` là module ghi nhận thuần dùng chung giữa web và test; hãy phục vụ cùng `index.html` khi chạy/chuyển source. Không có thư viện mới hoặc bước build.

| Thành phần | Thiết kế / cơ sở | Tiêu chí kiểm tra |
| --- | --- | --- |
| Chọn lượt | 6 cấu hình có điều kiện rõ, xác nhận trước đo; handbook mục 2.1 và 3.1 | Hồ sơ thử không lấy skin/nâng cấp/tiền của tài khoản thật |
| Dừng / tiếp tục | Nút Ⅱ và mũi tên về; tiếp tục đúng trạng thái | HP/cooldown giữ nguyên, không thu năng lượng lần nữa |
| Báo cáo | Thời gian hoạt động, loại trừ, mô phỏng và trạng thái tách riêng; chi tiết mở khi cần | Thắng boss dừng đo, thử lại giữ cùng nhật ký, không tính QA vào tổng hợp |
| Nhận xét / xuất | Hai ô văn bản, nút lưu và xuất rõ; phản hồi bằng chữ, mục 5.1 | Hủy thao tác không tạo hành động thành công; nhận xét được escape khi hiển thị |

Mục tiêu nút trên trang chọn/báo cáo là 48 CSS px; màn chiến đấu dùng thanh điều khiển gọn của prototype. Kiểm tra giao diện 390×844 và 360×640; chưa khẳng định tiện dụng trên thiết bị vật lý, phóng chữ, cầm một tay hoặc hiệu năng máy yếu. Xem [ảnh chế độ thử](preview-step11.png).

QA qua giao diện đã đi đủ 5 vòng và thắng boss, xuất JSON hợp lệ, lưu nhận xét qua tải trang; kiểm tra thua → thử lại → dừng, trừ thêm 5 năng lượng mỗi lần xuất phát, và tải lại giữa lượt tạo bản ghi gián đoạn. Tài nguyên tài khoản chính được giữ nguyên (năng lượng vẫn hồi theo thời gian). Các lượt QA bị loại khỏi tổng hợp. Màn 360×640 không tràn ngang ở trang báo cáo; nút chọn lượt, xuất và lưu nhận xét cao 48 CSS px. Không ghi nhận lỗi console trong các luồng này.

Bước 11 bổ sung công cụ kiểm chứng, **không tự chứng minh độ vui hoặc cân bằng**. Giữ ước tính 95% phần cơ chế feedback ban đầu; chưa có sáu lượt do người chơi thật hoàn thành để kết luận phần còn lại. Không thay nguồn đồ, chỉ số hoặc giá game trong bước này.

## Giao diện

### Sửa UI/UX P1 — Báo cáo chơi thử

- Chữ trang chơi thử/báo cáo 14 CSS px, nhãn phụ 12 px, ô nhập 16 px; thanh điều hướng ngoài trận 12 px và tự tăng chiều cao theo nội dung. Giữ thiết kế màu hiện tại.
- Đầu báo cáo có **Ghi nhận xét** để đưa focus đến ô nhập. Hai câu hỏi đứng trước thống kê chi tiết; bộ đếm thao tác thu gọn. Sau lưu, **Xuất nhật ký JSON** trở thành hành động chính ngay tại phần nhận xét; báo trạng thái lưu bằng chữ. Nút xuất ở lịch sử vẫn giữ lại.
- Toàn màn ngoài trận nhận inset trên/trái/phải qua `env(safe-area-inset-*)`; thanh điều hướng tiếp tục xử lý inset dưới. Phần nội dung cuộn co giãn theo diện tích còn lại.
- Đã kiểm tra trên trình duyệt 360×640 và 390×844: không tràn ngang báo cáo, nút lưu/xuất cao 48 px, focus đúng ô nhập, nhận xét tiếng Việt giữ qua mở lại trang và có trong file JSON tải thực tế. 149 kiểm thử đạt; engine gameplay giữ nguyên từng byte so với trước đợt sửa này. Xem [ảnh UI P1](preview-ui-p1.png).
- Còn cần kiểm tra trên thiết bị thật: tai thỏ/inset trong chế độ standalone, phóng chữ, bàn phím ảo và tầm với ngón cái. Chưa coi số đo CSS là chứng nhận kích thước chạm theo nền tảng. Các mục P2 của audit chưa triển khai trong đợt này.

- Desktop: khung 390×844, tối đa chiều cao cửa sổ.
- Mobile: khớp chiều rộng và 100dvh. Bố cục HUD mới phân biệt chuẩn bị và giao chiến; pha chuẩn bị cuộn riêng vùng balo/khay/Shop, giữ máu và nút xuất phát cố định.
- Khi giao chiến: máu/giáp và tiến độ pháp bảo nằm trên sân đấu; phía dưới dành cho tạm dừng và đổi tốc độ. Shop/kho/chỉ số sâu được ẩn, có thể đọc đội hình và cơ chế địch trong menu tạm dừng. Nút chính cao 56 CSS px, nút phụ ít nhất 48×48 px; bọc combat bằng Safe Area + 16 px mỗi cạnh.
- Đặc tả, bảng audit và giới hạn đo: [HUD_SPEC.md](HUD_SPEC.md). Ảnh: [chuẩn bị](preview-hud-prepare.png), [giao chiến](preview-hud-combat.png). Đã kiểm tra 320×568, 360×640, 390×844, chạm chọn ô, pause/resume không thu thêm năng lượng, thắng vòng → tiếp tế → chuẩn bị. 149 kiểm thử đạt; engine nguyên vẹn. Còn cần đo ngón tay che khuất, dp/pt và inset trên thiết bị thật.
- Tất cả con số dùng `tabular-nums`.
- Tám loại: Linh kiếm, Xuyên Vân Nỏ, Trọng Đao, Phi Châm, Huyền Thiết Thuẫn, Bình Hồi Xuân, Tật Phong Phù và Thanh Tâm Đỉnh.
- Năm tab ngoài trận: Trang chủ, Thương lộ, Hòm tiêu, Luyện khí, Bảo rương.
- Nâng cấp chỉ số gốc, đột phá bằng Linh thạch và ba loại rương đều tương tác được; số liệu đang dùng để thử nghiệm.

## Trang bị nhân vật — Paper Doll

Mở **Hòm tiêu** ở thanh điều hướng: nhân vật ở tâm, ba ô là ba loại trang bị khởi đầu; kho lưới bên dưới có bộ lọc. Chạm món → Chọn/Bỏ để chỉnh đội hình cho chuyến mới; chỉ số dự kiến và delta cập nhật ngay. Bộ gợi ý, mở balo và skin có lối tắt riêng, tối đa ba cấp màn hình (xem phân biệt số chạm trong [HUD_SPEC.md](HUD_SPEC.md)).

`inventory-ui.js` quản lý điều kiện hiển thị và phản hồi nhấn 40 ms, thả 130 ms, bị chặn 200 ms; có hủy kéo/scroll và giảm chuyển động. Hitbox giữ nguyên khi hình nút co giãn. Chỉ thay UI, không đổi engine gameplay. Bản web dùng SVG và tọa độ phần trăm; **không có SkeletonGraphic để đặt PPU = 100**. Chưa có bản Unity/Spine được tích hợp.

## Popup kết quả và tiếp tế

`ui-feedback.js` quản lý riêng hiệu ứng trình bày: mở popup 280 ms; ba thẻ tiếp tế 240 ms/thẻ, lệch 75 ms, hoàn tất sau 390 ms. Chạm để bỏ qua hoạt ảnh; lần chạm bỏ qua không tự chọn gói. Lobby tự pause animation khi vào stage hoặc khi tab ẩn.

Trang chủ và Pause có mục **Âm thanh & hiệu ứng** để bật/tắt âm báo, rung (mặc định tắt) và giảm chuyển động. Chế độ giảm chuyển động của hệ thống luôn được tôn trọng. Âm thanh tổng hợp Web Audio và haptic tùy khả năng thiết bị; thông báo chữ vẫn đầy đủ. Không đổi gameplay hoặc thưởng.

Chơi thử: thắng một vòng → xem kết quả → **Chọn tiếp tế** → chọn một trong ba gói → kiểm tra khay tăng ba món. Thắng boss vòng 5 mở Stage Clear và quay về thương lộ như cũ. Chi tiết motion, cleanup và kiểm chứng trong [HUD_SPEC.md](HUD_SPEC.md). Chạy toàn bộ kiểm thử bằng `node --test tests/*.test.cjs`.

## Đặc tả asset UI

[asset-manifest.yaml](asset-manifest.yaml) bóc tách HUD theo `HUD_SPEC.md`, ảnh HUD hiện tại và CSS: 29 component (4 nút, 7 panel, 4 khung overlay, 11 phần thanh trạng thái, 3 icon). Có 20 cấu hình 9-slice theo pixel ảnh nguồn; phần fill động dùng clip và icon giữ tỷ lệ. Manifest ghi canvas xuất 2×, alpha, tên file dự kiến, trạng thái, nguồn, lớp ghép và quy tắc atlas.

Đây là đặc tả, chưa sinh PNG/SVG riêng hoặc tích hợp atlas. Các đường dẫn `assets/ui/...` là đầu ra dự kiến và được đánh dấu `specified_not_exported`; game hiện vẫn render CSS/DOM/SVG inline. Chữ và giá trị thay đổi không bake vào ảnh. YAML và tính hợp lệ của biên slice đã được kiểm tra; alpha thực, đường nối khi stretch và atlas cần kiểm tra sau khi xuất ảnh.

## Dev Drawer

Bấm **⚙ Dev** ở màn ngoài trận để mở bảng điều khiển; nút nổi được ẩn khỏi HUD chiến đấu. Có chuyển chế độ, +500 Bạc tích lũy, +60 Lộ phí trong chuyến, sinh đồ vào khay, tăng Tier toàn bộ đồ trên lưới, thắng/thua ngay, mô phỏng Auto Farm thêm một giờ reset lưới, chọn stage/vòng thử và đưa năng lượng về 0 để thử mua.

Reset lưới chuyển vật phẩm về khay và trả vòng về pha chuẩn bị; không xóa tài nguyên. Đặt lại toàn bộ demo có xác nhận riêng. Các thao tác Dev có thể bỏ qua giới hạn thông thường của giao chiến.

## Lưu tiến trình và Auto Farm

Tự lưu skin sở hữu, skin đã chọn, mảnh skin từng vũ khí/phẩm chất, kết quả gần nhất của từng stage/round, kích thước balo đã mua, năng lượng và thời điểm hồi, lượt mua năng lượng bằng Bạc trong ngày, Bạc, Linh thạch, Linh sa, mảnh, cấu hình Loadout, cấp nâng, đột phá, stage đã vượt và Auto Farm trong localStorage. Bản lưu mới dùng khóa `hanh-khach-ui-v2`, giữ nguyên bản lưu prototype cũ.

Auto Farm chỉ chạy stage đã thắng boss, thưởng Bạc/Linh sa/mảnh, tối đa 12 giờ, tích lũy cả online và offline. Không tiêu năng lượng, không đánh boss hoặc trao thưởng lớn lần đầu. Nhận quà chủ động, không phát lại thưởng cũ.

### Auto Farm · Bước 6

Sản lượng cố định theo stage, không phụ thuộc Loadout, luyện khí, đột phá hoặc diện tích balo. Ba stage đầu là nguồn chuyên biệt; hai stage sau là nguồn hỗn hợp. Không stage nào vượt tất cả stage khác ở cả ba tài nguyên.

| Stage | Thế mạnh | Bạc/giờ | Linh sa/giờ | Mảnh/giờ |
| --- | --- | ---: | ---: | ---: |
| Xích Sa Dịch Trạm | Bạc | 130 | 4 | 1,5 |
| Phế Tích Cơ Quan | Linh sa | 65 | 12 | 1,5 |
| Phong Khiếu Hiệp | Mảnh | 65 | 4 | 5 |
| Thanh Đăng Ốc Đảo | Bạc + Linh sa | 110 | 9 | 2 |
| Hắc Phong Cổ Thành | Linh sa + mảnh | 90 | 7 | 4 |

Đây là thông số thử, chưa khẳng định đã cân bằng kinh tế. Đối chiếu công thức cũ khi chưa nâng cấp: stage 1 cho 65/4/1,5 mỗi giờ; stage 2 cho 104/6,4/2,4; stage 3 cho 143/8,8/3,3; stage 4 cho 182/11,2/4,2; stage 5 cho 221/13,6/5,1. Mức mới tăng thế mạnh của các stage đầu và giảm một số nguồn thu khác để tạo lựa chọn. Hồ sơ có nhiều nâng cấp có thể giảm thu nhập tương lai vì đã bỏ hệ số Loadout; thưởng tích lũy trước chuyển đổi được bảo toàn. Chưa thay chi phí nâng cấp hoặc thưởng chiến đấu. Từ bước 10, mảnh chung dùng đột phá; mảnh skin là tài nguyên riêng chỉ rơi khi thắng boss trực tiếp.

Trang chủ có sản lượng mỗi giờ, bảng so sánh cả năm stage (ghi rõ stage chưa mở), thời gian tích lũy, thanh giới hạn 12 giờ và ba loại quà chờ nhận. Đổi stage chốt phần thời gian cũ theo stage cũ, giữ nguyên quà và thời gian đã tích lũy. Đủ 12 giờ thì dừng sinh thưởng; đổi stage không đặt lại giới hạn. Nhận quà cộng phần nguyên từng loại, giữ phần lẻ và bắt đầu khoảng tích lũy mới. Có thể nhận khi chỉ Linh sa hoặc mảnh đạt một đơn vị, không bắt buộc có Bạc.

Bảng nhận quà hiển thị thời gian và lượng thực nhận. Khi đủ điều kiện, có nút đến Luyện khí hoặc xem mở rộng balo; không tự chi tiền. Nút mở balo yêu cầu cả điều kiện boss lẫn Bạc, và ẩn khi đã mở tối đa. Nút Luyện khí yêu cầu đủ Bạc/Linh sa cho ít nhất một món đã sở hữu.

Bản lưu cũ được chuyển bằng `farm.version = 2`: chốt phần thời gian chưa tính theo công thức cũ và Loadout đã lưu đúng một lần, trong giới hạn 12 giờ còn lại; giữ quà, tài nguyên và tiến trình. Những khoảng tiếp theo dùng sản lượng mới. Đồng hồ lùi không được hạ mốc thời gian khi nhận quà để tránh tính lại một khoảng đã nhận. Vẫn là mô phỏng thu nhập trên đồng hồ thiết bị, chưa có backend chống chỉnh giờ.

Lượt đang chơi, Tier ghép, vật phẩm trong khay, hàng Shop và kết quả rương đưa vào khay được đặt lại khi tải trang. Đây là prototype cục bộ, chưa có backend hoặc đồng bộ nhiều tab/thiết bị. Auto Farm dùng đồng hồ thiết bị. Bối cảnh chiến trường dùng chung; boss có hình dạng khác nhau theo vùng. Âm thanh và bộ animation sản xuất chưa nằm trong bản này.

## Kiểm thử

```sh
node --test tests/game.test.cjs tests/stage-benchmark.test.cjs tests/playtest.test.cjs
```

149 kiểm thử (128 luật game, 5 bộ mô phỏng, 16 nhật ký chơi thử) đọc trực tiếp engine trong `index.html`: diện tích/va chạm, ghép, xoay, biên lưới, khóa chiến đấu, Shop, bán, tách hai loại tiền, chống bán đồ khởi đầu lấy Bạc, giữ tiền khi thử lại, hết hạn Lộ phí, lựa chọn tiếp tế và nhận thưởng một lần, giáp/hồi máu/tăng tốc, thắng/thua, phần thưởng, boss, ngũ hành, mục tiêu cận/xa, hồi/mua/tiêu năng lượng, mở balo, ô khóa, preview ghép, thống kê giao chiến, so sánh và gợi ý dựa trên số liệu, chuyển bản lưu cũ, Auto Farm và đột phá.
