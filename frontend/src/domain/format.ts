/**
 * Formattazione pura per la UI. Nessun calcolo fiscale qui: solo presentazione di
 * numeri già calcolati dal backend.
 */

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function eur(value: number): string {
  return currencyFormatter.format(Math.round(value || 0));
}

export function roundPercent(fraction: number): string {
  return Math.round((fraction || 0) * 100) + "%";
}

export function sharePercent(part: number, total: number): string {
  const safeTotal = total || 1;
  return (part / safeTotal) * 100 + "%";
}

/** Percentuale di completamento del form mostrata nella barra laterale — puramente
 * indicativa, non una regola di validazione. */
export function formProgress(fieldsFilled: boolean[]): string {
  const total = 8; // stesso denominatore del design originale
  const filled = fieldsFilled.filter(Boolean).length;
  return Math.round((filled / total) * 100) + "%";
}
