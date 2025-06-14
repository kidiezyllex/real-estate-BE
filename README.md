# NestJS Template with MongoDB, Swagger and JWT Auth

## Description

This template contains a basic setup for a NestJS project with MongoDB, Swagger and JWT Auth. I have also added a basic user module with CRUD operations for reference.

### Install dependencies

```bash
$ npm install
```

### Set environment variables

```bash
> Create a env file
> Paste: MONGO_URI= YOUR_MONGO_URI
> Paste: JWT_SECRET=YOUR_SECRET
```

### Start the server

```bash
$ npm start
```

### Swagger
> http://localhost:5000/docs

## API Documentation

Dưới đây là danh sách đầy đủ các API trong hệ thống Bất động sản:

### 1. Authentication API

#### Đăng nhập
- **Endpoint:** `POST /api/v1/auth/login`
- **Request:**
  ```json
  {
    "email": "example@gmail.com",
    "password": "Password@123"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Đăng nhập thành công",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "...",
        "name": "John Doe",
        "email": "example@gmail.com",
        "age": 25
      }
    }
  }
  ```

#### Đăng ký
- **Endpoint:** `POST /api/v1/auth/register`
- **Request:**
  ```json
  {
    "name": "John Doe",
    "email": "example@gmail.com",
    "password": "Password@123",
    "age": 25
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Đăng ký thành công",
    "data": {
      "user": {
        "_id": "...",
        "name": "John Doe",
        "email": "example@gmail.com",
        "age": 25
      }
    }
  }
  ```

### 2. User API

#### Lấy thông tin người dùng
- **Endpoint:** `GET /api/v1/user/profile`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "name": "John Doe",
      "email": "example@gmail.com",
      "age": 25
    }
  }
  ```

#### Cập nhật thông tin người dùng
- **Endpoint:** `PUT /api/v1/user/update-profile`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "name": "John Smith",
    "age": 26
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật thông tin thành công",
    "data": {
      "_id": "...",
      "name": "John Smith",
      "email": "example@gmail.com",
      "age": 26
    }
  }
  ```

### 3. Quản lý Căn hộ

#### Lấy danh sách tất cả căn hộ
- **Endpoint:** `GET /api/v1/homes`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "name": "Căn hộ A-123",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "area": 80,
        "floor": 5,
        "bedroom": 2,
        "toilet": 2,
        "homeOwnerId": "...",
        "status": 1,
        "price": 10000000,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Lấy danh sách căn hộ đang hoạt động
- **Endpoint:** `GET /api/v1/homes/available`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Lấy danh sách căn hộ đang hoạt động thành công",
    "data": [
      {
        "_id": "...",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "district": "Quận 1",
        "ward": "Phường Bến Nghé",
        "building": "Tòa nhà ABC",
        "apartmentNv": "A-123",
        "homeOwnerId": {
          "_id": "...",
          "fullname": "Nguyễn Văn B"
        },
        "homeContract": {
          "_id": "...",
          "guestId": "...",
          "status": 1
        },
        "active": true,
        "hasWifi": true,
        "hasParking": true,
        "hasElevator": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Lấy danh sách căn hộ có thể cho thuê
- **Endpoint:** `GET /api/v1/homes/available-for-rent`
- **Headers:** `Authorization: Bearer token`
- **Description:** Lấy danh sách căn hộ đang hoạt động và chưa có hợp đồng thuê
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Lấy danh sách căn hộ có thể cho thuê thành công",
    "data": [
      {
        "_id": "...",
        "address": "456 Đường XYZ, Quận 2, TP.HCM",
        "district": "Quận 2",
        "ward": "Phường Thảo Điền",
        "building": "Tòa nhà XYZ",
        "apartmentNv": "B-456",
        "homeOwnerId": {
          "_id": "...",
          "fullname": "Trần Thị C"
        },
        "homeContract": null,
        "active": true,
        "hasWifi": true,
        "hasParking": false,
        "hasElevator": true,
        "hasAirConditioner": true
      }
    ]
  }
  ```

#### Tìm kiếm căn hộ
- **Endpoint:** `GET /api/v1/homes/search?q=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `q` (từ khóa tìm kiếm)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Tìm kiếm căn hộ thành công",
    "data": [
      {
        "_id": "...",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "district": "Quận 1",
        "ward": "Phường Bến Nghé",
        "building": "Tòa nhà ABC",
        "apartmentNv": "A-123",
        "homeOwnerId": {
          "_id": "...",
          "fullname": "Nguyễn Văn B"
        },
        "homeContract": null,
        "active": true,
        "hasWifi": true,
        "hasParking": true
      }
    ]
  }
  ```

#### Tìm kiếm căn hộ theo tiện ích
- **Endpoint:** `GET /api/v1/homes/search-by-amenities?amenities=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `amenities` (danh sách tiện ích cách nhau bởi dấu phẩy)
- **Example:** `GET /api/v1/homes/search-by-amenities?amenities=hasWifi,hasParking,hasElevator`
- **Available amenities:**
  - `hasBathroom` - Phòng tắm
  - `hasBedroom` - Phòng ngủ
  - `hasBalcony` - Ban công
  - `hasKitchen` - Nhà bếp
  - `hasWifi` - Wifi
  - `hasSoundproof` - Chống tiếng ồn
  - `hasAirConditioner` - Điều hòa
  - `hasWashingMachine` - Máy giặt
  - `hasRefrigerator` - Tủ lạnh
  - `hasElevator` - Thang máy
  - `hasParking` - Chỗ đậu xe
  - `hasSecurity` - An ninh 24/7
  - `hasGym` - Phòng gym
  - `hasSwimmingPool` - Hồ bơi
  - `hasGarden` - Khu vườn
  - `hasPetAllowed` - Cho phép nuôi thú cưng
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Tìm kiếm căn hộ theo tiện ích thành công",
    "data": [
      {
        "_id": "...",
        "address": "789 Đường DEF, Quận 3, TP.HCM",
        "district": "Quận 3",
        "ward": "Phường Võ Thị Sáu",
        "building": "Tòa nhà DEF",
        "apartmentNv": "C-789",
        "homeOwnerId": {
          "_id": "...",
          "fullname": "Lê Văn D"
        },
        "homeContract": null,
        "active": true,
        "hasWifi": true,
        "hasParking": true,
        "hasElevator": true,
        "hasAirConditioner": true,
        "hasSecurity": true
      }
    ]
  }
  ```

#### Lấy danh sách căn hộ theo chủ nhà
- **Endpoint:** `GET /api/v1/homes/homeowner/:homeOwnerId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `homeOwnerId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "name": "Căn hộ A-123",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "area": 80,
        "floor": 5,
        "bedroom": 2,
        "toilet": 2,
        "homeOwnerId": "...",
        "status": 1,
        "price": 10000000
      }
    ]
  }
  ```

#### Xem chi tiết căn hộ
- **Endpoint:** `GET /api/v1/homes/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "name": "Căn hộ A-123",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "area": 80,
      "floor": 5,
      "bedroom": 2,
      "toilet": 2,
      "homeOwnerId": {
        "_id": "...",
        "fullname": "Lê Thị D"
      },
      "status": 1,
      "price": 10000000,
      "description": "Căn hộ view đẹp, ánh sáng tự nhiên",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo căn hộ mới
- **Endpoint:** `POST /api/v1/homes`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "homeOwnerId": "60d21b4667d0d8992e610c84",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "building": "Tòa nhà ABC",
    "apartmentNv": "A-123",
    "active": true,
    "note": "Căn hộ view đẹp, ánh sáng tự nhiên",
    "hasBathroom": true,
    "hasBedroom": true,
    "hasBalcony": true,
    "hasKitchen": true,
    "hasWifi": true,
    "hasAirConditioner": true,
    "hasElevator": true,
    "hasParking": true,
    "hasSecurity": true
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo căn hộ thành công",
    "data": {
      "_id": "...",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "homeOwnerId": "60d21b4667d0d8992e610c84",
      "district": "Quận 1",
      "ward": "Phường Bến Nghé",
      "building": "Tòa nhà ABC",
      "apartmentNv": "A-123",
      "homeContract": null,
      "active": true,
      "note": "Căn hộ view đẹp, ánh sáng tự nhiên",
      "hasBathroom": true,
      "hasBedroom": true,
      "hasBalcony": true,
      "hasKitchen": true,
      "hasWifi": true,
      "hasAirConditioner": true,
      "hasElevator": true,
      "hasParking": true,
      "hasSecurity": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin căn hộ
- **Endpoint:** `PATCH /api/v1/homes/:id`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "name": "Căn hộ B-456",
    "price": 12000000,
    "status": 2
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật căn hộ thành công",
    "data": {
      "_id": "...",
      "name": "Căn hộ B-456",
      "price": 12000000,
      "status": 2,
      "updatedAt": "..."
    }
  }
  ```

#### Xóa căn hộ
- **Endpoint:** `DELETE /api/v1/homes/:id`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa căn hộ thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

### 4. Quản lý Khách hàng

#### Lấy danh sách khách hàng
- **Endpoint:** `GET /api/v1/guests`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "fullname": "Nguyễn Văn A",
        "phone": "0912345678",
        "email": "a@example.com",
        "citizenId": "012345678901",
        "citizen_date": "2020-01-01",
        "citizen_place": "Hà Nội",
        "birthday": "1990-01-01",
        "hometown": "Hà Nội",
        "note": "Khách hàng mới",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Tìm kiếm khách hàng
- **Endpoint:** `GET /api/v1/guests/search?q=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `q` (từ khóa tìm kiếm)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "fullname": "Nguyễn Văn A",
        "phone": "0912345678",
        "email": "a@example.com",
        "citizenId": "012345678901"
      }
    ]
  }
  ```

#### Xem chi tiết khách hàng
- **Endpoint:** `GET /api/v1/guests/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "fullname": "Nguyễn Văn A",
      "phone": "0912345678",
      "email": "a@example.com",
      "citizenId": "012345678901",
      "citizen_date": "2020-01-01",
      "citizen_place": "Hà Nội",
      "birthday": "1990-01-01",
      "hometown": "Hà Nội",
      "note": "Khách hàng mới",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo khách hàng mới
- **Endpoint:** `POST /api/v1/guests`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "fullname": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "a@example.com",
    "citizenId": "012345678901",
    "citizen_date": "2020-01-01",
    "citizen_place": "Hà Nội",
    "birthday": "1990-01-01",
    "hometown": "Hà Nội",
    "note": "Khách hàng mới"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo khách hàng thành công",
    "data": {
      "_id": "...",
      "fullname": "Nguyễn Văn A",
      "phone": "0912345678",
      "email": "a@example.com",
      "citizenId": "012345678901",
      "citizen_date": "2020-01-01",
      "citizen_place": "Hà Nội",
      "birthday": "1990-01-01",
      "hometown": "Hà Nội",
      "note": "Khách hàng mới",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin khách hàng
- **Endpoint:** `PATCH /api/v1/guests/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Request:**
  ```json
  {
    "fullname": "Nguyễn Văn B",
    "phone": "0987654321",
    "note": "Khách hàng thân thiết"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật khách hàng thành công",
    "data": {
      "_id": "...",
      "fullname": "Nguyễn Văn B",
      "phone": "0987654321",
      "note": "Khách hàng thân thiết",
      "updatedAt": "..."
    }
  }
  ```

#### Xóa khách hàng
- **Endpoint:** `DELETE /api/v1/guests/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa khách hàng thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

#### Xem danh sách hợp đồng của khách hàng
- **Endpoint:** `GET /api/v1/home-contracts/guest/:guestId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `guestId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "guestId": "...",
        "homeId": {
          "_id": "...",
          "name": "Căn hộ A-123",
          "address": "123 Đường ABC, Quận 1, TP.HCM"
        },
        "duration": 12,
        "payCycle": 3,
        "renta": 10000000,
        "dateStar": "2023-01-01",
        "deposit": 10000000,
        "status": 1
      }
    ]
  }
  ```

### 5. Quản lý Chủ nhà

#### Lấy danh sách chủ nhà
- **Endpoint:** `GET /api/v1/home-owners`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "fullname": "Lê Thị D",
        "phone": "0912345678",
        "email": "d@example.com",
        "citizenId": "012345678901",
        "citizen_date": "2020-01-01",
        "citizen_place": "Hà Nội",
        "birthday": "1985-01-01",
        "address": "456 Đường XYZ, Quận 2, TP.HCM",
        "bankAccount": "987654321",
        "bankName": "VCB",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Tìm kiếm chủ nhà
- **Endpoint:** `GET /api/v1/home-owners/search?q=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `q` (từ khóa tìm kiếm)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "fullname": "Lê Thị D",
        "phone": "0912345678",
        "email": "d@example.com"
      }
    ]
  }
  ```

#### Xem chi tiết chủ nhà
- **Endpoint:** `GET /api/v1/home-owners/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "fullname": "Lê Thị D",
      "phone": "0912345678",
      "email": "d@example.com",
      "citizenId": "012345678901",
      "citizen_date": "2020-01-01",
      "citizen_place": "Hà Nội",
      "birthday": "1985-01-01",
      "address": "456 Đường XYZ, Quận 2, TP.HCM",
      "bankAccount": "987654321",
      "bankName": "VCB",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo chủ nhà mới
- **Endpoint:** `POST /api/v1/home-owners`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "fullname": "Lê Thị D",
    "phone": "0912345678",
    "email": "d@example.com",
    "citizenId": "012345678901",
    "citizen_date": "2020-01-01",
    "citizen_place": "Hà Nội",
    "birthday": "1985-01-01",
    "address": "456 Đường XYZ, Quận 2, TP.HCM",
    "bankAccount": "987654321",
    "bankName": "VCB"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo chủ nhà thành công",
    "data": {
      "_id": "...",
      "fullname": "Lê Thị D",
      "phone": "0912345678",
      "email": "d@example.com",
      "citizenId": "012345678901",
      "citizen_date": "2020-01-01",
      "citizen_place": "Hà Nội",
      "birthday": "1985-01-01",
      "address": "456 Đường XYZ, Quận 2, TP.HCM",
      "bankAccount": "987654321",
      "bankName": "VCB",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin chủ nhà
- **Endpoint:** `PATCH /api/v1/home-owners/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Request:**
  ```json
  {
    "phone": "0987654321",
    "bankAccount": "123456789",
    "bankName": "ACB"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật chủ nhà thành công",
    "data": {
      "_id": "...",
      "phone": "0987654321",
      "bankAccount": "123456789",
      "bankName": "ACB",
      "updatedAt": "..."
    }
  }
  ```

#### Xóa chủ nhà
- **Endpoint:** `DELETE /api/v1/home-owners/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa chủ nhà thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

### 6. Quản lý Hợp đồng nhà

#### Lấy danh sách hợp đồng
- **Endpoint:** `GET /api/v1/home-contracts`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "guestId": "...",
        "homeId": "...",
        "duration": 12,
        "payCycle": 3,
        "renta": 10000000,
        "dateStar": "2023-01-01",
        "deposit": 10000000,
        "status": 1,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Tìm kiếm hợp đồng
- **Endpoint:** `GET /api/v1/home-contracts/search?q=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `q` (từ khóa tìm kiếm)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "guestId": {
          "_id": "...",
          "fullname": "Nguyễn Văn A",
          "phone": "0912345678"
        },
        "homeId": {
          "_id": "...",
          "name": "Căn hộ A-123"
        },
        "duration": 12,
        "payCycle": 3,
        "renta": 10000000,
        "dateStar": "2023-01-01",
        "deposit": 10000000,
        "status": 1
      }
    ]
  }
  ```

#### Xem danh sách hợp đồng theo căn hộ
- **Endpoint:** `GET /api/v1/home-contracts/home/:homeId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `homeId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "guestId": "...",
        "homeId": "...",
        "duration": 12,
        "payCycle": 3,
        "renta": 10000000,
        "dateStar": "2023-01-01",
        "deposit": 10000000,
        "status": 1
      }
    ]
  }
  ```

#### Xem chi tiết hợp đồng
- **Endpoint:** `GET /api/v1/home-contracts/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "guestId": {
        "_id": "...",
        "fullname": "Nguyễn Văn A",
        "phone": "0912345678",
        "email": "a@example.com",
        "citizenId": "012345678901",
        "citizen_date": "2020-01-01",
        "citizen_place": "Hà Nội",
        "birthday": "1990-01-01",
        "hometown": "Hà Nội"
      },
      "homeId": {
        "_id": "...",
        "name": "Căn hộ A-123",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "homeOwnerId": "..."
      },
      "duration": 12,
      "payCycle": 3,
      "renta": 10000000,
      "dateStar": "2023-01-01",
      "deposit": 10000000,
      "status": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo hợp đồng nhà mới
- **Endpoint:** `POST /api/v1/home-contracts`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "guestId": "60d21b4667d0d8992e610c85",
    "homeId": "60d21b4667d0d8992e610c86",
    "duration": 12,
    "payCycle": 3,
    "renta": 10000000,
    "dateStar": "2023-01-01",
    "deposit": 10000000,
    "status": 1
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo hợp đồng nhà thành công",
    "data": {
      "_id": "...",
      "guestId": "60d21b4667d0d8992e610c85",
      "homeId": "60d21b4667d0d8992e610c86",
      "duration": 12,
      "payCycle": 3,
      "renta": 10000000,
      "dateStar": "2023-01-01",
      "deposit": 10000000,
      "status": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin hợp đồng
- **Endpoint:** `PATCH /api/v1/home-contracts/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Request:**
  ```json
  {
    "duration": 24,
    "renta": 12000000,
    "payCycle": 6,
    "status": 2
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật hợp đồng nhà thành công",
    "data": {
      "_id": "...",
      "duration": 24,
      "renta": 12000000,
      "payCycle": 6,
      "status": 2,
      "updatedAt": "..."
    }
  }
  ```

#### Xóa hợp đồng
- **Endpoint:** `DELETE /api/v1/home-contracts/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa hợp đồng nhà thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

### 7. Quản lý Hợp đồng dịch vụ

#### Lấy danh sách hợp đồng dịch vụ
- **Endpoint:** `GET /api/v1/service-contracts`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "homeId": "...",
        "serviceId": "...",
        "guestId": "...",
        "homeContractId": "...",
        "dateStar": "2023-01-01",
        "duration": 12,
        "price": 500000,
        "payCycle": 3,
        "status": 1,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Xem danh sách hợp đồng dịch vụ theo căn hộ
- **Endpoint:** `GET /api/v1/service-contracts/home/:homeId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `homeId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "homeId": "...",
        "serviceId": "...",
        "guestId": "...",
        "homeContractId": "...",
        "dateStar": "2023-01-01",
        "duration": 12,
        "price": 500000,
        "payCycle": 3,
        "status": 1
      }
    ]
  }
  ```

#### Xem danh sách hợp đồng dịch vụ theo khách hàng
- **Endpoint:** `GET /api/v1/service-contracts/guest/:guestId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `guestId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "homeId": "...",
        "serviceId": "...",
        "guestId": "...",
        "homeContractId": "...",
        "dateStar": "2023-01-01",
        "duration": 12,
        "price": 500000,
        "payCycle": 3,
        "status": 1
      }
    ]
  }
  ```

#### Xem danh sách hợp đồng dịch vụ theo hợp đồng nhà
- **Endpoint:** `GET /api/v1/service-contracts/homecontract/:homeContractId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `homeContractId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "homeId": "...",
        "serviceId": "...",
        "guestId": "...",
        "homeContractId": "...",
        "dateStar": "2023-01-01",
        "duration": 12,
        "price": 500000,
        "payCycle": 3,
        "status": 1
      }
    ]
  }
  ```

#### Xem danh sách hợp đồng dịch vụ theo dịch vụ
- **Endpoint:** `GET /api/v1/service-contracts/service/:serviceId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `serviceId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "homeId": "...",
        "serviceId": "...",
        "guestId": "...",
        "homeContractId": "...",
        "dateStar": "2023-01-01",
        "duration": 12,
        "price": 500000,
        "payCycle": 3,
        "status": 1
      }
    ]
  }
  ```

#### Xem chi tiết hợp đồng dịch vụ
- **Endpoint:** `GET /api/v1/service-contracts/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "homeId": {
        "_id": "...",
        "name": "Căn hộ A-123"
      },
      "serviceId": {
        "_id": "...",
        "name": "Dọn vệ sinh",
        "price": 500000
      },
      "guestId": {
        "_id": "...",
        "fullname": "Nguyễn Văn A"
      },
      "homeContractId": "...",
      "dateStar": "2023-01-01",
      "duration": 12,
      "price": 500000,
      "payCycle": 3,
      "status": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo hợp đồng dịch vụ mới
- **Endpoint:** `POST /api/v1/service-contracts`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "homeId": "60d21b4667d0d8992e610c86",
    "serviceId": "60d21b4667d0d8992e610c87",
    "guestId": "60d21b4667d0d8992e610c85",
    "homeContractId": "60d21b4667d0d8992e610c88",
    "dateStar": "2023-01-01",
    "duration": 12,
    "price": 500000,
    "payCycle": 3
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo hợp đồng dịch vụ thành công",
    "data": {
      "_id": "...",
      "homeId": "60d21b4667d0d8992e610c86",
      "serviceId": "60d21b4667d0d8992e610c87",
      "guestId": "60d21b4667d0d8992e610c85",
      "homeContractId": "60d21b4667d0d8992e610c88",
      "dateStar": "2023-01-01",
      "duration": 12,
      "price": 500000,
      "payCycle": 3,
      "status": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin hợp đồng dịch vụ
- **Endpoint:** `PATCH /api/v1/service-contracts/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Request:**
  ```json
  {
    "duration": 24,
    "price": 600000,
    "payCycle": 6,
    "status": 2
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật hợp đồng dịch vụ thành công",
    "data": {
      "_id": "...",
      "duration": 24,
      "price": 600000,
      "payCycle": 6,
      "status": 2,
      "updatedAt": "..."
    }
  }
  ```

#### Xóa hợp đồng dịch vụ
- **Endpoint:** `DELETE /api/v1/service-contracts/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa hợp đồng dịch vụ thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

### 8. Thống kê

#### Thống kê tổng quan
- **Endpoint:** `GET /api/v1/statistics/general`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "totalHomes": 50,
      "totalGuests": 45,
      "totalHomeOwners": 20,
      "totalServices": 12
    }
  }
  ```

#### Thống kê doanh thu theo tháng
- **Endpoint:** `GET /api/v1/statistics/revenue?year=2023`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "year": 2023,
      "months": [
        {
          "month": 1,
          "revenue": 120000000
        },
        {
          "month": 2,
          "revenue": 140000000
        }
      ],
      "totalRevenue": 1600000000
    }
  }
  ```

#### Thống kê căn hộ
- **Endpoint:** `GET /api/v1/statistics/homes`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "totalHomes": 50,
      "availableHomes": 20,
      "occupiedHomes": 30
    }
  }
  ```

#### Thống kê hợp đồng
- **Endpoint:** `GET /api/v1/statistics/contracts`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "totalContracts": 65,
      "homeContracts": 40,
      "serviceContracts": 25,
      "activeContracts": 50,
      "expiredContracts": 15
    }
  }
  ```

#### Thống kê thanh toán
- **Endpoint:** `GET /api/v1/statistics/payments`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "totalPayments": 150,
      "paidOnTime": 130,
      "paidLate": 15,
      "unpaid": 5
    }
  }
  ```

#### Thống kê thanh toán sắp đến hạn
- **Endpoint:** `GET /api/v1/statistics/due-payments`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "duePaymentsCount": 8,
      "duePayments": [
        {
          "_id": "...",
          "homeId": {
            "name": "Căn hộ A-123"
          },
          "guestName": "Nguyễn Văn A",
          "datePaymentExpec": "2023-04-01",
          "totalReceive": 10000000,
          "type": 1,
          "daysUntilDue": 5
        }
      ]
    }
  }
  ```

### 9. Quản lý Người nhận

#### Lấy danh sách người nhận
- **Endpoint:** `GET /api/v1/receivers`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "fullname": "Trần Văn C",
        "phone": "0987654321",
        "email": "c@example.com",
        "bankAccount": "123456789",
        "bankName": "VCB",
        "address": "789 Đường ABC, Quận 3, TP.HCM",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Tìm kiếm người nhận
- **Endpoint:** `GET /api/v1/receivers/search?q=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `q` (từ khóa tìm kiếm)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": [
      {
        "_id": "...",
        "fullname": "Trần Văn C",
        "phone": "0987654321",
        "email": "c@example.com"
      }
    ]
  }
  ```

#### Xem chi tiết người nhận
- **Endpoint:** `GET /api/v1/receivers/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "_id": "...",
      "fullname": "Trần Văn C",
      "phone": "0987654321",
      "email": "c@example.com",
      "bankAccount": "123456789",
      "bankName": "VCB",
      "address": "789 Đường ABC, Quận 3, TP.HCM",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo người nhận mới
- **Endpoint:** `POST /api/v1/receivers`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "fullname": "Trần Văn C",
    "phone": "0987654321",
    "email": "c@example.com",
    "bankAccount": "123456789",
    "bankName": "VCB",
    "address": "789 Đường ABC, Quận 3, TP.HCM"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo người nhận thành công",
    "data": {
      "_id": "...",
      "fullname": "Trần Văn C",
      "phone": "0987654321",
      "email": "c@example.com",
      "bankAccount": "123456789",
      "bankName": "VCB",
      "address": "789 Đường ABC, Quận 3, TP.HCM",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin người nhận
- **Endpoint:** `PATCH /api/v1/receivers/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Request:**
  ```json
  {
    "phone": "0912345678",
    "bankAccount": "987654321"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật người nhận thành công",
    "data": {
      "_id": "...",
      "phone": "0912345678",
      "bankAccount": "987654321",
      "updatedAt": "..."
    }
  }
  ```

#### Xóa người nhận
- **Endpoint:** `DELETE /api/v1/receivers/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa người nhận thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

## Chú thích

### Trạng thái Căn hộ (status)
- 1: Đang cho thuê (có thể thuê)
- 2: Đã thuê (đã có người thuê)
- 3: Tạm ngưng

### Trạng thái Hợp đồng (status) 
- 1: Đang hiệu lực
- 2: Hết hạn
- 3: Đã hủy

### Trạng thái thanh toán (statusPaym)
- 1: Chưa thanh toán
- 2: Đã thanh toán

### Loại hóa đơn (type)
- 1: Tiền thuê nhà
- 2: Tiền dịch vụ

## Danh sách đầy đủ các API

Tất cả các API trong hệ thống:

### Quản lý Người dùng
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `GET /api/v1/user/profile` - Lấy thông tin người dùng
- `PUT /api/v1/user/update-profile` - Cập nhật thông tin người dùng

### Quản lý Căn hộ
- `GET /api/v1/homes` - Lấy danh sách căn hộ
- `GET /api/v1/homes/available` - Lấy danh sách căn hộ đang hoạt động
- `GET /api/v1/homes/available-for-rent` - Lấy danh sách căn hộ có thể cho thuê (chưa có hợp đồng)
- `GET /api/v1/homes/search?q=` - Tìm kiếm căn hộ
- `GET /api/v1/homes/search-by-amenities?amenities=` - Tìm kiếm căn hộ theo tiện ích
- `GET /api/v1/homes/homeowner/:homeOwnerId` - Lấy danh sách căn hộ theo chủ nhà
- `GET /api/v1/homes/:id` - Lấy thông tin căn hộ theo ID
- `POST /api/v1/homes` - Tạo căn hộ mới
- `PATCH /api/v1/homes/:id` - Cập nhật thông tin căn hộ
- `DELETE /api/v1/homes/:id` - Xóa căn hộ

### Quản lý Khách hàng
- `GET /api/v1/guests` - Lấy danh sách khách hàng
- `GET /api/v1/guests/search?q=` - Tìm kiếm khách hàng
- `GET /api/v1/guests/:id` - Lấy thông tin khách hàng theo ID
- `POST /api/v1/guests` - Tạo khách hàng mới
- `PATCH /api/v1/guests/:id` - Cập nhật thông tin khách hàng
- `DELETE /api/v1/guests/:id` - Xóa khách hàng
- `GET /api/v1/home-contracts/guest/:guestId` - Lấy danh sách hợp đồng của khách hàng

### Quản lý Chủ nhà
- `GET /api/v1/home-owners` - Lấy danh sách chủ nhà
- `GET /api/v1/home-owners/search?q=` - Tìm kiếm chủ nhà
- `GET /api/v1/home-owners/:id` - Lấy thông tin chủ nhà theo ID
- `POST /api/v1/home-owners` - Tạo chủ nhà mới
- `PATCH /api/v1/home-owners/:id` - Cập nhật thông tin chủ nhà
- `DELETE /api/v1/home-owners/:id` - Xóa chủ nhà

### Quản lý Hợp đồng nhà
- `GET /api/v1/home-contracts` - Lấy danh sách hợp đồng
- `GET /api/v1/home-contracts/search?q=` - Tìm kiếm hợp đồng
- `GET /api/v1/home-contracts/home/:homeId` - Lấy danh sách hợp đồng theo căn hộ
- `GET /api/v1/home-contracts/guest/:guestId` - Lấy danh sách hợp đồng theo khách hàng
- `GET /api/v1/home-contracts/:id` - Lấy thông tin hợp đồng theo ID
- `POST /api/v1/home-contracts` - Tạo hợp đồng mới
- `PATCH /api/v1/home-contracts/:id` - Cập nhật thông tin hợp đồng
- `DELETE /api/v1/home-contracts/:id` - Xóa hợp đồng

### Quản lý Hợp đồng dịch vụ
- `GET /api/v1/service-contracts` - Lấy danh sách hợp đồng dịch vụ
- `GET /api/v1/service-contracts/home/:homeId` - Lấy danh sách hợp đồng dịch vụ theo căn hộ
- `GET /api/v1/service-contracts/guest/:guestId` - Lấy danh sách hợp đồng dịch vụ theo khách hàng
- `GET /api/v1/service-contracts/homecontract/:homeContractId` - Lấy danh sách hợp đồng dịch vụ theo hợp đồng nhà
- `GET /api/v1/service-contracts/service/:serviceId` - Lấy danh sách hợp đồng dịch vụ theo dịch vụ
- `GET /api/v1/service-contracts/:id` - Lấy thông tin hợp đồng dịch vụ theo ID
- `POST /api/v1/service-contracts` - Tạo hợp đồng dịch vụ mới
- `PATCH /api/v1/service-contracts/:id` - Cập nhật thông tin hợp đồng dịch vụ
- `DELETE /api/v1/service-contracts/:id` - Xóa hợp đồng dịch vụ

### Quản lý Thanh toán
- `GET /api/v1/invoice-payments` - Lấy danh sách hóa đơn thanh toán
- `GET /api/v1/invoice-payments/due` - Lấy danh sách hóa đơn sắp đến hạn
- `GET /api/v1/invoice-payments/home-contract/:homeContractId` - Lấy danh sách hóa đơn theo hợp đồng nhà
- `GET /api/v1/invoice-payments/service-contract/:serviceContractId` - Lấy danh sách hóa đơn theo hợp đồng dịch vụ
- `GET /api/v1/invoice-payments/home/:homeId` - Lấy danh sách hóa đơn theo căn hộ
- `GET /api/v1/invoice-payments/:id` - Lấy thông tin hóa đơn theo ID
- `POST /api/v1/invoice-payments` - Tạo hóa đơn mới
- `PATCH /api/v1/invoice-payments/:id` - Cập nhật thông tin hóa đơn
- `PATCH /api/v1/invoice-payments/:id/status` - Cập nhật trạng thái thanh toán
- `DELETE /api/v1/invoice-payments/:id` - Xóa hóa đơn
- `POST /api/v1/invoice-payments/generate/home-contract/:homeContractId` - Tạo tự động đợt thanh toán cho hợp đồng nhà
- `POST /api/v1/invoice-payments/generate/service-contract/:serviceContractId` - Tạo tự động đợt thanh toán cho hợp đồng dịch vụ

### Quản lý Dịch vụ
- `GET /api/v1/services` - Lấy danh sách dịch vụ
- `GET /api/v1/services/search?q=` - Tìm kiếm dịch vụ
- `GET /api/v1/services/:id` - Lấy thông tin dịch vụ theo ID
- `POST /api/v1/services` - Tạo dịch vụ mới
- `PATCH /api/v1/services/:id` - Cập nhật thông tin dịch vụ
- `DELETE /api/v1/services/:id` - Xóa dịch vụ

### Upload API
- `POST /api/v1/upload` - Upload hình ảnh lên Cloudinary

### Hợp đồng khách hàng (Tổng hợp)
- `GET /api/v1/guest-contracts/:guestId` - Lấy tất cả hợp đồng của khách hàng

### 10. Quản lý Dịch vụ

#### Lấy danh sách dịch vụ
- **Endpoint:** `GET /api/v1/services`
- **Headers:** `Authorization: Bearer token`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Lấy danh sách dịch vụ thành công",
    "data": [
      {
        "_id": "...",
        "name": "Dịch vụ bảo trì thang máy",
        "unit": "Lần/quý",
        "description": "Bảo trì, kiểm tra thang máy định kỳ mỗi quý cho tòa nhà",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Tìm kiếm dịch vụ
- **Endpoint:** `GET /api/v1/services/search?q=`
- **Headers:** `Authorization: Bearer token`
- **Params:** `q` (từ khóa tìm kiếm)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Tìm kiếm dịch vụ thành công",
    "data": [
      {
        "_id": "...",
        "name": "Dịch vụ bảo trì thang máy",
        "unit": "Lần/quý",
        "description": "Bảo trì, kiểm tra thang máy định kỳ mỗi quý cho tòa nhà"
      }
    ]
  }
  ```

#### Xem chi tiết dịch vụ
- **Endpoint:** `GET /api/v1/services/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Lấy thông tin dịch vụ thành công",
    "data": {
      "_id": "...",
      "name": "Dịch vụ bảo trì thang máy",
      "unit": "Lần/quý",
      "description": "Bảo trì, kiểm tra thang máy định kỳ mỗi quý cho tòa nhà",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Tạo dịch vụ mới
- **Endpoint:** `POST /api/v1/services`
- **Headers:** `Authorization: Bearer token`
- **Request:**
  ```json
  {
    "name": "Dịch vụ bảo trì thang máy",
    "unit": "Lần/quý",
    "description": "Bảo trì, kiểm tra thang máy định kỳ mỗi quý cho tòa nhà"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo dịch vụ thành công",
    "data": {
      "_id": "...",
      "name": "Dịch vụ bảo trì thang máy",
      "unit": "Lần/quý",
      "description": "Bảo trì, kiểm tra thang máy định kỳ mỗi quý cho tòa nhà",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Cập nhật thông tin dịch vụ
- **Endpoint:** `PATCH /api/v1/services/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Request:**
  ```json
  {
    "name": "Dịch vụ bảo trì thang máy nâng cao",
    "unit": "Lần/tháng",
    "description": "Bảo trì, kiểm tra thang máy định kỳ hàng tháng"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Cập nhật dịch vụ thành công",
    "data": {
      "_id": "...",
      "name": "Dịch vụ bảo trì thang máy nâng cao",
      "unit": "Lần/tháng",
      "description": "Bảo trì, kiểm tra thang máy định kỳ hàng tháng",
      "updatedAt": "..."
    }
  }
  ```

#### Xóa dịch vụ
- **Endpoint:** `DELETE /api/v1/services/:id`
- **Headers:** `Authorization: Bearer token`
- **Params:** `id` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Xóa dịch vụ thành công",
    "data": {
      "_id": "...",
      "deleted": true
    }
  }
  ```

### 11. Upload API

#### Upload hình ảnh
- **Endpoint:** `POST /api/v1/upload`
- **Headers:** `Content-Type: multipart/form-data`
- **Request:** Form data với field `file` (hình ảnh)
- **Supported formats:** jpg, jpeg, png, gif
- **Max file size:** 5MB
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Upload hình ảnh thành công",
    "data": {
      "public_id": "real-estate/abc123",
      "url": "https://res.cloudinary.com/dtm3qtje7/image/upload/v1234567890/real-estate/abc123.jpg",
      "width": 800,
      "height": 600,
      "format": "jpg",
      "bytes": 102400
    }
  }
  ```

### 12. Hợp đồng khách hàng (Tổng hợp)

#### Lấy tất cả hợp đồng của khách hàng
- **Endpoint:** `GET /api/v1/guest-contracts/:guestId`
- **Headers:** `Authorization: Bearer token`
- **Params:** `guestId` (MongoDB ObjectId)
- **Description:** Lấy tất cả hợp đồng (thuê nhà và dịch vụ) của một khách hàng
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Lấy danh sách hợp đồng khách hàng thành công",
    "data": {
      "guestInfo": {
        "_id": "...",
        "fullname": "Nguyễn Văn A",
        "phone": "0912345678",
        "email": "a@example.com"
      },
      "homeContracts": [
        {
          "_id": "...",
          "homeId": {
            "_id": "...",
            "address": "123 Đường ABC, Quận 1, TP.HCM"
          },
          "duration": 12,
          "renta": 10000000,
          "status": 1
        }
      ],
      "serviceContracts": [
        {
          "_id": "...",
          "serviceId": {
            "_id": "...",
            "name": "Dịch vụ dọn vệ sinh"
          },
          "price": 500000,
          "status": 1
        }
      ]
    }
  }
  ```

### 13. Quản lý Người nhận
- `GET /api/v1/receivers` - Lấy danh sách người nhận
- `GET /api/v1/receivers/search?q=` - Tìm kiếm người nhận
- `GET /api/v1/receivers/:id` - Lấy thông tin người nhận theo ID
- `POST /api/v1/receivers` - Tạo người nhận mới
- `PATCH /api/v1/receivers/:id` - Cập nhật thông tin người nhận
- `DELETE /api/v1/receivers/:id` - Xóa người nhận

### Thống kê
- `GET /api/v1/statistics/general` - Thống kê tổng quan
- `GET /api/v1/statistics/homes` - Thống kê căn hộ
- `GET /api/v1/statistics/revenue?year=` - Thống kê doanh thu theo tháng
- `GET /api/v1/statistics/contracts` - Thống kê hợp đồng
- `GET /api/v1/statistics/payments` - Thống kê thanh toán
- `GET /api/v1/statistics/due-payments` - Thống kê thanh toán sắp đến hạn



