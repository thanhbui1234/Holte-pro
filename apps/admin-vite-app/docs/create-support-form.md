# API: Tạo form hỗ trợ (App)

## Endpoint
- Method: `POST`
- Path: `/app-api/v1/create-support-form`
- Auth: Không yêu cầu token
- Content-Type: `application/json`

## Mô tả

Khách hàng gửi form liên hệ hỗ trợ từ app/website. Form mới được tạo với `status = PENDING`.

## Request Body

| Trường | Kiểu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `phone` | String | Có | Số điện thoại VN (`0xxxxxxxxx`, `84xxxxxxxxx`, `+84xxxxxxxxx`) |
| `fullName` | String | Có | Họ tên |
| `availableTime` | String | Không | Thời gian khách hàng rảnh |
| `reason` | String | Có | Lý do liên hệ |

**Ví dụ:**

```bash
curl --location --request POST 'http://localhost:8686/app-api/v1/create-support-form' \
  --header 'Content-Type: application/json' \
  --data '{
    "phone": "0901234567",
    "fullName": "Nguyễn Văn A",
    "availableTime": "9:00 - 12:00",
    "reason": "Cần tư vấn gói quay phim"
  }'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "2f7068b8-a2d2-484d-aaec-1cb4c5b62461",
  "cmdTime": 1760000000000,
  "method": "POST",
  "path": "/app-api/v1/create-support-form",
  "data": {
    "supportFormId": 1718700000000
  }
}
```

### Error thường gặp

| errorCode | errorMsg | Nguyên nhân |
| :--- | :--- | :--- |
| `-2026` | `phone is required` | Thiếu số điện thoại |
| `-2026` | `phone is invalid` | Số điện thoại không hợp lệ |
| `-2026` | `fullName is required` | Thiếu họ tên |
| `-2026` | `reason is required` | Thiếu lý do |

```json
{
  "error": {
    "errorMsg": "phone is invalid",
    "errorCode": -2026
  }
}
```
