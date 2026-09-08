import { colors } from "@/styles/tokens";

interface JetMascotProps {
  size: number;
  accent?: string;
  ink?: string;
}

function Eye({ cx, delay }: { cx: number; delay: number }) {
  return (
    <g style={{ transformOrigin: `${cx}px 52px`, animation: `blink 4.6s ease-in-out ${delay}s infinite` }}>
      <circle cx={cx} cy={52} r={5.4} fill={colors.paper} />
      <circle cx={cx + 1} cy={52.6} r={2.5} fill={colors.ink} />
    </g>
  );
}

/** Il mascotte animato di JET, con occhi che sbattono le palpebre. Stesse coordinate
 * SVG del design originale (metodo `jetSvg` del componente .dc.html). */
export function JetMascot({ size, accent = colors.paper, ink = colors.ink }: JetMascotProps) {
  return (
    <svg viewBox="0 0 130 104" style={{ width: size, height: "auto", display: "block", overflow: "visible" }} aria-label="JET">
      <ellipse cx={64} cy={96} rx={30} ry={5} fill={ink} opacity={0.08} />
      <path d="M30 40 L17 12 L45 38 Z" fill={accent} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M54 70 L42 92 L80 74 Z" fill={accent} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
      <rect x={22} y={36} width={76} height={36} rx={18} fill={accent} stroke={ink} strokeWidth={3} />
      <path d="M96 38 L122 54 L96 70 Z" fill={accent} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M96 44 L108 54 L96 64" fill="none" stroke={ink} strokeWidth={2.4} opacity={0.35} strokeLinecap="round" />
      <Eye cx={66} delay={0} />
      <Eye cx={84} delay={0.12} />
      <path d="M66 64 q9 6 18 0" fill="none" stroke={ink} strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}
