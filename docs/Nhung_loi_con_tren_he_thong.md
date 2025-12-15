0. Data

- Dữ liệu tag chưa phù hợp lắm với cả tour và article(có thể chia ra như dùng type)
- home page category -> 1 số cate chưa có tour item

1. Home page

- Category -> Xung đột ngôn ngữ
- Article -> Mất content(layout)
- Why book with us? -> Xung đột ngôn ngữ(chưa translations)
- Header -> Loại bỏ Notification
- Search tour -> Chọn ngày 3/12 nhưng qua trang Search tour page -> thành ngày 2/12(Query config lỗi)

2. Search tour page

- Ethnic -> Click 1 checkbox -> Tour được search nhưng chỉ trả về đúng ethnic đó trong mỗi tour

-> Tức ban đầu tour có 3 ethnics nhưng khi click chỉ lấy còn đúng ethnic đó

- Popular filter -> Click On sale -> Data có 2 tour giảm giá -> Nhưng chỉ có 1 tour hiển thị

-> Tour item lấy sai promotion để tính giảm giá (Dùng cả coupon code trong khi chỉ đc dùng direct discount)

- Price -> Chỉ tính trên giá chưa giảm -> Chưa tính trên giá đã giảm

3. Tour detail

- Header -> Nút share chưa có event (làm hoặc xóa)
- Available date -> Phần thứ(thứ hai, ba,..) -> Chưa được translations
- Available date -> Lịch được sắp xếp lộn xộn -> phải sort theo ngày bắt đầu
- Available date -> Thử đặt tour -> Giảm slot -> Hủy đặt tour -> Slot vẫn không tăng lại

-> Nhấn hủy nhưng chưa xóa hoặc chưa set deteled(booking) là true / Fix xong vẫn có thể bị lỗi cache(có thể bỏ qua)

- Bookmark -> Khi hover chưa có translations
- Bookmark -> Thêm -> Load(Đã thêm) -> Xóa -> Load(Vẫn không được xóa)
- Sau khi thêm bookmark -> logout -> load lại trang vẫn còn bookmark

- Khi logout -> Mặc định ra trang chủ -> Mặc dù chỉ đang đứng ở Tour detail(không cần auth)
-

- Tour agency -> Chưa kéo dữ liệu hiển thị -> Chỉ đang dữ liệu mẫu(Check lại đúng thì sửa)
- Included và Excluded service -> Các item chưa có translations

-> Có thể sửa (liên quan đến DB hoặc dùng trans của google -> thêm cấu hình cho next intl) hoặc không sửa

- Lịch trình -> "Date 1, Date 2" -> Chưa translations
- Similar tour -> Không hiển thị tours nào cả

4. Order page

- Step 1 -> chỗ còn trống -> hiển thị sai(hiển thị 999)
- Step 1 -> Adult/Child $115.60/người -> Thiếu transaltions
- Step 4 -> Promotion -> Apply mã xong -> Chỉ hiển thị cho tiếng việt

- Payment -> Chỉ có cho tiếng việt(sửa được nếu có thể)
- Payment -> Có trang thì có phần "Nhấn chọn logo.." có trang thì không như ảnh((image.png))

5. Personal - Bookmark page

- Không dùng cho bài viết -> Xóa tab bài viết
- Tour item -> không có nút bookmark để hủy bookmark (có vẻ xóa ở item so với trước đây)
- Tab bên trái -> đang ở bookmark page -> Bookmark item phải có bgColor

-> "Tiếng việt" thì có nhưng "English" thì không -> Có vẻ check theo pathname nên có thêm /en không check được

6. Personal - Transaltion page

- Tab bên trái -> Số lượng giao dịch không được hiển thị (luôn luôn là 0)
- booking item -> Số 0 hiển thị dưới giá tiền là gì? (có thể giảm giá nhưng k cần hiển thị nếu là 0)
- booking item -> Nút "Xem chi tiết" chưa action -> Nhấn title thì chuyển được
- booking item -> Nút Cancel chưa action
- booking item -> Đang ở "EN" nhưng price tính theo "VN"
- Tab other bookings -> Lỗi API -> Có cập nhật ở API này nên đang gây lỗi

7. Personal - Account -> Chưa có(nếu k làm thì xóa bên tab bên trái)

8. Article search page

- item -> publish on -> chưa hiển thị ngày published

9. Article detail -> chưa có

10. About + Services + Blog + Contact -> chưa có

11. Admin common

- Admin header -> Search -> Chưa translation tiếng việt
- Admin header -> Search -> Item click được nhưng chuyển trang chưa tắt modal
- Admin header -> Search
- Khi đăng xuất -> Chuyển màn hình trước -> Xóa dữ liệu sau cho mượt(Ở personal cũng tương tự)

-> Dư 1 số item: booking/order, chatbot, notification, report, chatbot infomation

-> Thiếu: danh mục, employee,

- Admin header -> Noti -> chưa có(k dùng thì xóa)

12. Admin employee

- Item -> Vô hiệu xóa -> Action không có bỏ vô hiệu hóa(phải chỉnh sửa với cập nhật lại được)

12. Admin user

- Item -> Xóa được nhưng vòa DB vẫn còn (chưa hiểu luồng)
- Search -> Mỗi khi search thì re-render cả content chứ không phải mỗi table

13. Admin tour

- Import dữ liệu -> chưa có

14. Admin tour agency assigned

- Table -> cột nhân viên được phân công -> hiển thị "không có" và cả mail của agency được phân công

-> Là có hay không?

15. Admin article -> chưa có
