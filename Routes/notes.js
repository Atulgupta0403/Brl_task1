const express = require("express")
const router = express.Router();

const notesModel = require("../Models/notesModel");


router.post("/" , async (req,res) => {
    const { noteId,  title , content } = req.body;

    let Id = await notesModel.findOne({noteId : noteId});
    if(Id){
        // console.log(Id)
        res.send("pls enter another id , this id has been selected prviously")
    }
    else{
        const createNote = await notesModel.create({
            noteId : noteId,
            content : content,
            title : title
        })
        
        console.log(createNote);
        res.send(createNote)
    }

    

})

router.get("/" ,async (req,res) => {
    const createdNote = await notesModel.find();
    res.send(createdNote);
})

router.post("/delete" , async (req,res) => {
    const {noteId} = req.body ;
    console.log(req.body)
    console.log(noteId)
    await notesModel.findOneAndDelete({noteId : noteId});
    res.send("deleted")
})




module.exports = router