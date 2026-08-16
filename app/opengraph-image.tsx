import { ImageResponse } from "next/og";

export const alt = "Derek Yu — Aerospace Engineering, Aerial Photography, Coding Projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#f4f4f5",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, color: "#8a8a93" }}>derekyu.ai</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
            }}
          >
            Derek Yu
          </div>
          <div style={{ fontSize: 32, color: "#8a8a93", maxWidth: 880 }}>
            Aerospace Engineering, Aerial Photography, Coding Projects
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
