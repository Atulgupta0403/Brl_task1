// const nodemailer = require("nodemailer")

// const sendEmail = async (option) => {
//     const transporter = nodemailer.createTransport({
//         service: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             password: process.env.EMAIL_PASSWORD

//         },
//     })
//     const emailOptions = {
//         from: "atul <atul@mail.com>",
//         to: option.email,
//         subject: option.subject,
//         text: option.message
//     }

//     await transporter.sendMail(emailOptions);
// }


const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
const userModel = require("../Models/userModel")
const router = express.Router();

// Mock email transporter setup (for production use a real service like SendGrid or Gmail)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD

    },
});

// Route 1: Send password reset link
router.post('/password/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send('User with this email does not exist.');
        }

        // Generate a token
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000;

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiration;
        await user.save();

        // Send email with the reset link
        const resetLink = `http://localhost:3000/password/reset/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'atul <atul@mail.com>',
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetLink}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions);
        res.status(200).send('Password reset link sent to your email.');

    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Route 2: Reset password using token
router.post('/password/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;

    try {
        // const user = await userModel.findOne({
        //     resetPasswordToken: token,
        //     // resetPasswordExpires: { $gt: Date.now() }
        // });

        const user = await userModel.findOne({resetPasswordToken : token})
        console.log(user);
        
        // console.log('Token in DB:', user.resetPasswordToken);
        console.log('Token in URL:', token);
        // console.log('Expiration:', user.resetPasswordExpires, 'Current Time:', Date.now());


        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password and save
        // const hashedPassword = bcrypt.hash(new_password, 10);
        // user.password = hashedPassword;
        user.password = new_password;
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send('Password has been reset successfully.');

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error');
    }
});

module.exports = router;


