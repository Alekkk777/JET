import { formProgress } from "@/domain/format";
import type { FormState, MonthlyInstallments, ReferenceData } from "@/domain/types";
import { fieldLabelText, formStyles } from "@/styles/form.styles";

import { ChildrenCounter } from "./ChildrenCounter";
import { JetMascot } from "./JetMascot";
import { MonthlyInstallmentsPicker } from "./MonthlyInstallmentsPicker";
import { SectorPicker } from "./SectorPicker";
import { SelectField } from "./SelectField";
import { SpouseToggle } from "./SpouseToggle";

interface CalculatorFormProps {
  form: FormState;
  reference: ReferenceData;
  contractOptions: string[];
  calcError: string | null;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onChangeRegione: (regione: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function CalculatorForm({ form, reference, contractOptions, calcError, onChange, onChangeRegione, onBack, onSubmit }: CalculatorFormProps) {
  const citiesForSelectedRegion = reference.citiesByRegion[form.regione] ?? ["Altro comune"];
  const completion = formProgress([form.ral > 0, !!form.regione, !!form.citta, !!form.ccnl, !!form.settore, true, true, true]);

  return (
    <div style={formStyles.grid}>
      <aside style={formStyles.aside}>
        <div style={formStyles.asideTopGroup}>
          <div style={formStyles.asideMascotFloat}>
            <JetMascot size={88} />
          </div>
          <p style={formStyles.asideHeadline}>Dimmi come sei inquadrato e ti dico cosa ti arriva sul conto.</p>
          <p style={formStyles.asideSubtext}>
            Uso gli scaglioni IRPEF, le addizionali della tua zona e le detrazioni per familiari a carico. È una stima, non un cedolino.
          </p>
        </div>
        <div style={formStyles.progressGroup}>
          <span style={formStyles.progressLabel}>Completamento</span>
          <div style={formStyles.progressTrack}>
            <div style={formStyles.progressFill(completion)} />
          </div>
        </div>
      </aside>

      <div style={formStyles.fieldsColumn}>
        <div style={formStyles.fieldsStack}>
          <label style={formStyles.ralLabel}>
            <span style={fieldLabelText}>Retribuzione annua lorda</span>
            <div style={formStyles.ralInputRow}>
              <span style={formStyles.ralCurrencySign}>€</span>
              <input
                type="number"
                min={0}
                step={500}
                value={form.ral}
                onChange={(event) => onChange("ral", Number(event.target.value))}
                style={formStyles.ralInput}
              />
            </div>
            <input
              type="range"
              min={15000}
              max={150000}
              step={1000}
              value={form.ral}
              onChange={(event) => onChange("ral", Number(event.target.value))}
              style={formStyles.ralSlider}
            />
          </label>

          <div style={formStyles.fieldsGrid}>
            <MonthlyInstallmentsPicker value={form.mensilita} onChange={(value: MonthlyInstallments) => onChange("mensilita", value)} />
            <SectorPicker value={form.settore} onChange={(value) => onChange("settore", value)} />
            <SelectField label="Regione" value={form.regione} options={reference.regions} onChange={onChangeRegione} />
            <SelectField label="Città di lavoro" value={form.citta} options={citiesForSelectedRegion} onChange={(value) => onChange("citta", value)} />
            <SelectField label="Contratto (CCNL)" value={form.ccnl} options={contractOptions} onChange={(value) => onChange("ccnl", value)} />
            <ChildrenCounter value={form.figli} onChange={(value) => onChange("figli", value)} />
          </div>

          <SpouseToggle value={form.coniuge} onToggle={() => onChange("coniuge", !form.coniuge)} />

          {calcError && <p style={formStyles.errorBanner}>{calcError}</p>}

          <div style={formStyles.actionsRow}>
            <button onClick={onBack} style={formStyles.backButton}>
              ← Indietro
            </button>
            <button onClick={onSubmit} className="btn-dark-lift" style={formStyles.submitButton}>
              Calcola il mio netto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
