"""Composition root: qui e solo qui si collegano use case, porte e adapter concreti."""

from __future__ import annotations

from functools import lru_cache

from app.application.ports.tax_rules_provider import TaxRulesProvider
from app.application.use_cases.calculate_net_salary import CalculateNetSalaryUseCase
from app.application.use_cases.explain_calculation import ExplainCalculationUseCase
from app.application.use_cases.list_reference_data import ListReferenceDataUseCase
from app.config import get_settings
from app.infrastructure.llm.anthropic_explanation_adapter import AnthropicExplanationAdapter
from app.infrastructure.tax_rules.static_tax_rules_provider import StaticTaxRulesProvider


@lru_cache
def get_tax_rules_provider() -> TaxRulesProvider:
    return StaticTaxRulesProvider()


@lru_cache
def get_calculate_net_salary_use_case() -> CalculateNetSalaryUseCase:
    return CalculateNetSalaryUseCase(tax_rules_provider=get_tax_rules_provider())


@lru_cache
def get_list_reference_data_use_case() -> ListReferenceDataUseCase:
    return ListReferenceDataUseCase(tax_rules_provider=get_tax_rules_provider())


@lru_cache
def get_explain_calculation_use_case() -> ExplainCalculationUseCase:
    settings = get_settings()
    adapter = AnthropicExplanationAdapter(api_key=settings.anthropic_api_key, model=settings.anthropic_model)
    return ExplainCalculationUseCase(explanation_port=adapter)
