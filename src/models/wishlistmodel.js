import mongoose from "mongoose";
import db from "../config/db.js";

const WishlistSchema = mongoose.Schema({
    Email: { type: String, required: true },
    productId: { type: String},
    variantId: { type: String },
    variantName: { type: String },
    Product_Name: String,
    Category: String,
    Subcategory: String,
    Images: [String],
    description: String,
    material_care: String,
    tags: String,
    sizes: [String],
    gender: String,
    Product_type: String,
    sale_price: String,
    discount: String,
    discounted_sale_price: String,
    stock: { type: String, default: 'Inactive' },
    status: { type: String, default: 'Active' },
    variants: [{
        variant_name: String,
        variant_images: [String],
        description: String,
        material_care: String,
        gender: String,
        Product_type: String,
        tags: String,
        sizes: [String],
        sale_price: String,
        discount: String,
        discounted_sale_price: String,
        stock: { type: String, default: 'Inactive' },
        status: { type: String, default: 'Active' }
    }]
},{timestamps:true})

const Wishlist = db.model('wishlist',WishlistSchema)
export default Wishlist