const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    email: String,
    password:String
}, {collection: "users"});

const User = mongoose.model("UserData", UserSchema);
module.exports = User;