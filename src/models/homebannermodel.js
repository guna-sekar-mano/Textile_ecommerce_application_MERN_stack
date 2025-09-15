import mongoose from 'mongoose'
import db from '../config/db.js'

const HomeBannerschema = mongoose.Schema({
    Images: [String],
    Banner_Name: String,
    redirect_link: String,
    ProductId: [{type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true}],
    Status: { type: String, default: 'Inactive' }
})
const HomeBanner = db.model('homeBanner', HomeBannerschema)
export { HomeBanner }