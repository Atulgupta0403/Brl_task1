const express = require("express")
const router = express.Router()

const {loginUser, logout} = require("../Controllers/userController")

const {isLoggedIn} = require("../Middlewares/isLoggedIn")

// router.use(isLoggedIn)
router.post("/"  , loginUser)




module.exports = router