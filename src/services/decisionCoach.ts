import { env } from "../config/env.js";
import type { DecisionDocument } from "../models/Decision.js";

export interface CoachResult {
  summary: string;
  questions: string[];
  risks: string[];
  nextSteps: string[];
}

const fallbackQuestions = [
  "What would need to be true for your preferred option to be the right call?",
  "Which downside would be hardest to recover from?",
  "What information could you gather in the next 24 hours that would change your confidence?",
];

const fallbackRisks = [
  "The decision may be driven by urgency instead of importance.",
  "One option may feel familiar while another has better long-term upside.",
  "The cost of reversing the choice may be underestimated.",
];

const fallbackNextSteps = [
  "Write the smallest test you can run before committing.",
  "Set a review date now so the outcome can be compared with your expectations.",
  "Pick one measurable signal that will tell you whether the choice worked.",
];

const asList = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

  return cleaned.length > 0 ? cleaned : fallback;
};

const fallbackCoach = (decision: DecisionDocument): CoachResult => ({
  summary: `You are weighing ${decision.options
    .map((option) => option.label)
    .join(" vs. ")}. Slow the choice down, name the assumptions, and define what success will look like before you commit.`,
  questions: fallbackQuestions,
  risks: fallbackRisks,
  nextSteps: fallbackNextSteps,
});

export async function coachDecision(decision: DecisionDocument): Promise<CoachResult> {
  if (!env.openaiApiKey) {
    return fallbackCoach(decision);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiModel,
      instructions:
        "You are a calm decision coach. Help the user reason clearly without making the decision for them. Return compact JSON only.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                title: decision.title,
                context: decision.context,
                options: decision.options,
                chosenOption: decision.chosenOption,
                confidence: decision.confidence,
                expectedOutcome: decision.expectedOutcome,
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "decision_coach",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              questions: {
                type: "array",
                items: { type: "string" },
              },
              risks: {
                type: "array",
                items: { type: "string" },
              },
              nextSteps: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["summary", "questions", "risks", "nextSteps"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.output_text ?? data.output?.[0]?.content?.[0]?.text;
  const parsed = JSON.parse(text);

  return {
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : fallbackCoach(decision).summary,
    questions: asList(parsed.questions, fallbackQuestions),
    risks: asList(parsed.risks, fallbackRisks),
    nextSteps: asList(parsed.nextSteps, fallbackNextSteps),
  };
}
