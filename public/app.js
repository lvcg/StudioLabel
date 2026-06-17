const state = {
  decisions: [],
  selectedId: null,
};

const elements = {
  list: document.querySelector("#decisionList"),
  form: document.querySelector("#decisionForm"),
  formTitle: document.querySelector("#formTitle"),
  statusPill: document.querySelector("#statusPill"),
  title: document.querySelector("#title"),
  context: document.querySelector("#context"),
  optionA: document.querySelector("#optionA"),
  optionB: document.querySelector("#optionB"),
  expectedOutcome: document.querySelector("#expectedOutcome"),
  confidence: document.querySelector("#confidence"),
  reviewDate: document.querySelector("#reviewDate"),
  chosenOption: document.querySelector("#chosenOption"),
  coachButton: document.querySelector("#coachButton"),
  coachSummary: document.querySelector("#coachSummary"),
  questionsList: document.querySelector("#questionsList"),
  risksList: document.querySelector("#risksList"),
  nextStepsList: document.querySelector("#nextStepsList"),
  reviewForm: document.querySelector("#reviewForm"),
  actualOutcome: document.querySelector("#actualOutcome"),
  lessons: document.querySelector("#lessons"),
  totalCount: document.querySelector("#totalCount"),
  decidedCount: document.querySelector("#decidedCount"),
  reviewedCount: document.querySelector("#reviewedCount"),
  newDecisionButton: document.querySelector("#newDecisionButton"),
  refreshButton: document.querySelector("#refreshButton"),
  toast: document.querySelector("#toast"),
};

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const showToast = (message) => {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.setTimeout(() => elements.toast.classList.remove("visible"), 2600);
};

const formatDate = (value) => {
  if (!value) {
    return "No review date";
  }

  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(value)
  );
};

const formatDateInput = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

const renderList = () => {
  elements.list.innerHTML = "";
  elements.totalCount.textContent = state.decisions.length;
  elements.decidedCount.textContent = state.decisions.filter(
    (decision) => decision.status === "decided"
  ).length;
  elements.reviewedCount.textContent = state.decisions.filter(
    (decision) => decision.status === "reviewed"
  ).length;

  if (state.decisions.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No decisions yet.";
    elements.list.append(empty);
    return;
  }

  state.decisions.forEach((decision) => {
    const button = document.createElement("button");
    const title = document.createElement("h3");
    const meta = document.createElement("div");
    const status = document.createElement("span");
    const review = document.createElement("span");

    button.type = "button";
    button.className = `decision-card${decision._id === state.selectedId ? " active" : ""}`;
    title.textContent = decision.title;
    meta.className = "decision-meta";
    status.textContent = decision.status;
    review.textContent = formatDate(decision.reviewDate);
    meta.append(status, review);
    button.append(title, meta);
    button.addEventListener("click", () => selectDecision(decision._id));
    elements.list.append(button);
  });
};

const setList = (target, items) => {
  target.innerHTML = "";
  if (!items || items.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nothing captured yet.";
    target.append(item);
    return;
  }

  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    target.append(item);
  });
};

const setChosenOptions = (decision) => {
  const options = [
    { value: "", label: "Undecided" },
    ...(decision?.options ?? []).map((option) => ({
      value: option.label,
      label: option.label,
    })),
  ];

  elements.chosenOption.innerHTML = "";
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    elements.chosenOption.append(element);
  });
};

const clearForm = () => {
  state.selectedId = null;
  elements.form.reset();
  elements.reviewForm.reset();
  setChosenOptions(null);
  elements.formTitle.textContent = "Capture the choice";
  elements.statusPill.textContent = "Draft";
  elements.statusPill.className = "status-pill";
  elements.coachSummary.textContent = "Save a decision, then run a coaching pass.";
  setList(elements.questionsList, []);
  setList(elements.risksList, []);
  setList(elements.nextStepsList, []);
  renderList();
};

const fillForm = (decision) => {
  state.selectedId = decision._id;
  elements.formTitle.textContent = decision.title;
  elements.statusPill.textContent = decision.status;
  elements.statusPill.className = `status-pill ${decision.status}`;
  elements.title.value = decision.title ?? "";
  elements.context.value = decision.context ?? "";
  elements.optionA.value = decision.options?.[0]?.label ?? "";
  elements.optionB.value = decision.options?.[1]?.label ?? "";
  elements.expectedOutcome.value = decision.expectedOutcome ?? "";
  elements.confidence.value = decision.confidence ?? "";
  elements.reviewDate.value = formatDateInput(decision.reviewDate);
  setChosenOptions(decision);
  elements.chosenOption.value = decision.chosenOption ?? "";
  elements.actualOutcome.value = decision.actualOutcome ?? "";
  elements.lessons.value = decision.lessons ?? "";
  elements.coachSummary.textContent = decision.coachSummary || "Run a coaching pass.";
  setList(elements.questionsList, decision.coachQuestions);
  setList(elements.risksList, decision.risks);
  setList(elements.nextStepsList, decision.nextSteps);
  renderList();
};

const selectDecision = (id) => {
  const decision = state.decisions.find((item) => item._id === id);
  if (decision) {
    fillForm(decision);
  }
};

const loadDecisions = async () => {
  state.decisions = await api("/api/decisions");
  if (state.selectedId) {
    const current = state.decisions.find((decision) => decision._id === state.selectedId);
    if (current) {
      fillForm(current);
      return;
    }
  }

  if (state.decisions[0]) {
    fillForm(state.decisions[0]);
  } else {
    clearForm();
  }
};

const getFormPayload = () => ({
  title: elements.title.value,
  context: elements.context.value,
  options: [{ label: elements.optionA.value }, { label: elements.optionB.value }],
  expectedOutcome: elements.expectedOutcome.value,
  confidence: elements.confidence.value,
  reviewDate: elements.reviewDate.value,
  chosenOption: elements.chosenOption.value,
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = getFormPayload();

  try {
    const decision = state.selectedId
      ? await api(`/api/decisions/${state.selectedId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await api("/api/decisions", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    state.selectedId = decision._id;
    await loadDecisions();
    showToast("Decision saved.");
  } catch (error) {
    showToast(error.message);
  }
});

elements.coachButton.addEventListener("click", async () => {
  if (!state.selectedId) {
    showToast("Save a decision first.");
    return;
  }

  elements.coachButton.disabled = true;
  elements.coachButton.textContent = "Thinking";

  try {
    const decision = await api(`/api/decisions/${state.selectedId}/coach`, { method: "POST" });
    const index = state.decisions.findIndex((item) => item._id === decision._id);
    if (index >= 0) {
      state.decisions[index] = decision;
    }
    fillForm(decision);
    showToast("Coach pass saved.");
  } catch (error) {
    showToast(error.message);
  } finally {
    elements.coachButton.disabled = false;
    elements.coachButton.textContent = "Coach Me";
  }
});

elements.reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedId) {
    showToast("Choose a decision first.");
    return;
  }

  try {
    const decision = await api(`/api/decisions/${state.selectedId}/review`, {
      method: "POST",
      body: JSON.stringify({
        actualOutcome: elements.actualOutcome.value,
        lessons: elements.lessons.value,
      }),
    });
    const index = state.decisions.findIndex((item) => item._id === decision._id);
    if (index >= 0) {
      state.decisions[index] = decision;
    }
    fillForm(decision);
    showToast("Review saved.");
  } catch (error) {
    showToast(error.message);
  }
});

elements.newDecisionButton.addEventListener("click", clearForm);
elements.refreshButton.addEventListener("click", () => {
  loadDecisions().then(() => showToast("Decisions refreshed.")).catch((error) => showToast(error.message));
});

loadDecisions().catch((error) => showToast(error.message));
