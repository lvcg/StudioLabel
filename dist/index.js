import app from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase } from "./db/connection.js";
connectToDatabase()
    .then(() => {
    app.listen(env.port, () => console.log(`StudioLabel running on http://localhost:${env.port}`));
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map