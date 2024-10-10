const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors({
    origin : "*"
}))

const Notes = require("./Routes/notes")
const register = require("./Routes/register")
const login = require("./Routes/login")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/" ,(req,res) => {
    res.send("slash page")
})

app.use("/api/notes",Notes);
app.use("/register",register)
app.use("/login" , login)


app.listen(3000);