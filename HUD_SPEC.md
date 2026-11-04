# Đặc tả HUD mobile — phân tầng và vùng thao tác

Nguồn: skill `mobile-stage-game-ui-ux`, Module 1 (Combat HUD Hierarchy), Module 3 (Touch Lifecycle), Module 5 (Data / Presentation). Không tìm thấy skill riêng `game-ui-specification` trong các thư mục skill đã cài; tài liệu này là đặc tả triển khai của dự án, không thay thế hay giả nhận đã áp dụng skill đó.

Dự án là web HTML/CSS/JavaScript, màn hình dọc, tự đánh theo trang bị. Không có nút kỹ năng chủ động, Unity/Godot, Spine/Rive hoặc thư viện tween. Mục tiêu là thao tác được một tay; người chơi vẫn có thể dùng hai tay. Thông số chiến đấu, năng lượng, phần thưởng, ghép và nguồn đồ giữ nguyên.

## Audit và thay đổi

| Ưu tiên / Module | Bằng chứng trước sửa | Thay đổi | Kiểm chứng |
| --- | --- | --- | --- |
| P1 / 1 — Tier 1 | Máu chữ 8px, thanh 5px ở đáy sân đấu; HUD co toàn bộ theo chiều cao | Dải máu/giáp 14px có nền riêng, cố định phía trên mọi bề mặt sắp xếp; thanh máu 8px | Đo vị trí DOM, ảnh 320×568 và 360×640; còn cần thử tay thật |
| P1 / 1 — Tier 2 | Sân đấu và hàng nút nhỏ chia sẻ vùng hẹp | Stage/vòng/Lộ phí ở đầu; timer/cảnh báo tại đầu sân; tiến độ pháp bảo và buff ngay dưới máu, phía trên sân | Khi đánh chỉ hiện thông tin chiến thuật; tiến độ có nhãn và thanh, không phụ thuộc màu |
| P1 / 1 — Tier 3 | Khay, Shop và chỉ số sâu vẫn chiếm màn hình khi đang đánh và bị khóa | Pha đánh ẩn hẳn bề mặt chuẩn bị; chỉ số/đội hình chi tiết và cơ chế địch mở qua tạm dừng | Kiểm tra chuyển chuẩn bị → đánh → pause → tiếp tục |
| P1 / 1 — Thumb Zone | Nút đầu trang 30px; bán 32px; Shop tool 21px | Nút phụ ít nhất 48×48 CSS px; xuất phát/tạm dừng chính cao 56px; điều khiển dưới cùng | 320px: ô lưới 48,39px; các nút phụ được đo ≥48px, không tràn ngang |
| P1 / 1 — Safe Area | Combat chỉ thêm inset trên vào topbar nhưng không phân bổ lại chiều cao | Bọc toàn combat bằng inset của cả bốn cạnh + 16 CSS px; nội dung giữa co giãn/cuộn | Kiểm tra CSS và viewport; chưa xác nhận inset trên thiết bị vật lý / standalone |
| P1 / 1 — Pause | Rời trận dẫn tới thử lại; chưa có menu dừng chung | Pause một chạm, Resume giữ máu/giáp/cooldown và không thu năng lượng; rời chuyến giữ xác nhận cũ | QA đã kiểm tra tạm dừng, xem địch, quay lại, tiếp tục; năng lượng giữ 25 |

Không có bằng chứng để gọi đây là lỗi P0 hoặc khẳng định đã đo mức che khuất bằng ngón tay. CSS px không tự động tương đương Android dp hoặc iOS pt.

## Bố cục và trạng thái

- **Chuẩn bị:** stage/vòng → máu/giáp → vùng balo có thể cuộn → nút xuất phát và năng lượng cố định dưới. Khay, Shop và nút xem địch ở dưới lưới, cuộn để tới. Sân đấu được ẩn để nhường đủ kích thước cho lưới 5×5; hint chỉ rõ có nội dung bên dưới.
- **Đang đánh:** stage/vòng → máu/giáp → pháp bảo tự kích hoạt/buff → sân đấu → Pause và tốc độ. Không đặt thông tin sinh tồn ở góc dưới. Tiến độ mỗi nhóm là tiến độ cao nhất của các món cùng loại, không phải phép cộng hiệu lực hay nút kỹ năng mới.
- **Tạm dừng:** Resume là hành động chính; xem cơ chế địch và mở đội hình/chỉ số khi cần. Lượt thử có nút về nhật ký; trận thường có nút rời chuyến với xác nhận. Engine chỉ tick khi không có modal. Đồng hồ `lastFrame` cập nhật để Resume không cộng thời gian chờ.
- **Kết quả / thử lại:** tiếp tục dùng báo cáo, chọn tiếp tế và retry hiện có; trở lại pha chuẩn bị mở lại lưới đúng kích thước.
- **Thao tác thay thế kéo:** chạm món → Chọn ô đích → vùng lưới tự cuộn vào tầm nhìn → chạm ô. Hủy kéo / pointercancel vẫn trả đồ, không tự kích hoạt bán. Lưới dùng khoảng cách 4px để giữ cấu trúc ô; nút thao tác riêng cách nhau 8px.
- Dải máu không gắn vào sprite chuyển động: đây là lựa chọn cho góc nhìn ngang cố định và kích thước màn nhỏ, giữ số liệu ổn định và tách khỏi vùng chạm. Không làm mờ máu đầy.
- Balo là tương tác chính giữa round, nên hiện trong **pha chuẩn bị** là ngoại lệ có chủ đích với quy tắc giấu Tier 3 của handbook. Khi trận đang tick, kho đồ/Shop được ẩn; không thay cơ chế khóa thao tác giữa trận.

## Motion / phản hồi

| Tình huống | Phản hồi | Hoàn tất / hủy | Reduced motion |
| --- | --- | --- | --- |
| Nhấn nút HUD | Đổi độ sáng ngay, scale 0,98 bằng CSS `:active`, không tween trễ | Chạy hành động bằng click khi thả; kéo ra ngoài bỏ trạng thái nhấn, không gọi hành động | Chỉ đổi độ sáng, không scale |
| Mở Pause | Modal hiện và ngừng tick ngay; Resume lấy focus, giữ backdrop sẵn có | Resume đóng modal; cơ chế địch quay lại Pause; rời chuyến có xác nhận | Không thêm animation bắt buộc |
| Đặt đồ | Viền/preview và thông báo bằng chữ; chạm chọn ô cuộn tức thì | Pointercancel trả đồ; thao tác không hợp lệ không đổi hành trang | Giữ phản hồi chữ và viền |
| Hồi chiêu | Thanh tiến độ read-only cập nhật theo dữ liệu game | Dừng cùng modal/trang ẩn; tiếp tục từ giá trị cũ | Không thêm nhấp nháy/rung |

HUD chiến đấu không phát âm thanh/haptic theo từng đòn. Popup kết quả và tiếp tế có hệ thống phản hồi riêng được mô tả bên dưới; các thông báo vẫn đủ hiểu khi tắt tiếng. Tiến độ/cooldown vẫn cần nội suy theo thời gian; không thay engine hoặc thêm framework vì một thay đổi HUD.

## Xác nhận và giới hạn

149 kiểm thử hiện có phải đạt; so sánh hash `game-engine` trước/sau để xác nhận nguyên vẹn. QA trình duyệt dùng hồ sơ thử có cờ kỹ thuật, loại khỏi dữ liệu người chơi. Đã đo vùng chạm ở 320×568 và 360×640; kiểm tra đặt đồ qua khay → chọn ô, pause → xem cơ chế → Resume không trừ thêm năng lượng. Không dùng thao tác QA để khẳng định cân bằng.

Cần kiểm tra điện thoại thật: tay trái/phải có che máu/pháp bảo khi giữ máy không; cảm ứng kéo và cuộn dọc; Dynamic Island/tai thỏ/home indicator; chữ phóng lớn; trạng thái nền/quay lại; thiết bị yếu. Chưa đo độ trễ cảm ứng, FPS hoặc mức che khuất vật lý. Bề rộng mục tiêu tối thiểu hiện là 320 CSS px; màn nhỏ hơn hoặc chữ phóng rất lớn cần lượt đánh giá riêng.


## Popup Stage Clear / chọn tiếp tế — refactor 04/11/2026

Áp dụng skill `mobile-stage-game-ui-ux`, Module 3 (Combat Juice / Motion) và Module 4 (vòng đời Lobby). Hai skill được yêu cầu `create-game-vfx`, `build-game-audio-feedback` không có trong thư mục skill đã cài; triển khai bằng handbook và API web hiện có. Trong game này, “Buff Selection” là ba gói tiếp tế, không thêm một hệ thống buff hoặc phần thưởng khác.

| Mục / ưu tiên | Trước sửa | Triển khai |
| --- | --- | --- |
| P1 / Module 3 | Popup hiện ngay, không có controller motion hoặc âm thanh | Controller `ui-feedback.js`, mở khung 280 ms; opacity 0→1, translateY 12→0 CSS px, scale 0,96→1, EaseOutBack nhẹ |
| P1 / Module 3 | Ba gói xuất hiện đồng loạt; nút chọn chỉ 29px | Mỗi thẻ 240 ms, delay 0 / 75 / 150 ms; toàn chuỗi 390 ms; nút chọn cao 48 CSS px |
| P1 / Module 3 | Chưa có bỏ qua hoạt ảnh | Chạm popup / nút Bỏ qua / Enter / Space / Escape kết thúc motion; lần chạm này không chọn thưởng. Tab hoàn tất motion và tiếp tục điều hướng |
| P1 / Module 4 | Meta chỉ ẩn qua `hidden`; CSS page-in chưa được pause rõ ràng | Pause subtree Lobby khi vào stage hoặc trang ẩn. Khi về Lobby chỉ resume tween do controller pause, giữ tween đã pause từ trước |

Bốn tầng phản hồi cho kết quả/chọn gói:

1. **Visual:** khung và tiêu đề nảy nhẹ 280/320 ms, ba thẻ vào lệch nhịp. Không rung camera, không flash toàn màn hình, không tạo hạt liên tục.
2. **Audio:** âm tổng hợp Web Audio ngắn: hợp âm đi lên khi thắng, hai nốt khi mở tiếp tế/chọn thành công; pitch ngẫu nhiên ±10%, không dùng RNG gameplay. Context mở từ thao tác người dùng; nếu bị chặn hoặc không hỗ trợ, giao diện vẫn hoạt động, không phát bù âm cũ.
3. **Haptic:** 10 ms khi mở lựa chọn, 30 ms khi thắng hoặc chọn gói thành công; mặc định tắt, bật ở Trang chủ hoặc Pause. Không giả lập rung trên thiết bị không hỗ trợ.
4. **Systemic:** phần thưởng đã được engine cộng trước khi mở kết quả; hiện xác nhận “đã cộng”. Chọn gói thành công cập nhật khay, HP và vòng ngay, giữ toast mô tả kết quả thật. Tween/cue không cộng quà, trừ năng lượng, tick trận hay chuyển vòng.

`Âm thanh & hiệu ứng` ở Trang chủ và Pause lưu riêng với profile gameplay. Có bật/tắt âm thanh, rung và giảm chuyển động popup. `prefers-reduced-motion` luôn được tôn trọng: nội dung hiện ngay, không bắt người chơi chờ. Không thêm screen shake nên không có thanh chỉnh cường độ shake.

Vòng đời: mở modal mới/đóng modal/đổi màn hủy tween và audio cũ; hết tween giải phóng animation; trang ẩn hoàn tất phần trình bày, dừng audio và suspend context. Quay lại không phát lại âm thanh cũ. Chỉ có một nhóm âm đang phát, node được disconnect khi kết thúc/hủy. Popup nhận focus vào tiêu đề; sửa closeModal để không giành focus khỏi popup kế tiếp. Nút bỏ qua đặt tuyệt đối để không gây nhảy bố cục khi ẩn. Native pointercancel/drag-off không gọi click và không chọn gói.

Kiểm chứng: 149 test hiện có + 10 test controller (skip, thay popup, focus, reduced motion, API thiếu, audio unlock/mute, background, Lobby pause/resume, cleanup); hash `game-engine` trước/sau trùng. Trình duyệt kiểm tra 390×844 và 320×568: ba nút chọn cao 48 CSS px, popup không tràn ngang, chọn gói cuối cuộn được và tăng khay đúng 3 món. Đã kiểm tra một trận thắng tự nhiên sau Pause/Resume ở chế độ giảm chuyển động và Stage Clear boss bằng Dev trên origin thử riêng: trở về Lobby bỏ pause, không lỗi console. Thời lượng là cấu hình đã kiểm thử, chưa phải đo latency/FPS trên điện thoại.

Tài liệu API đối chiếu: [Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), [Navigator.vibrate](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate). Âm lượng thực tế, chất lượng âm và rung vẫn cần thử trên điện thoại thật.

## Trang bị Paper Doll Tier 3 — 04/11/2026

Áp dụng `mobile-stage-game-ui-ux`, Module 1 (Tier 3), Module 3 (Touch Lifecycle), Module 4 (Paper Doll). Skill riêng `build-game-inventory` không được tìm thấy trong các thư mục skill đã cài; phần này triển khai bằng handbook, không giả nhận đã dùng skill thiếu.

| Ưu tiên | Hiện trạng trước sửa | Thay đổi |
| --- | --- | --- |
| P1 / Module 4 | Hòm tiêu là danh sách dài, không có nhân vật trung tâm | Paper Doll với ba ô đúng ba loại khởi đầu; kho tám loại ở phía dưới, có lọc và cuộn |
| P1 / Module 4 | Preset, balo và skin chen trước danh sách | Các lối tắt ngang ở màn Trang bị; modal chi tiết ngang cấp, không chồng modal |
| P1 / Module 3 | Nút trang bị chưa có vòng đời nhấn/thả/hủy rõ ràng | Controller `inventory-ui.js`, feedback trên lớp con để hitbox không co |
| Giới hạn engine | HTML/CSS/JS + SVG; không có Unity, Spine, SkeletonGraphic, prefab hoặc atlas | Dùng vector `viewBox` giữ tỷ lệ; không tạo cấu hình Unity giả hoặc gán PPU cho CSS |

### Bố cục và Scale

`.paper-hero` dùng `left:50%; top:50%; transform:translate(-50%,-50%)`, chiều rộng 44% và cao 94% vùng Paper Doll. `viewBox="0 0 100 150"` giữ tỷ lệ nhân vật; tâm bounding box luôn ở `(0.5,0.5)` vùng portrait. Các ô bố trí bằng phần trăm tương đối vùng này; min hitbox 48 CSS px, không gọi đây là dp/pt đã đo. Nhân vật giữ áo vải ngắn, băng tay, đai lưng, hòm và thẻ tiêu cục; vũ khí minh họa trên tay lấy từ vũ khí đầu tiên trong Loadout và skin hiện chọn.

Ba ô biểu thị **ba loại đồ khởi đầu**, không thêm slot mũ/giày/nhẫn hoặc luật trang bị mới. Kho lưới cuộn ở nửa dưới trên màn dọc tiêu chuẩn; màn thấp ≤650 CSS px cho phép cuộn cả trang để không ép chữ và vùng chạm. Điều hướng dưới vẫn cố định. Safe Area dùng vùng bọc meta hiện có; cần kiểm tra thêm inset thật trên điện thoại.

### Độ sâu

Lobby là gốc. Cấp 1: Trang bị. Cấp 2: chi tiết món / bộ gợi ý / diện tích balo / bộ sưu tập skin. Cấp 3: xác nhận chế tạo skin. Chuyển từ chi tiết món sang skin đóng modal trước, thay bằng màn skin cấp 2; không tạo thêm lớp lồng. Chọn/bỏ một món từ Trang bị là hai thao tác: mở món → chọn/bỏ. Trang chủ → Trang bị → món → chọn là ba chạm. Các đường craft phải xem điều kiện và xác nhận nên số lần chạm có thể cao hơn, nhưng không vượt ba cấp màn hình; không đánh đồng hai khái niệm này.

Trang bị chỉ nằm ở Meta-Lobby. Trong trận vẫn dùng HUD và hành trang giữa round đã có; nút Vào ải quay về chuyến hiện tại. Loadout/skin áp dụng từ chuyến mới, không thay đồ của chuyến đang chơi. Mở balo giữ ngoại lệ hiện có: mua vĩnh viễn áp dụng cả chuyến hiện tại.

### Ba trạng thái nút và chênh lệch

- Down: lớp `.press-face` scale 1→0,9 trong 40 ms, EaseOutQuad; haptic 10 ms nếu người chơi bật và thiết bị hỗ trợ. Hitbox ngoài giữ nguyên.
- Up hợp lệ: scale 0,9→1,05→1 trong 130 ms, EaseOutBack. Click native thực thi hành động, không trì hoãn dữ liệu để đợi tween. Sau render lại có tween release trên nút tương ứng còn hiện.
- Bị chặn/thiếu điều kiện: lắc ±8 CSS px / 200 ms, viền cảnh báo; lý do bằng chữ, số mảnh thiếu tô đỏ tại skin. `aria-disabled` vẫn cho nhận feedback nhưng capture guard và handler kiểm tra lại ngăn mutation.
- Pointercancel, kéo quá 8px để cuộn, thả ngoài hitbox: reset, không chọn món. Enter/Space dùng hành vi nút native; Tab vẫn vào được điều khiển, focus trở lại món đã thao tác.
- Reduced motion: không scale/lắc, giữ chữ và viền. Thay màn/render/trang ẩn hủy animation; listener dùng delegation một lần, có API destroy để tháo khi unmount.
- Sau thay Loadout, chỉ số cập nhật ngay. Delta tăng màu xanh / giảm màu cam có dấu ↑/↓, bay từ nhân vật trong 400 ms; status bằng chữ còn lại để đọc. Công thức giữ đúng chỉ số tổng quan cũ: làm tròn `10 × tổng Game.power(Tier I)`; đây là điểm quy ước, **không phải DPS** và không bảo đảm thắng trận. Không cộng trộn phần trăm haste vào sát thương thực tế của engine.

### SkeletonGraphic / PPU

**Chưa áp dụng PPU = 100:** repository hiện không có `SkeletonGraphic`, `SkeletonDataAsset`, Canvas Unity hoặc texture Sprite importer để chỉnh. SVG trên web không có khái niệm Pixels Per Unit tương đương. PPU 100 chỉ được ghi nhận là yêu cầu cho bản Unity/Spine nếu được cung cấp sau này; cần đối chiếu phiên bản runtime, import scale, Canvas reference pixels, atlas và material thực tế lúc đó. Không tuyên bố đã giảm draw call, thiết lập atlas hay đo CPU/GPU Unity. Bản web tái sử dụng SVG, không thêm animation idle vô hạn, kế thừa pause Lobby khi vào stage.

### Kiểm chứng

167 test đạt (159 trước đó + 8 cho lựa chọn trang bị, điểm dự kiến, touch lifecycle, disabled guard và cleanup). Hash `game-engine` nguyên vẹn. Đã đo 390×844, 320×568, 360×800 (20:9) và 1024×768 (4:3; giữ khung demo dọc hiện có): neo `(0.500,0.500)`, không tràn ngang; ở 320px, cạnh ngắn nhất của slot khoảng 64,67px. Đã kiểm tra bỏ hỗ trợ, thêm nỏ, chặn bỏ vũ khí cuối, và quay lại chuyến: ba món cũ vẫn giữ nguyên, không trừ năng lượng khi đổi đội hình. Kiểm thử dùng origin localhost riêng, không sửa profile người chơi ở 5173. Cần thử cảm ứng thật, cỡ chữ hệ thống, safe-area thiết bị và haptic.
