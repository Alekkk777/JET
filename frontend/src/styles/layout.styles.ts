/** Stili della "cornice" della pagina: Header, Hero, il contenitore dello stage
 * (form/calcolo/risultato) e Footer. Vedi styles/tokens.ts per i colori condivisi. */

import type { CSSProperties } from "react";

import { border, colors, easing, fontDisplay, onDark, shadow } from "./tokens";

export const pageStyles: CSSProperties = {
  minHeight: "100vh",
  background: colors.paper,
  color: colors.ink,
};

export const headerStyles = {
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    padding: "20px clamp(16px, 4vw, 56px)", position: "sticky", top: 0, zIndex: 20,
    background: "rgba(255,255,255,.86)", backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${border.subtle}`,
  } as CSSProperties,
  brandRow: { display: "flex", alignItems: "center", gap: 10 } as CSSProperties,
  logoBadge: {
    width: 30, height: 30, borderRadius: 9, background: colors.ink,
    display: "flex", alignItems: "center", justifyContent: "center",
  } as CSSProperties,
  wordmark: { fontFamily: fontDisplay, fontWeight: 700, fontSize: 19, letterSpacing: "-.02em" } as CSSProperties,
  tagline: {
    fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: colors.textMuted,
    borderLeft: `1px solid ${border.strong}`, paddingLeft: 10, marginLeft: 2,
  } as CSSProperties,
  nav: { display: "flex", alignItems: "center", gap: 28, fontSize: 14, fontWeight: 500 } as CSSProperties,
  navLink: { color: colors.textMuted } as CSSProperties,
  ctaButton: {
    border: "none", background: colors.ink, color: colors.paper, fontSize: 14, fontWeight: 600,
    padding: "11px 20px", borderRadius: 999, cursor: "pointer",
  } as CSSProperties,
};

export const heroStyles = {
  section: {
    padding: "clamp(40px, 7vw, 88px) clamp(16px, 4vw, 56px) 24px", display: "flex",
    flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18,
  } as CSSProperties,
  title: {
    margin: 0, maxWidth: "18ch", fontFamily: fontDisplay, fontWeight: 700,
    fontSize: "clamp(38px, 6.4vw, 72px)", lineHeight: 0.98, letterSpacing: "-.035em", textWrap: "balance",
    animation: `riseIn .7s ${easing.spring} both`,
  } as CSSProperties,
  subtitle: {
    margin: 0, maxWidth: "52ch", fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.55, color: colors.textMuted,
    textWrap: "pretty", animation: `riseIn .7s ${easing.spring} .08s both`,
  } as CSSProperties,
};

export const stageStyles = {
  section: { padding: "8px clamp(12px, 4vw, 56px) clamp(48px, 7vw, 96px)", display: "flex", justifyContent: "center" } as CSSProperties,
  widthWrapper: (maxWidth: string): CSSProperties => ({ width: "100%", maxWidth, transition: `max-width .7s ${easing.spring}` }),
  card: {
    background: colors.paper, border: `1px solid ${border.default}`, borderRadius: 24,
    boxShadow: shadow.card, overflow: "hidden",
  } as CSSProperties,
  disclaimer: { margin: "14px 4px 0", fontSize: 12, color: colors.textFaint, lineHeight: 1.5, textAlign: "center" } as CSSProperties,
};

export const footerStyles = {
  bar: {
    background: colors.ink, color: onDark.text, padding: "40px clamp(16px, 4vw, 56px)", display: "flex",
    alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", fontSize: 13,
  } as CSSProperties,
  brandRow: { display: "flex", alignItems: "center", gap: 10, color: colors.paper } as CSSProperties,
  mascotWrap: { width: 26 } as CSSProperties,
  wordmark: { fontFamily: fontDisplay, fontWeight: 700, fontSize: 16 } as CSSProperties,
};
