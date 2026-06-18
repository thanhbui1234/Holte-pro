# API: List Videos

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/get-list-video`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>` (Google OAuth2 access token)
- Content-Type: `application/json`

## Mô tả

Trả về danh sách video của user đang đăng nhập. `userId` được resolve từ access token — client **không** truyền `userId` trong body.

## Request

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

### Body

Không bắt buộc field nào. Có thể gửi body rỗng `{}`.

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/get-list-video' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <accessToken>' \
  --data-raw '{}'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "7c4b0ad2-46bd-447d-b96f-db6431dc5792",
  "cmdTime": 1760000000000,
  "triggerId": "7c4b0ad2-46bd-447d-b96f-db6431dc5792",
  "method": "POST",
  "path": "/cms-api/v1/get-list-video",
  "data": {
    "videos": [
      {
        "id": 345,
        "userId": 12,
        "youtubeVideoId": "abc123xyz",
        "youtubeUrl": "https://www.youtube.com/watch?v=abc123xyz",
        "youtubeEmbedUrl": "https://www.youtube.com/embed/abc123xyz",
        "youtubeThumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/default.jpg",
        "youtubeMediumThumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/mqdefault.jpg",
        "youtubeHighThumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/hqdefault.jpg",
        "title": "Wedding Highlight 2026",
        "description": "Highlight clip from the wedding ceremony",
        "tags": ["wedding", "highlight"],
        "fileSize": 152034500,
        "status": "UPLOADED",
        "privacyStatus": "unlisted",
        "categoryId": 22,
        "visible": true,
        "createdTime": 1760000000000,
        "updatedTime": 1760000030000
      }
    ]
  }
}
```

`data.videos[]` gồm:
- `id`, `userId`, `youtubeVideoId`, `youtubeUrl`, `youtubeEmbedUrl`
- `youtubeThumbnailUrl`, `youtubeMediumThumbnailUrl`, `youtubeHighThumbnailUrl`
- `title`, `description`, `tags`, `fileSize`, `status`, `privacyStatus`
- `categoryId`, `visible`, `createdTime`, `updatedTime`

### Error thường gặp

Token đã bị revoke:

```json
{
  "cmdId": "4f27897f-763f-4fca-a164-8cf7d5e31f95",
  "cmdTime": 1760000000987,
  "triggerId": "4f27897f-763f-4fca-a164-8cf7d5e31f95",
  "method": "POST",
  "path": "/cms-api/v1/get-list-video",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```

Token không hợp lệ hoặc thiếu:

```json
{
  "cmdId": "4f27897f-763f-4fca-a164-8cf7d5e31f95",
  "cmdTime": 1760000001234,
  "triggerId": "4f27897f-763f-4fca-a164-8cf7d5e31f95",
  "method": "POST",
  "path": "/cms-api/v1/get-list-video",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```
