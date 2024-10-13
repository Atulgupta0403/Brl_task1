const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()

app.use(cookieParser())

const isLoggedIn = (req,res,next) => {
    const token = req.cookies;
    console.log(" isLoggedIn " ,token)
    // res.send(token)
    next();
}

module.exports = {isLoggedIn}