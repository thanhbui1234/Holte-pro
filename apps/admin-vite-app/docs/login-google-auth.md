# API: Login Google Auth

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/login-google-auth`
- Auth: Không yêu cầu Bearer token (nằm trong whitelist)
- Content-Type: `application/json`

## Mô tả

Đổi Google authorization code lấy **Google OAuth2 access token**, đồng bộ profile user vào DB, trả token cho client.

Client dùng `accessToken` này làm `Authorization: Bearer <accessToken>` cho các API CMS. Gọi `logout` với cùng token để thu hồi phía server. Refresh token do client xử lý qua thư viện OAuth2 của Google.

## Request

### Headers
- `Content-Type: application/json`

### Body

Bắt buộc:
- `code` (string): authorization code nhận từ Google OAuth callback
- `redirectUrl` (string): redirect URI đã đăng ký với Google (phải khớp lúc đổi code)

Ví dụ:

```json
{
  "code": "4/0AdQt8qhExampleAuthCode",
  "redirectUrl": "http://localhost:4000/auth/google/callback"
}
```

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/login-google-auth' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "code": "4/0AdQt8qhExampleAuthCode",
    "redirectUrl": "http://localhost:4000/auth/google/callback"
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "7ca80cb0-2b5a-47ff-a21a-05d8f145fd83",
  "cmdTime": 1760000000000,
  "triggerId": "7ca80cb0-2b5a-47ff-a21a-05d8f145fd83",
  "method": "POST",
  "path": "/cms-api/v1/login-google-auth",
  "data": {
    "code": "4/0AdQt8qhExampleAuthCode",
    "redirectUrl": "http://localhost:4000/auth/google/callback",
    "ttl": 3600,
    "accessToken": "ya29.a0AfH6SMBxExampleGoogleAccessToken",
    "user": {
      "id": 12,
      "email": "member@example.com",
      "googleSub": "google-sub-id",
      "emailVerified": true,
      "displayName": "Member Name",
      "givenName": "Member",
      "familyName": "Name",
      "avatarUrl": "https://lh3.googleusercontent.com/...",
      "lastLoginAt": 1760000000000
    }
  }
}
```

`data` gồm:
- `accessToken`: Google OAuth2 access token — dùng cho mọi API CMS cần auth và upload YouTube
- `ttl`: thời gian sống token theo Google (`expires_in`, đơn vị **giây**, mặc định `3600`)
- `user`: thông tin user nội bộ đã sync từ Google (chỉ user đã được tạo trước trong DB mới login được)

### Error thường gặp

Thiếu `code` hoặc `redirectUrl`:

```json
{
  "cmdId": "ee667145-c8f4-4962-a798-a49b4ffb0881",
  "cmdTime": 1760000001234,
  "triggerId": "ee667145-c8f4-4962-a798-a49b4ffb0881",
  "method": "POST",
  "path": "/cms-api/v1/login-google-auth",
  "error": {
    "errorMsg": "input invalid",
    "errorCode": -2026
  }
}
```

Không tìm thấy account nội bộ (email chưa được admin tạo):

```json
{
  "cmdId": "209bb3ab-d58b-4968-b5f5-6a8d4100ccbf",
  "cmdTime": 1760000005678,
  "triggerId": "209bb3ab-d58b-4968-b5f5-6a8d4100ccbf",
  "method": "POST",
  "path": "/cms-api/v1/login-google-auth",
  "error": {
    "errorMsg": "account not exist",
    "errorCode": -2026
  }
}
```
