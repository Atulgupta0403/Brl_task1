// import mongoose from "mongoose";
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/BRLtask1")

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