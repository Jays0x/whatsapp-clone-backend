import { connectDB } from "@/util/db";
import User from "@/model/User";
import { registerUser } from "@/util/email/AccountVerification";
import { NextResponse } from "next/server";


export async function POST(req, res) {

    try {
        connectDB();

        const { email } = await req.json();

        const user = await User.findOne({ email });

        if(!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        if(user.isActive === true) {
            return new NextResponse(JSON.stringify({ message: 'User is already verified' }), { status: 200 });
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
    catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }

};