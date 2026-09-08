/** Stili della sezione risultato: riepilogo netto, barra di ripartizione, tile
 * statistiche, elenco detrazioni. */

import type { CSSProperties } from "react";

import { border, colors, easing, fontDisplay } from "./tokens";

export const resultSectionStyles = {
  wrapper: { animation: `riseIn .6s ${easing.spring} both` } as CSSProperties,
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 0 } as CSSProperties,
};

export const resultDashboardStyles = {
  column: {
    padding: "clamp(26px, 3.4vw, 44px)", display: "flex", flexDirection: "column", gap: 26,
    borderRight: `1px solid ${border.light}`,
  } as CSSProperties,
  headerRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" } as CSSProperties,
  netColumn: { display: "flex", flexDirection: "column", gap: 6 } as CSSProperties,
  eyebrow: {
    fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: colors.textFaint,
  } as CSSProperties,
  netAmountRow: { display: "flex", alignItems: "baseline", gap: 10 } as CSSProperties,
  netAmount: {
    fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(44px, 6vw, 68px)", lineHeight: 0.95, letterSpacing: "-.04em",
  } as CSSProperties,
  netAmountUnit: { fontSize: 15, fontWeight: 600, color: colors.textMuted } as CSSProperties,
  netAnnualLabel: { fontSize: 14, color: colors.textMuted } as CSSProperties,
  editButton: {
    border: `1px solid ${border.interactive}`, background: colors.paper, color: colors.ink, fontSize: 13.5, fontWeight: 600,
    padding: "10px 16px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
  } as CSSProperties,
};

export const breakdownBarStyles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 10 } as CSSProperties,
  track: { display: "flex", height: 14, borderRadius: 999, overflow: "hidden", background: colors.surfaceAlt } as CSSProperties,
  segment: (width: string, color: string): CSSProperties => ({ width, background: color, transition: `width .8s ${easing.spring}` }),
  legendRow: { display: "flex", flexWrap: "wrap", gap: "6px 18px", fontSize: 12.5, color: colors.textMuted } as CSSProperties,
  legendItem: { display: "inline-flex", alignItems: "center", gap: 7 } as CSSProperties,
  legendSwatch: (color: string): CSSProperties => ({ width: 9, height: 9, borderRadius: 3, background: color }),
};

export const statTilesStyles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 } as CSSProperties,
  tile: {
    background: colors.surface, border: `1px solid ${border.light}`, borderRadius: 18, padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 6,
  } as CSSProperties,
  tileLabel: { fontSize: 12, fontWeight: 600, color: colors.textMuted } as CSSProperties,
  tileValue: { fontFamily: fontDisplay, fontWeight: 600, fontSize: 22, letterSpacing: "-.02em" } as CSSProperties,
  tileHint: { fontSize: 11.5, color: colors.textFaint, lineHeight: 1.4 } as CSSProperties,
};

export const deductionsListStyles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 12 } as CSSProperties,
  eyebrow: {
    fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: colors.textFaint,
  } as CSSProperties,
  rowsWrap: { display: "flex", flexDirection: "column" } as CSSProperties,
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "11px 0",
    borderBottom: `1px solid ${border.subtle}`, fontSize: 14,
  } as CSSProperties,
  rowLabel: { color: colors.textMuted } as CSSProperties,
  rowValue: { fontFamily: fontDisplay, fontWeight: 600 } as CSSProperties,
};
