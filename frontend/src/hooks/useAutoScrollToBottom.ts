import { useEffect, useRef } from "react";

/** Tiene un elemento scrollabile ancorato in fondo ogni volta che una delle
 * `dependencies` cambia (es. nuovo messaggio in chat). Puro comportamento UI. */
export function useAutoScrollToBottom<T extends HTMLElement>(dependencies: unknown[]) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}
