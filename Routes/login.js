const express = require("express")
const router = express.Router()

const {loginUser} = require("../Controllers/userController")

const {isLoggedIn} = require("../Middlewares/isLoggedIn")

// router.use(isLoggedIn)
router.post("/" , isLoggedIn , loginUser)


module.exports = router