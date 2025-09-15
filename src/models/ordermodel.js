import mongoose from "mongoose";
import moment from 'moment-timezone';
import db from "../config/db.js";

const Orderschema = mongoose.Schema({
    Order_id: { type: String, unique: true },
    Order_Date: { type: Date, default: moment().tz('Asia/Kolkata').format('YYYY-MM-DD') },
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
    shipment_id: Number,
    Payment_Date: {type: Date},
}, { timestamps: true });

const Ordersmasterschema = mongoose.Schema({
    Order_id: { type: String, index: true },
    First_Name: { type: String },
    Book_Name: String,
    Book_image: [String],
    Regular_Price: String,
    Discount: String,
    Sale_Price: String,
    Quantity: Number,
    
}, { timestamps: true });


const Order = db.model('orders', Orderschema);
const Ordermaster = db.model('ordermasters', Ordersmasterschema);

// Ensure indexes are correct
Ordermaster.collection.dropIndexes().catch(err => console.log('No indexes to drop'));

export { Order, Ordermaster };