const mongoose = require("mongoose")


const PostSchema = new mongoose.Schema({
    title:      {type: String, required: true},
    description:{type: String, required: true},
    artType:    {type: String, required: true},
    createdAt:  {type: Date, default: Date.now},
    userID:     {type: mongoose.Schema.Types.ObjectId, required: true}
}, {collection: "posts"})

const PostModel = mongoose.model("PostSchema", PostSchema)
module.exports = PostModel