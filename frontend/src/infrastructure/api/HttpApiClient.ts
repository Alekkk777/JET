/** Adapter concreto di `ApiClient`: unico punto dell'app che chiama `fetch`. */

import { ApiError, type ApiClient, type ExplainResult } from "@/application/ports/ApiClient";
import type { ChatMessage, FormState, ReferenceData, SalaryBreakdown } from "@/domain/types";
import type { ErrorResponseDto, ExplainResponseDto, ReferenceDataDto, SalaryBreakdownDto } from "./dto";
import { toReferenceData, toSalaryBreakdown } from "./mappers";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

function extractErrorMessage(data: ErrorResponseDto): string {
  if (Array.isArray(data.detail)) {
    return data.detail.map((d) => d.msg ?? String(d)).join("; ");
  }
  return data.detail ?? "Il server non ha risposto correttamente.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  const data = (await response.json().catch(() => ({}))) as T & ErrorResponseDto;
  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data));
  }
  return data;
}

function buildCalculatePayload(form: FormState) {
  return {
    gross_annual: form.ral,
    monthly_installments: form.mensilita,
    sector: form.settore,
    region: form.regione || null,
    city: form.citta || null,
    has_dependent_spouse: form.coniuge,
    dependent_children_count: form.figli,
  };
}

export class HttpApiClient implements ApiClient {
  async getReferenceData(): Promise<ReferenceData> {
    const dto = await request<ReferenceDataDto>("/api/v1/salary/reference-data");
    return toReferenceData(dto);
  }

  async calculate(form: FormState): Promise<SalaryBreakdown> {
    const dto = await request<SalaryBreakdownDto>("/api/v1/salary/calculate", {
      method: "POST",
      body: JSON.stringify(buildCalculatePayload(form)),
    });
    return toSalaryBreakdown(dto);
  }

  async explain(form: FormState, conversation: ChatMessage[]): Promise<ExplainResult> {
    const dto = await request<ExplainResponseDto>("/api/v1/salary/explain", {
      method: "POST",
      body: JSON.stringify({
        ...buildCalculatePayload(form),
        ccnl: form.ccnl || null,
        messages: conversation.map((m) => ({ role: m.role, content: m.text })),
      }),
    });
    return {
      explanation: dto.explanation,
      breakdown: toSalaryBreakdown(dto.breakdown),
    };
  }
}
