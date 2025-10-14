import mongoose from 'mongoose'
import db from '../config/db.js'

const Customerschema = mongoose.Schema({
  First_Name: String,
  Last_Name: String,
  Email: String,
  Password: String,
  Mobilenumber: String,
  Role: { type: String, default: 'Customer' },
  OTP: String,
  Status: { type: String, default: 'Inactive' }
})
const shipingschema = mongoose.Schema(
  {
    First_Name: String,
    Last_Name: String,
    Address_Type: { type: String, default: 'Home' },
    Email: String,
    Mobilenumber: String,
    Address: String,
    City: String,
    State : String,
    Country: String,
    Zipcode: String
  },
  { timestamps: true }
)
const Customer = db.model('customers', Customerschema)
const Shiping = db.model('shippings', shipingschema)
export { Customer, Shiping }