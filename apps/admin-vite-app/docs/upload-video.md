# API: Upload Video

## Endpoint
- Method: `POST`
- Path: `/cms-api/v1/upload-video`
- Auth: Yêu cầu `Authorization: Bearer <accessToken>` (Google OAuth2 access token)
- Content-Type: `multipart/form-data`

## Mô tả

Upload file video lên **YouTube** đồng bộ, trả về metadata YouTube ngay khi hoàn tất. API **không** lưu record vào DB — sau khi upload thành công, gọi [`create-video`](create-video.md) với `youtubeVideoId` nhận được để lưu vào CMS.

Upload dùng cùng `accessToken` từ header (Google OAuth2 token có scope YouTube).

## Request

### Headers
- `Authorization: Bearer <accessToken>`
- `Content-Type: multipart/form-data`

### Form fields

Bắt buộc:
- `youtubeTitle` (text): tiêu đề video trên YouTube
- `file` (binary): file video

Tùy chọn:
- `youtubeDescription` (text)
- `defaultLanguage` (text): mã ngôn ngữ, ví dụ `"vi"`, `"en"`
- `privacyStatus` (text): mặc định `"unlisted"`
- `categoryId` (text): YouTube category ID
- `embeddable` (text/boolean): cho phép embed, mặc định `true`
- `tags` (text): mảng JSON, ví dụ `["wedding","highlight"]`

Ràng buộc validate:
- Extension cho phép: `.mp4`, `.mov`, `.avi`, `.mkv`, `.wmv`, `.flv`, `.webm`
- Kích thước tối đa mặc định: `2GB` (`youtube.max-file-size-bytes`)

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/cms-api/v1/upload-video' \
  --header 'Authorization: Bearer <accessToken>' \
  --form 'youtubeTitle="Wedding Highlight 2026"' \
  --form 'youtubeDescription="Highlight clip from the wedding ceremony"' \
  --form 'privacyStatus="unlisted"' \
  --form 'tags="[\"wedding\",\"highlight\"]"' \
  --form 'file=@"/path/to/video.mp4"'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "706a79dc-6d90-47fb-85aa-a4b58ba40190",
  "cmdTime": 1760000000000,
  "triggerId": "706a79dc-6d90-47fb-85aa-a4b58ba40190",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "data": {
    "youtubeTitle": "Wedding Highlight 2026",
    "youtubeDescription": "Highlight clip from the wedding ceremony",
    "privacyStatus": "unlisted",
    "tags": ["wedding", "highlight"],
    "youtubeVideoId": "abc123xyz",
    "youtubeUrl": "https://www.youtube.com/watch?v=abc123xyz",
    "youtubeEmbedUrl": "https://www.youtube.com/embed/abc123xyz",
    "youtubeThumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/default.jpg",
    "youtubeMediumThumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/mqdefault.jpg",
    "youtubeHighThumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/hqdefault.jpg"
  }
}
```

`data` gồm:
- `youtubeVideoId`: ID video trên YouTube — dùng cho bước `create-video` tiếp theo
- `youtubeUrl`, `youtubeEmbedUrl`: link xem và embed
- `youtubeThumbnailUrl`, `youtubeMediumThumbnailUrl`, `youtubeHighThumbnailUrl`: thumbnail các kích cỡ

### Error thường gặp

Thiếu `youtubeTitle`:

```json
{
  "cmdId": "5a00df06-a182-4f3c-9f44-c1ce0fc4f9a8",
  "cmdTime": 1760000001234,
  "triggerId": "5a00df06-a182-4f3c-9f44-c1ce0fc4f9a8",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "error": {
    "errorMsg": "youtubeTitle is required",
    "errorCode": -2026
  }
}
```

Thiếu file:

```json
{
  "cmdId": "7460caec-e03c-443f-b73c-a22f8499ac1f",
  "cmdTime": 1760000002345,
  "triggerId": "7460caec-e03c-443f-b73c-a22f8499ac1f",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "error": {
    "errorMsg": "video file is required",
    "errorCode": -2026
  }
}
```

Sai định dạng file:

```json
{
  "cmdId": "7460caec-e03c-443f-b73c-a22f8499ac1f",
  "cmdTime": 1760000005678,
  "triggerId": "7460caec-e03c-443f-b73c-a22f8499ac1f",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "error": {
    "errorMsg": "unsupported video format, allowed: [.mp4, .mov, .avi, .mkv, .wmv, .flv, .webm]",
    "errorCode": -2026
  }
}
```

Vượt quá kích thước file cho phép:

```json
{
  "cmdId": "7460caec-e03c-443f-b73c-a22f8499ac1f",
  "cmdTime": 1760000006789,
  "triggerId": "7460caec-e03c-443f-b73c-a22f8499ac1f",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "error": {
    "errorMsg": "file size exceeds maximum allowed",
    "errorCode": -2026
  }
}
```

Token đã bị revoke:

```json
{
  "cmdId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "cmdTime": 1760000007890,
  "triggerId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "error": {
    "errorMsg": "token revoked",
    "errorCode": -1002
  }
}
```

Token không hợp lệ hoặc thiếu:

```json
{
  "cmdId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "cmdTime": 1760000007777,
  "triggerId": "9fc0fdfb-b312-4da4-b95f-95f6f9c9ab1f",
  "method": "POST",
  "path": "/cms-api/v1/upload-video",
  "error": {
    "errorMsg": "unauthorized",
    "errorCode": 401
  }
}
```
