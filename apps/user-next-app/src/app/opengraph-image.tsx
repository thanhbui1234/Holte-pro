import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "JOW Film — Cinematic Wedding Films";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/logo-white.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0c0c0c", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6px", background: "linear-gradient(to bottom, #d97706, #92400e)" }} />
        <img src={logoSrc} width="280" height="280" style={{ objectFit: "contain" }} />
        <p style={{ fontSize: "26px", color: "#a8a29e", fontWeight: 300, letterSpacing: "1px", marginTop: "24px" }}>Cinematic Wedding Films</p>
        <div style={{ position: "absolute", bottom: "24px", display: "flex", gap: "32px" }}>
          <span style={{ fontSize: "13px", color: "#57534e", letterSpacing: "3px", textTransform: "uppercase" }}>jowfilm.vn</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
