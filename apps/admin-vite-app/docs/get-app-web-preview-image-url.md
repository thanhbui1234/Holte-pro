# API: Get Source Image URL (App)

## Endpoint
- Method: `POST`
- Path: `/app-api/v1/get-web-preview-image-url`
- Auth: Không yêu cầu token
- Content-Type: `application/json`

## Mô tả

API public cho app/website — lấy URL ảnh preview hiện tại. Nếu chưa có giá trị nào được set từ CMS, `imageUrl` trả về `null`.

> Khác với [`get-web-preview-image-url` CMS](../cms-api/web-preview-image-url-crud.md): CMS yêu cầu auth và có thêm upsert/remove; App chỉ đọc và không cần auth.

## Request

### Headers
- `Content-Type: application/json`

### Body

Không yêu cầu body (có thể truyền `{}`).

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/app-api/v1/get-web-preview-image-url' \
  --header 'Content-Type: application/json' \
  --data-raw '{}'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "cmdTime": 1760000000000,
  "triggerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "method": "POST",
  "path": "/app-api/v1/get-web-preview-image-url",
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
  "path": "/app-api/v1/get-web-preview-image-url",
  "data": {
    "imageUrl": null
  }
}
```
