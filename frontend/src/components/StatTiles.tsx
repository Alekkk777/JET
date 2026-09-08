import { eur, roundPercent } from "@/domain/format";
import type { SalaryBreakdown } from "@/domain/types";
import { statTilesStyles } from "@/styles/result.styles";

export function StatTiles({ breakdown }: { breakdown: SalaryBreakdown }) {
  const tiles = [
    { label: "Netto annuo", value: eur(breakdown.netAnnual), hint: "Al netto di contributi e imposte" },
    { label: "Costo azienda", value: eur(breakdown.employerCost), hint: "RAL + contributi datore + TFR" },
    { label: "Aliquota effettiva", value: roundPercent(breakdown.effectiveTaxRate), hint: "Quota di RAL che non arriva in busta" },
  ];

  return (
    <div style={statTilesStyles.grid}>
      {tiles.map((tile) => (
        <div key={tile.label} style={statTilesStyles.tile}>
          <span style={statTilesStyles.tileLabel}>{tile.label}</span>
          <span style={statTilesStyles.tileValue}>{tile.value}</span>
          <span style={statTilesStyles.tileHint}>{tile.hint}</span>
        </div>
      ))}
    </div>
  );
}
