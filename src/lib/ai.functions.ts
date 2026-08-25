import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { AI_MODEL, NO_FABRICATION, buildPrompt, createLovableAiGatewayProvider } from "./ai-gateway.server";

const gatewayError = (status: number | undefined, message: string) => {
  if (status === 402) return "The workspace AI credits are exhausted. Add credits in Lovable to keep using the AI tools.";
  if (status === 403) return "Lovable AI is blocked for this workspace. Ask an admin to enable it or lift the credit limit.";
  if (status === 429) return "Too many AI requests right now. Wait a few seconds and try again.";
  if (status && status >= 500) return "The AI service is temporarily unavailable. Please try again.";
  return message || "The AI request failed.";
};

async function run(prompt: string, system: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured: LOVABLE_API_KEY is missing.");
  const gateway = createLovableAiGatewayProvider(key);
  try {
    const result = streamText({ model: gateway(AI_MODEL), system, prompt });
    return { text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ?? (error as { status?: number })?.status;
    throw new Error(gatewayError(status, (error as Error)?.message));
  }
}

const SYSTEM =
  "You are BusinessConnect AI, an assistant inside a South African business discovery and workplace productivity platform. " +
  "Write in clear South African English. Use markdown headings and bullet lists. Never fabricate information.";

/* ---------------------------------- EMAIL --------------------------------- */

const EmailInput = z.object({
  recipient: z.string(),
  purpose: z.string().min(1),
  message: z.string(),
  context: z.string(),
  outcome: z.string(),
  tone: z.string(),
  adjust: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = buildPrompt({
      role: "You are a professional business communication assistant for South African businesses.",
      context: `The user needs to email ${data.recipient || "a recipient (not specified)"}. Additional context: ${data.context || "Not specified."}`,
      userInput: [
        `Purpose: ${data.purpose}`,
        `Main message: ${data.message || "Not specified."}`,
        `Desired outcome: ${data.outcome || "Not specified."}`,
        `Tone: ${data.tone}`,
        data.adjust ? `Adjustment requested: ${data.adjust}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      task: "Write one ready-to-send email in the requested tone.",
      constraints: [
        ...NO_FABRICATION,
        "Do not invent order numbers, dates, amounts, refund policies or staff names.",
        "Use placeholders in square brackets, e.g. [order number], when a needed detail is missing.",
      ],
      outputFormat: "**Subject:** one line\\n\\nThen the email body with greeting, paragraphs and a sign-off. No commentary before or after.",
    });
    return run(prompt, SYSTEM);
  });

/* ------------------------------ MEETING NOTES ----------------------------- */

const NotesInput = z.object({ notes: z.string().min(1) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = buildPrompt({
      role: "You are a meticulous meeting minutes analyst.",
      context: "The user pasted raw meeting notes from a business meeting.",
      userInput: data.notes,
      task: "Summarise the notes and extract only what is explicitly present.",
      constraints: [
        ...NO_FABRICATION,
        "Do not invent action items, deadlines, owners or decisions that are not in the notes.",
        'Where an owner or deadline is absent, write "Not specified."',
      ],
      outputFormat: `Use exactly these markdown headings, in this order:
## Meeting Summary
## Key Decisions
## Action Items
(as a markdown table with columns: Action | Responsible | Deadline)
## Deadlines
## Important Discussion Points
## Follow-up Items
## Risks / Open Questions`,
    });
    return run(prompt, SYSTEM);
  });

/* ------------------------------ TASK PLANNER ------------------------------ */

const PlannerInput = z.object({
  brief: z.string().min(1),
  availableHours: z.string().optional(),
  horizon: z.string().optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = buildPrompt({
      role: "You are a pragmatic work planner for busy small-business owners.",
      context: `Planning horizon: ${data.horizon || "the next working day"}. Stated available hours: ${data.availableHours || "Not specified."}`,
      userInput: data.brief,
      task: "Turn the tasks into a realistic prioritised schedule with time blocks.",
      constraints: [
        ...NO_FABRICATION,
        "Only schedule tasks the user mentioned. Do not assume availability the user did not state.",
        "Flag scheduling conflicts and tasks that could be delegated instead of inventing extra time.",
        "Priority must be one of URGENT, HIGH, MEDIUM, LOW.",
      ],
      outputFormat: `## Schedule
A markdown table with columns: Time | Task | Priority | Duration
## Priority Order
## Conflicts & Risks
## Could Be Delegated
## Assumptions I Made`,
    });
    return run(prompt, SYSTEM);
  });

/* --------------------------------- RESEARCH -------------------------------- */

const ResearchInput = z.object({ topic: z.string().min(1), context: z.string().optional() });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = buildPrompt({
      role: "You are a business research assistant with South African market awareness.",
      context: `User-provided context: ${data.context || "Not specified."} You have no live web access in this session.`,
      userInput: data.topic,
      task: "Produce a structured research briefing.",
      constraints: [
        ...NO_FABRICATION,
        "Do not cite studies, statistics, URLs or reports as sources. Do not fabricate references.",
        "State clearly that the briefing is based on general AI knowledge, not live research.",
        "Separate what the user told you from your own analysis.",
      ],
      outputFormat: `## Topic Overview
## Key Findings
## Important Considerations
## Pros and Cons
## Recommendations
## Practical Next Steps
## Questions To Investigate Further
## Basis Of This Response
(state that this is general AI knowledge, not live research, and what the user supplied)`,
    });
    return run(prompt, SYSTEM);
  });

/* --------------------------------- CHATBOT -------------------------------- */

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
  businessContext: z.string(),
  locationLabel: z.string(),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const transcript = data.messages.map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`).join("\n\n");
    const prompt = buildPrompt({
      role: "You are BusinessConnect AI, an assistant for finding South African businesses and for workplace tasks.",
      context: `The user's selected location is ${data.locationLabel}. The platform also has AI tools the user can be pointed to: Smart Email Generator (/workplace/email), Meeting Notes Summarizer (/workplace/notes), Task Planner (/workplace/planner), Research Assistant (/workplace/research), and business search (/explore).`,
      userInput: transcript,
      task: "Reply to the last user message. If it is a business search, answer using ONLY the businesses in the available platform data, naming them and their suburb, city and distance where given. If it is a workplace task, help directly and mention which platform tool does it best.",
      constraints: [
        ...NO_FABRICATION,
        "NEVER mention a business that is not listed in the available platform data. If the list is empty, say no matching businesses are listed yet and suggest widening the radius, a nearby city, a province search or a national search.",
        "All listed businesses are clearly-labelled fictional demonstration data; do not present them as verified real companies.",
        "Keep replies under 250 words unless the user asks for more.",
      ],
      availableData: data.businessContext || "(no businesses matched this request)",
      outputFormat: "Short markdown answer. When listing businesses use bullets: **Name** — service, suburb, city, distance, rating.",
    });
    return run(prompt, SYSTEM);
  });

/* ------------------------- BUSINESS PROFILE BUILDER ------------------------ */

const ProfileInput = z.object({ description: z.string().min(1), name: z.string().optional(), location: z.string().optional() });

export const generateBusinessProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = buildPrompt({
      role: "You are a business listing copywriter and taxonomist for a South African directory.",
      context: `Business name: ${data.name || "Not specified."} Location: ${data.location || "Not specified."}`,
      userInput: data.description,
      task: "Draft listing content for the owner to review, edit and approve before publishing.",
      constraints: [
        ...NO_FABRICATION,
        "Do not invent qualifications, certifications, awards, years in business, prices or areas served.",
        "Only derive services from what the owner described.",
      ],
      outputFormat: `## Short Description
(one sentence, max 25 words)
## Full Description
(2 short paragraphs)
## Primary Category
## Secondary Category
## Services
## Search Keywords
## Suggested Tags
## FAQs
(3 questions with answers based only on what was described)`,
    });
    return run(prompt, SYSTEM);
  });
