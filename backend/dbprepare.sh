#sequelize init

#sequelize model:create --name DBBrands --attributes name:string,imgLogo:string,countryId:integer,active:boolean
#sequelize model:create --name DBCountries --attributes name:string,code:text
#sequelize model:create --name DBAttributeGroups --attributes name:string
#sequelize model:create --name DBAttributes --attributes name:string,value:string,attributeGroupId:integer
#sequelize model:create --name DBProductAttributes --attributes productId:integer,attributeId:integer

#sequelize db:migrate:undo
#sequelize db:migrate:undo:all
#sequelize db:migrate

# curl --request POST --url http://localhost:5000/api/roles --header 'content-type: application/json' \
#   --data '{
# 	"rolename": "admin"
# }'
# curl --request POST --url http://localhost:5000/api/roles --header 'content-type: application/json' \
#   --data '{
# 	"rolename": "customer"
# }'
# curl --request POST --url http://localhost:5000/api/roles --header 'content-type: application/json' \
#   --data '{
# 	"rolename": "editor"
# }'
# curl --request POST --url http://localhost:5000/api/roles --header 'content-type: application/json' \
#   --data '{
# 	"rolename": "supporter"
# }'



curl --request POST --url http://localhost:5000/api/users --header 'content-type: application/json' \
  --data '{
	"userId": "admin",
  "email": "admin",
  "phone": "admin",
  "password": "admin",
  "fullName": "PP Admin",
  "userType": "local",
  "roleId": 1
}'
curl --request POST --url http://localhost:5000/api/users --header 'content-type: application/json' \
  --data '{
	"username": "customer1",
  "email": "customer1@gmail.com",
  "phone": null,
  "password": "customer1",
  "fullName": "PP customer1",
  "userType": "local",
  "roleId": 2
}'
curl --request POST --url http://localhost:5000/api/users --header 'content-type: application/json' \
  --data '{
	"username": null,
  "email": "customer2@gmail.com",
  "phone": null,
  "password": "customer2",
  "fullName": "Customer2,Email Only",
  "userType": "local",
  "roleId": 2
}'


# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bánh Kẹo",
#   "active": true
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Thực Phẩm",
#   "active": true
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Đồ Uống",
#   "active": true
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bánh",
#   "active": true,
#   "parentCategoryId":1
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Kẹo",
#   "active": true,
#   "parentCategoryId":1
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Thực Phẩm Khô",
#   "active": true,
#   "parentCategoryId":2
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Đồ Hộp",
#   "active": true,
#   "parentCategoryId":2
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bia",
#   "active": true,
#   "parentCategoryId":3
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Nước Ngọt",
#   "active": true,
#   "parentCategoryId":3
# }'

# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bánh Cứng",
#   "active": true,
#   "parentCategoryId":3
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bánh Mềm",
#   "active": true,
#   "parentCategoryId":4
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bánh Cứng",
#   "active": true,
#   "parentCategoryId":4
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Kẹo Cứng",
#   "active": true,
#   "parentCategoryId":5
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Kẹo Mềm",
#   "active": true,
#   "parentCategoryId":5
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Hoa Quả Khô",
#   "active": true,
#   "parentCategoryId":6
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Thực Phẩm Khô",
#   "active": true,
#   "parentCategoryId":6
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bia Lon",
#   "active": true,
#   "parentCategoryId":8
# }'
# curl --request POST --url http://localhost:5000/api/categories --header 'content-type: application/json' \
#   --data '{
# 	"name": "Bia Chai",
#   "active": true,
#   "parentCategoryId":8
# }'

# curl --request POST --url http://localhost:5000/api/countries --header 'content-type: application/json' \
#   --data '{
# 	"name": "Việt Nam",
#   "code":"vn"
# }'
# curl --request POST --url http://localhost:5000/api/countries --header 'content-type: application/json' \
#   --data '{
# 	"name": "Nhật Bản",
#   "code":"jp"
# }'
# curl --request POST --url http://localhost:5000/api/countries --header 'content-type: application/json' \
#   --data '{
# 	"name": "Đài Loan",
#   "code":"tw"
# }'
# curl --request POST --url http://localhost:5000/api/countries --header 'content-type: application/json' \
#   --data '{
# 	"name": "Hàn Quốc",
#   "code":"kr"
# }'
# curl --request POST --url http://localhost:5000/api/countries --header 'content-type: application/json' \
#   --data '{
# 	"name": "Trung Quốc",
#   "code":"cn"
# }'
# curl --request POST --url http://localhost:5000/api/countries --header 'content-type: application/json' \
#   --data '{
# 	"name": "Mỹ",
#   "code":"us"
# }'

# curl --request POST --url http://localhost:5000/api/brands --header 'content-type: application/json' \
#   --data '{
# 	"name": "Đài Loan",
#   "countryId":"3",
#   "active":true
# }'
# curl --request POST --url http://localhost:5000/api/brands --header 'content-type: application/json' \
#   --data '{
# 	"name": "Orang Tua",
#   "countryId":"5",
#   "active":true
# }'
# curl --request POST --url http://localhost:5000/api/brands --header 'content-type: application/json' \
#   --data '{
# 	"name": "OREO",
#   "countryId":"6",
#   "active":true
# }'
# curl --request POST --url http://localhost:5000/api/brands --header 'content-type: application/json' \
#   --data '{
# 	"name": "Calbee",
#   "countryId":"2",
#   "active":true
# }'
# curl --request POST --url http://localhost:5000/api/brands --header 'content-type: application/json' \
#   --data '{
# 	"name": "Tiger Beer",
#   "countryId":"6",
#   "active":true
# }'
# curl --request POST --url http://localhost:5000/api/products --header 'content-type: application/json' \
#   --data '{
# 	  "name": "Bánh quy trứng muối Đài Loan",
#     "descShort":"Bánh quy trứng muối Đài Loan Desc Short",
#     "descMedium":"Bánh thơm ngon, hòa nguyện nhân trứng muối.<CRLF>Trọng lượng: 500gr.Desc Medium",
#     "descLong":"Bánh quy trứng muối Đài Loan Desc Long",
#     "unitPrice":150000,
#     "stockNum": 100,
#     "active":true,
#     "imgThump":"p1_1.jpg",
#     "img1":"p1_1.jpg",
#     "firstCategoryId":4,
#     "secondCategoryId":1,
#     "brandId":1
# }'
# curl --request POST --url http://localhost:5000/api/products --header 'content-type: application/json' \
#   --data '{
# 	  "name": "Bánh quy trứng muối Đài Loan",
#     "descShort":"Bánh quy trứng muối Đài Loan Desc Short",
#     "descMedium":"Bánh thơm ngon, hòa nguyện nhân trứng muối.<CRLF>Trọng lượng: 500gr.Desc Medium",
#     "descLong":"Bánh quy trứng muối Đài Loan Desc Long",
#     "unitPrice":150000,
#     "stockNum": 100,
#     "active":true,
#     "imgThump":"p2_1.jpg",
#     "img1":"p2_1.jpg",
#     "firstCategoryId":4,
#     "secondCategoryId":1,
#     "brandId":3
# }'
# curl --request POST --url http://localhost:5000/api/products --header 'content-type: application/json' \
#   --data '{
# 	  "name": "Hộp 10 Gói Bánh Kinh Đô Mini Oreo Vị Vani (230g)",
#     "descShort":"Hộp 10 Gói Bánh Kinh Đô Mini Oreo Vị Vani (230g) Desc Short",
#     "descMedium":"Hộp 10 Gói Bánh Kinh Đô Mini Oreo Vị Vani (230g)<CRLF>Desc Medium",
#     "descLong":"Hộp 10 Gói Bánh Kinh Đô Mini Oreo Vị Vani (230g) Desc Long",
#     "unitPrice":54000,
#     "stockNum": 100,
#     "active":true,
#     "imgThump":"p3_1.jpg",
#     "img1":"p3_1.jpg",
#     "firstCategoryId":4,
#     "secondCategoryId":1,
#     "brandId":4
# }'



# curl --request POST --url http://localhost:5000/api/products --header 'content-type: application/json' \
#   --data '{
# 	  "name": "Ngũ cốc hoa quả Calbee Furugura Nhật Bản gói 800g",
#     "descShort":"Ngũ cốc hoa quả Calbee Furugura Nhật Bản gói 800g Desc Short",
#     "descMedium":"Ngũ cốc hoa quả Calbee Furugura Nhật Bản gói 800g<CRLF>Desc Medium",
#     "descLong":"Ngũ cốc hoa quả Calbee Furugura Nhật Bản gói 800g Desc Long",
#     "unitPrice":169000,
#     "stockNum": 100,
#     "active":true,
#     "imgThump":"ptp_1_1.jpg",
#     "img1":"ptp_1_1.jpg",
#     "img2":"ptp_1_2.jpg",
#     "firstCategoryId":6,
#     "secondCategoryId":2,
#     "brandId":5
# }'

# curl --request POST --url http://localhost:5000/api/products --header 'content-type: application/json' \
#   --data '{
# 	  "name": "Ngũ Cốc Sấy Khô Calbee nội địa Nhật Bản 800g",
#     "descShort":"Ngũ Cốc Sấy Khô Calbee nội địa Nhật Bản 800g Desc Short",
#     "descMedium":"Ngũ Cốc Sấy Khô Calbee nội địa Nhật Bản 800g<CRLF>Desc Medium",
#     "descLong":"Ngũ Cốc Sấy Khô Calbee nội địa Nhật Bản 800g <CRLF>Desc Long",
#     "unitPrice":165000,
#     "stockNum": 100,
#     "active":true,
#     "imgThump":"ptp_2_1.jpg",
#     "img1":"ptp_2_1.jpg",
#     "firstCategoryId":6,
#     "secondCategoryId":2,
#     "brandId":5
# }'


# curl --request POST --url http://localhost:5000/api/products --header 'content-type: application/json' \
#   --data '{
# 	  "name": "Lốc 6 Lon Tiger Thường (330ml / Lon)",
#     "descShort":"Lốc 6 Lon Tiger Thường (330ml / Lon) Desc Short",
#     "descMedium":"Lốc 6 Lon Tiger Thường (330ml / Lon)<CRLF>Desc Medium",
#     "descLong":"Lốc 6 Lon Tiger Thường (330ml / Lon) <CRLF>Desc Long",
#     "unitPrice":82000,
#     "stockNum": 1000,
#     "active":true,
#     "imgThump":"pdu_1_1.jpg",
#     "img1":"pdu_1_1.jpg",
#     "firstCategoryId":8,
#     "secondCategoryId":3,
#     "brandId":6
# }'


# --------------------------Insert Attribute Groups-------------------------------
# curl --request POST --url http://localhost:5000/api/attributegroups --header 'content-type: application/json' \
#   --data '{
# 	"name": "Màu Sắc"
# }'
# curl --request POST --url http://localhost:5000/api/attributegroups --header 'content-type: application/json' \
#   --data '{
# 	"name": "Số Lon"
# }'
# curl --request POST --url http://localhost:5000/api/attributegroups --header 'content-type: application/json' \
#   --data '{
# 	"name": "Dung Tích"
# }'


# --------------------------Insert Attribute -------------------------------
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "Xanh",
#   "attributeGroupId":1
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "Trắng",
#   "attributeGroupId":1
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "Vảng",
#   "attributeGroupId":1
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "Đỏ",
#   "attributeGroupId":1
# }'

# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "6 Lon",
#   "attributeGroupId":2
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "30 Lon",
#   "attributeGroupId":2
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "10 Lon",
#   "attributeGroupId":2
# }'

# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "330ml",
#   "attributeGroupId":3
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "500ml",
#   "attributeGroupId":3
# }'
# curl --request POST --url http://localhost:5000/api/attributes --header 'content-type: application/json' \
#   --data '{
# 	"name": "1000ml",
#   "attributeGroupId":3
# }'



# --------------------------Insert Product Attribute -------------------------------
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 1,
#   "attributeId":3
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 2,
#   "attributeId":2
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 3,
#   "attributeId":2
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 4,
#   "attributeId":4
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 5,
#   "attributeId":1
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 6,
#   "attributeId":1
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 6,
#   "attributeId":5
# }'
# curl --request POST --url http://localhost:5000/api/productattributes --header 'content-type: application/json' \
#   --data '{
# 	"productId": 6,
#   "attributeId":8
# }'


### ------------------Discount--------------------

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Category Banh Mem giam gia 30% trong thang 9",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-09-30 23:42:06",
#     "type":"discount",
#     "fixMoney":0,
#     "percent":30,
#     "applyCategoryId":11,
#     "applyBrandId":0,
#     "applyProductId":0,
#     "img":""
# }'

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Banh Kindo Oreo duoc giam gia 20000",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-09-30 23:42:06",
#     "type":"discount",
#     "fixMoney":20000,
#     "percent":30,
#     "applyCategoryId":0,
#     "applyBrandId":0,
#     "applyProductId":3,
#     "img":""
# }'

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Nhan Hieu Calbee have coupon JP20 giam 20K Het Thang 12",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-12-30 23:42:06",
#     "type":"coupon",
#     "fixMoney":20000,
#     "percent":0,
#     "applyCategoryId":0,
#     "applyBrandId":5,
#     "applyProductId":0,
#     "img":"",
#     "coupon":"JP20"
# }'

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Nhan Dip Trung thu, PP tang 5000 PP5",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-12-30 23:42:06",
#     "type":"coupon",
#     "fixMoney":5000,
#     "percent":0,
#     "applyCategoryId":0,
#     "applyBrandId":0,
#     "applyProductId":0,
#     "img":"",
#     "coupon":"PP5"
# }'

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Mua Bia TIger duoc tang them 1 Lon",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-09-15 23:42:06",
#     "type":"gift",
#     "fixMoney":0,
#     "percent":0,
#     "applyCategoryId":0,
#     "applyBrandId":0,
#     "applyProductId":6,
#     "img":"",
#     "coupon":""
# }'

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Tang 1 Hop Sua khi mua Banh Mem FUlio",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-09-09 23:42:06",
#     "type":"gift",
#     "fixMoney":0,
#     "percent":0,
#     "applyCategoryId":0,
#     "applyBrandId":0,
#     "applyProductId":2,
#     "img":"",
#     "coupon":""
# }'


# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Nhan Hieu Calbee Giam 10%",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-11-30 23:42:06",
#     "type":"discount",
#     "fixMoney":0,
#     "percent":10,
#     "applyCategoryId":0,
#     "applyBrandId":5,
#     "applyProductId":0,
#     "img":"",
#     "coupon":""
# }'

# curl --request POST --url http://localhost:5000/api/discounts --header 'content-type: application/json' \
#   --data '{
# 	"desc": "Tang 1 Goi Milo",
#     "from":"2019-09-01 23:42:06",
#     "to":"2019-10-30 23:42:06",
#     "type":"gift",
#     "fixMoney":0,
#     "percent":0,
#     "applyCategoryId":0,
#     "applyBrandId":0,
#     "applyProductId":1,
#     "img":"",
#     "coupon":""
# }'