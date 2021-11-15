const express = require('express')
const router = express.Router()
const Post = require('./../models/Post')
const User = require('./../models/User')
const tempImage = require('./../models/tempImage')

const validImageTypes = ['image/jpeg', 'image/png']



// get all posts
router.post('/all', async (req, res) => {
    console.log("yes!!!")
    let query = Post.find()
    if (req.query.filter != null && req.query.filter != '') {
        query = query.regex('filter', new RegExp(req.query.filter, 'i'))
    }
    try {
        const posts = await query.exec()
        console.log('Posts： ', posts)
        return res.json(posts)
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
} )
//one keyword search
//db.Post.createIndex( { title: "text", description: "text" } )
router.get('/keyword', async (req, res) => {
        console.log('request:', req.query.keyword);
        if (req.query.keyword !== undefined) {
            console.log('keyword');
            var response = {};
            Post.find({title : {$regex : req.query.keyword.toLowerCase()}}, function (err, data) {
                if (err) {
                    response = { "error": true, "keyword search": "Error fetching data" };
                } else {
                    response = { "error": false, "keyword search": data };
                    console.log(response);
                }
                res.json(response);
            });
        }
} )

//more than one keyword search
router.get('/keywords', async (req, res) => {
        console.log('request:', req.query.keyword);
        if (req.query.keyword !== undefined) {
            console.log('keywords');
            var response = {};
            Post.find({$text : {$search: req.query.keyword.toLowerCase()}}, function (err, data) {
                if (err) {
                    response = { "error": true, "keywords search": "Error fetching data" };
                } else {
                    response = { "error": false, "keywords search": data };
                    console.log(response);
                }
                res.json(response);
            });
        }
} )

//fuzzy search
router.post('/fuzzy', async (req, res) => {
        console.log('request:', req.body);
        if (req.body.keyword !== undefined) {
            console.log('fuzzy');
            var response = {};
            Post.fuzzySearch(req.body.keyword, function (err, data) {
                if (err) {
                    response = { "error": true, "fuzzy search": "Error fetching data" };
                } else {
                    response = { "error": false, "fuzzy search": data };
                    console.log(response);
                }
                res.json(response);
            });
        }
} )

//userId search for my posts
router.get('/myPosts', async (req, res) => {
        console.log('request:', req.query.userId);
        if (req.query.userId !== undefined) {
            console.log('userId');
            var response = {};
            Post.find({userinfo : req.query.userId}, function (err, data) {
                if (err) {
                    response = { "error": true, "user posts search": "Error fetching data" };
                } else {
                    response = { "error": false, "user posts search": data };
                    console.log(response);
                }
                res.json(response);
            });
        }
} )

//type search for my posts
router.get('/type', async (req, res) => {
    console.log('request:', req.query.type);
    if (req.query.type !== undefined) {
        console.log('userId');
        var response = {};
        Post.find({artType : req.query.type}, function (err, data) {
            if (err) {
                response = { "error": true, "type search": "Error fetching data" };
            } else {
                response = { "error": false, "type search": data };
                console.log(response);
            }
            res.json(response);
        });
    }
} )


router.post('/temp', async (req, res) => {
    try {
        return res.json({status: 'ok', data: 'GOOD'})
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
})


router.post('/', async (req, res) => {
    const post = new Post({
        userinfo: req.body.userinfo,
        title: req.body.title, 
        description: req.body.description, 
        artType: req.body.artType,
        image: req.body.image,
        imageType: req.body.imageType
    })
    var userID = req.body.userinfo
    try {
        let model = post
        const response = model.save(function(err, saved){
            if(err){console.log(err)}
            var post_id = saved._id
            console.log(post_id)
            User.findOneAndUpdate(
                {_id: userID},
                {$push:{postID:post_id}}, (err, userObj)=>{
                    console.log(userObj)
                })
        })
        console.log('Post created successfully: ', response)
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
    // try {
    //     const response = await User.updateOne(
    //         { _id: req.body.userinfo },
    //         { $set: { posts: [] } },
    //         { upsert: true } // Make this update into an upsert
    //     );
    // } catch(error) {
    //     console.log(JSON.stringify(error))
    //     throw error
    // }
})


function saveImage(post, imageEncoded) {
    if (imageEncoded == null) return
    const img = JSON.parse(imageEncoded)
    if (img != null && validImageTypes.includes(img.type)) {
        post.image = new Buffer.from(img.data, 'base64')
        post.imageType = img.type
    }
}

module.exports = router
