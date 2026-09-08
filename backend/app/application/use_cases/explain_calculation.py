"""Use case: prossima risposta dell'assistente in una conversazione già in corso
sul calcolo di un breakdown."""

from __future__ import annotations

from dataclasses import dataclass

from app.application.ports.explanation_port import ConversationTurn, ExplanationPort
from app.domain.models import SalaryBreakdown


@dataclass(frozen=True, slots=True)
class ExplainCalculationCommand:
    breakdown: SalaryBreakdown
    conversation: tuple[ConversationTurn, ...] = ()
    ccnl: str | None = None


class ExplainCalculationUseCase:
    def __init__(self, explanation_port: ExplanationPort) -> None:
        self._explanation_port = explanation_port

    def execute(self, command: ExplainCalculationCommand) -> str:
        return self._explanation_port.explain(command.breakdown, command.conversation, ccnl=command.ccnl)
