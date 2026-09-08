"""Porta (interfaccia) per la generazione della spiegazione in linguaggio naturale.

Intercambiabile: l'adapter di default usa Claude, ma il dominio e l'application layer
non conoscono il provider concreto (vedi BUSINESS_RULES.md, sezione 5).

La conversazione è tenuta lato client (nessuna sessione/DB lato server, vedi
BUSINESS_RULES.md semplificazione 2): ogni richiesta porta con sé l'intero storico dei
messaggi precedenti relativi a quel calcolo.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Protocol

from app.domain.models import SalaryBreakdown

ChatRole = Literal["user", "assistant"]


@dataclass(frozen=True, slots=True)
class ConversationTurn:
    role: ChatRole
    content: str


class ExplanationUnavailableError(Exception):
    """Il servizio di spiegazione non è disponibile (es. provider LLM non configurato
    o irraggiungibile). Un adapter concreto la solleva al posto dell'errore nativo del
    provider, così l'application layer resta indipendente dal provider usato."""


class ExplanationPort(Protocol):
    def explain(
        self,
        breakdown: SalaryBreakdown,
        conversation: tuple[ConversationTurn, ...],
        *,
        ccnl: str | None = None,
    ) -> str:
        """Genera la prossima risposta dell'assistente per una conversazione ancorata a
        un calcolo specifico.

        `conversation` è lo storico dei messaggi (utente/assistente) già scambiati su
        questo calcolo, in ordine cronologico; l'ultimo elemento è tipicamente la nuova
        domanda dell'utente. Se `conversation` è vuota, produce una spiegazione generale
        voce per voce del breakdown. `ccnl` è contesto opzionale, puramente informativo
        (non incide su alcun calcolo).
        """
        ...
