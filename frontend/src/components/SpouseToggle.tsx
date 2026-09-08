import { spouseToggleStyles } from "@/styles/form.styles";

interface SpouseToggleProps {
  value: boolean;
  onToggle: () => void;
}

export function SpouseToggle({ value, onToggle }: SpouseToggleProps) {
  return (
    <button onClick={onToggle} style={spouseToggleStyles.button}>
      <span style={spouseToggleStyles.track(value)}>
        <span style={spouseToggleStyles.knob(value)} />
      </span>
      <span style={spouseToggleStyles.textColumn}>
        <span style={spouseToggleStyles.title}>Coniuge a carico</span>
        <span style={spouseToggleStyles.subtitle}>Reddito del coniuge sotto i 2.840 € annui</span>
      </span>
    </button>
  );
}
