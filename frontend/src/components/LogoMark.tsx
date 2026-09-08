import { colors } from "@/styles/tokens";

/** Il logo semplificato mostrato nel badge nero dell'header (non il mascotte animato). */
export function LogoMark() {
  return (
    <svg viewBox="0 0 120 100" style={{ width: 20, height: 20, display: "block" }} aria-hidden="true">
      <path d="M26 38 L16 14 L42 36 Z" fill={colors.paper} />
      <path d="M52 70 L40 90 L76 72 Z" fill={colors.paper} />
      <rect x={22} y={38} width={76} height={32} rx={16} fill={colors.paper} />
      <path d="M94 39 L118 54 L94 69 Z" fill={colors.paper} />
    </svg>
  );
}
