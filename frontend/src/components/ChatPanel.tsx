import type { ChatMessage } from "@/domain/types";
import { useAutoScrollToBottom } from "@/hooks/useAutoScrollToBottom";
import { chatPanelStyles } from "@/styles/chat.styles";

import { ChatMessageBubble } from "./ChatMessageBubble";
import { JetMascot } from "./JetMascot";
import { TypingIndicator } from "./TypingIndicator";

const QUICK_QUESTIONS = [
  "Perché il netto è così basso?",
  "Quanto costo all'azienda?",
  "Come posso aumentare il netto?",
  "Cos'è il bonus cuneo fiscale?",
];

interface ChatPanelProps {
  messages: ChatMessage[];
  typing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onAsk: (text: string) => void;
}

export function ChatPanel({ messages, typing, draft, onDraftChange, onAsk }: ChatPanelProps) {
  const messageListRef = useAutoScrollToBottom<HTMLDivElement>([messages, typing]);

  return (
    <div style={chatPanelStyles.column}>
      <div style={chatPanelStyles.header}>
        <div style={chatPanelStyles.headerMascotWrap}>
          <JetMascot size={42} />
        </div>
        <div style={chatPanelStyles.headerTextColumn}>
          <span style={chatPanelStyles.headerTitle}>Chiedi a JET</span>
          <span style={chatPanelStyles.headerStatus}>online · conosce il tuo calcolo</span>
        </div>
      </div>

      <div ref={messageListRef} style={chatPanelStyles.messageList}>
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      <div style={chatPanelStyles.suggestionsRow}>
        {QUICK_QUESTIONS.map((question) => (
          <button key={question} onClick={() => onAsk(question)} className="pill-suggestion" style={chatPanelStyles.suggestionChip}>
            {question}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onAsk(draft);
        }}
        style={chatPanelStyles.composer}
      >
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Scrivi a JET…"
          style={chatPanelStyles.composerInput}
        />
        <button type="submit" className="chat-send" style={chatPanelStyles.sendButton}>
          ↑
        </button>
      </form>
    </div>
  );
}
