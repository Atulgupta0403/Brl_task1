// import mongoose from "mongoose";
const mongoose = require("mongoose")

require("dotenv").config()
// console.log(process.env.MONGODB_URL)
mongoose.connect("mongodb://localhost:27017/BRL1")
// mongoose.connect("mongodb+srv://atulgupta0403:Atul2004@cluster0.r71it.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

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
        
    }

}, {timestamps : true})

module.exports =  mongoose.model("Note",noteSchema)