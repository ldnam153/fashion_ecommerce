drop DATABASE IF EXISTS fashion_ecommerce;
CREATE DATABASE fashion_ecommerce;
use fashion_ecommerce;
CREATE TABLE `TaiKhoan` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`username` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`hoten` varchar(255) ,
	`ngaysinh` varchar(10),
	`sdt` VARCHAR(255) ,
	`email` varchar(255) NOT NULL,
	`avatar` varchar(500) NOT NULL,
	`vaitro` INT NOT NULL,
	`status` BINARY NOT NULL,
	`ngaymo` date,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `SanPham` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`ten` varchar(255) NOT NULL,
	`noisx` varchar(1000) NOT NULL,
	`mota` varchar(3000) NOT NULL,
	`kichthuoc` varchar(100) NOT NULL,
	`gioitinhsudung` BINARY NOT NULL,
	`giaban` INT NOT NULL,
	`soluong` INT NOT NULL,
	`diemdanhgia` FLOAT NOT NULL,
	`luotdanhgia` INT NOT NULL,
	`danhmuccap2` INT NOT NULL,
	`cuahang` INT NOT NULL,
	`status` BINARY NOT NULL,
	`ngaymo` date,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `DanhMucCap1` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`ten` varchar(255) NOT NULL,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `DanhMucCap2` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`ten` varchar(255) NOT NULL,
	`danhmuccap1` INT NOT NULL,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `Cuahang` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`ten` varchar(255) NOT NULL,
	`sdt` varchar(20) NOT NULL,
	`email` varchar(50) NOT NULL,
	`taikhoan` INT NOT NULL,
	`status` BINARY NOT NULL,
	`ngaymo` date,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `GioHang` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`taikhoan` INT NOT NULL UNIQUE,
	`tongsosanpham` INT NOT NULL,
	`tonggiatien` FLOAT NOT NULL,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `ChiTietGioHang` (
	`sanpham` INT NOT NULL,
	`giohang` INT NOT NULL,
	`soluong` INT NOT NULL,
	PRIMARY KEY (`sanpham`,`giohang`)
);

CREATE TABLE `DonHang` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`taikhoan` INT NOT NULL,
	`tongsosanpham` INT NOT NULL,
	`tonggiatien` INT NOT NULL,
	`tinhtrangdon` INT NOT NULL,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `ChiTietTinhTrangDon` (
	`donhang` INT NOT NULL,
	`tinhtrang` INT NOT NULL,
	`ngaythang` date NOT NULL,
	PRIMARY KEY (`donhang`,`tinhtrang`)
);

CREATE TABLE `ChiTietDonHang` (
	`donhang` INT NOT NULL,
	`sanpham` INT NOT NULL,
	`dongia` INT NOT NULL,
	`soluong` INT NOT NULL,
	PRIMARY KEY (`donhang`,`sanpham`)
);

CREATE TABLE `BinhLuan` (
	`taikhoan` INT NOT NULL,
	`sanpham` INT NOT NULL,
	`ngaythang` date NOT NULL,
	`noidung` varchar(3000) NOT NULL,
	PRIMARY KEY (`taikhoan`,`sanpham`)
);

CREATE TABLE `DiemDanhGia` (
	`taikhoan` INT NOT NULL,
	`sanpham` INT NOT NULL,
	`ngaythang` date NOT NULL,
	`sosao` FLOAT NOT NULL,
	PRIMARY KEY (`taikhoan`,`sanpham`)
);

CREATE TABLE `HinhAnhSanPham` (
	`maso` INT NOT NULL AUTO_INCREMENT,
	`sanpham` INT NOT NULL,
	`link` varchar(1000) NOT NULL,
	PRIMARY KEY (`maso`)
);

CREATE TABLE `CauHinh` (
	`tencauhinh` varchar(255) NOT NULL,
	`giatri` INT NOT NULL,
	PRIMARY KEY (`tencauhinh`)
);

ALTER TABLE `SanPham` ADD FULLTEXT(ten);
ALTER TABLE `DanhMucCap1` ADD FULLTEXT(ten);
ALTER TABLE `DanhMucCap2` ADD FULLTEXT(ten);
ALTER TABLE `CuaHang` ADD FULLTEXT(ten);

ALTER TABLE `SanPham` ADD CONSTRAINT `SanPham_fk0` FOREIGN KEY (`danhmuccap2`) REFERENCES `DanhMucCap2`(`maso`);

ALTER TABLE `SanPham` ADD CONSTRAINT `SanPham_fk1` FOREIGN KEY (`cuahang`) REFERENCES `Cuahang`(`maso`);

ALTER TABLE `DanhMucCap2` ADD CONSTRAINT `DanhMucCap2_fk0` FOREIGN KEY (`danhmuccap1`) REFERENCES `DanhMucCap1`(`maso`);

ALTER TABLE `Cuahang` ADD CONSTRAINT `Cuahang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `TaiKhoan`(`maso`);

ALTER TABLE `GioHang` ADD CONSTRAINT `GioHang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `TaiKhoan`(`maso`);

ALTER TABLE `ChiTietGioHang` ADD CONSTRAINT `ChiTietGioHang_fk0` FOREIGN KEY (`sanpham`) REFERENCES `SanPham`(`maso`);

ALTER TABLE `ChiTietGioHang` ADD CONSTRAINT `ChiTietGioHang_fk1` FOREIGN KEY (`giohang`) REFERENCES `GioHang`(`maso`);

ALTER TABLE `DonHang` ADD CONSTRAINT `DonHang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `TaiKhoan`(`maso`);

ALTER TABLE `ChiTietTinhTrangDon` ADD CONSTRAINT `ChiTietTinhTrangDon_fk0` FOREIGN KEY (`donhang`) REFERENCES `DonHang`(`maso`);

ALTER TABLE `ChiTietDonHang` ADD CONSTRAINT `ChiTietDonHang_fk0` FOREIGN KEY (`donhang`) REFERENCES `DonHang`(`maso`);

ALTER TABLE `ChiTietDonHang` ADD CONSTRAINT `ChiTietDonHang_fk1` FOREIGN KEY (`sanpham`) REFERENCES `SanPham`(`maso`);

ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `TaiKhoan`(`maso`);

ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_fk1` FOREIGN KEY (`sanpham`) REFERENCES `SanPham`(`maso`);

ALTER TABLE `DiemDanhGia` ADD CONSTRAINT `DiemDanhGia_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `TaiKhoan`(`maso`);

ALTER TABLE `DiemDanhGia` ADD CONSTRAINT `DiemDanhGia_fk1` FOREIGN KEY (`sanpham`) REFERENCES `SanPham`(`maso`);

ALTER TABLE `HinhAnhSanPham` ADD CONSTRAINT `HinhAnhSanPham_fk0` FOREIGN KEY (`sanpham`) REFERENCES `SanPham`(`maso`);

INSERT INTO CauHinh
VALUES ("tinhtrangchoxacnhan", 0),
("tinhtrangdanggiaohang", 1),
("tinhtrangdagiao", 2),
("tinhtrangdahuy", 3);

INSERT INTO TaiKhoan (username, password, hoten,ngaysinh, sdt, email, avatar, vaitro, status, ngaymo)
VALUES ("lyduynam", "123456", "L?? Duy Nam","15/03/2000", "0123456789", "lyduynam@gmail.com","images/default_avatar.png", 0, 1, "2021/04/05"),
("lehoangphuc", "123456", "L?? Ho??ng Ph??c", "01/01/2000", "0123456789","lehoangphuc@gmail.com","images/default_avatar.png", 1, 1, "2021/04/05"),
("luuthiennhan", "123456", "L??u Thi???n Nh??n", "01/01/2000", "0123456789", "luuthiennhan@gmail.com", "images/default_avatar.png",0, 1, "2021/04/05"),
("nguyenanhduy", "123456", "Nguy???n Anh Duy","01/01/2000", "0123456789", "nguyenanhduy@gmail.com", "images/default_avatar.png",0, 1, "2021/04/05"),
("admin", "123456", "Admin","15/03/2000", "0123456789", "adminFashionEcommerce@gmail.com","images/default_avatar.png", 2, 1, "2021/04/05");

INSERT INTO DanhMucCap1 (ten)
VALUES ("??o"),
("Qu???n"),
("M??/n??n"),
("Balo/T??i x??ch");

INSERT INTO DanhMucCap2 (ten, danhmuccap1)
VALUES ("??o s?? mi", 1),
("??o thun", 1),
("??o kho??c", 1),
("??o len", 1),
("Qu???n Jeans", 2),
("Qu???n t??y", 2),
("Qu???n kaki", 2),
("Qu???n short", 2),
("Qu???n Jogger", 2),
("V??y", 2),
("M?? th???i trang", 3),
("M?? b???o hi???m", 3),
("Balo", 4),
("T??i x??ch", 4);

insert into CuaHang (ten, sdt, email, taikhoan, `status`, ngaymo)
VALUES("C???a h??ng 1", "123456789", "shop1@gmail.com", 2, 1, "2021/04/05");

insert into SanPham (ten, noisx, mota, kichthuoc, gioitinhsudung, giaban, soluong, diemdanhgia, luotdanhgia, danhmuccap2, cuahang, `status`, ngaymo)
VALUES ("??o thun tr???ng" , "Vi???t Nam", "??o m??u tr???ng r???t xinh", "L", 0, 100000, 5, 5.0, 1, 2, 1, 1, "2021/04/05"),
("Qu???n t??y ??en" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 200000, 5, 0.0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 2" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,5, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 3" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 1500000, 0, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 4" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,5, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 5" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,1, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 6" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,5, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 7" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,10, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 8" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,5, 0, 0, 6, 1, 1, "2021/04/05"),
("Qu???n t??y ??en 9" , "Vi???t Nam", "Chi???c qu???n m??u ??en r???t xinh", "L", 0, 150000,0, 0, 0, 6, 1, 1, "2021/04/05");

insert into HinhAnhSanPham (sanpham, link)
values (1, "images/white t-shirt.jpg"),
(1, "images/white t-shirt.jpg"),
(2, "images/white t-shirt.jpg"),
(2, "images/quan.jpg"),
(2, "images/quan.jpg"),
(3, "images/quan.jpg"),
(4, "images/quan.jpg"),
(5, "images/quan.jpg"),
(6, "images/quan.jpg"),
(7, "images/quan.jpg"),
(8, "images/quan.jpg"),
(9, "images/quan.jpg");

insert into GioHang (taikhoan, tongsosanpham, tonggiatien)
VALUES (1, 3, 350000),
(2, 0, 0),
(3, 2, 300000),
(4, 1, 150000);

insert into ChiTietGioHang 
values (1, 1, 2),
(5, 1, 1),
(5, 3, 2),
(9, 4, 1);

insert into DonHang (taikhoan, tongsosanpham, tonggiatien, tinhtrangdon)
VALUES (1, 1, 150000, 2),
(1, 2, 300000, 1),
(3, 1, 150000, 4);

insert into ChiTietDonHang
values (1, 1, 150000, 1),
(2, 1, 100000, 1),
(2, 4, 200000, 1),
(3, 7, 150000, 1);

insert into ChiTietTinhTrangDon
VALUES (1, 0, "2021/04/08"),
(1, 1, "2021/04/09"),
(1, 2, "2021/04/10"),
(2, 0, "2021/04/08"),
(2, 1, "2021/04/09"),
(3, 0, "2021/04/08"),
(3, 3, "2021/04/09");

INSERT into BinhLuan
values (1, 1,  "2021/04/09", "san ph???m r???t t???t");

insert into DiemDanhGia
values (1, 1,  "2021/04/09", 5.0);

