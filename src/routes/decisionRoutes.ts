import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { coachDecision } from "../services/decisionCoach.js";
import { Decision } from "../models/Decision.js";

const router = Router();

const toOptions = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((option) => ({
      label: String(option?.label ?? "").trim(),
      notes: String(option?.notes ?? "").trim(),
    }))
    .filter((option) => option.label);
};

const toConfidence = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const confidence = Number(value);
  return Number.isFinite(confidence) ? Math.max(0, Math.min(100, confidence)) : undefined;
};

const getDecision = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  return Decision.findById(id);
};

router.get("/", async (_request, response, next) => {
  try {
    const decisions = await Decision.find().sort({ updatedAt: -1 });
    response.json(decisions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const decision = await getDecision(request.params.id);
    if (!decision) {
      response.status(404).json({ message: "Decision not found." });
      return;
    }

    response.json(decision);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const title = String(request.body.title ?? "").trim();
    const context = String(request.body.context ?? "").trim();
    const options = toOptions(request.body.options);

    if (!title || !context || options.length < 2) {
      response.status(400).json({
        message: "Title, context, and at least two options are required.",
      });
      return;
    }

    const decision = await Decision.create({
      title,
      context,
      options,
      confidence: toConfidence(request.body.confidence),
      expectedOutcome: String(request.body.expectedOutcome ?? "").trim(),
      reviewDate: request.body.reviewDate ? new Date(request.body.reviewDate) : undefined,
    });

    response.status(201).json(decision);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (request, response, next) => {
  try {
    const decision = await getDecision(request.params.id);
    if (!decision) {
      response.status(404).json({ message: "Decision not found." });
      return;
    }

    if (request.body.title !== undefined) {
      decision.title = String(request.body.title).trim();
    }
    if (request.body.context !== undefined) {
      decision.context = String(request.body.context).trim();
    }
    if (request.body.options !== undefined) {
      decision.options = toOptions(request.body.options);
    }
    if (request.body.chosenOption !== undefined) {
      decision.chosenOption = String(request.body.chosenOption).trim();
      decision.status = "decided";
      decision.decisionDate = new Date();
    }
    if (request.body.confidence !== undefined) {
      decision.confidence = toConfidence(request.body.confidence);
    }
    if (request.body.expectedOutcome !== undefined) {
      decision.expectedOutcome = String(request.body.expectedOutcome).trim();
    }
    if (request.body.reviewDate !== undefined) {
      decision.reviewDate = request.body.reviewDate ? new Date(request.body.reviewDate) : undefined;
    }

    await decision.save();
    response.json(decision);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/coach", async (request, response, next) => {
  try {
    const decision = await getDecision(request.params.id);
    if (!decision) {
      response.status(404).json({ message: "Decision not found." });
      return;
    }

    const result = await coachDecision(decision);
    decision.coachSummary = result.summary;
    decision.coachQuestions = result.questions;
    decision.risks = result.risks;
    decision.nextSteps = result.nextSteps;
    await decision.save();

    response.json(decision);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/review", async (request, response, next) => {
  try {
    const decision = await getDecision(request.params.id);
    if (!decision) {
      response.status(404).json({ message: "Decision not found." });
      return;
    }

    decision.actualOutcome = String(request.body.actualOutcome ?? "").trim();
    decision.lessons = String(request.body.lessons ?? "").trim();
    decision.status = "reviewed";
    await decision.save();

    response.json(decision);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const decision = await getDecision(request.params.id);
    if (!decision) {
      response.status(404).json({ message: "Decision not found." });
      return;
    }

    await decision.deleteOne();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
