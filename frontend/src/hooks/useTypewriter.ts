import { useEffect, useState } from "react";

/** Rivela `text` un carattere alla volta ogni `intervalMs` — effetto macchina da
 * scrivere del pannello di intro, stesso timing del design originale (26ms/carattere).
 * Puro effetto visivo: nessuna logica applicativa, per questo vive in `hooks/` e non
 * in `application/` insieme agli hook che orchestrano il flusso di calcolo. */
export function useTypewriter(text: string, intervalMs = 26): string {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const timer = setInterval(() => {
      setVisibleChars((current) => {
        if (current >= text.length) {
          clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [text, intervalMs]);

  return text.slice(0, visibleChars);
}
