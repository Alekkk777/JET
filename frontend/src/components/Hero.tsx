import { heroStyles } from "@/styles/layout.styles";

export function Hero() {
  return (
    <section style={heroStyles.section}>
      <h1 style={heroStyles.title}>Dalla RAL al netto in tasca.</h1>
      <p style={heroStyles.subtitle}>
        JET calcola quanto ti resta davvero ogni mese, ti spiega dove finisce il resto e risponde alle tue domande sulla busta paga.
      </p>
    </section>
  );
}
