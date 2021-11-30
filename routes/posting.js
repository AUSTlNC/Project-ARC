const express = require('express')
const router = express.Router()
const Post = require('./../models/Post')
const User = require('./../models/User')
const Comment = require('./../models/Comment')
const tempImage = require('./../models/tempImage')
const Mongoose = require('mongoose')
const validImageTypes = ['image/jpeg', 'image/png']

//delete one
router.post('/deleteOnePost', async (req, res) => {
    console.log('delete request:', req.body.postId);
    pId = req.body.postId;
    uId = req.body.userId;
    if (pId !== undefined && uId !== undefined) {
        console.log('delete post');
        var response = {};
        Post.findOneAndDelete({_id: pId}, function (err, data) {
            if (err) {
                response = {"error": true, "delete post": "Error fetching data"};
                return res.json(response)
            }
        });
        Comment.deleteMany({postId: pId}, function (err, data) {
            if (err) {
                response = {"error": true, "delete post": "Error fetching data"};
                return res.json(response)
            }
        });
        User.updateOne({_id: uId}, {$pull: {postID: Mongoose.Types.ObjectId(pId)}}, function (err, data) {
            if (err) {
                response = {"error": true, "delete post": "Error fetching data"};
                return res.json(response)
            }
        });
        response = {"error": false};
        return res.json(response)

    }
})


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
    } catch (error) {
        console.log(JSON.stringify(error))
        throw error
    }
})

router.post('/temp', async (req, res) => {
    try {
        return res.json({status: 'ok', data: 'GOOD'})
    } catch (error) {
        console.log(JSON.stringify(error))
        throw error
    }
})

//fuzzy search
router.get('/fuzzy', async (req, res) => {
    console.log('keyword:', req.query.keyword);
    console.log('filter:', req.query.filter);
    if (req.query.keyword !== undefined) {
        let photography = {};
        let artwork = {};

        Post.search(req.query.keyword, 'photography', function (err, data) {
            if (err) {
                photography = {"error": true, "photography search": "Error fetching data"};
            } else {
                photography = {"error": false, "photography search": data};
                console.log(photography);
            }

        });

        Post.search(req.query.keyword, 'artwork', function (err, data) {
            if (err) {
                artwork = {"error": true, "artwork search": "Error fetching data"};
            } else {
                artwork = {"error": false, "artwork search": data};
                console.log(artwork);
            }

        });
        var response = {'artwork': artwork, 'photography': photography}
        res.json(response);
    }
})

//userId search for my posts
router.get('/myPosts', async (req, res) => {
    console.log('request:', req.query.userId);
    if (req.query.userId !== undefined) {
        console.log('userId');
        var response = {};
        Post.find({userinfo: req.query.userId}, function (err, data) {
            if (err) {
                response = {"error": true, "user posts search": "Error fetching data"};
            } else {
                response = {"error": false, "user posts search": data};
                console.log(response);
            }
            res.json(response);
        });
    }
})

//type search for my posts
router.get('/type', async (req, res) => {
    console.log('request:', req.query.type);
    if (req.query.type !== undefined) {
        console.log('userId');
        var response = {};
        Post.find({artType: req.query.type}, function (err, data) {
            if (err) {
                response = {"error": true, "type search": "Error fetching data"};
            } else {
                response = {"error": false, "type search": data};
                console.log(response);
            }
            res.json(response);
        });
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
        const response = model.save(function (err, saved) {
            if (err) {
                console.log(err)
            }
            var post_id = saved._id
            console.log(post_id)
            User.findOneAndUpdate(
                {_id: userID},
                {$push: {postID: post_id}}, (err, userObj) => {
                    console.log(userObj)
                })
        })
        console.log('Post created successfully: ', response)
    } catch (error) {
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
