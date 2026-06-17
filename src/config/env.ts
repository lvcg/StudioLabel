import { config } from "dotenv";

config();

const parsePort = (value: string | undefined) => {
  const port = Number(value ?? 5000);
  return Number.isInteger(port) && port > 0 ? port : 5000;
};

export const env = {
  mongoUrl: process.env.MONGODB_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  port: parsePort(process.env.PORT),
};
