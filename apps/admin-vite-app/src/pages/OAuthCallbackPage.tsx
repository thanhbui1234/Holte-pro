import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Film } from "lucide-react";
import { useAuth, decodeJwt } from "@/context/auth-context";
import type { AuthUser } from "@/context/auth-context";
import { http } from "@/lib/axios";

export function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = params.get("code");
    const error = params.get("error");

    if (error || !code) {
      navigate(`/login?error=${encodeURIComponent(error ?? "no_code")}`, { replace: true });
      return;
    }

    const redirectUrl = `${window.location.origin}/oauth-callback`;

    http
      .post("/cms-api/v1/login-google-auth", { code, redirectUrl })
      .then(({ data }) => {
        // Hỗ trợ nhiều dạng response: { token }, { accessToken }, { data: { token/accessToken } }
        const nested = data.data ?? {};
        const nestedUser = nested.user ?? {};
        const token: string =
          data.token ?? data.accessToken ?? nested.token ?? nested.accessToken ?? "";
        if (!token) throw new Error("no_token");

        let user: AuthUser = { name: "", email: "", picture: "", sub: "" };
        try {
          const payload = decodeJwt(token);
          user = {
            name: payload["name"] ?? nestedUser.displayName ?? nestedUser.name ?? data.name ?? "",
            email: payload["email"] ?? nestedUser.email ?? data.email ?? "",
            picture: payload["picture"] ?? nestedUser.avatarUrl ?? nestedUser.picture ?? data.picture ?? "",
            sub: payload["sub"] ?? nestedUser.googleSub ?? nestedUser.sub ?? data.sub ?? "",
          };
        } catch {
          user = {
            name: nestedUser.displayName ?? nestedUser.name ?? data.name ?? "",
            email: nestedUser.email ?? data.email ?? "",
            picture: nestedUser.avatarUrl ?? nestedUser.picture ?? data.picture ?? "",
            sub: nestedUser.googleSub ?? nestedUser.sub ?? data.sub ?? "",
          };
        }

        login(user, token);
        navigate("/", { replace: true });
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Lỗi không xác định";
        setErrorMsg(msg);
      });
  }, []);

  if (errorMsg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-950">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
          <Film className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-sm text-red-400">Đăng nhập thất bại: {errorMsg}</p>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="cursor-pointer text-xs text-amber-500 underline underline-offset-4"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-950">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_8px_24px_-8px_rgba(217,119,6,0.5)]">
        <Film className="h-6 w-6 animate-pulse text-stone-950" />
      </div>
      <p className="text-sm text-stone-400">Đang xác thực...</p>
    </div>
  );
}
