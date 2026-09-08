import { faqStyles } from "@/styles/marketing.styles";

const FAQ_ITEMS = [
  {
    question: "Da dove arriva il calcolo?",
    answer: "Scaglioni IRPEF vigenti, contributi INPS a carico del dipendente (9,19%), addizionale regionale e comunale della zona indicata, detrazioni per lavoro dipendente e familiari a carico.",
  },
  {
    question: "Perché il risultato differisce dal mio cedolino?",
    answer: "Il cedolino include voci contrattuali specifiche: superminimi, indennità, straordinari, premi, conguagli e trattenute sindacali. Qui vedi la struttura, non la singola voce.",
  },
  {
    question: "I miei dati vengono salvati?",
    answer: "No. Tutto resta nel browser: chiudendo la pagina il calcolo scompare.",
  },
  {
    question: "Perché cambia qualcosa tra pubblico e privato?",
    answer: "L'aliquota INPS a carico del lavoratore è diversa per legge: 9,19% nel settore privato, 8,80% in quello pubblico.",
  },
];

export function Faq() {
  return (
    <section id="faq" style={faqStyles.section}>
      <div style={faqStyles.grid}>
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} style={faqStyles.item}>
            <h3 style={faqStyles.question}>{item.question}</h3>
            <p style={faqStyles.answer}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
