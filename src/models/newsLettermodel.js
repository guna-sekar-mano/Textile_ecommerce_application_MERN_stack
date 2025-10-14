import mongoose from 'mongoose'
import db from '../config/db.js'

const Newsletterschema = mongoose.Schema({
    Newsletter_email: String,
})

const Newsletter = db.model('Newsletter', Newsletterschema)
export { Newsletter }