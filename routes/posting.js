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
    const TempImage = new tempImage({
        image: null,
        imageType: null,
        imageID: req.body.imageID
    })
    saveImage(tempImage, req.body.files)
    try {
        const response = await tempImage.create(TempImage)
        console.log('Post created successfully: ', response)
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
        photoURL: req.body.photoURL
    })
    saveImage(post, req.body.files)
    try {
        const response = await Post.create(post)
        console.log('Post created successfully: ', response)
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
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
