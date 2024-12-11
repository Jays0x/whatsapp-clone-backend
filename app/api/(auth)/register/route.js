import User from "@/model/User";
import { connectDB } from "@/util/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerUser } from "@/util/email/AccountVerification";

export async function POST(req, res) {
    try {
        await connectDB();

        const { email, fullName, password } = await req.json();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return new NextResponse(JSON.stringify({ error: "Email already exists" }), { status: 400 });
        }

        // Hash the password using bcrypt
        const hashPassword = await bcrypt.hash(password, 10);

        const verificationCode = await registerUser(email);
        console.log("Verification code sent:", verificationCode);

        if(!verificationCode) {
            console.log("Registration failed:", error);
            return new NextResponse(JSON.stringify({ error: "Failed to send verification code" }), { status: 500 });
        }

        const verificationExpiryDate = new Date();
        verificationExpiryDate.setMinutes(verificationExpiryDate.getMinutes() + 10);

        const newUser = await User.create({ fullName, email, password: hashPassword, verificationCode, verificationExpiryDate });

        return new NextResponse(JSON.stringify({ message: "User created successfully", user: newUser }), { status: 201 });
    } 
    catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
