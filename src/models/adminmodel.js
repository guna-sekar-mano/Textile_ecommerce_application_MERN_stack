import mongoose from "mongoose";
import db from "../config/db.js";

const AdminSchema = mongoose.Schema({
    Username : String,
    Email: String,
    Password : String,
    Role : {type:String,default:"Admin"},
    Status : { type: String, default: 'Active' }
},{timestamps:true})
const Admin = db.model('admins',AdminSchema)
export default Admin
