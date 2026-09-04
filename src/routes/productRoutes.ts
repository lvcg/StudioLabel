import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Product } from "../models/Product.js";

const router = Router();
const cleanList = (value: unknown) => Array.isArray(value) ? value.map(String).map(x => x.trim()).filter(Boolean) : [];
const payload = (body: Record<string, unknown>) => ({
  name: String(body.name ?? "").trim(), type: String(body.type ?? "candle"),
  variant: String(body.variant ?? "").trim(), netContents: String(body.netContents ?? "").trim(),
  description: String(body.description ?? "").trim(), ingredients: cleanList(body.ingredients),
  warnings: cleanList(body.warnings), barcode: String(body.barcode ?? "").replace(/\D/g, ""),
  businessName: String(body.businessName ?? "").trim(), website: String(body.website ?? "").trim(),
  location: String(body.location ?? "").trim(),
});

router.get("/", async (_req, res, next) => { try { res.json(await Product.find().sort({ updatedAt: -1 })); } catch (e) { next(e); } });
router.post("/", async (req, res, next) => { try { const data = payload(req.body); if (!data.name) return res.status(400).json({ message: "Product name is required." }); res.status(201).json(await Product.create(data)); } catch (e) { next(e); } });
router.patch("/:id", async (req, res, next) => { try { if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Label not found." }); const item = await Product.findByIdAndUpdate(req.params.id, payload(req.body), { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: "Label not found." }); res.json(item); } catch (e) { next(e); } });
router.delete("/:id", async (req, res, next) => { try { if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Label not found." }); await Product.findByIdAndDelete(req.params.id); res.status(204).send(); } catch (e) { next(e); } });

export default router;
