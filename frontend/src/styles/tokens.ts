/**
 * Design tokens: l'unica fonte di verità per palette, font e curve di animazione.
 * Cambiare l'estetica dell'app (colori, font) parte da qui, non dai singoli
 * componenti. I valori numerici "una tantum" (raggi, spaziature, font-size di un
 * singolo elemento) restano invece nei file `*.styles.ts` di ogni sezione — sono
 * decisioni di layout puntuali, non parte della palette condivisa.
 */

export const colors = {
  ink: "#000000",
  inkSoft: "#111111",
  paper: "#FFFFFF",
  textMuted: "#525252",
  textFaint: "#6B6B6B",
  surface: "#FAFAFA",
  surfaceAlt: "#F4F4F4",
  danger: "#B00020",
  dangerSurface: "#FDECEC",
  toggleTrackOff: "#D4D4D4",
  // Colori dei segmenti del grafico a barre "composizione della RAL".
  chartInps: "#666666",
  chartIrpef: "#9E9E9E",
  chartAddizionali: "#DEDEDE",
} as const;

/** Bordi neri a opacità crescente — il design ne usa diversi a seconda di quanto
 * l'elemento debba "pesare" visivamente. */
export const border = {
  subtle: "rgba(0,0,0,.07)",
  light: "rgba(0,0,0,.08)",
  default: "rgba(0,0,0,.09)",
  medium: "rgba(0,0,0,.12)",
  strong: "rgba(0,0,0,.14)",
  interactive: "rgba(0,0,0,.16)",
} as const;

/** Varianti di bianco trasparente usate sugli sfondi neri (form aside, footer). */
export const onDark = {
  text: "rgba(255,255,255,.72)",
  textStrong: "rgba(255,255,255,.78)",
  textSoft: "rgba(255,255,255,.7)",
  track: "rgba(255,255,255,.14)",
  trackFill: "rgba(255,255,255,.16)",
  trackFillStrong: "rgba(255,255,255,.2)",
} as const;

export const shadow = {
  card: "0 1px 2px rgba(0,0,0,.04), 0 24px 60px -30px rgba(0,0,0,.22)",
  knob: "0 1px 3px rgba(0,0,0,.3)",
  tileActive: "0 1px 3px rgba(0,0,0,.14)",
} as const;

/** Font "titolo": numeri, heading, elementi enfatizzati. Il corpo del testo eredita
 * il Geist impostato globalmente su <body> (vedi styles/global.css). */
export const fontDisplay = "'Geist', 'Helvetica Neue', Helvetica, sans-serif";

export const easing = {
  spring: "cubic-bezier(.16,1,.3,1)",
} as const;
