import { ImageResponse } from "next/og";

export const alt = "Soos in Kamperland: dé plek voor jong en oud";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "white",
          background: "linear-gradient(135deg, #260b45 0%, #5315a5 100%)",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", opacity: 0.75 }}>
          Kamperland
        </div>
        <div style={{ marginTop: 24, fontSize: 108, fontWeight: 700, lineHeight: 1.05 }}>
          Soos in Kamperland
        </div>
        <div style={{ marginTop: 32, fontSize: 42, opacity: 0.9 }}>Dé plek voor jong en oud</div>
        <div
          style={{
            marginTop: 48,
            width: 160,
            height: 12,
            borderRadius: 6,
            background: "#ffb703",
          }}
        />
      </div>
    ),
    size,
  );
}
