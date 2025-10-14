// import mongoose from "mongoose";
// import db from "../config/db.js";

// const ProductsSchema = mongoose.Schema({
//     Product_Name: String,
//     Category: String,
//     category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }, 
//     Subcategory: String,   
//     Images: [String],
//     description: String,
//     material_care: String,
//     tags: String,
//    sizes: [{
//             type: mongoose.Schema.Types.Mixed
//         }],
//     gender: String,
//     Product_type: String,
//     price: String,
//     sale_price: String,
//     cost_price: String,
//     is_popular_products: { type: Boolean, default: false },
//     stock: { type: String, default: 'Inactive' },
//     status: { type: String, default: 'Active' },
//     variants: [{
//         variant_name: String,
//         variant_images: [String],
//         description: String,
//         material_care: String,
//         gender: String,
//         Product_type: String,
//         tags: String,
//        sizes: [{
//             type: mongoose.Schema.Types.Mixed
//         }],
//         price: String,
//         sale_price: String,
//         cost_price: String,
//         stock: { type: String, default: 'Inactive' },
//         status: { type: String, default: 'Active' }
//     }]
// },{timestamps:true})
// const Products = db.model('products',ProductsSchema)
// export default Products

import mongoose from "mongoose";
import db from "../config/db.js";

const ProductsSchema = mongoose.Schema({
    Product_Name: String,
    Category: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }, 
    Subcategory: String,   
    // Images: [String],
    description: String,
    material_care: String,
    tags: String,
    // sizes: [{ type: mongoose.Schema.Types.Mixed }],
    gender: String,
    Product_type: String,
    // price: String,
    // sale_price: String,
    // cost_price: String,
    is_popular_products: { type: Boolean, default: false },
    stock: { type: String, default: 'Inactive' },
    status: { type: String, default: 'Active' },
    sale_date_from: Date,
    sale_date_to: Date,
    Router_Link: String,
    variants: [{
        // Stock: Number,
        SKU: String,
        variant_color: String,
        variant_color_code: String,
        variant_name: String,
        variant_images: [String],
        description: String,
        material_care: String,
        gender: String,
        Product_type: String,
        tags: String,
        sizes: [{
            size: String,
            price: String,
            sale_price: String,
            cost_price: String,
            Stock: Number
        }],
        price: String,
        sale_price: String,
        cost_price: String,
        stock: { type: String, default: 'Inactive' },
        status: { type: String, default: 'Active' }
    }]
},{timestamps:true})
const Products = db.model('products',ProductsSchema)
export default Products
