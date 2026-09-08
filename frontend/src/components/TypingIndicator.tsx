import { typingIndicatorStyles } from "@/styles/chat.styles";

const DOT_DELAYS_SECONDS = [0, 0.16, 0.32];

export function TypingIndicator() {
  return (
    <div style={typingIndicatorStyles.wrap}>
      {DOT_DELAYS_SECONDS.map((delay) => (
        <span key={delay} style={typingIndicatorStyles.dot(delay)} />
      ))}
    </div>
  );
}
