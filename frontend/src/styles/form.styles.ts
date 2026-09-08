/** Stili del form di calcolo: layout a due colonne (aside nero + campi), e i
 * controlli custom (mensilità, figli, coniuge, select). */

import type { CSSProperties } from "react";

import { border, colors, easing, fontDisplay, onDark, shadow } from "./tokens";

/** Etichetta di un campo del form ("Mensilità", "Regione", "Figli a carico", ...) —
 * condivisa da tutti i controlli del form per restare visivamente coerenti. */
export const fieldLabelText: CSSProperties = { fontSize: 13, fontWeight: 600, color: colors.textMuted };

export const formStyles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" } as CSSProperties,

  aside: {
    background: colors.ink, color: colors.paper, padding: "clamp(26px, 3vw, 38px)",
    display: "flex", flexDirection: "column", gap: 22, justifyContent: "space-between",
  } as CSSProperties,
  asideTopGroup: { display: "flex", flexDirection: "column", gap: 18 } as CSSProperties,
  asideMascotFloat: { animation: "jetFloat 4.5s ease-in-out infinite", width: 88 } as CSSProperties,
  asideHeadline: { margin: 0, fontFamily: fontDisplay, fontSize: 21, lineHeight: 1.28, letterSpacing: "-.02em" } as CSSProperties,
  asideSubtext: { margin: 0, fontSize: 13.5, lineHeight: 1.6, color: onDark.text } as CSSProperties,
  progressGroup: {
    display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${onDark.track}`, paddingTop: 18,
  } as CSSProperties,
  progressLabel: {
    fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: onDark.textStrong,
  } as CSSProperties,
  progressTrack: { height: 6, borderRadius: 999, background: onDark.track, overflow: "hidden" } as CSSProperties,
  progressFill: (width: string): CSSProperties => ({
    height: "100%", width, borderRadius: 999, background: colors.paper, transition: `width .5s ${easing.spring}`,
  }),

  fieldsColumn: { padding: "clamp(26px, 3.4vw, 44px)", animation: `riseIn .55s ${easing.spring} both` } as CSSProperties,
  fieldsStack: { display: "flex", flexDirection: "column", gap: 26 } as CSSProperties,

  ralLabel: { display: "flex", flexDirection: "column", gap: 10 } as CSSProperties,
  ralInputRow: {
    display: "flex", alignItems: "center", gap: 12, border: `1px solid ${border.strong}`, borderRadius: 16,
    padding: "4px 18px", background: colors.surface,
  } as CSSProperties,
  ralCurrencySign: { fontFamily: fontDisplay, fontSize: 26, color: colors.textFaint } as CSSProperties,
  ralInput: {
    flex: 1, minWidth: 0, border: "none", background: "transparent", fontFamily: fontDisplay, fontWeight: 600,
    fontSize: 30, letterSpacing: "-.02em", padding: "12px 0", color: colors.ink,
  } as CSSProperties,
  ralSlider: { width: "100%", accentColor: colors.ink, margin: "2px 0 0" } as CSSProperties,

  fieldsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 } as CSSProperties,

  errorBanner: {
    margin: 0, fontSize: 13, color: colors.danger, background: colors.dangerSurface, borderRadius: 12, padding: "12px 16px",
  } as CSSProperties,

  actionsRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
    borderTop: `1px solid ${border.light}`, paddingTop: 22,
  } as CSSProperties,
  backButton: {
    border: "none", background: "transparent", color: colors.textMuted, fontSize: 14, fontWeight: 600,
    cursor: "pointer", padding: "8px 0",
  } as CSSProperties,
  submitButton: {
    border: "none", background: colors.ink, color: colors.paper, fontSize: 16, fontWeight: 600, padding: "16px 30px",
    borderRadius: 999, cursor: "pointer", transition: "transform .2s ease, background .2s ease",
  } as CSSProperties,
};

/** Selettore a segmenti riusabile (mensilità 12/13/14, settore privato/pubblico, ...). */
export const segmentedPickerStyles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 8 } as CSSProperties,
  track: (columns: number): CSSProperties => ({
    display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6, background: colors.surfaceAlt, padding: 5, borderRadius: 14,
  }),
  option: (active: boolean): CSSProperties => ({
    border: "none", cursor: "pointer", padding: "10px 4px", borderRadius: 10, fontSize: 14, fontWeight: 600,
    background: active ? colors.paper : "transparent", color: active ? colors.ink : colors.textMuted,
    boxShadow: active ? shadow.tileActive : "none",
  }),
};

export const childrenCounterStyles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 8 } as CSSProperties,
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${border.strong}`,
    borderRadius: 14, padding: "7px 10px", background: colors.surface,
  } as CSSProperties,
  stepButton: {
    width: 34, height: 34, borderRadius: 10, border: "none", background: colors.surfaceAlt, cursor: "pointer",
    fontSize: 18, lineHeight: 1, color: colors.ink,
  } as CSSProperties,
  count: { fontFamily: fontDisplay, fontWeight: 600, fontSize: 18 } as CSSProperties,
};

export const spouseToggleStyles = {
  button: {
    display: "flex", alignItems: "center", gap: 14, textAlign: "left", border: `1px solid ${border.strong}`,
    background: colors.surface, borderRadius: 16, padding: "16px 18px", cursor: "pointer", width: "100%",
  } as CSSProperties,
  track: (active: boolean): CSSProperties => ({
    width: 44, height: 26, flex: "none", borderRadius: 999, background: active ? colors.ink : colors.toggleTrackOff,
    position: "relative", transition: "background .25s ease",
  }),
  knob: (active: boolean): CSSProperties => ({
    position: "absolute", top: 3, left: active ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: colors.paper,
    boxShadow: shadow.knob, transition: `left .25s ${easing.spring}`,
  }),
  textColumn: { display: "flex", flexDirection: "column", gap: 2 } as CSSProperties,
  title: { fontSize: 15, fontWeight: 600 } as CSSProperties,
  subtitle: { fontSize: 12.5, color: colors.textMuted } as CSSProperties,
};

export const selectFieldStyles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 8 } as CSSProperties,
  select: {
    appearance: "none", border: `1px solid ${border.strong}`, borderRadius: 14, padding: "14px 16px", fontSize: 15,
    fontWeight: 500, background: colors.surface, color: colors.ink, cursor: "pointer",
  } as CSSProperties,
};
