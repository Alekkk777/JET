"""Use case: calcolo dello stipendio netto a partire dalla RAL."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal

from app.application.ports.tax_rules_provider import TaxRulesProvider
from app.domain.models import SalaryBreakdown
from app.domain.services.net_salary_calculator import NetSalaryCalculator
from app.domain.tax_rules import Sector


@dataclass(frozen=True, slots=True)
class CalculateNetSalaryCommand:
    gross_annual: Decimal
    fiscal_year: int | None = None
    monthly_installments: int = 12
    sector: Sector = "privato"
    region: str | None = None
    city: str | None = None
    has_dependent_spouse: bool = False
    dependent_children_count: int = 0


class CalculateNetSalaryUseCase:
    def __init__(
        self,
        tax_rules_provider: TaxRulesProvider,
        calculator: NetSalaryCalculator | None = None,
    ) -> None:
        self._tax_rules_provider = tax_rules_provider
        self._calculator = calculator or NetSalaryCalculator()

    def execute(self, command: CalculateNetSalaryCommand) -> SalaryBreakdown:
        fiscal_year = command.fiscal_year or self._tax_rules_provider.latest_fiscal_year()
        rules = self._tax_rules_provider.get_rules(fiscal_year)
        return self._calculator.calculate(
            command.gross_annual,
            rules,
            monthly_installments=command.monthly_installments,
            sector=command.sector,
            region=command.region,
            city=command.city,
            has_dependent_spouse=command.has_dependent_spouse,
            dependent_children_count=command.dependent_children_count,
        )
