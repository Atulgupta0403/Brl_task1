const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors({
    origin : "*"
}))

const Notes = require("./Routes/notes")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/" ,(req,res) => {
    res.send("slash page")
})

app.use("/api/notes",Notes);


app.listen(3000);