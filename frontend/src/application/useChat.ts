import { useCallback, useState } from "react";

import type { ApiClient } from "@/application/ports/ApiClient";
import type { ChatMessage, FormState } from "@/domain/types";

function fallbackText(error: unknown, prefix: string): string {
  const message = error instanceof Error ? error.message : "servizio non disponibile";
  return `${prefix} (${message}).`;
}

/** Chat multi-turno ma stateless lato server (vedi BUSINESS_RULES.md, sezione 5):
 * questo hook tiene lo storico in memoria e lo rinvia per intero ad ogni domanda. */
export function useChat(api: ApiClient, form: FormState) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const requestReply = useCallback(
    async (conversation: ChatMessage[], onErrorPrefix: string) => {
      setTyping(true);
      try {
        const { explanation } = await api.explain(form, conversation);
        setMessages((prev) => [...prev, { id: `j${Date.now()}`, role: "assistant", text: explanation }]);
      } catch (error) {
        setMessages((prev) => [...prev, { id: `jerr${Date.now()}`, role: "assistant", text: fallbackText(error, onErrorPrefix) }]);
      } finally {
        setTyping(false);
      }
    },
    [api, form],
  );

  /** Da chiamare subito dopo un nuovo calcolo: azzera la chat e chiede una prima
   * spiegazione generale (cronologia vuota). */
  const seedFirstMessage = useCallback(() => {
    setMessages([]);
    void requestReply([], "I tuoi numeri sono qui sopra. Non riesco però a generare una spiegazione al momento");
  }, [requestReply]);

  const ask = useCallback(
    (text: string) => {
      const question = text.trim();
      if (!question) return;
      setDraft("");
      // Nota: la chiamata di rete resta FUORI dall'updater di setMessages di proposito.
      // React 18 Strict Mode invoca due volte, in sviluppo, ogni updater funzionale
      // passato a setState per scovare effetti collaterali non puri — se requestReply
      // fosse chiamato da dentro l'updater partirebbe due volte per una sola domanda
      // (ed è esattamente il bug che c'era prima di questo commento).
      const conversation = [...messages, { id: `u${Date.now()}`, role: "user" as const, text: question }];
      setMessages(conversation);
      void requestReply(conversation, "Non riesco a risponderti al momento");
    },
    [messages, requestReply],
  );

  return { messages, typing, draft, setDraft, ask, seedFirstMessage };
}
