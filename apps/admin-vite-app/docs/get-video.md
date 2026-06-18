# API: Get Video Detail

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/get-video`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>` (Google OAuth2 access token)
- Content-Type: `application/json`

## Mô tả

Lấy chi tiết một video theo `videoId` từ DB. Token được verify trước khi truy vấn.

## Request

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

### Body

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
curl --location --request POST 'http://localhost:8686/cms-api/v1/get-video' \
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
  "cmdId": "5b5db7be-5ec3-4f92-a8f9-c36f18e6af83",
  "cmdTime": 1760000000000,
  "triggerId": "5b5db7be-5ec3-4f92-a8f9-c36f18e6af83",
  "method": "POST",
  "path": "/cms-api/v1/get-video",
  "data": {
    "videoId": 345,
    "video": {
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
  }
}
```

`data.video` gồm:
- `id`, `userId`, `youtubeVideoId`, `youtubeUrl`, `youtubeEmbedUrl`
- `youtubeThumbnailUrl`, `youtubeMediumThumbnailUrl`, `youtubeHighThumbnailUrl`
- `title`, `description`, `tags`, `fileSize`, `status`, `privacyStatus`
- `categoryId`, `visible`, `createdTime`, `updatedTime`

Giá trị `status`: hiện tại record mới tạo qua `create-video` có `UPLOADED`.

### Error thường gặp

Thiếu `videoId`:

```json
{
  "cmdId": "3fd82247-d637-4a95-8ac9-2d6485f18f74",
  "cmdTime": 1760000001234,
  "triggerId": "3fd82247-d637-4a95-8ac9-2d6485f18f74",
  "method": "POST",
  "path": "/cms-api/v1/get-video",
  "error": {
    "errorMsg": "videoId is required",
    "errorCode": -2026
  }
}
```

Không tìm thấy video:

```json
{
  "cmdId": "6d24222e-ed95-4b4e-8aa4-32c83ceaa522",
  "cmdTime": 1760000005678,
  "triggerId": "6d24222e-ed95-4b4e-8aa4-32c83ceaa522",
  "method": "POST",
  "path": "/cms-api/v1/get-video",
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
  "method": "POST",
  "path": "/cms-api/v1/get-video",
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
  "method": "POST",
  "path": "/cms-api/v1/get-video",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```
