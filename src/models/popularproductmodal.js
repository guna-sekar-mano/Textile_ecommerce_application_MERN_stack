import mongoose from 'mongoose'
import db from '../config/db.js'

const PopularProductschema = mongoose.Schema({
    ProductId: [{type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true}],
    HighlightedProductId: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
    Status: { type: String, default: 'Inactive' }
})
const Popularproducts = db.model('popular-products', PopularProductschema)
export { Popularproducts }
