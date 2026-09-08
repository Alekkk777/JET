from decimal import Decimal

import pytest

from app.domain.services.net_salary_calculator import NetSalaryCalculator
from app.infrastructure.tax_rules.fiscal_year_2025 import RULES_2025

calculator = NetSalaryCalculator()


def test_spouse_deduction_reduces_irpef_net() -> None:
    without_spouse = calculator.calculate(Decimal("40000"), RULES_2025)
    with_spouse = calculator.calculate(Decimal("40000"), RULES_2025, has_dependent_spouse=True)
    assert with_spouse.spouse_deduction.amount > Decimal("0")
    assert with_spouse.net_annual.amount > without_spouse.net_annual.amount


def test_spouse_deduction_is_zero_above_80k() -> None:
    breakdown = calculator.calculate(Decimal("95000"), RULES_2025, has_dependent_spouse=True)
    assert breakdown.spouse_deduction.amount == Decimal("0.00")


def test_children_deduction_scales_with_children_count() -> None:
    one_child = calculator.calculate(Decimal("40000"), RULES_2025, dependent_children_count=1)
    two_children = calculator.calculate(Decimal("40000"), RULES_2025, dependent_children_count=2)
    assert two_children.children_deduction.amount > one_child.children_deduction.amount > Decimal("0")


def test_rejects_negative_children_count() -> None:
    with pytest.raises(ValueError):
        calculator.calculate(Decimal("40000"), RULES_2025, dependent_children_count=-1)


def test_rejects_unsupported_monthly_installments() -> None:
    with pytest.raises(ValueError):
        calculator.calculate(Decimal("40000"), RULES_2025, monthly_installments=10)


def test_monthly_installments_changes_split_not_annual_total() -> None:
    b12 = calculator.calculate(Decimal("36000"), RULES_2025, monthly_installments=12)
    b14 = calculator.calculate(Decimal("36000"), RULES_2025, monthly_installments=14)
    assert b12.net_annual.amount == b14.net_annual.amount
    assert b14.net_monthly.amount < b12.net_monthly.amount


def test_known_region_uses_its_specific_rate_not_the_default() -> None:
    lombardia = calculator.calculate(Decimal("40000"), RULES_2025, region="Lombardia")
    lazio = calculator.calculate(Decimal("40000"), RULES_2025, region="Lazio")
    assert lombardia.regional_additional_tax.amount != lazio.regional_additional_tax.amount


def test_unknown_region_falls_back_to_default_rate() -> None:
    known_default = calculator.calculate(Decimal("40000"), RULES_2025, region=None)
    unknown = calculator.calculate(Decimal("40000"), RULES_2025, region="Regione Inesistente")
    assert known_default.regional_additional_tax.amount == unknown.regional_additional_tax.amount


def test_employer_cost_is_higher_than_gross_annual() -> None:
    breakdown = calculator.calculate(Decimal("40000"), RULES_2025)
    assert breakdown.employer_cost.amount > breakdown.gross_annual.amount


def test_low_income_exemption_applies_below_20k_taxable_income() -> None:
    # RAL 10000 -> imponibile = 10000 - 10000*0.0919 = 9081, in fascia 8.500-15.000 (5,3%)
    breakdown = calculator.calculate(Decimal("10000"), RULES_2025)
    expected = (Decimal("10000") - Decimal("10000") * Decimal("0.0919")) * Decimal("0.053")
    assert breakdown.low_income_exemption.amount == expected.quantize(Decimal("0.01"))


def test_low_income_exemption_is_zero_above_20k_taxable_income() -> None:
    breakdown = calculator.calculate(Decimal("30000"), RULES_2025)
    assert breakdown.low_income_exemption.amount == Decimal("0.00")


def test_additional_deduction_is_flat_1000_between_20k_and_32k() -> None:
    breakdown = calculator.calculate(Decimal("25000"), RULES_2025)
    assert breakdown.additional_deduction.amount == Decimal("1000.00")


def test_additional_deduction_phases_out_to_zero_at_40k() -> None:
    below_20k = calculator.calculate(Decimal("15000"), RULES_2025)
    mid_range = calculator.calculate(Decimal("36000"), RULES_2025)
    assert below_20k.additional_deduction.amount == Decimal("0.00")
    assert Decimal("0") < mid_range.additional_deduction.amount < Decimal("1000")


def test_additional_deduction_and_low_income_exemption_are_cumulable_with_integrative_treatment() -> None:
    # RAL 13000 -> imponibile ~11.807, sotto i 15.000: trattamento integrativo (1.200)
    # e somma esente (bonus cuneo fiscale) spettano entrambi, sono misure distinte.
    breakdown = calculator.calculate(Decimal("13000"), RULES_2025)
    assert breakdown.integrative_treatment.amount == Decimal("1200.00")
    assert breakdown.low_income_exemption.amount > Decimal("0")
