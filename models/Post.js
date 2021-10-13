const mongoose = require("mongoose")


const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description:{type: String, required: true},
    artType:{type: String, required: true},
    photoURL:{type: String, required: true},
    createdAt:{type: Date, default: Date.now}
}, {collection: "posts"})

const PostModel = mongoose.model("PostSchema", PostSchema)
module.exports = PostModel