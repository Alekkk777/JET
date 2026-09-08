from decimal import Decimal

import pytest

from app.application.use_cases.calculate_net_salary import (
    CalculateNetSalaryCommand,
    CalculateNetSalaryUseCase,
)
from app.infrastructure.tax_rules.static_tax_rules_provider import StaticTaxRulesProvider

use_case = CalculateNetSalaryUseCase(tax_rules_provider=StaticTaxRulesProvider())


def test_defaults_to_latest_fiscal_year_when_not_specified() -> None:
    breakdown = use_case.execute(CalculateNetSalaryCommand(gross_annual=Decimal("30000")))
    assert breakdown.fiscal_year == StaticTaxRulesProvider().latest_fiscal_year()


def test_uses_requested_fiscal_year() -> None:
    breakdown = use_case.execute(CalculateNetSalaryCommand(gross_annual=Decimal("30000"), fiscal_year=2025))
    assert breakdown.fiscal_year == 2025


def test_unsupported_fiscal_year_raises() -> None:
    with pytest.raises(ValueError):
        use_case.execute(CalculateNetSalaryCommand(gross_annual=Decimal("30000"), fiscal_year=1999))
