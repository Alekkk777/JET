import type { ReferenceData } from "@/domain/types";

/**
 * Copia di partenza dei dati di riferimento (identica a
 * backend/app/infrastructure/tax_rules/fiscal_year_2025.py), usata da
 * `useReferenceData` finché `GET /reference-data` non ha ancora risposto (o se la
 * chiamata fallisce). Il backend resta l'unica fonte di verità: se le liste
 * divergono in futuro, qui si vede solo un'opzione in più/meno nei <select>, nessun
 * calcolo è mai duplicato lato client.
 */
export const FALLBACK_REFERENCE_DATA: ReferenceData = {
  fiscalYears: [2025, 2026],
  defaultFiscalYear: 2026,
  regions: [
    "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
    "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise",
    "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "Trentino-Alto Adige",
    "Umbria", "Valle d'Aosta", "Veneto",
  ],
  cities: ["Bari", "Bologna", "Firenze", "Milano", "Napoli", "Padova", "Palermo", "Roma", "Torino"],
  citiesByRegion: {
    Lombardia: ["Milano"],
    Lazio: ["Roma"],
    Piemonte: ["Torino"],
    "Emilia-Romagna": ["Bologna"],
    Toscana: ["Firenze"],
    Campania: ["Napoli"],
    Veneto: ["Padova"],
    Puglia: ["Bari"],
    Sicilia: ["Palermo"],
  },
  monthlyInstallmentsOptions: [12, 13, 14],
};
