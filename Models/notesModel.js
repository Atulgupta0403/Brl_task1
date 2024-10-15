const mongoose = require("mongoose")

// mongoose.connect(process.env.MONGODB_URL)  // local
mongoose.connect(process.env.MONGODBATLAS_URL) // mongodb_atlas

const noteSchema = new mongoose.Schema({
    noteId : {
        type : String,
        // unique : true
    },
    title : {
        type : String
    },
    content : {
        type : String
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

}, {timestamps : true})

module.exports =  mongoose.model("Note",noteSchema)