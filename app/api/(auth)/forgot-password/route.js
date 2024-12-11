import { NextResponse } from "next/server";
import { registerUser } from "@/util/email/AccountVerification";
import User from "@/model/User";

export async function POST(req) {
    try {
        const { email } = await req.json();

        // Check if user already exists
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User does not exist. Please register first." }, { status: 404 });
        }


        const verificationCode = await registerUser(email);
        console.log("Verification code sent:", verificationCode);

        if (!verificationCode) {
            return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
        }

        const verificationExpiryDate = new Date();
        verificationExpiryDate.setMinutes(verificationExpiryDate.getMinutes() + 10);

        user.verificationCode = verificationCode;
        user.verificationExpiryDate = verificationExpiryDate;

        await user.save();

        return NextResponse.json({ message: "Verification code sent successfully", email }, { status: 200 });
        
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
