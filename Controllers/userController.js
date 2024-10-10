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

module.exports = {registerUser}