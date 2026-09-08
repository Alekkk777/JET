import type { ChatMessage } from "@/domain/types";
import { chatBubbleStyles } from "@/styles/chat.styles";

import { FormattedMessageText } from "./FormattedMessageText";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return <div style={chatBubbleStyles.user}>{message.text}</div>;
  }
  return (
    <div style={chatBubbleStyles.assistant}>
      <FormattedMessageText text={message.text} />
    </div>
  );
}
