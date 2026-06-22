# API: List Videos (App)

## Endpoint
- Method: `POST`
- Path: `/app-api/v1/get-list-video`
- Auth: Không yêu cầu token
- Content-Type: `application/json`

## Mô tả

API public cho app/website — trả về danh sách video **hiển thị công khai** (`visible = true`) của tất cả user.

Hỗ trợ filter theo nhiều `categoryIds` và/hoặc nhiều `statuses` cùng lúc (điều kiện `IN`).

> Khác với [`get-list-video` CMS](get-list-video.md): CMS yêu cầu auth và chỉ trả video của user đang đăng nhập.

## Request

### Headers
- `Content-Type: application/json`

### Body

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `categoryIds` | number[] | Không | Filter theo loại video (xem bảng `VideoCategory` bên dưới) |
| `statuses` | string[] | Không | Filter theo trạng thái (`PROCESSING`, `UPLOADED`, `FAILED`) |

Không truyền field hoặc truyền mảng rỗng `[]` → không filter theo field đó.

**VideoCategory (`categoryId`):**

| Giá trị | Enum | Mô tả |
| :---: | :--- | :--- |
| `1` | `WEDDING` | Đám cưới |
| `2` | `FUNERAL` | Lễ tang |
| `3` | `ENGAGEMENT` | Ăn hỏi |
| `4` | `OUTDOOR` | Dã ngoại |

**Ví dụ — lấy tất cả video public:**

```json
{}
```

**Ví dụ — filter theo category và status:**

```json
{
  "categoryIds": [1, 3],
  "statuses": ["UPLOADED"]
}
```

Ví dụ cURL:

```bash
curl --location --request POST 'http://localhost:8686/app-api/v1/get-list-video' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "categoryIds": [1, 3],
    "statuses": ["UPLOADED"]
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "7c4b0ad2-46bd-447d-b96f-db6431dc5792",
  "cmdTime": 1760000000000,
  "triggerId": "7c4b0ad2-46bd-447d-b96f-db6431dc5792",
  "method": "POST",
  "path": "/app-api/v1/get-list-video",
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
        "categoryId": 1,
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

Chỉ trả video có `visible = true`.

### Error thường gặp

`categoryIds` hoặc `statuses` không hợp lệ:

```json
{
  "cmdId": "4f27897f-763f-4fca-a164-8cf7d5e31f95",
  "cmdTime": 1760000000987,
  "triggerId": "4f27897f-763f-4fca-a164-8cf7d5e31f95",
  "method": "POST",
  "path": "/app-api/v1/get-list-video",
  "error": {
    "errorMsg": "categoryIds is invalid",
    "errorCode": -2026
  }
}
```
