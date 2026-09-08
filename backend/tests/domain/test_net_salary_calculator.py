from decimal import Decimal

import pytest

from app.domain.services.net_salary_calculator import NetSalaryCalculator
from app.infrastructure.tax_rules.fiscal_year_2025 import RULES_2025

calculator = NetSalaryCalculator()


def test_rejects_non_positive_gross_annual() -> None:
    with pytest.raises(ValueError):
        calculator.calculate(Decimal("0"), RULES_2025)


def test_inps_is_flat_rate_on_gross_annual() -> None:
    breakdown = calculator.calculate(Decimal("30000"), RULES_2025)
    expected_inps = Decimal("30000") * RULES_2025.employee_contribution.rate_for("privato")
    assert breakdown.inps_employee_contribution.amount == expected_inps.quantize(Decimal("0.01"))


def test_public_sector_uses_lower_inps_rate_than_private() -> None:
    private = calculator.calculate(Decimal("30000"), RULES_2025, sector="privato")
    public = calculator.calculate(Decimal("30000"), RULES_2025, sector="pubblico")
    assert public.inps_employee_contribution.amount < private.inps_employee_contribution.amount


def test_net_is_always_less_than_gross() -> None:
    for gross in (Decimal("8000"), Decimal("20000"), Decimal("35000"), Decimal("70000")):
        breakdown = calculator.calculate(gross, RULES_2025)
        assert breakdown.net_annual.amount < breakdown.gross_annual.amount


def test_net_monthly_is_net_annual_divided_by_twelve() -> None:
    breakdown = calculator.calculate(Decimal("40000"), RULES_2025)
    expected = (breakdown.net_annual.amount / Decimal("12")).quantize(Decimal("0.01"))
    assert breakdown.net_monthly.amount == expected


def test_higher_gross_never_yields_lower_net() -> None:
    lower = calculator.calculate(Decimal("25000"), RULES_2025)
    higher = calculator.calculate(Decimal("26000"), RULES_2025)
    assert higher.net_annual.amount >= lower.net_annual.amount


def test_employment_deduction_and_integrative_treatment_are_zero_above_50k() -> None:
    breakdown = calculator.calculate(Decimal("80000"), RULES_2025)
    assert breakdown.employment_income_deduction.amount == Decimal("0.00")
    assert breakdown.integrative_treatment.amount == Decimal("0.00")


def test_below_no_tax_area_threshold_has_no_irpef_or_local_additional_taxes() -> None:
    # RAL 9000 -> imponibile IRPEF = 9000 - 9000*0.0919 = 8172.9 < soglia 8500
    breakdown = calculator.calculate(Decimal("9000"), RULES_2025)
    assert breakdown.taxable_income.amount < RULES_2025.no_tax_area_threshold
    assert breakdown.irpef_net.amount == Decimal("0.00")
    assert breakdown.regional_additional_tax.amount == Decimal("0.00")
    assert breakdown.municipal_additional_tax.amount == Decimal("0.00")
    # sotto la soglia minima anche il trattamento integrativo non spetta
    assert breakdown.integrative_treatment.amount == Decimal("0.00")


def test_integrative_treatment_applies_for_low_income_band() -> None:
    # RAL 12000 -> imponibile = 12000 - 12000*0.0919 = 10897.2, tra 8500 e 15000
    breakdown = calculator.calculate(Decimal("12000"), RULES_2025)
    assert breakdown.integrative_treatment.amount == Decimal("1200.00")


def test_2026_uses_33_percent_second_bracket() -> None:
    from app.infrastructure.tax_rules.fiscal_year_2026 import RULES_2026

    breakdown_2025 = calculator.calculate(Decimal("40000"), RULES_2025)
    breakdown_2026 = calculator.calculate(Decimal("40000"), RULES_2026)
    assert breakdown_2026.irpef_gross.amount < breakdown_2025.irpef_gross.amount
