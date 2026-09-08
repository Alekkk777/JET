import { useCallback, useState } from "react";

import type { ApiClient } from "@/application/ports/ApiClient";
import type { FormState, ReferenceData, SalaryBreakdown, Stage } from "@/domain/types";

const DEFAULT_FORM: FormState = {
  ral: 38000,
  mensilita: 14,
  settore: "privato",
  regione: "Lombardia",
  citta: "Milano",
  ccnl: "Commercio / Terziario",
  figli: 0,
  coniuge: false,
};

/** Durata minima dell'animazione "Sto facendo i conti…", indipendentemente da quanto
 * la rete sia veloce — coerenza visiva col design originale. */
const MIN_CALCULATING_MS = 900;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Orchestrazione del flusso principale: stage (intro → form → calc → result),
 * stato del form, ed esecuzione del calcolo. Nessuna regola di business qui: solo
 * composizione delle chiamate al backend tramite la porta `ApiClient`. */
export function useCalculatorFlow(api: ApiClient, reference: ReferenceData) {
  const [stage, setStage] = useState<Stage>("intro");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setRegione = useCallback(
    (regione: string) => {
      const citiesInRegion = reference.citiesByRegion[regione] ?? [];
      setForm((prev) => ({ ...prev, regione, citta: citiesInRegion[0] ?? "Altro comune" }));
    },
    [reference],
  );

  const goToForm = useCallback(() => setStage("form"), []);
  const backToIntro = useCallback(() => setStage("intro"), []);
  const backToForm = useCallback(() => setStage("form"), []);

  const calculate = useCallback(async (): Promise<SalaryBreakdown | null> => {
    if (!(form.ral > 0)) {
      setCalcError("Inserisci una RAL maggiore di zero.");
      return null;
    }
    setStage("calc");
    setCalcError(null);
    const startedAt = Date.now();
    try {
      const calcResult = await api.calculate(form);
      await sleep(Math.max(0, MIN_CALCULATING_MS - (Date.now() - startedAt)));
      setResult(calcResult);
      setStage("result");
      return calcResult;
    } catch (error) {
      setStage("form");
      setCalcError(error instanceof Error ? error.message : "Errore nel calcolo. Riprova.");
      return null;
    }
  }, [api, form]);

  return { stage, form, result, calcError, setField, setRegione, goToForm, backToIntro, backToForm, calculate };
}
