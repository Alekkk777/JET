"""Regole fiscali 2026. Fonti e semplificazioni: BUSINESS_RULES.md, sezione 3.2.

Unica modifica nota rispetto al 2025: secondo scaglione IRPEF dal 35% al 33%. Gli altri
parametri (incluse le tabelle regione/città) sono un'ipotesi di continuità, da
aggiornare se cambiano ufficialmente.
"""

from decimal import Decimal

from app.domain.tax_rules import (
    AdditionalDeductionRule,
    ChildDeductionRule,
    EmployeeContributionRule,
    EmployerCostRule,
    EmploymentDeductionRule,
    IntegrativeTreatmentRule,
    LowIncomeExemptionRule,
    SpouseDeductionRule,
    TaxBracket,
    TaxRules,
)
from app.infrastructure.tax_rules.fiscal_year_2025 import (
    CITY_RATES,
    DEFAULT_CITY_RATE,
    DEFAULT_REGION_RATE,
    REGION_RATES,
)

RULES_2026 = TaxRules(
    fiscal_year=2026,
    irpef_brackets=(
        TaxBracket(Decimal("0"), Decimal("28000"), Decimal("0.23")),
        TaxBracket(Decimal("28000"), Decimal("50000"), Decimal("0.33")),
        TaxBracket(Decimal("50000"), None, Decimal("0.43")),
    ),
    no_tax_area_threshold=Decimal("8500"),
    employee_contribution=EmployeeContributionRule(
        private_rate=Decimal("0.0919"),
        public_rate=Decimal("0.0880"),
    ),
    employment_deduction=EmploymentDeductionRule(
        band_1_ceiling=Decimal("15000"),
        band_1_amount=Decimal("1955"),
        band_2_ceiling=Decimal("28000"),
        band_2_base_amount=Decimal("1910"),
        band_2_extra_amount=Decimal("1190"),
        band_3_ceiling=Decimal("50000"),
    ),
    integrative_treatment=IntegrativeTreatmentRule(
        minimum_income_floor=Decimal("8500"),
        low_income_ceiling=Decimal("15000"),
        mid_income_ceiling=Decimal("28000"),
        annual_amount=Decimal("1200"),
    ),
    low_income_exemption=LowIncomeExemptionRule(
        band_1_ceiling=Decimal("8500"),
        band_1_rate=Decimal("0.071"),
        band_2_ceiling=Decimal("15000"),
        band_2_rate=Decimal("0.053"),
        band_3_ceiling=Decimal("20000"),
        band_3_rate=Decimal("0.048"),
    ),
    additional_deduction=AdditionalDeductionRule(
        low_ceiling=Decimal("20000"),
        flat_ceiling=Decimal("32000"),
        flat_amount=Decimal("1000"),
        phase_out_ceiling=Decimal("40000"),
    ),
    spouse_deduction=SpouseDeductionRule(
        low_ceiling=Decimal("15000"),
        low_base_amount=Decimal("800"),
        low_reduction_factor=Decimal("110"),
        mid_ceiling=Decimal("40000"),
        mid_amount=Decimal("690"),
        high_ceiling=Decimal("80000"),
    ),
    child_deduction=ChildDeductionRule(
        per_child_amount=Decimal("950"),
        base_income_threshold=Decimal("95000"),
        per_child_threshold_increment=Decimal("15000"),
    ),
    employer_cost=EmployerCostRule(
        employer_contribution_rate=Decimal("0.30"),
        tfr_divisor=Decimal("13.5"),
    ),
    region_rates=REGION_RATES,
    default_region_rate=DEFAULT_REGION_RATE,
    city_rates=CITY_RATES,
    default_city_rate=DEFAULT_CITY_RATE,
)
