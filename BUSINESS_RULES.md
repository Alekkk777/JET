# Business Rules — Calcolatore RAL → Netto

Questo documento è la fonte di verità delle regole di business implementate nel backend.
Ogni volta che una regola cambia (nuovo anno fiscale, nuova semplificazione, nuova eccezione),
questo file va aggiornato **prima o insieme** al codice.



---

## 1. Scopo del sistema

Dato in input una **RAL** (Retribuzione Annua Lorda, in euro) più alcuni dati opzionali
(anno fiscale, mensilità, settore pubblico/privato, regione, città, coniuge e figli a
carico), il sistema calcola:

- i contributi previdenziali (INPS) trattenuti al lavoratore (aliquota diversa per
  settore pubblico/privato),
- l'imponibile fiscale IRPEF,
- l'IRPEF lorda e netta (dopo le detrazioni: lavoro dipendente, coniuge, figli),
- le addizionali regionale e comunale (specifiche per regione/città se indicate),
- l'eventuale trattamento integrativo ("bonus busta paga"),
- lo **stipendio netto annuale** e **per mensilità** (12, 13 o 14),
- una **stima del costo azienda**.

Un secondo servizio (chatbot) prende il risultato del calcolo e lo **spiega in linguaggio
naturale**, voce per voce, rispondendo anche a domande libere dell'utente su quel calcolo.

Non fanno parte dello scopo: gestione dipendenti, anagrafiche, ferie, contratti nel senso
HR (assunzione/cessazione), storicità, autenticazione. Questo backend è un singolo dominio:
*calcolo e spiegazione della RAL di un singolo individuo, in un dato momento*.

---

## 2. Concetti di dominio

| Concetto | Significato |
|---|---|
| **RAL (gross_annual)** | Retribuzione annua lorda concordata. Input dell'utente. |
| **Mensilità** | Numero di rate su cui è spalmata la RAL nell'anno: 12, 13 (con tredicesima) o 14 (anche quattordicesima). Cambia solo la ripartizione del netto, non il totale annuale. |
| **Settore** | Privato o pubblico. Cambia l'aliquota INPS a carico del lavoratore (9,19% privato, 8,80% pubblico). |
| **Imponibile previdenziale** | Coincide con la RAL (nessun tetto contributivo applicato, vedi semplificazioni). |
| **Imponibile IRPEF (taxable_income)** | RAL meno i contributi INPS a carico del lavoratore. È la base su cui si calcolano IRPEF, detrazioni, addizionali e trattamento integrativo. |
| **IRPEF lorda** | Imposta calcolata applicando gli scaglioni progressivi all'imponibile IRPEF. |
| **Detrazione da lavoro dipendente** | Importo che riduce l'IRPEF lorda, decrescente al crescere del reddito, azzerato oltre i 50.000€. |
| **Detrazione coniuge a carico** | Importo aggiuntivo se il coniuge ha un reddito proprio sotto 2.840,51€/anno. |
| **Detrazione figli a carico** | Importo aggiuntivo per figlio, **solo per figli over 21** (per gli under 21 vale l'Assegno Unico Universale, un beneficio INPS separato, fuori scope qui). |
| **Ulteriore detrazione (cuneo fiscale 2026)** | Detrazione aggiuntiva dall'IRPEF lorda per imponibile tra 20.000€ e 40.000€: 1.000€ fisso fino a 32.000€, poi decrescente linearmente fino a 0 a 40.000€. Cumulabile con le altre detrazioni. |
| **IRPEF netta** | `max(0, IRPEF lorda − somma delle detrazioni, incluse coniuge/figli/ulteriore detrazione)`, forzata a 0 se l'imponibile è sotto la soglia di no-tax-area. |
| **Addizionale regionale/comunale** | Imposte locali calcolate sull'imponibile IRPEF, con aliquota specifica se regione/città sono indicate, altrimenti una media nazionale. |
| **Trattamento integrativo** | Bonus erogato in busta paga per i redditi medio-bassi, se le condizioni di legge sono rispettate (basato sulla sola detrazione da lavoro dipendente, non sul totale delle detrazioni). |
| **Somma esente (bonus cuneo fiscale)** | Importo che non concorre al reddito imponibile, per imponibile fino a 20.000€: percentuale decrescente del reddito (7,1% / 5,3% / 4,8%). Misura distinta dal trattamento integrativo, cumulabile con esso. |
| **Netto annuale / per mensilità** | RAL meno tutte le trattenute, più l'eventuale trattamento integrativo, diviso per il numero di mensilità scelto. Non è una simulazione di cedolino mese per mese. |
| **Costo azienda** | Stima di quanto costa il dipendente al datore di lavoro: RAL + contributi datoriali stimati + accantonamento TFR. |
| **CCNL** | Accettato dal chatbot come informazione di contesto, **non incide su alcun calcolo** (semplificazione). |

---

## 3. Regole di business per anno fiscale

Le regole sono **versionate per anno fiscale** perché cambiano con le leggi di bilancio.
Il sistema supporta più anni contemporaneamente; se non specificato si usa l'ultimo disponibile.

### 3.1 Anno fiscale 2025

**IRPEF nazionale**
- Scaglioni (sull'imponibile IRPEF): 0–28.000€ 23%, 28.000–50.000€ 35%, oltre 50.000€ 43%.
- No tax area lavoro dipendente: 8.500€. Sotto questa soglia di imponibile, l'IRPEF netta è
  forzata a 0 (capienza piena delle detrazioni).

**INPS** — aliquota lavoratore flat sulla RAL, diversa per settore:
- Settore privato: **9,19%**
- Settore pubblico: **8,80%**

**Detrazione lavoro dipendente** (art. 13 TUIR, formula standard):
- imponibile ≤ 15.000€: detrazione fissa **1.955€**
- 15.000€ < imponibile ≤ 28.000€: `1.910 + 1.190 × (28.000 − imponibile) / 13.000`
- 28.000€ < imponibile ≤ 50.000€: `1.910 × (50.000 − imponibile) / 22.000`
- oltre 50.000€: detrazione **0**

**Detrazione coniuge a carico** (art. 12, comma 1, lett. a, TUIR — richiede reddito del
coniuge ≤ 2.840,51€/anno):
- imponibile ≤ 15.000€: `800 − 110 × imponibile / 15.000` (continua esattamente con la
  fascia successiva: a 15.000€ vale 690€, come la fascia intermedia)
- 15.000€ < imponibile ≤ 40.000€: fissa **690€**
- 40.000€ < imponibile ≤ 80.000€: `690 × (80.000 − imponibile) / 40.000`
- oltre 80.000€: **0**

**Detrazione figli a carico** (solo over 21, vedi sezione 2):
- soglia = `95.000 + max(0, n_figli − 1) × 15.000`
- quoziente = `max(0, (soglia − imponibile) / soglia)`
- detrazione = `950 × n_figli × quoziente`

**Ulteriore detrazione — cuneo fiscale strutturale** (art. 1, comma 6, L. 207/2024 —
Legge di Bilancio 2025 —, confermata strutturale dalla L. 199/2025 — Legge di Bilancio
2026 —; detrazione vera e propria dall'IRPEF lorda, si somma alle altre detrazioni):
- imponibile ≤ 20.000€: **0** (in questa fascia si applica invece la somma esente, vedi sotto)
- 20.000€ < imponibile ≤ 32.000€: fissa **1.000€/anno**
- 32.000€ < imponibile ≤ 40.000€: `1.000 × (40.000 − imponibile) / 8.000`
- oltre 40.000€: **0**

**Trattamento integrativo** (basato sulla sola detrazione lavoro dipendente, non sul totale
— misura distinta dall'ulteriore detrazione sopra, cumulabile con essa):
- imponibile < 8.500€: **non spetta**
- 8.500€ ≤ imponibile ≤ 15.000€: spetta **1.200€/anno**
- 15.000€ < imponibile ≤ 28.000€: spetta **1.200€/anno** solo se
  `detrazione lavoro dipendente > IRPEF lorda`
- oltre 28.000€: **non spetta**

**Somma esente — bonus cuneo fiscale per redditi bassi** (stesso art. 1, L. 207/2024;
importo che **non concorre alla formazione del reddito imponibile** — non è una
detrazione dall'imposta, è modellato come un accredito diretto sul netto, esattamente
come il trattamento integrativo — cumulabile con esso, misura distinta):
- imponibile ≤ 8.500€: `imponibile × 7,1%`
- 8.500€ < imponibile ≤ 15.000€: `imponibile × 5,3%`
- 15.000€ < imponibile ≤ 20.000€: `imponibile × 4,8%`
- oltre 20.000€: **0** (in questa fascia si applica invece l'ulteriore detrazione sopra)

**Addizionale regionale** — aliquota unica indicativa per tutte le 20 regioni italiane,
fallback "media nazionale" 1,73% solo per casi fuori elenco (es. lavoratori all'estero):

| Regione | Aliquota |
|---|---|
| Lombardia | 1,58% |
| Lazio | 3,33% |
| Piemonte | 3,25% |
| Veneto | 1,23% |
| Emilia-Romagna | 2,03% |
| Toscana | 1,42% |
| Campania | 3,33% |
| Puglia | 2,33% |
| Sicilia | 1,76% |
| Liguria | 2,23% |
| Marche | 1,73% |
| Trentino-Alto Adige | 1,23% |
| Abruzzo | 1,73% |
| Basilicata | 1,23% |
| Calabria | 2,25% |
| Friuli-Venezia Giulia | 1,23% |
| Molise | 2,03% |
| Sardegna | 1,23% |
| Umbria | 1,73% |
| Valle d'Aosta | 0,70% |
| *(fallback fuori elenco)* | 1,73% |

**Addizionale comunale** — aliquota unica indicativa per un elenco chiuso di 9 città
(elenco più piccolo delle regioni: non un database geografico completo), fallback
"media nazionale" 0,50% se città assente/non riconosciuta. Ogni città è associata alla
sua **regione reale** (il frontend filtra il `<select>` città in base alla regione scelta,
niente coppie regione/città impossibili):

| Città | Regione | Aliquota comunale |
|---|---|---|
| Milano | Lombardia | 0,80% |
| Roma | Lazio | 0,90% |
| Torino | Piemonte | 0,80% |
| Bologna | Emilia-Romagna | 0,80% |
| Firenze | Toscana | 0,20% |
| Napoli | Campania | 0,80% |
| Padova | Veneto | 0,50% |
| Bari | Puglia | 0,80% |
| Palermo | Sicilia | 0,80% |
| *(altro comune)* | — (valido per qualunque regione) | 0,50% (fallback) |

**Costo azienda** (stima):
`RAL × 1,30 + RAL / 13,5` — il 30% approssima i contributi datoriali (il dato preciso INPS
FPLD è 23,81%, il resto sono altri contributi minori — INAIL, formazione, ecc. — variabili
per settore/dimensione azienda); `RAL / 13,5` è l'approssimazione standard italiana
dell'accantonamento annuo del TFR.

### 3.2 Anno fiscale 2026

Identico al 2025, con un'unica modifica confermata dalla Legge di Bilancio 2026:

- **Scaglioni IRPEF**: 28.000–50.000€ passa dal 35% al **33%**.

Tutti gli altri parametri (INPS, detrazioni, trattamento integrativo, addizionali) sono
mantenuti invariati per assunzione, in assenza di conferma ufficiale di modifiche: **questa
è un'ipotesi di continuità da verificare quando saranno disponibili i valori definitivi
per il 2026.**

---

## 4. Semplificazioni adottate (e perché)

Ogni riga qui sotto è una scelta esplicita di scope, non una svista.

1. **Nessun database.** Tutte le regole (fiscali, regioni/città) sono configurazione
   versionata nel codice (`infrastructure/tax_rules/`), non dati da interrogare. Cambiano
   al più una volta l'anno.
2. **Nessuna persistenza dello storico calcoli e nessun account utente.** Il calcolatore è
   stateless: richiesta in, risposta out. La conversazione con il chatbot è multi-turno ma
   tenuta lato client (vedi sezione 5), non lato server.
3. **Regione e città come aliquota unica (elenco chiuso)**, invece della vera struttura a
   scaglioni interni che molte regioni applicano davvero. Copriamo tutte le 20 regioni ma
   solo le 9 città elencate in sezione 3.1 (più un fallback "altra regione/comune" a media
   nazionale): non un database geografico completo di tutti i comuni italiani.
4. **Nessun tetto contributivo INPS (massimale contributivo)** per i redditi molto alti: si
   applica l'aliquota piena su tutta la RAL, anche oltre le soglie previste per specifiche
   categorie di lavoratori (post-1996, fondi pensionistici diversi). Caso raro, escluso per
   semplicità.
5. **Detrazione figli a carico solo per figli over 21.** Per gli under 21 la legge ha
   sostituito la detrazione fiscale con l'Assegno Unico Universale, un beneficio erogato da
   INPS (non un credito d'imposta): è un sistema diverso, fuori scope per questo calcolatore.
6. **Nessuna "ulteriore detrazione" per fasce di reddito intermedie** né altri bonus una
   tantum introdotti da singole leggi di bilancio (es. bonus mamme, welfare aziendale,
   fringe benefit, buoni pasto): consideriamo solo RAL da lavoro dipendente puro + i carichi
   di famiglia esplicitamente modellati (coniuge, figli over 21).
7. **Nessuna simulazione di cedolino mensile reale**: il numero di mensilità (12/13/14)
   cambia solo la divisione del netto annuale, non applichiamo tassazione separata alla
   tredicesima né calcoliamo un TFR esatto (solo la stima nel costo azienda, non nel netto
   percepito, essendo accantonato e non parte dello stipendio corrente).
8. **Discontinuità nella formula di detrazione lavoro dipendente attorno ai 15.000€**: è un
   comportamento noto della formula storica (art. 13 TUIR), non un bug del nostro calcolo.
   Va segnalato nella UI come limite del modello, non "corretto" artificialmente.
9. **Un solo rapporto di lavoro, full time, anno intero**: nessun ragguaglio per part-time,
   mesi lavorati parziali, cambi di contratto in corso d'anno.
10. **Trattamento integrativo semplificato a importo fisso** (1.200€/anno se la condizione è
    soddisfatta), invece di un calcolo proporzionale più fine: coerente con la norma per la
    fascia 8.500–15.000€; per la fascia 15.000–28.000€ la norma reale è comunque un
    "tutto o niente" legato al confronto detrazione/imposta lorda, quindi la semplificazione
    è minima qui.
11. **Costo azienda con aliquota contributiva datoriale flat al 30%**, invece della miscela
    reale di contributi (INPS FPLD 23,81% + INAIL variabile per rischio + altri fondi minori,
    che porta il totale realistico a circa 28–32% a seconda di settore e dimensione
    aziendale). 30% è un valore rappresentativo comunemente usato, non un dato ufficiale
    puntuale.
12. **CCNL puramente informativo**: accettato solo come contesto per il chatbot, non incide
    su nessun calcolo (in realtà ogni CCNL ha le proprie regole di inquadramento/welfare, ma
    modellarle tutte sarebbe fuori scope).
13. **Il chatbot spiega solo il calcolo prodotto dal motore di calcolo**: non è un consulente
    fiscale generico, non dà consigli di ottimizzazione fiscale personalizzati oltre a quanto
    implicito nei dati del breakdown, e non fa confronti con il mercato retributivo (non è
    una funzionalità di questo prodotto).

---

## 5. Regole del chatbot esplicativo

- Riceve in input lo stesso output del calcolatore (`SalaryBreakdown`), opzionalmente il
  CCNL (solo come contesto informativo) e la cronologia della conversazione già avuta su
  quel calcolo.
- **Conversazione multi-turno, ma stateless lato server**: nessuna sessione, nessun DB.
  Il client (frontend) tiene lo storico dei messaggi e lo rinvia per intero ad ogni nuova
  domanda; il backend non conserva nulla tra una richiesta e l'altra.
- Se la cronologia è vuota, produce una spiegazione generale voce per voce del calcolo.
- Risponde sempre nel contesto di quel preciso calcolo (non ha accesso ad altri calcoli o
  a dati esterni).
- Non inventa importi: usa solo i numeri già calcolati dal motore di dominio, mai valori
  ricalcolati o stimati dal modello linguistico.
- Il system prompt include sempre un riassunto delle semplificazioni adottate (sezione 4),
  così il chatbot dichiara i propri limiti invece di sembrare più preciso di quanto sia.
- Provider LLM intercambiabile dietro una porta (`ExplanationPort`); l'adapter di default usa
  l'API Anthropic (Claude), ma il dominio e l'application layer non ne sanno nulla.

---

## 6. Contratto delle API (sintesi)

- `POST /api/v1/salary/calculate` — body `{ gross_annual, fiscal_year?, monthly_installments?,
  sector?, region?, city?, has_dependent_spouse?, dependent_children_count? }` → `SalaryBreakdown`
- `POST /api/v1/salary/explain` — stessi campi di `/calculate` più `ccnl?` e `messages?`
  (cronologia conversazione) → `{ explanation, breakdown }` (esegue internamente anche il calcolo)
- `GET /api/v1/salary/reference-data` — elenco di regioni, città e anni fiscali supportati,
  per popolare form/select lato frontend senza duplicare le liste
- `GET /health` — healthcheck

Dettagli di schema nei modelli Pydantic in `app/infrastructure/api/schemas.py`.

---

## 7. Come evolvere questo documento

- Nuovo anno fiscale → nuova sezione in "3." + nuovo file in `infrastructure/tax_rules/`.
- Nuova regione/città supportata → aggiungere alla tabella corrispondente in "3.1"
  e ai dati in `infrastructure/tax_rules/fiscal_year_*.py`.
- Nuova semplificazione rimossa (es. aggiungiamo il massimale contributivo INPS) → sposta la
  riga da "Semplificazioni adottate" a una nuova sezione di regola, con motivazione del cambio.
- Qualsiasi numero (aliquota, soglia, importo) copiato qui **deve avere una fonte verificata**
  al momento della scrittura; se cambia in futuro, va aggiornato sia qui che nel codice.
