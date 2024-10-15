const express = require("express")
const router = express.Router();

const notesModel = require("../Models/notesModel");
const userModel = require("../Models/userModel")
const {isLoggedIn} = require("../Middlewares/isLoggedIn")


// making note
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
                title: title,
                userId : user._id
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


// read all note
router.get("/", isLoggedIn ,  async (req, res) => {
    if(req.user){
        const user = await userModel.findOne({username : req.user.username})
        const createdNote = await notesModel.find({ userId : user._id});
        res.send(createdNote);
    }
    else{
        res.send("first login kro you are directed to /login ")
    }
})


// delete One
router.delete("/deleteOne", isLoggedIn , async (req, res) => {
    if(req.user){
        const noteId = req.query.noteId;
        const delNote = await notesModel.findOne({ noteId: noteId });
        console.log("delnote == " , delNote)
        if(delNote){
            await notesModel.findOneAndDelete({noteId : noteId})
            res.send(delNote)
        }
        else{
            res.send(`there is no note with noteId ${noteId}`)
        }
    }
    else{
        res.send("login kro phle you are directed to /login ")
    }
})


// delete All
router.delete("/deleteAll", isLoggedIn , async (req, res) => {
    if(req.user){
        const user = await userModel.findOne({username : req.user.username})
        await notesModel.deleteMany({ userId : user._id })
        res.send("deleted all")
    }
    else{
        res.send("login kro phle you are directed to /login")
    }
})


// read single data
router.get("/note", isLoggedIn , async (req, res) => {
    if(req.user){
        const noteId  = req.query.noteId;
        const user = await userModel.findOne({username : req.user.username})
        console.log(user)
        const singleData = await notesModel.findOne( { noteId: noteId , userId : user._id});
        if(singleData){
            // console.log(singleData)
            res.send(singleData)
        }
        else{
            res.send(`there is no note with noteId = ${noteId} `)
        }
    }
    else{
        res.send("login kro phle you are directed to /login")
    }
})


// put 
router.put("/put", isLoggedIn , async (req, res) => {
    if(req.user){

        const { noteId, title, content } = req.body;
        
        const updatedNote = await notesModel.findOneAndUpdate(
            { noteId: noteId },
            { $set: { title: title, content: content }},
            { new: true } // Return the updated document
        );
        
        if (!updatedNote) {
            res.send(`note not found on noteId ${noteId}`)
        }
        else {
            
            res.send(updatedNote)
        }
    }
    else{
        res.send("not loggedIn")
    }
})


// patch
router.patch("/patch", isLoggedIn , async (req, res) => {
    if(req.user){
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
    }
    else{
        res.send("not LoggedIn")
    }
})



router.get("/recent" , async (req,res) => {
    const note = await notesModel.find().sort({createdAt : -1}).limit(1)    
    console.log(note)
    res.send(note)
})


module.exports = router