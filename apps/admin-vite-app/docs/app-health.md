# API: Health Check

## Endpoint
- Method: `GET`
- Path: `/app-api/v1/health`
- Auth: Không yêu cầu token (theo config hiện tại)
- Content-Type: `application/json`

## Mô tả

Kiểm tra service còn hoạt động. Dùng cho load balancer / monitoring.

## Request

Request không bắt buộc body.

Ví dụ:

```bash
curl --location --request GET 'http://localhost:8686/app-api/v1/health'
```

## Response

### Success - HTTP 200

```json
{
  "cmdId": "2f7068b8-a2d2-484d-aaec-1cb4c5b62461",
  "cmdTime": 1760000000000,
  "triggerId": "2f7068b8-a2d2-484d-aaec-1cb4c5b62461",
  "method": "GET",
  "path": "/app-api/v1/health",
  "data": {
    "status": "OK"
  }
}
```

`data` gồm:
- `status`: trạng thái service, hiện trả `"OK"`

### Error thường gặp

```json
{
  "cmdId": "d3859c53-8172-4e37-95f6-b94f72a6ec1b",
  "cmdTime": 1760000001234,
  "error": {
    "errorMsg": "system error",
    "errorCode": 500
  }
}
```
