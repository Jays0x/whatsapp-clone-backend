import nodemailer from "nodemailer";


export function generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

// Function to send an email
export async function sendEmail(email, code) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS, // Use environment variables
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"WhatsApp" <your-email@gmail.com>', // sender address
            to: email, // receiver address
            subject: "Your Verification Code", // Subject line
            text: `Your verification code is: ${code}`, // plain text body
            html: `<p>Your verification code is: <b>${code}</b></p>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Example: Registration function
export async function registerUser(email) {
    const code = generateCode(); // Generate the verification code
    await sendEmail(email, code); // Send the email with the verification code
    console.log("Verification code sent to:", email);
    return code; // Optionally return the code if needed
}