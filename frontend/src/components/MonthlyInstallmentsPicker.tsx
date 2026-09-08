import { fieldLabelText, segmentedPickerStyles } from "@/styles/form.styles";
import type { MonthlyInstallments } from "@/domain/types";

const INSTALLMENT_OPTIONS: MonthlyInstallments[] = [12, 13, 14];

interface MonthlyInstallmentsPickerProps {
  value: MonthlyInstallments;
  onChange: (value: MonthlyInstallments) => void;
}

export function MonthlyInstallmentsPicker({ value, onChange }: MonthlyInstallmentsPickerProps) {
  return (
    <label style={segmentedPickerStyles.wrapper}>
      <span style={fieldLabelText}>Mensilità</span>
      <div style={segmentedPickerStyles.track(INSTALLMENT_OPTIONS.length)}>
        {INSTALLMENT_OPTIONS.map((installments) => (
          <button key={installments} onClick={() => onChange(installments)} style={segmentedPickerStyles.option(installments === value)}>
            {installments}
          </button>
        ))}
      </div>
    </label>
  );
}
