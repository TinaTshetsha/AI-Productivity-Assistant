import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const AI_MODEL = "google/gemini-2.5-flash";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

/** Shared structured-prompt scaffold: ROLE / CONTEXT / TASK / CONSTRAINTS / OUTPUT / VALIDATION. */
export function buildPrompt(parts: {
  role: string;
  context: string;
  userInput: string;
  task: string;
  constraints: string[];
  availableData?: string;
  outputFormat: string;
}) {
  return [
    `ROLE:\n${parts.role}`,
    `CONTEXT:\n${parts.context}`,
    `USER INPUT:\n${parts.userInput}`,
    `TASK:\n${parts.task}`,
    `CONSTRAINTS:\n${parts.constraints.map((c) => `- ${c}`).join("\n")}`,
    parts.availableData ? `AVAILABLE PLATFORM DATA (the only businesses you may mention):\n${parts.availableData}` : null,
    `OUTPUT FORMAT:\n${parts.outputFormat}`,
    `VALIDATION:\nBefore answering, re-check that every fact you state is present in the user input or the available platform data. If something is missing, write "Not specified." Never invent businesses, people, prices, dates, contact details or sources.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export const NO_FABRICATION = [
  "Never invent facts, names, numbers, dates, prices, contact details or sources.",
  'If a detail is not supplied, write "Not specified." instead of guessing.',
  "Do not claim to have browsed the web or accessed live data.",
];
