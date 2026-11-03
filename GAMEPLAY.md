# Pack and Clash Explorer — Đặc tả gameplay

Ngày cập nhật: 03/11/2026.

## Quy tắc hiện hành của prototype 02

Yêu cầu mới trong file người dùng gửi ngày 03/11/2026 được ưu tiên cho `index.html`. Các phần chi tiết phía dưới lưu thiết kế trước đó và cần đọc cùng bảng thay đổi này.

| Hạng mục | Prototype 02 hiện hành |
| --- | --- |
| Mỹ thuật | Nền đen huyền và nâu gỗ cháy, viền hổ phách, điểm nhấn ngọc bích và chu sa |
| Kích thước | 390×844, năm vùng cố định 48/210/280/190/116 px; màn chiến đấu không cuộn |
| Lưới | Đủ 25 ô khả dụng, tọa độ hàng/cột 0–4 để thử hệ thống đa ô |
| Xoay | Cho phép xoay 90° với vật phẩm chữ nhật nếu vị trí sau xoay hợp lệ |
| Pha chiến đấu | Khóa đặt, di chuyển, ghép, xoay, mua, bán và reroll; chỉ xem thông tin |
| Tương tác | Ngưỡng kéo 6 px, preview xanh/hổ phách/đỏ, trả về vị trí cũ khi không hợp lệ |
| Trang bị | 6 loại, đủ 1×1, 1×2, 2×1, 2×2; có sát thương, giáp, hồi máu và tăng tốc |
| Thương điểm | 3 ô mua, đổi hàng giá 10 Bạc, khóa hàng qua vòng và vùng kéo bán |
| Ngoài trận | 5 tab, bản đồ node, nâng chỉ số, đột phá, 3 loại rương |
| Tài nguyên | Bạc, Linh thạch, Linh sa và mảnh trang bị; giá và tỷ lệ là dữ liệu prototype |
| Dev | Chuyển chế độ, thêm tài nguyên/vật phẩm, tăng Tier, thắng/thua và reset lưới |

Cooldown độc lập, ghép tối đa Tier III, thưởng lần đầu duy nhất và Auto Farm tối đa 12 giờ tiếp tục được giữ. Lưới mở từng ô và thao tác trong lúc giao chiến của thiết kế cũ không được áp dụng trong prototype 02.



Game màn hình dọc kết hợp sắp xếp balo trên lưới, ghép trang bị và chiến đấu tự động, lấy bối cảnh hoang mạc mang đậm văn hóa Á Đông và tiên hiệp. Nhân vật chính là lãng khách trùng sinh làm thợ săn trong thế giới tu tiên, mang hòm hàng và thẻ tiêu cục. Người chơi tự vượt stage để nhận thưởng lần đầu, mở khóa nguồn Auto Farm và dùng tài nguyên nâng cấp trang bị, mở rộng balo.

Đặc tả tổng hợp Prompt.md và các lựa chọn trong cuộc trao đổi. Các quyết định trực tiếp của người chơi được ưu tiên khi khác với đề xuất ban đầu. Các quy tắc bổ sung và thông số thử nghiệm được đánh dấu riêng ở cuối tài liệu.

## 1. Vòng lặp chơi trực tiếp đã chốt

1. Chọn tối đa 3 loại trang bị trong Loadout, bao gồm vũ khí và trang bị hỗ trợ.
2. Chọn stage, xem trước phần thưởng lớn lần đầu và các phần thưởng có thể nhận khi chơi lại.
3. Bắt đầu với vật phẩm trong trận được đặt lại; giữ tiền, bộ sưu tập, nâng cấp chỉ số và các ô đã mua.
4. Đánh các round quái thường. Mỗi round có một nhóm quái; số lượng có thể tăng theo cấp round.
5. Thắng round nhận đồ tiếp tế thuộc Loadout vào khay, sắp xếp hoặc ghép đồ rồi chủ động bấm tiếp tục.
6. Đánh boss ở round cuối để hoàn thành stage và nhận thưởng.

Một stage hướng tới 5 round, gồm 4 round thường và 1 round boss; thời lượng chiến đấu mục tiêu khoảng 3–5 phút. Khoảng nghỉ sắp xếp do người chơi quyết định.

Người chơi được kéo thả và ghép đồ trong lúc đánh; chiến đấu không tạm dừng vì thao tác. Giữa các round, trận chỉ tiếp tục sau khi người chơi bấm nút.

Tiếp tế được trao khi thắng round, thay thế đề xuất sinh đồ tự động theo thời gian.

## 2. Balo và ghép trang bị đã chốt

- Lưới khởi đầu có 3×3 ô, mở rộng tối đa trong vùng 5×5.
- Dùng tiền mua thêm ô ngoài trận; ô đã mua được giữ vĩnh viễn.
- Độ khó stage tăng để người chơi cần phát triển cả số ô và sức mạnh trang bị. Không mặc định mọi stage đều vượt được bằng lưới 3×3.
- Loadout gồm tối đa 3 loại trang bị. Khay có thể cấp nhiều bản sao của từng loại đã chọn.
- Không xoay vật phẩm.
- Hai món cùng loại, cùng Tier có thể ghép thành một món Tier kế tiếp, tối đa Tier 3 cho bản đầu.
- Ghép tăng chỉ số, giữ kích thước và công dụng cơ bản.
- Kéo lên món khác loại hoặc thả vào vị trí không hợp lệ sẽ trả món về vị trí cũ.
- Di chuyển giữ nguyên tiến độ hồi chiêu. Ghép kế thừa tiến độ thấp hơn của hai món.
- Chiến thuật bản đầu tập trung vào diện tích balo và tỷ lệ công, thủ, hồi phục; chưa cần hiệu ứng cộng hưởng theo vị trí.

| Trang bị mẫu | Kích thước | Công dụng |
| --- | --- | --- |
| Kiếm | 1×2 | Gây sát thương theo cooldown |
| Khiên | 2×2 | Tạo Block theo cooldown |
| Bình máu | 1×1 | Hồi HP theo cooldown, dùng lặp lại |

## 3. Chiến đấu đã chốt

Mỗi trang bị có bộ đếm hồi chiêu riêng và tự kích hoạt. Các quái trong cùng một round cùng tham gia chiến đấu. Số lượng và sức mạnh quái được cấu hình theo stage và round.

Khiên và bình máu không biến mất sau một lần sử dụng. Hệ thống cần tính sát thương, HP, Block và hồi phục, đồng thời hiển thị tiến độ hồi chiêu từng món.

Nâng cấp ngoài trận tăng trực tiếp chỉ số gốc của loại trang bị, không tăng Tier khởi đầu. Tier có được bằng ghép chỉ tồn tại trong lượt đánh stage hiện tại.

## 4. Phần thưởng đã chốt

| Nguồn | Phần thưởng | Điều kiện |
| --- | --- | --- |
| Round quái thường khi chơi trực tiếp | Đồ tiếp tế cho lượt đánh hiện tại | Thắng round |
| Boss khi chơi trực tiếp | Tiền và đồ nhỏ ngẫu nhiên, có thể gồm nguyên liệu, mảnh và trang bị hoàn chỉnh | Thắng boss |
| Hoàn thành stage lần đầu | Phần thưởng lớn cố định theo stage, hiển thị trước trận | Chỉ một lần cho mỗi stage |
| Chơi lại stage | Tiền và đồ ngẫu nhiên theo độ khó stage | Không lặp lại thưởng lớn lần đầu |
| Auto Farm | Tiền, nguyên liệu và mảnh trang bị | Tích lũy theo hiệu suất farm |

Phần thưởng lớn có thể là trang bị, gói nguyên liệu hoặc phần thưởng đặc biệt tùy stage. Chất lượng và lượng thưởng chơi lại phụ thuộc độ khó stage; không tự tăng vô hạn theo số lần hoàn thành cùng một stage.

Phân biệt đồ tiếp tế sử dụng trong lượt đánh với tài nguyên và trang bị được thêm vào kho ngoài trận. Đồ trong trận được đặt lại khi vào lượt mới; phần thưởng ngoài trận đã nhận được giữ lại.

## 5. Auto Farm đã chốt

### Chọn stage và vòng lặp

- Chỉ được chọn stage đã thắng boss ít nhất một lần.
- Auto Farm lặp các round quái thường của stage đã chọn.
- Hết round thường cuối cùng thì quay về round thường đầu tiên; không giao chiến với boss.
- Không hoàn thành stage thay người chơi, không nhận thưởng boss và không nhận thưởng thắng lần đầu.

### Hiệu suất và phần thưởng

- Hiệu suất được tính từ Loadout, nâng cấp trang bị ngoài trận và số ô balo đã mở.
- Không dùng bản sao bố trí hoặc Tier ghép của một trận đang chơi để tính farm.
- Hiển thị tiền mỗi giờ và mức rơi tài nguyên dự kiến để người chơi chọn stage.
- Chỉ nhận tiền, nguyên liệu và mảnh trang bị; không rơi trang bị hoàn chỉnh.
- Auto Farm không tự ghép đồ hoặc tự tiêu tiền.

### Tích lũy và nhận quà

- Auto Farm tiếp tục tích lũy cả khi offline lẫn online, kể cả lúc người chơi đang chơi stage khác.
- Thời gian tích lũy tính từ lần nhận thưởng Auto Farm gần nhất; lần đầu tính từ khi kích hoạt farm.
- Mỗi chu kỳ chỉ tích lũy tối đa 12 giờ.
- Khi đủ 12 giờ, dừng cộng thêm phần thưởng cho tới khi người chơi nhận quà.
- Nhận thưởng xong bắt đầu chu kỳ tích lũy mới; không chuyển thời gian vượt giới hạn sang chu kỳ sau.
- Khi trở lại game, hiển thị thời gian tích lũy và phần thưởng để người chơi nhận.

## 6. Hệ thống ngoài trận

| Tab | Chức năng |
| --- | --- |
| Home | Nhân vật, tiến trình, vào trận nhanh và trạng thái Auto Farm |
| Stage | Chọn màn, xem thưởng lần đầu, thưởng chơi lại và chọn stage farm đủ điều kiện |
| Balo | Bộ sưu tập, chọn tối đa 3 loại cho Loadout và mở thêm ô bằng tiền |
| Upgrade | Dùng tài nguyên tăng chỉ số gốc của từng loại trang bị |
| Chest | Rương Thường, Hiếm, Sử thi để bổ sung bộ sưu tập |

## 7. Phạm vi triển khai

### Demo HTML đơn lẻ

Ưu tiên duyệt bố cục dọc, kéo thả, ghép, phản hồi vị trí không hợp lệ và độ rõ ràng của cooldown. Demo chiến đấu cần thể hiện nhóm quái, cấp tiếp tế sau round, khoảng nghỉ chủ động và boss cuối stage.

Các giá trị dùng thử cần dễ chỉnh. Có thể dùng giao diện tối thiểu và dữ liệu mẫu để thử mua ô, phần thưởng lần đầu và Auto Farm trước khi triển khai đầy đủ hệ thống ngoài trận.

### Phase 1

Core combat, nhóm quái, boss, lưới 3×3 đến 5×5, khay tiếp tế, kéo thả, ghép, hồi chiêu độc lập và kết quả stage.

### Phase 2

Năm tab ngoài trận, kho và Loadout, nâng chỉ số, mua ô vĩnh viễn, rương, tiến trình stage, Auto Farm và lưu tiến trình.

Engine chính thức chưa chọn giữa Godot, Cocos và Unity. Phong cách và nhân vật theo mục 11, thay thế hướng Chuột túi trong Prompt.md. Mốc năm 2150 không được sử dụng làm mốc đã chốt; dàn NPC chưa xác định.

## 8. Quy tắc đề xuất để triển khai và kiểm thử

Các quy tắc sau bổ sung chi tiết kỹ thuật; có thể điều chỉnh khi duyệt demo.

- Khi nhận thưởng Auto Farm, cộng phần thưởng và cập nhật mốc nhận trong cùng một thao tác lưu để thao tác lặp không phát thưởng hai lần.
- Khi đổi stage farm, Loadout, nâng cấp hoặc mua ô, chốt phần thưởng đã tích lũy theo cấu hình cũ, sau đó áp dụng hiệu suất mới. Không áp dụng cấu hình mới ngược về thời gian đã trôi qua.
- Đổi cấu hình farm không đặt lại mốc nhận quà hoặc giới hạn 12 giờ. Chỉ thao tác nhận quà mới mở chu kỳ mới.
- Phần thưởng đang chờ nhận phải giữ nguyên khi tải lại game; không quay lại kết quả ngẫu nhiên mỗi lần mở màn hình.
- Trong demo cục bộ, dùng thời gian lưu trên thiết bị để thử offline. Bản phát hành cần nguồn thời gian đáng tin cậy nếu tiến trình và kinh tế có giá trị trực tuyến.
- Mua ô theo vị trí liền kề vùng đã mở; chi phí tăng dần.
- Vũ khí mặc định tập trung vào quái đứng trước. Bình máu chỉ kích hoạt khi thiếu HP. Block bị trừ trước HP và có trần tích lũy.
- Nhận 2–3 món tiếp tế sau một round; cho phép bán món không cần với giá nhỏ. Cần xác định sức chứa khay và xử lý khi khay đầy.

## 9. Thông số cần cân bằng khi chơi thử

Chưa coi các con số sau là cân bằng cuối cùng: giá mở từng ô, lượng đồ đầu trận, giới hạn khay, mức tăng chỉ số theo Tier, cooldown, HP và Block, số quái từng round, bảng rơi đồ, chi phí Upgrade và công thức hiệu suất Auto Farm.

Mức tăng khoảng 70% hiệu lực mỗi Tier là một giá trị thử nghiệm từ đề xuất ban đầu. Hiệu suất Auto Farm cần so sánh với phần thưởng chơi trực tiếp; tránh để phần thưởng nền làm mất động lực tự vượt stage.

## 10. Tiêu chí nghiệm thu gameplay

- Thả sai vị trí không mất đồ; ghép chỉ thành công với hai món cùng loại và cùng Tier dưới Tier tối đa.
- Di chuyển không làm mới cooldown; ghép không tạo đòn kích hoạt tức thì ngoài quy tắc tiến độ đã chốt.
- Quái thường xuất hiện theo nhóm và tiếp tế chỉ được cấp sau khi thắng round.
- Round tiếp theo không tự bắt đầu trong chế độ chơi trực tiếp.
- Ô đã mua và nâng cấp ngoài trận còn sau khi bắt đầu stage khác; Tier ghép trong trận được đặt lại.
- Thắng boss lần đầu nhận thưởng lớn đúng một lần; chơi lại nhận thưởng thường.
- Stage chưa thắng boss không thể được chọn cho Auto Farm.
- Auto Farm không đánh boss, không rơi trang bị hoàn chỉnh và vẫn tích lũy khi đang chơi trực tiếp.
- Sau 15 giờ không nhận quà, chỉ nhận lượng thưởng tương ứng tối đa 12 giờ.
- Nhận quà hai lần liên tiếp không phát lại cùng phần thưởng.
- Đổi stage farm hoặc nâng cấp không tăng phần thưởng hồi tố và không vượt giới hạn tích lũy.

## 11. Phong cách và hệ thống nhân vật

### Các lựa chọn đã chốt

- Bối cảnh: hoang mạc cơ khí pha võ hiệp, thiên về văn hóa Á Đông và phát triển theo hướng tiên hiệp.
- Hành trình: giữ cấu trúc năm vùng Trạm Cát Đỏ, Bãi Máy Cũ, Hẻm Núi Gió, Ốc Đảo Đèn Lồng và Pháo Đài Bão Cát; điều chỉnh tên và mỹ thuật cho phù hợp tiên hiệp.
- Tạo hình: 2D cartoon có khối nhẹ, hình dáng rõ, đổ bóng đơn giản.
- Màu chủ đạo: cát ấm, đất đỏ, nâu da; xanh ngọc làm điểm nhấn.
- Không khí: khắc nghiệt nhưng cách điệu, thế giới thiếu thốn, nhân vật mang dấu vết chiến đấu và câu chuyện nghiêm túc.
- Nhân vật chính: lãng khách trùng sinh làm thợ săn trong thế giới tiên hiệp; thay hoàn toàn nhân vật Chuột túi.
- Trang phục nhận diện: áo vải ngắn, băng quấn tay, đai lưng, hòm hàng sau lưng và thẻ tiêu cục.
- Kẻ địch: quái thường, tinh anh và boss cuối stage; cùng vùng có liên kết về chủ đề.
- Hệ sinh vật: đa dạng theo truyền thuyết Trung Hoa; dựa trên mô tả kích thước trong truyền thuyết để định hướng phân cấp quái.

### Diễn giải mỹ thuật đề xuất

Thế giới nằm trên tuyến thương lộ xuyên hoang mạc, nơi tiêu cục đưa hàng giữa thành trấn và tông môn. Di tích cơ khí thuộc một nền văn minh tu tiên suy tàn: cơ quan bằng gỗ, đồng và đá, vận hành bằng linh thạch và phù văn. Đây là cách kết hợp hướng cơ khí đã chọn với tiên hiệp Á Đông.

Kiến trúc dùng mái ngói, cổng quan, tường đất, cờ tiêu cục, đèn lồng và bia đá. Chất liệu chủ đạo là vải thô, da cũ, gỗ, đồng xỉn và ngọc. Cảnh vật có bụi, dấu phong hóa và vết hư hại để tạo cảm giác khắc nghiệt; giao diện và vật phẩm vẫn rõ ở kích thước nhỏ.

Không khí nghiêm túc được thể hiện qua tuyến đường nguy hiểm, đơn hàng thất lạc, trạm dịch bỏ hoang và hiểm họa yêu thú. Tạo hình cartoon không mặc định nhân vật phải chibi hoặc hành xử hài hước.

| Thành phần | Màu đề xuất | Vai trò |
| --- | --- | --- |
| Nền cát | #C9A66B | Nền môi trường, giấy và bản đồ |
| Đất đỏ | #9C5038 | Địa hình, kiến trúc, vùng nguy hiểm |
| Nâu đậm | #352C28 | Viền, gỗ, da và chữ trên nền sáng |
| Xanh ngọc | #48A99B | Linh lực, phù văn và thao tác chính |
| Vải ngà | #E5D5B5 | Trang phục và mảng sáng |
| Đỏ son | #B44339 | Cảnh báo đòn đánh, dấu ấn và sát thương |

Các mã màu là giá trị thử nghiệm. Màu phẩm chất đồ đi kèm viền hoặc ký hiệu; hiệu ứng không che lấp cooldown và vùng thả đồ.

### Nhân vật chính đề xuất

Tạo hình ban đầu là người phàm trẻ tuổi bước vào con đường tu luyện; giới tính, tên và tuổi cụ thể chưa chốt. Tỷ lệ cơ thể gọn, khuôn mặt đủ nghiêm túc, tay chân rõ khi thu nhỏ. Áo vải ngắn màu ngà sẫm, quần nâu, băng tay cũ, đai lưng xanh ngọc; thẻ tiêu cục bằng gỗ hoặc đồng đeo ở hông. Hòm hàng có khung gỗ, đai sắt và phù niêm phong.

Vai trò đề xuất: nhận hợp đồng săn yêu để kiếm tài nguyên, đồng thời áp tiêu qua các vùng nguy hiểm. Tiền kiếp, nguyên nhân trùng sinh và ký ức giữ lại là các chi tiết cốt truyện chưa chốt. Không mặc định nhân vật từng là tiên đế hoặc có sức mạnh áp đảo từ đầu.

Hòm hàng là hình ảnh đại diện cho lưới balo. Hoạt ảnh mở hòm, rút binh khí và kích hoạt phù văn gắn nhân vật với việc quản lý trang bị. Vũ khí, vật phẩm tạo Block và bình hồi phục giữ cơ chế gameplay đã chốt; tên gọi tiên hiệp có thể dùng linh kiếm, hộ thuẫn và bình đan dược.

### Chuyển thể năm vùng đề xuất

Tên vùng và danh sách địch dưới đây là nội dung thiết kế cho game, chưa phải danh sách sinh vật đã được duyệt hoặc lời khẳng định rằng chúng cùng xuất hiện tại một địa điểm trong truyền thuyết.

| Vùng ban đầu | Tên chuyển thể | Cảnh quan và nhóm địch |
| --- | --- | --- |
| Trạm Cát Đỏ | Xích Sa Dịch Trạm | Quán trọ, cổng quan, miếu cát; thú hoang, yêu thú nhỏ và kẻ cướp đường |
| Bãi Máy Cũ | Phế Tích Cơ Quan | Lò luyện bỏ hoang, tượng đồng, bánh răng cổ; cơ quan hỏng và yêu vật chiếm di tích |
| Hẻm Núi Gió | Phong Khiếu Hiệp | Cầu treo, vách đá, cờ rách; chim yêu và thú phục kích |
| Ốc Đảo Đèn Lồng | Thanh Đăng Ốc Đảo | Chợ đêm, hồ nước, đền cổ; hồ yêu, thủy quái và yêu vật cải trang |
| Pháo Đài Bão Cát | Hắc Phong Cổ Thành | Thành lũy bị vùi lấp, trận pháp phong ấn; yêu thú lớn và boss bảo vệ bí mật cổ thành |

Demo ưu tiên Xích Sa Dịch Trạm. Các địa danh chuyển thể là tên sáng tác, có thể đổi khi duyệt hình ảnh.

### Kích thước truyền thuyết và cấp bậc quái

Kích thước là căn cứ chính cho quy mô tạo hình và sức ép thị giác, không tự động quyết định toàn bộ sức mạnh. Lưu riêng nhóm kích thước, vai trò chiến đấu và mức độ khó của stage. Một yêu vật nhỏ có pháp thuật mạnh vẫn có thể là tinh anh hoặc boss; chỉ sử dụng ngoại lệ khi phù hợp thiết kế cụ thể.

| Nhóm kích thước đề xuất | Vai trò thường dùng | Cách thể hiện trên màn hình dọc |
| --- | --- | --- |
| Nhỏ | Quái thường theo nhóm | Hiện đủ thân, số lượng tăng theo round |
| Cỡ người hoặc thú lớn | Thường mạnh hoặc tinh anh | Hình dáng nổi bật hơn, ít cá thể hơn |
| Khổng lồ | Boss cuối stage hoặc vùng | Chiếm phần lớn khu vực chiến đấu; đòn đánh có dấu hiệu rõ |
| Quy mô thần thoại | Đại cảnh, sự kiện hoặc boss đặc biệt trong tương lai | Thể hiện một phần cơ thể, bóng hoặc khoảng cách; không thu nhỏ tùy tiện để ngang quái thường |

Không tự đặt số đo mét và gán là số liệu từ truyền thuyết. Khi nguồn chỉ nói hình dáng tương tự một loài, tỷ lệ cụ thể trong game là quyết định mỹ thuật. Các mức ở bảng là quy ước thiết kế, không phải hệ thống phân cấp cổ truyền.

Ba ví dụ định hướng cần phân biệt giữa nguồn và chuyển thể:

- Cửu Vĩ Hồ: Nam Sơn Kinh mô tả sinh vật giống cáo, có chín đuôi; đoạn này không cung cấp chiều cao cụ thể. Có thể đề xuất hồ yêu làm tinh anh hoặc boss pháp thuật, nhưng không khẳng định bản gốc mô tả nó khổng lồ. Nguồn: [Sơn Hải Kinh, Nam Sơn Kinh](https://ncc.uedu.tw/shanhaijing/juan/nanshan).
- Ba Xà: Hải Nội Nam Kinh mô tả rắn ăn voi. Chi tiết này làm cơ sở đề xuất tạo hình đại xà và vai trò boss lớn, không suy ra chiều dài chính xác. Nguồn: [Sơn Hải Kinh, Hải Nội Nam Kinh](https://ncue.uedu.tw/shanhaijing/juan/hainei-nan).
- Côn Bằng: Tiêu Dao Du mô tả Côn và Bằng ở quy mô hàng nghìn lý. Đề xuất dành hình tượng này cho đại cảnh hoặc nội dung cấp cao về sau; không đưa vào làm boss nhỏ của demo. Nguồn: [Trang Tử, Tiêu Dao Du](https://ctext.org/zhuangzi/enjoyment-in-untroubled-ease).

Mỗi mục trong danh sách quái khi triển khai cần ghi tên, nguồn truyền thuyết, mô tả kích thước, phần sáng tác thêm, vùng xuất hiện và vai trò chiến đấu. Các ví dụ hồ yêu hoặc cơ quan do game sáng tác phải được phân biệt với sinh vật có tên và mô tả cụ thể trong cổ thư.
