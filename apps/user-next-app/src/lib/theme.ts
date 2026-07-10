export function getThemeFromBgColor(backgroundColor?: string, defaultTheme: "dark" | "light" = "dark"): "dark" | "light" {
  if (!backgroundColor) return defaultTheme;

  let hex = backgroundColor.replace("#", "");
  
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return defaultTheme;

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If luminance is >= 128, the background is light, so we need a "light" theme (dark text)
  // If luminance is < 128, the background is dark, so we need a "dark" theme (light text)
  return yiq >= 128 ? "light" : "dark";
}
