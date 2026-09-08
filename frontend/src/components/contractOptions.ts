/** Elenco CCNL mostrato nel form. Puramente informativo per il chatbot (vedi
 * BUSINESS_RULES.md): nessun endpoint backend lo valida, per questo è un elenco
 * statico locale invece di venire da `GET /reference-data` come regioni/città/livelli. */
export const CONTRACT_OPTIONS = [
  "Commercio / Terziario",
  "Metalmeccanico",
  "Studi professionali",
  "Credito e assicurazioni",
  "Altro CCNL",
];
