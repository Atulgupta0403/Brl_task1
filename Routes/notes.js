const express = require("express")
const router = express.Router();
// const NotesModel = require("../Models/notesModel");
const notesModel = require("../Models/notesModel");


router.post("/" , async (req,res) => {
    const { noteId,  title , content } = req.body;

    const createNote = await notesModel.create({
        noteId : noteId,
        content : content,
        title : title
    })
    
    console.log(createNote);
    res.send(createNote)

})

router.get("/notes" ,async (req,res) => {
    const createdNote = await notesModel.find();
    res.send(createdNote);
})

module.exports = router