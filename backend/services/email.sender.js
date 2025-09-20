import transporter  from "./email.transporter.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./email.template.js";


const SendVerificationCode = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: "bidsphere.auction@gmail.com",
            to: email,
            subject: "Verify your Email, Welcome to BidSphere",
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
        });

        console.log("Email send successfully", response);
    } catch (error) {
        console.log("catch error")
    }
}

const WelcomeEmail = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: "bidsphere.auction@gmail.com",
            to: email,
            subject: "Welcome to BidSphere",
            html:  Welcome_Email_Template.replace("{name}", name)
        });

        console.log("Email send successfully", response);
    } catch (error) {
        console.log("catch error")
    }
}


export { SendVerificationCode, WelcomeEmail }