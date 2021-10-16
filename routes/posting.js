const express = require('express')
const router = express.Router()
const Post = require('./../models/Post')
router.get('/')

router.post('/', async (req, res) => {
    const { title, description, artType, photoURL } = req.body
    try {
        const response = await Post.create({title, description, artType, photoURL})
        console.log('Post created successfully: ', response)
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
})


module.exports = router
