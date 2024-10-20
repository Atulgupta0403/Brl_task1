const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require("../Models/userModel")
const router = express.Router();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD

    },
});

// Send password reset link
router.post('/password/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send('User with this email does not exist.');
        }

        
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

//  Reset password using token
router.post('/password/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;

    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        
        console.log(user);
        // console.log('Token in DB:', user.resetPasswordToken);
        console.log('Token in URL:', token);
        // console.log('Expiration:', user.resetPasswordExpires, 'Current Time:', Date.now());


        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        
        user.password = new_password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send('Password has been reset successfully.');

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error');
    }
});

module.exports = router;


