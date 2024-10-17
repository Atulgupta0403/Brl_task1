const jwt = require("jsonwebtoken")


const isLoggedIn = (req,res,next) => {
    const token = req.cookies.token;
    if(token){
        const data = jwt.verify(token , process.env.SECRET)
        req.user = data
        // console.log(data)
        // console.log(token)
    }
    // else{
    //     next();
    // }
    next();
}

module.exports = {isLoggedIn}