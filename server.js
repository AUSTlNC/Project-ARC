const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const User = require('./models/User')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)

const JWT_SECRET = 'asdfjaoiwer987q293rhajksdhfyasdfkh*&^*%'

mongoose.connect("mongodb+srv://austin:caijh20000609@arc-main.ih4xb.mongodb.net/ARCMain?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const store = new MongoDBSession({
    uri:"mongodb+srv://austin:caijh20000609@arc-main.ih4xb.mongodb.net/ARCMain?retryWrites=true&w=majority",
    collection: 'sessions',
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localost:3000"],
    methods:["GET", "POST"],
    credentials:true
}))

// build the session and cookie
app.use(session({
    key: "userID",
    secret: 'key that signs cookie',
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: 1000*60*60,
    },
    store: store,
}))


app.post('/api/change-password', async (req, res) => {
    const {token} = req.body
    const user = jwt.verify(token, JWT_SECRET)

    console.log(user)
    res.json({status: 'ok'})
})


app.post('/api/login', async (req, res) => {

    const { username, password} = req.body
    const user = await User.findOne({username}).lean()


    if (!user){
        return res.json({status: 'error', error: 'Invalid username/password'})
    }

    if (await bcrypt.compare(password, user.password)){

        const token = jwt.sign(
            {
                id: user._id, 
                username: user.username
            }, 
            JWT_SECRET
        )
        //if success login, set auth to true
        req.session.isAuth = true;
        req.session.user = user;
        return res.json({status: 'ok', error: 'GOOD'})
    }

    res.json({status: 'error', error: 'Invalid username/password'})
})

app.get("/api/login",(req,res)=>{
    if(req.session.user){
        res.send({loggedIn: true, user:req.session.user})
    }
    else{
        res.send({loggedIn: false})
    }
})


app.post('/api/register', async (req, res) => {
	console.log(req.body)
    const {username,  password: plainTextPassword } = req.body
    
    if(!username || typeof username !== 'string') {
        return res.json({status: 'error', error: 'Invalid username'})
    }
    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({status: 'error', error: 'Invalid password'})
    }

    if(plainTextPassword.length < 5) {
        return res.json({
            status: 'error', 
            error: 'Password too short'
        })
    }

    const password = await bcrypt.hash(plainTextPassword, 12)
    try {
        const response = await User.create({username, password})
        console.log('User created successfully: ', response)
    } catch(error) {
        console.log(JSON.stringify(error))
        if (error.code === 11000) {
            // duplicate key
            return res.json({status: 'error', error: 'Username already taken'})
        }
        throw error
    }
    
    // console.log(await bcrypt.hash(password, 12))

    res.json({ status: 'ok' })
})

app.listen(9999, () => {
	console.log('Server up at 9999')
})