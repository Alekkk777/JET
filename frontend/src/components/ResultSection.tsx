import type { ChatMessage, FormState, SalaryBreakdown } from "@/domain/types";
import { resultSectionStyles } from "@/styles/result.styles";

import { ChatPanel } from "./ChatPanel";
import { ResultDashboard } from "./ResultDashboard";

interface ResultSectionProps {
  breakdown: SalaryBreakdown;
  form: FormState;
  onEdit: () => void;
  chatMessages: ChatMessage[];
  chatTyping: boolean;
  chatDraft: string;
  onChatDraftChange: (value: string) => void;
  onAsk: (text: string) => void;
}

export function ResultSection({ breakdown, form, onEdit, chatMessages, chatTyping, chatDraft, onChatDraftChange, onAsk }: ResultSectionProps) {
  return (
    <div style={resultSectionStyles.wrapper}>
      <div style={resultSectionStyles.grid}>
        <ResultDashboard breakdown={breakdown} form={form} onEdit={onEdit} />
        <ChatPanel messages={chatMessages} typing={chatTyping} draft={chatDraft} onDraftChange={onChatDraftChange} onAsk={onAsk} />
      </div>
    </div>
  );
}
