import { useMemo } from "react";

import { useCalculatorFlow } from "@/application/useCalculatorFlow";
import { useChat } from "@/application/useChat";
import { useReferenceData } from "@/application/useReferenceData";
import type { Stage } from "@/domain/types";
import { HttpApiClient } from "@/infrastructure/api/HttpApiClient";
import { pageStyles, stageStyles } from "@/styles/layout.styles";

import { CalculatingState } from "./components/CalculatingState";
import { CalculatorForm } from "./components/CalculatorForm";
import { CONTRACT_OPTIONS } from "./components/contractOptions";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { IntroPanel } from "./components/IntroPanel";
import { ResultSection } from "./components/ResultSection";

const STAGE_MAX_WIDTH: Record<Stage, string> = {
  intro: "720px",
  form: "1000px",
  calc: "720px",
  result: "1240px",
};

export default function App() {
  // Composition root: l'unica implementazione concreta della porta ApiClient viene
  // costruita qui e passata giù agli hook — nessun altro punto dell'app sa che dietro
  // c'è `fetch`.
  const api = useMemo(() => new HttpApiClient(), []);
  const reference = useReferenceData(api);
  const flow = useCalculatorFlow(api, reference);
  const chat = useChat(api, flow.form);

  async function handleCalculate() {
    const outcome = await flow.calculate();
    if (outcome) chat.seedFirstMessage();
  }

  return (
    <div style={pageStyles}>
      <Header />
      <Hero />

      <section id="jet-stage" style={stageStyles.section}>
        <div style={stageStyles.widthWrapper(STAGE_MAX_WIDTH[flow.stage])}>
          <div style={stageStyles.card}>
            {flow.stage === "intro" && <IntroPanel onStart={flow.goToForm} />}

            {flow.stage === "form" && (
              <CalculatorForm
                form={flow.form}
                reference={reference}
                contractOptions={CONTRACT_OPTIONS}
                calcError={flow.calcError}
                onChange={flow.setField}
                onChangeRegione={flow.setRegione}
                onBack={flow.backToIntro}
                onSubmit={handleCalculate}
              />
            )}

            {flow.stage === "calc" && <CalculatingState />}

            {flow.stage === "result" && flow.result && (
              <ResultSection
                breakdown={flow.result}
                form={flow.form}
                onEdit={flow.backToForm}
                chatMessages={chat.messages}
                chatTyping={chat.typing}
                chatDraft={chat.draft}
                onChatDraftChange={chat.setDraft}
                onAsk={chat.ask}
              />
            )}
          </div>
          <p style={stageStyles.disclaimer}>
            Stima indicativa a scopo informativo: non sostituisce il cedolino elaborato dal tuo consulente del lavoro.
          </p>
        </div>
      </section>

      <HowItWorks />
      <Faq />
      <Footer />
    </div>
  );
}
