"""Regole fiscali come dati di dominio versionati per anno fiscale.

Vedi BUSINESS_RULES.md per la fonte e il significato di ogni parametro: questo modulo
definisce solo la *forma* delle regole, i valori concreti stanno in
`app/infrastructure/tax_rules/fiscal_year_*.py`.
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from types import MappingProxyType
from typing import Literal

Sector = Literal["privato", "pubblico"]


@dataclass(frozen=True, slots=True)
class TaxBracket:
    """Uno scaglione IRPEF: `rate` si applica alla quota di reddito tra `lower_bound`
    (escluso) e `upper_bound` (incluso; None = nessun limite superiore)."""

    lower_bound: Decimal
    upper_bound: Decimal | None
    rate: Decimal


@dataclass(frozen=True, slots=True)
class EmployeeContributionRule:
    """Aliquota INPS a carico del lavoratore, diversa per settore pubblico/privato."""

    private_rate: Decimal
    public_rate: Decimal

    def rate_for(self, sector: Sector) -> Decimal:
        return self.public_rate if sector == "pubblico" else self.private_rate


@dataclass(frozen=True, slots=True)
class EmploymentDeductionRule:
    """Parametri della detrazione da lavoro dipendente (art. 13 TUIR, formula a 3 fasce)."""

    band_1_ceiling: Decimal
    band_1_amount: Decimal
    band_2_ceiling: Decimal
    band_2_base_amount: Decimal
    band_2_extra_amount: Decimal
    band_3_ceiling: Decimal


@dataclass(frozen=True, slots=True)
class IntegrativeTreatmentRule:
    """Parametri del trattamento integrativo ("bonus busta paga")."""

    minimum_income_floor: Decimal
    low_income_ceiling: Decimal
    mid_income_ceiling: Decimal
    annual_amount: Decimal


@dataclass(frozen=True, slots=True)
class LowIncomeExemptionRule:
    """Somma esente (non concorre alla formazione del reddito imponibile) per redditi
    da lavoro dipendente fino a 20.000€ — art. 1, L. 207/2024, confermata strutturale
    dalla L. 199/2025 (Bilancio 2026). Percentuale decrescente a tre fasce."""

    band_1_ceiling: Decimal
    band_1_rate: Decimal
    band_2_ceiling: Decimal
    band_2_rate: Decimal
    band_3_ceiling: Decimal
    band_3_rate: Decimal


@dataclass(frozen=True, slots=True)
class AdditionalDeductionRule:
    """Ulteriore detrazione IRPEF (cuneo fiscale strutturale) per redditi tra 20.000€
    e 40.000€ — art. 1, comma 6, L. 207/2024, confermata strutturale dalla L. 199/2025
    (Bilancio 2026). Cumulabile con le altre detrazioni e con il trattamento
    integrativo (misure distinte)."""

    low_ceiling: Decimal
    flat_ceiling: Decimal
    flat_amount: Decimal
    phase_out_ceiling: Decimal


@dataclass(frozen=True, slots=True)
class SpouseDeductionRule:
    """Detrazione per coniuge a carico (art. 12, comma 1, lett. a, TUIR).

    Continua esattamente al confine `low_ceiling`: a quel reddito la fascia bassa
    (`low_base_amount - low_reduction_factor`) coincide con l'importo fisso della
    fascia intermedia (`mid_amount`).
    """

    low_ceiling: Decimal
    low_base_amount: Decimal
    low_reduction_factor: Decimal
    mid_ceiling: Decimal
    mid_amount: Decimal
    high_ceiling: Decimal


@dataclass(frozen=True, slots=True)
class ChildDeductionRule:
    """Detrazione per figli a carico. Si applica solo a figli over 21: per gli
    under 21 la detrazione è sostituita dall'Assegno Unico Universale (fuori scope,
    è un beneficio INPS, non una detrazione fiscale — vedi BUSINESS_RULES.md)."""

    per_child_amount: Decimal
    base_income_threshold: Decimal
    per_child_threshold_increment: Decimal


@dataclass(frozen=True, slots=True)
class EmployerCostRule:
    """Parametri per stimare il costo azienda a partire dalla RAL."""

    employer_contribution_rate: Decimal
    tfr_divisor: Decimal


@dataclass(frozen=True, slots=True)
class CityRate:
    """Aliquota comunale di una città.

    `region` è la regione reale della città, usata per far filtrare al frontend il
    <select> città in base alla regione scelta (nessuna combinazione geografica
    impossibile). `None` solo per il fallback "altro comune" generico.
    """

    additional_rate: Decimal
    region: str | None = None


@dataclass(frozen=True, slots=True)
class TaxRules:
    """Aggregato di tutte le regole fiscali e di riferimento applicabili a un anno."""

    fiscal_year: int
    irpef_brackets: tuple[TaxBracket, ...]
    no_tax_area_threshold: Decimal
    employee_contribution: EmployeeContributionRule
    employment_deduction: EmploymentDeductionRule
    integrative_treatment: IntegrativeTreatmentRule
    low_income_exemption: LowIncomeExemptionRule
    additional_deduction: AdditionalDeductionRule
    spouse_deduction: SpouseDeductionRule
    child_deduction: ChildDeductionRule
    employer_cost: EmployerCostRule
    region_rates: MappingProxyType[str, Decimal]
    default_region_rate: Decimal
    city_rates: MappingProxyType[str, CityRate]
    default_city_rate: CityRate

    def region_rate(self, region: str | None) -> Decimal:
        if region is None:
            return self.default_region_rate
        return self.region_rates.get(region, self.default_region_rate)

    def city_rate(self, city: str | None) -> CityRate:
        if city is None:
            return self.default_city_rate
        return self.city_rates.get(city, self.default_city_rate)
