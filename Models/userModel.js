const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    username : {
        type : String
    },
    password : {
        type : String,
    },
    email : {
        type : String
    },
    notesId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Note"
    }

})


module.exports = mongoose.model("User",userSchema )