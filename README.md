### Simple-Ecommerce

## 📌 Tổng quan dự án
Dự án **Simple-Ecommerce** được xây dựng với mục đích:
- Ứng dụng những kiến thức cơ bản để xây dựng một trang web bán hàng.  
- Thực hành các tính năng cốt lõi của một hệ thống e-commerce.  
- Học hỏi về nghiệp vụ cũng như xử lý các trường hợp, lỗi có thể xảy ra trong quá trình vận hành.  


## 🛠️ Công nghệ sử dụng

### 🎨 Frontend
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  Xây dựng giao diện đê có thể tương tác với người dùng 
  ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
  Quản lí state ,giúp đông bộ dữ liệu giữa các component
   

### ⚙️ Backend 
  ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  Xử lí logic nghiệp vụ , chuẩn hóa dữ liệu , tổ chức theo kiến trúc module
  

### 🗄️ Database
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  Lưu trữ toàn bộ thông tin dự án

### 🔗 ORM
  ![TypeORM](https://img.shields.io/badge/TypeORM-F37626?style=for-the-badge&logo=typeorm&logoColor=white)
  Hỗ trợ xây dựng và nhưng phương thức có sẵn để xây dựng cũng như tương tác với database


## ✨ Tính năng chính

### 🟢 Đăng ký / Đăng nhập
-Cho phép người dùng tạo tài khoản mới , thông tin cá nhân là duy nhất với mỗi người dùng 
-Tạo tài khoản xong đăng nhập , lúc nay backend kiểm tra xem có khóp với dữ liệu ở trong database
hay không ,nếu không bắt người dùng đăng nhập lại , nếu thành công sẽ trả JWT Token dựa trên thông tin 
của ngươi dùng và lưu trên local_storage để tiếp tục phiên làm việc

### 🟢 Trang chủ 
-Ở đây giao diên sẽ cho phép người dùng có thể thây tất cả sản phẩm có phân trang
-Có thêm sidebar và navbar sẽ có chưc năng lọc sản phẩm giúp người dùng có thê
nhanh chóng tìm được sản phẩm mong muốn
-Một nút "Add to cart" giúp người dùng có thể thêm bất cứ sản phầm nào vào giỏ hành của mình

### 🟢 Giỏ hàng (nút giỏ hàng ở góc trên phải)
-Ở giao diện mô phỏng theo shoppe cho phép người dùng có thể chọn sản phẩm mình muốn mua,
tủy chỉnh số lượng cũng như có thể xóa sản phẩm khỏi giỏ hàng
-Sau khi nguồi dùng đã chọn xong sẽ bấm nút "Check out " ở góc phải màn hình để tiếp tục 
mua săm với nhũng sản phẩn mà mình đã chọn 

### 🟢 Checkout
-Ở giao diện chủ yểu sẽ là để người dùng có thể lựa chọn phương thức thanh toán phù hợp với nhu cầu của
minh (COD,VnPay) và một nút hủy nếu người dùng không còn muốn tiếp tục mua hàng
-Nếu người dùng chọn COD Payment thì lúc này hệ thống sẽ lưu trạng thái đơn hàng "Wait for paid" và sẽ đợi 
thanh toán xong thì hệ thống sẽ đưa trạng thái đơn hàng về "Succeeded" (đã thanh toán thành công)
-Nếu người dùng chọn VnPay Payment thì lúc này hệ thồng sẽ trả về trạng thái "Succeeded" nến người dùng thanh toán thành công 
và "Wait for paid " nếu người dùng thanh toán thất bại

### 🟢 Chi tiết đơn hàng 
-Hiện thi chi tiết thông tin đơn hàng và trạng thái tùy theo kết quat trả về từ hệ thồng

### 🟢 Hồ sơ người dùng (nút hình người ở góc trên phải)
-Hiện thị thông tin cá nhân của người dùng , cho phép chỉnh sửa 
-Hiện thị đầy đủ thông tin chi tiết của đơn hàng liên quan đến người dùng 

### 🟢 Trang Admin (quản lí thông tin toàn bộ hệ thống ) 
-Hiện thi tất cả thông tin về sản phẩm , người dùng ,đơn hàng 
-Thêm xóa sủa đầy đủ cho từng loại

## 🚀 Demo

## Link:
-Đang cập nhât 
📌 Tài khoản test:đang cập nhật

 


