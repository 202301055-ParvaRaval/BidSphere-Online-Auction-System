// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "bidsphere.auction@gmail.com",
        pass: "pumv wpgp fdsn ihnl"
    }
});

// export const SendEmail = async ()=> {
//     try {
//         const info = await transporter.sendMail({
//             from: "vasuchadrani1118@gmail.com",
//             to: "anonymous.98256@gmail.com",
//             subject: "Test Email",
//             text: "This is a test email",
//             html: "<h1>This is a test email</h1>"
//         });
//         console.log(info);
//     }catch (error) {
//         console.log("error while sending email", error);
//     }
// }

// SendEmail();

export default transporter;