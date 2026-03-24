# 🏗️ Monorepo Guide — Turborepo + pnpm

Tài liệu này mô tả công nghệ chính và cách thiết lập monorepo cho dự án **Holte-pro** sử dụng [Turborepo](https://turbo.build/) và [pnpm](https://pnpm.io/).

---

## 📦 Công nghệ chính (Tech Stack Overview)

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **pnpm** | 9+ | Package manager — quản lý workspace, cài dependency |
| **Turborepo** | 2+ | Build orchestrator — cache, pipeline task song song |
| **TypeScript** | 5+ | Ngôn ngữ chính cho toàn bộ monorepo |
| **Next.js** | 15 | Framework app cho người dùng (`user-next-app`) |
| **Vite + React** | 6 / 19 | Framework app cho admin (`admin-vite-app`) |
| **Tailwind CSS** | v4 | Styling — dùng plugin tích hợp cho Next & Vite |
| **shadcn/ui** | latest | Component library — xây dựng trong `shared-ui` |
| **Radix UI** | 1+ | Primitive headless UI cho shadcn/ui |
| **ESLint** | 10+ | Linting — cấu hình dùng chung từ `packages/config` |

---

## 📁 Cấu trúc thư mục

```
Holte-pro/                        ← Root workspace
├── apps/
│   ├── user-next-app/            ← App Next.js 15 (người dùng, port 3000)
│   └── admin-vite-app/           ← App Vite + React (admin, port 5173)
├── packages/
│   ├── shared-ui/                ← Component dùng chung (shadcn/ui, Radix)
│   └── config/                   ← Config dùng chung (ESLint, tsconfig)
├── package.json                  ← Root package, khai báo scripts Turbo
├── pnpm-workspace.yaml           ← Khai báo các workspace packages
└── turbo.json                    ← Pipeline tasks cho Turborepo
```

---

## 🚀 Cách tạo Monorepo từ đầu (Step-by-step)

### Bước 1 — Khởi tạo thư mục và cài pnpm

```bash
mkdir my-monorepo && cd my-monorepo
npm install -g pnpm
```

### Bước 2 — Tạo `pnpm-workspace.yaml`

File này khai báo các thư mục con là workspace packages:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Bước 3 — Tạo `package.json` ở root

```json
{
  "name": "my-monorepo",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

> **Lưu ý:** `"private": true` bắt buộc ở root để tránh publish nhầm lên npm.

### Bước 4 — Cài Turborepo

```bash
pnpm add -D turbo -w   # -w = install ở root workspace
```

### Bước 5 — Tạo `turbo.json` (Pipeline cấu hình)

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

**Giải thích:**
- `"^build"` — build các `packages/*` trước, sau đó mới build `apps/*`
- `"cache": false` — dev server không cache (vì thay đổi liên tục)
- `"persistent": true` — task dev chạy mãi (watch mode)
- `"outputs"` — Turbo biết file nào cần cache sau khi build

### Bước 6 — Tạo shared package

```bash
mkdir -p packages/shared-ui
```

```json
// packages/shared-ui/package.json
{
  "name": "shared-ui",
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

### Bước 7 — Tạo app Next.js

```bash
mkdir -p apps/user-next-app
pnpm create next-app apps/user-next-app --typescript
```

Thêm dependency tới shared package trong `apps/user-next-app/package.json`:

```json
{
  "dependencies": {
    "shared-ui": "workspace:*"
  }
}
```

> `workspace:*` — pnpm dùng package nội bộ thay vì tải từ npm registry.

### Bước 8 — Tạo app Vite + React

```bash
pnpm create vite apps/admin-vite-app --template react-ts
```

Tương tự thêm `"shared-ui": "workspace:*"` vào dependencies.

### Bước 9 — Cài toàn bộ dependencies

```bash
pnpm install   # chạy ở root, pnpm tự link tất cả workspace packages
```

### Bước 10 — Chạy dev server

```bash
# Chạy tất cả app cùng lúc (Turbo song song)
pnpm dev

# Chạy riêng lẻ 1 app
pnpm --filter user-next-app dev
pnpm --filter admin-vite-app dev
```

---

## ⚙️ Cách Turborepo hoạt động

```
pnpm dev
   └─ turbo run dev
        ├─ [packages/shared-ui]  ← build trước (nếu có build step)
        ├─ [apps/user-next-app]  ← next dev (port 3000)
        └─ [apps/admin-vite-app] ← vite dev (port 5173)
```

Turborepo tự động:
1. **Song song hóa** — chạy các task độc lập cùng lúc
2. **Cache thông minh** — nếu source không đổi, dùng lại kết quả build trước (remote cache hỗ trợ Vercel)
3. **Dependency graph** — đảm bảo `packages` build trước `apps`

---

## 🔗 Cách dùng shared package trong app

```tsx
// apps/user-next-app/src/app/page.tsx
import { Button } from 'shared-ui/components/button';

export default function Page() {
  return <Button>Click me</Button>;
}
```

pnpm tự link `shared-ui` từ `packages/shared-ui` → không cần publish lên npm.

---

## 📋 Commands thường dùng

```bash
# Chạy dev tất cả apps
pnpm dev

# Build toàn bộ monorepo (đúng thứ tự dependency)
pnpm build

# Lint toàn bộ
pnpm lint

# Thêm package vào 1 app cụ thể
pnpm --filter user-next-app add axios

# Thêm package vào shared-ui
pnpm --filter shared-ui add clsx

# Thêm devDependency vào root
pnpm add -D prettier -w
```

---

## 🧩 Tích hợp Tailwind CSS v4

Tailwind v4 có cách tích hợp khác v3 — dùng plugin Native thay vì PostCSS config:

**Next.js** (`apps/user-next-app`):
```bash
pnpm --filter user-next-app add -D tailwindcss @tailwindcss/postcss
```

`postcss.config.mjs`:
```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

**Vite** (`apps/admin-vite-app`):
```bash
pnpm --filter admin-vite-app add -D tailwindcss @tailwindcss/vite
```

`vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';
export default { plugins: [react(), tailwindcss()] };
```

---

> **Tạo ngày:** 2026-03-24 | **Stack:** pnpm 9 · Turborepo 2 · Next.js 15 · Vite 6 · Tailwind CSS v4
