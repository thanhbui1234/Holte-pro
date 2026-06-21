import { useEffect } from "react";

/**
 * Blocks the browser's tab-close / reload dialog while `enabled` is true.
 * The browser shows its own generic message — custom text is ignored in modern browsers.
 */
export function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);
}
