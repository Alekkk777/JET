"""Use case: elenco dei dati di riferimento disponibili (per popolare form/select).

Nessuna regola di business qui: è solo un modo per non far duplicare al frontend le
liste di regioni/città/livelli che vivono già nel backend (vedi
app/infrastructure/tax_rules/fiscal_year_*.py).
"""

from __future__ import annotations

from dataclasses import dataclass

from app.application.ports.tax_rules_provider import TaxRulesProvider


@dataclass(frozen=True, slots=True)
class ReferenceData:
    fiscal_years: tuple[int, ...]
    default_fiscal_year: int
    regions: tuple[str, ...]
    cities: tuple[str, ...]
    # Città raggruppate per la loro regione reale, per far filtrare al frontend il
    # <select> città in base alla regione scelta (nessuna coppia regione/città
    # geograficamente impossibile). Non include città senza regione nota.
    cities_by_region: dict[str, tuple[str, ...]]
    monthly_installments_options: tuple[int, ...]


class ListReferenceDataUseCase:
    def __init__(self, tax_rules_provider: TaxRulesProvider) -> None:
        self._tax_rules_provider = tax_rules_provider

    def execute(self, fiscal_year: int | None = None) -> ReferenceData:
        fiscal_year = fiscal_year or self._tax_rules_provider.latest_fiscal_year()
        rules = self._tax_rules_provider.get_rules(fiscal_year)

        cities_by_region: dict[str, list[str]] = {}
        for city_name, city_rate in rules.city_rates.items():
            if city_rate.region is not None:
                cities_by_region.setdefault(city_rate.region, []).append(city_name)
        for region_cities in cities_by_region.values():
            region_cities.sort()

        return ReferenceData(
            fiscal_years=self._tax_rules_provider.available_fiscal_years(),
            default_fiscal_year=self._tax_rules_provider.latest_fiscal_year(),
            regions=tuple(sorted(rules.region_rates)),
            cities=tuple(sorted(rules.city_rates)),
            cities_by_region={region: tuple(cities) for region, cities in cities_by_region.items()},
            monthly_installments_options=(12, 13, 14),
        )
