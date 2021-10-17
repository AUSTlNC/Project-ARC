const express = require('express')
const router = express.Router()
const Comment = require('./../models/Comment')
router.get('/')

router.post('/', async (req, res) => {
    const { userId, postId, comment} = req.body
    try {
        const response = await Comment.create({userId, postId, comment})
        console.log('Comment created successfully: ', response)
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
})


module.exports = router
