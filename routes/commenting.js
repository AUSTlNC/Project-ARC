const express = require('express');
const Mongoose = require('mongoose');
const router = express.Router()
const Comment = require('./../models/Comment')
router.get('/')

// badwords filter used: https://www.npmjs.com/package/bad-words
var Filter = require('bad-words'),
    swearfilter = new Filter();

// spamfilter used : https://www.npmjs.com/package/spam-filter
const spamfilter = require('spam-filter')('naiveBayes')

router.post('/', async (req, res) => {
    const { userId, postId, comment} = req.body
    if(swearfilter.isProfane(comment)) {
        return res.json({status: 'error', error: 'Profanity detected'})
    }
    if(spamfilter.isSpam(comment)){
        return res.json({status: 'error', error: 'Spam detected'})
    }

    if(comment.length < 10){
        return res.json({status: 'error', error: 'Response too short'})
    }

    try {
        const response = await Comment.create({userId, postId, comment})
        console.log('Comment created successfully: ')
    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
    console.log(comment)
    return res.json({status: 'ok'})
})

router.get('/all', async(req, res) => {
    const {post_id} = req.body
    var tempID = Mongoose.Types.ObjectId(post_id);    
    Comment.find({postId: tempID}, (err, finded)=>{return res.json(finded)})
    
})

//user comment search for commented
router.get('/myComments', async (req, res) => {
        console.log('request:', req.query.userId);
        if (req.query.userId !== undefined) {
            console.log('commented');
            var response = {};
            Comment.find({userinfo : req.query.userId}, function (err, data) {
                if (err) {
                    response = { "error": true, "user comment search": "Error fetching data" };
                } else {
                    response = { "error": false, "user comment search": data };
                    console.log(response);
                }
                res.json(response);
            });
        }
} )



module.exports = router