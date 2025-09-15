import mongoose from 'mongoose'
import db from '../config/db.js'

const Hookupsschema = mongoose.Schema({
  Category: String,
  Subcategory: String,
  tags: String,
  sizes: String,
  gender: String,
  Product_type: String,
  Header_menu: String,
  main_title: String,
  subtitle: String,
  collection_names: String,
  Status: { type: String, default: 'Inactive' }
},{timestamps:true})

const Hookups = db.model('hookups', Hookupsschema)
export { Hookups }