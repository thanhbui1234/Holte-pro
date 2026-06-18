# API: Logout

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/logout`
- Auth: Không bắt buộc header `Authorization` (nằm trong whitelist)
- Content-Type: `application/json`

## Mô tả

Thu hồi **Google OAuth2 access token** phía server: token được đưa vào cache revoked trong bộ nhớ (TTL ~3599 giây). Sau khi logout, mọi API CMS gọi với token đó sẽ bị từ chối với lỗi `token revoked`.

Client nên đồng thời xóa token khỏi local storage. Revoke trực tiếp trên Google (nếu cần) do client xử lý qua thư viện OAuth2.

## Request

### Headers
- `Content-Type: application/json`

### Body

Bắt buộc:
- `revokeToken` (string): Google OAuth2 access token cần thu hồi (cùng giá trị dùng trong `Authorization: Bearer`)

Ví dụ:

```json
{
  "revokeToken": "ya29.a0AfH6SMBxExampleGoogleAccessToken"
}
```

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/logout' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "revokeToken": "ya29.a0AfH6SMBxExampleGoogleAccessToken"
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "4a5ac9f5-bb80-41a6-89e9-a2e522dfc0ff",
  "cmdTime": 1760000000000,
  "triggerId": "4a5ac9f5-bb80-41a6-89e9-a2e522dfc0ff",
  "method": "POST",
  "path": "/cms-api/v1/logout",
  "data": {
    "revokeToken": "ya29.a0AfH6SMBxExampleGoogleAccessToken",
    "result": true
  }
}
```

`data.result`: `true` khi token đã được ghi vào cache revoked.

### Error thường gặp

Thiếu `revokeToken`:

```json
{
  "cmdId": "8ff0f355-7e1a-44de-9f67-bbb1603a87cd",
  "cmdTime": 1760000001234,
  "triggerId": "8ff0f355-7e1a-44de-9f67-bbb1603a87cd",
  "method": "POST",
  "path": "/cms-api/v1/logout",
  "error": {
    "errorMsg": "input invalid",
    "errorCode": -2026
  }
}
```

Sau logout, gọi API CMS khác với token đã revoke:

```json
{
  "cmdId": "2c2d8d78-1728-45f1-acf0-f91dc35f6d9a",
  "cmdTime": 1760000005678,
  "triggerId": "2c2d8d78-1728-45f1-acf0-f91dc35f6d9a",
  "method": "POST",
  "path": "/cms-api/v1/get-list-video",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```
