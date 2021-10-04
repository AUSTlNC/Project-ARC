// var createError = require('http-errors');
var express = require('express');

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan')
var passport = require('passport');
// const { appendFile } = require('fs');

var app = express();

app.use(passport.initialize());

require('./authenticate');

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login'}), (req, res) => {
    // res.redirect('/dashboard');
    res.end('Logged in!');
})

app.listen(3001, ()=>{
    console.log("Server running on 3001");
});