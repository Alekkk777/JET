# RAL Calculator — Backend

Backend a struttura esagonale (ports & adapters) per il calcolo RAL → netto e per il
chatbot che lo spiega. Le regole di business e le semplificazioni adottate sono
documentate in [`../BUSINESS_RULES.md`](../BUSINESS_RULES.md) — leggerlo prima di
modificare qualsiasi regola di calcolo.

## Struttura

```
app/
  domain/            # entità, value object, regole fiscali, servizio di calcolo puro
  application/        # ports (interfacce) e use case, orchestrano il dominio
  infrastructure/
    tax_rules/        # adapter: regole fiscali concrete per anno (nessun DB)
    llm/              # adapter: spiegazione via Anthropic Claude
    api/              # adapter: FastAPI (routers, schemas, composition root)
```

La regola di dipendenza è a senso unico: `domain` non conosce nessuno,
`application` conosce solo `domain`, `infrastructure` conosce `application` e `domain`.

## Setup

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env   # valorizzare ANTHROPIC_API_KEY solo se serve /explain
```

## Avvio in locale

```bash
uvicorn app.infrastructure.api.main:app --reload
```

Documentazione interattiva su `http://localhost:8000/docs`.

## Test

```bash
pytest       # 40 test: dominio, application, infrastructure
ruff check .
mypy app
```

## Endpoint principali

- `POST /api/v1/salary/calculate` — `{ "gross_annual": 45000, "fiscal_year": 2026,
  "monthly_installments": 14, "sector": "privato", "region": "Lombardia",
  "city": "Milano", "has_dependent_spouse": true, "dependent_children_count": 1 }`
  (tutti i campi tranne `gross_annual` sono opzionali, con default sensati)
- `POST /api/v1/salary/explain` — stessi campi di `/calculate` più `ccnl` (puramente
  informativo) e `messages: [{"role": "user", "content": "perché pago così tanto di
  INPS?"}]`. Nessuna sessione lato server: il client tiene la cronologia (`messages`)
  e la rinvia per intero ad ogni domanda successiva sullo stesso calcolo. `messages`
  vuoto → spiegazione generale voce per voce.
- `GET /api/v1/salary/reference-data` — regioni, città (raggruppate per regione) e
  anni fiscali supportati, per popolare i campi select del frontend senza duplicare
  le liste.
- `GET /health`

## Note

- Nessun database: le regole fiscali sono configurazione versionata nel codice
  (vedi `app/infrastructure/tax_rules/`).
- `/explain` richiede `ANTHROPIC_API_KEY` valorizzata; senza, l'endpoint risponde con
  un errore del provider Anthropic ma il resto dell'API funziona normalmente.

## Deploy

Deployato su Vercel come Vercel Function Python (root directory `backend/`,
entrypoint dichiarato in `pyproject.toml` sotto `[tool.vercel]`). `vercel.json`
esclude test e file di sviluppo dal bundle di produzione.
