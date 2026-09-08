"""Adapter di ExplanationPort basato sull'API Anthropic (Claude).

Vedi BUSINESS_RULES.md, sezione 5: il chatbot spiega solo i numeri già calcolati dal
dominio, non ne inventa o ricalcola di suoi. La cronologia della conversazione è
tenuta lato client e passata per intero ad ogni richiesta (nessuna sessione lato server).
"""

from __future__ import annotations

import anthropic
from anthropic import Anthropic
from anthropic.types import MessageParam

from app.application.ports.explanation_port import ConversationTurn, ExplanationUnavailableError
from app.domain.models import SalaryBreakdown

_BASE_INSTRUCTIONS = (
    "Sei un assistente che spiega in italiano semplice, senza gergo tecnico-fiscale "
    "eccessivo, come si passa da una RAL (retribuzione annua lorda) allo stipendio netto. "
    "Ricevi sempre il breakdown già calcolato di uno specifico caso: usa esclusivamente "
    "quei numeri, non ricalcolarli e non inventarne altri. Rispondi restando nel contesto "
    "di questo calcolo specifico.\n\n"
    "Formato della risposta: le tue risposte appaiono in una bolla di chat stretta (non "
    "un documento). Scrivi paragrafi brevi in prosa. Puoi usare **grassetto** per i "
    "numeri chiave e, se serve elencare più voci, un elenco puntato con \"- \" (una voce "
    "per riga). NON usare mai: titoli/heading (#, ##), tabelle con il carattere \"|\", "
    "linee separatrici (---), o emoji come intestazioni. Una tabella in una bolla di chat "
    "stretta è illeggibile: se devi mostrare più valori, elencali con un elenco puntato."
)

_SIMPLIFICATIONS_NOTE = (
    "Il calcolo è un prototipo semplificato, non un cedolino ufficiale. In particolare: "
    "regione/comune usano un'aliquota unica indicativa (non la vera struttura a scaglioni "
    "regionali), la detrazione per figli a carico vale solo per figli over 21 (gli under 21 "
    "hanno l'Assegno Unico Universale, un beneficio INPS separato, non trattato qui), e il "
    "costo azienda usa un'aliquota contributiva flat del 30% (il dato preciso INPS è "
    "23,81%, il resto sono altri contributi minori variabili per settore). Se una domanda "
    "dipende da un fattore escluso, dillo esplicitamente invece di inventare una risposta. "
    "Non parlare mai di confronti con il mercato retributivo o con altri stipendi: non è "
    "una funzionalità di questo prodotto."
)

_DEFAULT_FIRST_QUESTION = "Spiegami voce per voce perché il netto risulta questo importo."


class AnthropicExplanationAdapter:
    def __init__(self, api_key: str, model: str) -> None:
        self._api_key = api_key
        self._client = Anthropic(api_key=api_key or "missing-api-key")
        self._model = model

    def explain(
        self,
        breakdown: SalaryBreakdown,
        conversation: tuple[ConversationTurn, ...],
        *,
        ccnl: str | None = None,
    ) -> str:
        if not self._api_key:
            raise ExplanationUnavailableError(
                "Chatbot non configurato: manca ANTHROPIC_API_KEY. "
                "Il calcolo RAL -> netto resta comunque disponibile su /api/v1/salary/calculate."
            )

        messages = self._build_messages(conversation)
        try:
            response = self._client.messages.create(
                model=self._model,
                max_tokens=1024,
                system=self._build_system_prompt(breakdown, ccnl),
                messages=messages,
            )
        except anthropic.APIError as exc:
            raise ExplanationUnavailableError(
                "Il servizio di spiegazione non è al momento disponibile."
            ) from exc
        return "".join(block.text for block in response.content if block.type == "text")

    @staticmethod
    def _build_messages(conversation: tuple[ConversationTurn, ...]) -> list[MessageParam]:
        if not conversation:
            return [{"role": "user", "content": _DEFAULT_FIRST_QUESTION}]
        return [{"role": turn.role, "content": turn.content} for turn in conversation]

    @staticmethod
    def _build_system_prompt(breakdown: SalaryBreakdown, ccnl: str | None) -> str:
        facts = [
            f"Anno fiscale: {breakdown.fiscal_year}",
            f"RAL: {breakdown.gross_annual}",
            f"Mensilità: {breakdown.monthly_installments}",
            f"Settore: {breakdown.sector}",
            f"Regione: {breakdown.region or 'non specificata'}",
            f"Città: {breakdown.city or 'non specificata'}",
            f"Contributi INPS a carico del lavoratore: {breakdown.inps_employee_contribution}",
            f"Imponibile IRPEF: {breakdown.taxable_income}",
            f"IRPEF lorda: {breakdown.irpef_gross}",
            f"Detrazione lavoro dipendente: {breakdown.employment_income_deduction}",
            f"Ulteriore detrazione (cuneo fiscale 20.000-40.000€): {breakdown.additional_deduction}",
            f"Detrazione coniuge a carico: {breakdown.spouse_deduction}",
            f"Detrazione figli a carico: {breakdown.children_deduction}",
            f"IRPEF netta: {breakdown.irpef_net}",
            f"Addizionale regionale: {breakdown.regional_additional_tax}",
            f"Addizionale comunale: {breakdown.municipal_additional_tax}",
            f"Trattamento integrativo: {breakdown.integrative_treatment}",
            f"Somma esente (bonus cuneo fiscale, redditi fino a 20.000€): {breakdown.low_income_exemption}",
            f"Netto annuale: {breakdown.net_annual}",
            f"Netto per mensilità: {breakdown.net_monthly}",
            f"Costo azienda stimato: {breakdown.employer_cost}",
        ]
        if ccnl:
            facts.append(f"CCNL (informativo, non incide sul calcolo): {ccnl}")
        facts_block = "\n".join(facts)
        return f"{_BASE_INSTRUCTIONS}\n\nDati del calcolo:\n{facts_block}\n\n{_SIMPLIFICATIONS_NOTE}"
