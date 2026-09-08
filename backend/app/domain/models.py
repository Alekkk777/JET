"""Modelli di risultato del dominio."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal

from app.domain.tax_rules import Sector
from app.domain.value_objects import Money


@dataclass(frozen=True, slots=True)
class SalaryBreakdown:
    """Risultato completo del calcolo RAL -> netto, voce per voce.

    Ogni campo corrisponde a una riga della sezione 2 di BUSINESS_RULES.md.
    """

    fiscal_year: int
    gross_annual: Money
    monthly_installments: int
    sector: Sector
    inps_employee_contribution: Money
    taxable_income: Money
    irpef_gross: Money
    employment_income_deduction: Money
    additional_deduction: Money
    spouse_deduction: Money
    children_deduction: Money
    irpef_net: Money
    region: str | None
    city: str | None
    regional_additional_tax: Money
    municipal_additional_tax: Money
    integrative_treatment: Money
    low_income_exemption: Money
    net_annual: Money
    net_monthly: Money
    effective_tax_rate: Decimal
    employer_cost: Money
