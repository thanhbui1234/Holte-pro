# API: Source Image URL CRUD (CMS)

Nhóm 3 endpoint quản lý URL ảnh preview (web preview image URL). Dữ liệu được lưu vào file `web_preview_image_url.txt` — luôn chỉ có 1 giá trị duy nhất.

Tất cả endpoint đều yêu cầu auth token hợp lệ.

---

## 1. Get Source Image URL

### Endpoint
- Method: `POST`
- Path: `/cms-api/v1/get-web-preview-image-url`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>`
- Content-Type: `application/json`

### Mô tả

Lấy URL ảnh preview hiện tại. Nếu chưa có giá trị nào được set, `imageUrl` trả về `null`.

### Request

#### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

#### Body

Không yêu cầu body (có thể truyền `{}`).

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/get-web-preview-image-url' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{}'
```

### Response

#### Success - HTTP 200

```json
{
  "cmdId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "cmdTime": 1760000000000,
  "triggerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "method": "POST",
  "path": "/cms-api/v1/get-web-preview-image-url",
  "data": {
    "imageUrl": "https://example.com/images/preview.jpg"
  }
}
```

Chưa có giá trị (`imageUrl = null`):

```json
{
  "cmdId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "cmdTime": 1760000000000,
  "triggerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "method": "POST",
  "path": "/cms-api/v1/get-web-preview-image-url",
  "data": {
    "imageUrl": null
  }
}
```

---

## 2. Upsert Source Image URL

### Endpoint
- Method: `POST`
- Path: `/cms-api/v1/upsert-web-preview-image-url`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>`
- Content-Type: `application/json`

### Mô tả

Tạo mới hoặc thay thế URL ảnh preview. Luôn chỉ lưu 1 giá trị — nếu đã có sẵn sẽ bị replace.

### Request

#### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

#### Body

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `imageUrl` | string | Có | URL ảnh preview cần lưu |

Ví dụ:

```json
{
  "imageUrl": "https://example.com/images/preview.jpg"
}
```

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/upsert-web-preview-image-url' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
    "imageUrl": "https://example.com/images/preview.jpg"
  }'
```

### Response

#### Success - HTTP 200

```json
{
  "cmdId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "cmdTime": 1760000001000,
  "triggerId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "method": "POST",
  "path": "/cms-api/v1/upsert-web-preview-image-url",
  "data": {
    "imageUrl": "https://example.com/images/preview.jpg"
  }
}
```

#### Error — Thiếu `imageUrl`

```json
{
  "cmdId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "cmdTime": 1760000001500,
  "triggerId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "method": "POST",
  "path": "/cms-api/v1/upsert-web-preview-image-url",
  "error": {
    "errorMsg": "input invalid",
    "errorCode": -2026
  }
}
```

---

## 3. Remove Source Image URL

### Endpoint
- Method: `POST`
- Path: `/cms-api/v1/remove-web-preview-image-url`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>`
- Content-Type: `application/json`

### Mô tả

Xóa URL ảnh preview hiện tại (ghi rỗng vào file). Sau khi remove, `get-web-preview-image-url` sẽ trả về `imageUrl: null`.

### Request

#### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

#### Body

Không yêu cầu body (có thể truyền `{}`).

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/remove-web-preview-image-url' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{}'
```

### Response

#### Success - HTTP 200

```json
{
  "cmdId": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "cmdTime": 1760000002000,
  "triggerId": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "method": "POST",
  "path": "/cms-api/v1/remove-web-preview-image-url",
  "data": {}
}
```

---

## Error chung (Auth)

### Token không hợp lệ hoặc thiếu token

```json
{
  "cmdId": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "cmdTime": 1760000003000,
  "triggerId": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "method": "POST",
  "path": "/cms-api/v1/get-web-preview-image-url",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```

### Token đã bị revoke

```json
{
  "cmdId": "f6a7b8c9-d0e1-2345-fabc-456789012345",
  "cmdTime": 1760000003500,
  "triggerId": "f6a7b8c9-d0e1-2345-fabc-456789012345",
  "method": "POST",
  "path": "/cms-api/v1/get-web-preview-image-url",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```
