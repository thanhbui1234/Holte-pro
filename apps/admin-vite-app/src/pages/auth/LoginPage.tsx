import { Film, Sparkles } from "lucide-react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";


function GoogleLogo({ size = 18 }: { size?: number }) {
  console.log("GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FilmGrain() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

function handleGoogleLogin() {
  const redirectUri = `${window.location.origin}/oauth-callback`;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile https://www.googleapis.com/auth/youtube.upload",
    access_type: "offline",
    prompt: "consent",
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-stone-950">
      <FilmGrain />

      {/* ── Left panel: branding ── */}
      <div className="relative hidden flex-col justify-between p-10 lg:flex lg:w-[55%]">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(217,119,6,0.08),transparent_70%)]" />

        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_8px_24px_-8px_rgba(217,119,6,0.5)]">
            <Sparkles className="absolute h-3 w-3 text-white/30 mix-blend-overlay" />
            <Film className="relative h-5 w-5 text-stone-950" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">JOW Film</p>
            <p className="text-[10px] text-amber-500/70">Studio Admin</p>
          </div>
        </div>

        {/* Main quote */}
        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500/70">
              Wedding Cinematography
            </p>
            <h1 className="font-['Playfair_Display',serif] text-5xl font-bold leading-[1.1] text-white xl:text-6xl">
              Khoảnh khắc<br />
              <span className="text-amber-400">của bạn</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Được kể bằng ngôn ngữ điện ảnh — mỗi thước phim là một di sản tình yêu trường tồn.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { value: "200+", label: "Wedding Films" },
              { value: "5+", label: "Years" },
              { value: "98%", label: "Happy Couples" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-stone-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px] text-stone-600">
          © {new Date().getFullYear()} JOW Film. All rights reserved.
        </p>
      </div>

      {/* ── Right panel: login card ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 to-stone-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(217,119,6,0.05),transparent_60%)]" />

        {/* Mobile logo */}
        <div className="relative mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700">
            <Film className="h-5 w-5 text-stone-950" />
          </div>
          <p className="text-sm font-semibold text-white">JOW Film</p>
        </div>

        {/* Card */}
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-500/20 via-transparent to-transparent opacity-60 blur-sm" />

          <div className="relative rounded-2xl border border-white/8 bg-white/4 p-8 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="mb-8 space-y-1.5">
              <h2 className="font-['Playfair_Display',serif] text-2xl font-semibold text-white">
                Chào mừng trở lại
              </h2>
              <p className="text-sm text-stone-400">
                Đăng nhập để quản lý nội dung studio
              </p>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-stone-500">
                Đăng nhập với
              </span>
              <span className="h-px flex-1 bg-white/8" />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
            >
              <GoogleLogo size={18} />
              Tiếp tục với Google
            </button>

            {/* Footer note */}
            <p className="mt-6 text-center text-[11px] leading-relaxed text-stone-600">
              Chỉ tài khoản Google được cấp quyền mới có thể truy cập hệ thống quản trị này.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
