"""Schemi Pydantic dell'API (adapter di ingresso). Confini col mondo esterno."""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field

from app.application.ports.explanation_port import ConversationTurn
from app.application.use_cases.list_reference_data import ReferenceData
from app.domain.models import SalaryBreakdown
from app.domain.tax_rules import Sector

MonthlyInstallments = Literal[12, 13, 14]


class CalculateSalaryRequest(BaseModel):
    gross_annual: Decimal = Field(..., gt=0, description="RAL - Retribuzione Annua Lorda in euro")
    fiscal_year: int | None = Field(
        default=None, description="Anno fiscale di riferimento; se assente usa l'ultimo disponibile"
    )
    monthly_installments: MonthlyInstallments = Field(
        default=12, description="Numero di mensilità su cui è spalmata la RAL (12, 13 o 14)"
    )
    sector: Sector = Field(
        default="privato", description="Settore di lavoro: cambia l'aliquota INPS a carico del lavoratore"
    )
    region: str | None = Field(
        default=None, description="Regione di lavoro; se assente/non riconosciuta usa una media nazionale"
    )
    city: str | None = Field(
        default=None, description="Città di lavoro; se assente/non riconosciuta usa una media nazionale"
    )
    has_dependent_spouse: bool = Field(
        default=False, description="Coniuge a carico (reddito coniuge < 2.840,51 €/anno)"
    )
    dependent_children_count: int = Field(
        default=0, ge=0, description="Figli a carico over 21 (vedi BUSINESS_RULES.md)"
    )


class SalaryBreakdownResponse(BaseModel):
    fiscal_year: int
    gross_annual: Decimal
    monthly_installments: int
    sector: Sector
    inps_employee_contribution: Decimal
    taxable_income: Decimal
    irpef_gross: Decimal
    employment_income_deduction: Decimal
    additional_deduction: Decimal
    spouse_deduction: Decimal
    children_deduction: Decimal
    irpef_net: Decimal
    region: str | None
    city: str | None
    regional_additional_tax: Decimal
    municipal_additional_tax: Decimal
    integrative_treatment: Decimal
    low_income_exemption: Decimal
    net_annual: Decimal
    net_monthly: Decimal
    effective_tax_rate: Decimal
    employer_cost: Decimal

    @classmethod
    def from_domain(cls, breakdown: SalaryBreakdown) -> SalaryBreakdownResponse:
        return cls(
            fiscal_year=breakdown.fiscal_year,
            gross_annual=breakdown.gross_annual.amount,
            monthly_installments=breakdown.monthly_installments,
            sector=breakdown.sector,
            inps_employee_contribution=breakdown.inps_employee_contribution.amount,
            taxable_income=breakdown.taxable_income.amount,
            irpef_gross=breakdown.irpef_gross.amount,
            employment_income_deduction=breakdown.employment_income_deduction.amount,
            additional_deduction=breakdown.additional_deduction.amount,
            spouse_deduction=breakdown.spouse_deduction.amount,
            children_deduction=breakdown.children_deduction.amount,
            irpef_net=breakdown.irpef_net.amount,
            region=breakdown.region,
            city=breakdown.city,
            regional_additional_tax=breakdown.regional_additional_tax.amount,
            municipal_additional_tax=breakdown.municipal_additional_tax.amount,
            integrative_treatment=breakdown.integrative_treatment.amount,
            low_income_exemption=breakdown.low_income_exemption.amount,
            net_annual=breakdown.net_annual.amount,
            net_monthly=breakdown.net_monthly.amount,
            effective_tax_rate=breakdown.effective_tax_rate,
            employer_cost=breakdown.employer_cost.amount,
        )


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1)


class ExplainRequest(BaseModel):
    gross_annual: Decimal = Field(..., gt=0, description="RAL - Retribuzione Annua Lorda in euro")
    fiscal_year: int | None = Field(default=None, description="Anno fiscale di riferimento")
    monthly_installments: MonthlyInstallments = Field(default=12)
    sector: Sector = Field(default="privato")
    region: str | None = Field(default=None)
    city: str | None = Field(default=None)
    has_dependent_spouse: bool = Field(default=False)
    dependent_children_count: int = Field(default=0, ge=0)
    ccnl: str | None = Field(default=None, description="Contratto (CCNL), puramente informativo per il chatbot")
    messages: list[ChatMessage] = Field(
        default_factory=list,
        description=(
            "Cronologia della conversazione su questo calcolo, tenuta e rinviata dal client "
            "(nessuna sessione lato server). Vuota per la prima spiegazione generale; "
            "altrimenti l'ultimo messaggio è tipicamente la nuova domanda dell'utente."
        ),
    )

    def to_calculate_request(self) -> CalculateSalaryRequest:
        return CalculateSalaryRequest(
            gross_annual=self.gross_annual,
            fiscal_year=self.fiscal_year,
            monthly_installments=self.monthly_installments,
            sector=self.sector,
            region=self.region,
            city=self.city,
            has_dependent_spouse=self.has_dependent_spouse,
            dependent_children_count=self.dependent_children_count,
        )

    def to_conversation(self) -> tuple[ConversationTurn, ...]:
        return tuple(ConversationTurn(role=m.role, content=m.content) for m in self.messages)


class ExplainResponse(BaseModel):
    explanation: str
    breakdown: SalaryBreakdownResponse


class ReferenceDataResponse(BaseModel):
    fiscal_years: tuple[int, ...]
    default_fiscal_year: int
    regions: tuple[str, ...]
    cities: tuple[str, ...]
    cities_by_region: dict[str, tuple[str, ...]]
    monthly_installments_options: tuple[int, ...]

    @classmethod
    def from_domain(cls, data: ReferenceData) -> ReferenceDataResponse:
        return cls(
            fiscal_years=data.fiscal_years,
            default_fiscal_year=data.default_fiscal_year,
            regions=data.regions,
            cities=data.cities,
            cities_by_region=data.cities_by_region,
            monthly_installments_options=data.monthly_installments_options,
        )
