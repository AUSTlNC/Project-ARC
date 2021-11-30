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

// PostSchema.plugin(mongoose_fuzzy_searching, { fields: [{name:'title',weight: 5,escapeSpecialCharacters: true},
//         {name:'description',weight:2,escapeSpecialCharacters: true}] });
PostSchema.statics = {
    searchPartial: function(q, callback) {
        //var artwork={}
        // var artwork= this.find({
        //     artType: 'artwork',
        //     $or: [
        //         { "title": new RegExp(q, "gi") },
        //         { "description": new RegExp(q, "gi") },
        //
        //     ]}, callback);
        // //var photography={}
        // var photography= this.find({
        //     artType: 'photography',
        //     $or: [
        //         { "title": new RegExp(q, "gi") },
        //         { "description": new RegExp(q, "gi") },
        //     ]
        // }, callback);
        console.log("partial")
        // console.log(photography)
        // //var photography
        // return photography;
        return this.find({
            artType: 'photography',
            $or: [
                { "title": new RegExp(q, "gi") },
                { "description": new RegExp(q, "gi") },
                //{ "title_fuzzy": new RegExp(q, "gi") },
                //{ "description_fuzzy": new RegExp(q, "gi") },
            ]
        }, callback);
    },

    searchFull: function (q, callback) {
        console.log("full");
        // return this.find({
        //     artType: 'photography',
        //     $or: [
        //         { "title": new RegExp(q, "gi") },
        //         { "description": new RegExp(q, "gi") },
        //         { "title_fuzzy": new RegExp(q, "gi") },
        //         { "description_fuzzy": new RegExp(q, "gi") },
        //     ]
        // }, callback);
        // console.log("full")
        var artwork=this.find({
            $text: {$search: q, $caseSensitive: false },artType: 'artwork'
        },callback)
        var photography=this.find({
            $text: { $search: q, $caseSensitive: false },artType: 'photography'
        }, callback)
        // // // var response=[];
        // // // {"artwork":artwork,"photography":photography}
        // var data={"artwork":artwork,"photography":photography}
        // return data;
        // var response={}
        // response["artwork"]=[];
        // response["artwork"].push(artwork);
        return photography;
    },

    search: function(q,callback) {
        this.searchFull(q, (err, data) => {
            if (err) return callback(err, data);
            if (!err && data.length) return callback(err, data);
            if (!err && data.length === 0) {
                //console.log("partial xxxxx");
                // let {artwork,photography}=this.searchPartial(q, callback);
                // // let {artwork2,photography2}=this.fuzzy(q);
                // // var artwork=artwork1.concat(artwork2);
                // // var photography=photography1.concat(photography2);
                // var response={artwork:artwork,photography:photography}
                return this.searchPartial(q, callback);;
            }
        });
    },
}
const PostModel = mongoose.model("PostSchema", PostSchema)

module.exports = PostModel