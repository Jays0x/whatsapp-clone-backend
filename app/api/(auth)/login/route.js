import { connectDB } from "@/util/db";
import { NextResponse } from "next/server";
import User from "@/model/User";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {

        await connectDB();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const comparePasswords = await bcrypt.compare(password, user.password);

        if (!comparePasswords) {
            return NextResponse.json({ error: "Incorrect password. Please check again." }, { status: 401 });
        }

        const tokenKey = process.env.PRIVATE_KEY;
        if (!tokenKey) {
           return NextResponse.json({ error: "Invalid token key" }, { status: 500 });
        }

        const generateToken = jwt.sign({ user: user._id }, tokenKey, { expiresIn: "1h" });

        if (!generateToken) {
            return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
        }

        return NextResponse.json({ 
            message: "Logged in successfully", 
            token: generateToken 
        }, { status: 200 });

    } 
    catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
