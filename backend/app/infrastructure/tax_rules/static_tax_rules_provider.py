"""Adapter di TaxRulesProvider: regole fiscali cablate nel codice, nessun DB.

Vedi BUSINESS_RULES.md, semplificazione 1: le regole fiscali sono configurazione
versionata per anno, non dati da interrogare.
"""

from __future__ import annotations

from app.domain.tax_rules import TaxRules
from app.infrastructure.tax_rules.fiscal_year_2025 import RULES_2025
from app.infrastructure.tax_rules.fiscal_year_2026 import RULES_2026

_RULES_BY_YEAR: dict[int, TaxRules] = {
    2025: RULES_2025,
    2026: RULES_2026,
}


class StaticTaxRulesProvider:
    def get_rules(self, fiscal_year: int) -> TaxRules:
        try:
            return _RULES_BY_YEAR[fiscal_year]
        except KeyError as exc:
            supported = ", ".join(str(year) for year in sorted(_RULES_BY_YEAR))
            raise ValueError(
                f"Anno fiscale {fiscal_year} non supportato. Anni disponibili: {supported}"
            ) from exc

    def latest_fiscal_year(self) -> int:
        return max(_RULES_BY_YEAR)

    def available_fiscal_years(self) -> tuple[int, ...]:
        return tuple(sorted(_RULES_BY_YEAR))
