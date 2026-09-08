/**
 * Forma esatta del JSON esposto dal backend (Pydantic serializza i Decimal come
 * stringa). Questo modulo è l'unico punto che la conosce — il resto dell'app lavora
 * sui tipi di dominio in `domain/types.ts`, mai su questi DTO.
 */

import type { Sector } from "@/domain/types";

export interface SalaryBreakdownDto {
  fiscal_year: number;
  gross_annual: string;
  monthly_installments: number;
  sector: Sector;
  inps_employee_contribution: string;
  taxable_income: string;
  irpef_gross: string;
  employment_income_deduction: string;
  additional_deduction: string;
  spouse_deduction: string;
  children_deduction: string;
  irpef_net: string;
  region: string | null;
  city: string | null;
  regional_additional_tax: string;
  municipal_additional_tax: string;
  integrative_treatment: string;
  low_income_exemption: string;
  net_annual: string;
  net_monthly: string;
  effective_tax_rate: string;
  employer_cost: string;
}

export interface ReferenceDataDto {
  fiscal_years: number[];
  default_fiscal_year: number;
  regions: string[];
  cities: string[];
  cities_by_region: Record<string, string[]>;
  monthly_installments_options: number[];
}

export interface ExplainResponseDto {
  explanation: string;
  breakdown: SalaryBreakdownDto;
}

export interface ErrorResponseDto {
  detail?: string | Array<{ msg?: string }>;
}
