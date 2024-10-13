const jwt = require("jsonwebtoken")


const isLoggedIn = (req,res,next) => {
    const token = req.cookies.token;
    const data = jwt.verify(token , "secret")
    req.user = data
    next();
}

module.exports = {isLoggedIn}