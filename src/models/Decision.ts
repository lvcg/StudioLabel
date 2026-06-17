import { Schema, model } from "mongoose";

export type DecisionStatus = "draft" | "decided" | "reviewed";

export interface DecisionOption {
  label: string;
  notes?: string;
}

export interface DecisionDocument {
  title: string;
  context: string;
  options: DecisionOption[];
  status: DecisionStatus;
  chosenOption?: string;
  confidence?: number;
  decisionDate?: Date;
  reviewDate?: Date;
  expectedOutcome?: string;
  actualOutcome?: string;
  lessons?: string;
  coachSummary?: string;
  coachQuestions: string[];
  risks: string[];
  nextSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const decisionOptionSchema = new Schema<DecisionOption>(
  {
    label: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const decisionSchema = new Schema<DecisionDocument>(
  {
    title: { type: String, required: true, trim: true },
    context: { type: String, required: true, trim: true },
    options: {
      type: [decisionOptionSchema],
      validate: {
        validator: (options: DecisionOption[]) => options.length >= 2,
        message: "Add at least two options for a decision.",
      },
    },
    status: {
      type: String,
      enum: ["draft", "decided", "reviewed"],
      default: "draft",
    },
    chosenOption: { type: String, trim: true },
    confidence: { type: Number, min: 0, max: 100 },
    decisionDate: Date,
    reviewDate: Date,
    expectedOutcome: { type: String, trim: true },
    actualOutcome: { type: String, trim: true },
    lessons: { type: String, trim: true },
    coachSummary: { type: String, trim: true },
    coachQuestions: { type: [String], default: [] },
    risks: { type: [String], default: [] },
    nextSteps: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Decision = model<DecisionDocument>("Decision", decisionSchema);
