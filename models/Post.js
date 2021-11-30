const mongoose = require("mongoose")
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    userinfo: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "UserSchema"},
    description:{type: String, required: true},
    artType:{type: String, required: true},
    createdAt:{type: Date, default: Date.now},
    image:{type: String, required: true},
    imageType:{type: String, required: true}
}, {collection: "posts"})


PostSchema.statics = {

    searchPartial: function(q, filter, callback) {

        return this.find({
            artType: filter,
            $or: [
                { "title": new RegExp(q, "gi") },
                { "description": new RegExp(q, "gi") },
            ]
        }, callback);
    },

    searchFull: function (q,filter,callback) {

        return this.find({
            $text: {$search: q, $caseSensitive: false },artType: filter
        },callback)
    },

    search: function(q,filter,callback) {
        this.searchFull(q, filter,(err, data) => {
            if (err) return callback(err, data);
            if (!err && data.length) return callback(err, data);
            if (!err && data.length === 0) {
                return this.searchPartial(q, filter,callback);
            }
        });
    },
}
const PostModel = mongoose.model("PostSchema", PostSchema)

module.exports = PostModel