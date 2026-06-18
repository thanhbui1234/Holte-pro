# API: Remove Video

## Endpoint
- Method: `DELETE`
- Path: `/cms-api/v1/remove-video`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>` (Google OAuth2 access token)
- Content-Type: `application/json`

## Mô tả

Xóa record video trong DB ngay lập tức (chỉ video thuộc user đang đăng nhập). Nếu video đã có `youtubeVideoId`, việc xóa trên YouTube chạy **bất đồng bộ** dùng cùng `accessToken`.

## Request

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

### Body

> Endpoint dùng `DELETE` với JSON body.

Bắt buộc:
- `videoId` (number)

Ví dụ:

```json
{
  "videoId": 345
}
```

Ví dụ cURL:

```bash
curl --location --request DELETE 'http://localhost:8686/cms-api/v1/remove-video' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
    "videoId": 345
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "f04ad9f4-9cd2-4d63-bfc4-4733024d16c8",
  "cmdTime": 1760000000000,
  "triggerId": "f04ad9f4-9cd2-4d63-bfc4-4733024d16c8",
  "method": "DELETE",
  "path": "/cms-api/v1/remove-video",
  "data": {
    "videoId": 345,
    "result": true
  }
}
```

`data.result`: `true` khi record đã được xóa khỏi DB.

### Error thường gặp

Thiếu `videoId`:

```json
{
  "cmdId": "f2389009-4f6e-40ce-9bea-0ad95ec56a6e",
  "cmdTime": 1760000001234,
  "triggerId": "f2389009-4f6e-40ce-9bea-0ad95ec56a6e",
  "method": "DELETE",
  "path": "/cms-api/v1/remove-video",
  "error": {
    "errorMsg": "videoId is required",
    "errorCode": -2026
  }
}
```

Video không tồn tại hoặc không thuộc user:

```json
{
  "cmdId": "4e61668f-d42f-4f68-9fe0-4b2338f173c7",
  "cmdTime": 1760000005678,
  "triggerId": "4e61668f-d42f-4f68-9fe0-4b2338f173c7",
  "method": "DELETE",
  "path": "/cms-api/v1/remove-video",
  "error": {
    "errorMsg": "not found",
    "errorCode": 404
  }
}
```

Token đã bị revoke:

```json
{
  "cmdId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "cmdTime": 1760000006789,
  "triggerId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "method": "DELETE",
  "path": "/cms-api/v1/remove-video",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```

Token không hợp lệ:

```json
{
  "cmdId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "cmdTime": 1760000007777,
  "triggerId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "method": "DELETE",
  "path": "/cms-api/v1/remove-video",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```
