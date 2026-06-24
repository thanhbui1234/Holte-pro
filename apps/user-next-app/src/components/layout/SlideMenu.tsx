"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, Facebook, Instagram, Mail } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useLoadingBar } from "../providers/TopLoadingBarProvider";

const NAV_ITEMS = [
  { index: "01", label: "Home", href: "/" },
  { index: "02", label: "Wedding Highlights", href: "/wedding-highlight" },
  { index: "03", label: "Wedding Reels", href: "/wedding-reels" },
  { index: "04", label: "Traditional Films", href: "/traditional-film" },
  { index: "05", label: "Contact Us", href: "/contact" },
];

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
  activeSections?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  emailHref?: string;
}

export function SlideMenu({ open, onClose, activeSections = [], facebookUrl = "https://facebook.com", instagramUrl = "https://instagram.com", emailHref = "mailto:hello@jowfilm.vn" }: SlideMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { start } = useLoadingBar();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (href: string) => {
    if (href === pathname) {
      onClose();
      return;
    }
    start();
    onClose();
    setTimeout(() => {
      router.push(href);
    }, 350);
  };

  const navItems = NAV_ITEMS.filter((item) => {
    if (item.label === "Home") return true; // Always show home
    if (item.label === "Wedding Highlights") return activeSections.includes("wedding-highlights");
    if (item.label === "Wedding Reels") return activeSections.includes("wedding-reels");
    if (item.label === "Traditional Films") return activeSections.includes("traditional-films");
    if (item.label === "Contact Us") return activeSections.includes("contact-cta");
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <nav
        className={`fixed top-0 left-0 z-[70] flex h-full w-full flex-col bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] sm:w-[380px] dark:bg-stone-950 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Main navigation"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-stone-200 px-8 py-6 dark:border-stone-800/60">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 dark:text-amber-400">
            JOW Film
          </span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition-all duration-200 hover:border-stone-400 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-1 flex-col justify-center gap-1 px-8">
          {navItems.map((item, i) => {
            const indexStr = (i + 1).toString().padStart(2, "0");
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={`group flex w-full items-center gap-4 rounded-lg px-2 py-4 text-left transition-all duration-200 ${pathname === item.href
                    ? "bg-amber-50 dark:bg-amber-900/20"
                    : "hover:bg-stone-100 dark:hover:bg-stone-800/50"
                    }`}
                  style={{
                    transform: open ? "translateX(0)" : "translateX(-16px)",
                    opacity: open ? 1 : 0,
                    transitionProperty: "transform, opacity, background-color",
                    transitionDuration: "500ms, 400ms, 200ms",
                    transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94), ease, ease",
                    transitionDelay: open ? `${80 + i * 50}ms, ${80 + i * 50}ms, 0ms` : "0ms, 0ms, 0ms",
                  }}
                >
                  {/* Number */}
                  <span className={`w-7 shrink-0 text-xs tabular-nums transition-colors duration-200 ${pathname === item.href
                    ? "text-amber-400 dark:text-amber-400"
                    : "text-stone-400 group-hover:text-amber-600 dark:text-stone-600 dark:group-hover:text-amber-500"
                    }`}>
                    {indexStr}
                  </span>

                  {/* Label */}
                  <span className={`text-xl font-light tracking-wide transition-colors duration-200 ${pathname === item.href
                    ? "text-amber-400 dark:text-amber-400 font-normal"
                    : "text-stone-800 group-hover:text-stone-950 dark:text-stone-200 dark:group-hover:text-white"
                    }`}>
                    {item.label}
                  </span>

                  {/* Arrow */}
                  <svg
                    className={`ml-auto h-4 w-4 transition-all duration-200 ${pathname === item.href
                      ? "translate-x-1 text-amber-400 opacity-100 dark:text-amber-400"
                      : "translate-x-0 text-stone-300 opacity-0 group-hover:translate-x-1 group-hover:text-amber-600 group-hover:opacity-100 dark:text-stone-700 dark:group-hover:text-amber-400"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom — socials + tagline */}
        <div
          className="border-t border-stone-200 px-8 py-6 dark:border-stone-800/60"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 500ms ease 400ms, transform 500ms ease 400ms",
          }}
        >
          {/* <p className="mb-4 text-xs leading-relaxed text-stone-400 dark:text-stone-600">
            Crafting timeless wedding films <br />
            across Vietnam.
          </p>

          <div className="mb-4">
            <ThemeToggle />
          </div> */}

          <div className="flex items-center gap-4">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-stone-400 transition-colors duration-200 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-stone-400 transition-colors duration-200 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={emailHref}
              aria-label="Email"
              className="text-stone-400 transition-colors duration-200 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
