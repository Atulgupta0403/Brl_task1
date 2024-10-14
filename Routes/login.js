const express = require("express")
const router = express.Router()

const {loginUser} = require("../Controllers/userController")

router.post("/"  , loginUser)




module.exports = router