const express = require('express')
const router = express.Router()
const Comment = require('./../models/Comment')
router.get('/')

router.post('/', async (req, res) => {
    const { userId, postId, comment} = req.body
    if(comment.length<15) {
        return res.json({status: 'error', error: 'Comment too short'})
    }
    try {
        const response = await Comment.create({userId, postId, comment})
        console.log('Comment created successfully: ', response)
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
    console.log(comment)
    res.json({status: 'ok'})
})


module.exports = router
