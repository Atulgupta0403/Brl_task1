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
    },
    resetPasswordToken : {
        type : String,
        default : null
    },
    resetPasswordExpires : {
        type : Date,
        default : null
    }

})


module.exports = mongoose.model("User",userSchema )