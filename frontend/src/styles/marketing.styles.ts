/** Stili delle sezioni informative sotto lo stage principale: "Come funziona" e FAQ. */

import type { CSSProperties } from "react";

import { border, colors, fontDisplay } from "./tokens";

export const howItWorksStyles = {
  section: { padding: "clamp(48px, 7vw, 96px) clamp(16px, 4vw, 56px)", borderTop: `1px solid ${border.light}` } as CSSProperties,
  container: { maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 } as CSSProperties,
  title: {
    margin: 0, maxWidth: "22ch", fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(28px, 3.6vw, 44px)",
    lineHeight: 1.05, letterSpacing: "-.03em",
  } as CSSProperties,
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 } as CSSProperties,
  stepCard: {
    background: colors.paper, border: `1px solid ${border.default}`, borderRadius: 24, padding: 26,
    display: "flex", flexDirection: "column", gap: 12,
  } as CSSProperties,
  stepNumber: { fontFamily: fontDisplay, fontWeight: 700, fontSize: 13, color: colors.ink } as CSSProperties,
  stepTitle: { margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 20, letterSpacing: "-.02em" } as CSSProperties,
  stepBody: { margin: 0, fontSize: 14.5, lineHeight: 1.6, color: colors.textMuted, textWrap: "pretty" } as CSSProperties,
};

export const faqStyles = {
  section: { padding: "0 clamp(16px, 4vw, 56px) clamp(48px, 7vw, 96px)" } as CSSProperties,
  grid: { maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px 48px" } as CSSProperties,
  item: { display: "flex", flexDirection: "column", gap: 8, borderTop: `1px solid ${border.medium}`, paddingTop: 18 } as CSSProperties,
  question: { margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, letterSpacing: "-.01em" } as CSSProperties,
  answer: { margin: 0, fontSize: 14.5, lineHeight: 1.6, color: colors.textMuted, textWrap: "pretty" } as CSSProperties,
};
