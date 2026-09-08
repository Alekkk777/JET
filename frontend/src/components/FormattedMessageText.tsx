import { Fragment, type ReactNode } from "react";

import { chatBubbleStyles } from "@/styles/chat.styles";

/**
 * Rende leggibile in una bolla di chat stretta il testo del chatbot, che a volte usa
 * comunque un po' di markdown (**grassetto**, elenchi puntati/numerati) nonostante le
 * istruzioni nel system prompt. Supporta solo il sottoinsieme che ha senso in una
 * bolla stretta: paragrafi, grassetto, elenchi. Titoli, tabelle e linee separatrici
 * (che il prompt chiede di non usare, ma un modello può comunque produrre) vengono
 * degradati a testo semplice invece di mostrare i simboli grezzi (`##`, `|`, `---`).
 */

type Block = { kind: "paragraph"; text: string } | { kind: "list"; items: string[] };

const RULE_LINE = /^[-*_]{3,}$/;
const TABLE_SEPARATOR_LINE = /^\|?[\s:-]+\|[\s:|-]*$/;
const LIST_MARKER = /^(?:[-*]|\d+\.)\s+(.*)$/;
const HEADING_MARKER = /^#{1,6}\s*/;
const BOLD_SEGMENT = /(\*\*[^*]+\*\*)/g;

function degradeTableRow(line: string): string {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean)
    .join(" · ");
}

function toBlocks(rawText: string): Block[] {
  const blocks: Block[] = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push({ kind: "list", items: currentListItems });
      currentListItems = [];
    }
  };

  for (const rawLine of rawText.split("\n")) {
    const line = rawLine.trim();
    if (!line || RULE_LINE.test(line) || TABLE_SEPARATOR_LINE.test(line)) continue;

    const listMatch = LIST_MARKER.exec(line);
    if (listMatch) {
      currentListItems.push(listMatch[1]);
      continue;
    }
    flushList();

    const withoutHeading = line.replace(HEADING_MARKER, "");
    const text = withoutHeading.includes("|") ? degradeTableRow(withoutHeading) : withoutHeading;
    blocks.push({ kind: "paragraph", text });
  }
  flushList();

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  return text.split(BOLD_SEGMENT).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function FormattedMessageText({ text }: { text: string }) {
  const blocks = toBlocks(text);
  return (
    <div style={chatBubbleStyles.textBlocks}>
      {blocks.map((block, index) =>
        block.kind === "list" ? (
          <ul key={index} style={chatBubbleStyles.list}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ))}
          </ul>
        ) : (
          <p key={index} style={chatBubbleStyles.paragraph}>
            {renderInline(block.text)}
          </p>
        ),
      )}
    </div>
  );
}
