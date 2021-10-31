const express = require('express')
const router = express.Router()
const Post = require('./../models/Post')
const User = require('./../models/User')
const tempImage = require('./../models/tempImage')
const validImageTypes = ['image/jpeg', 'image/png']

// get all posts
router.get('/', async (req, res) => {

} )

router.post('/temp', async (req, res) => {
    try {
        console.log('Post recieved: ', res)
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
    
    try {
        const response = await Post.create(post)
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
