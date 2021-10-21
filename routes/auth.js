const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', {scope: ['openid', 'profile', 'email']}))


router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/',
    successRedirect: "http://localhost:3000"})

)

module.exports = router
