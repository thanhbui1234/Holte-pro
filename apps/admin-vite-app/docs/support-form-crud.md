# API: Support Form (CMS)

Tài liệu các API quản lý form hỗ trợ trên CMS. API tạo form dành cho khách hàng nằm ở [create-support-form.md](create-support-form.md) (`/app-api`).

## Cấu trúc đối tượng SupportForm
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | Long | ID của form |
| `phone` | String | Số điện thoại |
| `fullName` | String | Họ tên |
| `availableTime` | String | Thời gian khách hàng rảnh |
| `reason` | String | Lý do liên hệ |
| `status` | String | Trạng thái liên hệ (`PENDING`, `CONTACTED`) |
| `supporter` | String | Email người hỗ trợ |
| `createdTime` | Long | Thời gian tạo (epoch ms) |
| `updatedTime` | Long | Thời gian cập nhật (epoch ms) |

---

## 1. Lấy danh sách form hỗ trợ
- **Endpoint**: `/cms-api/v1/get-list-support-form`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `phone` | String | Không | Filter theo số điện thoại |
| `status` | String | Không | Filter theo trạng thái (`PENDING`, `CONTACTED`) |
| `supporter` | String | Không | Filter theo email người hỗ trợ |

**Ví dụ:**
```json
{
  "status": "PENDING"
}
```

### Response Success (HTTP 200)
```json
{
  "data": {
    "supportForms": [
      {
        "id": 1718700000000,
        "phone": "0901234567",
        "fullName": "Nguyễn Văn A",
        "availableTime": "9:00 - 12:00",
        "reason": "Cần tư vấn gói quay phim",
        "status": "PENDING",
        "supporter": null,
        "createdTime": 1718700000000,
        "updatedTime": 1718700000000
      }
    ]
  }
}
```

---

## 2. Lấy chi tiết form hỗ trợ
- **Endpoint**: `/cms-api/v1/get-support-form`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Long | Có | ID của form cần lấy |

**Ví dụ:**
```json
{
  "id": 1718700000000
}
```

### Response Success (HTTP 200)
```json
{
  "data": {
    "supportForm": {
      "id": 1718700000000,
      "phone": "0901234567",
      "fullName": "Nguyễn Văn A",
      "availableTime": "9:00 - 12:00",
      "reason": "Cần tư vấn gói quay phim",
      "status": "CONTACTED",
      "supporter": "support@example.com",
      "createdTime": 1718700000000,
      "updatedTime": 1718700000000
    }
  }
}
```

---

## 3. Cập nhật trạng thái form hỗ trợ
- **Endpoint**: `/cms-api/v1/update-support-form-status`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Long | Có | ID của form |
| `status` | String | Có | Trạng thái (`PENDING`, `CONTACTED`) |
| `supporter` | String | Không | Email người hỗ trợ (cập nhật khi đánh dấu đã liên hệ) |

**Ví dụ:**
```json
{
  "id": 1718700000000,
  "status": "CONTACTED",
  "supporter": "support@example.com"
}
```

### Response Success (HTTP 200)
```json
{
  "data": {}
}
```

---

## 4. Xóa form hỗ trợ
- **Endpoint**: `/cms-api/v1/remove-support-form`
- **Method**: `DELETE`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Long | Có | ID của form cần xóa |

**Ví dụ:**
```json
{
  "id": 1718700000000
}
```

### Response Success (HTTP 200)
```json
{
  "data": {}
}
```
