"""Adapter di ingresso HTTP: endpoint di calcolo."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.application.use_cases.calculate_net_salary import (
    CalculateNetSalaryCommand,
    CalculateNetSalaryUseCase,
)
from app.infrastructure.api.dependencies import get_calculate_net_salary_use_case
from app.infrastructure.api.schemas import CalculateSalaryRequest, SalaryBreakdownResponse

router = APIRouter(prefix="/api/v1/salary", tags=["salary"])


@router.post("/calculate", response_model=SalaryBreakdownResponse)
def calculate_net_salary(
    request: CalculateSalaryRequest,
    use_case: CalculateNetSalaryUseCase = Depends(get_calculate_net_salary_use_case),
) -> SalaryBreakdownResponse:
    try:
        breakdown = use_case.execute(
            CalculateNetSalaryCommand(
                gross_annual=request.gross_annual,
                fiscal_year=request.fiscal_year,
                monthly_installments=request.monthly_installments,
                sector=request.sector,
                region=request.region,
                city=request.city,
                has_dependent_spouse=request.has_dependent_spouse,
                dependent_children_count=request.dependent_children_count,
            )
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return SalaryBreakdownResponse.from_domain(breakdown)
