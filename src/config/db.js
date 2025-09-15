import mongoose from "mongoose";

const db = mongoose.createConnection("mongodb://0.0.0.0:27017/ExtremeCulture");
db.once('open', () => console.log("Database successfully connected"));
db.on('error', (err) => console.log(`Database not connected: ${err.message}`));

export default db;