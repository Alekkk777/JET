import { footerStyles } from "@/styles/layout.styles";

import { JetMascot } from "./JetMascot";

export function Footer() {
  return (
    <footer style={footerStyles.bar}>
      <div style={footerStyles.brandRow}>
        <div style={footerStyles.mascotWrap}>
          <JetMascot size={26} />
        </div>
        <span style={footerStyles.wordmark}>JET</span>
      </div>
      <span>Stime elaborate su scaglioni IRPEF, addizionali locali e detrazioni per familiari a carico.</span>
    </footer>
  );
}
