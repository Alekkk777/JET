# JET — Calcolatore RAL

Applicazione web che, data una RAL (retribuzione annua lorda), calcola lo stipendio
netto reale — contributi INPS, IRPEF, detrazioni, addizionali regionali/comunali,
bonus cuneo fiscale, costo azienda — e mette a disposizione un chatbot ("JET") che
spiega il calcolo e risponde a domande di follow-up, restando ancorato ai numeri già
calcolati (nessuna cifra viene inventata o ricalcolata dal modello).

**Live demo:** [jet-frontend-nine.vercel.app](https://jet-frontend-nine.vercel.app)

Questo file è la mappa del progetto: spiega come stanno insieme le parti. I dettagli
di ciascuna sono nei rispettivi README.

## Struttura del progetto

```
Jet-AI/
├── BUSINESS_RULES.md   ← fonte di verità delle regole fiscali: ogni numero ha una
│                          fonte citata, ogni semplificazione un perché esplicito
├── backend/            ← API Python/FastAPI, architettura esagonale, nessun database
│   └── README.md
└── frontend/            ← Vite + React + TypeScript
    └── README.md
```

Nessun database, nessuna coda, nessun servizio esterno oltre all'API Anthropic (per
il chatbot). Backend e frontend sono deployati come due progetti Vercel separati a
partire dallo stesso repository.

## Come si parlano backend e frontend

Il frontend non calcola **mai** una tassa da solo: chiama sempre il backend via HTTP.
L'unico punto di configurazione è `VITE_API_BASE` (env var del frontend).

```
Browser (frontend/src/App.tsx)
   │
   │  HttpApiClient (frontend/src/infrastructure/api/HttpApiClient.ts)
   ▼
FastAPI (backend/app/infrastructure/api/main.py)
   │
   │  routers → use case → servizio di dominio
   ▼
Calcolo puro Python (backend/app/domain/services/net_salary_calculator.py)
   + regole fiscali versionate (backend/app/infrastructure/tax_rules/fiscal_year_*.py)
```

## Flusso end-to-end

1. Al mount, il frontend chiama `GET /api/v1/salary/reference-data` per popolare i
   `<select>` (regioni, città filtrate per regione, anni fiscali) — `useReferenceData`.
2. L'utente compila il form (RAL, mensilità, settore pubblico/privato, regione, città,
   CCNL, figli, coniuge a carico) — `CalculatorForm.tsx`, stato in `useCalculatorFlow`.
3. Click "Calcola il mio netto" → `POST /api/v1/salary/calculate`.
4. Il backend esegue il calcolo: `CalculateNetSalaryUseCase` prende le regole
   dell'anno fiscale da `StaticTaxRulesProvider` e le applica in
   `NetSalaryCalculator.calculate()` (puro Python, `Decimal`, zero dipendenze esterne).
5. Il frontend mostra il risultato (`ResultDashboard`) e chiede subito una prima
   spiegazione a `POST /api/v1/salary/explain` (cronologia vuota).
6. Il backend ricalcola il breakdown, lo inietta come testo nel *system prompt* di
   Claude insieme a un riassunto delle semplificazioni adottate, e restituisce la
   spiegazione. Nessun ricalcolo fatto dal modello: solo i numeri già calcolati da noi.
7. Ogni domanda successiva in chat (`ChatPanel` → `useChat`) rimanda l'intera
   cronologia dei messaggi a `/explain` — stateless lato server, la conversazione vive
   nel browser (vedi `BUSINESS_RULES.md`, sezione 5).

## Le due architetture esagonali (stesso principio, due linguaggi)

Sia backend che frontend seguono la stessa regola di dipendenza: **il dominio non
conosce nessuno**, i layer esterni dipendono verso l'interno, mai il contrario.

| | Backend (`backend/app/`) | Frontend (`frontend/src/`) |
|---|---|---|
| Regole/tipi puri | `domain/` — calcolo, value object (`Money`), regole fiscali | `domain/` — tipi TS + formattazione pura |
| Orchestrazione | `application/use_cases/` + `application/ports/` | `application/` — hook (`useCalculatorFlow`, `useChat`) + porta `ApiClient` |
| Adapter concreti | `infrastructure/api/` (FastAPI), `infrastructure/llm/` (Claude), `infrastructure/tax_rules/` (config) | `infrastructure/api/` — `HttpApiClient`, unica cosa che chiama `fetch` |
| Presentazione | — (JSON puro) | `components/` (React) + `styles/` (CSS-in-JS separato dalla logica) |

## Avvio in locale

```bash
# terminale 1 — backend
cd backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env             # valorizzare ANTHROPIC_API_KEY per testare la chat
uvicorn app.infrastructure.api.main:app --reload

# terminale 2 — frontend
cd frontend
npm install
cp .env.example .env             # VITE_API_BASE, default http://localhost:8000
npm run dev
```

Apri `http://localhost:5500`. Senza `ANTHROPIC_API_KEY`, calcolo e dati di
riferimento funzionano comunque: solo la chat risponde con un errore pulito.

## Dove guardare per...

| Voglio... | Vado in... |
|---|---|
| Cambiare/aggiungere una regola fiscale (aliquota, detrazione, regione) | `backend/app/infrastructure/tax_rules/fiscal_year_*.py` **+** aggiornare `BUSINESS_RULES.md` |
| Aggiungere un endpoint | `backend/app/application/use_cases/` (logica) + `backend/app/infrastructure/api/routers/` (HTTP) |
| Cambiare il prompt/comportamento del chatbot | `backend/app/infrastructure/llm/anthropic_explanation_adapter.py` |
| Cambiare che modello Claude si usa | `backend/app/config.py` (`anthropic_model`) |
| Cambiare l'aspetto di una sezione del sito | `frontend/src/styles/*.styles.ts` (non toccare i `.tsx` per un cambio estetico) |
| Cambiare la palette colori/font globale | `frontend/src/styles/tokens.ts` |
| Cambiare la logica/struttura di una sezione | `frontend/src/components/*.tsx` |
| Cambiare come il frontend chiama il backend | `frontend/src/infrastructure/api/HttpApiClient.ts` |
| Capire "perché questo numero è calcolato così" | `BUSINESS_RULES.md` — ogni regola ha una fonte, ogni scorciatoia una motivazione |

## Copertura funzionale

Tutte le 20 regioni italiane (aliquote reali verificate), 9 città specifiche più
fallback nazionale, settore pubblico/privato (aliquota INPS dedicata), coniuge/figli
a carico, bonus cuneo fiscale (ulteriore detrazione + somma esente, L. 207/2024),
costo azienda stimato. 40 test automatici sul backend, `tsc`/`eslint` puliti sul
frontend.

## Deploy

Backend e frontend sono due progetti Vercel indipendenti collegati allo stesso
repository Git (build automatica ad ogni push su `main`):

- Backend → Vercel Function Python (root directory `backend/`)
- Frontend → sito statico Vite (root directory `frontend/`)

La chiave `ANTHROPIC_API_KEY` è configurata come variabile d'ambiente cifrata su
Vercel, mai presente nel repository.
