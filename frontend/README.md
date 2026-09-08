# JET — Frontend

Vite + React + TypeScript, organizzato in componenti e layer separati secondo lo
stesso principio esagonale del backend — vedi [`../BUSINESS_RULES.md`](../BUSINESS_RULES.md)
per le regole di business (che vivono solo nel backend, mai duplicate qui).

## Struttura

```
src/
  domain/            # tipi TypeScript + funzioni pure di formattazione (no fetch, no business logic)
  application/        # hook che orchestrano il flusso di business (form → calcolo → chat)
    ports/             # interfaccia ApiClient — il resto dell'app non sa che dietro c'è fetch
  infrastructure/
    api/               # HttpApiClient: unica implementazione concreta della porta, DTO e mapper
  hooks/              # hook generici di sola UI (macchina da scrivere, auto-scroll) — nessuna logica di business
  components/         # componenti React, un file per responsabilità, importano lo stile da styles/
  styles/
    tokens.ts          # palette colori, font, easing — l'unico posto da cambiare per aggiornare l'estetica
    *.styles.ts         # stili raggruppati per sezione (form, result, chat, ...), separati dalla logica dei componenti
    global.css          # reset CSS, @keyframes, stati :hover
```

La regola di dipendenza è a senso unico: `domain` non conosce nessuno, `application`
dipende solo da `domain` e dalla propria porta, `infrastructure` implementa quella
porta, `hooks`/`components`/`App.tsx` compongono tutto (composition root in `App.tsx`).

**Modificare la logica** → si tocca il componente in `components/` o l'hook in
`application/`/`hooks/`. **Modificare l'estetica** → si tocca il file corrispondente in
`styles/` (o `styles/tokens.ts` per un cambio di palette globale): i componenti
importano gli stili per nome, non li ridefiniscono mai inline.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE, di default punta al backend locale
```

## Sviluppo

```bash
npm run dev
```

Apri `http://localhost:5500` (il backend deve girare in parallelo, vedi
`../backend/README.md`).

## Build di produzione

```bash
npm run build      # tsc --noEmit + vite build -> dist/
npm run preview    # serve dist/ in locale
```

## Qualità

```bash
npm run typecheck
npm run lint
```
