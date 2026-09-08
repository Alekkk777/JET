import { howItWorksStyles } from "@/styles/marketing.styles";

const STEPS = [
  { number: "01", title: "JET si presenta", body: "Nessun login, nessuna email. Apri la pagina e JET è già lì a chiederti i dati." },
  { number: "02", title: "Otto campi, un numero", body: "RAL, mensilità, settore, zona, contratto e familiari a carico: il netto arriva subito, con il dettaglio delle trattenute." },
  { number: "03", title: "Poi ne parlate", body: "La chat conosce il tuo calcolo: puoi chiedere perché, quanto costi all'azienda e come alzare il netto." },
];

export function HowItWorks() {
  return (
    <section id="come-funziona" style={howItWorksStyles.section}>
      <div style={howItWorksStyles.container}>
        <h2 style={howItWorksStyles.title}>Tre passaggi, zero fogli di calcolo.</h2>
        <div style={howItWorksStyles.stepsGrid}>
          {STEPS.map((step) => (
            <div key={step.number} style={howItWorksStyles.stepCard}>
              <span style={howItWorksStyles.stepNumber}>{step.number}</span>
              <h3 style={howItWorksStyles.stepTitle}>{step.title}</h3>
              <p style={howItWorksStyles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
