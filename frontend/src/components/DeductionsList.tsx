import { eur } from "@/domain/format";
import type { FormState, SalaryBreakdown } from "@/domain/types";
import { deductionsListStyles } from "@/styles/result.styles";

export function DeductionsList({ breakdown, form }: { breakdown: SalaryBreakdown; form: FormState }) {
  // "Totale abbattimento IRPEF" somma solo le detrazioni vere e proprie (quelle
  // sottratte dall'IRPEF lorda). Trattamento integrativo e bonus cuneo fiscale non ci
  // rientrano: sono accrediti diretti sul netto, non riduzioni dell'IRPEF (vedi
  // BUSINESS_RULES.md, sezione 2).
  const totalIrpefDeduction =
    breakdown.employmentIncomeDeduction + breakdown.spouseDeduction + breakdown.childrenDeduction + breakdown.additionalDeduction;

  const rows = [
    { label: "Lavoro dipendente", value: eur(breakdown.employmentIncomeDeduction) },
    { label: "Ulteriore detrazione (20.000-40.000€)", value: breakdown.additionalDeduction ? eur(breakdown.additionalDeduction) : "—" },
    { label: "Coniuge a carico", value: form.coniuge ? eur(breakdown.spouseDeduction) : "—" },
    { label: `Figli a carico (${form.figli})`, value: form.figli ? eur(breakdown.childrenDeduction) : "—" },
    { label: "Totale abbattimento IRPEF", value: eur(totalIrpefDeduction) },
    { label: "Trattamento integrativo", value: breakdown.integrativeTreatment ? eur(breakdown.integrativeTreatment) : "—" },
    { label: "Bonus cuneo fiscale (fino a 20.000€)", value: breakdown.lowIncomeExemption ? eur(breakdown.lowIncomeExemption) : "—" },
  ];

  return (
    <div style={deductionsListStyles.wrapper}>
      <span style={deductionsListStyles.eyebrow}>Detrazioni applicate</span>
      <div style={deductionsListStyles.rowsWrap}>
        {rows.map((row) => (
          <div key={row.label} style={deductionsListStyles.row}>
            <span style={deductionsListStyles.rowLabel}>{row.label}</span>
            <span style={deductionsListStyles.rowValue}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
