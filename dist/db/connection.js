import { connect, disconnect } from "mongoose";
import { env } from "../config/env.js";
async function connectToDatabase() {
    if (!env.mongoUrl) {
        console.log("MONGODB_URL not configured; running in browser-storage demo mode.");
        return;
    }
    try {
        await connect(env.mongoUrl);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Could not connect to MongoDB");
    }
}
async function disconnectFromDatabase() {
    try {
        await disconnect();
    }
    catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
        throw new Error("Could not disconnect from MongoDB");
    }
}
export { connectToDatabase, disconnectFromDatabase };
//# sourceMappingURL=connection.js.map