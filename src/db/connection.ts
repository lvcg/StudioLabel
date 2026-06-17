import { connect, disconnect } from "mongoose";
import { env } from "../config/env.js";

async function connectToDatabase() {
    if (!env.mongoUrl) {
        throw new Error("MONGODB_URL is required. Add a real value to your local .env file.");
    }

    try {
        await connect(env.mongoUrl);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Could not connect to MongoDB");
    }
}

async function disconnectFromDatabase() {
    try {
        await disconnect();
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
        throw new Error("Could not disconnect from MongoDB");
    }
}

export { connectToDatabase, disconnectFromDatabase };
