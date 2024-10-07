// import mongoose from "mongoose";
const mongoose = require("mongoose")

// const mongodb_url = require("../env")

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
    }

}, {timestamps : true})

module.exports =  mongoose.model("note",noteSchema)