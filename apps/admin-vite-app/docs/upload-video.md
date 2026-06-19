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

## Frontend Background Upload Architecture

Hệ thống Frontend quản lý tiến trình upload file video lên YouTube và lưu vào CMS thông qua mô hình **Background Upload Manager** với `UploadContext`.

### 1. Luồng hoạt động (Workflow)

1. **Khởi tạo (Initiation):** 
   Khi người dùng chọn file và ấn "Upload" ở `AddVideoModal`, hàm `startUpload` trong `UploadContext` được gọi. Modal lập tức tự đóng, không chặn UI (non-blocking).
2. **Quản lý Job (Job Queue):**
   Một `UploadJob` mới được tạo với `id` ngẫu nhiên và trạng thái ban đầu là `uploading`. Job này được lưu vào mảng `jobs` trong state toàn cục của `UploadProvider`.
3. **Upload & Theo dõi tiến độ:**
   - Hệ thống dùng `Axios` (`videoApi.upload`) để đẩy file lên backend.
   - Hàm `onUploadProgress` của Axios được sử dụng để tính toán `%` (`progressEvent.loaded / progressEvent.total * 100`).
   - Mọi thay đổi về `progress` đều trigger React state update, giúp `GlobalUploadProgress` (thanh Toast ở góc màn hình) hiển thị thanh trượt trực quan.
4. **Xử lý hậu kỳ (Processing):**
   - Khi tiến trình `uploading` đạt `100%`, trạng thái chuyển sang `processing`.
   - Hệ thống ngầm gọi API `create-video` để báo cho server lưu metadata vào cơ sở dữ liệu.
5. **Hoàn tất / Thất bại:**
   - Nếu thành công, trạng thái đổi thành `success`, danh sách video tự động refetch (bằng React Query `invalidateQueries`). Toast báo xanh và tự biến mất sau 3 giây.
   - Nếu lỗi, trạng thái đổi thành `error`, thông báo lỗi hiển thị và Toast tự biến mất sau 5 giây.

### 2. Tính năng bảo vệ UX nâng cao

- **Hủy Upload (Abort Request):** 
  Người dùng có thể ấn dấu X trên Toast để hủy upload. Hệ thống sẽ bật lên một `AlertDialog` của Shadcn để xác nhận. Nếu đồng ý, `UploadContext` sử dụng `AbortController.abort()` để ngay lập tức ngắt hoàn toàn kết nối HTTP của Axios, tiết kiệm băng thông.
- **Bảo vệ chống mất dữ liệu (BeforeUnload Interceptor):** 
  Bằng cách lắng nghe sự kiện `beforeunload` của trình duyệt, nếu có bất kỳ job nào đang `uploading` hoặc `processing`, hệ thống sẽ chặn hành động vô tình ấn F5 hoặc đóng Tab của người dùng bằng popup cảnh báo native của trình duyệt.
