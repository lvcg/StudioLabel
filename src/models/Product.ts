import { Schema, model } from "mongoose";

export type ProductType = "candle" | "skincare" | "soap";
export interface ProductDocument {
  name: string; type: ProductType; variant?: string; netContents?: string;
  description?: string; ingredients: string[]; warnings: string[]; barcode?: string;
  businessName?: string; website?: string; location?: string;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["candle", "skincare", "soap"], required: true },
  variant: { type: String, trim: true }, netContents: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 110 },
  ingredients: { type: [String], default: [] }, warnings: { type: [String], default: [] },
  barcode: { type: String, trim: true }, businessName: { type: String, trim: true },
  website: { type: String, trim: true }, location: { type: String, trim: true },
}, { timestamps: true });

export const Product = model<ProductDocument>("Product", productSchema);
