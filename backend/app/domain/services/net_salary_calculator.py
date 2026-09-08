"""Servizio di dominio: calcolo dello stipendio netto a partire dalla RAL.

Ogni passo di questo calcolo è documentato in BUSINESS_RULES.md (sezioni 2 e 3).
Nessuna dipendenza da FastAPI, Pydantic o provider esterni: puro Python + Decimal.
"""

from __future__ import annotations

from decimal import Decimal

from app.domain.models import SalaryBreakdown
from app.domain.tax_rules import (
    AdditionalDeductionRule,
    ChildDeductionRule,
    EmployerCostRule,
    EmploymentDeductionRule,
    IntegrativeTreatmentRule,
    LowIncomeExemptionRule,
    Sector,
    SpouseDeductionRule,
    TaxBracket,
    TaxRules,
)
from app.domain.value_objects import Money

_ZERO = Decimal("0")
ALLOWED_MONTHLY_INSTALLMENTS = frozenset({12, 13, 14})


class NetSalaryCalculator:
    """Applica le regole fiscali di un dato anno a una RAL e produce il breakdown completo."""

    def calculate(
        self,
        gross_annual: Decimal,
        rules: TaxRules,
        *,
        monthly_installments: int = 12,
        sector: Sector = "privato",
        region: str | None = None,
        city: str | None = None,
        has_dependent_spouse: bool = False,
        dependent_children_count: int = 0,
    ) -> SalaryBreakdown:
        if gross_annual <= _ZERO:
            raise ValueError("La RAL deve essere maggiore di zero")
        if monthly_installments not in ALLOWED_MONTHLY_INSTALLMENTS:
            raise ValueError(
                f"Mensilità non supportate: {monthly_installments}. Valori ammessi: "
                f"{sorted(ALLOWED_MONTHLY_INSTALLMENTS)}"
            )
        if dependent_children_count < 0:
            raise ValueError("Il numero di figli a carico non può essere negativo")

        inps_rate = rules.employee_contribution.rate_for(sector)
        inps = self._compute_inps(gross_annual, inps_rate)
        taxable_income = gross_annual - inps

        irpef_gross = self._compute_irpef_gross(taxable_income, rules.irpef_brackets)
        employment_deduction = self._compute_employment_deduction(taxable_income, rules.employment_deduction)
        spouse_deduction = (
            self._compute_spouse_deduction(taxable_income, rules.spouse_deduction)
            if has_dependent_spouse
            else _ZERO
        )
        children_deduction = self._compute_children_deduction(
            taxable_income, dependent_children_count, rules.child_deduction
        )
        additional_deduction = self._compute_additional_deduction(taxable_income, rules.additional_deduction)
        total_deduction = employment_deduction + spouse_deduction + children_deduction + additional_deduction

        below_no_tax_area = taxable_income <= rules.no_tax_area_threshold
        irpef_net = _ZERO if below_no_tax_area else max(_ZERO, irpef_gross - total_deduction)

        region_rate = rules.region_rate(region)
        city_rate = rules.city_rate(city)
        regional_tax = self._compute_local_additional_tax(taxable_income, region_rate, rules.no_tax_area_threshold)
        municipal_tax = self._compute_local_additional_tax(
            taxable_income, city_rate.additional_rate, rules.no_tax_area_threshold
        )

        # Il trattamento integrativo confronta la sola detrazione da lavoro dipendente
        # con l'IRPEF lorda (fonte: informazionefiscale.it, vedi BUSINESS_RULES.md), non
        # il totale delle detrazioni (che include anche coniuge/figli/ulteriore
        # detrazione): è una misura distinta e cumulabile, non va confusa con essa.
        integrative_treatment = self._compute_integrative_treatment(
            taxable_income, irpef_gross, employment_deduction, rules.integrative_treatment
        )
        low_income_exemption = self._compute_low_income_exemption(taxable_income, rules.low_income_exemption)

        total_withholdings = inps + irpef_net + regional_tax + municipal_tax
        net_annual = gross_annual - total_withholdings + integrative_treatment + low_income_exemption
        net_monthly = net_annual / Decimal(monthly_installments)

        effective_tax_rate = (gross_annual - net_annual) / gross_annual
        employer_cost = self._compute_employer_cost(gross_annual, rules.employer_cost)

        return SalaryBreakdown(
            fiscal_year=rules.fiscal_year,
            gross_annual=Money(gross_annual),
            monthly_installments=monthly_installments,
            sector=sector,
            inps_employee_contribution=Money(inps),
            taxable_income=Money(taxable_income),
            irpef_gross=Money(irpef_gross),
            employment_income_deduction=Money(employment_deduction),
            additional_deduction=Money(additional_deduction),
            spouse_deduction=Money(spouse_deduction),
            children_deduction=Money(children_deduction),
            irpef_net=Money(irpef_net),
            region=region,
            city=city,
            regional_additional_tax=Money(regional_tax),
            municipal_additional_tax=Money(municipal_tax),
            integrative_treatment=Money(integrative_treatment),
            low_income_exemption=Money(low_income_exemption),
            net_annual=Money(net_annual),
            net_monthly=Money(net_monthly),
            effective_tax_rate=effective_tax_rate,
            employer_cost=Money(employer_cost),
        )

    @staticmethod
    def _compute_inps(gross_annual: Decimal, employee_rate: Decimal) -> Decimal:
        return gross_annual * employee_rate

    @staticmethod
    def _compute_irpef_gross(taxable_income: Decimal, brackets: tuple[TaxBracket, ...]) -> Decimal:
        tax = _ZERO
        for bracket in brackets:
            if taxable_income <= bracket.lower_bound:
                break
            upper = bracket.upper_bound if bracket.upper_bound is not None else taxable_income
            taxable_in_bracket = min(taxable_income, upper) - bracket.lower_bound
            if taxable_in_bracket > _ZERO:
                tax += taxable_in_bracket * bracket.rate
        return tax

    @staticmethod
    def _compute_employment_deduction(taxable_income: Decimal, rule: EmploymentDeductionRule) -> Decimal:
        if taxable_income <= _ZERO:
            return _ZERO
        if taxable_income <= rule.band_1_ceiling:
            return rule.band_1_amount
        if taxable_income <= rule.band_2_ceiling:
            span = rule.band_2_ceiling - rule.band_1_ceiling
            extra = rule.band_2_extra_amount * ((rule.band_2_ceiling - taxable_income) / span)
            return rule.band_2_base_amount + extra
        if taxable_income <= rule.band_3_ceiling:
            span = rule.band_3_ceiling - rule.band_2_ceiling
            return rule.band_2_base_amount * ((rule.band_3_ceiling - taxable_income) / span)
        return _ZERO

    @staticmethod
    def _compute_spouse_deduction(taxable_income: Decimal, rule: SpouseDeductionRule) -> Decimal:
        if taxable_income <= _ZERO:
            return rule.low_base_amount
        if taxable_income <= rule.low_ceiling:
            reduction = rule.low_reduction_factor * (taxable_income / rule.low_ceiling)
            return max(_ZERO, rule.low_base_amount - reduction)
        if taxable_income <= rule.mid_ceiling:
            return rule.mid_amount
        if taxable_income <= rule.high_ceiling:
            span = rule.high_ceiling - rule.mid_ceiling
            return rule.mid_amount * ((rule.high_ceiling - taxable_income) / span)
        return _ZERO

    @staticmethod
    def _compute_children_deduction(
        taxable_income: Decimal, children_count: int, rule: ChildDeductionRule
    ) -> Decimal:
        if children_count <= 0:
            return _ZERO
        extra_children = Decimal(max(0, children_count - 1))
        threshold = rule.base_income_threshold + extra_children * rule.per_child_threshold_increment
        quotient = max(_ZERO, (threshold - taxable_income) / threshold)
        return rule.per_child_amount * Decimal(children_count) * quotient

    @staticmethod
    def _compute_additional_deduction(taxable_income: Decimal, rule: AdditionalDeductionRule) -> Decimal:
        if taxable_income <= rule.low_ceiling:
            return _ZERO
        if taxable_income <= rule.flat_ceiling:
            return rule.flat_amount
        if taxable_income <= rule.phase_out_ceiling:
            span = rule.phase_out_ceiling - rule.flat_ceiling
            return rule.flat_amount * ((rule.phase_out_ceiling - taxable_income) / span)
        return _ZERO

    @staticmethod
    def _compute_low_income_exemption(taxable_income: Decimal, rule: LowIncomeExemptionRule) -> Decimal:
        if taxable_income <= _ZERO:
            return _ZERO
        if taxable_income <= rule.band_1_ceiling:
            rate = rule.band_1_rate
        elif taxable_income <= rule.band_2_ceiling:
            rate = rule.band_2_rate
        elif taxable_income <= rule.band_3_ceiling:
            rate = rule.band_3_rate
        else:
            return _ZERO
        return taxable_income * rate

    @staticmethod
    def _compute_local_additional_tax(
        taxable_income: Decimal, rate: Decimal, no_tax_area_threshold: Decimal
    ) -> Decimal:
        if taxable_income <= no_tax_area_threshold:
            return _ZERO
        return taxable_income * rate

    @staticmethod
    def _compute_integrative_treatment(
        taxable_income: Decimal,
        irpef_gross: Decimal,
        employment_deduction: Decimal,
        rule: IntegrativeTreatmentRule,
    ) -> Decimal:
        if taxable_income < rule.minimum_income_floor:
            return _ZERO
        if taxable_income <= rule.low_income_ceiling:
            return rule.annual_amount
        if taxable_income <= rule.mid_income_ceiling and employment_deduction > irpef_gross:
            return rule.annual_amount
        return _ZERO

    @staticmethod
    def _compute_employer_cost(gross_annual: Decimal, rule: EmployerCostRule) -> Decimal:
        return gross_annual * (Decimal("1") + rule.employer_contribution_rate) + gross_annual / rule.tfr_divisor
