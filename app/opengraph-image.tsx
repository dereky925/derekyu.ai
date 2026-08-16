import { ImageResponse } from "next/og";
import { topoSvg } from "@/lib/topo-svg";

export const alt =
  "Derek Yu — Aerospace Engineering, Aerial Photography, Coding Projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const src = `data:image/svg+xml,${encodeURIComponent(topoSvg(size.width, size.height))}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#050505",
          color: "#f4f4f5",
        }}
      >
        <img
          src={src}
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            display: "flex",
            backgroundImage:
              "linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.35) 42%, rgba(5,5,5,0.12) 100%)",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
            <div style={{ fontSize: 32, color: "#b4b4bc", maxWidth: 880 }}>
              Aerospace Engineering, Aerial Photography, Coding Projects
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
