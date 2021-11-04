const express = require('express')
const router = express.Router()
const Post = require('./../models/Post')
const mongoose = require("mongoose")
const User = require("./../models/User")
const ObjectID = require('mongodb').ObjectID

router.get('/')

router.post('/', async (req, res) => {
    const { title, description, artType, userinfo} = req.body
    var userID = userinfo._id
    try {
        let model = new Post({title, description, artType, userID})
        model.save(function(err, saved){
            if(err){console.log(err)}
            var post_id = saved._id
            console.log(post_id)

            User.findOneAndUpdate(
                {_id: userID},
                {$push:{postID:post_id}}, (err, userObj)=>{
                })

        })


        

    } catch(error) {
        console.log(JSON.stringify(error))
        throw error
    }
})


module.exports = router
