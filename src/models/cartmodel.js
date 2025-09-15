import mongoose from "mongoose";
import db from "../config/db.js";

const Cartschema = mongoose.Schema({
    Email: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, 
    Quantity: { type: Number, default: 1 },
    selectedSize: { type: String, required: true },
    variantId: { type: String, default: null },
  }, { timestamps: true });
  
  const Cart = db.model('carts', Cartschema)
export { Cart }