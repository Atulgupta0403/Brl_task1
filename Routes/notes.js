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

router.get("/", isLoggedIn ,  async (req, res) => {
    if(req.user){

        const createdNote = await notesModel.find({});
        res.send(createdNote);
    }
    else{
        res.send("first login kro you are directed to /login ")
    }
})

router.post("/deleteOne/:noteId", isLoggedIn , async (req, res) => {
    if(req.user){
        const { noteId } = req.params;
        await notesModel.findOneAndDelete({ noteId: noteId });
        res.send("deleted")
    }
    else{
        res.send("login kro phle you are directed to /login ")
    }
})

router.get("/deleteAll", isLoggedIn , async (req, res) => {
    if(req.user){
        const user = await userModel.findOne({username : req.user.username})
        await notesModel.deleteMany({})
        res.send("deleted all")
    }
    else{
        res.send("login kro phle you are directed to /login")
    }
})

router.get("/note/:noteId", isLoggedIn , async (req, res) => {
    if(req.user){
        const { noteId } = req.params;
        const user = await userModel.findOne({username : req.user.username})
        console.log(user)
        const singleData = await notesModel.findOne( { noteId: noteId , userId : user._id});
        if(singleData){
            console.log(singleData)
            res.send(singleData)
        }
        else{
            res.send(`there is no noteId `)
        }
    }
    else{
        res.send("login kro phle you are directed to /login")
    }
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