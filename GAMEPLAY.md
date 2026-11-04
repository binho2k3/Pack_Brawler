# Pack and Clash Explorer — Đặc tả gameplay

Ngày cập nhật: 04/11/2026.

## Quy tắc hiện hành của prototype 02

Yêu cầu mới trong file người dùng gửi ngày 03/11/2026 được ưu tiên cho `index.html`. Các phần chi tiết phía dưới lưu thiết kế trước đó và cần đọc cùng bảng thay đổi này.

| Hạng mục | Prototype 02 hiện hành |
| --- | --- |
| Mỹ thuật | Nền đen huyền và nâu gỗ cháy, viền hổ phách, điểm nhấn ngọc bích và chu sa |
| Kích thước | 390×844, năm vùng cố định 48/210/280/190/116 px; màn chiến đấu không cuộn |
| Lưới | Khởi đầu 3×3; mua 4×4 bằng 500 Bạc sau boss 1, mua 5×5 bằng 1.500 Bạc sau boss 3; khung tọa độ 0–4 |
| Xoay | Cho phép xoay 90° với vật phẩm chữ nhật nếu vị trí sau xoay hợp lệ |
| Pha chiến đấu | Khóa đặt, di chuyển, ghép, xoay, mua, bán và reroll; chỉ xem thông tin |
| Tương tác | Ngưỡng kéo 6 px, preview xanh/hổ phách/đỏ, trả về vị trí cũ khi không hợp lệ |
| Trang bị | 8 loại, đủ 1×1, 1×2, 2×1, 2×2; có sát thương, giáp, hồi máu và tăng tốc |
| Thương điểm | 3 ô mua bằng Lộ phí, đổi hàng giá 10 Lộ phí, khóa hàng qua vòng và vùng kéo bán |
| Tiếp tế | Thắng round thường chọn 1/3 gói, mỗi gói 3 món Tier I; bảo đảm một gói thuộc Loadout, không đổi danh sách |
| Ngoài trận | 5 tab, bản đồ node, nâng chỉ số, đột phá, 3 loại rương |
| Tài nguyên | Năng lượng 30, hồi 1/5 phút, mỗi lần xuất phát tốn 5; Lộ phí riêng trong chuyến; Bạc tích lũy, Linh thạch, Linh sa và mảnh trang bị; giá và tỷ lệ là dữ liệu prototype |
| Dev | Chuyển chế độ, thêm tài nguyên/vật phẩm, tăng Tier, thắng/thua và reset lưới |

Cooldown độc lập, ghép tối đa III khi chưa có skin (vũ khí có skin mở đến VII), thưởng lần đầu duy nhất và Auto Farm tối đa 12 giờ tiếp tục được giữ. Mở rộng theo mốc thay cho mua từng ô; thao tác trong lúc giao chiến của thiết kế cũ không được áp dụng trong prototype 02.


### Kinh tế bước 1 đã chốt

Mỗi chuyến mới nhận 60 Lộ phí để mua, bán và đổi Shop (10 Lộ phí/lần). Bán đồ chỉ tăng Lộ phí, không tăng Bạc. Chưa cấp thêm Lộ phí theo round; nguồn bổ sung là bán vật phẩm.

Qua round hoặc thử lại vòng thua giữ Lộ phí còn lại, không cấp lại tiền khởi đầu. Thắng boss hoặc bỏ chuyến để nhận chuyến mới làm Lộ phí dư hết hiệu lực, không đổi sang Bạc. Về màn ngoài trận rồi tiếp tục từ Trang chủ giữ nguyên chuyến. Tải lại trang tạo chuyến mới theo giới hạn lưu hiện tại.

Bạc dùng cho hệ thống ngoài trận. Bạc và nguyên liệu đã nhận ở các round thắng được giữ khi thua hoặc bỏ chuyến. Thưởng boss chỉ trao khi thắng boss, thưởng lớn chỉ trao lần đầu. Lượng thưởng hiện có chưa đổi trong bước này.

### Tiếp tế bước 2 đã chốt

Thay tự nhận 3 món ngẫu nhiên bằng chọn 1 trong 3 gói sau mỗi round thường. Mỗi gói có 3 món Tier I và hiển thị rõ loại, kích thước, nguồn trong/ngoài Loadout. Các gói thiên về tấn công, phòng thủ và hỗ trợ; hai món đầu được chọn theo vai trò khi bộ sưu tập có loại đó.

Ít nhất một gói hoàn toàn thuộc Loadout. Các gói còn lại ưu tiên Loadout cho món theo vai trò và có thể thêm loại đã mở khóa bên ngoài. Không đưa loại chưa mở vào tiếp tế. Danh sách được cố định khi thắng, không đổi miễn phí hoặc trả phí. Chọn không tốn tiền, chỉ cấp đúng một gói một lần vào khay, rồi sang pha sắp xếp của vòng sau. Không tự bắt đầu giao chiến.

Thua hoặc thử lại không cấp tiếp tế mới; boss không có gói tiếp tế và giữ phần thưởng hiện hành. Chưa thay HP, giáp, cooldown, sức mạnh địch hoặc cơ chế ghép. Chưa chuẩn hóa tổng giá trị mua/bán của các gói; cần đánh giá lựa chọn khi chơi thử.

### Chiến đấu bước 3 và phần bổ sung đã chốt

- Áp dụng cơ chế khác nhau cho ba stage đầu: Xích Sa nhiều quái nhỏ; Phế Tích có giáp giảm theo đòn; Phong Khiếu có đòn mạnh tích lực. Stage 4–5 giữ cơ chế cũ.
- Boss Yêu Hồ gọi thêm quái mỗi 8 giây (tối đa 2 viện binh còn sống); Khôi Lỗi có giáp 18 trong 6 giây rồi hở giáp 4 giây; Yêu Điểu đánh mạnh mỗi 8 giây với báo trước 2 giây. Quái Phong Điểu thường dùng chu kỳ 6 giây.
- Xem số lượng, hệ và cơ chế vòng kế tiếp ngay khi chọn tiếp tế; xem lại vòng hiện tại ở sân đấu. Nội dung preview và địch khi vào trận dùng chung nguồn dữ liệu.
- Ngũ hành cố định: Kim → Mộc → Thổ → Thủy → Hỏa → Kim (mũi tên là khắc). Đúng khắc ×1,2 sát thương; chiều bất lợi ×0,9; quan hệ khác ×1. Áp dụng lên sát thương vũ khí trước giáp và khiên. Giáp để lọt ít nhất 20% (làm tròn, tối thiểu 1).
- Bốn hướng vũ khí: kiếm Kim cận nhanh (24/1,8s), trọng đao Hỏa cận mạnh (48/3,4s), phi châm Mộc xa nhanh (14/1,1s), nỏ Thủy xa mạnh (37/2,8s). Cận đánh địch còn sống phía trước; xa đánh phía sau. Địch có đủ năm hệ; chưa có vũ khí Thổ trong bộ bốn hướng này. Đồ hỗ trợ và nhân vật chưa mang hệ.
- **Lựa chọn năng lượng mới nhất của người dùng:** thu 5 điểm mỗi lần xuất phát, bao gồm round kế tiếp và thử lại. Không áp dụng đề xuất thu một lần cho cả chuyến.
- Năng lượng tối đa 30; hồi 1/5 phút cả offline; không tích thời gian khi đầy. Auto Farm không tốn. Chọn stage, tiếp tế và sắp xếp không tốn; không đủ 5 thì không vào combat.
- Mua +10 bằng 100 Bạc (3 lần/ngày, đặt lại 00:00 UTC+7) hoặc 5 Linh thạch. Chỉ mua khi không vượt 30. Giữ tách biệt Lộ phí. Bản lưu lâu dài có năng lượng, thời điểm hồi và bộ đếm mua theo ngày; bản lưu cũ được chuyển tự động, không mất nâng cấp hay tài nguyên.
- Bản demo vẫn không lưu chuyến đang chơi; tải lại không hoàn phí đã dùng. Các thao tác Dev thắng/thua ngay phục vụ kiểm thử và bỏ qua phí, nút Xuất phát vẫn thu đúng 5.


### Balo và preview ghép bước 4 đã chốt

- Mỗi hồ sơ bắt đầu balo 3×3 (9 ô); mua lần lượt 4×4 (500 Bạc + thắng boss stage 1), rồi 5×5 (1.500 Bạc + thắng boss stage 3). Giữ vĩnh viễn, áp dụng ngay cho chuyến hiện tại; không tiêu Lộ phí.
- Tab Hòm tiêu hiển thị vùng ô đã mở, vùng mở thêm, giá và điều kiện trước khi mua. Ô khóa trong khung 5×5 không nhận bất kỳ phần diện tích nào của vật phẩm, kể cả khi xoay hoặc ghép.
- Bản lưu cũ chưa có trường kích thước balo được chuyển về 3×3, giữ tài nguyên, nâng cấp và các boss đã vượt. Đồ khởi đầu không vừa chuyển về khay. Chưa thay công thức Auto Farm theo diện tích.
- Giữ hệ số ghép 1,7, Tier tối đa III, vị trí/hướng của món đích và cooldown thấp hơn. Kéo lên mục tiêu hợp lệ hiện preview, thả là ghép, không có bước xác nhận thêm.
- Preview gồm diện tích hai món trước/sau, chỉ số lý thuyết tương ứng công/thủ/hồi phục, số ô giải phóng thực tế và tiến độ cooldown. Chỉ so sánh −15% khi giả định hai món cùng hoạt động. Món từ khay chưa chiếm ô hoặc gây hiệu lực trên lưới; UI ghi rõ lợi ích thực tế của trường hợp này.
- Phù tăng tốc hiển thị mức hiệu ứng mạnh nhất trước/sau và giải thích không cộng dồn, không dùng phép cộng hai mức tăng tốc để báo giảm 15%.
- Dev thử nhanh cả ba kích thước trong pha chuẩn bị; thu nhỏ chuyển món vượt vùng về khay và không sửa kích thước vĩnh viễn.


### Kết quả và gợi ý bước 5 đã chốt

- Bảng tóm tắt sau từng round; mở rộng để xem đóng góp từng món. Ghi thời gian mô phỏng, sát thương thực vào HP địch, HP nhân vật bị mất, khiên hấp thụ, hồi hữu ích và đòn kết liễu.
- Chi tiết phân biệt giáp/khiên địch, lợi thế/bất lợi hệ, hồi dư, khiên vượt trần, khiên mang từ vòng trước và số lần kích hoạt. Không tính đồ trong khay hoặc sát thương dư khi hạ địch vào DPS thực.
- Tối đa hai gợi ý dựa trên dữ liệu: đòn tích lực kết liễu, giáp giảm nhiều sát thương, hệ bất lợi, hồi dư hoặc thiếu khiên. Mỗi gợi ý có số liệu hỗ trợ; không đủ bằng chứng thì không mặc định yêu cầu đổi đồ/nâng cấp.
- Lưu kết quả hoàn tất gần nhất của từng cặp stage/round (tối đa 25 mục), giữ qua tải trang. Trận mới so sánh với đúng cặp stage/round trước đó; bảng so sánh gọn được lưu cùng kết quả, không lưu chuỗi trận vô hạn.
- So sánh có cảnh báo ngữ cảnh: đổi trang bị/Tier/bố trí, cấp luyện khí/đột phá, kích thước balo hoặc HP/khiên/tăng tốc/cooldown đầu trận. Không khẳng định thời gian ngắn hơn luôn tốt, nhất là khi vẫn thua.
- Trang chủ mở lại báo cáo; xem báo cáo không trao thưởng hoặc khởi chạy trận. Luồng thắng round → kết quả → chọn tiếp tế → sắp xếp; thua → kết quả → chuẩn bị lại.
- Thống kê đặt lại mỗi round/lần thử. Trận bỏ dở không ghi vào nhật ký; kết quả ép bằng Dev và chỉnh Tier giữa trận không dùng cho gợi ý hoặc so sánh với trận thật.


Game màn hình dọc kết hợp sắp xếp balo trên lưới, ghép trang bị và chiến đấu tự động, lấy bối cảnh hoang mạc mang đậm văn hóa Á Đông và tiên hiệp. Nhân vật chính là lãng khách trùng sinh làm thợ săn trong thế giới tu tiên, mang hòm hàng và thẻ tiêu cục. Người chơi tự vượt stage để nhận thưởng lần đầu, mở khóa nguồn Auto Farm và dùng tài nguyên nâng cấp trang bị, mở rộng balo.

Đặc tả tổng hợp Prompt.md và các lựa chọn trong cuộc trao đổi. Các quyết định trực tiếp của người chơi được ưu tiên khi khác với đề xuất ban đầu. Các quy tắc bổ sung và thông số thử nghiệm được đánh dấu riêng ở cuối tài liệu.

### Auto Farm bước 6 đã chốt

Các quy tắc này thay thế công thức Auto Farm dựa vào Loadout ở thiết kế trước:

- Hiệu suất cố định theo stage đã thắng boss, không phụ thuộc Loadout, luyện khí, đột phá hay số ô balo. Đổi đội hình chiến đấu không làm thay đổi thu nhập nền.
- Sản lượng thử mỗi giờ theo thứ tự Bạc / Linh sa / mảnh: Xích Sa **130 / 4 / 1,5**; Phế Tích **65 / 12 / 1,5**; Phong Khiếu **65 / 4 / 5**; Thanh Đăng **110 / 9 / 2**; Hắc Phong **90 / 7 / 4**. Ba vùng đầu giữ thế mạnh riêng; hai vùng sau cung cấp hỗn hợp. Chưa thay chi phí nâng cấp hay phần thưởng đánh trực tiếp.
- Chỉ chọn vùng đã khai thông. Không tốn năng lượng, không đánh boss, không nhận thưởng lớn lần đầu. Vẫn tích lũy cả online/offline, tối đa 12 giờ từ lần nhận gần nhất; chưa mô phỏng từng round quái trong Auto Farm.
- Đổi vùng chốt thưởng của khoảng trước theo vùng trước; giữ quà và thời gian tích lũy. Đổi vùng khi đầy không vượt giới hạn. Người chơi chủ động nhận, lấy phần nguyên và giữ phần lẻ; nhận được bất kỳ loại nào đạt một đơn vị.
- Giao diện hiển thị sản lượng mỗi giờ, bảng so sánh, thời gian và thanh giới hạn, ba tài nguyên chờ nhận. Sau khi nhận, chỉ dẫn đến Luyện khí/mở balo nếu đủ điều kiện; không tự mua.
- Từ bước 10, mảnh chung dùng đột phá. Mảnh skin là loại riêng, không nhận từ Auto Farm.
- Chuyển bản lưu cũ bằng phiên bản công thức riêng: chốt khoảng chưa tính theo Loadout/công thức cũ đúng một lần, trong phần giới hạn còn lại, rồi chuyển sang công thức mới. Giữ nguyên tài nguyên và tiến trình. Mức thu nhập tương lai có thể khác mức cũ, cần tiếp tục chơi thử cân bằng.


### Đội hình và nhịp giao chiến bước 7 đã chốt

- Ba bộ khởi đầu gợi ý: Tấn công (kiếm/nỏ/bình), Cân bằng (kiếm/khiên/bình), Tăng tốc (trọng đao/khiên/phù). Chọn rồi chỉnh từng món; không cấp đồ hoặc tiêu tiền. Chỉ áp dụng chuyến mới; nguồn tiếp tế của chuyến hiện tại giữ Loadout đã chụp khi xuất phát.
- Khi thắng vòng thường và chuyển sang vòng kế tiếp sau chọn tiếp tế: hồi tối đa 20% HP tối đa, không vượt trần, đúng một lần. Giữ khiên/tăng tốc/hồi chiêu. Không tự hồi vì chờ; thống kê kết quả trước đó không thay đổi.
- Mỗi lần đánh có đồng hồ riêng, báo cuồng nộ trước 5 giây. Từ giây 60, toàn bộ địch tăng 10% sát thương gốc; thêm 10% mỗi 10 giây. Quái gọi thêm cùng chịu hệ số này; không nhân chồng hay tăng tốc đánh.
- Hết 180 giây chưa thắng thì thua vì hết giờ, không có đòn đánh mới tại mốc 180. Báo cáo giữ đúng HP còn lại và nguyên nhân, không thưởng. Thử lại đặt đồng hồ về 0, hồi đầy HP/đặt lại khiên và hồi chiêu như cũ, tốn 5 năng lượng khi xuất phát.
- Thời gian tính theo mô phỏng; ×2 chạy nhanh tương ứng, tạm dừng/ẩn trang không tính. Không thay Auto Farm.

### Tiến độ xử lý feedback sau bước 7

Ước tính khoảng **85% phần triển khai cơ chế**, không phải tỷ lệ chứng minh game đã cân bằng hoặc thú vị. Các nhóm feedback có phần giao nhau nên đây là đánh giá phạm vi, không phải phép chia số kiểm thử.

| Nhóm feedback | Bằng chứng hiện có | Còn cần kiểm chứng/chốt |
| --- | --- | --- |
| Quyết định giữa vòng | Chọn tiếp tế, Shop bằng Lộ phí, cơ chế địch khác nhau | Lựa chọn có còn đáng kể khi balo lớn/đồ mạnh? |
| Đánh đổi ghép | Preview diện tích/hiệu lực/cooldown, thống kê hồi dư và khiên | So sánh giữ đôi với ghép trong các chuyến thật |
| Thao tác trong trận | Khóa sắp xếp khi đánh, khay không hoạt động | Đánh giá tốc độ sắp xếp và thao tác nhầm trên điện thoại |
| Đa dạng Loadout | 8 loại đồ, 3 bộ gợi ý, ngũ hành, hồi 20%, cuồng nộ/timeout | Tăng tốc còn yếu trong đối chiếu ban đầu; chưa chứng minh nhiều bộ hữu dụng xuyên stage |
| Áp lực diện tích | 3×3/4×4/5×5, mở theo mốc, preview vùng mở | Chưa có thử toàn chuyến đủ rộng để chứng minh 5×5 vẫn cần bỏ đồ |
| Chơi trực tiếp/Auto Farm | Thu nhập nền độc lập Loadout, chuyên tài nguyên theo stage | Tốc độ tiến triển, giá nâng cấp, giá trị thưởng trực tiếp so với farm |
| Quy tắc và giải thích thất bại | Tách tiền, thưởng/thử lại, hồi phục, báo cáo và so sánh | Chốt giới hạn khay; công dụng trang bị hoàn chỉnh/mảnh ngoài trận |
| Phạm vi prototype và chơi thử | 3 stage có cơ chế, Dev, 96 kiểm thử, 36 trận đối chiếu cố định | Nhịp toàn stage 3–5 phút, độ thú vị và giá trị chơi lại cần người chơi thực tế |

Đối chiếu hiện tại chỉ dùng ba món khởi đầu, HP đầy, chưa có Shop/tiếp tế. Không coi bảng kết quả này là bằng chứng cân bằng hoàn chỉnh. Bước ưu tiên tiếp theo là chơi thử toàn chuyến ở balo 3×3 và 5×5, sau đó điều chỉnh nguồn đồ/địch/chi phí theo số liệu thay vì thêm hệ thống mới.

### Chơi thử và cân bằng bước 8

- Người chơi chốt mục tiêu 3–5 phút cho **toàn chuyến**, bao gồm sắp xếp và chọn đồ. Giữ nhịp đánh ngắn. Chưa đo thời gian thao tác thực tế.
- Áp dụng thử Tật Phong Phù từ 16% lên **30%** ở Tier I, giữ hồi chiêu 6 giây/hiệu lực 4 giây/kích thước 2×1/không cộng dồn. Ghép Tier II thành 51%, Tier III kích hoạt 87% trước nâng cấp. Không tự sửa thống kê của trận đã lưu; so sánh báo cáo cũ có cảnh báo khác phiên bản quy tắc.
- Đã đối chiếu 1.176 chuyến bằng cùng bộ seed, gồm balo 3×3/5×5 ở ba stage đầu, thêm hai stage cuối ở 5×5 và kiểm tra bước thời gian nhỏ hơn. Có Shop, tiếp tế, ghép và hồi phục; không giả lập thời gian suy nghĩ của người chơi. Điều kiện và lệnh tái lập nằm trong README.
- Phong Khiếu, giữ đúng ba loại của Tăng tốc: 5×5 tăng từ 4/12 lên 11/12 chuyến thắng, còn 3×3 chỉ 0/12 → 1/12. Kết quả hai stage cuối chưa đồng đều; bộ mô phỏng chọn đồ linh hoạt tại Thanh Đăng giảm 13/36 → 9/36. Chưa coi mọi Loadout đã cân bằng.
- Balo 5×5 dùng ít diện tích hơn ở stage thấp; chưa đổi diện tích hoặc tăng chỉ số địch chỉ vì điều này. Cần chơi thử với người thật tại stage phù hợp tiến trình và đánh giá nguồn đồ/đánh đổi ghép.
- Giữ đánh giá hoàn thành feedback cơ chế ở khoảng 85%: số mô phỏng tăng giúp phát hiện vấn đề, không tự chứng minh độ vui, tính cân bằng hoặc giá trị chơi lại. Giới hạn khay và công dụng mảnh/trang bị ngoài trận vẫn là phần cần chốt.

## 1. Vòng lặp chơi trực tiếp đã chốt

1. Chọn tối đa 3 loại trang bị trong Loadout, bao gồm vũ khí và trang bị hỗ trợ.
2. Chọn stage, xem trước phần thưởng lớn lần đầu và các phần thưởng có thể nhận khi chơi lại.
3. Bắt đầu với vật phẩm trong trận được đặt lại; giữ tiền, bộ sưu tập, nâng cấp chỉ số và các ô đã mua.
4. Đánh các round quái thường. Mỗi round có một nhóm quái; số lượng có thể tăng theo cấp round.
5. Thắng round nhận đồ tiếp tế thuộc Loadout vào khay, sắp xếp hoặc ghép đồ rồi chủ động bấm tiếp tục.
6. Đánh boss ở round cuối để hoàn thành stage và nhận thưởng.

Một stage hướng tới 5 round, gồm 4 round thường và 1 round boss; mục tiêu toàn chuyến khoảng 3–5 phút, gồm chiến đấu, chọn tiếp tế và sắp xếp. Giữ trận đánh ngắn; thời gian sắp xếp do người chơi quyết định (chốt lại ở bước 8).

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


## Bước 9 — Khay 12 món và bán theo lựa chọn

- Khay chứa tối đa 12 **món**, không phụ thuộc diện tích từng món hay kích thước balo.
- Nhận tiếp tế và đưa đồ từ lưới về khay được phép vượt tạm thời. Giữ đầy đủ vật phẩm; không tự bán hay xóa. Phải xử lý phần dư trước lần xuất phát tiếp theo bằng sắp xếp, ghép hoặc bán. Xuất phát bị chặn không trừ năng lượng.
- Shop/rương yêu cầu ít nhất một chỗ trống trước khi trừ tiền; rương chỉ mở khi chuyến ở pha chuẩn bị. Đủ 12 món vẫn được chiến đấu.
- Nút **Chọn bán** mở danh sách riêng của khay. Người chơi tự tích từng món; xem tên, bậc, giá từng món, số lượng và tổng Lộ phí rồi xác nhận. Không chọn sẵn và không đưa đồ đang trang bị vào danh sách. Hủy không thay đổi tài nguyên.
- Giá giữ công thức hiện tại: `floor(giá Shop × 45% × 1,7^(bậc−1))`. Tiền bán là Lộ phí trong chuyến, không phải Bạc tích lũy. Danh sách/giá được kiểm tra lại để tránh bán nhầm sau thay đổi đồ hoặc bán lặp.
- Đây vẫn là prototype: chuyến và vật phẩm trong khay chưa lưu qua tải trang. Mốc 12 món cần tiếp tục chơi thử để đánh giá mức độ phải dọn đồ và ảnh hưởng đến thời gian chuẩn bị.


## Bước 10 — Skin vũ khí, mảnh riêng và trần ghép VII

Đã chốt A/A/A: bộ sưu tập lưu skin vĩnh viễn; đồ trong chuyến vẫn đặt lại. Mỗi vũ khí dùng một skin, áp dụng từ chuyến mới, không cộng dồn. Chuyến giữ cấu hình riêng cho toàn bộ đồ nhận thêm, không đổi sức mạnh/trần khi người chơi đổi skin ngoài trận. Bốn vũ khí có skin; pháp bảo hỗ trợ giữ III.

| Phẩm chất | Chỉ số gốc cộng thêm (thử) | Trần ghép | Mảnh chế tạo (thử) |
| --- | ---: | --- | ---: |
| Thường | 5% | III | 3 |
| Hiếm | 10% | IV | 4 |
| Quý | 15% | V | 5 |
| Sử thi | 20% | VI | 6 |
| Truyền thuyết | 25% | VII | 8 |

Skin theo từng loại vũ khí, chế tạo bằng đúng mảnh/phẩm chất, thành công chắc chắn và chỉ một lần. Mảnh dư giữ lại; không tự trang bị. Skin không cấp đồ bậc cao đầu chuyến. Tier I–III vẫn ×1,7, IV–VII ×1,5 mỗi bậc; ghép từ hai món hoạt động đầy đủ đánh đổi 15% hoặc 25% tổng hiệu lực để giảm diện tích. Preview và giá bán dùng hệ số mới. Mức ×1,5 và bonus skin là thông số thử.

Mảnh chung giữ nguồn Auto Farm và thêm 5/8/12/16/20 mỗi lần thắng boss stage 1–5. Đột phá lần n yêu cầu cấp luyện khí 3n, chọn trả 10n Linh thạch hoặc 20n mảnh chung, vẫn +30% chỉ số gốc. Mảnh skin không dùng đột phá.

Một chương gồm 5 stage. Boss stage 1–4: mảnh Thường 60%, Hiếm 20%, không rơi 20%. Boss kết chương stage 5: Thường 40%, Hiếm 30%, Quý 18%, Sử thi 9%, Truyền thuyết 3%. Mỗi lần thắng rơi tối đa một mảnh, chia đều bốn vũ khí trong phẩm chất. Quý trở lên không có ở boss thường; Auto Farm, vòng thường, thua và rương không cấp mảnh skin. Tỷ lệ hiện trước trận, thưởng thực nhận hiện sau trận và chỉ trả một lần.

Skin, cấu hình và mảnh được lưu/khôi phục; bản lưu cũ thêm bộ sưu tập rỗng, giữ tiến trình và mảnh chung. Prototype vẫn chưa lưu lượt đang chơi qua reload. 133 kiểm thử đạt và 36 chuyến mô phỏng hồi quy; chưa kiểm chứng thời gian săn skin, nguồn đồ để đạt VII, kinh tế hoặc cân bằng cuối game.

### Tiến độ sau bước 10

Ước tính **95% phần triển khai cơ chế của feedback ban đầu**: giới hạn khay, công dụng bộ sưu tập/mảnh và vòng lặp nhận–sử dụng tài nguyên đã được xử lý. Đây là ước tính phạm vi, không phải tỷ lệ test, không đo độ vui/cân bằng, và không lấy số lượng skin mới để cộng tiến độ. Phần còn lại cần chơi thử với người thật, đo tổng chuyến 3–5 phút, quyết định ghép/giữ đôi, áp lực 5×5, giá trị đổi Loadout và quan hệ chơi trực tiếp/Auto Farm. Phạm vi skin mới còn cần cân bằng dài hạn riêng.


## Bước 11 — Chơi thử có nhật ký toàn chuyến

Đã chốt A/A/A: nhật ký tự ghi và xuất JSON; đợt đầu sáu cấu hình (3 Loadout × balo 3×3/5×5) tại stage 2, seed 57241, không skin/nâng cấp; sau khi có bằng chứng chỉ sửa một nhóm vấn đề mỗi đợt. Chưa chỉnh tham số cân bằng ở bước này.

Hồ sơ thử riêng, giữ tài khoản/chuyến thật. Tính thời gian từ chuẩn bị đầu chuyến đến thắng boss, gồm sắp xếp, tiếp tế, xem kết quả và các lần thử lại. Tách thời gian ×1/×2, tạm dừng, ẩn trang, năng lượng và khoảng gián đoạn không đo được. Chỉ chuyến thắng ×1 hợp lệ mới được đối chiếu mốc 3–5 phút; thua/bỏ dở vẫn được thống kê. QA loại khỏi tổng hợp.

Ghi sự kiện, đội hình/số ô/khay/HP/Lộ phí/năng lượng từng lần xuất phát và kết quả từng vòng. Hai câu nhận xét “Quyết định khó nhất?” / “Chơi lại sẽ đổi gì?” được lưu cùng báo cáo. Giữ 30 lượt gần nhất, xuất JSON chủ động, không gửi dữ liệu mạng. Reload đang thử ghi lượt gián đoạn tại mốc lưu gần nhất; chưa khôi phục hành trang thử.

Quy trình chi tiết: [PLAYTEST.md](PLAYTEST.md). Tiến độ cơ chế vẫn ước tính 95%; hoàn thành công cụ đo không đồng nghĩa đã trả lời các câu hỏi độ vui, đa dạng Loadout, áp lực diện tích, kinh tế và giá trị chơi lại. Đợt stage 3 rồi stage 4–5 có skin sẽ được quyết định sau dữ liệu đợt đầu.

## Bước 12 — Thu thập dữ liệu và ưu tiên cân bằng tiếp tế

Đã chốt A/A/A: người chơi thử sáu cấu hình của bước 11 ở ×1 và gửi JSON; ưu tiên nguồn tiếp tế/áp lực diện tích; nếu có bằng chứng balo lớn thiếu đánh đổi, thử điều chỉnh cấu trúc gói tiếp tế trước, giữ hệ số ghép. Thứ tự chơi, cách ghi nhận và xuất file đã bổ sung trong [PLAYTEST.md](PLAYTEST.md).

Trạng thái: đã chuẩn bị quy trình, chờ lượt chơi thật và JSON. Chưa sửa thông số hoặc kết luận hoàn tất cân bằng; tiến độ cơ chế giữ khoảng 95%.
