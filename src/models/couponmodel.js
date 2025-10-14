import mongoose from 'mongoose'
import db from '../config/db.js'

const Couponschema = mongoose.Schema({
    Coupon_Name: String,
    Coupon_Code: String,
    Coupon_Type: {type: String, enum: ['Public', 'Private'],default: 'Public'},
    Target_Users: {type: String, enum: ['First_Time_Users', 'All_Users']},
    Minimum_Amount: Number,
    Discount_Type: String,
    Flat_Discount: Number,
    Flat_Percentage : Number,
    Customer : Array,
    Valid_From: Date,
    Valid_To: Date,
    Total_Usage_Limit: Number,
    Used_By_Customers: [{
        email: String,
        used_date: { type: Date, default: Date.now },
        order_id: String
    }],
    Status: { type: String, default: 'Inactive' }
})

const Coupon = db.model('Coupons', Couponschema)
export { Coupon }