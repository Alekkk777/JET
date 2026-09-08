/** Stili della schermata di caricamento ("Sto facendo i conti…"). */

import type { CSSProperties } from "react";

import { colors, fontDisplay } from "./tokens";

export const calculatingStyles = {
  panel: {
    padding: "clamp(48px, 8vw, 100px)", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 22, textAlign: "center",
  } as CSSProperties,
  mascotWrap: { animation: "jetFloat 2.2s ease-in-out infinite", width: 120 } as CSSProperties,
  label: { margin: 0, fontFamily: fontDisplay, fontSize: 22, letterSpacing: "-.02em" } as CSSProperties,
  progressTrack: {
    width: 220, height: 5, borderRadius: 999, background: colors.surfaceAlt, overflow: "hidden", position: "relative",
  } as CSSProperties,
  progressSweep: { position: "absolute", inset: 0, width: "34%", borderRadius: 999, background: colors.ink, animation: "sweep 1.1s ease-in-out infinite" } as CSSProperties,
};
