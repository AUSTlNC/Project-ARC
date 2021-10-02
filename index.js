const express = require("express");
const mongoose = require("mongoose");
const app = express();

const UserModel = require("./models/User");
app.use(express.json());

mongoose.connect("mongodb+srv://austin:caijh20000609@arc-main.ih4xb.mongodb.net/ARCMain?retryWrites=true&w=majority", {
    useNewUrlParser: true,
});

app.get("/", async (req, res)=>{
    const user = new UserModel({email:"test@123.com", password:"test123"});

    try{
        await user.save();
        console.log(user);
        res.send("user created");

    } catch(err){
        console.log(err);
    }

});

app.listen(3001, ()=>{
    console.log("Server running on 3001");
});