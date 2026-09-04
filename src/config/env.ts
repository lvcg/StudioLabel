import { config } from "dotenv";

config();

const placeholderTokens = ["your_", "YOUR_", "CLUSTER", "PASSWORD"];

const readSecret = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value || placeholderTokens.some((token) => value.includes(token))) {
    return undefined;
  }

  return value;
};

const parsePort = (value: string | undefined) => {
  const port = Number(value ?? 5000);
  return Number.isInteger(port) && port > 0 ? port : 5000;
};

const readMongoUrl = () => {
  const value = readSecret("MONGODB_URL");

  if (!value) {
    return undefined;
  }

  if (!value.startsWith("mongodb://") && !value.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URL must start with mongodb:// or mongodb+srv://.");
  }

  return value;
};

export const env = {
  mongoUrl: readMongoUrl(),
  port: parsePort(process.env.PORT),
};
