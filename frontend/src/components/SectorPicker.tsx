import type { Sector } from "@/domain/types";
import { fieldLabelText, segmentedPickerStyles } from "@/styles/form.styles";

const SECTOR_OPTIONS: { value: Sector; label: string }[] = [
  { value: "privato", label: "Privato" },
  { value: "pubblico", label: "Pubblico" },
];

interface SectorPickerProps {
  value: Sector;
  onChange: (value: Sector) => void;
}

export function SectorPicker({ value, onChange }: SectorPickerProps) {
  return (
    <label style={segmentedPickerStyles.wrapper}>
      <span style={fieldLabelText}>Settore</span>
      <div style={segmentedPickerStyles.track(SECTOR_OPTIONS.length)}>
        {SECTOR_OPTIONS.map((option) => (
          <button key={option.value} onClick={() => onChange(option.value)} style={segmentedPickerStyles.option(option.value === value)}>
            {option.label}
          </button>
        ))}
      </div>
    </label>
  );
}
