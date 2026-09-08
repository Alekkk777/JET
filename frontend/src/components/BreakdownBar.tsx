import { eur, sharePercent } from "@/domain/format";
import type { SalaryBreakdown } from "@/domain/types";
import { breakdownBarStyles } from "@/styles/result.styles";
import { colors } from "@/styles/tokens";

interface LegendItem {
  color: string;
  label: string;
}

export function BreakdownBar({ breakdown }: { breakdown: SalaryBreakdown }) {
  const gross = breakdown.grossAnnual;
  const localTaxes = breakdown.regionalAdditionalTax + breakdown.municipalAdditionalTax;

  const segments = [
    { amount: breakdown.netAnnual, color: colors.ink },
    { amount: breakdown.inpsEmployeeContribution, color: colors.chartInps },
    { amount: breakdown.irpefNet, color: colors.chartIrpef },
    { amount: localTaxes, color: colors.chartAddizionali },
  ];

  const legend: LegendItem[] = [
    { color: colors.ink, label: `Netto ${eur(breakdown.netAnnual)}` },
    { color: colors.chartInps, label: `INPS ${eur(breakdown.inpsEmployeeContribution)}` },
    { color: colors.chartIrpef, label: `IRPEF ${eur(breakdown.irpefNet)}` },
    { color: colors.chartAddizionali, label: `Addizionali ${eur(localTaxes)}` },
  ];

  return (
    <div style={breakdownBarStyles.wrapper}>
      <div style={breakdownBarStyles.track}>
        {segments.map((segment) => (
          <div key={segment.color} style={breakdownBarStyles.segment(sharePercent(segment.amount, gross), segment.color)} />
        ))}
      </div>
      <div style={breakdownBarStyles.legendRow}>
        {legend.map((item) => (
          <span key={item.label} style={breakdownBarStyles.legendItem}>
            <span style={breakdownBarStyles.legendSwatch(item.color)} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
