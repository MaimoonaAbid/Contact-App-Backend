const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
name: String,
email: String,
phone: String,
gender: String
})
module.exports = mongoose.model("User", UserSchema)
// query for all houses

