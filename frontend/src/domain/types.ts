/**
 * Tipi di dominio del frontend. Nessuna regola di business qui — quelle vivono solo
 * nel backend (vedi ../../BUSINESS_RULES.md). Sono le "forme" dei dati che il resto
 * dell'app usa, indipendenti dal formato JSON esposto dall'API.
 */

export type Stage = "intro" | "form" | "calc" | "result";

export type MonthlyInstallments = 12 | 13 | 14;

export type Sector = "privato" | "pubblico";

export interface FormState {
  ral: number;
  mensilita: MonthlyInstallments;
  settore: Sector;
  regione: string;
  citta: string;
  ccnl: string;
  figli: number;
  coniuge: boolean;
}

export interface SalaryBreakdown {
  fiscalYear: number;
  grossAnnual: number;
  monthlyInstallments: number;
  sector: Sector;
  inpsEmployeeContribution: number;
  taxableIncome: number;
  irpefGross: number;
  employmentIncomeDeduction: number;
  additionalDeduction: number;
  spouseDeduction: number;
  childrenDeduction: number;
  irpefNet: number;
  region: string | null;
  city: string | null;
  regionalAdditionalTax: number;
  municipalAdditionalTax: number;
  integrativeTreatment: number;
  lowIncomeExemption: number;
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;
  employerCost: number;
}

export interface ReferenceData {
  fiscalYears: number[];
  defaultFiscalYear: number;
  regions: string[];
  cities: string[];
  /** Città raggruppate per la loro regione reale — usato per filtrare il <select>
   * città in base alla regione scelta (vedi BUSINESS_RULES.md, sezione 3.1). */
  citiesByRegion: Record<string, string[]>;
  monthlyInstallmentsOptions: number[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}
