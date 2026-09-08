import { fieldLabelText, selectFieldStyles } from "@/styles/form.styles";

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label style={selectFieldStyles.wrapper}>
      <span style={fieldLabelText}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={selectFieldStyles.select}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
