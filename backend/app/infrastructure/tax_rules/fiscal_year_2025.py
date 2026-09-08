"""Regole fiscali 2025. Fonti e semplificazioni: BUSINESS_RULES.md, sezione 3.1."""

from decimal import Decimal
from types import MappingProxyType

from app.domain.tax_rules import (
    AdditionalDeductionRule,
    ChildDeductionRule,
    CityRate,
    EmployeeContributionRule,
    EmployerCostRule,
    EmploymentDeductionRule,
    IntegrativeTreatmentRule,
    LowIncomeExemptionRule,
    SpouseDeductionRule,
    TaxBracket,
    TaxRules,
)

# Aliquota flat indicativa per regione (semplificazione: alcune regioni applicano in
# realtà scaglioni interni diversi dalla propria aliquota media; qui un solo numero
# per regione, tutte e 20 coperte). Il fallback (media nazionale) resta per casi limite
# (es. lavoratori all'estero) non per regioni italiane mancanti.
REGION_RATES = MappingProxyType(
    {
        "Lombardia": Decimal("0.0158"),
        "Lazio": Decimal("0.0333"),
        "Piemonte": Decimal("0.0325"),
        "Veneto": Decimal("0.0123"),
        "Emilia-Romagna": Decimal("0.0203"),
        "Toscana": Decimal("0.0142"),
        "Campania": Decimal("0.0333"),
        "Puglia": Decimal("0.0233"),
        "Sicilia": Decimal("0.0176"),
        "Liguria": Decimal("0.0223"),
        "Marche": Decimal("0.0173"),
        "Trentino-Alto Adige": Decimal("0.0123"),
        "Abruzzo": Decimal("0.0173"),
        "Basilicata": Decimal("0.0123"),
        "Calabria": Decimal("0.0225"),
        "Friuli-Venezia Giulia": Decimal("0.0123"),
        "Molise": Decimal("0.0203"),
        "Sardegna": Decimal("0.0123"),
        "Umbria": Decimal("0.0173"),
        "Valle d'Aosta": Decimal("0.0070"),
    }
)
DEFAULT_REGION_RATE = Decimal("0.0173")

# Aliquota comunale + regione reale di appartenenza (usata dal frontend per filtrare il
# <select> città in base alla regione scelta). "Altro comune" è il fallback, valido per
# qualunque regione.
CITY_RATES = MappingProxyType(
    {
        "Milano": CityRate(Decimal("0.008"), "Lombardia"),
        "Roma": CityRate(Decimal("0.009"), "Lazio"),
        "Torino": CityRate(Decimal("0.008"), "Piemonte"),
        "Bologna": CityRate(Decimal("0.008"), "Emilia-Romagna"),
        "Firenze": CityRate(Decimal("0.002"), "Toscana"),
        "Napoli": CityRate(Decimal("0.008"), "Campania"),
        "Padova": CityRate(Decimal("0.005"), "Veneto"),
        "Bari": CityRate(Decimal("0.008"), "Puglia"),
        "Palermo": CityRate(Decimal("0.008"), "Sicilia"),
    }
)
DEFAULT_CITY_RATE = CityRate(Decimal("0.005"), None)

RULES_2025 = TaxRules(
    fiscal_year=2025,
    irpef_brackets=(
        TaxBracket(Decimal("0"), Decimal("28000"), Decimal("0.23")),
        TaxBracket(Decimal("28000"), Decimal("50000"), Decimal("0.35")),
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
