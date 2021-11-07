const mongoose = require("mongoose")


const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    userinfo: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "UserSchema"},
    description:{type: String, required: true},
    artType:{type: String, required: true},
    createdAt:{type: Date, default: Date.now},
    image:{type: String, required: true},
    imageType:{type: String, required: true}
}, {collection: "posts"})

const PostModel = mongoose.model("PostSchema", PostSchema)
module.exports = PostModel