const express = require("express")
const router = express.Router();

const notesModel = require("../Models/notesModel");
const userModel = require("../Models/userModel")
const {isLoggedIn} = require("../Middlewares/isLoggedIn")


router.post("/", isLoggedIn , async (req, res) => {

    const { noteId, title, content } = req.body;
    
    if(req.user){
        const {username} = req.user;
        
        let Id = await notesModel.findOne({ noteId: noteId });
        let user = await userModel.findOne({ username });
        console.log(user)
        if (Id) {
            // console.log(Id)
            res.send("pls enter another id , this id has been selected prviously")
        }
        else {
            const createNote = await notesModel.create({
                noteId: noteId,
                content: content,
                title: title
            })
            // console.log(createNote);
            createNote.userId = user._id;  
            res.send(createNote)
        }
    }
    else{
        res.send("pls login kro you are redirected to /login")
    }
    
})

router.get("/", async (req, res) => {
    const createdNote = await notesModel.find({});
    res.send(createdNote);
})

router.post("/deleteOne/:noteId", async (req, res) => {
    const { noteId } = req.params;
    await notesModel.findOneAndDelete({ noteId: noteId });
    res.send("deleted")
})

router.get("/deleteAll", async (req, res) => {
    await notesModel.deleteMany({})
    res.send("deleted all")
})

router.get("/note", async (req, res) => {
    const { noteId } = req.body;
    const singleData = await notesModel.findOne({ noteId: noteId });
    console.log(singleData)
    res.send(singleData)
})


router.put("/put", async (req, res) => {
    const { } = req.body;
    const { noteId, title, content } = req.body;

    const updatedNote = await notesModel.findOneAndUpdate(
        { noteId: noteId },
        { $set: { title: title, content: content } },
        { new: true } // Return the updated document
    );

    if (!updatedNote) {
        res.send(`note not found on noteId ${noteId}`)
    }
    else {

        res.send(updatedNote)
    }
})


router.patch("/patch", async (req, res) => {

    const { noteId, title, content } = req.body;

    const updatedNote = await notesModel.findOneAndUpdate(
        { noteId: noteId },
        { $set: { title, content } },
        { new: true } // Return the updated document
    );

    if (!updatedNote) {
        return res.send(`Note not found on noteId ${noteId}`);
    }

    res.send(updatedNote);
})



router.get("/recent" , async (req,res) => {
    const note = await notesModel.find().sort({createdAt : -1}).limit(1)
    
    console.log(note)
    res.send(note)
})


module.exports = router