# API Thống Kê - Hướng Dẫn Sử Dụng

## 🆕 Cập Nhật Mới Nhất
- **Pie Chart**: Thêm API `/statistics/charts/pie/homes-rental-status` - Phân bố căn hộ đã thuê và chưa cho thuê
- **Line Chart**: Thêm API `/statistics/charts/line/payments-monthly` - Các đợt thanh toán theo tháng
- **Sửa lỗi**: Cập nhật logic thống kê hợp đồng để phù hợp với cấu trúc database thực tế
- **Sửa lỗi**: Cập nhật logic thống kê căn hộ sử dụng trường `homeContract` thay vì `status`

## 🔧 Thông Tin Chung

### Base URL
```
/api/statistics
```

### Authentication
Tất cả các API đều yêu cầu Bearer Token:
```
Authorization: Bearer <access_token>
```

### Response Format
Tất cả API trả về định dạng:
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Dữ liệu thống kê
  }
}
```

---

## 📊 API Thống Kê Cơ Bản

### 1. Thống Kê Tổng Quan
```http
GET /statistics/general
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy thống kê tổng quan thành công",
  "data": {
    "homesCount": 150,
    "guestsCount": 320,
    "homeOwnersCount": 85,
    "servicesCount": 12
  }
}
```

### 2. Thống Kê Căn Hộ
```http
GET /statistics/homes
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy thống kê căn hộ thành công",
  "data": {
    "totalHomes": 150,
    "rentedHomes": 120,
    "availableHomes": 30,
    "rentedPercentage": 80,
    "availablePercentage": 20
  }
}
```

### 3. Thống Kê Hợp Đồng
```http
GET /statistics/contracts
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy thống kê hợp đồng thành công",
  "data": {
    "totalContracts": 200,
    "homeContracts": 120,
    "serviceContracts": 80,
    "activeHomeContracts": 100,
    "activeServiceContracts": 65
  }
}
```

### 4. Thống Kê Thanh Toán
```http
GET /statistics/payments
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy thống kê thanh toán thành công",
  "data": {
    "totalPayments": 1500,
    "onTimePayments": 1350,
    "latePayments": 150,
    "onTimePercentage": 90,
    "latePercentage": 10
  }
}
```

### 5. Thanh Toán Sắp Đến Hạn
```http
GET /statistics/due-payments
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy thống kê thanh toán sắp đến hạn thành công",
  "data": {
    "duePayments": 25,
    "totalDueAmount": 50000000
  }
}
```

### 6. Doanh Thu Theo Tháng (API cũ)
```http
GET /statistics/revenue?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy thống kê doanh thu theo tháng thành công",
  "data": {
    "year": 2024,
    "monthlyRevenue": [15000000, 18000000, 22000000, 19000000, 25000000, 30000000, 28000000, 32000000, 29000000, 35000000, 40000000, 45000000]
  }
}
```

---

## 📊 Bar Charts APIs

### 1. Doanh Thu Theo Tháng
```http
GET /statistics/charts/bar/revenue-monthly?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Bar Chart doanh thu thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { "month": "Tháng 1", "revenue": 15000000 },
      { "month": "Tháng 2", "revenue": 18000000 },
      { "month": "Tháng 3", "revenue": 22000000 },
      { "month": "Tháng 4", "revenue": 19000000 },
      { "month": "Tháng 5", "revenue": 25000000 },
      { "month": "Tháng 6", "revenue": 30000000 },
      { "month": "Tháng 7", "revenue": 28000000 },
      { "month": "Tháng 8", "revenue": 32000000 },
      { "month": "Tháng 9", "revenue": 29000000 },
      { "month": "Tháng 10", "revenue": 35000000 },
      { "month": "Tháng 11", "revenue": 40000000 },
      { "month": "Tháng 12", "revenue": 45000000 }
    ],
    "config": {
      "revenue": {
        "label": "Doanh thu (VNĐ)",
        "color": "hsl(var(--chart-1))"
      }
    }
  }
}
```

### 2. So Sánh Hợp Đồng Nhà vs Dịch Vụ
```http
GET /statistics/charts/bar/contracts-comparison?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Bar Chart so sánh hợp đồng thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { "month": "Tháng 1", "homeContracts": 12, "serviceContracts": 8 },
      { "month": "Tháng 2", "homeContracts": 15, "serviceContracts": 10 },
      { "month": "Tháng 3", "homeContracts": 18, "serviceContracts": 12 }
    ],
    "config": {
      "homeContracts": {
        "label": "Hợp đồng nhà",
        "color": "hsl(var(--chart-1))"
      },
      "serviceContracts": {
        "label": "Hợp đồng dịch vụ",
        "color": "hsl(var(--chart-2))"
      }
    }
  }
}
```

### 3. Trạng Thái Thanh Toán
```http
GET /statistics/charts/bar/payment-status?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Bar Chart trạng thái thanh toán thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { "month": "Tháng 1", "onTime": 45, "late": 5 },
      { "month": "Tháng 2", "onTime": 52, "late": 8 },
      { "month": "Tháng 3", "onTime": 48, "late": 2 }
    ],
    "config": {
      "onTime": {
        "label": "Đúng hạn",
        "color": "hsl(var(--chart-1))"
      },
      "late": {
        "label": "Trễ hạn",
        "color": "hsl(var(--chart-2))"
      }
    }
  }
}
```

---

## 📈 Line Charts APIs

### 1. Xu Hướng Doanh Thu
```http
GET /statistics/charts/line/revenue-trend?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Line Chart xu hướng doanh thu thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { "month": "Tháng 1", "revenue": 15000000 },
      { "month": "Tháng 2", "revenue": 18000000 },
      { "month": "Tháng 3", "revenue": 22000000 }
    ],
    "config": {
      "revenue": {
        "label": "Doanh thu (VNĐ)",
        "color": "hsl(var(--chart-1))"
      }
    }
  }
}
```

### 2. Tỷ Lệ Lấp Đầy Căn Hộ
```http
GET /statistics/charts/line/homes-occupancy?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Line Chart tỷ lệ lấp đầy căn hộ thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { "month": "Tháng 1", "occupancyRate": 75.5 },
      { "month": "Tháng 2", "occupancyRate": 78.2 },
      { "month": "Tháng 3", "occupancyRate": 82.1 }
    ],
    "config": {
      "occupancyRate": {
        "label": "Tỷ lệ lấp đầy (%)",
        "color": "hsl(var(--chart-1))"
      }
    }
  }
}
```

### 3. Tăng Trưởng Hợp Đồng
```http
GET /statistics/charts/line/contracts-growth?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Line Chart tăng trưởng hợp đồng thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { "month": "Tháng 1", "homeContracts": 12, "serviceContracts": 8, "total": 20 },
      { "month": "Tháng 2", "homeContracts": 15, "serviceContracts": 10, "total": 25 },
      { "month": "Tháng 3", "homeContracts": 18, "serviceContracts": 12, "total": 30 }
    ],
    "config": {
      "homeContracts": {
        "label": "Hợp đồng nhà",
        "color": "hsl(var(--chart-1))"
      },
      "serviceContracts": {
        "label": "Hợp đồng dịch vụ",
        "color": "hsl(var(--chart-2))"
      },
      "total": {
        "label": "Tổng hợp đồng",
        "color": "hsl(var(--chart-3))"
      }
    }
  }
}
```

### 4. Các Đợt Thanh Toán Theo Tháng ⭐ MỚI
```http
GET /statistics/charts/line/payments-monthly?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Line Chart thanh toán theo tháng thành công",
  "data": {
    "year": 2024,
    "chartData": [
      { 
        "month": "Tháng 1", 
        "paid": 85, 
        "unpaid": 15, 
        "overdue": 5, 
        "total": 105 
      },
      { 
        "month": "Tháng 2", 
        "paid": 92, 
        "unpaid": 18, 
        "overdue": 3, 
        "total": 113 
      },
      { 
        "month": "Tháng 3", 
        "paid": 98, 
        "unpaid": 12, 
        "overdue": 7, 
        "total": 117 
      }
    ],
    "config": {
      "paid": {
        "label": "Đã thanh toán",
        "color": "hsl(var(--chart-1))"
      },
      "unpaid": {
        "label": "Chưa thanh toán",
        "color": "hsl(var(--chart-2))"
      },
      "overdue": {
        "label": "Quá hạn",
        "color": "hsl(var(--chart-3))"
      },
      "total": {
        "label": "Tổng số đợt thanh toán",
        "color": "hsl(var(--chart-4))"
      }
    }
  }
}
```

---

## 🥧 Pie Charts APIs

### 1. Phân Bố Căn Hộ Đã Thuê và Chưa Cho Thuê ⭐ MỚI
```http
GET /statistics/charts/pie/homes-rental-status
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Pie Chart trạng thái cho thuê căn hộ thành công",
  "data": {
    "totalHomes": 150,
    "chartData": [
      {
        "status": "Đã cho thuê",
        "count": 120,
        "fill": "hsl(var(--chart-1))"
      },
      {
        "status": "Chưa cho thuê",
        "count": 30,
        "fill": "hsl(var(--chart-2))"
      }
    ],
    "config": {
      "count": {
        "label": "Số lượng căn hộ"
      },
      "status": {
        "label": "Trạng thái"
      }
    }
  }
}
```

### 2. Trạng Thái Căn Hộ
```http
GET /statistics/charts/pie/homes-status
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Pie Chart trạng thái căn hộ thành công",
  "data": {
    "chartData": [
      {
        "status": "Đang cho thuê",
        "count": 85,
        "fill": "hsl(var(--chart-1))"
      },
      {
        "status": "Đã thuê",
        "count": 45,
        "fill": "hsl(var(--chart-2))"
      },
      {
        "status": "Không hoạt động",
        "count": 20,
        "fill": "hsl(var(--chart-3))"
      }
    ],
    "config": {
      "count": { "label": "Số lượng" },
      "status": { "label": "Trạng thái" }
    }
  }
}
```

### 2. Phân Bố Hợp Đồng
```http
GET /statistics/charts/pie/contracts-distribution
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Pie Chart phân bố hợp đồng thành công",
  "data": {
    "chartData": [
      {
        "type": "Hợp đồng nhà",
        "count": 120,
        "fill": "hsl(var(--chart-1))"
      },
      {
        "type": "Hợp đồng dịch vụ",
        "count": 80,
        "fill": "hsl(var(--chart-2))"
      }
    ],
    "config": {
      "count": { "label": "Số lượng" },
      "type": { "label": "Loại hợp đồng" }
    }
  }
}
```

### 3. Phương Thức Thanh Toán
```http
GET /statistics/charts/pie/payment-methods
```

**Params:** Không có

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Pie Chart phương thức thanh toán thành công",
  "data": {
    "chartData": [
      {
        "method": "Tiền mặt",
        "count": 450,
        "fill": "hsl(var(--chart-1))"
      },
      {
        "method": "Chuyển khoản",
        "count": 850,
        "fill": "hsl(var(--chart-2))"
      },
      {
        "method": "Ví điện tử",
        "count": 200,
        "fill": "hsl(var(--chart-3))"
      }
    ],
    "config": {
      "count": { "label": "Số lượng" },
      "method": { "label": "Phương thức" }
    }
  }
}
```

### 4. Nguồn Doanh Thu
```http
GET /statistics/charts/pie/revenue-sources?year=2024
```

**Params:**
- `year` (required): Năm thống kê (ví dụ: 2024)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu Pie Chart nguồn doanh thu thành công",
  "data": {
    "year": 2024,
    "chartData": [
      {
        "source": "Doanh thu từ nhà",
        "revenue": 280000000,
        "fill": "hsl(var(--chart-1))"
      },
      {
        "source": "Doanh thu từ dịch vụ",
        "revenue": 120000000,
        "fill": "hsl(var(--chart-2))"
      }
    ],
    "config": {
      "revenue": { "label": "Doanh thu (VNĐ)" },
      "source": { "label": "Nguồn doanh thu" }
    }
  }
}
```

---

## 🎯 Dashboard Overview API

### Tổng Hợp Dashboard
```http
GET /statistics/dashboard/overview?year=2024
```

**Params:**
- `year` (optional): Năm thống kê (mặc định là năm hiện tại)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu tổng quan dashboard thành công",
  "data": {
    "year": 2024,
    "overview": {
      "general": {
        "homesCount": 150,
        "guestsCount": 320,
        "homeOwnersCount": 85,
        "servicesCount": 12
      },
      "homes": {
        "totalHomes": 150,
        "rentedHomes": 120,
        "availableHomes": 30,
        "rentedPercentage": 80,
        "availablePercentage": 20
      },
      "contracts": {
        "totalContracts": 200,
        "homeContracts": 120,
        "serviceContracts": 80,
        "activeHomeContracts": 100,
        "activeServiceContracts": 65
      },
      "payments": {
        "totalPayments": 1500,
        "onTimePayments": 1350,
        "latePayments": 150,
        "onTimePercentage": 90,
        "latePercentage": 10
      }
    },
    "charts": {
      "revenueChart": {
        "year": 2024,
        "chartData": [
          { "month": "Tháng 1", "revenue": 15000000 }
        ],
        "config": {
          "revenue": {
            "label": "Doanh thu (VNĐ)",
            "color": "hsl(var(--chart-1))"
          }
        }
      },
      "homesStatusPie": {
        "chartData": [
          {
            "status": "Đang cho thuê",
            "count": 85,
            "fill": "hsl(var(--chart-1))"
          }
        ],
        "config": {
          "count": { "label": "Số lượng" },
          "status": { "label": "Trạng thái" }
        }
      }
    }
  }
}
```

---

## 📝 Tóm Tắt Tất Cả API Endpoints

### API Cơ Bản
- `GET /statistics/general`
- `GET /statistics/homes`
- `GET /statistics/contracts`
- `GET /statistics/payments`
- `GET /statistics/due-payments`
- `GET /statistics/revenue?year=2024`

### Bar Charts
- `GET /statistics/charts/bar/revenue-monthly?year=2024`
- `GET /statistics/charts/bar/contracts-comparison?year=2024`
- `GET /statistics/charts/bar/payment-status?year=2024`

### Line Charts  
- `GET /statistics/charts/line/revenue-trend?year=2024`
- `GET /statistics/charts/line/homes-occupancy?year=2024`
- `GET /statistics/charts/line/contracts-growth?year=2024`

### Pie Charts
- `GET /statistics/charts/pie/homes-status`
- `GET /statistics/charts/pie/contracts-distribution`
- `GET /statistics/charts/pie/payment-methods`
- `GET /statistics/charts/pie/revenue-sources?year=2024`

### Dashboard
- `GET /statistics/dashboard/overview?year=2024` 