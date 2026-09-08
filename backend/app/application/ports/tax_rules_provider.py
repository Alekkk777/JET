"""Porta (interfaccia) per l'accesso alle regole fiscali per anno."""

from __future__ import annotations

from typing import Protocol

from app.domain.tax_rules import TaxRules


class TaxRulesProvider(Protocol):
    def get_rules(self, fiscal_year: int) -> TaxRules:
        """Restituisce le regole fiscali per l'anno richiesto.

        Solleva ValueError se l'anno non è supportato.
        """
        ...

    def latest_fiscal_year(self) -> int:
        """Anno fiscale più recente disponibile, usato come default."""
        ...

    def available_fiscal_years(self) -> tuple[int, ...]:
        """Tutti gli anni fiscali supportati, in ordine crescente."""
        ...
