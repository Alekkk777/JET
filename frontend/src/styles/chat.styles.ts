/** Stili del pannello chat: header, storico messaggi, bolle, suggerimenti, input. */

import type { CSSProperties } from "react";

import { border, colors, easing, fontDisplay } from "./tokens";

export const chatPanelStyles = {
  column: { display: "flex", flexDirection: "column", background: colors.surface, minHeight: 460 } as CSSProperties,
  header: { display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", borderBottom: `1px solid ${border.light}` } as CSSProperties,
  headerMascotWrap: { width: 42, flex: "none", animation: "jetFloat 5s ease-in-out infinite" } as CSSProperties,
  headerTextColumn: { display: "flex", flexDirection: "column", gap: 1 } as CSSProperties,
  headerTitle: { fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 } as CSSProperties,
  headerStatus: { fontSize: 12.5, color: colors.ink, fontWeight: 600 } as CSSProperties,

  messageList: {
    flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, maxHeight: 460,
  } as CSSProperties,

  suggestionsRow: { padding: "0 22px 10px", display: "flex", flexWrap: "wrap", gap: 8 } as CSSProperties,
  suggestionChip: {
    border: `1px solid ${border.interactive}`, background: colors.paper, color: colors.inkSoft, fontSize: 13, fontWeight: 500,
    padding: "9px 14px", borderRadius: 999, cursor: "pointer",
  } as CSSProperties,

  composer: { display: "flex", alignItems: "center", gap: 10, padding: "14px 22px 20px" } as CSSProperties,
  composerInput: {
    flex: 1, minWidth: 0, border: `1px solid ${border.interactive}`, background: colors.paper, borderRadius: 999,
    padding: "14px 18px", fontSize: 14.5, color: colors.ink,
  } as CSSProperties,
  sendButton: {
    flex: "none", width: 46, height: 46, borderRadius: "50%", border: "none", background: colors.ink, color: colors.paper,
    cursor: "pointer", fontSize: 17, lineHeight: 1,
  } as CSSProperties,
};

export const chatBubbleStyles = {
  user: {
    alignSelf: "flex-end", maxWidth: "84%", background: colors.ink, color: colors.paper, padding: "12px 16px",
    borderRadius: "18px 18px 6px 18px", fontSize: 14.5, lineHeight: 1.5, animation: `popIn .35s ${easing.spring} both`,
    whiteSpace: "pre-line",
  } as CSSProperties,
  assistant: {
    alignSelf: "flex-start", maxWidth: "88%", background: colors.paper, border: `1px solid ${border.default}`, padding: "13px 16px",
    borderRadius: "18px 18px 18px 6px", fontSize: 14.5, lineHeight: 1.55, color: colors.inkSoft,
    animation: `popIn .35s ${easing.spring} both`,
  } as CSSProperties,
  // Il testo dell'assistente è formattato a blocchi (paragrafi/elenchi) invece che con
  // whiteSpace:pre-line — vedi components/FormattedMessageText.tsx.
  textBlocks: { display: "flex", flexDirection: "column", gap: 8 } as CSSProperties,
  paragraph: { margin: 0 } as CSSProperties,
  list: { margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 } as CSSProperties,
};

export const typingIndicatorStyles = {
  wrap: {
    alignSelf: "flex-start", display: "flex", gap: 5, background: colors.paper, border: `1px solid ${border.default}`,
    padding: "15px 16px", borderRadius: "18px 18px 18px 6px",
  } as CSSProperties,
  dot: (delaySeconds: number): CSSProperties => ({
    width: 6, height: 6, borderRadius: "50%", background: colors.ink, animation: `dotPulse 1.2s ease-in-out ${delaySeconds}s infinite`,
  }),
};
