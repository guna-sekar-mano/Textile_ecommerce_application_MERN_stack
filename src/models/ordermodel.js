import mongoose from "mongoose";
import moment from 'moment-timezone';
import db from "../config/db.js";

const Orderschema = mongoose.Schema({
    Order_id: { type: String, unique: true },
    Order_Date: { type: Date, default: new Date(moment().tz('America/Los_Angeles').format('YYYY-MM-DD')) },
    Billing_Name: String,
    Email: { type: String },
    Mobilenumber: { type: String },
    Delivery_Address: String,
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    Zipcode: { type: String },
    Delivery_Address_id: String,
    Payment_Status: { type: String, default: "Not Paid" },
    Order_Status: { type: String, default: "Payment Pending" },
    Total_Amount: Number,
    Coupon_Discount: { type: Number, default: 0 },
    Shipping_Amount: { type: Number, default: 0 },
    Applied_Coupon: {
      id: String,
      code: String,
      name: String,
      discount_type: String,
      discount_value: Number,
      apply_shipping_discount: String
    },
    shipment_id: Number,
    Payment_Date: { type: Date },
    failed_reason: String,    
    Courier_ID: String,
    Tracking_Link: String
}, { timestamps: true });

const Ordersmasterschema = mongoose.Schema({
    Order_id: { type: String, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    Product_Name: String,
    variant_name: String,
    Images: [String],
    variant_images: [String],
    price: String,
    sale_price: String,
    selectedSize: String,
    Quantity: Number,
    Category: String,
    Subcategory: String,
    Product_type: String,
    tags: String,
}, { timestamps: true });

const Order = db.model('orders', Orderschema);
const Ordermaster = db.model('ordermasters', Ordersmasterschema);

Ordermaster.collection.dropIndexes().catch(err => console.log('No indexes to drop'));

export { Order, Ordermaster };