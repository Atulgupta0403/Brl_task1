const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../Models/userModel")

const registerUser = async (req,res) => {
    const {name ,username , password , email} = req.body;

    const data = await userModel.findOne({email});

    if(data){
        res.send("email already exist")
    }
    else{
        const createData = await userModel.create({
            name,
            password,
            email,
            username
        })

        res.send(createData);
    }

}


const loginUser = async (req,res) => {
    const {username , password} = req.body;
    const data = await userModel.findOne({username});
    console.log("data === " , data)

    if(!data){
        res.send(`there is no user with username ${username}`)
    }
    else{
        if(password === data.password){
            const token = jwt.sign({username} , "secret");
            console.log(token)
            res.send("ho gya bhai login")
        }
        else{
            res.send("Your password is incorrect");
        }
    }

}

module.exports = {registerUser,loginUser}