import { headerStyles } from "@/styles/layout.styles";

import { LogoMark } from "./LogoMark";

function scrollToCalculatorStage() {
  const stageEl = document.getElementById("jet-stage");
  if (stageEl) window.scrollTo({ top: stageEl.offsetTop - 80, behavior: "smooth" });
}

export function Header() {
  return (
    <header style={headerStyles.bar}>
      <div style={headerStyles.brandRow}>
        <div style={headerStyles.logoBadge}>
          <LogoMark />
        </div>
        <span style={headerStyles.wordmark}>JET</span>
        <span style={headerStyles.tagline}>Calcolatore RAL</span>
      </div>
      <nav style={headerStyles.nav}>
        <a href="#come-funziona" style={headerStyles.navLink}>Come funziona</a>
        <a href="#faq" style={headerStyles.navLink}>Domande frequenti</a>
        <button onClick={scrollToCalculatorStage} className="btn-dark" style={headerStyles.ctaButton}>
          Calcola il netto
        </button>
      </nav>
    </header>
  );
}
