import mongoose from "mongoose";
import db from "../config/db.js";

const WishlistSchema = mongoose.Schema({
    Email: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    variantName: { type: String, default: null },
    
    Product_Name: String,
    Category: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }, 
    Subcategory: String,   
    Images: [String],
    description: String,
    material_care: String,
    tags: String,
    sizes: [{ type: mongoose.Schema.Types.Mixed }],
    gender: String,
    Product_type: String,
    price: String,
    sale_price: String,
    cost_price: String,
    is_popular_products: { type: Boolean, default: false },
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
        sizes: [{
            type: mongoose.Schema.Types.Mixed
        }],
        price: String,
        sale_price: String,
        cost_price: String,
        stock: { type: String, default: 'Inactive' },
        status: { type: String, default: 'Active' },
        _id: { type: mongoose.Schema.Types.ObjectId }
    }]
}, { timestamps: true });

const Wishlist = db.model('wishlist', WishlistSchema);
export default Wishlist;