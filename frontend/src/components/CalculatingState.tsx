import { calculatingStyles } from "@/styles/calculating.styles";

import { JetMascot } from "./JetMascot";

export function CalculatingState() {
  return (
    <div style={calculatingStyles.panel}>
      <div style={calculatingStyles.mascotWrap}>
        <JetMascot size={120} />
      </div>
      <p style={calculatingStyles.label}>Sto facendo i conti…</p>
      <div style={calculatingStyles.progressTrack}>
        <div style={calculatingStyles.progressSweep} />
      </div>
    </div>
  );
}
