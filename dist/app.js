import express from "express";
import path from "node:path";
import productRoutes from "./routes/productRoutes.js";
const app = express();
const publicPath = path.join(process.cwd(), "public");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicPath));
app.get("/api/health", (_request, response) => {
    response.json({ ok: true, app: "StudioLabel Product Label Generator" });
});
app.use("/api/products", productRoutes);
app.get("*", (_request, response) => {
    response.sendFile(path.join(publicPath, "index.html"));
});
app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
        message: error.message || "Something went wrong.",
    });
});
export default app;
//# sourceMappingURL=app.js.map