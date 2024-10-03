const express = require("express")
const app = express()

const Notes = require("./Routes/notes")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/" ,(req,res) => {
    res.send("slash page")
})

app.use("/notes",Notes);


app.listen(3000);