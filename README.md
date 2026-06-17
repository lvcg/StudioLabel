# Decide Well

Decide Well is a small AI Decision Journal. It helps you capture a decision, compare options, ask better questions, commit with a confidence score, and review the outcome later.

## What it does

- Saves decision records in MongoDB.
- Tracks options, expected outcomes, confidence, chosen option, and review dates.
- Generates an AI coaching pass with questions, risks, and next steps.
- Lets you close the loop with actual outcomes and lessons learned.
- Serves a simple dashboard from the Express app.

## Tech stack

- Node.js
- TypeScript
- Express
- MongoDB and Mongoose
- OpenAI Responses API
- Static HTML, CSS, and JavaScript frontend

## Setup

```bash
npm install
cp .env.example .env
npm run build
npm start
```

Then open `http://localhost:5000`.

The app requires `MONGODB_URL`. `OPENAI_API_KEY` is optional for local testing; without it, the coach returns built-in decision prompts.

## Development

```bash
npm run dev
```

## Environment variables

```bash
MONGODB_URL=mongodb://127.0.0.1:27017/ai-decision-journal
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
PORT=5000
```
