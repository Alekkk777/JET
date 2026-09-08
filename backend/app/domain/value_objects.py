"""Value objects di dominio. Nessuna dipendenza da framework esterni."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal


@dataclass(frozen=True, slots=True)
class Money:
    """Un importo in euro, sempre arrotondato al centesimo e non negativo.

    Le sottrazioni intermedie che possono andare sotto zero (es. IRPEF lorda meno
    detrazione) si fanno con `Decimal` puro nel servizio di dominio; `Money` si usa solo
    per valori che la regola di business garantisce essere >= 0.
    """

    amount: Decimal

    def __post_init__(self) -> None:
        quantized = self.amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        object.__setattr__(self, "amount", quantized)
        if self.amount < 0:
            raise ValueError(f"Money non può essere negativo: {self.amount}")

    @classmethod
    def zero(cls) -> Money:
        return cls(Decimal("0"))

    def __str__(self) -> str:
        return f"{self.amount:,.2f} EUR"
