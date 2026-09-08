import { useTypewriter } from "@/hooks/useTypewriter";
import { introStyles } from "@/styles/intro.styles";

import { JetMascot } from "./JetMascot";

const WELCOME_MESSAGE = "Ciao, sono JET. Ti dico quanto vale davvero la tua RAL: netto, tasse e costo azienda.";

interface IntroPanelProps {
  onStart: () => void;
}

export function IntroPanel({ onStart }: IntroPanelProps) {
  const typedMessage = useTypewriter(WELCOME_MESSAGE);

  return (
    <div style={introStyles.panel}>
      <div style={introStyles.mascotEntrance}>
        <div style={introStyles.mascotFloat}>
          <JetMascot size={132} />
        </div>
      </div>

      <div style={introStyles.speechBubbleWrap}>
        <div style={introStyles.speechBubble}>
          <p style={introStyles.speechText}>
            {typedMessage}
            <span style={introStyles.caret} />
          </p>
        </div>
      </div>

      <button onClick={onStart} className="btn-dark-lift" style={introStyles.startButton}>
        Iniziamo, chiedimi i dati
        <span style={introStyles.startButtonArrow}>→</span>
      </button>

      <p style={introStyles.helperText}>8 domande · circa 40 secondi · nessun dato salvato</p>
    </div>
  );
}
