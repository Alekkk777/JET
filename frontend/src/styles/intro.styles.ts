/** Stili del pannello di benvenuto (IntroPanel): mascotte, fumetto con effetto
 * macchina da scrivere, bottone di avvio. */

import type { CSSProperties } from "react";

import { colors, easing, fontDisplay } from "./tokens";

export const introStyles = {
  panel: {
    padding: "clamp(28px, 5vw, 64px)", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 26, textAlign: "center",
  } as CSSProperties,
  mascotEntrance: { position: "relative", animation: `jetFlyIn .9s ${easing.spring} both` } as CSSProperties,
  mascotFloat: { animation: "jetFloat 4.5s ease-in-out infinite" } as CSSProperties,
  speechBubbleWrap: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    animation: `popIn .6s ${easing.spring} .5s both`,
  } as CSSProperties,
  speechBubble: { position: "relative", background: colors.paper, borderRadius: 20, padding: "20px 26px", maxWidth: "46ch" } as CSSProperties,
  speechText: {
    margin: 0, fontFamily: fontDisplay, fontSize: "clamp(19px, 2.6vw, 27px)", lineHeight: 1.3,
    letterSpacing: "-.02em", minHeight: "1.3em",
  } as CSSProperties,
  caret: {
    display: "inline-block", width: 2, height: "1em", background: colors.ink, verticalAlign: "-.14em",
    marginLeft: 2, animation: "fadeIn .5s steps(1) infinite alternate",
  } as CSSProperties,
  startButton: {
    border: "none", background: colors.ink, color: colors.paper, fontSize: 16, fontWeight: 600, padding: "16px 30px",
    borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10,
    animation: `popIn .6s ${easing.spring} 1.1s both`, transition: "transform .2s ease, background .2s ease",
  } as CSSProperties,
  startButtonArrow: { fontSize: 18, lineHeight: 1 } as CSSProperties,
  helperText: { margin: 0, fontSize: 12.5, color: colors.textFaint, animation: "fadeIn .8s ease 1.4s both" } as CSSProperties,
};
