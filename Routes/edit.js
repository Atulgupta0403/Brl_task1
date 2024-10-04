const express = require("express");
const router = express.Router();
const NotesModel = require("../Models/notesModel")


const getDataByNoteId = (req,res,next) => {
    
}

router.post("/" , async (req , res) => {
    const {noteId} = req.body;
    const data = await NotesModel.findOne({noteId : noteId}) 
    console.log(data)
})

router.get("/" , (req,res) => {
    res.send("data bhejna hai ")
})

module.exports = router