# API: Create Video

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/create-video`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>` (Google OAuth2 access token)
- Content-Type: `application/json`

## Mô tả

Lưu metadata video vào PostgreSQL khi video **đã tồn tại trên YouTube**. Record được tạo với `status=UPLOADED`.

Luồng thường dùng: gọi `upload-video` để upload file lên YouTube → lấy `youtubeVideoId` từ response → gọi `create-video` để lưu vào DB.

## Request

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

### Body

Bắt buộc:
- `youtubeVideoId` (string): ID video trên YouTube
- `title` (string): tiêu đề hiển thị trong CMS

Tùy chọn:
- `description` (string)
- `tags` (string[]): danh sách tag
- `fileSize` (number): kích thước file gốc (bytes)
- `privacyStatus` (string): mặc định `"unlisted"`
- `categoryId` (number): YouTube category ID
- `visible` (boolean): hiển thị trên CMS, mặc định `true`

Ví dụ:

```json
{
  "youtubeVideoId": "abc123xyz",
  "title": "Wedding Highlight 2026",
  "description": "Highlight clip from the wedding ceremony",
  "tags": ["wedding", "highlight"],
  "fileSize": 152034500,
  "privacyStatus": "unlisted",
  "categoryId": 22,
  "visible": true
}
```

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/create-video' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{
    "youtubeVideoId": "abc123xyz",
    "title": "Wedding Highlight 2026",
    "description": "Highlight clip from the wedding ceremony",
    "tags": ["wedding", "highlight"],
    "fileSize": 152034500
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "cmdTime": 1760000000000,
  "triggerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "method": "POST",
  "path": "/cms-api/v1/create-video",
  "data": {
    "youtubeVideoId": "abc123xyz",
    "title": "Wedding Highlight 2026",
    "description": "Highlight clip from the wedding ceremony",
    "tags": ["wedding", "highlight"],
    "fileSize": 152034500,
    "privacyStatus": "unlisted",
    "categoryId": 22,
    "visible": true,
    "videoId": 345,
    "status": "UPLOADED"
  }
}
```

`data` gồm:
- `videoId`: id video trong DB
- `status`: luôn `"UPLOADED"` khi tạo thành công
- Các field còn lại echo từ request (kèm giá trị mặc định nếu không truyền)

### Error thường gặp

Thiếu `youtubeVideoId`:

```json
{
  "cmdId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "cmdTime": 1760000001234,
  "triggerId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "method": "POST",
  "path": "/cms-api/v1/create-video",
  "error": {
    "errorMsg": "youtubeVideoId is required",
    "errorCode": -2026
  }
}
```

Thiếu `title`:

```json
{
  "cmdId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "cmdTime": 1760000002345,
  "triggerId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "method": "POST",
  "path": "/cms-api/v1/create-video",
  "error": {
    "errorMsg": "title is required",
    "errorCode": -2026
  }
}
```

Token đã bị revoke:

```json
{
  "cmdId": "d4e5f6a7-b8c9-0123-def0-234567890123",
  "cmdTime": 1760000003456,
  "triggerId": "d4e5f6a7-b8c9-0123-def0-234567890123",
  "method": "POST",
  "path": "/cms-api/v1/create-video",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```

Token không hợp lệ hoặc thiếu:

```json
{
  "cmdId": "e5f6a7b8-c9d0-1234-ef01-345678901234",
  "cmdTime": 1760000004567,
  "triggerId": "e5f6a7b8-c9d0-1234-ef01-345678901234",
  "method": "POST",
  "path": "/cms-api/v1/create-video",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```
