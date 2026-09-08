import { eur } from "@/domain/format";
import type { FormState, SalaryBreakdown } from "@/domain/types";
import { resultDashboardStyles } from "@/styles/result.styles";

import { BreakdownBar } from "./BreakdownBar";
import { DeductionsList } from "./DeductionsList";
import { StatTiles } from "./StatTiles";

interface ResultDashboardProps {
  breakdown: SalaryBreakdown;
  form: FormState;
  onEdit: () => void;
}

export function ResultDashboard({ breakdown, form, onEdit }: ResultDashboardProps) {
  return (
    <div style={resultDashboardStyles.column}>
      <div style={resultDashboardStyles.headerRow}>
        <div style={resultDashboardStyles.netColumn}>
          <span style={resultDashboardStyles.eyebrow}>Netto in busta</span>
          <div style={resultDashboardStyles.netAmountRow}>
            <span style={resultDashboardStyles.netAmount}>{eur(breakdown.netMonthly)}</span>
            <span style={resultDashboardStyles.netAmountUnit}>/ mese su {breakdown.monthlyInstallments} mensilità</span>
          </div>
          <span style={resultDashboardStyles.netAnnualLabel}>
            {eur(breakdown.netAnnual)} netti all'anno su {eur(breakdown.grossAnnual)} di RAL
          </span>
        </div>
        <button onClick={onEdit} style={resultDashboardStyles.editButton}>
          Modifica dati
        </button>
      </div>

      <BreakdownBar breakdown={breakdown} />
      <StatTiles breakdown={breakdown} />
      <DeductionsList breakdown={breakdown} form={form} />
    </div>
  );
}
