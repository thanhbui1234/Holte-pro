# API: Create User

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/create-user`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>` (Google OAuth2 access token hợp lệ)
- Content-Type: `application/json`

## Mô tả

Tạo user mới theo email. Token được verify qua Google userinfo trước khi tạo — chỉ admin/user đã đăng nhập mới gọi được.

## Request

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

### Body

Bắt buộc:
- `email` (string)

Ví dụ:

```json
{
  "email": "new.user@example.com"
}
```

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/create-user' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
    "email": "new.user@example.com"
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "3d9af3f9-6f06-4c9d-98ba-3cfe1fdd9ff5",
  "cmdTime": 1760000000000,
  "triggerId": "3d9af3f9-6f06-4c9d-98ba-3cfe1fdd9ff5",
  "method": "POST",
  "path": "/cms-api/v1/create-user",
  "data": {
    "email": "new.user@example.com",
    "id": 101
  }
}
```

`data` gồm:
- `id`: id user vừa tạo
- `email`: echo từ request

### Error thường gặp

Thiếu email:

```json
{
  "cmdId": "6772d66f-8101-46c6-84de-e9e4aee9090e",
  "cmdTime": 1760000001234,
  "triggerId": "6772d66f-8101-46c6-84de-e9e4aee9090e",
  "method": "POST",
  "path": "/cms-api/v1/create-user",
  "error": {
    "errorMsg": "input invalid",
    "errorCode": -2026
  }
}
```

Token đã bị revoke:

```json
{
  "cmdId": "76621824-a20f-4908-9f40-7065e04afaf2",
  "cmdTime": 1760000004567,
  "triggerId": "76621824-a20f-4908-9f40-7065e04afaf2",
  "method": "POST",
  "path": "/cms-api/v1/create-user",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```

Token không hợp lệ hoặc thiếu:

```json
{
  "cmdId": "76621824-a20f-4908-9f40-7065e04afaf2",
  "cmdTime": 1760000005678,
  "triggerId": "76621824-a20f-4908-9f40-7065e04afaf2",
  "method": "POST",
  "path": "/cms-api/v1/create-user",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```
