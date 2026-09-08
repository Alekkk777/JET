"""Adapter di ingresso HTTP: endpoint del chatbot esplicativo."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.application.ports.explanation_port import ExplanationUnavailableError
from app.application.use_cases.calculate_net_salary import (
    CalculateNetSalaryCommand,
    CalculateNetSalaryUseCase,
)
from app.application.use_cases.explain_calculation import ExplainCalculationCommand, ExplainCalculationUseCase
from app.infrastructure.api.dependencies import (
    get_calculate_net_salary_use_case,
    get_explain_calculation_use_case,
)
from app.infrastructure.api.schemas import ExplainRequest, ExplainResponse, SalaryBreakdownResponse

router = APIRouter(prefix="/api/v1/salary", tags=["chat"])


@router.post("/explain", response_model=ExplainResponse)
def explain_calculation(
    request: ExplainRequest,
    calculate_use_case: CalculateNetSalaryUseCase = Depends(get_calculate_net_salary_use_case),
    explain_use_case: ExplainCalculationUseCase = Depends(get_explain_calculation_use_case),
) -> ExplainResponse:
    calculate_request = request.to_calculate_request()
    try:
        breakdown = calculate_use_case.execute(
            CalculateNetSalaryCommand(
                gross_annual=calculate_request.gross_annual,
                fiscal_year=calculate_request.fiscal_year,
                monthly_installments=calculate_request.monthly_installments,
                sector=calculate_request.sector,
                region=calculate_request.region,
                city=calculate_request.city,
                has_dependent_spouse=calculate_request.has_dependent_spouse,
                dependent_children_count=calculate_request.dependent_children_count,
            )
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    try:
        explanation = explain_use_case.execute(
            ExplainCalculationCommand(breakdown=breakdown, conversation=request.to_conversation(), ccnl=request.ccnl)
        )
    except ExplanationUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return ExplainResponse(
        explanation=explanation,
        breakdown=SalaryBreakdownResponse.from_domain(breakdown),
    )
