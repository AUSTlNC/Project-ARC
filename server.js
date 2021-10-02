const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs')


mongoose.connect("mongodb+srv://austin:caijh20000609@arc-main.ih4xb.mongodb.net/ARCMain?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
bcrypt

app.post('/api/register', async (req, res) => {
	console.log(req.body)
    const {username,  password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword, 12)
    
    try {
        const response = await User.create({username, password})
        console.log('User created successfully: ', response)
    } catch(error) {
        console.log(error)
        return res.json({status: 'error'})
    }
    
    // console.log(await bcrypt.hash(password, 12))
	
    
    res.json({ status: 'ok' })
})

app.listen(9999, () => {
	console.log('Server up at 9999')
})