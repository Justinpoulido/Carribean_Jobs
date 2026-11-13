import { ImageResponse } from "next/og";

export const shareSize = { width: 1200, height: 630 };

export function shareImage(title: string, subtitle: string, detail: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06283d",
          color: "white",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#fbbf24" }}>
          Caribbean Jobs
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 36 }}>
            {subtitle}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 28, color: "#bae6fd" }}>
            {detail}
          </div>
        </div>
      </div>
    ),
    { ...shareSize },
  );
}
