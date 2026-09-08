import { childrenCounterStyles, fieldLabelText } from "@/styles/form.styles";

const MIN_CHILDREN = 0;
const MAX_CHILDREN = 8;

interface ChildrenCounterProps {
  value: number;
  onChange: (value: number) => void;
}

export function ChildrenCounter({ value, onChange }: ChildrenCounterProps) {
  return (
    <label style={childrenCounterStyles.wrapper}>
      <span style={fieldLabelText}>Figli a carico</span>
      <div style={childrenCounterStyles.row}>
        <button onClick={() => onChange(Math.max(MIN_CHILDREN, value - 1))} style={childrenCounterStyles.stepButton}>
          −
        </button>
        <span style={childrenCounterStyles.count}>{value}</span>
        <button onClick={() => onChange(Math.min(MAX_CHILDREN, value + 1))} style={childrenCounterStyles.stepButton}>
          +
        </button>
      </div>
    </label>
  );
}
