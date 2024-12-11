import { connectDB } from "@/util/db";
import { NextResponse } from "next/server";
import User from "@/model/User";

export async function POST(req) {
    try {
        await connectDB();

        const { verificationCode } = await req.json();

        const user = await User.findOne({ verificationCode });

        if (!user) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 404 });
        }

        const isExpired = user.verificationExpiryDate < new Date();
        if (isExpired) {
            return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
        }

        if (user.verificationCode !== verificationCode) {
            return NextResponse.json({ error: "Verification code does not match" }, { status: 400 });
        }

        user.verificationCode = undefined;
        user.verificationExpiryDate = undefined;
        await user.save();

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
