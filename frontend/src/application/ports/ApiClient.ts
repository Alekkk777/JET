/**
 * Porta (interfaccia) verso il backend. Gli hook dell'application layer dipendono
 * solo da questa interfaccia, mai da `fetch` direttamente — l'implementazione
 * concreta vive in `infrastructure/api` e può essere sostituita (es. nei test) senza
 * toccare la logica applicativa.
 */

import type { ChatMessage, FormState, ReferenceData, SalaryBreakdown } from "@/domain/types";

export class ApiError extends Error {}

export interface ExplainResult {
  explanation: string;
  breakdown: SalaryBreakdown;
}

export interface ApiClient {
  getReferenceData(): Promise<ReferenceData>;
  calculate(form: FormState): Promise<SalaryBreakdown>;
  explain(form: FormState, conversation: ChatMessage[]): Promise<ExplainResult>;
}
