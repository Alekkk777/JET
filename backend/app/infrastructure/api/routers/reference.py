"""Adapter di ingresso HTTP: dati di riferimento per popolare form/select del frontend."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.use_cases.list_reference_data import ListReferenceDataUseCase
from app.infrastructure.api.dependencies import get_list_reference_data_use_case
from app.infrastructure.api.schemas import ReferenceDataResponse

router = APIRouter(prefix="/api/v1/salary", tags=["reference"])


@router.get("/reference-data", response_model=ReferenceDataResponse)
def get_reference_data(
    fiscal_year: int | None = None,
    use_case: ListReferenceDataUseCase = Depends(get_list_reference_data_use_case),
) -> ReferenceDataResponse:
    return ReferenceDataResponse.from_domain(use_case.execute(fiscal_year))
