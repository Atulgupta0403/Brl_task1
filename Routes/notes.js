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
        
        let user = await userModel.findOne({ username });
        let Id = await notesModel.findOne({ noteId: noteId , userId : user._id });
        console.log("note == " , Id)
        console.log("user == ", user)
        console.log("req.user == ", req.user)
        // console.log(Id)
        if (Id) {
            // console.log(Id)
            res.json("pls enter another id , this id has been selected prviously")
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
            res.json(createNote)
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
        res.json(createdNote);
    }
    else{
        res.json("first login kro you are directed to /login ")
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
            res.json(delNote)
        }
        else{
            res.json(`there is no note with noteId ${noteId}`)
        }
    }
    else{
        res.json("login kro phle you are directed to /login ")
    }
})


// delete All
router.delete("/deleteAll", isLoggedIn , async (req, res) => {
    if(req.user){
        const user = await userModel.findOne({username : req.user.username})
        await notesModel.deleteMany({ userId : user._id })
        res.json("deleted all")
    }
    else{
        res.json("login kro phle you are directed to /login")
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
            res.json(singleData)
        }
        else{
            res.json(`there is no note with noteId = ${noteId} `)
        }
    }
    else{
        res.json("login kro phle you are directed to /login")
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
            res.json(`note not found on noteId ${noteId}`)
        }
        else {
            
            res.json(updatedNote)
        }
    }
    else{
        res.json("not loggedIn")
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
            return res.json(`Note not found on noteId ${noteId}`);
        }
        
        res.json(updatedNote);
    }
    else{
        res.json("not LoggedIn")
    }
})


// Retrive recent note
router.get("/recent" ,isLoggedIn , async (req,res) => {
    if(req.user){
        const user = await userModel.findOne({username : req.user.username})
        const recentData = await notesModel.findOne({userId : user._id }) .sort({createdAt : -1})
        if(recentData){
            res.json(recentData);
        }
        else{
            res.json(`There is no notes`);
        }
    }
    else{
        res.json("you are not loggedIn , you are redirect to /login ");
    }
})


// archive notes
router.patch("/archive" ,isLoggedIn , async (req,res) => {
    if(req.user){
        const noteId = req.query.noteId;
        if(noteId){
            const user = await userModel.findOne({username : req.user.username})
            const note = await notesModel.findOne({noteId : noteId , userId : user._id})
            if(note){
                note.isArchived = true;
                await note.save()
                res.json(note)
            }
            else{
                res.json(`There is no note with noteId = ${noteId} , try anotherOne`);
            }
        }
        else{
            res.json("please provide noteId");
        }
    }
    else{
        res.json("you are not loggedIn , you are redirect to /login ");
    }
})


router.get("/search" ,isLoggedIn , async (req,res) => {
    if(req.user){
        const keyword = req.query.keyword;
        if(keyword){
            const user = await userModel.findOne({username : req.user.username})
            const keywordRegex = new RegExp(keyword, 'i');
            const note = await notesModel.find({userId : user._id , $or : [ {title : {$regex : keywordRegex}} , {content : {$regex : keywordRegex}}]})
            if(note){
                res.json(note)
            }
            else{
                res.json("no notes are found")
            }
        }
        else{
            req.json("please provide some keyword ");
        }
    }
    else{
        res.json("you are not loggedIn , you are redirect to /login ");
    }
})


module.exports = router