import type { FriendTier } from "@/lib/sponsors";

/**
 * De vormen van de Wall of Fame: een kroon, ster en hart, zoals uitgeknipt papier
 * dat de kinderen versieren. Vlakke kleur met een stippellijn als "knipnaad", zonder
 * glans of verloop.
 */

const shapes: Record<FriendTier["tone"], { path: string; fill: string; stroke: string }> = {
  gold: {
    // Kroon
    path: "M7 50 L4 18 L21 31 L32 11 L43 31 L60 18 L57 50 Z",
    fill: "#e4a92b",
    stroke: "#8a5d0c",
  },
  silver: {
    // Ster
    path: "M32 5 L39.5 24 L60 25.5 L44 38.5 L49.5 58 L32 47 L14.5 58 L20 38.5 L4 25.5 L24.5 24 Z",
    fill: "#b7bfcb",
    stroke: "#566070",
  },
  bronze: {
    // Hart
    path: "M32 57 C10 41 4 28 4 19 C4 11 10 6 17 6 C24 6 29 10 32 16 C35 10 40 6 47 6 C54 6 60 11 60 19 C60 28 54 41 32 57 Z",
    fill: "#c98650",
    stroke: "#6c3f1c",
  },
};

export function RankShape({ tone, className = "" }: { tone: FriendTier["tone"]; className?: string }) {
  const shape = shapes[tone];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d={shape.path} fill={shape.fill} stroke={shape.stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <path
        d={shape.path}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="1.4"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
        transform="translate(32 32) scale(0.8) translate(-32 -32)"
      />
    </svg>
  );
}
