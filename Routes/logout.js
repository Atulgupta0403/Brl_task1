const express = require("express")
const { logout } = require("../Controllers/userController")
const router = express.Router()

router.get("/" , logout)


module.exports = router;