/** Traduce i DTO (wire format) nei tipi di dominio. Unico posto che chiama `Number()`
 * sui Decimal-come-stringa restituiti dal backend. */

import type { ReferenceData, SalaryBreakdown } from "@/domain/types";
import type { ReferenceDataDto, SalaryBreakdownDto } from "./dto";

export function toSalaryBreakdown(dto: SalaryBreakdownDto): SalaryBreakdown {
  return {
    fiscalYear: dto.fiscal_year,
    grossAnnual: Number(dto.gross_annual),
    monthlyInstallments: dto.monthly_installments,
    sector: dto.sector,
    inpsEmployeeContribution: Number(dto.inps_employee_contribution),
    taxableIncome: Number(dto.taxable_income),
    irpefGross: Number(dto.irpef_gross),
    employmentIncomeDeduction: Number(dto.employment_income_deduction),
    additionalDeduction: Number(dto.additional_deduction),
    spouseDeduction: Number(dto.spouse_deduction),
    childrenDeduction: Number(dto.children_deduction),
    irpefNet: Number(dto.irpef_net),
    region: dto.region,
    city: dto.city,
    regionalAdditionalTax: Number(dto.regional_additional_tax),
    municipalAdditionalTax: Number(dto.municipal_additional_tax),
    integrativeTreatment: Number(dto.integrative_treatment),
    lowIncomeExemption: Number(dto.low_income_exemption),
    netAnnual: Number(dto.net_annual),
    netMonthly: Number(dto.net_monthly),
    effectiveTaxRate: Number(dto.effective_tax_rate),
    employerCost: Number(dto.employer_cost),
  };
}

export function toReferenceData(dto: ReferenceDataDto): ReferenceData {
  return {
    fiscalYears: dto.fiscal_years,
    defaultFiscalYear: dto.default_fiscal_year,
    regions: dto.regions,
    cities: dto.cities,
    citiesByRegion: dto.cities_by_region,
    monthlyInstallmentsOptions: dto.monthly_installments_options,
  };
}
