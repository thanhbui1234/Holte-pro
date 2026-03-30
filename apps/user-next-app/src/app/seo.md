# SEO Architecture – `user-next-app`

## Cấu trúc tổng quan

```
src/app/
├── metadata.ts     ← Trung tâm điều khiển SEO
├── layout.tsx      ← Site-level JSON-LD
├── page.tsx        ← Page-level JSON-LD
├── sitemap.ts      ← /sitemap.xml
└── robots.ts       ← /robots.txt
```

---

## `metadata.ts` — Trung tâm SEO

### `SEO_CONFIG`

Single source of truth cho tất cả constants SEO. Chỉ cần đổi ở đây là áp dụng toàn app.

```ts
export const SEO_CONFIG = {
  SITE_URL: "https://holte-platform.com",
  SITE_NAME: "Holte Platform",
  TWITTER_HANDLE: "@holteplatform",
  LOGO_URL: "https://holte-platform.com/logo.png",
  DEFAULT_OG_IMAGE: "/og-image.png",
}
```

---

### `generateMetadata(options)` — Dùng cho mọi page

```ts
export const metadata = generateMetadata({
  title: "Features",
  description: "...",
  canonical: "/features",   // URL chuẩn, tránh duplicate content
  keywords: ["..."],
  noIndex: false,           // true để ẩn khỏi Google (staging, private)
})
```

Tự động sinh ra:
- `<title>` + `<meta description>`
- **Open Graph** (Facebook/LinkedIn share preview)
- **Twitter Card** (image preview khi share Twitter)
- **Canonical URL** — tránh duplicate content
- **hreflang** — khai báo đa ngôn ngữ en-US / vi-VN (PRO)
- **Robots** rules (index/follow)

---

### `getOrganizationSchema()`

```ts
// Dùng trong layout.tsx — chạy trên mọi page
getOrganizationSchema()
```

Cho Google biết công ty đứng sau website → có thể hiển thị **Knowledge Panel** (box bên phải Google khi search tên công ty).

---

### `getWebsiteSchema()`

```ts
// Dùng trong layout.tsx — chạy trên mọi page
getWebsiteSchema()
```

Kích hoạt **Sitelinks Searchbox** — ô tìm kiếm ngay trên trang kết quả Google.

---

### `getBreadcrumbSchema(items[])`

```ts
// items[] tự động được prepend với Home
getBreadcrumbSchema([
  { name: "Blog", url: "/blog" },
  { name: "Bài viết", url: "/blog/bai-viet" },
])
```

Hiển thị đường dẫn điều hướng ngay trên SERP:
```
Holte Platform › Blog › Bài viết
```

---

### `getFAQSchema(faqs[])` — SHOULD HAVE

```ts
getFAQSchema([
  { question: "Holte miễn phí không?", answer: "Có, có gói free..." },
])
```

FAQ tự động expand/collapse ngay trên trang kết quả Google → **tăng diện tích hiển thị gấp 2–3x**.

---

### `getProductSchema(options)` — PRO

```ts
getProductSchema({
  name: "Holte Pro",
  description: "...",
  image: "/product.png",
  url: "/pricing",
  price: "29",
  priceCurrency: "USD",
  ratingValue: 4.8,
  reviewCount: 124,
  availability: "InStock",
})
```

Rich result dạng **product card** với giá, số sao, tình trạng → dùng cho trang pricing/product.

---

### `getBlogPostSchema(options)` — SHOULD HAVE

```ts
getBlogPostSchema({
  title: "Tiêu đề bài viết",
  description: "...",
  url: "/blog/bai-viet",
  image: "/blog/cover.png",
  datePublished: "2026-01-01",
  dateModified: "2026-03-30",
  authorName: "Holte Team",
})
```

Article schema → Google hiển thị tác giả, ngày đăng, ảnh ngay trên SERP.

---

## `layout.tsx` — Site-level JSON-LD

Inject **một** `<script>` duy nhất với `@graph` (best practice của Google):

```ts
const graph = {
  "@context": "https://schema.org",
  "@graph": [getOrganizationSchema(), getWebsiteSchema()],
}
```

Chạy trên **tất cả các page** vì nằm trong root layout.

---

## `page.tsx` — Page-level JSON-LD

Inject thêm schema riêng của từng page:

```tsx
// Home page: BreadcrumbList + FAQPage
const HomeStructuredData = () => (
  <>
    <script ... {getBreadcrumbSchema([])} />
    <script ... {getFAQSchema(HOME_FAQS)} />
  </>
);
```

**Pattern cho pages khác:**

```tsx
// /features page
const FeaturesStructuredData = () => (
  <script ... {getBreadcrumbSchema([{ name: "Features", url: "/features" }])} />
);
```

---

## `sitemap.ts` → `/sitemap.xml`

```ts
// Next.js App Router tự serve tại /sitemap.xml — không cần config thêm
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://holte-platform.com", priority: 1.0, changeFrequency: "weekly" },
    { url: "https://holte-platform.com/features", priority: 0.8 },
    // Thêm routes mới ở đây khi có thêm pages
  ];
}
```

Submit lên Google Search Console để crawler lập lịch crawl hợp lý.

---

## `robots.ts` → `/robots.txt`

```ts
// Next.js App Router tự serve tại /robots.txt — không cần config thêm
export default function robots(): MetadataRoute.Robots {
  rules: [
    { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/_next/"] },
    { userAgent: "GPTBot", disallow: ["/"] },  // Chặn AI scrapers
  ],
  sitemap: "https://holte-platform.com/sitemap.xml",
}
```

---

## Luồng hoạt động tổng hợp

```
Người dùng search Google
       ↓
Google crawl /robots.txt → biết được quyền crawl
       ↓
Google đọc /sitemap.xml → danh sách URLs cần index
       ↓
Google crawl từng page → đọc <head>:
  ├── <title>, <meta>, canonical, hreflang
  ├── JSON-LD: Organization + WebSite  (mọi page — layout.tsx)
  └── JSON-LD: Breadcrumb + FAQ/Product (từng page — page.tsx)
       ↓
Hiển thị rich results trên SERP
```

---

## Checklist khi thêm page mới

```ts
// 1. Export metadata
export const metadata = generateMetadata({
  title: "Tên page",
  canonical: "/path",
});

// 2. Thêm vào sitemap.ts
{ url: `${SEO_CONFIG.SITE_URL}/path`, priority: 0.8 }

// 3. Thêm structured data phù hợp
getBreadcrumbSchema([{ name: "Tên page", url: "/path" }])
getFAQSchema([...])         // nếu có FAQ
getProductSchema({...})     // nếu là product/pricing page
getBlogPostSchema({...})    // nếu là blog post
```

---

## Cần làm sau khi deploy

- [ ] Điền `verification.google` trong `layout.tsx` (lấy từ Google Search Console)
- [ ] Submit `sitemap.xml` lên [Google Search Console](https://search.google.com/search-console)
- [ ] Test structured data tại [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Thay `HOME_FAQS` trong `page.tsx` bằng data thực hoặc từ CMS
