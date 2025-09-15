import mongoose from 'mongoose'
import db from '../config/db.js'

const Categoryschema = mongoose.Schema({
    Images: [String],
    Category_Name: String,
    redirect_link: String,
    Status: { type: String, default: 'Inactive' }
})
const Category = db.model('categories', Categoryschema)
export { Category }
