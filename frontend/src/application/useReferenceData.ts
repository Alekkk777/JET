import { useEffect, useState } from "react";

import type { ApiClient } from "@/application/ports/ApiClient";
import type { ReferenceData } from "@/domain/types";

import { FALLBACK_REFERENCE_DATA } from "./fallbackReferenceData";

/** Carica regioni/città/livelli dal backend; finché non risponde (o se fallisce),
 * resta valida la lista di partenza — non è un errore bloccante per l'utente. */
export function useReferenceData(api: ApiClient): ReferenceData {
  const [reference, setReference] = useState<ReferenceData>(FALLBACK_REFERENCE_DATA);

  useEffect(() => {
    let cancelled = false;
    api
      .getReferenceData()
      .then((data) => {
        if (!cancelled) setReference(data);
      })
      .catch(() => {
        /* la lista di partenza resta valida */
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  return reference;
}
