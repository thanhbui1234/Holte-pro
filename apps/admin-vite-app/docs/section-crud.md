# API: Section CRUD

Tài liệu này mô tả các API CRUD cho đối tượng `Section`.

## Cấu trúc đối tượng Section
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | Long | ID của section |
| `name` | String | Tên section |
| `description` | String | Mô tả section |
| `displayOrder` | Integer | Thứ tự hiển thị |
| `status` | String | Trạng thái (`ACTIVE`, `INACTIVE`) |
| `data` | JsonObject | Dữ liệu mở rộng (JSON) |
| `createdTime` | Long | Thời gian tạo (epoch ms) |
| `updatedTime` | Long | Thời gian cập nhật (epoch ms) |

---

## 1. Lấy danh sách Section
- **Endpoint**: `/cms-api/v1/get-list-section`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `name` | String | Không | Filter theo tên (tìm kiếm tương đối) |
| `status` | String | Không | Filter theo trạng thái (`ACTIVE`, `INACTIVE`) |

**Ví dụ:**
```json
{
  "name": "Trang chủ",
  "status": "ACTIVE"
}
```

### Response Success (HTTP 200)
```json
{
  "data": {
    "sections": [
      {
        "id": 1718700000000,
        "name": "Trang chủ",
        "description": "Section giới thiệu trang chủ",
        "displayOrder": 1,
        "status": "ACTIVE",
        "data": {},
        "createdTime": 1718700000000,
        "updatedTime": 1718700000000
      }
    ]
  }
}
```

---

## 2. Lấy chi tiết Section
- **Endpoint**: `/cms-api/v1/get-section`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Long | Có | ID của section cần lấy |

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
    "section": {
      "id": 1718700000000,
      "name": "Trang chủ",
      "description": "Section giới thiệu trang chủ",
      "displayOrder": 1,
      "status": "ACTIVE",
      "data": {},
      "createdTime": 1718700000000,
      "updatedTime": 1718700000000
    }
  }
}
```

---

## 3. Tạo mới Section
- **Endpoint**: `/cms-api/v1/create-section`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `name` | String | Có | Tên section |
| `description` | String | Không | Mô tả |
| `displayOrder` | Integer | Không | Thứ tự hiển thị |
| `status` | String | Không | Trạng thái (Mặc định: `ACTIVE`) |
| `data` | JsonObject | Không | Dữ liệu JSON tùy chỉnh |

**Ví dụ:**
```json
{
  "name": "Tin tức",
  "description": "Section hiển thị tin tức mới nhất",
  "displayOrder": 2,
  "status": "ACTIVE",
  "data": {
    "layout": "grid"
  }
}
```

### Response Success (HTTP 200)
```json
{
  "data": {
    "sectionId": 1718700001000
  }
}
```

---

## 4. Cập nhật Section
- **Endpoint**: `/cms-api/v1/update-section`
- **Method**: `POST`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Long | Có | ID section cần cập nhật |
| `name` | String | Có | Tên section mới |
| `description` | String | Không | Mô tả mới |
| `displayOrder` | Integer | Không | Thứ tự hiển thị mới |
| `status` | String | Không | Trạng thái mới |
| `data` | JsonObject | Không | Dữ liệu JSON mới |

**Ví dụ:**
```json
{
  "id": 1718700001000,
  "name": "Tin tức nổi bật",
  "displayOrder": 3
}
```

### Response Success (HTTP 200)
```json
{
  "data": {
    "status": "success"
  }
}
```

---

## 5. Xóa Section
- **Endpoint**: `/cms-api/v1/remove-section`
- **Method**: `DELETE`
- **Auth**: Yêu cầu `Authorization: Bearer <accessToken>`

### Request Body
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Long | Có | ID section cần xóa |

**Ví dụ:**
```json
{
  "id": 1718700001000
}
```

### Response Success (HTTP 200)
```json
{
  "data": {
    "status": "success"
  }
}
```
