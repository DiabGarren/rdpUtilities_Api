/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from 'nodemailer';


export default function newMail(req, res) {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.GMAIL,
        to: req.body.email,
        subject: 'Password reset for rdpUtilites',
        // text: `This is a reset password request for ${req.body.user}. Please click on the link below to reset your password. https://www.diabgarren.github.io/rdpUtilites/reset/?id=${req.params.id}`
        html: `<h1>This is a password reset request for rdpUtilities, requested by: ${req.body.user}.</h1><h2>Please click on the link below to reset your password.</h2><a href="https://diabgarren.github.io/rdpUtilities/reset/?id=${req.body.id}" style="
        display: block;
        width: 350px;
        margin: 0 auto;
        padding: 5px;
        font-size: 18px;
        border-radius: 5px;
        background-color: #00799F;
        color: white;
        text-decoration: none;
        text-align: center;
        ">Reset Password</a>`
        
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error occured sending email' });
        } else {
            console.log(`Email sent: ${info.response}`);
            res.status(201).json(info.response);
        }
    });
}