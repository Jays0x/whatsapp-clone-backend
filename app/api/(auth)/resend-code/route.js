import User from "@/model/User";
import { connectDB } from "@/util/db";
import { NextResponse } from "next/server";
import { registerUser } from "@/util/email/AccountVerification";

export async function POST(req, res) {
    try{

        await connectDB();

        const { email } = await req.json();

        const user = await User.findOne({ email });

        if(!user){
            return new NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
        }

        const verificationCode = await registerUser(email);
        console.log("Verification code sent:", verificationCode);

        if(!verificationCode) {
            console.log("Registration failed:", error);
            return new NextResponse(JSON.stringify({ error: "Failed to send verification code" }), { status: 500 });
        }

        const verificationExpiryDate = new Date();
        verificationExpiryDate.setMinutes(verificationExpiryDate.getMinutes() + 10);

        user.verificationCode = verificationCode;
        user.verificationExpiryDate = verificationExpiryDate;

        await user.save();

        return new NextResponse(JSON.stringify({ message: 'Verification code sent successfully' }), { status: 200 });
    }
    catch(error){
        return new NextResponse.json({ error: 'Server error' + error }, { status: 500 });
    }
}